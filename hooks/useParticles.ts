'use client';

/**
 * useParticles.ts
 * ---------------
 * Talamus-Inspired Fluid Particle System
 *
 * UNIFIED SCENE LOGIC:
 *   - Continuous, multi-layered "atmospheric" drift on ALL particles at all times.
 *   - Particles have significantly varied sizes (0.2px to 4px) using non-linear distribution.
 *   - Transitions between CONVERGE, FLOAT, and DISPERSE are eased using a weight system
 *     to prevent any "stopping" or "stiffness".
 *
 * RENDERING:
 *   - Sharp, sub-pixel dots on a high-DPI canvas.
 */

import { useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnimationPhase = 'CONVERGING' | 'FLOATING' | 'DISPERSING' | 'RESETTING';

interface Particle {
    x: number;
    y: number;
    z: number; // 0 (far) to 1 (near)

    // Targets / Origins
    targetX: number;
    targetY: number;
    targetZ: number;

    originX: number;
    originY: number;
    originZ: number;

    // Velocity for dispersal
    vx: number;
    vy: number;

    // Visuals
    size: number;      // Base radius
    opacity: number;
    isCore: boolean;   // Gold core particle
    clusterIdx: number;

    // Noise / Drift State
    noiseOff: number;  // Seed for motion
    noiseSpeed: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNT = 3500; // Increased volume for ultra-premium density
const CLUSTER_SPREAD = 180;
const CORE_SPREAD = 45;
const TRANSITION_DURATION = {
    CONVERGING: 9000,
    FLOATING: 6500,
    DISPERSING: 8500,
    RESETTING: 1200,
};

const Z_MIN_RADIUS = 0.25;
const Z_MAX_RADIUS = 3.5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
    const particlesRef = useRef<Particle[]>([]);
    const phaseRef = useRef<AnimationPhase>('CONVERGING');
    const phaseStartRef = useRef<number>(0);
    const rafRef = useRef<number>(0);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    const initParticles = useCallback((w: number, h: number) => {
        const particles: Particle[] = [];
        const centers = [
            { x: w * 0.55, y: h * 0.45 }, // Shifted slightly left/centered
            { x: w * 0.65, y: h * 0.55 }
        ];

        for (let i = 0; i < COUNT; i++) {
            const clusterIdx = Math.random() > 0.5 ? 0 : 1;
            const center = centers[clusterIdx];
            const isCore = Math.random() < 0.2;

            // Varied size distribution: lots of tiny ones, few big ones
            const sizeSeed = Math.pow(Math.random(), 3); // Weight towards smaller
            const size = lerp(0.5, 1.8, sizeSeed);

            // Target in cluster
            const angle = Math.random() * Math.PI * 2;
            const dist = isCore
                ? Math.random() * CORE_SPREAD
                : Math.random() * CLUSTER_SPREAD * (Math.random() > 0.8 ? 1.8 : 1.0); // Outliers

            const tx = center.x + Math.cos(angle) * dist;
            const ty = center.y + Math.sin(angle) * dist;
            const tz = lerp(0.01, 0.3, Math.random()); // Even further "back" in depth

            // Spawn / Origin (coming from front/edges)
            const edge = Math.floor(Math.random() * 4);
            let sx, sy;
            if (edge === 0) { sx = Math.random() * w; sy = -100; }
            else if (edge === 1) { sx = w + 100; sy = Math.random() * h; }
            else if (edge === 2) { sx = Math.random() * w; sy = h + 100; }
            else { sx = -100; sy = Math.random() * h; }

            // Spawning depth: start EXTREMELY close to viewer for "front" entry
            const sz = 0.95 + Math.random() * 0.05;

            // Dispersal velocity
            const dAngle = Math.random() * Math.PI * 2;
            const dMag = 2 + Math.random() * 4;

            particles.push({
                x: sx, y: sy, z: sz,
                targetX: tx, targetY: ty, targetZ: tz,
                originX: sx, originY: sy, originZ: sz,
                vx: Math.cos(dAngle) * dMag,
                vy: Math.sin(dAngle) * dMag,
                size,
                opacity: 0,
                isCore,
                clusterIdx,
                noiseOff: Math.random() * 1000,
                noiseSpeed: 0.1 + Math.random() * 0.3
            });
        }
        particlesRef.current = particles;
    }, []);

    const update = useCallback((time: number, w: number, h: number) => {
        if (!phaseStartRef.current) phaseStartRef.current = time;
        const elapsed = time - phaseStartRef.current;

        let phase = phaseRef.current;
        let duration = TRANSITION_DURATION[phase];

        if (elapsed > duration) {
            if (phase === 'CONVERGING') phaseRef.current = 'FLOATING';
            else if (phase === 'FLOATING') phaseRef.current = 'DISPERSING';
            else if (phase === 'DISPERSING') phaseRef.current = 'RESETTING';
            else {
                phaseRef.current = 'CONVERGING';
                // Reset origin/targets for next loop
                initParticles(w, h);
            }
            phaseStartRef.current = time;
            phase = phaseRef.current;
            duration = TRANSITION_DURATION[phase];
        }

        const t = Math.min(elapsed / duration, 1);
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        for (const p of particlesRef.current) {
            // 1. Unified Background Drift (Layered Sines)
            const driftTime = time * 0.0005 * p.noiseSpeed;
            const driftX = Math.sin(p.noiseOff + driftTime) * 15 + Math.cos(p.noiseOff * 0.5 + driftTime * 1.5) * 5;
            const driftY = Math.cos(p.noiseOff + driftTime * 0.8) * 15 + Math.sin(p.noiseOff * 0.3 + driftTime * 1.2) * 5;

            if (phase === 'CONVERGING') {
                const ease = easeInOutCubic(t);
                p.x = lerp(p.originX, p.targetX, ease) + driftX;
                p.y = lerp(p.originY, p.targetY, ease) + driftY;
                p.z = lerp(p.originZ, p.targetZ, ease);
                p.opacity = Math.min(t * 2, 1);
            }
            else if (phase === 'FLOATING') {
                // Particles slowly orbit their cluster center while drifting
                const orbitSpeed = 0.00015; // Slightly slower orbit
                const centers = [{ x: w * 0.55, y: h * 0.45 }, { x: w * 0.65, y: h * 0.55 }];
                const center = centers[p.clusterIdx];

                const dx = p.targetX - center.x;
                const dy = p.targetY - center.y;
                const r = Math.sqrt(dx * dx + dy * dy);
                const curAngle = Math.atan2(dy, dx);
                const newAngle = curAngle + orbitSpeed * time;

                const orbitX = center.x + Math.cos(newAngle) * r;
                const orbitY = center.y + Math.sin(newAngle) * r;

                p.x = lerp(p.x, orbitX + driftX, 0.02);
                p.y = lerp(p.y, orbitY + driftY, 0.02);
                p.z = lerp(p.z, p.targetZ + Math.sin(p.noiseOff + time * 0.001) * 0.05, 0.02);
                p.opacity = 0.8 + Math.sin(p.noiseOff + time * 0.002) * 0.2;
            }
            else if (phase === 'DISPERSING') {
                const ease = easeInOutCubic(t);
                const accel = 1 + t * 4;
                p.x += p.vx * accel + driftX * 0.2;
                p.y += p.vy * accel + driftY * 0.2;
                p.z = lerp(p.targetZ, 1.2, ease); // Zoom into front
                p.opacity = Math.max(0, 1 - t * 1.5);
            }
            else if (phase === 'RESETTING') {
                p.opacity = 0;
            }

            // Mouse Interaction
            const mdx = p.x - mx;
            const mdy = p.y - my;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 150) {
                const force = (1 - mdist / 150) * 0.05;
                p.x += mdx * force;
                p.y += mdy * force;
            }
        }
    }, [initParticles]);

    const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.clearRect(0, 0, w, h);

        // Painter's algorithm: sort by depth
        const sorted = [...particlesRef.current].sort((a, b) => a.z - b.z);

        for (const p of sorted) {
            if (p.opacity <= 0) continue;

            const r = p.size * (Z_MIN_RADIUS + (Z_MAX_RADIUS - Z_MIN_RADIUS) * p.z);

            if (p.isCore) {
                // Glowing Gold Core
                const glow = r * 5;
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
                grad.addColorStop(0, `rgba(255, 230, 100, ${p.opacity * 0.5})`);
                grad.addColorStop(0.5, `rgba(255, 140, 20, ${p.opacity * 0.1})`);
                grad.addColorStop(1, 'rgba(255, 140, 20, 0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(255, 255, 220, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Sharp White Particle
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }, []);

    const animate = useCallback((time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        update(time, canvas.width, canvas.height);
        draw(ctx, canvas.width, canvas.height);
        rafRef.current = requestAnimationFrame(animate);
    }, [update, draw, canvasRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);
            initParticles(canvas.clientWidth, canvas.clientHeight);
        };

        window.addEventListener('resize', resize);
        resize();

        rafRef.current = requestAnimationFrame(animate);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [animate, initParticles, canvasRef]);

    return { phase: phaseRef.current };
}

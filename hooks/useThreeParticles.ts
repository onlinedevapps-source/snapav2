'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/**
 * useThreeParticles.ts
 * -------------------
 * GPU-Accelerated Particle System using Three.js and custom GLSL Shaders.
 * 
 * CORE FEATURES:
 * - 5,000 particles using BufferGeometry.
 * - Vertex shader handles state interpolation (Sphere -> Organic Field).
 * - Simplex Noise (GLSL) driven atmospheric drift.
 * - Fragment shader renders sharp, soft-edged dots.
 * - Dynamic mouse interaction via uniforms.
 */

const PARTICLE_COUNT = 6000;

// GLSL Vertex Shader
const vertexShader = `
  uniform float uTime;
  uniform float uTransition;
  uniform vec2 uMouse;
  
  attribute float aSize;
  attribute vec3 aTarget;
  attribute float aRandom;
  
  varying float vOpacity;
  varying vec3 vColor;

  // Simplex 3D Noise by Ian McEwan, Ashima Arts.
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    float t = uTransition;
    
    // Cubic easing for transition
    float easedT = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    
    // Interpolate position
    vec3 pos = mix(position, aTarget, easedT);
    
    // Atmospheric noise
    float noise = snoise(pos * 0.005 + uTime * 0.2) * 50.0;
    pos += noise * (1.0 - easedT * 0.5); // More noise when clustered
    
    // Mouse response
    float dist = distance(pos.xy, uMouse * 500.0);
    if (dist < 200.0) {
      float attract = (1.0 - dist / 200.0) * 15.0;
      pos.xy += (uMouse * 500.0 - pos.xy) * attract * (1.0 - easedT * 0.8);
    }

    // Perspective depth
    pos.z += sin(uTime * 0.5 + aRandom * 10.0) * 20.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (500.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    vOpacity = mix(0.1, 1.0, 1.0 - easedT * 0.5);
    
    // Talamus colors (White to Gold)
    vec3 gold = vec3(1.0, 0.84, 0.0);
    vec3 white = vec3(1.0, 1.0, 1.0);
    vColor = mix(white, gold, step(0.8, aRandom));
  }
`;

// GLSL Fragment Shader
const fragmentShader = `
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.4, dist) * vOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function useThreeParticles(containerRef: React.RefObject<HTMLDivElement>) {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const rafRef = useRef<number>(0);
    const transitionRef = useRef<number>(0);
    const transitionDirRef = useRef<number>(1);
    const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-9999, -9999));

    const init = useCallback(() => {
        if (!containerRef.current) return;

        // SCENE
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // CAMERA
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 2000);
        camera.position.z = 800;
        cameraRef.current = camera;

        // RENDERER
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // GEOMETRY
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const targets = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);
        const randoms = new Float32Array(PARTICLE_COUNT);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Clustered sphere positions
            const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
            const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
            const r = 100 + Math.random() * 50;

            positions[i * 3] = r * Math.cos(theta) * Math.sin(phi) + Math.random() * 20;
            positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi) + Math.random() * 20;
            positions[i * 3 + 2] = r * Math.cos(phi) + Math.random() * 20;

            // Dispersed targets
            targets[i * 3] = (Math.random() - 0.5) * 2000;
            targets[i * 3 + 1] = (Math.random() - 0.5) * 1200;
            targets[i * 3 + 2] = (Math.random() - 0.5) * 800;

            sizes[i] = 2.0 + Math.random() * 8.0;
            randoms[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        // MATERIAL
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTransition: { value: 0 },
                uMouse: { value: mouseRef.current },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        materialRef.current = material;

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Resize listener
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Mouse listener
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouseRef.current.set(x, y);
        };
        window.addEventListener('mousemove', handleMouseMove);

        // ANIMATION
        const animate = (time: number) => {
            if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !materialRef.current) return;

            const t = time * 0.001;
            materialRef.current.uniforms.uTime.value = t;

            // Smooth state transition
            transitionRef.current += 0.002 * transitionDirRef.current;
            if (transitionRef.current >= 1.0) {
                transitionRef.current = 1.0;
                setTimeout(() => { if (transitionDirRef.current === 1) transitionDirRef.current = -1; }, 2000);
            } else if (transitionRef.current <= 0) {
                transitionRef.current = 0;
                setTimeout(() => { if (transitionDirRef.current === -1) transitionDirRef.current = 1; }, 2000);
            }

            materialRef.current.uniforms.uTransition.value = transitionRef.current;

            rendererRef.current.render(sceneRef.current, cameraRef.current);
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafRef.current);
            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, [containerRef]);

    useEffect(() => {
        const cleanup = init();
        return cleanup;
    }, [init]);
}

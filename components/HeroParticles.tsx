'use client';

import React, { useRef } from 'react';
import { useThreeParticles } from '@/hooks/useThreeParticles';

/**
 * HeroParticles — Three.js WebGL Edition
 * --------------------------------------
 * A simple container for the WebGL canvas, managed by the useThreeParticles hook.
 */
const HeroParticles = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Wire up the Three.js lifecycle
    useThreeParticles(containerRef);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden"
            aria-hidden="true"
            style={{ background: 'transparent' }}
        />
    );
};

export default HeroParticles;

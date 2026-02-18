'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/horizontal.module.css';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalWrapperProps {
    children: React.ReactNode;
}

const HorizontalWrapper: React.FC<HorizontalWrapperProps> = ({ children }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const track = trackRef.current;
        if (!wrapper || !track) return;

        const sections = gsap.utils.toArray<HTMLElement>(track.children);

        const scrollTween = gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                end: () => `+=${track.offsetWidth}`,
            }
        });

        return () => {
            scrollTween.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <div ref={trackRef} className={styles.track}>
                {children}
            </div>
        </div>
    );
};

export default HorizontalWrapper;

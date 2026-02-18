'use client';

import React from 'react';
import styles from '../styles/hero.module.css';

/**
 * HeroSection (Content Only)
 * -------------------------
 * FORCED LEFT ALIGNMENT EDITION
 */
const HeroSection = () => {
    return (
        <section
            style={{
                width: '100vw',
                height: '100vh',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start', // FORCED LEFT
                padding: '0 8%',
                position: 'relative',
                zIndex: 1,
                textAlign: 'left'
            }}
        >
            <div
                className={styles.content}
                style={{
                    textAlign: 'left',
                    alignItems: 'flex-start', // FORCED LEFT
                    display: 'flex',
                    flexDirection: 'column',
                    margin: '0', // REMOVE AUTO MARGINS
                    width: 'auto',
                    maxWidth: '800px'
                }}
            >
                <div className={styles.textWrapper} style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                    <h1 className={styles.title} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.25rem', textAlign: 'left', width: '100%' }}>
                        Elevating Life <br />Through Technology
                    </h1>
                    <p className={styles.description} style={{ maxWidth: '440px', fontSize: '1.1rem', marginBottom: '2.25rem', opacity: 0.85, textAlign: 'left' }}>
                        Design, Build, and Integrate: High-performance smart systems for luxury homes and professional spaces.
                    </p>

                    <div className="flex flex-col gap-2 mb-10 opacity-70 uppercase tracking-widest text-[10px] font-bold border-l-2 border-black pl-5" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                        <span>• Smart Home Automation</span>
                        <span>• Immersive Home Theaters</span>
                        <span>• Professional AV Solutions</span>
                        <span>• Lighting & Security Controls</span>
                    </div>

                    <div className={styles.ctaWrapper} style={{ justifyContent: 'flex-start' }}>
                        <button className={styles.ctaButton}>
                            <span>Our Portfolio</span>
                            <div className={styles.iconCircle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                <div className={styles.scrollIndicator} style={{ left: '0', transform: 'none' }}>
                    <div className={styles.scrollLine} />
                    <span>Scroll to explore</span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

'use client';

import React from 'react';
import styles from '../styles/hero.module.css';
import stylesH from '../styles/horizontal.module.css';

/**
 * HeroSection (Content Only)
 * -------------------------
 * FORCED LEFT ALIGNMENT EDITION
 */
const HeroSection = () => {
    return (
        <section className={stylesH.section}>
            <div className={styles.content}>
                <div className={styles.textWrapper}>
                    <h1 className={styles.title}>
                        Elevating Life <br />Through Technology
                    </h1>
                    <p className={styles.description}>
                        Design, Build, and Integrate: High-performance smart systems for luxury homes and professional spaces.
                    </p>

                    <div className={styles.serviceList}>
                        <span>• Smart Home Automation</span>
                        <span>• Immersive Home Theaters</span>
                        <span>• Professional AV Solutions</span>
                        <span>• Lighting & Security Controls</span>
                    </div>

                    <div className={styles.ctaWrapper}>
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

                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollLine} />
                    <span>Scroll to explore</span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

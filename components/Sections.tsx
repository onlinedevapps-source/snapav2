'use client';

import React from 'react';
import styles from '../styles/horizontal.module.css';

/**
 * Sections (Services, About, Contact)
 * -------------------------
 * Standardized components for the horizontal layout.
 * Styling is handled via horizontal.module.css for full responsiveness.
 */

export const ServicesSection = () => {
    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <h2 className={styles.title}>Services</h2>
                <div className={styles.grid}>
                    <div className={styles.gridItem}>
                        <h3>Creative Design</h3>
                        <p>Crafting stunning visual identities that resonate with your audience.</p>
                    </div>
                    <div className={styles.gridItem}>
                        <h3>Web Excellence</h3>
                        <p>High-performance WebGL experiences built on Next.js 14.</p>
                    </div>
                    <div className={styles.gridItem}>
                        <h3>Motion Graphics</h3>
                        <p>Cinematic animations that bring your digital presence to life.</p>
                    </div>
                    <div className={styles.gridItem}>
                        <h3>Brand Strategy</h3>
                        <p>Strategic positioning to scale your business in the digital age.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const AboutSection = () => {
    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <h2 className={styles.title}>About Us</h2>
                <p className={styles.subtitle}>
                    We are a team of technical artists and engineers dedicated to pushing the boundaries of web interaction.
                    Our work blends physics with aesthetics to create unforgettable digital journeys.
                </p>
            </div>
        </section>
    );
};

export const ContactSection = () => {
    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <h2 className={styles.title}>Contact</h2>
                <div className={styles.contactInfo}>
                    <a href="mailto:hello@snappro.com" className={styles.contactLink}>hello@snappro.com</a>
                    <a href="tel:+1234567890" className={styles.contactLink}>+1 (234) 567-890</a>
                    <p className={styles.subtitle}>Dubai, United Arab Emirates</p>
                </div>
            </div>
        </section>
    );
};

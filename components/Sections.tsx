'use client';

import React from 'react';
import styles from '../styles/horizontal.module.css';

const sectionStyle: React.CSSProperties = {
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
};

const contentStyle: React.CSSProperties = {
    maxWidth: '800px',
    textAlign: 'left'
};

const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: 900,
    color: '#000',
    lineHeight: '0.95',
    letterSpacing: '-0.04em',
    textTransform: 'uppercase',
    marginBottom: '2rem',
    textAlign: 'left'
};

export const ServicesSection = () => {
    return (
        <section style={sectionStyle}>
            <div style={contentStyle}>
                <h2 style={titleStyle}>Services</h2>
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
        <section style={sectionStyle}>
            <div style={contentStyle}>
                <h2 style={titleStyle}>About Us</h2>
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
        <section style={sectionStyle}>
            <div style={contentStyle}>
                <h2 style={titleStyle}>Contact</h2>
                <div className={styles.contactInfo}>
                    <a href="mailto:hello@snappro.com" className={styles.contactLink}>hello@snappro.com</a>
                    <a href="tel:+1234567890" className={styles.contactLink}>+1 (234) 567-890</a>
                    <p className={styles.subtitle}>Dubai, United Arab Emirates</p>
                </div>
            </div>
        </section>
    );
};

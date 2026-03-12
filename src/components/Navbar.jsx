import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150 || location.pathname !== '/') {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    return (
        <AnimatePresence>
            {scrolled && (
                <motion.nav
                    className="navbar"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="nav-inner container">
                        <Link to="/" className="nav-brand-wrap">

                            <div className="brand-text-content">
                                <span className="nav-brand">THE NIGERIA STORY</span>
                                <span className="nav-tagline">Breaking Boundaries. Uniting a Nation.</span>
                            </div>
                        </Link>
                        <div className="nav-links">
                            <Link to="/" className="nav-link">Movement</Link>
                            <Link to="/" className="nav-link">Leaderboard</Link>
                            <Link to="/create" className="btn btn-primary glass-btn">
                                Participate
                            </Link>
                        </div>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

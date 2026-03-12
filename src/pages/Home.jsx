import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import './Home.css';

/* ── Doodle Canvas: Hand-Drawn Outline Shapes ── */
function DoodleCanvas() {
    return (
        <div className="doodle-canvas" aria-hidden="true">
            {/* Hand-drawn Giraffe Layout (Top Left) */}
            <svg style={{ position: 'absolute', top: '8%', left: '5%', width: 'clamp(60px,10vw,120px)', overflow: 'visible' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" style={{ animationDelay: '0s', animationDuration: '6s' }}
                    d="M 40,90 L 40,40 M 40,40 Q 40,10 60,10 M 60,10 Q 70,10 70,20 Q 70,30 60,30 L 50,30 M 60,10 L 65,0 M 65,0 L 70,10 M 55,10 L 58,2 M 58,2 L 62,10 M 60,30 L 60,90 M 40,65 L 60,65 M 50,45 A 2,2 0 1,1 50,44"
                />
            </svg>

            {/* Hand-drawn T-Rex (Right Center) */}
            <svg style={{ position: 'absolute', top: '40%', right: '5%', width: 'clamp(80px,12vw,140px)', overflow: 'visible', transform: 'scaleX(-1)' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" style={{ animationDelay: '1s', animationDuration: '7s' }}
                    d="M 30,90 L 30,60 Q 10,60 10,40 Q 10,20 40,20 Q 70,20 70,40 Q 70,50 60,50 L 50,50 L 50,40 M 70,40 L 90,40 M 30,60 Q 40,70 60,90 M 55,60 L 65,60 L 65,70 M 35,30 A 2,2 0 1,1 35,29 M 10,40 L 5,45 M 15,45 L 10,50 M 20,50 L 15,55 M 25,55 L 20,60"
                />
            </svg>

            {/* True Marker Smiley Face (Bottom Left) */}
            <svg style={{ position: 'absolute', bottom: '15%', left: '10%', width: 'clamp(70px,11vw,130px)', overflow: 'visible', transform: 'rotate(-10deg)' }} viewBox="0 0 100 100">
                <circle className="doodle-outline-path" pathLength="100" cx="50" cy="50" r="40" style={{ animationDelay: '0.5s', animationDuration: '5s' }} />
                <path className="doodle-outline-path" pathLength="100" d="M 35,40 L 35,45" style={{ animationDelay: '1.5s', animationDuration: '2s' }} />
                <path className="doodle-outline-path" pathLength="100" d="M 65,40 L 65,45" style={{ animationDelay: '1.7s', animationDuration: '2s' }} />
                <path className="doodle-outline-path" pathLength="100" d="M 30,65 Q 50,85 70,65" style={{ animationDelay: '2s', animationDuration: '4s' }} />
            </svg>

            {/* Brand Style Sun (Middle Left) */}
            <svg style={{ position: 'absolute', top: '45%', left: '15%', width: 'clamp(80px,12vw,140px)', overflow: 'visible', transform: 'rotate(15deg)' }} viewBox="0 0 100 100">
                <circle className="doodle-outline-path" pathLength="100" cx="50" cy="50" r="25" style={{ animationDelay: '2s', animationDuration: '5s' }} />
                <path className="doodle-outline-path" pathLength="100" d="M 50,15 L 50,5 M 50,85 L 50,95 M 85,50 L 95,50 M 15,50 L 5,50 M 75,25 L 82,18 M 25,75 L 18,82 M 75,75 L 82,82 M 25,25 L 18,18" style={{ animationDelay: '3s', animationDuration: '6s' }} />
            </svg>

            {/* Brand Style Hand-Drawn Arrow (Top Right) */}
            <svg style={{ position: 'absolute', top: '20%', right: '15%', width: 'clamp(70px,10vw,120px)', overflow: 'visible', transform: 'rotate(-20deg)' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" d="M 20,80 Q 50,50 80,20 M 60,20 L 80,20 L 80,40" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
            </svg>

            {/* Swirly Line / Abstract Shape (Bottom Right) */}
            <svg style={{ position: 'absolute', bottom: '25%', right: '15%', width: 'clamp(80px,12vw,140px)', overflow: 'visible' }} viewBox="0 0 150 50">
                <path className="doodle-outline-path" pathLength="100" d="M 10,25 Q 40,-10 75,25 T 140,25" style={{ animationDelay: '3s', animationDuration: '5s' }} />
            </svg>

            {/* Exploding Crown / Thought Cloud (Top Center-Right) */}
            <svg style={{ position: 'absolute', top: '10%', right: '35%', width: 'clamp(60px,9vw,110px)', overflow: 'visible' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" d="M 20,60 L 20,40 L 40,20 L 60,40 L 80,20 L 80,60 Z" style={{ animationDelay: '4s', animationDuration: '6s' }} />
            </svg>

            {/* NEW: Star 1 (Top Center-Left) */}
            <svg style={{ position: 'absolute', top: '15%', left: '30%', width: 'clamp(40px,7vw,80px)', overflow: 'visible', transform: 'rotate(-15deg)' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" d="M 50,10 L 60,40 L 90,40 L 65,60 L 75,90 L 50,75 L 25,90 L 35,60 L 10,40 L 40,40 Z" style={{ animationDelay: '1.2s', animationDuration: '5s' }} />
            </svg>

            {/* NEW: Star 2 (Bottom Center-Right) */}
            <svg style={{ position: 'absolute', bottom: '10%', right: '30%', width: 'clamp(30px,6vw,70px)', overflow: 'visible', transform: 'rotate(25deg)' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" d="M 50,10 L 60,40 L 90,40 L 65,60 L 75,90 L 50,75 L 25,90 L 35,60 L 10,40 L 40,40 Z" style={{ animationDelay: '3.5s', animationDuration: '6s' }} />
            </svg>

            {/* NEW: Heart (Middle Right) */}
            <svg style={{ position: 'absolute', top: '55%', right: '18%', width: 'clamp(50px,8vw,90px)', overflow: 'visible', transform: 'rotate(10deg)' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" d="M 50,85 L 25,60 Q 10,45 25,25 Q 40,10 50,30 Q 60,10 75,25 Q 90,45 75,60 Z" style={{ animationDelay: '2.5s', animationDuration: '5.5s' }} />
            </svg>

            {/* NEW: Scribble / ZigZag (Bottom Center) */}
            <svg style={{ position: 'absolute', bottom: '5%', left: '40%', width: 'clamp(70px,10vw,120px)', overflow: 'visible' }} viewBox="0 0 150 50">
                <path className="doodle-outline-path" pathLength="100" d="M 10,25 L 30,10 L 50,40 L 70,10 L 90,40 L 110,10 L 130,25" style={{ animationDelay: '4s', animationDuration: '4.5s' }} />
            </svg>

            {/* NEW: Sparkles (Top Right Corner) */}
            <svg style={{ position: 'absolute', top: '5%', right: '5%', width: 'clamp(30px,5vw,60px)', overflow: 'visible' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" d="M 50,10 Q 50,50 90,50 Q 50,50 50,90 Q 50,50 10,50 Q 50,50 50,10" style={{ animationDelay: '2.8s', animationDuration: '6s' }} />
            </svg>

            {/* NEW: Sparkles (Bottom Left Corner) */}
            <svg style={{ position: 'absolute', bottom: '30%', left: '5%', width: 'clamp(40px,6vw,70px)', overflow: 'visible' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" d="M 50,10 Q 50,50 90,50 Q 50,50 50,90 Q 50,50 10,50 Q 50,50 50,10" style={{ animationDelay: '5s', animationDuration: '6.5s' }} />
            </svg>

            {/* NEW: Curly Cue (Middle Left) */}
            <svg style={{ position: 'absolute', top: '30%', left: '15%', width: 'clamp(50px,8vw,100px)', overflow: 'visible', transform: 'rotate(-30deg)' }} viewBox="0 0 100 100">
                <path className="doodle-outline-path" pathLength="100" d="M 10,50 Q 50,0 80,50 T 50,80 T 40,50 T 60,40 T 70,50" style={{ animationDelay: '1.8s', animationDuration: '5.2s' }} />
            </svg>
        </div>
    );
}

export default function Home() {
    return (
        <div className="home-cinematic">

            {/* ── Hero ── */}
            <section className="hero-splash">
                <div className="vhs-grain" />

                {/* Static base color (eliminating heavy video for performance) */}
                <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', zIndex: -1 }} />

                {/* 16 animated doodles */}
                <DoodleCanvas />

                {/* Center hero content */}
                <div className="hero-content">
                    <motion.div
                        className="hero-title-block"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } }
                        }}
                    >
                        {/* Split "THE" into characters */}
                        <motion.div className="title-the title-word" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                            {"THE".split('').map((char, i) => (
                                <motion.span key={i} style={{ display: 'inline-block', transformOrigin: 'center' }}
                                    variants={{
                                        hidden: { opacity: 0, y: 30, rotate: 0 },
                                        visible: { opacity: 1, y: i % 2 === 0 ? -5 : 5, rotate: i % 2 === 0 ? -8 : 12, transition: { type: 'spring', bounce: 0.5 } }
                                    }}
                                >{char}</motion.span>
                            ))}
                        </motion.div>

                        {/* Split "NIGERIA" into characters */}
                        <motion.div className="title-nigeria title-word" variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
                            {"NIGERIA".split('').map((char, i) => (
                                <motion.span key={i} style={{ display: 'inline-block', transformOrigin: 'center' }}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.5, rotate: 0 },
                                        visible: { opacity: 1, scale: 1, y: i % 2 !== 0 ? -8 : 8, rotate: i % 2 !== 0 ? 6 : -4, transition: { type: 'spring', bounce: 0.6 } }
                                    }}
                                >{char}</motion.span>
                            ))}
                        </motion.div>

                        {/* Split "STORY" into characters */}
                        <motion.div className="title-story title-word" variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}>
                            {"STORY".split('').map((char, i) => (
                                <motion.span key={i} style={{ display: 'inline-block', transformOrigin: 'center' }}
                                    variants={{
                                        hidden: { opacity: 0, y: -30, rotate: 0 },
                                        visible: { opacity: 1, y: i === 2 ? -10 : 5, rotate: i === 0 ? -10 : i === 4 ? 10 : 0, transition: { type: 'spring', bounce: 0.5 } }
                                    }}
                                >{char}</motion.span>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.p
                        className="hero-tagline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                    >
                        Breaking Boundaries. Uniting a Nation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 1.1, ease: 'easeOut' }}
                    >
                        <Link to="/create" className="btn-80s">
                            JOIN THE MOVEMENT <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Mission Scroll ── */}
            <section className="mission-scroll-section">

                <div className="mission-block">
                    <motion.div
                        className="mission-content"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-20%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <div className="mission-icon"><BookOpen size={40} /></div>
                        <h2>Acknowledge Generations.</h2>
                        <p>We are building a living archive. From the oldest wisdom to the youngest voices, we capture and preserve the true story of Nigeria—told by the people who live it every day.</p>
                    </motion.div>
                </div>

                <div className="mission-block alt">
                    <motion.div
                        className="mission-content"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-20%' }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                    >
                        <div className="mission-icon"><Cpu size={40} /></div>
                        <h2>Empower the Future.</h2>
                        <p>By putting the power of AI directly into the hands of students across the nation, we ensure no one is left behind. Learn the tools of tomorrow while telling the stories of today.</p>
                    </motion.div>
                </div>

                <div className="mission-block center">
                    <motion.div
                        className="mission-content final-cta-block"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-20%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <Sparkles size={40} className="final-sparkle" />
                        <h2>Be part of the history.</h2>
                        <Link to="/create" className="btn-80s mt">
                            Start Your Story
                        </Link>
                    </motion.div>
                </div>

            </section>

        </div>
    );
}

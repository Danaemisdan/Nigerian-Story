import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Share2, Download, Copy, CheckCircle, Award, ArrowRight, Zap } from 'lucide-react';
import './SuccessShare.css';

const STEPS_TEXT = [
    'Scanning facial structure…',
    'Mapping mouth landmarks…',
    'Synthesising voice pattern…',
    'Rendering lip-sync frames…',
    'Compositing final video…',
    'Almost done…',
];

export default function SuccessShare() {
    const location = useLocation();
    const { aiPortraitUrl, animatedVideoUrl } = location.state || {};

    const [progress, setProgress] = useState(0);
    const [stepIdx, setStepIdx] = useState(0);
    const [done, setDone] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const iv = setInterval(() => {
            setProgress((p) => {
                const next = p + Math.random() * 4 + 1.5;
                if (next >= 100) { clearInterval(iv); setDone(true); return 100; }
                setStepIdx(Math.min(Math.floor((next / 100) * STEPS_TEXT.length), STEPS_TEXT.length - 1));
                return next;
            });
        }, 180);
        return () => clearInterval(iv);
    }, []);

    const copy = () => {
        navigator.clipboard.writeText('https://thenigeriastory.ng/u/ada-982');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    if (!done) return (
        <div className="loading-screen">
            <div className="loading-orb">
                <Zap size={36} className="zap-icon" />
            </div>
            <h2>AI is building your legacy…</h2>
            <div className="progress-wrap">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="loading-step">{STEPS_TEXT[stepIdx]}</p>
            <p className="loading-sub">
                Every second, an AI is learning from you. <br />
                <strong>This is what it means to be in the future.</strong>
            </p>
        </div>
    );

    return (
        <div className="success-page">
            <div className="success-top anim anim-1">
                <div className="badge-live"><span className="dot" /> Your Story is Live</div>
                <h1 className="white-text">You're now part<br /> of the <span className="gradient-text">Movement.</span></h1>
                <p>Share this before everyone else. The early participants get featured first.</p>
            </div>

            <div className="result-grid">
                {/* Video mock */}
                <div className="video-col anim anim-2">
                    <div className="video-card glass">
                        <div className="video-mockup">
                            {animatedVideoUrl ? (
                                <video src={animatedVideoUrl} autoPlay loop playsInline className="generated-video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : aiPortraitUrl ? (
                                <img src={aiPortraitUrl} alt="AI Generated Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <img
                                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&h=700&q=80"
                                    alt="AI animated portrait fallback"
                                />
                            )}
                            <div className="video-overlay">
                                <div className="video-play-btn" />
                            </div>
                            <div className="vid-watermark">
                                <Zap size={12} /> thenigeriastory.ng
                            </div>
                            <div className="vid-badge">AI Animated</div>
                        </div>
                    </div>
                    {animatedVideoUrl && (
                        <a href={animatedVideoUrl} download="my_nigerian_story.mp4" className="btn btn-ghost" style={{ width: '100%', marginTop: '1rem', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Download size={18} style={{ marginRight: '8px' }} /> Download Video
                        </a>
                    )}
                    {!animatedVideoUrl && (
                        <button className="btn btn-ghost" style={{ width: '100%', marginTop: '1rem' }} disabled>
                            <Download size={18} /> Generating Video...
                        </button>
                    )}
                </div>

                {/* Share panel */}
                <div className="share-col anim anim-3">
                    {/* Urgency block */}
                    <div className="urgency-block glass">
                        <div className="urgency-icon">⚡</div>
                        <div>
                            <h4>Don't get left behind.</h4>
                            <p>AI is reshaping the world right now. You just stepped in. Invite your friends before they miss it.</p>
                        </div>
                    </div>

                    {/* Social share */}
                    <div className="glass share-section">
                        <h3>Share your animation</h3>
                        <p className="share-sub">Show Nigeria what AI looks like with your face on it.</p>
                        <div className="social-row">
                            <button className="social-pill whatsapp">WhatsApp</button>
                            <button className="social-pill twitter">𝕏</button>
                            <button className="social-pill instagram">Instagram</button>
                            <button className="social-pill tiktok">TikTok</button>
                        </div>
                    </div>

                    {/* Referral */}
                    <div className="glass share-section">
                        <h3>Invite & Climb the Board</h3>
                        <p className="share-sub">Every person you invite puts you higher on the national leaderboard.</p>
                        <label className="field-label">Your Referral Link</label>
                        <div className="copy-row">
                            <input readOnly value="thenigeriastory.ng/u/ada-982" className="copy-input" />
                            <button className="copy-btn" onClick={copy}>
                                {copied ? <CheckCircle size={18} color="#4ade80" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Milestone */}
                    <div className="milestone glass">
                        <Award size={28} className="milestone-icon" />
                        <div>
                            <h4>Next: <span className="gradient-text">Pioneer Badge</span></h4>
                            <p>Invite 10 friends to unlock early access and a featured spot on the dashboard.</p>
                        </div>
                        <ArrowRight size={20} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

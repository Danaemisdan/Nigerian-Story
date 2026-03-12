import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mic, Square, Type, ArrowRight, Play, CheckCircle, ArrowLeft } from 'lucide-react';
import './RecordStory.css';

export default function RecordStory() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('voice');
    const [isRecording, setIsRecording] = useState(false);
    const [time, setTime] = useState(0);
    const [done, setDone] = useState(false);
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const timerRef = useRef(null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const portrait = sessionStorage.getItem('portraitBase64') || '';
        try {
            setSubmitError(null);
            const res = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    portrait,
                    storyType: mode,
                    storyText: text
                })
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/success', {
                    state: {
                        aiPortraitUrl: data.aiPortraitUrl,
                        animatedVideoUrl: data.animatedVideoUrl
                    }
                });
            } else {
                console.error('Submission failed:', data.error || data.details);
                setSubmitError(data.error || data.details || 'Unknown server error');
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error(e);
            setSubmitError(e.message || 'Failed to connect to server');
            setIsSubmitting(false);
        }
    };

    const toggle = () => {
        if (isRecording) {
            clearInterval(timerRef.current);
            setIsRecording(false);
            setDone(true);
        } else {
            setTime(0);
            setDone(false);
            setIsRecording(true);
            timerRef.current = setInterval(() => {
                setTime((t) => {
                    if (t >= 30) { clearInterval(timerRef.current); setIsRecording(false); setDone(true); return 30; }
                    return t + 1;
                });
            }, 1000);
        }
    };

    const fmt = (s) => `00:${String(s).padStart(2, '0')}`;

    return (
        <div className="record-page">
            <div className="page-header anim anim-1">
                <Link to="/create" className="back-link"><ArrowLeft size={16} /> Back</Link>
                <div className="step-indicator">
                    <span className="step done-step">✓</span>
                    <span className="step-line filled" />
                    <span className="step active">2</span>
                    <span className="step-line" />
                    <span className="step">3</span>
                </div>
            </div>

            <div className="page-title-block anim anim-2">
                <p className="section-label">⬡ Step 2 of 3</p>
                <h2 className="white-text">Tell Your Story</h2>
                <p>30 seconds. Tell Nigeria — and the world — who you are.</p>
            </div>

            <div className="mode-tabs glass anim anim-3">
                <button className={`tab-btn ${mode === 'voice' ? 'active' : ''}`} onClick={() => setMode('voice')}>
                    <Mic size={15} /> Voice Note
                </button>
                <button className={`tab-btn ${mode === 'text' ? 'active' : ''}`} onClick={() => setMode('text')}>
                    <Type size={15} /> Type Story
                </button>
            </div>

            {mode === 'voice' ? (
                <div className="voice-box glass anim anim-4">
                    <div className={`mic-outer ${isRecording ? 'recording' : done ? 'complete' : ''}`}>
                        <div className={`mic-ring ${isRecording ? 'pulse' : ''}`} />
                        <button className={`mic-btn ${isRecording ? 'rec' : ''}`} onClick={toggle}>
                            {isRecording ? <Square size={28} /> : done ? <Play size={28} /> : <Mic size={36} />}
                        </button>
                    </div>

                    <div className={`timer ${isRecording ? 'live' : ''}`}>
                        <span className="t-current">{fmt(time)}</span>
                        <span className="t-sep"> / </span>
                        <span className="t-total">00:30</span>
                    </div>

                    <div className="waveform">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div
                                key={i}
                                className={`bar ${isRecording ? 'animate' : ''}`}
                                style={{ animationDelay: `${i * 0.06}s`, height: `${Math.random() * 60 + 20}%` }}
                            />
                        ))}
                    </div>

                    {done && (
                        <p className="status-ok">
                            <CheckCircle size={15} /> Recording saved — tap mic to redo
                        </p>
                    )}
                    {!done && !isRecording && (
                        <p className="status-hint">Tap the mic to start your 30-second story</p>
                    )}
                </div>
            ) : (
                <div className="text-box glass anim anim-4">
                    <textarea
                        className="story-input"
                        placeholder="I am a Nigerian because…  (max 500 characters)"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={500}
                    />
                    <div className="char-row">
                        <span className={text.length > 450 ? 'warn' : ''}>{text.length}/500</span>
                    </div>
                </div>
            )}

            <div className="next-bar anim anim-5">
                <p className="hint">Your voice will drive the AI animation.</p>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSubmit}
                    disabled={(mode === 'voice' && !done) || isSubmitting}
                >
                    {isSubmitting ? 'Generating...' : 'Generate My Animation'} <ArrowRight size={18} />
                </button>
                {submitError && <div className="error-message" style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center' }}>❌ {submitError}</div>}
            </div>
        </div>
    );
}

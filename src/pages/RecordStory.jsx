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
    const [generationStep, setGenerationStep] = useState('');
    const [audioBlobBase64, setAudioBlobBase64] = useState(null);
    
    const timerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const runPrediction = async (model, input) => {
        const res = await fetch('/api/create-prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, input })
        });
        const prediction = await res.json();
        if (!res.ok) throw new Error(prediction.error || 'Failed to start prediction');
        
        let status = prediction.status;
        let id = prediction.id;
        
        while (status === 'starting' || status === 'processing') {
            await new Promise(r => setTimeout(r, 3000));
            const pollRes = await fetch(`/api/get-prediction?id=${id}`);
            const pollData = await pollRes.json();
            if (!pollRes.ok) throw new Error(pollData.error || 'Polling failed');
            status = pollData.status;
            if (status === 'succeeded') return pollData.output;
            if (status === 'failed' || status === 'canceled') throw new Error(pollData.error || 'Prediction failed');
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        setGenerationStep('1/3: Enhancing Portrait with SDXL...');
        
        const portrait = sessionStorage.getItem('portraitBase64') || '';
        if (!portrait) {
            setSubmitError('Portrait missing. Please go back to step 1.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Step 1: SDXL
            const sdxlOutput = await runPrediction(
                "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                {
                    image: portrait,
                    prompt: "A beautifully detailed portrait photograph of a realistic Nigerian person, front facing, photorealistic, 8k, cinematic studio lighting",
                    prompt_strength: 0.85,
                    num_inference_steps: 30
                }
            );
            const aiPortraitUrl = Array.isArray(sdxlOutput) ? sdxlOutput[0] : sdxlOutput;

            // Step 2: Audio
            let audioSource = audioBlobBase64;
            if (mode === 'text') {
                setGenerationStep('2/3: Generating Voice... (Queues can take 2-5 min)');
                const barkOutput = await runPrediction(
                    "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
                    { prompt: text, text_temp: 0.7, output_full: false }
                );
                audioSource = barkOutput.audio_out || barkOutput;
            }

            if (!audioSource) throw new Error('Missing audio source. Please record or type a story.');

            // Step 3: SadTalker LipSync
            setGenerationStep('3/3: Animating LipSync Audio... (Almost done!)');
            const sadOutput = await runPrediction(
                 "cjwbw/sadtalker:a519cc0cfebaaeade068b23899165a11ec76aaa1d2b313d40d214f204ec957a3",
                 {
                     source_image: typeof aiPortraitUrl === 'string' ? aiPortraitUrl : aiPortraitUrl?.url,
                     driven_audio: typeof audioSource === 'string' ? audioSource : audioSource?.url,
                     still: true,
                     enhancer: "gfpgan"
                 }
            );
            
            navigate('/success', {
                state: { 
                    aiPortraitUrl: typeof aiPortraitUrl === 'string' ? aiPortraitUrl : aiPortraitUrl?.url,
                    animatedVideoUrl: typeof sadOutput === 'string' ? sadOutput : sadOutput?.url
                }
            });

        } catch (e) {
            console.error(e);
            setSubmitError(e.message || 'Generation failed. Please try again.');
        } finally {
            setIsSubmitting(false);
            setGenerationStep('');
        }
    };

    const toggle = () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
            clearInterval(timerRef.current);
            setIsRecording(false);
            setDone(true);
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                const mr = new MediaRecorder(stream);
                mediaRecorderRef.current = mr;
                chunksRef.current = [];
                
                mr.ondataavailable = e => {
                    if (e.data.size > 0) chunksRef.current.push(e.data);
                };
                mr.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.onloadend = () => setAudioBlobBase64(reader.result);
                    reader.readAsDataURL(blob);
                };
                mr.start(200);
                
                setTime(0);
                setDone(false);
                setIsRecording(true);
                setSubmitError(null);
                
                timerRef.current = setInterval(() => {
                    setTime((t) => {
                        if (t >= 30) {
                            toggle(); // Stop recording 
                            return 30;
                        }
                        return t + 1;
                    });
                }, 1000);
            }).catch(e => {
                console.error(e);
                setSubmitError('Microphone access denied. Please allow mic permissions.');
            });
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
                {generationStep && <div className="status-hint" style={{ marginTop: '0.8rem', color: '#f2a900' }}>{generationStep}</div>}
                {submitError && <div className="error-message" style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center' }}>❌ {submitError}</div>}
            </div>
        </div>
    );
}

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Upload, ArrowRight, Paintbrush, Trash2, ArrowLeft } from 'lucide-react';
import './CreatePortrait.css';

const COLORS = ['#ffffff', '#f0e68c', '#00c468', '#F2A900', '#ff6b6b', '#74b9ff', '#a29bfe', '#000000'];

export default function CreatePortrait() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);
    const [color, setColor] = useState('#ffffff');
    const [brushSize, setBrushSize] = useState(6);
    const [mode, setMode] = useState('draw');
    const [isEraser, setIsEraser] = useState(false);

    const handleSaveAndContinue = () => {
        if (mode === 'draw' && canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
            sessionStorage.setItem('portraitBase64', dataUrl);
        } else {
            sessionStorage.setItem('portraitBase64', 'placeholder'); // fallback for now
        }
        navigate('/record');
    };

    useEffect(() => {
        if (canvasRef.current && mode === 'draw') {
            const canvas = canvasRef.current;
            const size = Math.min(canvas.parentElement.offsetWidth, 500);
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d');
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.fillStyle = '#000';
            context.fillRect(0, 0, size, size);

            // Draw detailed face outline guide
            context.beginPath();
            context.strokeStyle = 'rgba(255, 255, 255, 0.4)'; // faint guide
            context.lineWidth = 2;
            // Face shape
            context.ellipse(size / 2, size / 2, size * 0.35, size * 0.45, 0, 0, Math.PI * 2);
            // Left Eye
            context.moveTo(size * 0.4, size * 0.45);
            context.arc(size * 0.36, size * 0.45, size * 0.04, 0, Math.PI * 2);
            // Right Eye
            context.moveTo(size * 0.68, size * 0.45);
            context.arc(size * 0.64, size * 0.45, size * 0.04, 0, Math.PI * 2);
            // Nose guide
            context.moveTo(size * 0.5, size * 0.45);
            context.lineTo(size * 0.5, size * 0.6);
            context.lineTo(size * 0.53, size * 0.62);
            // Mouth guide
            context.moveTo(size * 0.4, size * 0.75);
            context.quadraticCurveTo(size * 0.5, size * 0.8, size * 0.6, size * 0.75);
            context.stroke();
            context.closePath();

            setCtx(context);
        }
    }, [mode]);

    useEffect(() => {
        if (!ctx) return;
        ctx.strokeStyle = isEraser ? '#000' : color;
        ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
    }, [color, brushSize, isEraser, ctx]);

    const getXY = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY,
            };
        }
        return {
            x: e.nativeEvent.offsetX * scaleX,
            y: e.nativeEvent.offsetY * scaleY,
        };
    };

    const startDraw = (e) => {
        if (!ctx) return;
        const { x, y } = getXY(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !ctx) return;
        e.preventDefault();
        const { x, y } = getXY(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDraw = () => {
        ctx?.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (ctx && canvasRef.current) {
            const size = canvasRef.current.width;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, size, size);

            // Redraw detailed face outline guide
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.ellipse(size / 2, size / 2, size * 0.35, size * 0.45, 0, 0, Math.PI * 2);
            ctx.moveTo(size * 0.4, size * 0.45);
            ctx.arc(size * 0.36, size * 0.45, size * 0.04, 0, Math.PI * 2);
            ctx.moveTo(size * 0.68, size * 0.45);
            ctx.arc(size * 0.64, size * 0.45, size * 0.04, 0, Math.PI * 2);
            ctx.moveTo(size * 0.5, size * 0.45);
            ctx.lineTo(size * 0.5, size * 0.6);
            ctx.lineTo(size * 0.53, size * 0.62);
            ctx.moveTo(size * 0.4, size * 0.75);
            ctx.quadraticCurveTo(size * 0.5, size * 0.8, size * 0.6, size * 0.75);
            ctx.stroke();
            ctx.closePath();

            // Restore chosen brush state
            ctx.strokeStyle = isEraser ? '#000' : color;
            ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
        }
    };

    return (
        <div className="create-page">
            <div className="page-header anim anim-1">
                <Link to="/" className="back-link"><ArrowLeft size={16} /> Back</Link>
                <div className="step-indicator">
                    <span className="step active">1</span>
                    <span className="step-line" />
                    <span className="step">2</span>
                    <span className="step-line" />
                    <span className="step">3</span>
                </div>
            </div>

            <div className="page-title-block anim anim-2">
                <p className="section-label">⬡ Step 1 of 3</p>
                <h2 className="white-text">Create Your Portrait</h2>
                <p>Draw a self-portrait inside the circle — or upload / scan one you made on paper.</p>
            </div>

            <div className="mode-tabs glass anim anim-3">
                {[
                    { id: 'draw', icon: <Paintbrush size={16} />, label: 'Draw Digital' },
                    { id: 'upload', icon: <Upload size={16} />, label: 'Upload Image' },
                    { id: 'scan', icon: <Camera size={16} />, label: 'Scan Paper' },
                ].map((m) => (
                    <button
                        key={m.id}
                        className={`tab-btn ${mode === m.id ? 'active' : ''}`}
                        onClick={() => setMode(m.id)}
                    >
                        {m.icon} {m.label}
                    </button>
                ))}
            </div>

            {mode === 'draw' && (
                <div className="draw-layout anim anim-4">
                    <div className="canvas-wrap">
                        <canvas
                            ref={canvasRef}
                            className="portrait-canvas"
                            onMouseDown={startDraw}
                            onMouseMove={draw}
                            onMouseUp={stopDraw}
                            onMouseLeave={stopDraw}
                            onTouchStart={startDraw}
                            onTouchMove={draw}
                            onTouchEnd={stopDraw}
                        />
                        <div className="circle-guide" />
                    </div>

                    <div className="tool-sidebar glass">
                        <div className="tool-section">
                            <label className="tool-label">Colors</label>
                            <div className="color-grid">
                                {COLORS.map((c) => (
                                    <button
                                        key={c}
                                        className={`color-dot ${color === c && !isEraser ? 'sel' : ''}`}
                                        style={{ background: c }}
                                        onClick={() => { setColor(c); setIsEraser(false); }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="tool-section">
                            <label className="tool-label">Size — {brushSize}px</label>
                            <input
                                type="range" min="2" max="24" value={brushSize}
                                onChange={(e) => setBrushSize(+e.target.value)}
                                className="range-slider"
                            />
                        </div>

                        <div className="tool-section">
                            <label className="tool-label">Tools</label>
                            <div className="tool-btns">
                                <button
                                    className={`tool-pill ${!isEraser ? 'active' : ''}`}
                                    onClick={() => setIsEraser(false)}
                                >
                                    <Paintbrush size={14} /> Brush
                                </button>
                                <button
                                    className={`tool-pill ${isEraser ? 'active' : ''}`}
                                    onClick={() => setIsEraser(true)}
                                >
                                    Eraser
                                </button>
                                <button className="tool-pill danger" onClick={clearCanvas}>
                                    <Trash2 size={14} /> Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(mode === 'upload' || mode === 'scan') && (
                <div className="upload-zone anim anim-4">
                    <div className="dropzone glass">
                        {mode === 'upload' ? <Upload size={52} color="var(--primary)" /> : <Camera size={52} color="var(--secondary)" />}
                        <h3>{mode === 'upload' ? 'Drop your image here' : 'Photograph your drawing'}</h3>
                        <p>{mode === 'upload' ? 'JPG or PNG, max 10MB' : 'Point camera at your paper sketch'}</p>
                        <button className="btn btn-ghost" style={{ marginTop: '1rem' }}>
                            {mode === 'upload' ? 'Browse Files' : 'Open Camera'}
                        </button>
                    </div>
                </div>
            )}

            <div className="next-bar anim anim-5">
                <p className="hint">Your portrait stays circular — just like legacy.</p>
                <button className="btn btn-primary btn-lg" onClick={handleSaveAndContinue}>
                    Save Portrait &amp; Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

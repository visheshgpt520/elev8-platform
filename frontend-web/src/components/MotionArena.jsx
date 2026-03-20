import React, { useRef, useEffect, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { socket } from '../services/socket';

const MotionArena = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const navigate = useNavigate();
    const { currentUser, gameState, setGameState } = useStore();
    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);

    // Simulated Target State
    const [target, setTarget] = useState({ x: 0.5, y: 0.3, size: 0.1, active: true });

    // End Game State Tracking
    const [matchResult, setMatchResult] = useState(null); // { isWinner: bool, amountWon: number }

    useEffect(() => {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        // Initialize MediaPipe Pose
        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        pose.setOptions({
            modelComplexity: 1, // 1 is optimal for real-time web 
            smoothLandmarks: true,
            enableSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults((results) => {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            // We do not draw the video frame to keep the immersive black background
            // If you wanted AR, you would draw the image here:
            // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            // Draw current active gameplay target
            if (target.active) {
                const targetX = target.x * canvasElement.width;
                const targetY = target.y * canvasElement.height;
                const targetSizePx = target.size * canvasElement.width;

                canvasCtx.fillStyle = 'rgba(6, 182, 212, 0.8)'; // Cyan target
                canvasCtx.shadowColor = '#06b6d4';
                canvasCtx.shadowBlur = 20;
                canvasCtx.fillRect(targetX - targetSizePx / 2, targetY - targetSizePx / 2, targetSizePx, targetSizePx);
                canvasCtx.shadowBlur = 0; // reset
            }

            if (results.poseLandmarks) {
                // Elev8 Skeleton Styling
                drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                    { color: '#8b5cf6', lineWidth: 4 }); // Purple connectors

                drawLandmarks(canvasCtx, results.poseLandmarks,
                    { color: '#06b6d4', lineWidth: 2, radius: 4 }); // Cyan glowing nodes

                // Hit Detection Logic
                const leftWrist = results.poseLandmarks[15];
                const rightWrist = results.poseLandmarks[16];

                if (target.active) {
                    const checkHit = (wrist) => {
                        if (!wrist) return false;
                        // Basic AABB intersection logic via normalized coordinates
                        const padding = target.size / 2;
                        return (
                            wrist.x > target.x - padding &&
                            wrist.x < target.x + padding &&
                            wrist.y > target.y - padding &&
                            wrist.y < target.y + padding
                        );
                    };

                    if (checkHit(leftWrist) || checkHit(rightWrist)) {
                        handleTargetHit();
                    }
                }
            }
            canvasCtx.restore();
        });

        // Socket listeners for realtime opponent sync and match completion
        const onOpponentScore = (data) => setOpponentScore(data.score);

        const onMatchOver = (data) => {
            console.log("Match Over Payload Received:", data);

            // Deactivate targets to freeze the screen
            setTarget(prev => ({ ...prev, active: false }));

            const isWinner = data.winnerWalletId === currentUser.walletId;
            setMatchResult({
                isWinner,
                amountWon: isWinner ? data.amountWon : 0,
                message: data.message
            });

            // Revert state hook to clear backend node matching flags seamlessly
            setGameState('idle');
        };

        socket.on('opponent_score_update', onOpponentScore);
        socket.on('match_over', onMatchOver);

        // Initialize Camera Hook
        let camera = null;
        if (videoElement) {
            camera = new Camera(videoElement, {
                onFrame: async () => {
                    await pose.send({ image: videoElement });
                },
                width: 1280,
                height: 720
            });
            camera.start();
        }

        return () => {
            if (camera) camera.stop();
            pose.close();
            socket.off('opponent_score_update', onOpponentScore);
            socket.off('match_over', onMatchOver);
        };
    }, []); // Only initialize layout effects once, unbind on route change

    const handleTargetHit = () => {
        // Deactivate current target immediately to prevent multi-hits
        setTarget(prev => ({ ...prev, active: false }));

        const newScore = score + 10;
        setScore(newScore);

        // Emit real-time score to Node.js backend
        socket.emit('submit_score', {
            roomId: 'current_room_id', // Would normally map from global state
            walletId: currentUser.walletId,
            score: newScore
        });

        // Relocate target after a short delay
        setTimeout(() => {
            setTarget({
                x: 0.2 + (Math.random() * 0.6), // Stay away from extreme edges
                y: 0.2 + (Math.random() * 0.6),
                size: 0.1,
                active: true
            });
        }, 500);
    };

    return (
        <div className="relative w-screen h-screen bg-zinc-900 overflow-hidden flex flex-col pt-4">
            {/* Hidden Input Layer */}
            <video
                ref={videoRef}
                className="hidden"
                playsInline
            />

            {/* Core HUD */}
            <header className="absolute top-0 left-0 w-full z-20 flex justify-between px-8 py-6 pointer-events-none">
                <div>
                    <h2 className="text-gray-400 tracking-widest uppercase text-sm font-semibold">Live Score</h2>
                    <div className="text-6xl font-display font-bold text-white shadow-cyan-glow">
                        {score}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-gray-400 tracking-widest uppercase text-sm font-semibold">Opponent</h2>
                    <div className="text-4xl font-display font-bold text-gray-600">
                        {opponentScore}
                    </div>
                </div>
            </header>

            {/* Victory / Defeat Modal HUD overlay */}
            {matchResult && (
                <div className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className={`p-10 rounded-3xl border ${matchResult.isWinner ? 'border-success bg-success/10' : 'border-danger bg-danger/10'} text-center shadow-2xl`}>
                        <h1 className={`text-6xl font-display font-bold tracking-widest uppercase mb-4 ${matchResult.isWinner ? 'text-success shadow-[0_0_20px_#10b981]' : 'text-danger'}`}>
                            {matchResult.isWinner ? 'VICTORY' : 'DEFEAT'}
                        </h1>
                        <p className="text-gray-300 mb-8">{matchResult.message}</p>

                        {matchResult.isWinner && (
                            <div className="text-3xl font-display text-white mb-8 border border-white/20 inline-block px-8 py-4 rounded-xl bg-black/50">
                                Payout: <span className="text-success font-bold">+{matchResult.amountWon} CR</span>
                            </div>
                        )}

                        <br />
                        <button
                            onClick={() => navigate('/lobby')}
                            className="glowing-button px-10 py-4 rounded-xl font-bold tracking-wider"
                        >
                            RETURN TO LOBBY
                        </button>
                    </div>
                </div>
            )}

            {/* Visible Output Layer */}
            <div className="flex-1 w-full h-full relative z-10 flex justify-center items-center">
                <canvas
                    ref={canvasRef}
                    className="w-full max-w-[1280px] aspect-video border border-white/5 rounded-3xl bg-black/40 shadow-2xl"
                    width="1280"
                    height="720"
                />
            </div>

            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-accent-purple/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
        </div>
    );
};

export default MotionArena;

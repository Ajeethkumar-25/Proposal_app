import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Proposal.css';

const Proposal = () => {
    const [accepted, setAccepted] = useState(false);
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleYesClick = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            await axios.post(`${apiUrl}/api/respond`, { response: "yes" });
            console.log("Response sent to backend");
        } catch (error) {
            console.error("Error sending response:", error);
        }
        setAccepted(true);
    };

    const handleNoHover = (e) => {
        // "Inch by inch" movement
        // We nudge the button slightly from its CURRENT position

        const nudgeAmount = 80; // The "inch" (pixels)

        // Get current coordinates
        // If it's the first time (not hovered yet), we need a starting point.
        // We can use the event client coordinates or just start from centerish (implies first jump might be larger)
        // Or simpler: Just modify state relative to OLD state.

        let currentX = noBtnPosition.x;
        let currentY = noBtnPosition.y;

        // If this is the FIRST hover, the state is {0,0}. 
        // We should set the initial fixed position to where it visually IS.
        // But getting that programmatically without refs is hard.
        // Hack: The first move, we just jump to a random spot nearby the MOUSE.

        if (!isHovered) {
            // First interaction: set near mouse but away
            currentX = e.clientX;
            currentY = e.clientY;
        }

        // Calculate random nudge
        let dx = (Math.random() - 0.5) * nudgeAmount * 2; // -80 to +80
        let dy = (Math.random() - 0.5) * nudgeAmount * 2;

        // Ensure it moves AT LEAST a bit (deadzone check)
        if (Math.abs(dx) < 20) dx = dx > 0 ? 30 : -30;
        if (Math.abs(dy) < 20) dy = dy > 0 ? 30 : -30;

        let newX = currentX + dx;
        let newY = currentY + dy;

        // Boundary checks (Viewport)
        const padding = 20;
        const btnWidth = 100;
        const btnHeight = 50;

        if (newX < padding) newX = padding + 20;
        if (newX > window.innerWidth - btnWidth - padding) newX = window.innerWidth - btnWidth - padding - 20;
        if (newY < padding) newY = padding + 20;
        if (newY > window.innerHeight - btnHeight - padding) newY = window.innerHeight - btnHeight - padding - 20;

        // Center exclusion (don't cover Yes button)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        if (Math.abs(newX - centerX) < 100 && Math.abs(newY - centerY) < 100) {
            // If too close to center, nudge it further away
            newX += (newX > centerX ? 50 : -50);
            newY += (newY > centerY ? 50 : -50);
        }

        setNoBtnPosition({ x: newX, y: newY });
        setIsHovered(true);
    };

    return (
        <div className="proposal-container">
            {!accepted ? (
                <div className="proposal-card">
                    <h1 className="proposal-title">Do you accept my proposal?</h1>

                    <div className="button-group">
                        <button className="btn btn-yes" onClick={handleYesClick}>
                            Yes
                        </button>

                        <motion.button
                            className="btn btn-no"
                            onMouseEnter={handleNoHover}
                            onClick={handleNoHover}
                            animate={isHovered ? {
                                x: noBtnPosition.x,
                                y: noBtnPosition.y,
                                position: 'fixed',
                                left: 0,
                                top: 0,
                                opacity: 1
                            } : {
                                x: 0,
                                y: 0,
                                position: 'relative'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            No
                        </motion.button>

                        {/* 
                           Correction: mixing motion animate with fixed position can be tricky.
                           Simpler approach for the "No" button:
                           Always make it fixed/absolute but initially positioned relative? 
                           No, easiest is:
                           If !isHovered, it sits in the flex container (static/relative).
                           Once isHovered, it becomes fixed at random coordinates.
                        */}
                    </div>
                </div>
            ) : (
                <div className="proposal-card">
                    <img src="/vaazhthukal-vaazhthukal-rajinikanth.gif" alt="Success" className="success-image" style={{ maxWidth: '100%', borderRadius: '10px' }} />
                    <p className="success-message">I knew you would say yes!</p>
                </div>
            )}
        </div>
    );
};

export default Proposal;

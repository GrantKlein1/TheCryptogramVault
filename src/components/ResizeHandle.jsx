import React, { useState, useEffect } from 'react';

const ResizeHandle = ({ onResize }) => {
    const handleMouseDown = (e) => {
        e.preventDefault();

        const startY = e.clientY;

        const handleMouseMove = (moveEvent) => {
            const deltaY = moveEvent.clientY - startY;
            onResize(deltaY);
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e) => {
        const startY = e.touches[0].clientY;

        const handleTouchMove = (moveEvent) => {
            const deltaY = moveEvent.touches[0].clientY - startY;
            onResize(deltaY);
        };

        const handleTouchEnd = () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
    };

    return (
        <div
            className="resize-handle"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="separator"
        >
            <div className="resize-line"></div>
        </div>
    );
};

export default ResizeHandle;

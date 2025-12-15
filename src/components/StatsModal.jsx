import React from 'react';
import './StatsModal.css';

function StatsModal({ isOpen, onClose, gameTimes }) {
    if (!isOpen) return null;

    // Calculate stats
    const totalGames = gameTimes.length;
    const bestTime = totalGames > 0 ? Math.min(...gameTimes) : 0;
    const averageTime = totalGames > 0 ? Math.round(gameTimes.reduce((a, b) => a + b, 0) / totalGames) : 0;

    // Prepare chart data (last 10 games)
    const recentGames = gameTimes.slice(-10);
    const maxTime = Math.max(...recentGames, 60); // Minimum scale of 60s for visual niceness

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content stats-content">
                <h2>Cryptologist Records</h2>

                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-label">Total Solved</span>
                        <span className="stat-value">{totalGames}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Best Time</span>
                        <span className="stat-value">{formatTime(bestTime)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Avg Time</span>
                        <span className="stat-value">{formatTime(averageTime)}</span>
                    </div>
                </div>

                <h3>Recent Performance</h3>
                <div className="chart-container">
                    {recentGames.length === 0 ? (
                        <div className="no-data">Complete a puzzle to see your chart!</div>
                    ) : (
                        <ChartSVG data={recentGames} maxVal={maxTime} formatTime={formatTime} />
                    )}
                </div>

                <button onClick={onClose} className="primary">Close Vault</button>
            </div>
        </div>
    );
}

function ChartSVG({ data, maxVal, formatTime }) {
    const width = 100; // percent
    const height = 100; // percent
    const chartHeight = 160; // internal pixels for calculation
    const barWidth = 6;
    const gap = 4;

    // Y-Axis Markers
    const yMarkers = [0, 0.5, 1]; // 0%, 50%, 100%

    // Calculate Coordinates
    // We map the 10 slots to specific X percentages
    const getX = (index) => (index * 10) + 5; // Center of 10% slice
    const getY = (val) => chartHeight - ((val / maxVal) * chartHeight);

    // Average Calc
    const average = data.length > 0 ? (data.reduce((a, b) => a + b, 0) / data.length) : 0;
    const avgY = getY(average);

    return (
        <div className="svg-wrapper">
            <div className="y-axis">
                {yMarkers.reverse().map(m => (
                    <div key={m} className="y-label" style={{ top: `${(1 - m) * 100}%` }}>
                        {formatTime(Math.round(maxVal * m))}
                    </div>
                ))}
                {data.length > 0 && (
                    <div
                        className="y-label avg-label"
                        style={{
                            top: `${(1 - (average / maxVal)) * 100}%`,
                            color: 'var(--primary-color)',
                            fontWeight: 'bold'
                        }}
                    >
                        Avg
                    </div>
                )}
            </div>
            <div className="svg-content">
                <svg viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {yMarkers.map(m => (
                        <line
                            key={m}
                            x1="0"
                            y1={chartHeight - (m * chartHeight)}
                            x2="100"
                            y2={chartHeight - (m * chartHeight)}
                            stroke="#333"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Bars */}
                    {data.map((val, i) => {
                        const h = (val / maxVal) * chartHeight;
                        return (
                            <rect
                                key={i}
                                x={(getX(i) - barWidth / 2)}
                                y={chartHeight - h}
                                width={barWidth}
                                height={h}
                                className="chart-bar"
                            >
                                <title>{formatTime(val)}</title>
                            </rect>
                        );
                    })}

                    {/* Average Line */}
                    {data.length > 0 && (
                        <g>
                            <line
                                x1="0"
                                y1={avgY}
                                x2="100"
                                y2={avgY}
                                stroke="var(--primary-color)"
                                strokeWidth="2"
                                strokeDasharray="5 3" // Dashed line for distinction
                                className="chart-line"
                            />
                            <title>Average: {formatTime(average)}</title>
                        </g>
                    )}

                    {/* Dots */}
                    {data.map((val, i) => (
                        <circle
                            key={i}
                            cx={getX(i)}
                            cy={getY(val)}
                            r="3"
                            className="chart-dot"
                        >
                            <title>{formatTime(val)}</title>
                        </circle>
                    ))}
                </svg>

                {/* X Axis Labels */}
                <div className="x-axis">
                    {data.map((_, i) => (
                        <div key={i} className="x-label" style={{ left: `${getX(i)}%` }}>{i + 1}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StatsModal;

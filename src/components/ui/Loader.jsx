import React from "react";

/**
 * Loader.jsx
 * Simple accessible loader component using an inline SVG spinner.
 *
 * Props:
 * - size (number): pixel size of the spinner (default 48)
 * - stroke (number): stroke width of the spinner (default 4)
 * - color (string): spinner color (default Tailwind blue-600)
 * - text (string|null): optional descriptive text shown next to the spinner
 * - fullscreen (boolean): if true, centers the loader in a fullscreen overlay
 */

const srOnly = {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    width: "1px",
    whiteSpace: "nowrap",
};

export default function Loader({
    size = 48,
    stroke = 4,
    color = "#2563eb",
    text = null,
    fullscreen = false,
}) {
    const containerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 8,
        ...(fullscreen
            ? {
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(255,255,255,0.6)",
                    zIndex: 9999,
                }
            : {}),
    };

    const spinnerWrapper = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    };

    // Track circle color (subtle)
    const trackColor = "rgba(0,0,0,0.08)";

    return (
        <div style={containerStyle} role="status" aria-busy="true" aria-live="polite">
            <div style={spinnerWrapper} aria-hidden="false">
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 50 50"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke={trackColor}
                        strokeWidth={stroke}
                    />
                    <path
                        d="M25 5
                             a20 20 0 0 1 0 40"
                        fill="none"
                        stroke={color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 25 25"
                            to="360 25 25"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </path>
                </svg>
            </div>

            {text ? (
                <span>
                    <span style={srOnly}>Cargando: </span>
                    <span>{text}</span>
                </span>
            ) : (
                <span style={srOnly}>Cargando</span>
            )}
        </div>
    );
}
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    app: 'var(--bg-app)',
                    card: 'var(--bg-tertiary)',
                    nav: 'var(--bg-nav)'
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)'
                },
                accent: {
                    brand: 'var(--brand)',
                    hover: 'var(--brand-hover)',
                    glow: 'var(--brand-glow)',
                    cyan: '#06b6d4',
                    purple: '#8b5cf6',
                    green: 'var(--success)',
                },
                border: {
                    primary: 'var(--border-color)',
                    accent: 'var(--border-accent)'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'marquee': 'marquee 30s linear infinite',
                'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
                'slideInLeft': 'slideInLeft 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'soft-pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
                'slideInLeft': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                }
            }
        },
    },
    plugins: [],
}

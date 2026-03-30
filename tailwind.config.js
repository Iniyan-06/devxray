/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'xray-bg':     '#080C18',
        'xray-navy':   '#0A0E1A',
        'xray-dark':   '#0d1526',
        'xray-panel':  '#101828',
        'xray-border': '#1a2c42',
        'xray-cyan':   '#00F5FF',
        'xray-blue':   '#4A90FF',
        'xray-amber':  '#FFB800',
        'xray-red':    '#FF4444',
        'xray-green':  '#00FF88',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon':        '0 0 10px rgba(0, 245, 255, 0.3), 0 0 20px rgba(0, 245, 255, 0.1)',
        'neon-strong': '0 0 20px rgba(0, 245, 255, 0.7), 0 0 40px rgba(0, 245, 255, 0.3)',
        'neon-amber':  '0 0 10px rgba(255, 184, 0, 0.4), 0 0 20px rgba(255, 184, 0, 0.2)',
        'neon-red':    '0 0 10px rgba(255, 68, 68, 0.4), 0 0 20px rgba(255, 68, 68, 0.2)',
        'neon-green':  '0 0 10px rgba(0, 255, 136, 0.4), 0 0 20px rgba(0, 255, 136, 0.2)',
        'neon-blue':   '0 0 10px rgba(74, 144, 255, 0.4), 0 0 20px rgba(74, 144, 255, 0.2)',
      },
      animation: {
        'scan-beam':    'scanBeam 2.5s linear infinite',
        'sonar-ping':   'sonarPing 4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'crt-flicker':  'crtFlicker 0.15s infinite',
        'count-up':     'countUp 1s ease-out forwards',
        'slide-in-up':  'slideInUp 0.5s ease-out forwards',
        'fade-in':      'fadeIn 0.6s ease-out forwards',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'charge':       'charge 1.5s ease-in-out',
        'beam-sweep':   'beamSweep 2s linear infinite',
        'node-light':   'nodeLight 0.4s ease-out forwards',
        'gradient-x':   'gradientX 4s ease-in-out infinite',
        'typewriter':   'typewriter 2s steps(40,end) forwards',
        'blink':        'blink 1s step-end infinite',
      },
      keyframes: {
        scanBeam: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        sonarPing: {
          '0%':   { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        crtFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.85' },
        },
        slideInUp: {
          '0%':   { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,245,255,0.3), 0 0 20px rgba(0,245,255,0.1)' },
          '50%':      { boxShadow: '0 0 25px rgba(0,245,255,0.7), 0 0 50px rgba(0,245,255,0.35)' },
        },
        charge: {
          '0%':   { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        beamSweep: {
          '0%':   { top: '-5%', opacity: '0' },
          '5%':   { opacity: '1' },
          '95%':  { opacity: '1' },
          '100%': { top: '105%', opacity: '0' },
        },
        nodeLight: {
          '0%':   { background: 'rgba(0,245,255,0)', boxShadow: 'none' },
          '50%':  { background: 'rgba(0,245,255,0.4)', boxShadow: '0 0 30px rgba(0,245,255,0.8)' },
          '100%': { background: 'rgba(0,245,255,0.15)', boxShadow: '0 0 15px rgba(0,245,255,0.5)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        typewriter: {
          'from': { width: '0' },
          'to':   { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
        countUp: {
          '0%':   { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}

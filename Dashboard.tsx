@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Vazirmatn:wght@300;400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", "Vazirmatn", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Inter", "Vazirmatn", sans-serif;
}

:root {
  --bg-dark: #0A0A0A;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --gold-primary: #FFD700;
  --gold-glow: rgba(255, 215, 0, 0.15);
  --success: #00FFA3;
  --danger: #FF4D4D;
  --accent-purple: #A855F7;
}

body {
  background-color: var(--bg-dark);
  color: white;
  font-family: var(--font-sans);
  margin: 0;
  min-height: 100vh;
  direction: rtl;
  overflow-x: hidden;
}

/* Atmospheric Accent Glows */
.glow-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  background: 
    radial-gradient(circle at 15% 20%, var(--gold-glow) 0%, transparent 40%),
    radial-gradient(circle at 85% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, var(--gold-glow) 0%, transparent 60%);
  animation: pulse-glow 10s infinite alternate ease-in-out;
}

@keyframes pulse-glow {
  0% { opacity: 0.6; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.1); }
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.gold-text {
  background: linear-gradient(135deg, #FFF5B7 0%, var(--gold-primary) 50%, #B8860B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom Candlestick */
.candle-up {
  background: linear-gradient(to top, #00FFA3, #00C8FF);
}
.candle-down {
  background: linear-gradient(to top, #FF4D4D, #FF8A00);
}

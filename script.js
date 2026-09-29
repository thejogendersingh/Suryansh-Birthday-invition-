// ===================================================
// BIRTHDAY INVITATION SCRIPT: ENVELOPE, MUSIC & CONFETTI
// ===================================================

// Set event target date for countdown: 4th October 2026, 06:00 PM
const targetDate = new Date('October 4, 2026 18:00:00');

// Elements
const videoPreloaderOverlay = document.getElementById('videoPreloaderOverlay');
const preloaderVideo = document.getElementById('preloaderVideo');
const heroSection = document.getElementById('heroSection');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicIcon = document.getElementById('musicIcon');
const confettiBtn = document.getElementById('confettiBtn');

// Countdown elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// State
let isOpened = false;
let isAudioPlaying = false;
let audioContext = null;
let musicInterval = null;

// ===================================================
// SYNTHESIZER MUSIC (Built-in Happy Birthday & Chords)
// No external MP3 file dependency needed!
// ===================================================
class BirthdaySynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.tempo = 140;
    this.noteTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single pleasant synth tone
  playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (!this.ctx || !this.isPlaying) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration - 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio node error", e);
    }
  }

  start() {
    this.init();
    this.isPlaying = true;
    
    // Happy Birthday melody notes (Frequencies in Hz)
    // "Happy Birthday to you..."
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;

    const melody = [
      { note: C4, dur: 0.35, pause: 400 },
      { note: C4, dur: 0.35, pause: 400 },
      { note: D4, dur: 0.7, pause: 600 },
      { note: C4, dur: 0.7, pause: 600 },
      { note: F4, dur: 0.7, pause: 600 },
      { note: E4, dur: 1.1, pause: 900 },

      { note: C4, dur: 0.35, pause: 400 },
      { note: C4, dur: 0.35, pause: 400 },
      { note: D4, dur: 0.7, pause: 600 },
      { note: C4, dur: 0.7, pause: 600 },
      { note: G4, dur: 0.7, pause: 600 },
      { note: F4, dur: 1.1, pause: 900 },

      { note: C4, dur: 0.35, pause: 400 },
      { note: C4, dur: 0.35, pause: 400 },
      { note: C5, dur: 0.8, pause: 700 },
      { note: A4, dur: 0.7, pause: 600 },
      { note: F4, dur: 0.7, pause: 600 },
      { note: E4, dur: 0.7, pause: 600 },
      { note: D4, dur: 1.1, pause: 900 },

      { note: B4, dur: 0.4, pause: 400 },
      { note: B4, dur: 0.4, pause: 400 },
      { note: A4, dur: 0.7, pause: 600 },
      { note: F4, dur: 0.7, pause: 600 },
      { note: G4, dur: 0.7, pause: 600 },
      { note: F4, dur: 1.3, pause: 1200 },
    ];

    let index = 0;
    const playNext = () => {
      if (!this.isPlaying) return;
      const item = melody[index];
      
      // Melody tone + soft warm sub-chord
      this.playTone(item.note, item.dur, 'triangle', 0.22);
      this.playTone(item.note / 2, item.dur * 0.8, 'sine', 0.12);

      index = (index + 1) % melody.length;
      this.noteTimer = setTimeout(playNext, item.pause);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.noteTimer) clearTimeout(this.noteTimer);
  }
}

const synthMusic = new BirthdaySynthesizer();

// ===================================================
// CELEBRATION CONFETTI CANNON
// ===================================================
function triggerCelebrationConfetti() {
  if (typeof confetti !== 'function') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: ['#00f3ff', '#ff007f', '#ffe600', '#9d00ff', '#ffffff']
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// Side Cannons
function shootSideCannons() {
  if (typeof confetti !== 'function') return;
  const end = Date.now() + 2 * 1000;
  const colors = ['#00f3ff', '#ff007f', '#ffe600'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// ===================================================
// VIDEO PRELOADER TRANSITION LOGIC
// ===================================================
const envelopeCursiveOverlay = document.getElementById('envelopeCursiveOverlay');
const whiteFlashOverlay = document.getElementById('whiteFlashOverlay');
let isVideoStarted = false;

// Preload video ready state
if (preloaderVideo) {
  preloaderVideo.load();
}

// When user taps/clicks, video starts playing instantly and ultra-smoothly
function startPreloaderVideo(e) {
  if (isVideoStarted) return;
  isVideoStarted = true;

  // 1. Immediately play video (muted keeps it 100% instant without browser audio pause delay)
  if (preloaderVideo) {
    const playPromise = preloaderVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Smoothly fade out the cursive text once video frame is playing
        if (envelopeCursiveOverlay) {
          envelopeCursiveOverlay.classList.add('hide-text');
        }
      }).catch(err => {
        console.warn("Autoplay playback error:", err);
        if (envelopeCursiveOverlay) {
          envelopeCursiveOverlay.classList.add('hide-text');
        }
      });
    }
  } else if (envelopeCursiveOverlay) {
    envelopeCursiveOverlay.classList.add('hide-text');
  }
}

const bgSong = document.getElementById('bgSong');

// Function to immediately play the song when preloader ends and hero appears
function playBirthdaySongNow() {
  if (!bgSong) return;
  bgSong.currentTime = 0;
  bgSong.volume = 0;
  const playPromise = bgSong.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isAudioPlaying = true;
      if (musicToggleBtn) musicToggleBtn.classList.remove('muted');
      
      // Smoothly fade in volume over 0.8s
      let vol = 0;
      const fadeInInterval = setInterval(() => {
        vol += 0.1;
        if (vol >= 0.85) {
          bgSong.volume = 0.85;
          clearInterval(fadeInInterval);
        } else {
          bgSong.volume = vol;
        }
      }, 60);
    }).catch(err => {
      console.warn("Audio autoplay blocked by browser policy:", err);
    });
  }
}

// When video finishes, transition to Hero Section with dreamy white glow
function showHeroAfterVideo() {
  if (isOpened) return;
  isOpened = true;

  // 1. Trigger subtle dreamy white glow flash
  if (whiteFlashOverlay) {
    whiteFlashOverlay.classList.add('flash-active');
  }

  setTimeout(() => {
    // 2. Play Birthday Song immediately in hero section
    playBirthdaySongNow();

    // 3. Confetti blast
    triggerCelebrationConfetti();

    // 4. Hide preloader overlay & reveal hero section seamlessly
    videoPreloaderOverlay.classList.add('hide-preloader');
    heroSection.classList.remove('hidden-hero');
    heroSection.classList.add('visible-hero');
    shootSideCannons();

    // 5. Start playing hero background video continuously on loop (always silent video)
    if (heroVideo) {
      heroVideo.currentTime = 0;
      heroVideo.muted = true; // muted as video audio was stripped and user only wants the song
      const heroPromise = heroVideo.play();
      if (heroPromise !== undefined) {
        heroPromise.catch(err => {
          console.warn("Hero video play error:", err);
        });
      }
    }

    // 6. Fade out the white glow smoothly revealing the invitation
    setTimeout(() => {
      if (whiteFlashOverlay) {
        whiteFlashOverlay.classList.remove('flash-active');
      }
    }, 250);
  }, 180);
}

// Touch or click anywhere to play video
if (videoPreloaderOverlay) {
  videoPreloaderOverlay.addEventListener('pointerdown', startPreloaderVideo);
  videoPreloaderOverlay.addEventListener('click', startPreloaderVideo);
}

// Once video finishes playing
if (preloaderVideo) {
  preloaderVideo.addEventListener('ended', showHeroAfterVideo);
}

// ===================================================
// MUSIC TOGGLE BUTTON (Controls the Birthday Song)
// ===================================================
musicToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!bgSong) return;

  if (isAudioPlaying) {
    bgSong.pause();
    isAudioPlaying = false;
    musicToggleBtn.classList.add('muted');
  } else {
    bgSong.play().then(() => {
      isAudioPlaying = true;
      musicToggleBtn.classList.remove('muted');
    }).catch(err => console.warn("Song play blocked", err));
  }
});

// ===================================================
// CONFETTI BUTTON IN HERO SECTION
// ===================================================
confettiBtn.addEventListener('click', () => {
  triggerCelebrationConfetti();
  shootSideCannons();
});

// ===================================================
// COUNTDOWN TIMER LOGIC (Ticks to 4th October 2026, 06:00 PM)
// ===================================================
function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance < 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Start live ticking countdown immediately
setInterval(updateCountdown, 1000);
updateCountdown();

// ===================================================
// SCRATCH & REVEAL INTERACTION FOR COUNTDOWN
// ===================================================
const scratchCanvas = document.getElementById('scratchCanvas');
const scratchRevealCard = document.getElementById('scratchRevealCard');
const scratchHint = document.getElementById('scratchHint');

function initScratchCard() {
  if (!scratchCanvas || !scratchRevealCard) return;

  const ctx = scratchCanvas.getContext('2d');
  const rect = scratchRevealCard.getBoundingClientRect();
  
  // High-DPI canvas resolution
  const dpr = window.devicePixelRatio || 1;
  scratchCanvas.width = rect.width * dpr;
  scratchCanvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  // Paint aesthetic realistic scratch-card silver/blue watercolor foil coating
  const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  grad.addColorStop(0, '#dbeafe');
  grad.addColorStop(0.3, '#bfdbfe');
  grad.addColorStop(0.7, '#93c5fd');
  grad.addColorStop(1, '#c7dcfb');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, rect.width, rect.height);

  // Realistic scratch foil subtle diagonal texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  for (let x = -rect.height; x < rect.width; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + rect.height, rect.height);
    ctx.stroke();
  }

  // Soft sparkle dusting
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  for (let i = 0; i < 24; i++) {
    const rx = (Math.sin(i * 99) * 0.5 + 0.5) * rect.width;
    const ry = (Math.cos(i * 33) * 0.5 + 0.5) * rect.height;
    ctx.beginPath();
    ctx.arc(rx, ry, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  let isScratching = false;
  let scratchedPixels = 0;
  let isCardRevealed = false;

  function scratch(e) {
    if (!isScratching || isCardRevealed) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const b = scratchCanvas.getBoundingClientRect();
    const x = clientX - b.left;
    const y = clientY - b.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch completion
    scratchedPixels++;
    if (scratchedPixels > 20 && !isCardRevealed) {
      isCardRevealed = true;
      scratchRevealCard.classList.add('revealed');
      triggerCelebrationConfetti(); // cute celebratory blast when revealed!
    }
  }

  scratchCanvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
  window.addEventListener('mouseup', () => { isScratching = false; });
  scratchCanvas.addEventListener('mousemove', scratch);

  scratchCanvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: true });
  window.addEventListener('touchend', () => { isScratching = false; });
  scratchCanvas.addEventListener('touchmove', scratch, { passive: true });
}

// Initialize scratch canvas once DOM / fonts are ready
window.addEventListener('load', initScratchCard);
setTimeout(initScratchCard, 500);

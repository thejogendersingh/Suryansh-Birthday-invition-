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
let isVideoStarted = false;

// When user taps/clicks, video starts playing
function startPreloaderVideo(e) {
  if (isVideoStarted) return;
  isVideoStarted = true;

  // Immediately fade out the cursive text when touched
  if (envelopeCursiveOverlay) {
    envelopeCursiveOverlay.classList.add('hide-text');
  }

  if (preloaderVideo) {
    preloaderVideo.currentTime = 0;
    preloaderVideo.muted = false; // allow video audio if present
    const playPromise = preloaderVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        // Fallback: in case browser strictly blocks unmuted autoplay
        console.warn("Autoplay with sound blocked, trying muted:", err);
        preloaderVideo.muted = true;
        preloaderVideo.play();
      });
    }
  }
}

const heroVideo = document.getElementById('heroVideo');

// When video finishes, transition to Hero Section
function showHeroAfterVideo() {
  if (isOpened) return;
  isOpened = true;

  // Start synth celebration music
  synthMusic.start();
  isAudioPlaying = true;
  musicToggleBtn.classList.remove('muted');
  musicIcon.textContent = '🔊';

  // Confetti blast
  triggerCelebrationConfetti();

  // Hide preloader overlay smoothly & reveal hero section
  videoPreloaderOverlay.classList.add('hide-preloader');
  heroSection.classList.remove('hidden-hero');
  heroSection.classList.add('visible-hero');
  shootSideCannons();

  // Start playing hero background video continuously on loop
  if (heroVideo) {
    heroVideo.currentTime = 0;
    heroVideo.muted = false; // play with sound if available
    const heroPromise = heroVideo.play();
    if (heroPromise !== undefined) {
      heroPromise.catch(err => {
        console.warn("Hero video play error, playing muted fallback:", err);
        heroVideo.muted = true;
        heroVideo.play();
      });
    }
  }
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
// MUSIC TOGGLE BUTTON
// ===================================================
musicToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (isAudioPlaying) {
    synthMusic.stop();
    isAudioPlaying = false;
    musicToggleBtn.classList.add('muted');
    musicIcon.textContent = '🔇';
  } else {
    synthMusic.start();
    isAudioPlaying = true;
    musicToggleBtn.classList.remove('muted');
    musicIcon.textContent = '🔊';
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
// COUNTDOWN TIMER LOGIC
// ===================================================
function updateCountdown() {
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

setInterval(updateCountdown, 1000);
updateCountdown();

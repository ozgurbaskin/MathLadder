// Tiny synthesized sound system using Web Audio API — no external files needed.

let audioCtx = null;

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

/** Play a short tone sequence */
function playTone(freq, duration = 0.1, type = 'sine', gain = 0.18) {
  try {
    const c = ctx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch {
    // Ignore audio errors silently
  }
}

export function playTap() {
  playTone(600, 0.06, 'sine', 0.12);
}

export function playCorrect() {
  playTone(523, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 100);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.15), 200);
}

export function playWrong() {
  playTone(200, 0.2, 'sawtooth', 0.1);
  setTimeout(() => playTone(180, 0.25, 'sawtooth', 0.1), 150);
}

export function playWin() {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.18, 'sine', 0.14), i * 90));
}

export function playDrag() {
  playTone(400, 0.05, 'triangle', 0.08);
}

export function playUnlock() {
  playTone(440, 0.15, 'sine', 0.13);
  setTimeout(() => playTone(660, 0.15, 'sine', 0.13), 120);
  setTimeout(() => playTone(880, 0.2, 'sine', 0.13), 240);
}

// ── Background music: ambient chord progression pad ──
let musicNodes = [];
let musicGain = null;
let musicPlaying = false;
let musicInterval = null;

const CHORDS = [
  [130.81, 164.81, 196.00, 261.63], // Cm   (C3, E3, G3, C4)
  [116.54, 146.83, 174.61, 233.08], // Bb   (Bb2, D3, F3, Bb3)
  [103.83, 130.81, 155.56, 207.65], // Ab   (Ab2, C3, Eb3, Ab3)
  [116.54, 146.83, 196.00, 233.08], // Bb/G (Bb2, D3, G3, Bb3)
];

function playChord(freqs, c, gain, fadeTime) {
  // Stop previous oscillators
  for (const node of musicNodes) {
    try { node.osc.stop(c.currentTime + fadeTime); } catch {}
  }
  musicNodes = [];

  for (const freq of freqs) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.001, c.currentTime);
    g.gain.linearRampToValueAtTime(0.025, c.currentTime + fadeTime);
    osc.connect(g);
    g.connect(gain);
    osc.start(c.currentTime);
    musicNodes.push({ osc, gain: g });
  }

  // Add a subtle sub bass
  const sub = c.createOscillator();
  const sg = c.createGain();
  sub.type = 'sine';
  sub.frequency.value = freqs[0] / 2;
  sg.gain.setValueAtTime(0.001, c.currentTime);
  sg.gain.linearRampToValueAtTime(0.015, c.currentTime + fadeTime);
  sub.connect(sg);
  sg.connect(gain);
  sub.start(c.currentTime);
  musicNodes.push({ osc: sub, gain: sg });
}

export function startMusic() {
  if (musicPlaying) return;
  try {
    const c = ctx();
    musicGain = c.createGain();
    musicGain.gain.value = 0.6;
    musicGain.connect(c.destination);

    let chordIdx = 0;
    playChord(CHORDS[0], c, musicGain, 2.0);

    musicInterval = setInterval(() => {
      chordIdx = (chordIdx + 1) % CHORDS.length;
      playChord(CHORDS[chordIdx], c, musicGain, 2.5);
    }, 4000);

    musicPlaying = true;
  } catch {
    // Ignore
  }
}

export function stopMusic() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  for (const node of musicNodes) {
    try { node.osc.stop(); } catch {}
  }
  musicNodes = [];
  musicGain = null;
  musicPlaying = false;
}

export function isMusicPlaying() {
  return musicPlaying;
}

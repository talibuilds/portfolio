/**
 * Bella Ciao — Web Audio API Piano Synthesizer
 * Generates a soft, recognizable piano rendition entirely in-browser.
 * No MP3 files, no CORS, no external dependencies — just pure audio synthesis.
 *
 * To replace with a real MP3: set `useMp3 = true` and place your file at /bella_ciao_piano.mp3
 */

const NOTE_FREQS = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61,
  'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25,
  'A2': 110.00, 'E2': 82.41, 'G2': 98.00, 'D2': 73.42,
  'F2': 87.31, 'B2': 123.47, 'C2': 65.41,
};

// Bella Ciao melody (Am key, slow expressive piano) — [note | null, beats]
const MELODY_RIGHT = [
  // Phrase 1: "Una mattina mi son svegliato"
  ['E4', 0.8], ['E4', 0.8], ['E4', 0.6], ['F4', 0.3], ['G4', 1.5], [null, 0.4],
  // Phrase 2: "O bella ciao, bella ciao"
  ['E4', 0.8], ['E4', 0.8], ['E4', 0.6], ['F4', 0.3], ['G4', 0.8],
  ['G4', 0.5], ['A4', 0.6], ['B4', 1.6], [null, 0.6],
  // Chorus: "Bella ciao, bella ciao"
  ['B4', 0.6], ['C5', 0.8], ['A4', 1.6], [null, 0.3],
  ['G4', 0.6], ['A4', 1.6], [null, 0.4],
  // "Bella ciao, ciao, ciao"
  ['B4', 0.6], ['C5', 0.8], ['A4', 1.6], [null, 0.3],
  ['G4', 0.6], ['E4', 1.6], [null, 0.4],
  // Ending descend
  ['E4', 0.5], ['F4', 0.5], ['G4', 0.8], ['F4', 0.5],
  ['E4', 0.5], ['D4', 0.6], ['E4', 2.4], [null, 2.0],
];

// Simple bass (root notes, sustained) — plays in parallel
const MELODY_BASS = [
  ['A2', 4.4],
  ['A2', 3.0], ['E3', 3.5], [null, 0.1],
  ['A3', 3.3], ['D3', 2.3],
  ['G3', 3.3], ['A3', 0.6],
  ['F3', 2.3], ['E3', 2.6],
  ['A2', 5.0], [null, 2.0],
];

const BPM = 60;
const BEAT = 60 / BPM;

export function createBellaCiaoSynth() {
  let audioCtx = null;
  let masterGain = null;
  let reverbGain = null;
  let isPlaying = false;
  let loopTimeoutId = null;
  let scheduledOscillators = [];
  let stateChangeCallback = null;
  let volume = 0.5;

  function ensureContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      // Master gain
      masterGain = audioCtx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(audioCtx.destination);

      // Simple delay-based reverb for warmth
      const delay1 = audioCtx.createDelay();
      delay1.delayTime.value = 0.12;
      const fb1 = audioCtx.createGain();
      fb1.gain.value = 0.18;
      const delay2 = audioCtx.createDelay();
      delay2.delayTime.value = 0.25;
      const fb2 = audioCtx.createGain();
      fb2.gain.value = 0.1;

      reverbGain = audioCtx.createGain();
      reverbGain.gain.value = 0.25;

      masterGain.connect(delay1);
      delay1.connect(fb1);
      fb1.connect(delay1);
      delay1.connect(reverbGain);

      masterGain.connect(delay2);
      delay2.connect(fb2);
      fb2.connect(delay2);
      delay2.connect(reverbGain);

      reverbGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPianoNote(freq, startTime, duration, vel = 0.3) {
    // Multi-harmonic oscillator for piano-like timbre
    const harmonics = [
      { type: 'sine',     mult: 1,     gain: 0.55 },
      { type: 'sine',     mult: 2,     gain: 0.18 },
      { type: 'sine',     mult: 3,     gain: 0.06 },
      { type: 'sine',     mult: 1.002, gain: 0.20 }, // chorus/detune for warmth
      { type: 'triangle', mult: 0.999, gain: 0.08 }, // softness
    ];

    // Note-level gain envelope (ADSR)
    const envelope = audioCtx.createGain();
    const attackEnd = startTime + 0.005;
    const decayEnd = startTime + 0.06;
    const sustainLevel = vel * 0.45;
    const releaseStart = startTime + duration * 0.85;
    const releaseEnd = startTime + duration + 0.15;

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(vel, attackEnd);
    envelope.gain.exponentialRampToValueAtTime(Math.max(sustainLevel, 0.001), decayEnd);
    envelope.gain.setValueAtTime(sustainLevel, releaseStart);
    envelope.gain.exponentialRampToValueAtTime(0.001, releaseEnd);

    envelope.connect(masterGain);

    for (const h of harmonics) {
      const osc = audioCtx.createOscillator();
      osc.type = h.type;
      osc.frequency.value = freq * h.mult;

      const hGain = audioCtx.createGain();
      hGain.gain.value = h.gain;

      osc.connect(hGain);
      hGain.connect(envelope);

      osc.start(startTime);
      osc.stop(releaseEnd + 0.05);
      scheduledOscillators.push(osc);
    }
  }

  function scheduleMelody() {
    ensureContext();
    const now = audioCtx.currentTime + 0.1;

    // Right-hand melody
    let t = now;
    for (const [note, beats] of MELODY_RIGHT) {
      const dur = beats * BEAT;
      if (note && NOTE_FREQS[note]) {
        playPianoNote(NOTE_FREQS[note], t, dur * 0.92, 0.32);
      }
      t += dur;
    }

    // Left-hand bass (softer, sustained)
    let bt = now;
    for (const [note, beats] of MELODY_BASS) {
      const dur = beats * BEAT;
      if (note && NOTE_FREQS[note]) {
        playPianoNote(NOTE_FREQS[note], bt, dur * 0.8, 0.12);
      }
      bt += dur;
    }

    // Total melody duration → schedule next loop
    const totalBeats = MELODY_RIGHT.reduce((s, [, b]) => s + b, 0);
    const totalDuration = totalBeats * BEAT;

    loopTimeoutId = setTimeout(() => {
      if (isPlaying) {
        scheduledOscillators = []; // old ones have stopped by now
        scheduleMelody();
      }
    }, totalDuration * 1000);
  }

  function notifyChange() {
    if (stateChangeCallback) stateChangeCallback(isPlaying);
  }

  return {
    play() {
      if (isPlaying) return;
      isPlaying = true;
      scheduleMelody();
      notifyChange();
    },
    pause() {
      if (!isPlaying) return;
      isPlaying = false;
      clearTimeout(loopTimeoutId);
      for (const osc of scheduledOscillators) {
        try { osc.stop(); } catch (_) { /* already stopped */ }
      }
      scheduledOscillators = [];
      notifyChange();
    },
    toggle() {
      if (isPlaying) this.pause(); else this.play();
    },
    get isPlaying() { return isPlaying; },
    setVolume(v) {
      volume = v;
      if (masterGain) masterGain.gain.value = v;
    },
    set onStateChange(cb) { stateChangeCallback = cb; },
  };
}

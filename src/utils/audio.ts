// Web Audio API helper for a beautiful, soft, organic ambient chime/music box sequence
// It synthesizes notes in a gentle C-Major / F-Major 7th pentatonic scale for a warm, romantic aura.

let audioCtx: AudioContext | null = null;
let intervalId: number | null = null;
let currentNoteIndex = 0;

const NOTES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00]; // Pentatonic melody
const CHORDS = [
  [130.81, 164.81, 196.00, 261.63], // C Major
  [174.61, 220.00, 261.63, 349.23], // F Major
  [196.00, 246.94, 293.66, 392.00], // G Major
  [220.00, 261.63, 329.63, 440.00], // A Minor
];

function playTone(freq: number, duration: number, type: 'sine' | 'triangle' = 'triangle', gainValue = 0.08) {
  if (!audioCtx) return;

  try {
    // Resume context if suspended
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // Create a gentle, warm tone (triangle with lowpass filter sounds like a sweet music box)
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Warm filtering
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, audioCtx.currentTime);

    // Fade in and out to prevent clipping
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    // Delay/Reverb effect simulated
    const delay = audioCtx.createDelay();
    delay.delayTime.setValueAtTime(0.3, audioCtx.currentTime);
    const delayGain = audioCtx.createGain();
    delayGain.gain.setValueAtTime(0.25, audioCtx.currentTime);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Feed output into delay hook
    gainNode.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn('Audio synthesis failed:', err);
  }
}

export function startAmbientMusic(onNotePlay?: (freq: number) => void) {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (intervalId) return;

    // Gentle arpeggio loop
    intervalId = window.setInterval(() => {
      if (!audioCtx) return;
      
      const currentTimePoint = currentNoteIndex % 16;
      const chordIndex = Math.floor(currentNoteIndex / 8) % CHORDS.length;

      // Play soft bass/drone note on beat 0 and 8
      if (currentTimePoint === 0) {
        const bassFreq = CHORDS[chordIndex][0];
        playTone(bassFreq, 3.5, 'sine', 0.05);
      }
      if (currentTimePoint === 4) {
        const midFreq = CHORDS[chordIndex][1];
        playTone(midFreq, 2.5, 'sine', 0.04);
      }

      // Arpeggiated melody note
      const melodyFreq = NOTES[Math.floor(Math.random() * NOTES.length)];
      playTone(melodyFreq, 1.5, 'triangle', 0.06);

      if (onNotePlay) {
        onNotePlay(melodyFreq);
      }

      currentNoteIndex++;
    }, 900); // Gentle slow tempo (approx 66 BPM)
  } catch (err) {
    console.warn('Start audio ambient failed:', err);
  }
}

export function stopAmbientMusic() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function triggerSparkleSound() {
  if (audioCtx && audioCtx.state !== 'suspended') {
    // Play a high, bright, tiny chime
    playTone(1054.81, 0.5, 'sine', 0.03); // High C pentatonic sparkle
  }
}

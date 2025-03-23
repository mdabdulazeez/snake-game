// Retro Snake Game Sound Effects
class SoundFX {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.audioContext.destination);
    }

    // Eat food sound (retro beep)
    playEatSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // Game over sound
    playGameOverSound() {
        // First tone - descending
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(220, this.audioContext.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.3);
        
        gain1.gain.setValueAtTime(1, this.audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        
        osc1.start();
        osc1.stop(this.audioContext.currentTime + 0.5);
        
        // Second tone - lower
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(110, this.audioContext.currentTime + 0.3);
        osc2.frequency.exponentialRampToValueAtTime(55, this.audioContext.currentTime + 0.6);
        
        gain2.gain.setValueAtTime(0.8, this.audioContext.currentTime + 0.3);
        gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
        
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        
        osc2.start(this.audioContext.currentTime + 0.3);
        osc2.stop(this.audioContext.currentTime + 0.8);
    }

    // Movement sound (light tick)
    playMoveSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 180;
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    // Start game sound
    playStartSound() {
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, this.audioContext.currentTime);
        osc.frequency.setValueAtTime(330, this.audioContext.currentTime + 0.1);
        osc.frequency.setValueAtTime(440, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        osc.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    // Toggle sound on/off
    setMuted(muted) {
        this.masterGain.gain.value = muted ? 0 : 0.3;
    }
} 
class PCM16WorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
    this.frameSize = 640; // ~40ms at 16kHz
    this.minFrameSize = 160; // ~10ms at 16kHz - minimum for commit
    this.buffer = [];
    this.inputSampleRate = 48000; // Default input sample rate
    this.lastProcessTime = 0;
    this.processInterval = 0.04; // Process every 40ms
  }

  static get parameterDescriptors() {
    return [];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length === 0) return true;

    const inputChannel = input[0];
    const inputLength = inputChannel.length;

    // Downsample from 48kHz to 16kHz using linear interpolation
    const downsampleRatio = this.inputSampleRate / this.targetSampleRate;
    const downsampledLength = Math.floor(inputLength / downsampleRatio);
    
    for (let i = 0; i < downsampledLength; i++) {
      const sourceIndex = Math.floor(i * downsampleRatio);
      const nextIndex = Math.min(sourceIndex + 1, inputLength - 1);
      const fraction = (i * downsampleRatio) - sourceIndex;
      
      // Linear interpolation
      const sample = inputChannel[sourceIndex] * (1 - fraction) + 
                    inputChannel[nextIndex] * fraction;
      
      this.buffer.push(sample);
    }

    // Process frames when we have enough samples
    while (this.buffer.length >= this.frameSize) {
      const frame = this.buffer.splice(0, this.frameSize);
      
      // Convert Float32 to Int16
      const int16Frame = new Int16Array(this.frameSize);
      for (let i = 0; i < this.frameSize; i++) {
        // Clamp to [-1, 1] and convert to 16-bit integer
        const clamped = Math.max(-1, Math.min(1, frame[i]));
        int16Frame[i] = Math.round(clamped * 32767);
      }

      // Send the frame to the main thread
      this.port.postMessage(int16Frame, [int16Frame.buffer]);
    }

    return true;
  }

  // Handle commit request
  handleCommit() {
    // Always send a proper frame for commit, even if buffer is small
    let frame;
    
    if (this.buffer.length >= this.minFrameSize) {
      // Use existing buffer data
      frame = this.buffer.splice(0, this.frameSize);
    } else {
      // Create a frame with available data + silence padding
      frame = new Array(this.frameSize).fill(0);
      for (let i = 0; i < Math.min(this.buffer.length, this.frameSize); i++) {
        frame[i] = this.buffer[i];
      }
      this.buffer = []; // Clear buffer
    }
    
    // Pad to exact frame size
    while (frame.length < this.frameSize) {
      frame.push(0);
    }
    
    // Convert Float32 to Int16
    const int16Frame = new Int16Array(this.frameSize);
    for (let i = 0; i < this.frameSize; i++) {
      const clamped = Math.max(-1, Math.min(1, frame[i]));
      int16Frame[i] = Math.round(clamped * 32767);
    }

    // Send the commit frame
    this.port.postMessage(int16Frame, [int16Frame.buffer]);
  }
}

registerProcessor('pcm16-worklet', PCM16WorkletProcessor);
class AudioPlayer {
  constructor(path) {
    this.path = path;
    this.audioContext = new AudioContext();
    this.offset = 0;
    this.audioBuffer = null;
    this.playing = false;
  }

  loadAudio = async () => {
    const response = await fetch(this.path);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  };

  play = () => {
    this.audioContext.resume();
    this.playing = true;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.audioContext.destination);
    source.loop = true;

    if (this.offset == 0) {
      source.start();
      this.offset = this.audioContext.currentTime;
    } else {
      source.start(0, this.audioContext.currentTime - this.offset);
    }
  };
}

export default AudioPlayer;

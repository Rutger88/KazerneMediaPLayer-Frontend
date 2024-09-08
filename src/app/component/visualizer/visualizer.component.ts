import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-visualizer',
  template: `<canvas #visualizerCanvas width="600" height="200"></canvas>`,
  standalone: true  // Make it standalone to prevent any complex imports
})
export class VisualizerComponent implements AfterViewInit {
  @Input() audioElement!: HTMLAudioElement;  // Get the audio element reference from the parent
  @ViewChild('visualizerCanvas') visualizerCanvas!: ElementRef<HTMLCanvasElement>;

  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private bufferLength!: number;
  private canvasCtx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    if (this.audioElement) {
      this.setupVisualizer();
    }
  }

  setupVisualizer() {
    // Set up the AudioContext and AnalyserNode
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;

    const source = this.audioContext.createMediaElementSource(this.audioElement);
    source.connect(this.analyser);
    source.connect(this.audioContext.destination);  // Ensure audio still plays to speakers

    this.canvasCtx = this.visualizerCanvas.nativeElement.getContext('2d')!;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.drawVisualizer();
  }

  drawVisualizer() {
    requestAnimationFrame(() => this.drawVisualizer());

    this.analyser.getByteFrequencyData(this.dataArray);

    const width = this.visualizerCanvas.nativeElement.width;
    const height = this.visualizerCanvas.nativeElement.height;
    this.canvasCtx.clearRect(0, 0, width, height);

    const barWidth = (width / this.bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    // Draw bars based on frequency data
    for (let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i] / 2;
      this.canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      this.canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
}

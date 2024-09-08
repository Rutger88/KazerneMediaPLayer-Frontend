import { Component, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-audio-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-visualizer.component.html',
  styleUrls: ['./audio-visualizer.component.scss'],
})
export class AudioVisualizerComponent implements AfterViewInit {
  @ViewChild('visualizerCanvas', { static: true }) visualizerCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() audioElement!: ElementRef<HTMLAudioElement>;  // Correctly receiving ElementRef

  ngAfterViewInit() {
    this.initializeAudioVisualizer();
  }

  initializeAudioVisualizer() {
    const canvas = this.visualizerCanvas.nativeElement;
    const canvasContext = canvas.getContext('2d')!;

    // Use the passed audioElement.nativeElement for visualization
    const audioElement = this.audioElement.nativeElement;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight: number;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
        canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    audioElement.onplay = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    };
  }
}

import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

@Component({
  selector: 'app-audio-visualizer',
  standalone: true,
  templateUrl: './audio-visualizer.component.html',
  styleUrls: ['./audio-visualizer.component.scss']
})
export class AudioVisualizerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('audioElement', { static: true }) audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  @ViewChild('version', { static: true }) versionElement!: ElementRef<HTMLSpanElement>;

  private audioMotion!: AudioMotionAnalyzer;

  ngAfterViewInit(): void {
    // Initialize the spectrum analyzer
    this.audioMotion = new AudioMotionAnalyzer(this.container.nativeElement, {
      source: this.audioElement.nativeElement,
      height: window.innerHeight - 50,
      mode: 3,
      barSpace: 0.6,
      ledBars: true
    });

    // Display module version
    this.versionElement.nativeElement.innerText = `v${AudioMotionAnalyzer.version}`;
  }

  onPlayLiveStream(): void {
    const audio = this.audioElement.nativeElement;
    audio.src = 'https://icecast2.ufpel.edu.br/live';
    audio.play();
  }

  onFileUpload(event: any): void {
    const fileBlob = event.target.files[0];
    const audio = this.audioElement.nativeElement;
    
    if (fileBlob) {
      audio.src = URL.createObjectURL(fileBlob);
      audio.play();
    }
  }

  ngOnDestroy(): void {
    if (this.audioMotion) {
      this.audioMotion.destroy();
    }
  }
}

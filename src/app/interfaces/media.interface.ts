// src/app/interfaces/media.interface.ts
export interface Media {
  id: number;           // Unique identifier for the media
  title: string;        // Title of the media
  url: string;          // URL to the media resource
  duration: number;     // Duration of the media in seconds
  description?: string; // Optional description of the media
  thumbnail?: string;   // Optional URL to a thumbnail image
  type?: string; 
}

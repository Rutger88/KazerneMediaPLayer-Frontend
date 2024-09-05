import { Media } from './media.interface';

export interface Library {
    id: number;           // Unique identifier for the library
    name: string;         // Name of the library
    user: {
      id: number;         // Owner's user ID
      username: string;   // Owner's username
    };
    mediaFiles: Media[];  // List of media files in the library
  }
  
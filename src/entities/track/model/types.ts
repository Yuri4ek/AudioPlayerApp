export type Track = {
  id: string;
  file: string;
  title: string;
  artist: string;
  /** Embedded artwork extracted to the artwork directory. */
  art?: boolean;
  /** Lyrics saved to the lyrics directory. */
  lyrics?: boolean;
  /** Tags were read from the file. */
  scanned?: boolean;
};

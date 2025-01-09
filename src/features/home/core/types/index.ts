export type TTotalSpace = {
  image: {
    size: number;
    latestDate: string;
  };
  document: {
    size: number;
    latestDate: string;
  };
  video: {
    size: number;
    latestDate: string;
  };
  audio: {
    size: number;
    latestDate: string;
  };
  other: {
    size: number;
    latestDate: string;
  };
  used: number;
  all: number;
};

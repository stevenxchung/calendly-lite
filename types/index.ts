export interface TimeBlock {
  start: Date | null;
  end: Date | null;
}

export interface TimeBlocks {
  [start: string]: TimeBlock;
}

export interface SelectedTimes {
  [date: string]: TimeBlocks;
}

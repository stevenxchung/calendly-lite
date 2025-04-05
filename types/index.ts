interface TimeBlock {
  start: Date | null;
  end: Date | null;
}

export interface SelectedTimes {
  [key: string]: TimeBlock;
}

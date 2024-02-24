export interface Timer {
  name: string;
  ms: number;
  execute(...args: any[]): void;
}

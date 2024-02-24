export interface Event {
  scriptName: string;
  eventName: string;
  execute(...args: any[]): void;
  executeManual?(...args: any[]): void;
}

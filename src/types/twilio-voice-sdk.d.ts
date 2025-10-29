declare module '@twilio/voice-sdk' {
  export class Device {
    constructor(token: string, options?: any);
    on(event: string, handler: (...args: any[]) => void): void;
    once(event: string, handler: (...args: any[]) => void): void;
    connect(params?: Record<string, any>): any;
    destroy(): void;
  }
}



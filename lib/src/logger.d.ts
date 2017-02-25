export declare type Logger = (message: string, ...args: any[]) => void;
export declare function setLogger(logger: Logger): void;
export declare function log(message: string, ...args: any[]): void;

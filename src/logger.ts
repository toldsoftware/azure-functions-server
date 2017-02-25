export type Logger = (message: string, ...args: any[]) => void;

let _logger: Logger = (message: string, ...args: any[]) => {
    console.log(message, ...args);
};

export function setLogger(logger: Logger) {
    _logger = logger;
}

export function log(message: string, ...args: any[]) {
    _logger && _logger(message, ...args);
}
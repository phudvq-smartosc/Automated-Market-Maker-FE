export enum Level {
    INFO = "alert-error",
    WARNING = "alert-warning",
    ERROR = "alert-info",
    SUCCESS = "alert-success"
}

export interface Alert{ 
    description: string,
    level: Level,
    duration: number,
}
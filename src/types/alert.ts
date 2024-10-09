export enum Level {
    INFO = "alert-info",
    WARNING = "alert-warning",
    ERROR = "alert-error",
    SUCCESS = "alert-success"
}

export interface Alert{ 
    description: string,
    level: Level,
    duration: number,
}
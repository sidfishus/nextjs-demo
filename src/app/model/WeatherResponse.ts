
export type WeatherResponse = {
    temperaturePerHourOver24HourPeriod: number[];
    windSpeedPerHourOver24HourPeriod: number[];
    generationTimeMs: string; // For debugging
}
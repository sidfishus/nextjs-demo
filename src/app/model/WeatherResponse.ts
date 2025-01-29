import type { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';

export type WeatherResponse = {
    temperaturePerHourOver24HourPeriod: number[];
    windSpeedPerHourOver24HourPeriod: number[];
}

export const ConvertWeatherResponse = (responses: WeatherApiResponse[]): WeatherResponse => {

    const response=responses[0];
    const hourly=response.hourly()!;

    return {
        temperaturePerHourOver24HourPeriod: Array.from(hourly.variables(0)!.valuesArray()!),
        windSpeedPerHourOver24HourPeriod: Array.from(hourly.variables(1)!.valuesArray()!),
    };
}
import type { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';

export type WeatherResponsePodCurrent = {
    time: Date;
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
}

export type WeatherResponsePodHourly = {
    time: Date[]|null;
    temperature: Float32Array;
    precipitation: Float32Array;
}

export type WeatherResponsePod = {
    current: WeatherResponsePodCurrent;
    hourly: WeatherResponsePodHourly;
}

export const ConvertWeatherResponsesToPod = (responses: WeatherApiResponse[]): WeatherResponsePod => {

    // Copy and paste from https://github.com/open-meteo/typescript

    const response=responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;

    console.log(JSON.stringify(response));

    const weatherData:WeatherResponsePod = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
            weatherCode: current.variables(1)!.value(),
            windSpeed: current.variables(2)!.value(),
            windDirection: current.variables(3)!.value()
        },
        hourly: {
            // time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            //     (t) => new Date((t + utcOffsetSeconds) * 1000)
            // ),
            time: null,
            temperature: hourly.variables(0)!.valuesArray()!, // `.valuesArray()` get an array of floats
            precipitation: hourly.variables(1)!.valuesArray()!,
        },
    };

    return weatherData;
}
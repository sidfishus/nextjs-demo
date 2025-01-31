import {ConvertWeatherResponse, WeatherResponse} from "@/app/model/WeatherResponse";
import {fetchWeatherApi} from "openmeteo";


export const GetWeather = (latitude: number, longitude: number) => {
    const params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ["temperature_2m", "wind_speed_10m"],
        "forecast_days": 1
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    // The API returns a class and this can't be sent from a server component to a client component
    const responsePromise = new Promise<WeatherResponse>((resolve, reject) => {
        fetchWeatherApi(url, params).then(responses => {
            resolve(ConvertWeatherResponse(responses));
        }).catch(error => {
            reject(error);
        })
    });

    return responsePromise;
}
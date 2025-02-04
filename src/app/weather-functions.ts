import {WeatherResponse} from "@/app/model/WeatherResponse";


//sidtodo turn in to an action?
//sidtodo remove conversion functions
export const GetWeather = async (latitude: number, longitude: number) => {

    const url=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m&forecast_days=1`;

    const res=await fetch(url, { next: { revalidate: 60*10 } });
    //sidtodo check 200

    const dataRaw=await res.json();

    const response:WeatherResponse={
        temperaturePerHourOver24HourPeriod: dataRaw.hourly.temperature_2m,
        windSpeedPerHourOver24HourPeriod: dataRaw.hourly.wind_speed_10m,
        todoRemove: dataRaw.generationtime_ms
    }

    console.log(response);

    return response;
}
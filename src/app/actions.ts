
//https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

"use server";

import {WeatherResponse} from "@/app/model/WeatherResponse";

export const GetWeather = async ({latitude, longitude, cache} : {latitude: number, longitude: number, cache: boolean}) => {

    const url=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m&forecast_days=1`;

    // There's no point caching the weather for the many long / lat user entered values
    const fetchProps = cache
        ? { next: { revalidate: 20 } }
        : { next: { cache: "no-cache" } };

    const res=await fetch(url, fetchProps);
    //sidtodo check 200

    const dataRaw=await res.json();

    const response:WeatherResponse={
        temperaturePerHourOver24HourPeriod: dataRaw.hourly.temperature_2m,
        windSpeedPerHourOver24HourPeriod: dataRaw.hourly.wind_speed_10m,
    }

    console.log(response);

    return response;
}

import type { NextApiRequest, NextApiResponse } from 'next'
import type { WeatherResponse } from "@/app/model/WeatherResponse";
import {GetWeather} from "@/app/weather-functions";


//https://nextjs.org/docs/pages/building-your-application/routing/api-routes
export async function GET(
    req: NextApiRequest
) {
    //sidtodo validate
    const longitude=parseFloat(req.query["longitude"]! as string);
    const latitude=parseFloat(req.query["latitude"]! as string);
    if(isNaN(longitude) || isNaN(latitude)) {
        return Response.json({},{status: 422, statusText: "Invalid longitude or latitude."})
    }

    try {
        const weather=await GetWeather(latitude,longitude);
        return Response.json(weather);
    }
    catch(err) {
        //sidtodo??
        return Response.json({},{status: 422, statusText: "Invalid longitude or latitude."})
    }
}
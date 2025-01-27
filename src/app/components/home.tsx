"use client";

import {WeatherResponsePod} from "@/app/WeatherResponsePod";
import {use} from "react";

export type HomeProps = {
    weatherPromise: Promise<WeatherResponsePod>
};

export const Home = (props: HomeProps) => {

    const { weatherPromise } = props;

    const weather = use(weatherPromise);

    console.log("weather: " + JSON.stringify(weather));

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        </div>
    );
}
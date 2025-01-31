
import {Home} from "@/app/components/home";
import {Suspense} from "react";
import {GetWeather} from "@/app/weather-functions";

export default async function HomeServer() {

  // Tamworth
  const latitude=52.63570;
  const longitude=-1.69109;

  //sidtodo: the suspense.
  return (
      <Suspense fallback={<p>Loading weather...</p>}>
        <Home weatherPromise={GetWeather(latitude,longitude)} latitude={latitude} longitude={longitude} />
      </Suspense>
  );
}
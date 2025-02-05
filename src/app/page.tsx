
import {HomeClient} from "@/app/components/home-client";
import {GetWeather} from "@/app/actions";

export default async function HomeServer() {

  // Tamworth
  const latitude=52.63570;
  const longitude=-1.69109;

  const weather=await GetWeather({latitude,longitude,cache: true});

  return (
        <HomeClient latitude={latitude} longitude={longitude} weather={weather} />
  );
}
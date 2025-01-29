import {fetchWeatherApi} from "openmeteo";
import {Home} from "@/app/components/home";
import {Suspense} from "react";
import {ConvertWeatherResponse, WeatherResponse} from "@/app/model/WeatherResponse";

export default async function HomeServer() {

  // Tamworth
  const params = {
    "latitude": 52.63570,
    "longitude": -1.69109,
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

  //sidtodo: the suspense.
  return (
      <Suspense fallback={<p>Loading weather...</p>}>
        <Home weatherPromise={responsePromise} />
      </Suspense>
  );
}
import {fetchWeatherApi} from "openmeteo";
import {Home} from "@/app/components/home";
import {Suspense} from "react";
import {ConvertWeatherResponsesToPod, WeatherResponsePod} from "@/app/WeatherResponsePod";

export default async function HomeServer() {

  const params = {
    "latitude": 52.52,
    "longitude": 13.41,
    "hourly": ["temperature_2m", "rain", "showers"],
    "forecast_days": 1
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  // The API returns a class and this can't be sent from a server component to a client component
  const responsePromise = new Promise<WeatherResponsePod>((resolve, reject) => {
    fetchWeatherApi(url, params).then(responses => {
      resolve(ConvertWeatherResponsesToPod(responses));
    }).catch(error => {
      reject(error);
    })
  });

  return (
      <Suspense fallback={<p>Loading weather...</p>}>
        <Home weatherPromise={responsePromise} />
      </Suspense>
  );
}
"use client";

import {WeatherResponse} from "@/app/model/WeatherResponse";
import {ChangeEvent, Fragment, ReactElement, ReactNode, useRef, useState} from "react";
import {Area, AreaChart, CartesianGrid, Label, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {useServerAction} from "@/app/hooks/useServerAction";
import {GetWeather} from "@/app/actions";
import {ResettableTimer} from "@sidfishus/cslib";

export type HomeProps = {
    latitude: number;
    longitude: number;
    weather: WeatherResponse;
};

export const HomeClient = (props: HomeProps) => {

    const [weather,setWeather] = useState<WeatherResponse>(props.weather);

    const [latitude,setLatitude]=useState<string>(props.latitude.toString());
    const [longitude,setLongitude]=useState<string>(props.longitude.toString());

    const [loadWeatherAsync, isLoadingWeather] = useServerAction(GetWeather);

    const loadWeatherDelay = useRef(ResettableTimer()).current;

    if(isLoadingWeather)
        return <div>Loading</div>;

    const temperatureData=ConvertTemperatureToChartData(weather.temperaturePerHourOver24HourPeriod);

    const loadWeatherWithDelay = (latitude: number, longitude: number) => {
        loadWeatherDelay(() => {
            loadWeatherAsync({latitude: latitude, longitude: longitude, cache: false}).then((res: unknown) => {
                setWeather(res as WeatherResponse);
            });
        },1000);
    };

    const onLatitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLatitude(event.target.value);
        const parsedLatitude=parseFloat(event.target.value);
        const parsedLongitude=parseFloat(longitude);
        if(!isNaN(parsedLatitude) && !isNaN(parsedLongitude)) {
            loadWeatherWithDelay(parsedLatitude,parsedLongitude);
        }
    }

    const onLongitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLongitude(event.target.value);
        const parsedLongitude=parseFloat(event.target.value);
        const parsedLatitude=parseFloat(latitude);
        if(!isNaN(parsedLatitude) && !isNaN(parsedLongitude))
            loadWeatherWithDelay(parsedLatitude,parsedLongitude);
    }

    return (
        <div>
            <div>Show the weather at the following location:</div>
            <div className="mb-[3px]">
                <div className={"inline-block w-[100px]"}>Latitude</div>
                <input className="border-[1px] border-gray-300" type={"number"} onChange={onLatitudeChange}
                       value={latitude}/>
            </div>
            <div>
                <div className={"inline-block w-[100px]"}>Longitude</div>
                <input className="border-[1px] border-gray-300" type={"number"} onChange={onLongitudeChange}
                       value={longitude}/>
            </div>
            <br/>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    height={200}
                    data={temperatureData}
                    syncId="anyId"
                    margin={{
                        bottom: 20
                    }}
                >
                    <defs>
                        <linearGradient id={`color1`} x1="0" y1="0" x2="0" y2="1">
                            <stop stopColor={"red"} stopOpacity={1}></stop>
                            <stop offset="33%" stopColor={"orange"} stopOpacity={1}></stop>
                            <stop offset="66%" stopColor={"blue"} stopOpacity={1}></stop>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="hour">
                        <Label value="Time (24 hour)" offset={-10} position="insideBottom"/>
                    </XAxis>
                    <YAxis>
                        <Label value="Temperature (C)" offset={25} position="insideBottomLeft" angle={-90}/>
                    </YAxis>
                    <Area type="monotone" dataKey="temperatureInCelsius" stroke="none" fill={`url(#color1)`}/>
                </AreaChart>
            </ResponsiveContainer>

            <div className={"ml-[20]"}>
                <WindLineChart windSpeedPerHourOver24HourPeriod={weather.windSpeedPerHourOver24HourPeriod}
                               height={400} minY={0} width={340} numberOfYTicks={4}
                />
            </div>

            <div className={"pt-16"}>Time to generate weather on the server: {weather.generationTimeMs}ms</div>
        </div>
    );
}
const ConvertTemperatureToChartData = (temperaturePerHourOver24HourPeriod: number[]) => {

    return temperaturePerHourOver24HourPeriod.map((iterTemp, i) => {
        return {
            hour: i,
            temperatureInCelsius: iterTemp,
        };
    });
}

type WindLineChartProps = {
    windSpeedPerHourOver24HourPeriod: number[];
    minY: number;
    height: number;
    width: number;
    numberOfYTicks: number;
}

const WindLineChart = (props: WindLineChartProps) => {

    const { windSpeedPerHourOver24HourPeriod, minY, height, width, numberOfYTicks } = props;

    const xIncrement=width / 25;

    const yTickerHeight = CalculateYTickerHeight(windSpeedPerHourOver24HourPeriod, minY, numberOfYTicks);

    const yTotalHeight=yTickerHeight*numberOfYTicks;

    const coords:Point[]=[];
    windSpeedPerHourOver24HourPeriod.forEach((iterWind, i) => {

        const x =(i+1)*xIncrement; // Time

        const y = iterWind <= minY
            ? minY
            : ((iterWind - minY) / yTotalHeight)*height;

        coords.push({
            x: x,
            y: y
        });
    });


    return (
        <div className={"w-full h-[400px] relative"}>
            <div id={"outline"}>
                <div className={"absolute h-[2px] bg-red-500"} style={{width: width + "px", top: height + "px"}}></div>
                <div className={"absolute w-[2px] bg-red-500"} style={{height: height + "px"}}/>
                <div className={"absolute w-[2px] bg-red-500"}
                     style={{height: height + "px", left: `calc(${width}px - 2px)`}}/>
            </div>
            <div id={"cross-list"}>
                {WindChartCrossList(coords)}
            </div>
            <div id={"cross-connecting-lines"}>
                {WindChartConnectingLines(coords)}
            </div>
            <div id={"x-axis"}>
                {WindChartXAxis(coords, height)}
            </div>
            <div id={"x-axis-vertical-lines"}>
                {XGridLines(coords, height)}
            </div>
            <div id={"y-axis-and-lines"}>
                {WindChartYAxisAndLines(height, yTickerHeight, numberOfYTicks, minY, width)}
            </div>
            {XAxisText()}
            {YAxisText(height)}
        </div>
    );
}

const CalculateYTickerHeight = (windSpeedPerHourOver24HourPeriod: number[], minY: number, numberOfYTicks: number) => {

    const maxWind=windSpeedPerHourOver24HourPeriod.reduce((prev,cur) => {
        return cur > prev ? cur : prev;
    });

    const yRange = maxWind - minY;

    // Try and work out a reasonable ticker height.
    // This is actually quite tricky and the method below works reasonably well, but it could certainly be improved.
    let yTickerHeight = yRange / numberOfYTicks;

    if(yTickerHeight < 10) {
        // Round to the nearest 0.5

        const dividedByPoint5=yTickerHeight/0.5;
        if(Math.ceil(dividedByPoint5) == dividedByPoint5)
            yTickerHeight+=0.5;
        else {

            let num=0;
            for(let i=0;i<20;++i) {
                num+=0.5;
                if(num > yTickerHeight) {
                    yTickerHeight = num;
                    break;
                }
            }
        }
    }
    else if(yTickerHeight < 100) {
        // Round to the nearest 5

        const modulo5=Math.floor(yTickerHeight)%5;
        if(modulo5==0)
            yTickerHeight=Math.floor(yTickerHeight)+5;
        else
            yTickerHeight=Math.floor(yTickerHeight)+ modulo5;
    }

    return yTickerHeight;
}

type Point = {
    x: number;
    y: number;
}

const WindChartCrossList = (coords: Point[]) => {
    const crossLength = 10;
    const crossThickness = 1;

    return coords.map((iterCoord, i) => {

        const left = iterCoord.x - (crossLength / 2);

        return (
            <Fragment key={i}>
                <div className={`absolute bg-blue-500 h-[1px] rotate-45 z-40`}
                     style={{
                         left: left + "px",
                         bottom: `calc(${iterCoord.y}px - ${crossThickness / 2}px)`,
                         width: crossLength
                     }}></div>
                <div className={`absolute bg-blue-500 h-[1px] -rotate-45 z-40`}
                     style={{
                         left: left + "px",
                         bottom: `calc(${iterCoord.y}px - ${crossThickness / 2}px)`,
                         width: crossLength
                     }}></div>
            </Fragment>
        );
    });
}

const WindChartConnectingLines = (coords: Point[]) => {
    const lines: ReactNode[]=[];
    coords.forEach((iterCoord,i) => {
        if(i != 0) {

            const thickness = 1;
            // Credits: https://stackoverflow.com/questions/8672369/how-to-draw-a-line-between-two-divs

            const prevCoord = coords[i - 1];

            const x1=prevCoord.x;
            const x2=iterCoord.x;

            const y1=prevCoord.y;
            const y2=iterCoord.y;

            const length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
            // center
            const cx = ((x1 + x2) / 2) - (length / 2);
            const cy = ((y1 + y2) / 2) - (thickness / 2);
            // angle
            const angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);

            lines.push((
                <div key={i}
                    className={"p-0 m-0 bg-amber-500 leading-[1px] absolute z-10"}
                    style={{height: thickness + "px", left: cx + "px", bottom:cy + "px",width:length + "px",transform:"rotate(" + -angle + "deg)"}}
                />
            ));
        }
    });

    return lines;
}

const WindChartXAxis = (coords: Point[], chartHeight: number) => {
    const timesList = coords.map((iterCoord, i) => {
        return (
            <Fragment key={i}>
                <div className={`absolute bg-red-500 w-[1px] h-[6px]`}
                     style={{left: `calc(${iterCoord.x}px - 0.5px)`, top: chartHeight + "px"}}>
                    <div className={"pt-[4px] flex justify-center"} style={{fontSize: "10px", textAlign: "center"}}
                    >
                        {i.toString().padStart(2, "0")}
                    </div>
                </div>
            </Fragment>
        );
    });

    return timesList;
}

const XGridLines = (coords: Point[], chartHeight: number) => {

    const lines: ReactElement[]=[];

    coords.forEach((iterCoord, i) => {

        lines.push((
            <hr key={i} className={"absolute z-0"}
                 style={{left: `calc(${iterCoord.x}px - 1px)`, height: chartHeight,
                 borderWidth: "1px", borderStyle: "dashed", borderColor: "rgba(127,127,127,0.15)"}}>
            </hr>
        ));
    })

    return lines;
}

const WindChartYAxisAndLines = (height: number, yTickerHeight: number, numberOfYTicks: number, minY: number,
                                width: number) => {

    const lines=[];

    for(let i=1;i<=numberOfYTicks;i++){

        const percentageUp=i/numberOfYTicks;

        lines.push((
            <Fragment key={i}>
                <div className={"absolute w-[4px] h-[1px] bg-red-600"} style={{
                    left: "-4px", bottom: `calc(${percentageUp * height}px - 1px)`
                }}>
                    <div className={"-mt-[7px] -ml-[16px] flex justify-center left-2"}
                         style={{fontSize: "10px", textAlign: "center"}}
                    >
                        {(i * yTickerHeight) + minY}
                    </div>
                </div>
                <hr className={"absolute z-0"} style={{
                    bottom: `calc(${percentageUp * height}px - 1px)`,
                    width: `${width}px`,borderWidth: "1px", borderStyle: "dashed", borderColor: "rgba(127,127,127,0.15)"
                }}>
                </hr>
            </Fragment>
        ));
    }

    return lines;
}

const XAxisText = () => {

    return (
        <div id={"x-axis-text"} className={"absolute flex justify-center -bottom-[40px] left-[125px]"} style={{
            textAlign: "center"
        }}>
            Time (24 hour)
        </div>
    );
}

const YAxisText = (height: number) => {

    return (
        <div id={"y-axis-text"} className={"absolute -rotate-90 flex justify-center -left-[100px]"} style={{
            top: `${height / 2}px`
        }}>
            Wind Speed (KM/H)
        </div>
    );
}
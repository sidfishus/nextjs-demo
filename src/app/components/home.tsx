"use client";

import {WeatherResponse} from "@/app/model/WeatherResponse";
import {Fragment, ReactElement, ReactNode, use} from "react";
import {Area, AreaChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export type HomeProps = {
    weatherPromise: Promise<WeatherResponse>
};

export const Home = (props: HomeProps) => {

    const { weatherPromise } = props;

    const weather = use(weatherPromise);

    const temperatureData=ConvertTemperatureToChartData(weather.temperaturePerHourOver24HourPeriod);
    const windSpeedData=ConvertWindSpeedToChartData(weather.windSpeedPerHourOver24HourPeriod);

    return (
        <div>
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
                    <Area type="monotone" dataKey="temperatureInCelsius" stroke="none" fill={`url(#color1)`} />
                </AreaChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    width={500}
                    height={200}
                    data={windSpeedData}
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
                    <Area type="monotone" dataKey="windInKmh" stroke="none" fill={`url(#color1)`} />
                </AreaChart>
            </ResponsiveContainer>

            <WindLineChart windSpeedPerHourOver24HourPeriod={weather.windSpeedPerHourOver24HourPeriod}
                           height={400} minY={2} width={350}
            />
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

const ConvertWindSpeedToChartData = (windSpeedPerHourOver24HourPeriod: number[]) => {

    return windSpeedPerHourOver24HourPeriod.map((iterTemp, i) => {
        return {
            hour: i,
            windInKmh: iterTemp,
        };
    });
}

type WindLineChartProps = {
    windSpeedPerHourOver24HourPeriod: number[];
    minY: number;
    height: number;
    width: number;
}

const WindLineChart = (props: WindLineChartProps) => {

    const { windSpeedPerHourOver24HourPeriod, minY, height, width } = props;

    const maxWind=windSpeedPerHourOver24HourPeriod.reduce((prev,cur) => {
        return cur > prev ? cur : prev;
    });

    const yRange = maxWind - minY;
    const yRangeWith10Percent=yRange * 1.1;

    const yIncrement=width / 25;

    const coords:Point[]=[];
    windSpeedPerHourOver24HourPeriod.forEach((iterWind, i) => {

        const x =(i+1)*yIncrement; // Time

        const y = iterWind <= minY
            ? minY
            : ((iterWind - minY) / yRangeWith10Percent)*height;

        coords.push({
            x: x,
            y: y
        });
    });



    return (
        <div className={"w-full h-[400] relative"}>
            <div>
                <div className={"absolute h-[2] bg-red-500"} style={{width: width + "px", top: height + "px"}}></div>
                <div className={"absolute w-[2] bg-red-500"} style={{height: height + "px"}}/>
                <div className={"absolute w-[2] bg-red-500"}
                     style={{height: height + "px", left: `calc(${width}px - 2px)`}}/>
            </div>
            <div>
                {WindChartCrossList(coords)}
            </div>
            <div>
                {WindChartConnectingLines(coords)}
            </div>
            <div>
                {WindChartXAxis(coords, height)}
            </div>
        </div>
    );
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
                {/*
                <div className={`absolute bg-red-500 h-[4] w-[4]`}
                     style={{
                         left: `calc(${iterCoord.x}px - 2px)`,
                         bottom: `calc(${iterCoord.y}px - 2px)`,
                     }}></div>*/}

                <div className={`absolute bg-blue-500 h-[1] rotate-45`}
                     style={{
                         left: left + "px",
                         bottom: `calc(${iterCoord.y}px - ${crossThickness / 2}px)`,
                         width: crossLength
                     }}></div>
                <div className={`absolute bg-blue-500 h-[1] -rotate-45`}
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
                <div
                    className={"p-0 m-0 bg-amber-500 leading-[1] absolute"}
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
                <div className={`absolute bg-red-500 w-[1] h-[6]`}
                     style={{left: `calc(${iterCoord.x}px - 0.5px)`, top: chartHeight + "px"}}>
                    <div className={"pt-[4] flex justify-center"} style={{fontSize: "10px", textAlign: "center"}}
                    >
                        {i.toString().padStart(2, "0")}
                    </div>
                </div>
            </Fragment>
        );
    });

    return timesList;
}
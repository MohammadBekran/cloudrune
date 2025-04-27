"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { USAGE_LIMIT_BY_GB } from "@/features/home/core/constants";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { calculatePercentage, convertFileSize } from "@/lib/utils";

const chartConfig = {
  size: {
    label: "Size",
  },
  used: {
    label: "Used",
    color: "white",
  },
} satisfies ChartConfig;

const UsageChart = ({ used = 0 }: { used: number }) => {
  const percentage = calculatePercentage({ sizeInBytes: used });

  const chartData = [
    {
      name: "used",
      value: percentage,
      fill: chartConfig.used.color,
    },
  ];

  return (
    <Card className="flex items-center rounded-[20px] p-5 bg-brand text-white md:flex-col xl:flex-row">
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-[180px] text-white xl:w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={(Number(percentage) / 100) * 360 + 90}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-white/20 last:fill-brand"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-4xl font-bold"
                        >
                          {percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white/70"
                        >
                          Space used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardHeader className="flex-1 items-center py-0 px-3 sm:px-5 lg:p-1 xl:pr-5">
        <CardTitle className="h3 font-bold md:text-center lg:text-left">
          Available Storage
        </CardTitle>
        <CardDescription className="subtitle-1 w-full mt-2 text-white/70 md:text-center lg:text-left">
          {used
            ? convertFileSize({ sizeInBytes: used })
            : `${USAGE_LIMIT_BY_GB}GB`}{" "}
          / {USAGE_LIMIT_BY_GB}GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default UsageChart;

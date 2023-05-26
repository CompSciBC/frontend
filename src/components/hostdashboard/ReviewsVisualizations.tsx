/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Pie,
  Cell,
  PieChart
} from 'recharts';
import { PieChartData } from '../../utils/dtos';
import { Grid } from '@mui/material';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];

export function LineGraphVis() {
  return (
    <AreaChart
      width={400}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  );
}

const pieChartData: PieChartData[] = [
    {
        "name": "amenities",
        "count": 7,
        "ratingFrequencyMap": {
            "1": 3,
            "3": 1,
            "5": 3
        }
    },
    {
        "name": "value-for-money",
        "count": 7,
        "ratingFrequencyMap": {
            "1": 2,
            "2": 2,
            "3": 1,
            "5": 2
        }
    },
    {
        "name": "host-communication-timeliness",
        "count": 7,
        "ratingFrequencyMap": {
            "2": 3,
            "3": 1,
            "4": 2,
            "5": 1
        }
    },
    {
        "name": "guidebook",
        "count": 7,
        "ratingFrequencyMap": {
            "1": 1,
            "3": 1,
            "4": 2,
            "5": 3
        }
    },
    {
        "name": "location",
        "count": 7,
        "ratingFrequencyMap": {
            "1": 2,
            "2": 1,
            "3": 2,
            "4": 1,
            "5": 1
        }
    },
    {
        "name": "comfort",
        "count": 7,
        "ratingFrequencyMap": {
            "1": 1,
            "2": 2,
            "3": 2,
            "4": 1,
            "5": 1
        }
    },
    {
        "name": "cleanliness",
        "count": 7,
        "ratingFrequencyMap": {
            "1": 1,
            "2": 1,
            "3": 2,
            "4": 1,
            "5": 2
        }
    },
    {
        "name": "host-communication-ease",
        "count": 7,
        "ratingFrequencyMap": {
            "1": 1,
            "2": 2,
            "3": 2,
            "5": 2
        }
    }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface PieChartDatum {
  name: string;
  value: number;
}

function convertToChartDataFormat(ratingFrequencyMap: { [key: string]: number }): PieChartDatum[]{
    const data:PieChartDatum[] = [];
     for (const key in ratingFrequencyMap) {
      data.push(
          {
              name: key,
              value: ratingFrequencyMap[key],
          }
      );
  }
    return data;
}

export function PieChartVis() {
  // const data:PieChartDatum[] = [];
  // for (const key in pieChartData) {
  //     data.push(
  //         {
  //             name: pieChartData[key].toString(),
  //             value: pieChartData[key],
  //         }
  //     );
  // }
  // console.log(data);
//   const data1 = [
//     { name: 'Group A', value: 400 },
//     { name: 'Group B', value: 300 },
//     { name: 'Group C', value: 300 },
//     { name: 'Group D', value: 200 }
//   ];
  return (
    <>
        {pieChartData.map((metricData, index) => {
            const data = convertToChartDataFormat(metricData.ratingFrequencyMap);
            return (
            
                <Grid key = {index} item xs={12} sm={12} md={6} lg={3}>
                    <p >{metricData.name}</p>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={data}
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </Grid>
            );
        })}
        
    </>
    
    
  );
}

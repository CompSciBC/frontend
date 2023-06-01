/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pie, Cell, PieChart, ResponsiveContainer } from 'recharts';
import { PieChartData } from '../../utils/dtos';
import { Grid, Typography } from '@mui/material';
import { metricsNames } from './HostReviewsDashboard';

const COLORS = ['#ff4545', '#ffa534', '#ffe234', '#b7dd29', '#57e32c'];

interface PieChartDatum {
  name: string;
  value: number;
}

export interface PieChartVisProps {
  propertyQualityMetrics: PieChartData;
}

export function PieChartVis({ propertyQualityMetrics }: PieChartVisProps) {
  const data: PieChartDatum[] = [];
  for (const key in propertyQualityMetrics.ratingFrequencyMap) {
    data.push({
      name: propertyQualityMetrics.ratingFrequencyMap[key].toString(),
      value: propertyQualityMetrics.ratingFrequencyMap[key]
    });
  }
  return (
    <Grid item xs={12} sm={12} md={6} lg={3}>
      <Typography
        sx={{
          fontFamily: 'Roboto',
          fontWeight: 500,
          fontSize: '18px',
          color: 'grey'
        }}
      >
        {metricsNames.get(propertyQualityMetrics.name)?.friendlyName}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
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
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Grid>
  );
}

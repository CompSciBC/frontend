/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Pie,
  Cell,
  PieChart,
  ResponsiveContainer,
  TooltipProps,
  Tooltip
} from 'recharts';
import { PieChartData } from '../../utils/dtos';
import { Box, Grid, Typography } from '@mui/material';
import { metricsNames } from './HostReviewsDashboard';
// for recharts v2.1 and above
import {
  ValueType,
  NameType
} from 'recharts/types/component/DefaultTooltipContent';
const COLORS = ['#ff4545', '#ffa534', '#ffe234', '#b7dd29', '#57e32c'];

interface PieChartDatum {
  name: string;
  value: number;
}

export interface PieChartVisProps {
  propertyQualityMetrics: PieChartData;
}

// {
//   "name": "2",
//   "value": 2,
//   "payload": {
//       "payload": {
//           "name": "2",
//           "value": 2
//       },
//       "fill": "#b7dd29",
//       "stroke": "#fff",
//       "cx": "50%",
//       "cy": "50%",
//       "name": "2",
//       "value": 2
//   },
//   "dataKey": "value"
// }
const CustomTooltip = (
  { active, payload, label }: TooltipProps<ValueType, NameType>,
  friendlyName: String
) => {
  if (active) {
    console.log(payload);
    console.log(label);
    return (
      <div className="custom-tooltip">
        <Box
          sx={{
            width: 100,
            backgroundColor: 'rgba(243, 246, 244, 0.8)'
          }}
          p={1}
        >
          <Typography variant="body1" fontSize={12}>
            {`${payload?.[0].value} guests gave this attribute a ${payload?.[0].name} / 5 rating`}
          </Typography>
        </Box>
      </div>
    );
  }

  return null;
};

export function PieChartVis({ propertyQualityMetrics }: PieChartVisProps) {
  const data: PieChartDatum[] = [];
  for (const key in propertyQualityMetrics.ratingFrequencyMap) {
    console.log('propertyQualityMetrics.ratingFrequencyMap');
    console.log(propertyQualityMetrics.ratingFrequencyMap);
    data.push({
      name: key,
      value: propertyQualityMetrics.ratingFrequencyMap[key]
    });
  }

  console.log('data');
  console.log(data);
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
          <Tooltip content={<CustomTooltip />} />
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

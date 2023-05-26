/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PieChartData } from '../../utils/dtos';
import { Grid } from '@mui/material';
import { PieChartVis } from './ReviewsVisualizations';

export interface PropertyMetricsVisualizerProps {
    pieChartDataList: { [key: string]: PieChartData}
}

export function PropertyMetricsVisualizer({
    pieChartDataList
  }: PropertyMetricsVisualizerProps){
    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };
    return(
        <Box sx={{ mt: 2 }}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <Grid container spacing={2}>
                {Object.keys(pieChartDataList).map((property, index) => (
                <Grid key={index} item xs={4}>
                    <p> {property} </p>
                    <PieChartVis />
                </Grid>
                ))}
            </Grid>
        </Box>
        
    );
}
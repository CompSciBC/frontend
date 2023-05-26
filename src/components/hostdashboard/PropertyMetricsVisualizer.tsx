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
    const propertyNames: string[] = Object.keys(pieChartDataList);
    const [property, setProperty] = React.useState(propertyNames.at(0));

    const handleChange = (event: SelectChangeEvent) => {
        setProperty(event.target.value);
    };

    

    return(
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                    {/* <InputLabel id="property-select-label">Property</InputLabel> */}
                    <Select
                        // labelId="property-select-label"
                        value={property}
                        // label="Property"
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                    >
                        {Object.keys(pieChartDataList).map((propertyName, index) => (
                            <MenuItem key= {index} value={propertyName}>{propertyName}</MenuItem>
                        ))}
                    </Select>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <PieChartVis/>
                {/* {Object.keys(pieChartDataList).map((property, index) => (
                    <PieChartVis key={index}/>
                ))} */}
            </Grid>
        </Box>
        
    );
}
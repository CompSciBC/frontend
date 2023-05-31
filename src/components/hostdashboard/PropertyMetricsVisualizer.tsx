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
    pieChartDataList: { [key: string]: PieChartData[]}
    // pieChartDataList: Map<string, PieChartData[]>
}

export function PropertyMetricsVisualizer({
    pieChartDataList
  }: PropertyMetricsVisualizerProps){
    const propertyNames: string[] = Object.keys(pieChartDataList);
    const [property, setProperty] = React.useState<string>(propertyNames.at(0)!);

    const [pieChartData, setPieChartData] = React.useState<PieChartData[]>(pieChartDataList[property]);
    const handleChange = (event: SelectChangeEvent) => {
        setProperty(event.target.value);
        setPieChartData(pieChartDataList[property]);
    };
    // console.log(pieChartData);
    

    return(
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                    {/* <InputLabel id="property-select-label">Property</InputLabel> */}
                    <Select
                        value={property}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                    >
                        {Object.keys(pieChartDataList).map((propertyName, index) => (
                            <MenuItem key= {index} value={propertyName}>{propertyName}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={5} md={5} lg={5}>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3} display='flex'>
                    <p>&nbsp;Negative&nbsp;</p>
                    <Box
                        sx={{
                            width: 300,
                            height: 20,
                            background: 'linear-gradient(to right, #ff4545, #ffa534, #ffe234, #b7dd29, #57e32c)',
                        }}
                    />
                    <p>&nbsp;Positive&nbsp;</p>
                </Grid>
                
            </Grid>

            <Grid container spacing={2}>
                {pieChartData.map((metrics, index) => (
                    <PieChartVis key={index} propertyQualityMetrics = {metrics}/>
                ))}
            </Grid>
            
        </Box>
        
    );
}
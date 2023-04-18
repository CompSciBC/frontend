/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import propertiesJson from './mock_data_delete_later/properties.json';

export interface GanttChartProps {
  hostId: string;
  ganttStart: Date;
  ganttDuration: number;
}

interface CellProps {
  cellContent?: string;
  cellColor?: string;
  cellWidth?: string;
}

export default function GanttChart({
  hostId,
  ganttStart,
  ganttDuration
}: GanttChartProps) {
  const weekday = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];
  const colors = [theme.color.lime, theme.color.white];
  const rows = [];
  // const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs('03-01-2023', 'MM-DD-YYYY')
  );
  const properties = propertiesJson.data;
  const initialEndDate = startDate!.add(ganttDuration, 'day');
  const [endDate, setEndDate] = useState<Dayjs | null>(initialEndDate);
  let currentDay = startDate!.subtract(1, 'day');
  for (let y = 0; y < properties.length; y++) {
    // Build the cells in an array
    const cells = [];
    let cellContent;
    let cellColor;

    for (let x = 0; x < ganttDuration; x++) {
      if (y === 0) {
        if (x > 0) {
          const day = weekday[(currentDay.toDate().getDay() + x - 1) % 7];
          cells.push(
            <Cell>
              {day} <br /> {currentDay?.month() + 1}/{currentDay?.date()}
            </Cell>
          );
        } else {
          cells.push(<Cell />);
        }
      } else {
        const property = properties[y - 1];
        if (x === 0) {
          cellContent = property.name;
          cells.push(<Cell cellWidth="200px"> {cellContent}</Cell>);
        } else {
          cellContent = undefined;
          cellColor = colors[Math.floor(Math.random() * colors.length)];
          cells.push(<Cell cellColor={cellColor}> {cellContent}</Cell>);
        }
      }
      currentDay = currentDay.add(1, 'day');
    }
    // Put them in the row
    rows.push(<tr>{cells}</tr>);
  }
  return (
    <>
      <Box sx={{ display: 'inline' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ m: 1 }}
          />
          <DatePicker
            label="End"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            sx={{ m: 1 }}
          />
        </LocalizationProvider>
      </Box>
      <Container>
        <table>
          <tbody>{rows}</tbody>
        </table>
      </Container>
    </>
      

  );
}

const Cell = styled('td')<CellProps>`
  /* width: 100px; */
  width: ${(props) => (props.cellWidth ? props.cellWidth : `75px`)};
  height: 50px;
  border: 1px solid #ddd;
  text-align: center;
  background-color: ${(props) => (props.cellColor ? props.cellColor : `none`)};
  font-weight: bold;
  padding: 5px;
`;

const Container = styled.div`
  width: 80vw;
  /* height: 190px; */
  overflow-x: scroll;
  white-space: nowrap;
`;
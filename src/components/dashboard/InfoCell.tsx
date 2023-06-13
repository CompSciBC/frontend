import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { memo, useContext } from 'react';
import AppContext from '../../context/AppContext';
import { DashboardCellProps } from './Dashboard';
import DashboardCellWrapper from './DashboardCellWrapper';

function InfoCell({ className, cell }: DashboardCellProps) {
  const { reservation } = useContext(AppContext);

  return (
    <Container
      className={className}
      cell={cell}
      child={
        reservation && (
          <>
            <PropertyName>{reservation.property.name}</PropertyName>
            <PropertyAddress>
              {reservation.property.address.line1}{' '}
              {reservation.property.address.line2}
            </PropertyAddress>
          </>
        )
      }
    />
  );
}

const Container = styled(DashboardCellWrapper)`
  flex-direction: column;
  padding: 8px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const TextBox = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PropertyName = styled(TextBox)`
  ${theme.font.displayLarge}
`;

const PropertyAddress = styled(TextBox)`
  ${theme.font.displaySmall}
`;

export default memo(InfoCell);

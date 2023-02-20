import styled from '@emotion/styled';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { paramRoute, routes } from '../../index';
import { ReservationDetail } from '../../utils/dtos';
import { theme } from '../../utils/styles';

interface ReservationCardProps {
  className?: string;
  reservationDetail: ReservationDetail;
}

function ReservationCard({
  className,
  reservationDetail
}: ReservationCardProps) {
  const { setReservationDetail } = useContext(AppContext);
  const { id, checkIn, address, image } = reservationDetail;
  const streetAddress: string = address.split(',')[0];

  const checkInDate = new Date(checkIn).toLocaleDateString('default', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const checkInTime = new Date(checkIn).toLocaleTimeString('default', {
    timeStyle: 'short'
  });

  return (
    <Wrapper
      className={className}
      image={image ?? ''}
      to={paramRoute(routes.dashboard, id)}
      onClick={() => setReservationDetail(reservationDetail)}
    >
      <Container>
        <CheckInInfoBox>
          <CheckInDate>{`Check In : ${checkInDate}`}</CheckInDate>
          <CheckInTime>{checkInTime}</CheckInTime>
        </CheckInInfoBox>
        <AddressInfoBox>
          <div>{`YOUR RENTAL : ${streetAddress}`}</div>
        </AddressInfoBox>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled(Link)<{ image: string }>`
  padding: 12px;
  border-radius: 12px;
  background-image: ${(props) => `url(${props.image})`};
  text-decoration: none;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  width: 100%;
  height: 100%;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 24px); // 24px = 2 x Container row-gap
  max-width: fit-content;
  row-gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, #262626 0%, rgba(4, 4, 4, 0.21) 73.96%);
  color: white;
`;

const CheckInInfoBox = styled(InfoBox)`
  width: fit-content;
`;

const CheckInDate = styled.div`
  ${theme.font.displayLarge}
`;

const CheckInTime = styled.div`
  ${theme.font.caption}
`;

const AddressInfoBox = styled(InfoBox)`
  ${theme.font.subHeading}

  div {
    width: calc(100%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default ReservationCard;

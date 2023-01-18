import styled from '@emotion/styled';
import { ReservationProperty } from '../../utils/dtos';
import { theme } from '../../utils/styles';

interface ReservationCardProps {
  className?: string;
  reservationProperty: ReservationProperty;
}

function ReservationCard({
  className,
  reservationProperty
}: ReservationCardProps) {
  const { checkIn, address, image } = reservationProperty;

  const checkInDate = new Date(checkIn).toLocaleDateString('default', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const checkInTime = new Date(checkIn).toLocaleTimeString('default', {
    timeStyle: 'short'
  });

  return (
    <Wrapper className={className} image={image ?? ''}>
      <Container>
        <CheckInInfoBox>
          <CheckInDate>{`Check In : ${checkInDate}`}</CheckInDate>
          <CheckInTime>{checkInTime}</CheckInTime>
        </CheckInInfoBox>
        <AddressInfoBox>
          <div>{`YOUR RENTAL : ${address.split(',')[0]}`}</div>
        </AddressInfoBox>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ image: string }>`
  padding: 12px;
  border-radius: 12px;
  background-image: ${(props) => `url(${props.image})`};
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

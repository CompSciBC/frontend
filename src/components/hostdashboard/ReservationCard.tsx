/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

export interface ReservationCardProps {
  propertyName: string;
  propertyPhoto: string;
  primaryGuestName: string;
  reservationStartDate: string;
  reservationEndDate: string;
}

export default function ReservationCard({
  propertyName,
  propertyPhoto,
  primaryGuestName,
  reservationStartDate,
  reservationEndDate
}: ReservationCardProps) {
    const checkInDate = new Date(reservationStartDate);
    const checkOutDate = new Date(reservationEndDate);
  return (
    <Container>
        <GuestInfo>
            <p>FirstName L.</p>
            <p>{checkInDate.getMonth() + 1}/{checkInDate.getDate()} - {checkOutDate.getMonth() + 1}/{checkOutDate.getDate()}</p>
      </GuestInfo>
      <ImageContainer>
        <img src={propertyPhoto} />
      </ImageContainer>
        <SendButton> 💬 Message </SendButton>
        <PropertyName> <p> property name {propertyName} </p> </PropertyName>
    </Container>
  );
}

const Container = styled.div`
  /* padding: 20px 0; */
  margin: 0px 6px;
  display: inline-block;
  width: 300px;
  height: 90%;
  border: 1px solid grey;
  border-radius: 16px;
`;

const SendButton = styled.div`
  position: relative;
  top: 12%;
  right: 93%;
  background: ${theme.color.red};
  height: 20;
  width: 35%;
  text-align: center;
  display: inline-block;
  border-radius: 16px;
  padding: 10px;
  text-transform: uppercase;
  ${theme.font.subHeading}
  color: ${theme.color.white}
`;

const PropertyName = styled.div`
  position: relative;
  bottom: 5%;
  left: 50%;

  width: 45%;
  /* background: pink; */

  text-align: center;
  
  white-space: initial; //make text wrap to next line
  
  ${theme.font.caption}
  font-weight: bold;
  color: ${theme.color.gray}
`;

const GuestInfo = styled.div`

  position: relative;
  top: 0%;
  left: 0%;
  padding: 10% 0%;
  
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
  height: 120px;
  width: 45%;
  text-align: center;
  display: inline-block;
  
  ${theme.font.body}
`;

const ImageContainer = styled.image`
  position: relative;
  top: 0px;
  left: 0.5px;
  /* background: cyan; */
  height: 120px;
  width: 55%;
  /* text-align: right; */
  /* padding: 6% 0; */
  display: inline-block;
  
  
  img {
    width: 100%;
    height: 100%;
    display: block; // remove extra space below image
    object-fit: cover;
    border-radius: 0px 16px 0px 0px;
    float: right;

    /* margin-left: auto;
    margin-right: auto; */
  }
`;



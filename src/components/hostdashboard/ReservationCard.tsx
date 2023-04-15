/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { Link } from 'react-router-dom';

export interface ReservationCardProps {
  propertyName: string;
  propertyPhoto: string;
  primaryGuestName: string;
  reservationStartDate: number;
  reservationEndDate: number;
}

export default function ReservationCard({
  propertyName,
  propertyPhoto,
  primaryGuestName,
  reservationStartDate,
  reservationEndDate
}: ReservationCardProps) {
  return (
    <Container>
      {/* <p>{propertyName}</p>
            <p>{primaryGuestName}</p>
            <p>{reservationStartDate}</p>
            <p>{reservationEndDate}</p> */}
      <GuestInfo></GuestInfo>
      <ImageContainer>
        <img src={propertyPhoto} />
      </ImageContainer>
        <SendButton> 💬 Message </SendButton>
        <PropertyName> <p> Most words are short & do not need to break </p> </PropertyName>
    </Container>
  );
}

const Container = styled.div`
  /* padding: 20px 0; */
  margin: 0px 6px;
  display: inline-block;
  width: 350px;
  height: 95%;
  border: 1px solid grey;
  border-radius: 16px;

  /* ${theme.font.body} */
`;

const SendButton = styled.div`
  position: relative;
  top: 18%;
  right: 97%;
  background: ${theme.color.red};
  height: 20;
  width: 40%;
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
  /* background: purple; */
  height: 120px;
  width: 45%;
  text-align: center;
  display: inline-block;
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



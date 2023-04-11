/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

export interface ReservationCardProps {
    propertyName: string;
    primaryGuestName: string;
    reservationStartDate: number;
    reservationEndDate: number;
}

export default function ReservationCard({
    propertyName,
    primaryGuestName,
    reservationStartDate,
    reservationEndDate
}: ReservationCardProps) {
    return(
        <Container>
            {/* <p>{propertyName}</p>
            <p>{primaryGuestName}</p>
            <p>{reservationStartDate}</p>
            <p>{reservationEndDate}</p> */}
            <GuestInfo></GuestInfo>
            <ImageContainer>
            <img
                src="/images/mountain-cabin.jpg"
            />
            </ImageContainer>
            {/* <SendButton></SendButton>
            <Timeframe> {reservationStartDate} - {reservationEndDate} </Timeframe> */}
            
            
        </Container>
    );

}

const Container = styled.div`
    /* padding: 20px 0; */
    margin: 8px 6px;
    display:inline-block;
    width: 350px;
    height: 180px;
    border: 2px solid grey;
    text-align:left;
    ${theme.font.body}
`;


// const Image = styled.div`
//     position:relative;
//     top:-99px;
//     background: cyan;
//     height:120px;
//     width: 50%;
//     text-align:center;
//     display: inline-block;
// `;

const Timeframe = styled.div`
    position:relative;
    bottom:160px;
    left:50%;
    background: pink;
    height:35%;
    width: 50%;
    padding: 6% 0;
    text-align: center;
`;

const GuestInfo = styled.div`
    position:relative;
    top:0%;
    left:0%;
    background: purple;
    height:120px;
    width: 45%;
    text-align:center;
    display: inline-block;
`;

const ImageContainer = styled.image`
    position:relative;
    top:0%;
    left:0%;
    background: cyan;
    height:120px;
    width: 55%;
    text-align:center;
    /* padding: 6% 0; */
    display: inline-block;
    img {
        max-width: 100%;
        max-height: 100%;
        display: block; // remove extra space below image
        object-fit: cover;
        margin-left: auto;
        margin-right: auto;
    }
`;

const SendButton = styled.div`
    position:relative;
    top:-99px;
    left:0%;
    background: gold;
    height:35%;
    width: 50%;
    padding: 6% 0;
    text-align: center;
`;
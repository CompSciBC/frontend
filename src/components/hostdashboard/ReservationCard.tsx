/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { server } from '../../index';
import { User } from '../../utils/dtos';
import Button from '@mui/material/Button';

export interface ReservationCardProps {
  reservationId: string;
  propertyName: string;
  propertyId: string;
  primaryGuestEmail: string;
  reservationStartDate: string;
  reservationEndDate: string;
}

export default function ReservationCard({
  reservationId,
  propertyName,
  propertyId,
  primaryGuestEmail,
  reservationStartDate,
  reservationEndDate
}: ReservationCardProps) {
  const checkInDate = new Date(reservationStartDate);
  const checkOutDate = new Date(reservationEndDate);
  const chatLink = `/reservations/${reservationId}/chat`;
  const [propertyPhoto, setPropertyPhoto] = useState();
  useMemo(() => {
    fetch(`${server}/api/guidebook/${propertyId}/images`)
      .then(async (res) => {
        return await res.json();
      })
      .then((data) => {
        setPropertyPhoto(data[0]);
      });
  }, [propertyId]);
  const [primaryGuest, setPrimaryGuest] = useState<string>();
  const [newGuest, setNewGuest] = useState<boolean>(false);
  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${server}/api/users?index=email&id=${primaryGuestEmail}`
      );
      const body = await response.json();
      const data: User = body.data[0];
      try {
        const primaryGuestName = `${data.firstName} ${data.lastName}`;
        setPrimaryGuest(primaryGuestName);
        setNewGuest(false);
      } catch {
        setPrimaryGuest(primaryGuestEmail);
        setNewGuest(true);
      }
    })();
  }, [primaryGuestEmail]);
  return (
    <Container>
      <GuestInfo>
        { newGuest?
          <h6>{primaryGuest}</h6>
          :
          <h5>{primaryGuest}</h5>
        }
        <p>
          {checkInDate.getMonth() + 1}/{checkInDate.getDate()} —{' '}
          {checkOutDate.getMonth() + 1}/{checkOutDate.getDate()}
        </p>
      </GuestInfo>
      <ImageContainer>
        <img src={propertyPhoto} />
      </ImageContainer>
      { newGuest?
        <Link to={chatLink}>
          <InviteButton> 📨 &nbsp;Invite </InviteButton>
        </Link>
        :
        <Link to={chatLink}>
          <MessageButton> 💬 &nbsp; Message </MessageButton>
        </Link>
      }
      <PropertyName>
        {' '}
        <p> {propertyName} </p>{' '}
      </PropertyName>
    </Container>
  );
}

const Container = styled.div`
  /* padding: 20px 0; */
  margin: 0px 6px;
  display: inline-block;
  width: 300px;
  height: 175px;
  border: 1px solid grey;
  border-radius: 16px;
`;

const MessageButton = styled.div`
  position: relative;
  top: 12%;
  right: 96%;
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

const InviteButton = styled.div`
  position: relative;
  top: 12%;
  right: 96%;
  background: ${theme.color.purple};
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
  color: ${theme.color.gray};

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const GuestInfo = styled.div`
  position: relative;
  top: 0%;
  left: 0%;
  padding: 10% 0%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 120px;
  width: 45%;
  text-align: center;
  display: inline-block;

  h6 {
    ${theme.font.displaySmall}
    font-weight: bold;
    color: ${theme.color.purple};
  }

  h5 {
    ${theme.font.displaySmall}
    font-weight: bold;
    color: ${theme.color.red};
  }

  p {
    ${theme.font.body}
  }
`;

const ImageContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0.5px;
  height: 120px;
  width: 55%;
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

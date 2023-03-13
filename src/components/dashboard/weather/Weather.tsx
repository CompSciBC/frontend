import styled from '@emotion/styled';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { Forecast } from '../../../utils/dtos';
import getWeatherForecast from './getWeatherForecast';
import RectangularCardLink from './RectangularCardLink';
import { theme } from '../../../utils/styles';

function Weather() {
  const { reservationDetail } = useContext(AppContext);
  const [forecast, setForecast] = useState<Forecast[]>([]);

  useEffect(() => {
    (async function () {
      if (reservationDetail?.property.address) {
        setForecast(
          await getWeatherForecast(reservationDetail?.property.address, 14)
        );
      }
    })();
  }, []);

  console.log(forecast);
  const currentDate = new Date();
  return (
    <Container>
      <H1>7 Day Forecast</H1>
      <Caption>{`As of ${currentDate.getMonth()}/${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}`}</Caption>
      {forecast?.map((r: Forecast) => {
        return (
          <RectangularCardLink
            key={r.number}
            to=""
            content={
              <>
                <>
                  <DetailsContainer>
                    <Name>{r.name}</Name>
                    <div>
                      <i>{r.shortForecast}</i>
                    </div>
                    <div>
                      <b>{`${r.temp} \u00B0F \n\n\n`}</b>
                    </div>
                    <DetailedForecast>{r.detailedForecast}</DetailedForecast>
                  </DetailsContainer>
                  <Icon src={`/images/weather/${r.weather}.png`} />
                </>
              </>
            }
          />
        );
      })}
    </Container>
  );
}
export default Weather;

const DetailedForecast = styled.div`
  font-size: 14px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;
  ${theme.font.body}
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const H1 = styled.h1`
  margin-top: 16px;
  ${theme.font.displayLarge}
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: bold;
  ${theme.font.heading}
`;

const Icon = styled.img`
  max-height: 120px;
  object-fit: cover;
`;

const Caption = styled.div`
  ${theme.font.caption}
  font-size: 18px;
`;

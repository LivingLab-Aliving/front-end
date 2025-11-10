import React from 'react';
import styled from 'styled-components';


const HomePage = () => {
  return (
    <HomeContainer>
      <Title>반갑습니다!</Title>
      <Title>유성구청 자치 프로그램 센터입니다</Title>
      <Subtitle>유성구에서는 지역주민의 삶의 질 향상과 근거리학습권 보장을 위해, </Subtitle>
      <Subtitle>동행정복지센터에서 각종 유익한 프로그램을 운영하고 있습니다. </Subtitle>
      <Subtitle>아래의 버튼을 클릭하여 동 별행정복지센터 주민자치프로그램을 확인하실 수 있으니, 많은 참여 부탁드립니다.</Subtitle>
    </HomeContainer>
  );
};

export default HomePage;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--primary-color);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--secondary-text-color);
`;
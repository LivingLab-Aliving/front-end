import React from 'react';
import styled from 'styled-components';

// styled-components를 사용하여 스타일 컴포넌트를 정의합니다.
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 화면 전체 높이를 차지하도록 설정 */
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--primary-color); /* GlobalStyle에 정의된 CSS 변수 사용 */
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--secondary-text-color); /* GlobalStyle에 정의된 CSS 변수 사용 */
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Title>Aliving</Title>
      <Subtitle>메인 홈 페이지에 오신 것을 환영합니다.</Subtitle>
    </HomeContainer>
  );
};

export default HomePage;

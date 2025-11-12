import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DONG_LIST = [
  '진잠동', '학하동', '상대동', '원신흥동', '온천1동', '온천2동', 
  '노은1동', '노은2동', '노은3동', '신성동', '전민동', '구즉동', '관평동'
];

const HomePage = () => {
  const navigate = useNavigate();

  // --- 임시 상태 ---
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태
  const [isAdmin, setIsAdmin] = useState(false);       // 관리자 여부

  const handleDongClick = (dongName) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!isAdmin) {
      // 일반 사용자인 경우 해당 동 페이지로 이동
      navigate(`/user/dong/${dongName}`);
      return;
    }

    // 관리자인 경우, 관리자용 동 페이지로 이동
    navigate(`/admin/dong/${dongName}`);
  };

  return (
    <HomeContainer>
      <Title>반갑습니다!</Title>
      <Title>유성구청 자치 프로그램 센터입니다</Title>
      <Subtitle>유성구에서는 지역주민의 삶의 질 향상과 근거리학습권 보장을 위해, </Subtitle>
      <Subtitle>동행정복지센터에서 각종 유익한 프로그램을 운영하고 있습니다. </Subtitle>
      <Subtitle>아래의 버튼을 클릭하여 동 별행정복지센터 주민자치프로그램을 확인하실 수 있으니, 많은 참여 부탁드립니다.</Subtitle>
      <ButtonContainer>
        {DONG_LIST.map((dong) => (
          <Button key={dong} onClick={() => handleDongClick(dong)}>{dong}</Button>
        ))}
      </ButtonContainer>
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

const Button = styled.button`
  width: 100px;
  height: 60px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;

  &:hover {
    background-color: #005bb5;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 800px;
`;
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 모든 동 목록
const ALL_DONGS = [
  "진잠동", "원신흥동", "온천1동", "온천2동",
  "신성동", "전민동", "구즉동", "관평동",
  "노은1동", "노은2동", "노은3동"
];

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [selectedDong, setSelectedDong] = useState("");

  const handleDongSelect = (dongName) => {
    navigate(`/admin/dong/${dongName}`);
  };

  return (
    <Container>
      <Content>
        <TitleSection>
          <Title>관리자 대시보드</Title>
          <SubTitle>관리할 동을 선택해주세요</SubTitle>
        </TitleSection>

        <DongGrid>
          {ALL_DONGS.map((dong) => (
            <DongCard
              key={dong}
              onClick={() => handleDongSelect(dong)}
            >
              <DongName>{dong}</DongName>
              <DongDescription>프로그램 관리</DongDescription>
            </DongCard>
          ))}
        </DongGrid>
      </Content>
    </Container>
  );
};

export default AdminHomePage;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  min-height: calc(100vh - 200px);
  background-color: #f5f6f9;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const TitleSection = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
  font-family: "Pretendard", sans-serif;
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: #666;
  font-family: "Pretendard", sans-serif;
`;

const DongGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  width: 100%;
`;

const DongCard = styled.div`
  background: white;
  border: 2px solid #e6e6e6;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Pretendard", sans-serif;

  &:hover {
    border-color: #1557b7;
    background: #f0f7ff;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(21, 87, 183, 0.15);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const DongName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
`;

const DongDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;


// src/page/adminDong/programSuccess.js

import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const ProgramSuccessPage = () => {
  const navigate = useNavigate();
  const { dongName } = useParams();

  const handleGoBack = () => {
    navigate(`/admin/dong/${dongName}`);
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={handleGoBack}>←</BackButton>
        <HeaderTitle>프로그램 생성</HeaderTitle>
      </Header>

      <ContentWrapper>
        <SuccessMessage>프로그램 생성이 완료되었습니다</SuccessMessage>
        <ConfirmButton onClick={handleGoBack}>확인하기</ConfirmButton>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ProgramSuccessPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #000;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 80px 24px;
  gap: 32px;
`;

const SuccessMessage = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #111;
  text-align: center;
`;

const ConfirmButton = styled.button`
  padding: 14px 48px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #1976d2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1565c0;
  }
`;

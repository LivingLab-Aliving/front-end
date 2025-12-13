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

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #d2d6db;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin: 0;
  font-family: "Pretendard", sans-serif;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 80px 24px;
  gap: 40px;
`;

const SuccessMessage = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #111;
  text-align: center;
  line-height: 45px;
  font-family: "Pretendard", sans-serif;
`;

const ConfirmButton = styled.button`
  padding: 13px 72px;
  background: #1557b7;
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #154ba3;
  }
`;

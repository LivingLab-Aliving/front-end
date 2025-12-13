import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";

const ProgramApplicationSuccess = () => {
  const { dongName } = useParams();
  const navigate = useNavigate();

  const handleGoToList = () => {
    navigate(`/dong/${dongName}`);
  };

  return (
    <Container>
      <PageHeader>
        <BackButton onClick={() => navigate(`/dong/${dongName}`)}>
          <ArrowLeft />
        </BackButton>
        <PageTitle>프로그램 신청</PageTitle>
      </PageHeader>

      <Divider />

      <Content>
        <SuccessMessage>
          프로그램 신청이
          <br />
          성공적으로 완료되었습니다
        </SuccessMessage>

        <ListButton onClick={handleGoToList}>목록으로</ListButton>
      </Content>
    </Container>
  );
};

export default ProgramApplicationSuccess;

const Container = styled.div`
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 40px 200px 24px;

  @media (max-width: 1024px) {
    padding: 40px 40px 24px;
  }
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

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #373736;
`;

const Divider = styled.div`
  width: calc(100% - 480px);
  margin: 0 auto;
  height: 1px;
  background: #9da4ae;

  @media (max-width: 1024px) {
    width: calc(100% - 80px);
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  gap: 64px;
`;

const SuccessMessage = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #373736;
  text-align: center;
  line-height: 1.5;
`;

const ListButton = styled.button`
  padding: 12px 72px;
  background: #1557b7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1248a0;
  }
`;

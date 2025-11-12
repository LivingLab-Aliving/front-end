import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const UserDongPage = () => {
  const { dongName } = useParams();

  return (
    <Container>
      <Title>{dongName} 주민자치 프로그램</Title>
      <Description>해당 동의 프로그램 정보를 준비 중입니다.</Description>
    </Container>
  );
};

export default UserDongPage;

const Container = styled.section`
  flex: 1;
  padding: 48px 24px;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

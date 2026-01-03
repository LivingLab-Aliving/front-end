import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import KakaoButtonImg from "../../assets/icon/btn_L_kakao.svg";

const LoginPage = () => {
  const navigate = useNavigate();

  const REST_API_KEY = ""; 
  const REDIRECT_URI = "http://localhost:3000/oauth";  
  const SCOPE = "account_email,name,gender,birthday,birthyear,phone_number";

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);
  
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Container>
      <Content>
        <TitleSection>
          <Title>유성구청</Title>
          <Subtitle>자치 프로그램 센터</Subtitle>
        </TitleSection>
        <DescriptionSection>
          <Description>계정과 비밀번호 입력 없이</Description>
          <Description>카카오톡으로 간편하게 로그인 하세요</Description>
        </DescriptionSection>

        {/* 🌟 카카오 로그인 버튼 하나만 유지 */}
        <KakaoButton onClick={handleKakaoLogin}>
          <img src={KakaoButtonImg} alt="카카오로 로그인하기" />
        </KakaoButton>

        <LinkSection>
          <LinkButton onClick={() => navigate("/signup")}>회원가입</LinkButton>
          <LinkDivider>|</LinkDivider>
          <LinkItem href="#">문의하기</LinkItem>
          <LinkDivider>|</LinkDivider>
          <LinkItem href="#">관리자 로그인</LinkItem>
        </LinkSection>
      </Content>
    </Container>
  );
};

export default LoginPage;

// --- 이하 Styled Components 코드는 기존과 동일 ---
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: calc(100vh - 200px);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const TitleSection = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #111;
  margin: 0;
`;

const DescriptionSection = styled.div`
  text-align: center;
  margin-top: -20px;
  margin-bottom: 40px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
`;

const KakaoButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  img {
    width: 100%;
    max-width: 400px;
    height: auto;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const LinkSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LinkItem = styled.a`
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkButton = styled.button`
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkDivider = styled.span`
  color: #d1d5db;
  font-size: 14px;
`;
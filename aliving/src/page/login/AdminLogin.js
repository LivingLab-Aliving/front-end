import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:8080/api/admin/login", {
        loginId: formData.loginId,
        password: formData.password
      });

      console.log(response.data)

      if (response.data.statusCode == 200) {
        const { grantType, accessToken, refreshToken, adminId } = response.data.data;
        console.log(response.data.data)
  
        // 토큰을 grantType과 함께 저장 (일반 사용자와 동일한 형식)
        localStorage.setItem("token", `${grantType} ${accessToken}`);
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminId", adminId);

        alert(`관리자님, 환영합니다!`);
        
        // 관리자 홈페이지로 이동 (동 선택 페이지)
        navigate(`/admin/home`);
      }
    } catch (err) {
      console.error("로그인 에러:", err);
      const message = err.response?.data?.message || "아이디 또는 비밀번호가 올바르지 않습니다.";
      setError(message);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <Container>
      <Content>
        <TitleSection>
          <Title>관리자 로그인</Title>
        </TitleSection>

        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label>아이디</Label>
            <Input
              type="text"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="ID를 입력해주세요"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              required
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <LoginButton type="submit">
            로그인
          </LoginButton>
        </LoginForm>

        <FindLinkSection>
          <FindLink href="#">관리자 ID 찾기</FindLink>
          <LinkSeparator>|</LinkSeparator>
          <FindLink href="#">관리자 비밀번호 찾기</FindLink>
        </FindLinkSection>
        
        <BackLinkSection>
           <LinkButton onClick={handleBackToLogin}>
             일반 로그인으로 돌아가기
           </LinkButton>
        </BackLinkSection>
      </Content>
    </Container>
  );
};

export default AdminLoginPage;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 100vh;
  background-color: white; 
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px; 
  width: 100%;
  max-width: 360px;
`;

const TitleSection = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px; 
  font-weight: 700;
  color: #000;
  margin: 0;
  font-family: "Pretendard", sans-serif;
`;

const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px; 
  background: none;
  padding: 0; 
  border-radius: 0;
  box-shadow: none;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px; 
  font-weight: 500;
  color: #000;
  font-family: "Pretendard", sans-serif;
`;

const Input = styled.input`
  padding: 14px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  font-family: "Pretendard", sans-serif;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1557b7;
    box-shadow: 0 0 0 1px #1557b7;
  }

  &::placeholder {
    color: #a0a0a0;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  padding: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-family: "Pretendard", sans-serif;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 12px;
  background: #1557b7;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }

  &:active {
    background: #0f3a87;
  }
`;

const FindLinkSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: -12px; 
  margin-bottom: -18px;
`;

const FindLink = styled.a`
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: "Pretendard", sans-serif;

  &:hover {
    text-decoration: underline;
    color: #1557b7;
  }
`;

const LinkSeparator = styled.span`
  color: #d1d5db;
  font-size: 14px;
`;

const BackLinkSection = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 12px;
`;

const LinkButton = styled.button`
    font-size: 15px;
    color: #4b5563;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: "Pretendard", sans-serif;

    &:hover {
        text-decoration: underline;
        color: #1557b7;
    }
`;


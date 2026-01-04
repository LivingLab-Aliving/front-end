import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const hasRequested = useRef(false);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code && !hasRequested.current) {
      hasRequested.current = true;

      axios
        .get(`http://localhost:8080/oauth?code=${code}`)
        .then((response) => {
          const { accessToken, grantType, name, isNewUser, userId } = response.data;
          console.log(response.data)

          localStorage.setItem("token", `${grantType} ${accessToken}`);
          localStorage.setItem("username", name);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userAddress", response.data.address);
          localStorage.setItem("userPhone", response.data.phone);
          localStorage.setItem("userBirth", response.data.birth);
          localStorage.setItem("userEmail", response.data.email);


          if (isNewUser) {
            navigate("/signup", { state: { kakaoInfo: response.data } });
          } 
          else {
            const redirectUrl = sessionStorage.getItem("redirectUrl");
            if (redirectUrl) {
              sessionStorage.removeItem("redirectUrl");
              navigate(redirectUrl); 
            } else {
              navigate("/home");
            }
          }
        })
        .catch((error) => {
          console.error("인증 에러:", error);
          alert("로그인 중 오류가 발생했습니다.");
          navigate("/");
        });
    }
  }, [navigate]);

  return (
    <FullContainer>
      <Spinner />
      <LoadingText>로그인 처리 중...</LoadingText>
    </FullContainer>
  );
};

export default KakaoCallback;

const spin = keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`;
const FullContainer = styled.div`height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center;`;
const Spinner = styled.div`width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #fee500; border-radius: 50%; animation: ${spin} 1s linear infinite;`;
const LoadingText = styled.h2`margin-top: 20px; color: #333;`;
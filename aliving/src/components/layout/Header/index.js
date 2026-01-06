import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as LogoSvg } from "../../../assets/logo.svg";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    if (token) {
      setIsLoggedIn(true);
      setUsername(storedName || "관리자");
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        <LogoSvg />
      </Logo>

      <NavLinks>
        {isLoggedIn ? (
          <>
            <UserName>{username}님</UserName>
            <Button onClick={handleLogout} className="logout">
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/")}>로그인</Button>
            <Button onClick={() => navigate("/signup")}>회원가입</Button>
          </>
        )}
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
`;

const Logo = styled.div`
  svg {
    height: 2.5rem;
    width: auto;
  }
`;

const UserName = styled.span`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  color: #333;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1rem;
  margin-left: auto;
`;

const Button = styled.button`
  border: 1px solid #b2b2b2;
  border-radius: 10px;
  padding: 10px 24px;
  background-color: #0070f3;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #005bb5;
  }

  &.logout {
    background-color: #ffffff;
    color: #ff4d4f;
    border: 1px solid #ff4d4f;
    &:hover {
      background-color: #fff1f0;
    }
  }
`;

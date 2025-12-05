import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoSvg } from '../../../assets/logo.svg';


const Header = () => {
    // 임시 확인용
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const username = '홍길동';

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    return (
        <HeaderContainer>
            <Logo href="/"><LogoSvg /></Logo>

            <NavLinks>
                {isLoggedIn ? (
                    <>
                        <UserName>{username}님</UserName>
                        <Button onClick={handleLogout}>로그아웃</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleLogin}>로그인</Button>
                        <Button>회원가입</Button>
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

const Logo = styled.a`
  text-decoration: none;
  
  svg {
    height: 2.5rem;
    width: auto;
  }
`;

const Text = styled.span`
  font-size: 1rem;
  color: #555;
  margin-left: 1rem;
`;

const UserName = styled.span`
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1rem;
  margin-left: auto;
`;

const Button = styled.button`
  border: 1px solid #b2b2b2;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #0070f3;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #005bb5;
  }
`;
import React from 'react';
import styled from 'styled-components';

const Footer = () => {
    return (
        <FooterContainer>
            <FooterText>개인정보처리방침 | 사이트맵 | 찾아오시는 길</FooterText>
            <FooterText>(우 34139) 대전광역시 유성구 대학로 211유성구청 대표전화 : 042-611-2114 (평일 / 9:00 ~ 18:00), 점심시간 12:00 ~ 13:00 / 대표팩스 : 042-611-2569 
                Copyright ⓒ 2021 DAEJEON YUSEONG-GU. ALL RIGHTS RESERVED.</FooterText>
        </FooterContainer>
    );
};

export default Footer;

const FooterContainer = styled.footer`
    width: 100%;
    padding: 2rem 0;
    background-color: #fafafa;
    border-top: 1px solid #eaeaea;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
`;

const FooterText = styled.p`
    color: var(--secondary-text-color);
    font-size: 0.9rem;
`;

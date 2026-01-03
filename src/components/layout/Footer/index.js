import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <LeftSection>
          <InfoText>
            (우 34139) 대전광역시 유성구 대학로 211유성구청 대표전화 :
            042-611-2114(평일 / 9:00 ~ 18:00), 점심시간 12:00 ~ 13:00 / 대표팩스
            : 042-611-2569
          </InfoText>
          <CopyrightText>
            Copyright ⓒ 2021 DAEJEON YUSEONG-GU. ALL RIGHTS RESERVED.
          </CopyrightText>
        </LeftSection>
        <RightSection>
          <LinkGroup>
            <FooterLink href="#">개인정보처리방침</FooterLink>
            <LinkDivider>|</LinkDivider>
            <FooterLink href="#">사이트맵</FooterLink>
            <LinkDivider>|</LinkDivider>
            <FooterLink href="#">찾아오시는 길</FooterLink>
          </LinkGroup>
          <SocialGroup>
            <SocialIcon href="#" aria-label="Facebook">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" aria-label="Kakao">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3C6.48 3 2 6.58 2 11C2 13.84 3.94 16.35 6.85 17.73L5.92 21.28C5.85 21.53 6.14 21.74 6.36 21.59L10.67 18.82C11.1 18.88 11.55 18.91 12 18.91C17.52 18.91 22 15.33 22 10.91C22 6.58 17.52 3 12 3Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" aria-label="YouTube">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" aria-label="Instagram">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 17.7383 21.3889 19.2135 20.3012 20.3012C19.2135 21.3889 17.7383 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 6.26174 2.61107 4.78649 3.69878 3.69878C4.78649 2.61107 6.26174 2 7.8 2ZM7.6 4C6.64522 4 5.72955 4.37928 5.05442 5.05442C4.37928 5.72955 4 6.64522 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C17.3548 20 18.2705 19.6207 18.9456 18.9456C19.6207 18.2705 20 17.3548 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.5815 5.5 17.8995 5.6317 18.1339 5.86612C18.3683 6.10054 18.5 6.41848 18.5 6.75C18.5 7.08152 18.3683 7.39946 18.1339 7.63388C17.8995 7.8683 17.5815 8 17.25 8C16.9185 8 16.6005 7.8683 16.3661 7.63388C16.1317 7.39946 16 7.08152 16 6.75C16 6.41848 16.1317 6.10054 16.3661 5.86612C16.6005 5.6317 16.9185 5.5 17.25 5.5ZM12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7ZM12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z" />
              </svg>
            </SocialIcon>
          </SocialGroup>
        </RightSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  width: 100%;
  padding: 16px 40px;
  background-color: #6b7280;
  display: flex;
  justify-content: center;
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoText = styled.p`
  color: #d1d5db;
  font-size: 13px;
  line-height: 1.5;
`;

const CopyrightText = styled.p`
  color: #fff;
  font-size: 12px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FooterLink = styled.a`
  color: #e5e7eb;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkDivider = styled.span`
  color: #9ca3af;
  font-size: 13px;
`;

const SocialGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SocialIcon = styled.a`
  color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

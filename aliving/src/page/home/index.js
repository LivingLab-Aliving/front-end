import React from "react";
import styled from "styled-components";
import { ReactComponent as CharacterIllustration } from "../../assets/character.svg";

const DONG_GROUPS = [
  ["진잠동", "원신흥동", "온천1동", "온천2동"],
  ["노은1동", "노은2동", "노은3동"],
  ["신성동", "전민동", "구즉동", "관평동"],
];

const HomePage = () => {
  return (
    <HomeContainer>
      <Inner>
        <HeroHeadline>
          반갑습니다!
          <br />
          유성구청 자치 프로그램 센터입니다
        </HeroHeadline>

        <CharacterWrapper>
          <CharacterIllustration />
        </CharacterWrapper>

        <HeroDescription>
          유성구에서는 지역주민의 삶의 질 향상과 근거리학습권 보장을 위해
          <br />
          동행정복지센터에서 각종 유익한 프로그램을 운영하고 있습니다.
          <br />
          아래의 버튼을 클릭하여 동 행정복지센터 주민자치프로그램을 확인하실 수
          있으니, 많은 참여 부탁드립니다.
        </HeroDescription>

        <DongList>
          {DONG_GROUPS.map((dongGroup, index) => (
            <DongRow key={index}>
              {dongGroup.map((dongName) => (
                <DongButton key={dongName}>{dongName}</DongButton>
              ))}
            </DongRow>
          ))}
        </DongList>
      </Inner>
    </HomeContainer>
  );
};

export default HomePage;

const HomeContainer = styled.section`
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 80px 24px;
`;

const Inner = styled.div`
  width: min(960px, 100%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const HeroHeadline = styled.h1`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.4;
  color: #111;
`;

const CharacterWrapper = styled.div`
  display: flex;
  justify-content: center;

  svg {
    width: 200px;
    height: auto;
  }
`;

const HeroDescription = styled.p`
  font-size: 16px;
  color: #9d9d9c;
  line-height: 1.5;
`;

const DongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
`;

const DongRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const DongButton = styled.button`
  border: 1px solid #b2b2b2;
  border-radius: 10px;
  padding: 12px 20px;
  background: #ececec;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    background: #fff;
  }
`;

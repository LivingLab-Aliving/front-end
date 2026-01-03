import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Figma 이미지 URL
const MAP_IMAGE_URL =
  "https://www.figma.com/api/mcp/asset/c2f43e4b-858e-4bb7-ae9c-aac36e8c4eda";
const CHARACTER_IMAGE_URL =
  "https://www.figma.com/api/mcp/asset/c87c22a7-d168-4276-80a7-a4e5cd29e3bb";
const SPEECH_BUBBLE_URL =
  "https://www.figma.com/api/mcp/asset/0441611c-bf26-47d7-802d-c2dbc1f99ded";

// 동 버튼 배치 (Figma 기준 + 45px 오른쪽 이동)
const DONG_BUTTONS_CONFIG = [
  // Row 1: top: 570px
  { name: "진잠동", left: "calc(56.25% + 100px)", top: "570px" },
  { name: "원신흥동", left: "calc(68.75% + 0px)", top: "570px" },
  { name: "온천1동", left: "calc(81.25% - 100px)", top: "570px" },
  { name: "온천2동", left: "calc(87.5% - 80px)", top: "570px" },
  // Row 2: top: 638px
  { name: "신성동", left: "calc(56.25% + 100px)", top: "638px" },
  { name: "전민동", left: "calc(68.75% + 0px)", top: "638px" },
  { name: "구즉동", left: "calc(81.25% - 100px)", top: "638px" },
  { name: "관평동", left: "calc(87.5% - 80px)", top: "638px" },
  // Row 3: top: 706px
  { name: "노은1동", left: "calc(56.25% + 100px)", top: "706px" },
  { name: "노은2동", left: "calc(68.75% + 0px)", top: "706px" },
  { name: "노은3동", left: "calc(81.25% - 100px)", top: "706px" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [activeDong, setActiveDong] = useState("관평동");

  const handleDongClick = (dongName) => {
    setActiveDong(dongName);
    navigate(`/dong/${dongName}`);
  };

  return (
    <PageContainer>
      {/* 하늘색 배경 */}
      <BackgroundShape />

      {/* 지도 */}
      <MapContainer>
        <MapImage src={MAP_IMAGE_URL} alt="유성구 지도" />
      </MapContainer>

      {/* 말풍선 */}
      <ChatBubbleContainer>
        <ChatBubbleImage src={SPEECH_BUBBLE_URL} alt="" />
        <ChatBubbleText>
          지도에서 <HighlightText>원하는 동을 클릭</HighlightText>해서
          <br />
          동별 프로그램을 확인해요!
        </ChatBubbleText>
      </ChatBubbleContainer>

      {/* 캐릭터 */}
      <CharacterContainer>
        <CharacterImage src={CHARACTER_IMAGE_URL} alt="캐릭터" />
      </CharacterContainer>

      {/* 제목 */}
      <TitleContainer>
        <TitleText>반갑습니다!</TitleText>
        <TitleText>유성구청 자치 프로그램 센터입니다</TitleText>
      </TitleContainer>

      {/* 설명 */}
      <DescriptionContainer>
        <DescriptionText>
          유성구의 각 동별 행정복지센터에서 운영하는
        </DescriptionText>
        <DescriptionText>
          각종 다양한 주민자치프로그램을 확인하고 프로그램에 참여하세요!
        </DescriptionText>
      </DescriptionContainer>

      {/* 동 버튼들 */}
      {DONG_BUTTONS_CONFIG.map((dong) => (
        <DongButton
          key={dong.name}
          style={{ left: dong.left, top: dong.top }}
          $active={activeDong === dong.name}
          onClick={() => handleDongClick(dong.name)}
        >
          {dong.name}
        </DongButton>
      ))}
    </PageContainer>
  );
};

export default HomePage;

// Styled Components - Figma 1920px 기준 정확한 위치값
const PageContainer = styled.section`
  position: relative;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  height: 906px; /* 1080 - 64(header) - 110(footer) */
  background: #fff;
  overflow: hidden;
`;

const BackgroundShape = styled.div`
  position: absolute;
  left: 0;
  top: 226px; /* 290 - 64(header) */
  width: 989px;
  height: 790px;
  background: #e0f3fa;
  opacity: 0.7;
  border-radius: 0 400px 400px 0;
`;

const MapContainer = styled.div`
  position: absolute;
  left: calc(12.5% + 470px);
  top: 81px; /* 145 - 64(header) */
  width: 450px;
  height: 760px;
  transform: translateX(-50%);
`;

const MapImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ChatBubbleContainer = styled.div`
  position: absolute;
  left: 166px;
  top: 471px; /* 535 - 64(header) */
  width: 290px;
  height: 99px;
  z-index: 20;
`;

const ChatBubbleImage = styled.img`
  position: absolute;
  inset: -6.08% -2.07%;
  width: 104.14%;
  height: 112.16%;
`;

const ChatBubbleText = styled.div`
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #000;
  white-space: nowrap;
  line-height: 1.6;
`;

const HighlightText = styled.span`
  color: #1557b7;
`;

const CharacterContainer = styled.div`
  position: absolute;
  left: 279px;
  top: 580px; /* 644 - 64(header) */
  width: 174px;
  height: 194px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
`;

const CharacterImage = styled.img`
  width: 184.08%;
  height: 165.81%;
  max-width: none;
  transform: rotate(180deg) scaleY(-1);
`;

const TitleContainer = styled.div`
  position: absolute;
  left: calc(56.25% + 100px);
  top: 332px; /* 396 - 64(header) */
  transform: translateY(-100%);
  display: flex;
  flex-direction: column;
  white-space: nowrap;
`;

const TitleText = styled.p`
  margin: 0;
  font-family: "Pretendard", sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 45px;
  color: #000;
`;

const DescriptionContainer = styled.div`
  position: absolute;
  left: calc(56.25% + 100px);
  top: 352px; /* 416 - 64(header) */
  white-space: nowrap;
`;

const DescriptionText = styled.p`
  margin: 0;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
  color: #9d9d9c;
`;

const DongButton = styled.button`
  position: absolute;
  width: 96px;
  height: 42px;
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  background: ${(props) => (props.$active ? "#1557b7" : "#e6ecf8")};
  color: ${(props) => (props.$active ? "#fff" : "#124998")};
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? "#1248a0" : "#d4dff5")};
  }
`;

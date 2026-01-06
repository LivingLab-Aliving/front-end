import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CharacterImageSrc from "../../assets/character.svg";
import SpeechBubbleImageSrc from "../../assets/speech_bubble.svg";
import 전체Map from "../../assets/map/전체.svg";
// import 진잠동Map from "../../assets/map/진잠동.svg";
// import 학하동Map from "../../assets/map/학하동.svg";
// import 노은1동Map from "../../assets/map/노은1동.svg";
// import 노은2동Map from "../../assets/map/노은2동.svg";
// import 노은3동Map from "../../assets/map/노은3동.svg";
// import 온천1동Map from "../../assets/map/온천1동.svg";
// import 온천2동Map from "../../assets/map/온천2동.svg";
// import 상대동Map from "../../assets/map/상대동.svg";
// import 원신흥동Map from "../../assets/map/원신흥동.svg";
// import 신성동Map from "../../assets/map/신성동.svg";
// import 전민동Map from "../../assets/map/전민동.svg";
// import 관평동Map from "../../assets/map/관평동.svg";
// import 구즉동Map from "../../assets/map/구즉동.svg";

// 지도 SVG 배치 설정
// const MAP_CONFIG = [
//   {
//     name: "진잠동",
//     src: 진잠동Map,
//     width: "245.537px",
//     height: "223.393px",
//     left: "473px",
//     top: "631.6821px",
//   },
//   {
//     name: "학하동",
//     src: 학하동Map,
//     width: "185.892px",
//     height: "141.3px",
//     left: "517.0996px",
//     top: "535.5947px",
//   },
//   {
//     name: "노은1동",
//     src: 노은1동Map,
//     width: "170px",
//     height: "115.527px",
//     left: "534.0366px",
//     top: "465.835px",
//   },
//   {
//     name: "노은2동",
//     src: 노은2동Map,
//     width: "143.692px",
//     height: "157.054px",
//     left: "554.3965px",
//     top: "336.8076px",
//   },
//   {
//     name: "노은3동",
//     src: 노은3동Map,
//     width: "105.854px",
//     height: "90.395px",
//     left: "551.8286px",
//     top: "416.207px",
//   },
//   {
//     name: "온천1동",
//     src: 온천1동Map,
//     width: "152.592px",
//     height: "71.903px",
//     left: "620.0361px",
//     top: "521.9595px",
//   },
//   {
//     name: "온천2동",
//     src: 온천2동Map,
//     width: "151.858px",
//     height: "87.333px",
//     left: "664.6777px",
//     top: "469.8618px",
//   },
//   {
//     name: "상대동",
//     src: 상대동Map,
//     width: "54.361px",
//     height: "43.203px",
//     left: "672.5947px",
//     top: "589.3618px",
//   },
//   {
//     name: "원신흥동",
//     src: 원신흥동Map,
//     width: "50.455px",
//     height: "62.899px",
//     left: "704.0698px",
//     top: "574.0938px",
//   },
//   {
//     name: "신성동",
//     src: 신성동Map,
//     width: "202.448px",
//     height: "205.942px",
//     left: "670.5313px",
//     top: "305.2739px",
//   },
//   {
//     name: "전민동",
//     src: 전민동Map,
//     width: "98.863px",
//     height: "117.731px",
//     left: "817.2217px",
//     top: "377.8618px",
//   },
//   {
//     name: "관평동",
//     src: 관평동Map,
//     width: "110.472px",
//     height: "96.881px",
//     left: "810px",
//     top: "290.0908px",
//   },
//   {
//     name: "구즉동",
//     src: 구즉동Map,
//     width: "168.154px",
//     height: "256.626px",
//     left: "713.5703px",
//     top: "97px",
//   },
// ];

// 동 버튼 배치
const DONG_BUTTONS_CONFIG = [
  // Row 1: top: 570px
  { name: "진잠동", left: "calc(56.25% + 100px)", top: "570px" },
  { name: "원신흥동", left: "calc(68.75% + 0px)", top: "570px" },
  { name: "온천1동", left: "calc(81.25% - 100px)", top: "570px" },
  { name: "온천2동", left: "calc(87.5% - 95px)", top: "570px" },
  // Row 2: top: 638px
  { name: "신성동", left: "calc(56.25% + 100px)", top: "638px" },
  { name: "전민동", left: "calc(68.75% + 0px)", top: "638px" },
  { name: "구즉동", left: "calc(81.25% - 100px)", top: "638px" },
  { name: "관평동", left: "calc(87.5% - 95px)", top: "638px" },
  // Row 3: top: 706px
  { name: "노은1동", left: "calc(56.25% + 100px)", top: "706px" },
  { name: "노은2동", left: "calc(68.75% + 0px)", top: "706px" },
  { name: "노은3동", left: "calc(81.25% - 100px)", top: "706px" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [activeDong, setActiveDong] = useState(null);

  const handleDongClick = (dongName) => {
    setActiveDong(dongName);
    navigate(`/dong/${dongName}`);
  };

  return (
    <PageContainer>
      {/* 하늘색 배경 */}
      <BackgroundShape />

      {/* 지도 SVG들 */}
      <MapContainer>
        <FullMapSvg
          src={전체Map}
          alt="전체 지도"
          style={{
            left: "473px",
            top: "95px",
            width: "451px",
            height: "762px",
          }}
        />
        {/* {MAP_CONFIG.map((map) => (
          <MapSvg
            key={map.name}
            src={map.src}
            alt={map.name}
            style={{
              width: map.width,
              height: map.height,
              left: map.left,
              top: map.top,
            }}
            onClick={() => handleDongClick(map.name)}
          />
        ))} */}
      </MapContainer>

      {/* 말풍선 */}
      <ChatBubbleContainer>
        <ChatBubbleImage src={SpeechBubbleImageSrc} alt="" />
        <ChatBubbleText>
          지도에서 <HighlightText>원하는 동을 클릭</HighlightText>해서
          <br />
          동별 프로그램을 확인해요!
        </ChatBubbleText>
      </ChatBubbleContainer>

      {/* 캐릭터 */}
      <CharacterContainer>
        <CharacterImage src={CharacterImageSrc} alt="캐릭터" />
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

// Styled Components
const PageContainer = styled.section`
  position: relative;
  width: 100%;
  max-width: 1920px;
  margin: auto;
  height: 100vh;
  background: #fff;
  overflow: hidden;
`;

const BackgroundShape = styled.div`
  position: absolute;
  left: 0;
  top: 25%;
  width: 51.5%;
  height: 87.2%;
  background: #e0f3fa;
  opacity: 0.7;
  border-radius: 0 40% 40% 0;
  z-index: 1;
`;

const MapContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 51.5%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
`;

const MapSvg = styled.img`
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const FullMapSvg = styled.img`
  position: absolute;
  pointer-events: auto;
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
  width: 120px;
  height: 134px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
`;

const CharacterImage = styled.img`
  width: 130%;
  height: 130%;
  max-width: none;
  object-fit: contain;
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

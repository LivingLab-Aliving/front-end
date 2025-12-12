import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";
import UnknownImage from "../../assets/unknown_image.svg";
import {
  PROGRAMS_BY_DONG,
  PAYMENT_GUIDE,
  ETC_GUIDE,
} from "../../assets/data/data";
import { formatPeriod, calculateDaysRemaining } from "../../util/utils";

const ProgramDetail = () => {
  const { dongName, programId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const program = useMemo(() => {
    const dongPrograms = PROGRAMS_BY_DONG[dongName] || [];
    return dongPrograms.find((p) => p.id === programId);
  }, [dongName, programId]);

  if (!program) {
    return (
      <Container>
        <ErrorTitle>프로그램을 찾을 수 없습니다.</ErrorTitle>
        <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
      </Container>
    );
  }

  const badgeInfo = calculateDaysRemaining(program.startDate, program.endDate);

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft />
        </BackButton>
        <Title>프로그램 상세</Title>
      </Header>

      <Divider />

      <ContentSection>
        <ProgramHeader>
          <StatusBadge $type={badgeInfo.type}>
            {badgeInfo.type === "days"
              ? `D-${badgeInfo.value}`
              : badgeInfo.type === "closed"
              ? "모집마감"
              : ""}
          </StatusBadge>
          <ProgramName>{program.title}</ProgramName>
        </ProgramHeader>

        <InfoGrid>
          <PosterWrapper>
            <Poster src={UnknownImage} alt="프로그램 포스터" />
          </PosterWrapper>

          <InfoTableWrapper>
            <InfoTable>
              <tbody>
                <TableRow>
                  <TableHeader>교육일정</TableHeader>
                  <TableData>{program.schedule}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>분기</TableHeader>
                  <TableData>{program.quarter || "-"}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>교육기간</TableHeader>
                  <TableData>
                    {formatPeriod(program.startDate, program.endDate)}
                  </TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>모집기간</TableHeader>
                  <TableData>{program.applicationPeriod || "-"}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>교육장소</TableHeader>
                  <TableData>{program.place}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>신청인원 / 모집인원</TableHeader>
                  <TableData>
                    {program.capacity || program.recruitment}
                  </TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>교육대상</TableHeader>
                  <TableData>{program.targetAudience || "-"}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>수강료</TableHeader>
                  <TableData>{program.tuition}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>학습준비물</TableHeader>
                  <TableData>{program.materials || "-"}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>교육기관 / 모집제한</TableHeader>
                  <TableData>{program.institution || "-"}</TableData>
                </TableRow>
              </tbody>
            </InfoTable>
          </InfoTableWrapper>
        </InfoGrid>

        <ButtonWrapper>
          <ApplyButton
            onClick={() =>
              navigate(`/dong/${dongName}/program/${programId}/apply`)
            }
          >
            신청하기
          </ApplyButton>
        </ButtonWrapper>
      </ContentSection>

      <Section>
        <SectionTitle>• 프로그램 소개</SectionTitle>
        <SectionContent>
          {program.instructor && (
            <InstructorCard>
              <InstructorImage
                src={program.instructor.profileImage || UnknownImage}
                alt="강사 프로필"
              />
              <InstructorInfo>
                <InstructorNameRow>
                  <InstructorName>
                    강사 {program.instructor.name}
                  </InstructorName>
                  <InstructorRole>{program.instructor.role}</InstructorRole>
                </InstructorNameRow>
                <InstructorDetailRow>
                  <DetailLabel>강의 분야</DetailLabel>
                  <DetailValue>| {program.instructor.field}</DetailValue>
                </InstructorDetailRow>
                <InstructorDetailRow>
                  <DetailLabel>주요 경력</DetailLabel>
                  <DetailValue>| {program.instructor.experience}</DetailValue>
                </InstructorDetailRow>
              </InstructorInfo>
              <MoreLink href="#">
                이 강사의 다른 프로그램 보러가기 &gt;
              </MoreLink>
            </InstructorCard>
          )}

          {program.attachment && (
            <AttachmentBox>
              <span>첨부파일 | </span>
              <DownloadLink href={program.attachment.url} download>
                {program.attachment.name}
              </DownloadLink>
            </AttachmentBox>
          )}
        </SectionContent>
      </Section>

      <Divider $thin />

      <Section>
        <SectionTitle>• 수강료 납부 안내</SectionTitle>
        <GuideList>
          {program.paymentGuide
            ? program.paymentGuide.map((line, index) => (
                <GuideItem key={index}>
                  <Star>★</Star>
                  <Text>{line}</Text>
                </GuideItem>
              ))
            : PAYMENT_GUIDE.map((line, index) => (
                <GuideItem key={index}>
                  <Star>★</Star>
                  <Text>{line}</Text>
                </GuideItem>
              ))}
        </GuideList>
      </Section>

      <Section>
        <SectionTitle>• 기타내용</SectionTitle>
        <GuideList>
          {program.etcGuide
            ? program.etcGuide.map((line, index) => (
                <GuideItem key={index} $plain>
                  {line}
                </GuideItem>
              ))
            : ETC_GUIDE.map((line, index) => (
                <GuideItem key={index} $plain>
                  {line}
                </GuideItem>
              ))}
        </GuideList>
      </Section>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalIcon>
              <CloseIcon>✕</CloseIcon>
            </ModalIcon>
            <RightSection>
              <ModalText>
                <ModalTitle>해당 프로그램을 신청할 수 없습니다.</ModalTitle>
                <ModalBody>
                  <p>
                    회원님은 이미 최대 신청 가능한 프로그램 수(2개)에
                    도달했습니다.
                  </p>
                  <p>
                    공정한 참여를 위해 1인당 2개의 프로그램만 신청이 가능합니다.
                  </p>
                </ModalBody>
              </ModalText>
              <ModalButton onClick={() => setShowModal(false)}>
                닫기
              </ModalButton>
            </RightSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ProgramDetail;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 96px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ $thin }) => ($thin ? "#e0e0e0" : "#9DA4AE")};
  margin: 0;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ProgramHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 8px 14px;
  background: ${({ $type }) => ($type === "closed" ? "#ECECEC" : "#37B7EC")};
  color: ${({ $type }) => ($type === "closed" ? "#9D9D9C" : "#ffffff")};
  font-weight: 500;
  font-size: 16px;
  border-radius: 50px;
  line-height: 1.2;
  white-space: nowrap;
`;

const ProgramName = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: #111;
`;

const InfoGrid = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const PosterWrapper = styled.div`
  flex: 0.8;
  max-width: 400px;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: #f5f5f5;
  border-radius: 0; /* 시안엔 라운드가 없는 듯 보임 */
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoTableWrapper = styled.div`
  flex: 1.2;
  width: 100%;
`;

const InfoTable = styled.table`
  width: 100%;
  border-top: 1px solid #d2d6db;
  border-bottom: 1px solid #d2d6db;
  border-collapse: collapse;
  border-radius: 0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #d2d6db;
  background: #f5f6f9;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 16px 24px;
  text-align: center;
  background: transparent;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  width: 200px;
  vertical-align: middle;
  white-space: nowrap;
  border-right: 1px solid #d2d6db;
`;

const TableData = styled.td`
  padding: 16px 24px;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  background: #fff;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const ApplyButton = styled.button`
  padding: 13px 72px;
  background: #1557b7;
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.2s;

  &:hover {
    background: #154ba3;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 640px;
  width: 90%;
  display: flex;
  gap: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  align-items: flex-start;
`;

const ModalIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #ff553f; /* 시안의 주황빛 도는 빨강 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CloseIcon = styled.span`
  color: white;
  font-size: 36px;
  font-weight: 300; /* 얇은 두께 */
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: -4px; /* 시각적 중앙 보정 */
`;

const ModalText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 10px;
  padding-top: 10px; /* 아이콘과 높이 맞춤 */
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  font-weight: 800; /* 매우 굵게 */
  color: #000;
  margin: 0;
  line-height: 1.2;
`;

const ModalBody = styled.div`
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  letter-spacing: -0.3px;

  p {
    margin: 0;
    white-space: nowrap;
  }
`;

const ModalButton = styled.button`
  align-self: flex-end; /* flex 컨테이너 내에서 우측 정렬 */
  min-width: 100px;
  padding: 12px 36px;
  background: #1a5cc8; /* 시안의 진한 파랑 */
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
  margin-top: 30px; /* 본문과의 간격 */

  &:hover {
    background: #154ba3;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

const SectionContent = styled.div`
  /* padding 없음 */
`;

const InstructorCard = styled.div`
  display: flex;
  gap: 24px;
  position: relative;
  align-items: center;
  background: #f8f9fa;
  padding: 32px;
  border-radius: 8px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const InstructorImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
  border: 1px solid #eee;
`;

const InstructorInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InstructorNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const InstructorName = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: #111;
`;

const InstructorRole = styled.span`
  font-size: 13px;
  color: #666;
`;

const InstructorDetailRow = styled.div`
  display: flex;
  font-size: 14px;
  color: #555;
  gap: 8px;
`;

const DetailLabel = styled.span`
  color: #888;
  min-width: 60px;
`;

const DetailValue = styled.span`
  color: #555;
`;

const MoreLink = styled.a`
  color: #999;
  font-size: 13px;
  text-decoration: none;
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    position: static;
    transform: none;
    margin-top: 12px;
    align-self: flex-end;
  }
`;

const AttachmentBox = styled.div`
  margin-top: 20px;
  padding: 20px 24px;
  background: #f8f9fa;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;

  span {
    font-weight: 600;
    margin-right: 8px;
  }
`;

const DownloadLink = styled.a`
  text-decoration: underline;
  color: #111;
  cursor: pointer;
  font-weight: 500;
`;

const GuideList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 0;
`;

const GuideItem = styled.li`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  list-style: none;
  display: ${({ $plain }) => ($plain ? "block" : "flex")};
  align-items: flex-start;
  gap: 0;
  ${({ $plain }) =>
    !$plain &&
    `
    & > span:first-child {
      width: 0.4em;
      flex-shrink: 0;
      text-align: right;
      overflow: visible;
      position: relative;
      left: 1em;
    }
  `}
`;

const Star = styled.span``;

const Text = styled.span`
  ${({ $plain }) =>
    !$plain &&
    `
    flex: 1;
    margin-left: 2em;
  `}
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin: 40px 0;
`;

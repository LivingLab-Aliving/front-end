import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";
import UnknownImage from "../../assets/unknown_image.svg";
import { PROGRAMS_BY_DONG, PAYMENT_GUIDE, ETC_GUIDE } from "./data";
import { formatPeriod, calculateDaysRemaining } from "./utils";

const ProgramDetail = () => {
  const { dongName, programId } = useParams();
  const navigate = useNavigate();

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
                  <TableData>{program.capacity || program.recruitment}</TableData>
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
          <ListButton onClick={() => navigate(`/dong/${dongName}`)}>
            목록으로
          </ListButton>
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
                <GuideItem key={index}>★ {line}</GuideItem>
              ))
            : PAYMENT_GUIDE.map((line, index) => (
                <GuideItem key={index}>★ {line}</GuideItem>
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
  background: ${({ $thin }) => ($thin ? "#e0e0e0" : "#ddd")};
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
  color: ${({ $type }) => ($type === "closed" ? "#999" : "#00a0e9")};
  font-weight: 700;
  font-size: 18px;
`;

const ProgramName = styled.h2`
  font-size: 24px;
  font-weight: 700;
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
  border-top: 1px solid #ddd;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
`;

const TableHeader = styled.th`
  padding: 16px 24px;
  text-align: center;
  background: #fff;
  color: #333;
  font-weight: 500;
  font-size: 14px;
  width: 140px;
  vertical-align: middle;
  white-space: nowrap;
`;

const TableData = styled.td`
  padding: 16px 24px;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const ListButton = styled.button`
  padding: 13px 60px;
  background: #1a5cc8;
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
`;

const GuideItem = styled.li`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  padding-left: ${({ $plain }) => ($plain ? "0" : "0")};
  text-indent: ${({ $plain }) => ($plain ? "0" : "0")};
  list-style: none;
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin: 40px 0;
`;

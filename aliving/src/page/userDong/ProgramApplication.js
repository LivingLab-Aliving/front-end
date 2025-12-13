import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";
import { PROGRAMS_BY_DONG } from "../../assets/data/data";
import { formatPeriod } from "../../util/utils";

const ProgramApplication = () => {
  const { dongName, programId } = useParams();
  const navigate = useNavigate();

  const program = useMemo(() => {
    const dongPrograms = PROGRAMS_BY_DONG[dongName] || [];
    return dongPrograms.find((p) => p.id === programId);
  }, [dongName, programId]);

  const [formData, setFormData] = useState({
    name: "김유성",
    address: "(32032) 대전 유성구 학하서로 122번길 33-34",
    contact: "010-1234-5678",
    birthDate: "2003.10.24",
    email: "yuseong34@naver.com",
  });

  const [consent, setConsent] = useState({
    personalInfo: "agree",
    disadvantage: "no",
  });

  const [participationPath, setParticipationPath] = useState(["instagram"]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConsentChange = (e) => {
    const { name, value } = e.target;
    setConsent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipationPathChange = (value) => {
    setParticipationPath([value]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 신청 로직 구현
    console.log("신청 데이터:", { formData, consent, participationPath });
    navigate(`/dong/${dongName}/program/${programId}/apply/success`);
  };

  if (!program) {
    return (
      <Container>
        <ErrorTitle>프로그램을 찾을 수 없습니다.</ErrorTitle>
        <BackButtonLarge onClick={() => navigate(-1)}>돌아가기</BackButtonLarge>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft />
          </BackButton>
          <DocumentIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="#373736"
            >
              <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
            </svg>
          </DocumentIcon>
          <HeaderTitle>프로그램 신청</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <UserInfo>관평동 김유성 접속중</UserInfo>
          <LogoutButton>로그아웃</LogoutButton>
        </HeaderRight>
      </Header>

      <Content>
        {/* 프로그램 정보 카드 */}
        <ProgramCard>
          <ProgramTitle>{program.title}</ProgramTitle>
          <ProgramMeta>
            {program.place} | {program.tuition} | {program.recruitment} | 일시{" "}
            {formatPeriod(program.startDate, program.endDate)} (
            {program.schedule})
          </ProgramMeta>
        </ProgramCard>

        {/* 개인정보 동의서 */}
        <ConsentCard>
          <ConsentTitle>개인정보 처리(수집·이용·제공) 동의서</ConsentTitle>
          <ConsentDescription>
            유성구청에서 수집·이용하는 모든 개인정보는「개인정보 보호법」에
            의하여 안전하게 보관·관리되며, 이용기간 종료 시 지체 없이 폐기됨을
            알려드립니다.
          </ConsentDescription>

          <InfoBox>
            <InfoBoxTitle>수집하는 개인정보의 항목</InfoBoxTitle>
            <InfoBoxText>
              유성구청은 업무처리를 위해 아래와 같은 개인정보를 수집합니다.
            </InfoBoxText>
            <InfoBoxText>
              - 항목 : 성명, 생년월일, 주소, 소속, 직위, 연락처, E-mail, 학력 및
              경력, 자격증 보유현황 등
            </InfoBoxText>
            <InfoBoxTitle style={{ marginTop: "16px" }}>
              개인정보 수집 목적
            </InfoBoxTitle>
            <InfoBoxText>본인 식별, 자료생성 및 지출증빙용</InfoBoxText>
          </InfoBox>

          <RadioQuestion>
            개인정보의 수집 및 이용목적에 동의하십니까?
          </RadioQuestion>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="personalInfo"
                value="agree"
                checked={consent.personalInfo === "agree"}
                onChange={handleConsentChange}
              />
              <RadioText>동의함</RadioText>
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="personalInfo"
                value="disagree"
                checked={consent.personalInfo === "disagree"}
                onChange={handleConsentChange}
              />
              <RadioText>동의하지 않음</RadioText>
            </RadioLabel>
          </RadioGroup>

          <InfoBox>
            <InfoBoxTitle>
              동의를 거부할 권리가 있다는 사실과 동의 거부에 따른 불이익 내용
            </InfoBoxTitle>
            <InfoBoxText>
              귀하는 이에 대한 동의를 거부할 권리가 있으며, 정보제공을 거부할
              경우에는 활동이 불가합니다.
            </InfoBoxText>
          </InfoBox>

          <RadioQuestion>
            동의거부에 따른 불이익 내용을 숙지하였습니까?
          </RadioQuestion>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="disadvantage"
                value="yes"
                checked={consent.disadvantage === "yes"}
                onChange={handleConsentChange}
              />
              <RadioText>네</RadioText>
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="disadvantage"
                value="no"
                checked={consent.disadvantage === "no"}
                onChange={handleConsentChange}
              />
              <RadioText>아니오</RadioText>
            </RadioLabel>
          </RadioGroup>

          <LegalText>
            *「개인정보 보호법」제15조(개인정보의 수집·이용), 제17조(개인정보의
            목적 외 이용), 제18조(개인정보의 이용 제한 내지 제한), 제22조(동의를
            받는 방법)에 의거 개인정보의 이용·제한 관련에 고지를 받으므로 본인은
            위에 같이 개인정보 수집 및 이용 제공에 동의합니다.
          </LegalText>
        </ConsentCard>

        {/* 이름 */}
        <FormCard>
          <FormLabel>이름</FormLabel>
          <FormValue>{formData.name}</FormValue>
        </FormCard>

        {/* 주소 */}
        <FormCard>
          <FormLabel>주소</FormLabel>
          <FormValue>{formData.address}</FormValue>
        </FormCard>

        {/* 연락처 */}
        <FormCard>
          <FormLabel>연락처</FormLabel>
          <FormValue>{formData.contact}</FormValue>
        </FormCard>

        {/* 생년월일 */}
        <FormCard>
          <FormLabel>생년월일</FormLabel>
          <FormValue>{formData.birthDate}</FormValue>
        </FormCard>

        {/* 이메일 */}
        <FormCard>
          <FormLabel>이메일</FormLabel>
          <FormValue>{formData.email}</FormValue>
        </FormCard>

        {/* 참여 경로 */}
        <ParticipationCard>
          <ParticipationTitle>참여 경로</ParticipationTitle>
          <RadioOptionGroup>
            <RadioOptionLabel
              onClick={() => handleParticipationPathChange("homepage")}
            >
              <RadioCircle $selected={participationPath.includes("homepage")} />
              <RadioOptionText>
                홈페이지(유성구청, 대전일자리경제진흥원, 청년센터)
              </RadioOptionText>
            </RadioOptionLabel>
            <RadioOptionLabel
              onClick={() => handleParticipationPathChange("instagram")}
            >
              <RadioCircle
                $selected={participationPath.includes("instagram")}
              />
              <RadioOptionText>인스타그램</RadioOptionText>
            </RadioOptionLabel>
            <RadioOptionLabel
              onClick={() => handleParticipationPathChange("kakao")}
            >
              <RadioCircle $selected={participationPath.includes("kakao")} />
              <RadioOptionText>카카오채널</RadioOptionText>
            </RadioOptionLabel>
            <RadioOptionLabel
              onClick={() => handleParticipationPathChange("outdoor")}
            >
              <RadioCircle $selected={participationPath.includes("outdoor")} />
              <RadioOptionText>옥외광고(현수막, 패널)</RadioOptionText>
            </RadioOptionLabel>
            <RadioOptionLabel
              onClick={() => handleParticipationPathChange("naver")}
            >
              <RadioCircle $selected={participationPath.includes("naver")} />
              <RadioOptionText>네이버 카페, 블로그</RadioOptionText>
            </RadioOptionLabel>
            <RadioOptionLabel
              onClick={() => handleParticipationPathChange("recommendation")}
            >
              <RadioCircle
                $selected={participationPath.includes("recommendation")}
              />
              <RadioOptionText>지인 추천</RadioOptionText>
            </RadioOptionLabel>
            <RadioOptionLabel
              onClick={() => handleParticipationPathChange("other")}
            >
              <RadioCircle $selected={participationPath.includes("other")} />
              <RadioOptionText>기타</RadioOptionText>
            </RadioOptionLabel>
          </RadioOptionGroup>
        </ParticipationCard>
      </Content>

      <SubmitButtonWrapper>
        <SubmitButton type="button" onClick={handleSubmit}>
          프로그램 신청하기
        </SubmitButton>
      </SubmitButtonWrapper>
    </Container>
  );
};

export default ProgramApplication;

const Container = styled.div`
  min-height: 100vh;
  background-color: #e6ecf8;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
    width: 20px;
    height: 20px;
  }
`;

const BackButtonLarge = styled.button`
  background: #1557b7;
  border: none;
  cursor: pointer;
  padding: 12px 24px;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
`;

const DocumentIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #373736;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.span`
  font-size: 14px;
  color: #575656;
`;

const LogoutButton = styled.button`
  padding: 6px 14px;
  background: transparent;
  border: 1px solid #d2d6db;
  border-radius: 4px;
  font-size: 13px;
  color: #373736;
  cursor: pointer;

  &:hover {
    background: #f5f6f9;
  }
`;

const Content = styled.div`
  flex: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProgramCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ProgramTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #373736;
  margin-bottom: 12px;
`;

const ProgramMeta = styled.p`
  font-size: 14px;
  color: #878786;
  line-height: 1.5;
`;

const ConsentCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ConsentTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #373736;
  margin-bottom: 12px;
`;

const ConsentDescription = styled.p`
  font-size: 14px;
  color: #575656;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const InfoBox = styled.div`
  background: #f5f6f9;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 16px;
`;

const InfoBoxTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: #373736;
  margin-bottom: 8px;
`;

const InfoBoxText = styled.p`
  font-size: 13px;
  color: #575656;
  line-height: 1.6;
`;

const RadioQuestion = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #373736;
  margin-bottom: 12px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding: 4px 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  min-height: 24px;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0085bc;
  flex-shrink: 0;
`;

const RadioText = styled.span`
  font-size: 14px;
  color: #373736;
`;

const LegalText = styled.p`
  font-size: 11px;
  color: #878786;
  line-height: 1.6;
  margin-top: 16px;
`;

const FormCard = styled.div`
  background: #f5f6f9;
  border-radius: 8px;
  padding: 20px 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const FormLabel = styled.span`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #373736;
  margin-bottom: 8px;
`;

const FormValue = styled.span`
  display: block;
  font-size: 14px;
  color: #878786;
`;

const ParticipationCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ParticipationTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #373736;
  margin-bottom: 16px;
`;

const RadioOptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const RadioOptionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const RadioCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $selected }) => ($selected ? "#0085bc" : "#d2d6db")};
  background: ${({ $selected }) => ($selected ? "#0085bc" : "#fff")};
  position: relative;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $selected }) => ($selected ? "#fff" : "transparent")};
  }
`;

const RadioOptionText = styled.span`
  font-size: 14px;
  color: #373736;
`;

const SubmitButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 32px;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const SubmitButton = styled.button`
  padding: 10px 28px;
  background: #1557b7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1248a0;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin: 40px 0;
  color: #373736;
`;

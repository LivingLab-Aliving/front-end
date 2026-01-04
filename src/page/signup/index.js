import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const kakaoData = location.state?.kakaoInfo;

  console.log(kakaoData);
  
  const [step, setStep] = useState(1);
  const [agreeAll, setAgreeAll] = useState(false);
  const [addressFile, setAddressFile] = useState(null);
  const [exemptionFile, setExemptionFile] = useState(null);

  const [formData, setFormData] = useState({
    name: kakaoData?.name || "",
    email: kakaoData?.email || "",
    birthDate: kakaoData?.birth || "", 
    phone: kakaoData?.phone || "",
    gender: kakaoData?.gender || "male",
    address: "",
    exemption: "none",
    emailSubscribe: "no",
    smsSubscribe: "no",
    snsSubscribe: "no",
  });

  useEffect(() => {
    if (!kakaoData && step !== 3) {
      alert("카카오 로그인을 먼저 해주세요.");
      navigate("/");
    }
  }, [kakaoData, navigate, step]);

  const handleAgreeAllChange = (e) => {
    setAgreeAll(e.target.checked);
  };

  const handleNextStep = () => {
    if (step === 1 && agreeAll) {
      setStep(2);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleSubmit = async () => {
    try {
      const userId = kakaoData?.userId;

      if (!userId) {
        alert("사용자 식별 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }

      const response = await axios.post(`http://localhost:8080/api/user/${userId}/complete-signup`, formData);

      if (addressFile) {
        const addrFormData = new FormData();
        addrFormData.append("files", addressFile);
        await axios.post(`http://localhost:8080/api/user/${userId}/documents?type=ADDRESS_PROOF`, addrFormData);
      }
      
      if (formData.exemption !== "none" && exemptionFile) {
        const exempFormData = new FormData();
        exempFormData.append("files", exemptionFile);
        await axios.post(`http://localhost:8080/api/user/${userId}/documents?type=CERTIFICATE`, exempFormData);
      }

      if (response.data.userId) {
        const result = response.data.data;
        
        localStorage.setItem("token", `${kakaoData.grantType} ${kakaoData.accessToken}`);
        localStorage.setItem("username", kakaoData.name);
                
        localStorage.setItem("userId", String(userId));
        
        setStep(3);
      }

    } catch (error) {
      console.error(error);
      alert("가입 처리 중 오류가 발생했습니다.");
    }
  };

  const getExemptionLabel = (val) => {
    const labels = {
      none: "해당없음", basic: "기초생활수급자", veteran: "국가유공자", 
      senior: "만 65세 이상", disabled: "장애인"
    };
    return labels[val] || "";
  };

  return (
    <Container>
      <Content>
        <Title>회원가입</Title>
        <Divider />

        <StepIndicator>
          <StepArrow $active={step === 1} $completed={step > 1} $first>
            <StepArrowText>1. 약관 동의</StepArrowText>
            <StepArrowTail $active={step === 1} $completed={step > 1} />
          </StepArrow>
          <StepArrow $active={step === 2} $completed={step > 2}>
            <StepArrowText>2. 정보 입력</StepArrowText>
            <StepArrowTail $active={step === 2} $completed={step > 2} />
          </StepArrow>
          <StepArrow $active={step === 3} $completed={step >= 3} $last>
            <StepArrowText>3. 가입 완료</StepArrowText>
          </StepArrow>
        </StepIndicator>

        {step === 1 && (
          <StepContent>
            <SectionTitle>회원가입 약관</SectionTitle>
            <SectionDescription>
              서비스를 이용하시려면 다음 약관에 동의해주세요. 이용약관과
              개인정보처리방침을 숙지하시고 동의하시면, 서비스를 시작할 수
              있습니다.
            </SectionDescription>

            <TermsSection>
              <TermsTitle>이용 약관</TermsTitle>
              <TermsBox>
                <TermsText>
                  제1조(목적)
                  {"\n"}이 약관은 유성구청 자치 프로그램 센터(이하 "센터")가
                  제공하는 서비스의 이용조건 및 절차에 관한 사항을 규정함을
                  목적으로 합니다.
                  {"\n\n"}
                  제2조(정의)
                  {"\n"}① "서비스"란 센터가 제공하는 모든 서비스를 의미합니다.
                  {"\n"}② "회원"이란 센터와 서비스 이용계약을 체결하고 회원
                  아이디를 부여받은 자를 말합니다.
                  {"\n\n"}
                  제3조(약관의 효력 및 변경)
                  {"\n"}① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로
                  회원에게 공지함으로써 효력이 발생합니다.
                  {"\n"}② 센터는 필요한 경우 이 약관을 변경할 수 있으며, 변경된
                  약관은 제1항과 같은 방법으로 공지함으로써 효력이 발생합니다.
                </TermsText>
              </TermsBox>
            </TermsSection>

            <TermsSection>
              <TermsTitle>개인정보 수집 및 이용</TermsTitle>
              <TermsBox>
                <TermsText>
                  1. 수집하는 개인정보 항목
                  {"\n"}- 필수항목: 성명, 이메일, 연락처, 생년월일
                  {"\n"}- 선택항목: 성별, 주소
                  {"\n\n"}
                  2. 개인정보 수집 및 이용목적
                  {"\n"}- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른
                  요금정산
                  {"\n"}- 회원관리, 본인확인, 개인식별, 불량회원의 부정이용 방지
                  {"\n"}- 고지사항 전달, 불만처리 등을 위한 원활한 의사소통 경로
                  확보
                  {"\n"}- 신규 서비스 개발 및 마케팅·광고에의 활용
                  {"\n\n"}
                  3. 개인정보의 보유 및 이용기간
                  {"\n"}- 회원 탈퇴 시까지 (단, 관계법령에 따라 보존할 필요가
                  있는 경우 해당 기간까지)
                </TermsText>
              </TermsBox>
            </TermsSection>

            <TermsSection>
              <TermsTitle>개인정보처리 위탁 동의</TermsTitle>
              <TermsBox>
                <TermsText>
                  유성구청 자치 프로그램 센터는 서비스 제공을 위해 아래와 같이
                  개인정보 처리를 위탁하고 있습니다.
                  {"\n\n"}
                  1. 수탁업체: (주)○○○
                  {"\n"}2. 위탁업무 내용: 시스템 운영 및 유지보수
                  {"\n"}3. 개인정보의 보유 및 이용기간: 위탁계약 종료 시까지
                  {"\n\n"}
                  위탁업체는 개인정보보호법에 따라 위탁받은 개인정보를 처리함에
                  있어 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지 않도록
                  안전성 확보 조치를 취하고 있습니다.
                </TermsText>
              </TermsBox>
            </TermsSection>

            <AgreeAllSection>
              <AgreeCheckbox
                type="checkbox"
                id="agreeAll"
                checked={agreeAll}
                onChange={handleAgreeAllChange}
              />
              <AgreeLabel htmlFor="agreeAll">
                이 약관에 모두 동의합니다.
              </AgreeLabel>
            </AgreeAllSection>

            <ButtonWrapper>
              <SubmitButton onClick={handleNextStep} disabled={!agreeAll}>
                약관 동의
              </SubmitButton>
            </ButtonWrapper>
          </StepContent>
        )}

        {step === 2 && (
          <StepContent>
            <SectionTitle>정보 입력</SectionTitle>

            <FormTable>
              <tbody>
                <FormRow>
                  <FormLabel>성명</FormLabel>
                  <FormData>
                    <ReadOnlyText>{formData.name}</ReadOnlyText>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>이메일</FormLabel>
                  <FormData>
                    <ReadOnlyText>{formData.email}</ReadOnlyText>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>생년월일</FormLabel>
                  <FormData>
                    <ReadOnlyText>{formData.birthDate}</ReadOnlyText>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>전화번호</FormLabel>
                  <FormData>
                    <ReadOnlyText>{formData.phone}</ReadOnlyText>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>성별</FormLabel>
                  <FormData>
                    <RadioGroup>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleInputChange}
                        />
                        <RadioText>남</RadioText>
                      </RadioLabel>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleInputChange}
                        />
                        <RadioText>여</RadioText>
                      </RadioLabel>
                    </RadioGroup>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>주소</FormLabel>
                  <FormData>
                    <AddressRow>
                      <FormInput
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="주소를 입력해주세요"
                        style={{ flex: 1, maxWidth: "400px" }}
                      />
                      <AddressButton type="button">주소찾기</AddressButton>
                    </AddressRow>
                    <FileRow>
                      <FileButton type="button">
                        <FileIcon>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                          </svg>
                        </FileIcon>
                        파일 선택
                      </FileButton>
                      <HintText>
                        *거주지 확인을 위해, 반드시{" "}
                        <HintLink>3개월 이내 발행된 주민등록 등본을</HintLink>{" "}
                        제출해주세요.
                      </HintText>
                    </FileRow>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>면제 대상 여부</FormLabel>
                  <FormData>
                    <RadioGroup style={{flexWrap: 'wrap', gap: '10px'}}>
                      {["none", "basic", "senior", "disabled"].map((t) => (
                        <RadioLabel key={t}>
                          <RadioInput type="radio" name="exemption" value={t} checked={formData.exemption === t} onChange={handleInputChange} />
                          <RadioText>{getExemptionLabel(t)}</RadioText>
                        </RadioLabel>
                      ))}
                    </RadioGroup>

                    <FileRow style={{ marginTop: "12px" }}>
                      <FileButton type="button">
                        <FileIcon>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                          </svg>
                        </FileIcon>
                        파일 선택
                      </FileButton>
                      <HintText>
                        *감면대상 해당 시, 반드시 관련 증빙 서류를 제출해주세요.
                      </HintText>
                    </FileRow>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>이메일 수신여부</FormLabel>
                  <FormData>
                    <RadioGroup>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="emailSubscribe"
                          value="yes"
                          checked={formData.emailSubscribe === "yes"}
                          onChange={handleInputChange}
                        />
                        <RadioText>네</RadioText>
                      </RadioLabel>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="emailSubscribe"
                          value="no"
                          checked={formData.emailSubscribe === "no"}
                          onChange={handleInputChange}
                        />
                        <RadioText>아니오</RadioText>
                      </RadioLabel>
                    </RadioGroup>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>알림톡 수신여부</FormLabel>
                  <FormData>
                    <RadioGroup>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="smsSubscribe"
                          value="yes"
                          checked={formData.smsSubscribe === "yes"}
                          onChange={handleInputChange}
                        />
                        <RadioText>네</RadioText>
                      </RadioLabel>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="smsSubscribe"
                          value="no"
                          checked={formData.smsSubscribe === "no"}
                          onChange={handleInputChange}
                        />
                        <RadioText>아니오</RadioText>
                      </RadioLabel>
                    </RadioGroup>
                  </FormData>
                </FormRow>
                <FormRow>
                  <FormLabel>SNS 수신여부</FormLabel>
                  <FormData>
                    <RadioGroup>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="snsSubscribe"
                          value="yes"
                          checked={formData.snsSubscribe === "yes"}
                          onChange={handleInputChange}
                        />
                        <RadioText>네</RadioText>
                      </RadioLabel>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="snsSubscribe"
                          value="no"
                          checked={formData.snsSubscribe === "no"}
                          onChange={handleInputChange}
                        />
                        <RadioText>아니오</RadioText>
                      </RadioLabel>
                    </RadioGroup>
                  </FormData>
                </FormRow>
              </tbody>
            </FormTable>

            <ButtonWrapper>
              <SubmitButton onClick={handleSubmit}>가입하기</SubmitButton>
            </ButtonWrapper>
          </StepContent>
        )}

        {step === 3 && (
          <StepContent>
            <SuccessSection>
              <SuccessTitle>회원가입이</SuccessTitle>
              <SuccessTitle>성공적으로 완료되었습니다</SuccessTitle>
              <SuccessDescription>
                로그인 후 프로그램 신청이 가능합니다
              </SuccessDescription>
              <ListButton onClick={handleGoHome}>목록으로</ListButton>
            </SuccessSection>
          </StepContent>
        )}
      </Content>
    </Container>
  );
};

export default SignupPage;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 80px;
  background: #fff;
`;

const Content = styled.div`
  width: 100%;
  max-width: 900px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin: 0 0 16px 0;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #e5e7eb;
  margin-bottom: 32px;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 40px;
`;

const StepArrow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 32px;
  padding-left: ${(props) => (props.$first ? "24px" : "32px")};
  padding-right: ${(props) => (props.$last ? "24px" : "24px")};
  background: ${(props) =>
    props.$active || props.$completed ? "#e0f3fa" : "#fff"};
  color: ${(props) =>
    props.$active || props.$completed ? "#0085bc" : "#9ca3af"};
  border: 1px solid
    ${(props) => (props.$active || props.$completed ? "#0085bc" : "#d1d5db")};
  border-right: ${(props) => (props.$last ? "" : "none")};
  border-radius: ${(props) =>
    props.$first ? "4px 0 0 4px" : props.$last ? "0 4px 4px 0" : "0"};
  font-size: 14px;
  font-weight: 500;
  min-width: 160px;
`;

const StepArrowText = styled.span`
  position: relative;
  z-index: 1;
`;

const StepArrowTail = styled.div`
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 12px solid
    ${(props) => (props.$active || props.$completed ? "#0085bc" : "#d1d5db")};
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    right: 1px;
    top: -18px;
    width: 0;
    height: 0;
    border-top: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 11px solid
      ${(props) => (props.$active || props.$completed ? "#e0f3fa" : "#fff")};
  }
`;

const StepContent = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px 0;
`;

const SectionDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const TermsSection = styled.div`
  margin-bottom: 24px;
`;

const TermsTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
`;

const TermsBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  max-height: 150px;
  overflow-y: auto;
`;

const TermsText = styled.pre`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
`;

const AgreeAllSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 24px 0;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
`;

const AgreeCheckbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #1557b7;
`;

const AgreeLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #111;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const SubmitButton = styled.button`
  padding: 14px 48px;
  background: ${(props) => (props.disabled ? "#d1d5db" : "#1557b7")};
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #1248a0;
  }
`;

const FormTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #1557b7;
  margin-bottom: 32px;
`;

const FormRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
`;

const FormLabel = styled.td`
  width: 160px;
  padding: 16px;
  background: #f5f6f9;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  vertical-align: middle;
  text-align: center;
  border-right: 1px solid #e5e7eb;
`;

const FormData = styled.td`
  padding: 16px;
  background: #fff;
`;

const FormInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #1557b7;
  }
`;

const AddressRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const ReadOnlyText = styled.span`
  font-size: 14px;
  color: #111;
`;

const AddressButton = styled.button`
  padding: 10px 16px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #f9fafb;
  }
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

const FileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #f9fafb;
  }
`;

const FileIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HintText = styled.span`
  font-size: 12px;
  color: #0085bc;
`;

const HintLink = styled.span`
  color: #0085bc;
  text-decoration: underline;
  cursor: pointer;
`;

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #0085bc;
`;

const RadioText = styled.span`
  font-size: 14px;
  color: #374151;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #1557b7;
`;

const CheckboxText = styled.span`
  font-size: 14px;
  color: #374151;
`;

const SuccessSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
`;

const SuccessTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin: 0;
  line-height: 1.4;
`;

const SuccessDescription = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 24px 0 40px 0;
`;

const ListButton = styled.button`
  padding: 14px 48px;
  background: #1557b7;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #1248a0;
  }
`;

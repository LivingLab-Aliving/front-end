import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";
import { PROGRAMS_BY_DONG } from "../../assets/data/data";
import { formatPeriod } from "../../util/utils";
import { getApplicationFormByProgram } from "../../assets/data/applicationForms";

const ApplicationAdd = () => {
    const { dongName } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const programId = searchParams.get('programId');

    // 모든 Hook을 먼저 호출
    // TODO: 실제 API 호출로 프로그램 정보 가져오기
    const program = useMemo(() => {
        if (!programId) return null;
        const dongPrograms = PROGRAMS_BY_DONG[dongName] || [];
        return dongPrograms.find((p) => p.id === programId);
    }, [dongName, programId]);

    // 신청서 데이터
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contact: "",
        birthDate: "",
        email: "",
    });

    // 추가 필드 데이터
    const [additionalFieldValues, setAdditionalFieldValues] = useState({});

    // 신청폼 존재 여부 상태
    const [hasApplicationForm, setHasApplicationForm] = useState(null);
    const [applicationForm, setApplicationForm] = useState(null);

    // 기존 신청폼 불러오기
    useEffect(() => {
        if (!programId) {
            setHasApplicationForm(false);
            return;
        }

        // TODO: 실제 API 호출로 신청폼 데이터 가져오기
        const existingForm = getApplicationFormByProgram(dongName, programId);

        if (existingForm) {
            setApplicationForm(existingForm);
            setHasApplicationForm(true);
            console.log("신청폼 불러옴:", existingForm);
        } else {
            setHasApplicationForm(false);
            console.log("신청폼이 없습니다.");
        }
    }, [dongName, programId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAdditionalFieldChange = (fieldId, value) => {
        setAdditionalFieldValues((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const applicationData = {
            ...formData,
            additionalFields: additionalFieldValues,
            programId: programId,
            dongName: dongName,
            appliedAt: new Date().toISOString(),
        };

        // TODO: 실제 API 호출로 신청자 추가        
        console.log("추가된 신청자 데이터:", applicationData);
        alert("신청자가 추가되었습니다.");
        navigate(-1);
    };

    // programId가 없으면 에러 처리
    if (!programId) {
        return (
            <Container>
                <ErrorMessage>프로그램 ID가 필요합니다.</ErrorMessage>
                <ErrorBackButton onClick={() => navigate(-1)}>돌아가기</ErrorBackButton>
            </Container>
        );
    }

    // 신청폼 로딩 중
    if (hasApplicationForm === null) {
        return (
            <Container>
                <LoadingMessage>신청폼을 불러오는 중...</LoadingMessage>
            </Container>
        );
    }

    // 신청폼이 없는 경우
    if (hasApplicationForm === false) {
        return (
            <Container>
                <ErrorMessage>이 프로그램에는 신청폼이 없습니다.</ErrorMessage>
                <ErrorDescription>
                    프로그램 생성 시 신청폼을 먼저 만들어야 합니다.
                </ErrorDescription>
                <ErrorBackButton onClick={() => navigate(-1)}>돌아가기</ErrorBackButton>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate(-1)}>
                    <ArrowLeft />
                </BackButton>
                <HeaderTitle>인원 추가 등록</HeaderTitle>
            </Header>

            <Content>
                {/* 프로그램 정보 카드 */}
                {program && (
                    <ProgramCard>
                        <ProgramTitle>{program.title}</ProgramTitle>
                        <ProgramMeta>
                            {program.place} | {program.tuition} | {program.recruitment} | 일시{" "}
                            {formatPeriod(program.startDate, program.endDate)} (
                            {program.schedule})
                        </ProgramMeta>
                    </ProgramCard>
                )}

                <form onSubmit={handleSubmit}>
                    {/* 기본 필드들 */}
                    <FormCard>
                        <FormLabel>이름 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="이름을 입력하세요"
                            required
                        />
                    </FormCard>

                    <FormCard>
                        <FormLabel>주소 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="주소를 입력하세요"
                            required
                        />
                    </FormCard>

                    <FormCard>
                        <FormLabel>연락처 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="연락처를 입력하세요"
                            required
                        />
                    </FormCard>

                    <FormCard>
                        <FormLabel>생년월일 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput
                            type="text"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            placeholder="생년월일을 입력하세요 (예: 2003.10.24)"
                            required
                        />
                    </FormCard>

                    <FormCard>
                        <FormLabel>이메일 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </FormCard>

                    {/* 프로그램별 추가 필드들 */}
                    {applicationForm?.additionalFields && applicationForm.additionalFields.length > 0 && (
                        <AdditionalFieldsCard>
                            <AdditionalFieldsTitle>추가 정보</AdditionalFieldsTitle>
                            {applicationForm.additionalFields.map((field) => (
                                <FormCard key={field.id}>
                                    <FormLabel>
                                        {field.label}
                                        {field.required && <RequiredMark> *</RequiredMark>}
                                    </FormLabel>

                                    {field.type === "text" ? (
                                        <FormInput
                                            type="text"
                                            value={additionalFieldValues[field.id] || ""}
                                            onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                                            placeholder={`${field.label}을(를) 입력하세요`}
                                            required={field.required}
                                        />
                                    ) : field.type === "radio" ? (
                                        <RadioGroup>
                                            {field.options?.map((option) => (
                                                <RadioLabel key={option.id}>
                                                    <RadioInput
                                                        type="radio"
                                                        name={`field_${field.id}`}
                                                        value={option.text}
                                                        checked={additionalFieldValues[field.id] === option.text}
                                                        onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                                                        required={field.required}
                                                    />
                                                    <RadioText>{option.text}</RadioText>
                                                </RadioLabel>
                                            ))}
                                        </RadioGroup>
                                    ) : null}
                                </FormCard>
                            ))}
                        </AdditionalFieldsCard>
                    )}

                    <SubmitButtonWrapper>
                        <CancelButton type="button" onClick={() => navigate(-1)}>
                            취소
                        </CancelButton>
                        <SubmitButton type="submit">
                            인원 추가
                        </SubmitButton>
                    </SubmitButtonWrapper>
                </form>
            </Content>
        </Container>
    );
};

export default ApplicationAdd;

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

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  font-family: "Pretendard", sans-serif;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProgramCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px 32px;
  border: 1px solid #e6e6e6;
`;

const ProgramTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin-bottom: 12px;
  font-family: "Pretendard", sans-serif;
`;

const ProgramMeta = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  font-family: "Pretendard", sans-serif;
`;

const FormCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e6e6e6;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-family: "Pretendard", sans-serif;
`;

const RequiredMark = styled.span`
  color: #ff4757;
  font-weight: 600;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: #fff;
  font-family: "Pretendard", sans-serif;
  
  &:focus {
    outline: none;
    border-color: #1557b7;
    box-shadow: 0 0 0 3px rgba(21, 87, 183, 0.1);
  }
  
  &::placeholder {
    color: #9d9d9c;
  }
`;

const AdditionalFieldsCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e6e6e6;
`;

const AdditionalFieldsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
  font-family: "Pretendard", sans-serif;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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
  color: #333;
  font-family: "Pretendard", sans-serif;
`;

const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: #fff;
  color: #333;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #1557b7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }
`;

const ErrorMessage = styled.h2`
  font-size: 24px;
  text-align: center;
  margin: 40px 0;
  color: #ff4757;
  font-family: "Pretendard", sans-serif;
`;

const LoadingMessage = styled.h2`
  font-size: 24px;
  text-align: center;
  margin: 40px 0;
  color: #666;
  font-family: "Pretendard", sans-serif;
`;

const ErrorDescription = styled.p`
  font-size: 16px;
  text-align: center;
  margin: 20px 0;
  color: #666;
  line-height: 1.5;
  font-family: "Pretendard", sans-serif;
`;

const ErrorBackButton = styled.button`
  background: #1557b7;
  border: none;
  cursor: pointer;
  padding: 12px 24px;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  margin: 0 auto;
  display: block;
  font-family: "Pretendard", sans-serif;
  
  &:hover {
    background: #1248a0;
  }
`;
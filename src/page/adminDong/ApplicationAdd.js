import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios"; // axios 추가
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";
import { formatPeriod } from "../../util/utils";

const ApplicationAdd = () => {
    const { dongName } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const programId = searchParams.get('programId');

    // 상태 관리
    const [program, setProgram] = useState(null);
    const [applicationForm, setApplicationForm] = useState(null);
    const [hasApplicationForm, setHasApplicationForm] = useState(null);
    
    // 기본 신청서 데이터
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contact: "",
        birthDate: "",
        email: "",
    });

    const [additionalFieldValues, setAdditionalFieldValues] = useState({});

    // 🌟 데이터 로드 로직 (백엔드 통합)
    useEffect(() => {
        const fetchProgramAndForm = async () => {
            if (!programId) return;

            try {
                setHasApplicationForm(null); // 로딩 시작

                // 1. 프로그램 기본 정보 가져오기
                const programRes = await axios.get(`http://localhost:8080/api/program/${programId}`);
                setProgram(programRes.data.data);

                // 2. 프로그램 신청폼 항목(질문들) 가져오기
                const formRes = await axios.get(`http://localhost:8080/api/program/${programId}/form`);
                const formItems = formRes.data.data;

                if (formItems && formItems.length > 0) {
                    setApplicationForm({ additionalFields: formItems });
                    setHasApplicationForm(true);
                } else {
                    // 기본 신청 정보만 있는 경우
                    setHasApplicationForm(true);
                    setApplicationForm({ additionalFields: [] });
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                setHasApplicationForm(false);
            }
        };

        fetchProgramAndForm();
    }, [programId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdditionalFieldChange = (fieldId, value) => {
        setAdditionalFieldValues((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    // 🌟 제출 로직 (백엔드 ApplicationRequestDto.Apply 규격에 맞춤)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 백엔드 답변 리스트 규격 변환 (List<AnswerRequest>)
        const answers = Object.entries(additionalFieldValues).map(([id, val]) => ({
            formItemId: parseInt(id),
            answer: val
        }));

        const submitData = {
            // 기본 필드 (백엔드 User 정보와 매칭되거나 별도 필드일 경우)
            ...formData, 
            answers: answers,
            participationPath: "관리자 직접 추가" // 예시 필드
        };

        try {
            const adminId = localStorage.getItem("adminId"); // 관리자 권한 확인용
            // 사용자를 대신해 등록하는 경우이므로 API 엔드포인트 확인 필요 (userId는 예시로 1번 전달)
            await axios.post(`http://localhost:8080/api/program/${programId}/apply?userId=1`, submitData);
            
            alert("신청자가 성공적으로 추가되었습니다.");
            navigate(-1);
        } catch (error) {
            alert("신청 실패: " + (error.response?.data?.message || "서버 오류"));
        }
    };

    // --- 조건부 렌더링 로직 (기존과 동일) ---
    if (!programId) return <Container><ErrorMessage>프로그램 ID가 필요합니다.</ErrorMessage></Container>;
    if (hasApplicationForm === null) return <Container><LoadingMessage>신청폼을 불러오는 중...</LoadingMessage></Container>;
    if (hasApplicationForm === false) return <Container><ErrorMessage>이 프로그램에는 신청폼이 없습니다.</ErrorMessage></Container>;

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate(-1)}><ArrowLeft /></BackButton>
                <HeaderTitle>인원 추가 등록</HeaderTitle>
            </Header>

            <Content>
                {program && (
                    <ProgramCard>
                        <ProgramTitle>{program.programName}</ProgramTitle>
                        <ProgramMeta>
                            {program.eduPlace} | {program.eduPrice}원 | {program.capacity}명 정원
                        </ProgramMeta>
                    </ProgramCard>
                )}

                <form onSubmit={handleSubmit}>
                    <FormCard>
                        <FormLabel>이름 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput name="name" value={formData.name} onChange={handleInputChange} required />
                    </FormCard>
                    <FormCard>
                        <FormLabel>주소 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput name="address" value={formData.address} onChange={handleInputChange} required />
                    </FormCard>
                    <FormCard>
                        <FormLabel>연락처 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput name="contact" value={formData.contact} onChange={handleInputChange} required />
                    </FormCard>
                    <FormCard>
                        <FormLabel>생년월일 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput name="birthDate" value={formData.birthDate} onChange={handleInputChange} placeholder="2003.10.24" required />
                    </FormCard>
                    <FormCard>
                        <FormLabel>이메일 <RequiredMark>*</RequiredMark></FormLabel>
                        <FormInput type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </FormCard>

                    {/* 🌟 백엔드에서 가져온 추가 필드 렌더링 */}
                    {applicationForm?.additionalFields?.map((field) => (
                        <FormCard key={field.id}>
                            <FormLabel>{field.label}{field.required && <RequiredMark> *</RequiredMark>}</FormLabel>
                            {field.type === "TEXT" ? (
                                <FormInput
                                    value={additionalFieldValues[field.id] || ""}
                                    onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                                    required={field.required}
                                />
                            ) : field.type === "RADIO" ? (
                                <RadioGroup>
                                    {field.options?.map((option, idx) => (
                                        <RadioLabel key={idx}>
                                            <RadioInput
                                                type="radio"
                                                name={`field_${field.id}`}
                                                value={option}
                                                checked={additionalFieldValues[field.id] === option}
                                                onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                                                required={field.required}
                                            />
                                            <RadioText>{option}</RadioText>
                                        </RadioLabel>
                                    ))}
                                </RadioGroup>
                            ) : null}
                        </FormCard>
                    ))}

                    <SubmitButtonWrapper>
                        <CancelButton type="button" onClick={() => navigate(-1)}>취소</CancelButton>
                        <SubmitButton type="submit">인원 추가</SubmitButton>
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
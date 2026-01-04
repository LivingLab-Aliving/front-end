import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { formatPeriod } from "../../util/utils";

const ApplicationEdit = () => {
  const { dongName, programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [hasApplicationForm, setHasApplicationForm] = useState(null);

  // 1. 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (!programId) return;
      try {
        setHasApplicationForm(null);
        // 프로그램 상세 정보
        const programRes = await axios.get(`http://localhost:8080/api/program/${programId}`);
        setProgram(programRes.data.data);

        // 신청폼 질문들
        const formRes = await axios.get(`http://localhost:8080/api/program/${programId}/form`);
        const existingFields = formRes.data.data;

        if (existingFields && existingFields.length > 0) {
          const formattedFields = existingFields.map(field => ({
            id: field.id || Date.now() + Math.random(),
            label: field.label,
            type: field.type.toLowerCase(),
            required: field.required,
            options: field.options ? field.options.map(opt => ({ id: Math.random(), text: opt })) : []
          }));
          setAdditionalFields(formattedFields);
          setHasApplicationForm(true);
        } else {
          setHasApplicationForm(false);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setHasApplicationForm(false);
      }
    };
    fetchData();
  }, [programId]);

  // 2. 수정 완료 제출 (FormData 활용)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendFormattedFields = additionalFields.map(field => ({
      label: field.label,
      type: field.type.toUpperCase(),
      required: field.required,
      options: field.type === 'radio' ? field.options.map(opt => opt.text) : []
    }));

    try {
      const adminId = localStorage.getItem("adminId");

      await axios.put(
        `http://localhost:8080/api/program/${programId}/form`, 
        backendFormattedFields, 
        {
          params: { adminId: adminId },
          headers: { "Content-Type": "application/json" }
        }
      );

      alert("신청폼 수정이 완료되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("수정 실패:", error);
      console.log(program);
      alert("수정 실패: " + (error.response?.data?.message || "서버 오류"));
    }
  };

  // 질문 핸들러
  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { id: Date.now(), label: "", type: "text", required: false, options: [] }]);
  };
  const handleFieldChange = (id, field, value) => {
    setAdditionalFields(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  const handleAddOption = (fieldId) => {
    setAdditionalFields(prev => prev.map(item => item.id === fieldId ? { ...item, options: [...item.options, { id: Date.now(), text: "" }] } : item));
  };
  const handleOptionChange = (fieldId, optionId, value) => {
    setAdditionalFields(prev => prev.map(item => item.id === fieldId ? { ...item, options: item.options.map(opt => opt.id === optionId ? { ...opt, text: value } : opt) } : item));
  };
  const handleRemoveOption = (fieldId, optionId) => {
    setAdditionalFields(prev => prev.map(item => item.id === fieldId ? { ...item, options: item.options.filter(opt => opt.id !== optionId) } : item));
  };
  const handleRemoveField = (id) => {
    setAdditionalFields(prev => prev.filter(item => item.id !== id));
  };

  if (hasApplicationForm === null) return <Container><LoadingMessage>로딩 중...</LoadingMessage></Container>;

  return (
    <Container>

      <Content>
        {/* 프로그램 정보 카드 - program이 있을 때만 표시 */}
        {program && (
          <ProgramCard>
            <ProgramTitle>{program.programName}</ProgramTitle>
            <ProgramMeta>
              {program.eduPlace} | {program.eduPrice}원 | 
              모집: {formatPeriod(program.recruitStartDate, program.recruitEndDate)} | 
              일시: {program.eduTime}
            </ProgramMeta>
          </ProgramCard>
        )}

        <FormCard>
          <FormLabel>공통 수집 항목</FormLabel>
          <InfoBox>이름, 주소, 연락처, 생년월일, 이메일 정보는 자동으로 수집됩니다.</InfoBox>
        </FormCard>

        {/* 추가 필드 테이블 */}
        {additionalFields.length > 0 && (
          <AdditionalFieldsCard>
            <AdditionalFieldsTitle>추가 정보 필드</AdditionalFieldsTitle>
            {additionalFields.map((field) => (
              <FieldContainer key={field.id}>
                <FieldHeader>
                  <FieldHeaderRow>
                    <AdditionalFieldInput
                      type="text"
                      placeholder="질문명 (예: 특이사항, 경력사항 등)"
                      value={field.label}
                      onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                    />
                    <FieldTypeSelect
                      value={field.type}
                      onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                    >
                      <option value="text">단답형</option>
                      <option value="radio">객관식</option>
                    </FieldTypeSelect>
                    <RequiredCheckbox>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                      />
                      <span>필수</span>
                    </RequiredCheckbox>
                    <RemoveFieldButton onClick={() => handleRemoveField(field.id)}>
                      삭제
                    </RemoveFieldButton>
                  </FieldHeaderRow>
                </FieldHeader>

                {/* 객관식일 때 옵션 관리 */}
                {field.type === "radio" && (
                  <OptionsContainer>
                    <OptionsTitle>선택 옵션</OptionsTitle>
                    {field.options.map((option) => (
                      <OptionRow key={option.id}>
                        <RadioIcon>○</RadioIcon>
                        <OptionInput
                          type="text"
                          placeholder="옵션 텍스트"
                          value={option.text}
                          onChange={(e) => handleOptionChange(field.id, option.id, e.target.value)}
                        />
                        <RemoveOptionButton onClick={() => handleRemoveOption(field.id, option.id)}>
                          ×
                        </RemoveOptionButton>
                      </OptionRow>
                    ))}
                    <AddOptionButton onClick={() => handleAddOption(field.id)}>
                      + 옵션 추가
                    </AddOptionButton>
                  </OptionsContainer>
                )}

                {/* 단답형일 때 미리보기 */}
                {field.type === "text" && (
                  <PreviewContainer>
                    <PreviewLabel>미리보기:</PreviewLabel>
                    <PreviewInput placeholder="답변을 입력하세요" disabled />
                  </PreviewContainer>
                )}
              </FieldContainer>
            ))}
          </AdditionalFieldsCard>
        )}

        {/* 테이블 추가 버튼 */}
        <AddFieldButtonWrapper>
          <AddFieldButton onClick={handleAddField}>
            <PlusIcon>+</PlusIcon>
          </AddFieldButton>
        </AddFieldButtonWrapper>
      </Content>

      <SubmitButtonWrapper>
        <CancelButton type="button" onClick={() => navigate(-1)}>
          취소
        </CancelButton>
        <SubmitButton type="button" onClick={handleSubmit}>
          수정 완료
        </SubmitButton>
      </SubmitButtonWrapper>
    </Container>
  );
};

export default ApplicationEdit;

const Container = styled.div`
  min-height: 100vh;
  background-color: #e6ecf8;
  display: flex;
  flex-direction: column;
  position: relative;
`;

// eslint-disable-next-line
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

// eslint-disable-next-line
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// eslint-disable-next-line
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



// eslint-disable-next-line
const DocumentIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// eslint-disable-next-line
const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #373736;
`;

// eslint-disable-next-line
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// eslint-disable-next-line
const UserInfo = styled.span`
  font-size: 14px;
  color: #575656;
`;

// eslint-disable-next-line
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

const FormCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #373736;
  margin-bottom: 8px;
`;

const InfoBox = styled.div` 
background: #f9f9f9; padding: 12px; border-radius: 4px; font-size: 14px; color: #888; border: 1px dashed #ccc; `;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d2d6db;
  border-radius: 4px;
  font-size: 14px;
  color: #373736;
  background: #fff;
  
  &:focus {
    outline: none;
    border-color: #0085bc;
    box-shadow: 0 0 0 2px rgba(0, 133, 188, 0.1);
  }
  
  &::placeholder {
    color: #878786;
  }
`;

const SubmitButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const CancelButton = styled.button`
  padding: 10px 28px;
  background: #fff;
  color: #373736;
  border: 1px solid #d2d6db;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f6f9;
  }
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



const AdditionalFieldsCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const AdditionalFieldsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #373736;
  margin-bottom: 16px;
`;





const FieldContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
`;

const FieldHeader = styled.div`
  margin-bottom: 12px;
`;

const FieldHeaderRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const FieldTypeSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d2d6db;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  min-width: 100px;
  
  &:focus {
    outline: none;
    border-color: #0085bc;
  }
`;

const RequiredCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #0085bc;
  }
`;

const OptionsContainer = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
`;

const OptionsTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const RadioIcon = styled.span`
  font-size: 16px;
  color: #666;
  width: 20px;
  text-align: center;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d2d6db;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0085bc;
  }
`;

const RemoveOptionButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: #ff4757;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #ff3742;
  }
`;

const AddOptionButton = styled.button`
  padding: 8px 16px;
  border: 1px dashed #0085bc;
  background: #fff;
  color: #0085bc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f0f9ff;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
`;

const PreviewLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: block;
`;

const PreviewInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d2d6db;
  border-radius: 4px;
  font-size: 14px;
  background: #f9f9f9;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const AdditionalFieldInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d2d6db;
  border-radius: 4px;
  font-size: 14px;
  color: #373736;
  background: #fff;
  
  &:focus {
    outline: none;
    border-color: #0085bc;
    box-shadow: 0 0 0 2px rgba(0, 133, 188, 0.1);
  }
  
  &::placeholder {
    color: #878786;
  }
`;

const RemoveFieldButton = styled.button`
  padding: 8px 16px;
  background: #ff4757;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #ff3742;
  }
`;

const AddFieldButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px 0;
`;

const AddFieldButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px dashed #0085bc;
  background: #fff;
  color: #0085bc;
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f0f9ff;
    border-color: #006ba6;
    color: #006ba6;
  }
`;

const PlusIcon = styled.span`
  font-size: 24px;
  line-height: 1;
`;

const ErrorMessage = styled.h2`
  font-size: 24px;
  text-align: center;
  margin: 40px 0;
  color: #ff4757;
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
`;

const LoadingMessage = styled.h2`
  font-size: 24px;
  text-align: center;
  margin: 40px 0;
  color: #666;
`;

const ErrorDescription = styled.p`
  font-size: 16px;
  text-align: center;
  margin: 20px 0;
  color: #666;
  line-height: 1.5;
`;
import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";

const ApplicationCreate = () => {
  const { dongName } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get("programId"); // 기존 프로그램 ID (있으면 수정 모드)

  // 신청서 데이터
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    birthDate: "",
    email: "",
  });

  // 추가 필드 데이터
  const [additionalFields, setAdditionalFields] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      label: "",
      type: "text",
      required: false,
      options: [],
    };
    setAdditionalFields([...additionalFields, newField]);
  };

  const handleFieldChange = (id, field, value) => {
    setAdditionalFields((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddOption = (fieldId) => {
    setAdditionalFields((prev) =>
      prev.map((item) =>
        item.id === fieldId
          ? {
              ...item,
              options: [...item.options, { id: Date.now(), text: "" }],
            }
          : item
      )
    );
  };

  const handleOptionChange = (fieldId, optionId, value) => {
    setAdditionalFields((prev) =>
      prev.map((item) =>
        item.id === fieldId
          ? {
              ...item,
              options: item.options.map((opt) =>
                opt.id === optionId ? { ...opt, text: value } : opt
              ),
            }
          : item
      )
    );
  };

  const handleRemoveOption = (fieldId, optionId) => {
    setAdditionalFields((prev) =>
      prev.map((item) =>
        item.id === fieldId
          ? {
              ...item,
              options: item.options.filter((opt) => opt.id !== optionId),
            }
          : item
      )
    );
  };

  const handleRemoveField = (id) => {
    setAdditionalFields((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const applicationFormData = {
      basicFields: formData,
      additionalFields: additionalFields,
      createdAt: new Date().toISOString(),
    };

    // 기존 프로그램에 신청폼 연결하는 경우
    if (programId) {
      try {
        const adminId = localStorage.getItem("adminId");

        // 백엔드 API 형식에 맞게 변환
        const formItems = additionalFields.map((field) => ({
          label: field.label || "",
          type: field.type === "text" ? "TEXT" : "RADIO",
          required: field.required || false,
          options:
            field.options?.map((opt) =>
              typeof opt === "string" ? opt : opt.text
            ) || [],
        }));

        // 신청폼 생성 API 호출
        const response = await axios.post(
          `http://localhost:8080/api/program/${programId}/form`,
          {
            formItems: formItems,
          },
          {
            params: { adminId: adminId },
          }
        );

        console.log("신청폼 생성 성공:", response.data);
        alert("신청폼이 프로그램에 연결되었습니다.");

        // 프로그램 수정 페이지로 돌아가기
        navigate(`/admin/dong/${dongName}/edit/${programId}`);
      } catch (error) {
        console.error("신청폼 생성 실패:", error);
        alert("신청폼 생성 중 오류가 발생했습니다.");
      }
      return;
    }

    // 새 프로그램 생성용 신청폼 (기존 로직)
    // 생성된 폼 데이터를 sessionStorage에 임시 저장
    const tempFormId = `temp_${Date.now()}`;
    sessionStorage.setItem(
      "tempApplicationForm",
      JSON.stringify({
        id: tempFormId,
        ...applicationFormData,
      })
    );

    console.log("생성된 신청폼 데이터:", applicationFormData);
    alert("신청폼이 생성되었습니다.");

    // 프로그램 생성 페이지로 돌아가면서 폼 ID 전달
    navigate(`/admin/dong/${dongName}/add?tempFormId=${tempFormId}`);
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton
            onClick={() => {
              if (programId) {
                navigate(`/admin/dong/${dongName}/edit/${programId}`);
              } else {
                navigate(-1);
              }
            }}
          >
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
          <HeaderTitle>
            {programId ? "신청폼 만들기 (기존 프로그램)" : "신청폼 만들기"}
          </HeaderTitle>
        </HeaderLeft>
      </Header>

      <Content>
        {/* 기본 필드들 */}
        <FormCard>
          <FormLabel>이름</FormLabel>
          <FormInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="이름을 입력하세요"
          />
        </FormCard>

        <FormCard>
          <FormLabel>주소</FormLabel>
          <FormInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="주소를 입력하세요"
          />
        </FormCard>

        <FormCard>
          <FormLabel>연락처</FormLabel>
          <FormInput
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="연락처를 입력하세요"
          />
        </FormCard>

        <FormCard>
          <FormLabel>생년월일</FormLabel>
          <FormInput
            type="text"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            placeholder="생년월일을 입력하세요 (예: 2003.10.24)"
          />
        </FormCard>

        <FormCard>
          <FormLabel>이메일</FormLabel>
          <FormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="이메일을 입력하세요"
          />
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
                      onChange={(e) =>
                        handleFieldChange(field.id, "label", e.target.value)
                      }
                    />
                    <FieldTypeSelect
                      value={field.type}
                      onChange={(e) =>
                        handleFieldChange(field.id, "type", e.target.value)
                      }
                    >
                      <option value="text">단답형</option>
                      <option value="radio">객관식</option>
                    </FieldTypeSelect>
                    <RequiredCheckbox>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          handleFieldChange(
                            field.id,
                            "required",
                            e.target.checked
                          )
                        }
                      />
                      <span>필수</span>
                    </RequiredCheckbox>
                    <RemoveFieldButton
                      onClick={() => handleRemoveField(field.id)}
                    >
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
                          onChange={(e) =>
                            handleOptionChange(
                              field.id,
                              option.id,
                              e.target.value
                            )
                          }
                        />
                        <RemoveOptionButton
                          onClick={() =>
                            handleRemoveOption(field.id, option.id)
                          }
                        >
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
        <CancelButton
          type="button"
          onClick={() => {
            if (programId) {
              // 기존 프로그램 수정 모드면 수정 페이지로
              navigate(`/admin/dong/${dongName}/edit/${programId}`);
            } else {
              // 새 프로그램 생성 모드면 이전 페이지로
              navigate(-1);
            }
          }}
        >
          취소
        </CancelButton>
        <SubmitButton type="button" onClick={handleSubmit}>
          {programId ? "신청폼 연결" : "신청폼 생성"}
        </SubmitButton>
      </SubmitButtonWrapper>
    </Container>
  );
};

export default ApplicationCreate;

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

const AdditionalFieldInput = styled.input`
  flex: 1;
  padding: 8px 12px;
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

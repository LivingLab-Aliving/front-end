import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { formatPeriod } from "../../util/utils";
import { saveApplicationForm } from "../../assets/data/applicationForms";

const ApplicationEdit = () => {
  const { dongName } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get("programId");

  // 프로그램 정보 상태
  const [program, setProgram] = useState(null);

  // 신청서 데이터 (빈 상태로 시작)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    birthDate: "",
    email: "",
  });

  // 추가 필드 데이터 (신청폼 생성용)
  const [additionalFields, setAdditionalFields] = useState([]);

  // 신청폼 존재 여부 상태
  const [hasApplicationForm, setHasApplicationForm] = useState(null); // null: 로딩중, true: 있음, false: 없음

  // 프로그램 정보와 신청폼 불러오기
  useEffect(() => {
    if (!programId) {
      setHasApplicationForm(false);
      return;
    }

    const fetchProgramAndForm = async () => {
      try {
        // 프로그램 정보 가져오기
        const adminId = localStorage.getItem("adminId");
        const programResponse = await axios.get(
          `http://localhost:8080/api/program/${programId}`,
          {
            params: { adminId: adminId ? parseInt(adminId, 10) : null },
          }
        );

        const programData = programResponse.data.data;
        setProgram({
          id: programData.programId,
          title: programData.programName,
          place: programData.eduPlace || "",
          tuition:
            programData.eduPrice === 0
              ? "무료"
              : `${programData.eduPrice.toLocaleString()}원`,
          recruitment: programData.targetAudience || "전체",
          startDate: programData.recruitStartDate,
          endDate: programData.recruitEndDate,
          eduStartDate: programData.eduStartDate,
          eduEndDate: programData.eduEndDate,
          schedule: programData.eduTime || "",
        });
      } catch (error) {
        console.error("프로그램 정보 로드 실패:", error);
      }

      // 신청폼 정보 가져오기
      const fetchApplicationForm = async () => {
        try {
          // 백엔드 API로 신청폼 데이터 가져오기
          const response = await axios.get(
            `http://localhost:8080/api/program/${programId}/form`
          );

          console.log("신청폼 API 응답:", response.data);

          // 기본 필드(이름, 주소, 연락처, 생년월일, 이메일)는 항상 있으므로
          // additionalFields가 비어있어도 신청폼이 있다고 간주
          if (response.data?.data && Array.isArray(response.data.data)) {
            // 백엔드 응답을 프론트엔드 형식으로 변환
            const formItems = response.data.data;
            const basicFields = {
              name: "",
              address: "",
              contact: "",
              birthDate: "",
              email: "",
            };
            const additionalFields = formItems.map((item) => ({
              id: item.formItemId || Date.now(),
              label: item.label || "",
              type: item.type === "TEXT" ? "text" : "radio",
              required: item.required || false,
              options: item.options || [],
            }));

            setFormData(basicFields);
            setAdditionalFields(additionalFields);
            setHasApplicationForm(true);
            console.log("기존 신청폼 불러옴:", {
              basicFields,
              additionalFields,
            });
          } else {
            // 신청폼이 없거나 빈 배열인 경우
            setHasApplicationForm(false);
            console.log("기존 신청폼이 없습니다. (빈 배열 또는 null)");
          }
        } catch (error) {
          console.error("신청폼 조회 실패:", error);
          // 404나 다른 에러인 경우 신청폼이 없는 것으로 간주
          setHasApplicationForm(false);
        }
      };

      await fetchApplicationForm();
    };

    fetchProgramAndForm();
  }, [dongName, programId]);

  // programId가 없거나 신청폼이 없으면 에러 처리 (Hook 호출 후)
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const applicationFormData = {
      programName: program?.title || "프로그램",
      basicFields: formData,
      additionalFields: additionalFields,
      updatedAt: new Date().toISOString(),
    };

    // TODO: 실제 API 호출로 신청폼 수정 저장
    const savedForm = saveApplicationForm(
      dongName,
      programId,
      applicationFormData
    );
    console.log("수정된 신청폼 데이터:", savedForm);
    alert("신청폼이 수정되었습니다.");
    navigate(-1);
  };

  return (
    <Container>
      <Content>
        {/* 프로그램 정보 카드 - program이 있을 때만 표시 */}
        {program && (
          <ProgramCard>
            <ProgramTitle>{program.title}</ProgramTitle>
            <ProgramMeta>
              <MetaItem>장소: {program.place || "-"}</MetaItem>
              <MetaItem>수강료: {program.tuition || "-"}</MetaItem>
              <MetaItem>모집대상: {program.recruitment || "-"}</MetaItem>
              <MetaItem>
                교육기간:{" "}
                {formatPeriod(program.eduStartDate, program.eduEndDate)}
              </MetaItem>
              <MetaItem>
                모집기간: {formatPeriod(program.startDate, program.endDate)}
              </MetaItem>
              {program.schedule && (
                <MetaItem>교육시간: {program.schedule}</MetaItem>
              )}
            </ProgramMeta>
          </ProgramCard>
        )}

        {/* 이름 */}
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

        {/* 주소 */}
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

        {/* 연락처 */}
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

        {/* 생년월일 */}
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

        {/* 이메일 */}
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

const ProgramMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  font-family: "Pretendard", sans-serif;
`;

const MetaItem = styled.div`
  font-size: 14px;
  color: #333;
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

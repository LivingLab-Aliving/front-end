// src/page/adminDong/programEdit.js

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const ProgramEditPage = () => {
  const { dongName, programId } = useParams();
  const navigate = useNavigate();

  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasForm, setHasForm] = useState(false); // 신청폼 존재 여부

  const [formData, setFormData] = useState({
    programName: "",
    scheduleStartHour: "10",
    scheduleStartMinute: "00",
    scheduleEndHour: "12",
    scheduleEndMinute: "00",
    quarter: "",
    educationPeriodStart: "",
    educationPeriodEnd: "",
    recruitmentPeriodStart: "",
    recruitmentPeriodStartHour: "09",
    recruitmentPeriodStartMinute: "00",
    recruitmentPeriodEnd: "",
    recruitmentPeriodEndHour: "18",
    recruitmentPeriodEndMinute: "00",
    location: "",
    category: "",
    capacity: "",
    fee: "",
    materials: "",
    institution: dongName,
    recruitmentLimit: "대전광역시 유성구민",
    instructor: "",
    attachment: null,
    detailInfo: "",
  });

  // 백엔드 API 호출로 기존 프로그램 데이터 불러오기
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        setLoading(true);
        const adminId = localStorage.getItem("adminId");
        const response = await axios.get(
          `http://localhost:8080/api/program/${programId}`,
          {
            params: { adminId },
          }
        );

        console.log("프로그램 데이터:", response.data.data);

        const program = response.data.data;

        // 신청폼 존재 여부 확인
        try {
          const formResponse = await axios.get(
            `http://localhost:8080/api/program/${programId}/form`
          );
          if (formResponse.data?.data && formResponse.data.data.length > 0) {
            setHasForm(true);
            console.log("신청폼 존재:", formResponse.data.data);
          } else {
            setHasForm(false);
          }
        } catch (error) {
          console.log("신청폼 조회 실패 (신청폼이 없을 수 있음):", error);
          setHasForm(false);
        }

        // 시간 파싱 (예: "10:00-12:00")
        let scheduleStartHour = "10";
        let scheduleStartMinute = "00";
        let scheduleEndHour = "12";
        let scheduleEndMinute = "00";

        if (program.eduTime) {
          const timeMatch = program.eduTime.match(
            /(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/
          );
          if (timeMatch) {
            scheduleStartHour = timeMatch[1];
            scheduleStartMinute = timeMatch[2];
            scheduleEndHour = timeMatch[3];
            scheduleEndMinute = timeMatch[4];
          }
        }

        // 날짜 파싱 함수 (ISO 8601 형식에서 YYYY-MM-DD 추출)
        const parseDate = (dateString) => {
          if (!dateString) return "";
          if (dateString.includes("T")) {
            return dateString.split("T")[0];
          }
          return dateString;
        };

        // 모집기간 시간 파싱 (ISO 8601 형식에서 시간 추출)
        const parseDateTime = (dateTimeString) => {
          if (!dateTimeString) return { date: "", hour: "09", minute: "00" };
          let date = "";
          let hour = "09";
          let minute = "00";

          if (dateTimeString.includes("T")) {
            const [datePart, timePart] = dateTimeString.split("T");
            date = datePart;
            if (timePart) {
              const [h, m] = timePart.split(":");
              hour = h || "09";
              minute = m || "00";
            }
          } else {
            date = dateTimeString;
          }

          return { date, hour, minute };
        };

        // targetAudience를 프론트엔드 형식으로 변환
        const getTargetAudienceDisplay = (targetAudience) => {
          if (!targetAudience) return "대전광역시 유성구민";
          const valueStr = targetAudience.toString();
          if (valueStr.includes("전체") || valueStr === "ALL") return "전체";
          if (valueStr.includes("성인") || valueStr === "ADULT") return "성인";
          if (valueStr.includes("장애인") || valueStr === "DISABLED")
            return "장애인";
          if (valueStr.includes("청소년") || valueStr === "TEENAGER")
            return "청소년";
          if (valueStr.includes("어린이") || valueStr === "CHILD")
            return "어린이";
          return "대전광역시 유성구민";
        };

        // 분기 변환 (숫자 -> "1분기" 형식)
        const formatQuarter = (quarter) => {
          if (!quarter) return "";
          const quarterNum =
            typeof quarter === "string"
              ? parseInt(quarter.replace("분기", ""))
              : quarter;
          if (isNaN(quarterNum)) return "";
          return `${quarterNum}분기`;
        };

        const recruitStart = parseDateTime(program.recruitStartDate);
        const recruitEnd = parseDateTime(program.recruitEndDate);

        setFormData({
          programName: program.programName || "",
          scheduleStartHour: scheduleStartHour,
          scheduleStartMinute: scheduleStartMinute,
          scheduleEndHour: scheduleEndHour,
          scheduleEndMinute: scheduleEndMinute,
          quarter: formatQuarter(program.quarter),
          educationPeriodStart: parseDate(program.eduStartDate),
          educationPeriodEnd: parseDate(program.eduEndDate),
          recruitmentPeriodStart: recruitStart.date,
          recruitmentPeriodStartHour: recruitStart.hour,
          recruitmentPeriodStartMinute: recruitStart.minute,
          recruitmentPeriodEnd: recruitEnd.date,
          recruitmentPeriodEndHour: recruitEnd.hour,
          recruitmentPeriodEndMinute: recruitEnd.minute,
          location: program.eduPlace || "",
          category: program.programType === "AUTONOMOUS" ? "자치형" : "유성형",
          capacity: program.capacity ? String(program.capacity) : "",
          fee: program.eduPrice ? String(program.eduPrice) : "",
          materials: program.needs || "",
          institution: program.institution || dongName,
          recruitmentLimit: getTargetAudienceDisplay(program.targetAudience),
          instructor: program.instructorName || "",
          attachment: program.classPlanUrl || null,
          detailInfo: program.description || "",
        });
      } catch (error) {
        console.error("프로그램 데이터를 불러오는데 실패했습니다.", error);
        alert("프로그램을 찾을 수 없습니다.");
        navigate(`/admin/dong/${dongName}`);
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgramData();
    }
  }, [dongName, programId, navigate]);

  // 신청폼 수정 후 돌아왔을 때 상태 갱신을 위한 useEffect
  useEffect(() => {
    const handleFocus = () => {
      // 페이지가 다시 포커스될 때 신청폼 상태 확인
      if (programId) {
        const checkFormStatus = async () => {
          try {
            const formResponse = await axios.get(
              `http://localhost:8080/api/program/${programId}/form`
            );
            if (formResponse.data?.data && formResponse.data.data.length > 0) {
              setHasForm(true);
            } else {
              setHasForm(false);
            }
          } catch (error) {
            setHasForm(false);
          }
        };
        checkFormStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [programId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachment: e.target.files[0],
    }));
  };

  const handleEditApplicationForm = () => {
    navigate(`/admin/dong/${dongName}/application-edit?programId=${programId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminId = localStorage.getItem("adminId");

      // 시간 포맷팅
      const eduTime = `${formData.scheduleStartHour}:${formData.scheduleStartMinute}-${formData.scheduleEndHour}:${formData.scheduleEndMinute}`;

      // 프로그램 수정 데이터 준비
      const updateData = {
        programName: formData.programName,
        quarter: formData.quarter ? parseInt(formData.quarter) : null,
        eduStartDate: formData.educationPeriodStart,
        eduEndDate: formData.educationPeriodEnd,
        recruitStartDate: formData.recruitmentPeriodStart,
        recruitEndDate: formData.recruitmentPeriodEnd,
        eduPlace: formData.location,
        programType: formData.category === "자치형" ? "AUTONOMOUS" : "YUSEONG",
        capacity: formData.capacity ? parseInt(formData.capacity) : 0,
        eduPrice: formData.fee ? parseInt(formData.fee) : 0,
        needs: formData.materials,
        institution: formData.institution,
        instructorName: formData.instructor,
        description: formData.detailInfo,
        eduTime: eduTime,
        targetAudience: formData.recruitmentLimit,
      };

      // 파일이 있으면 FormData로 전송
      if (formData.attachment && formData.attachment instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", formData.attachment);

        // 먼저 파일 업로드
        await axios.post(
          `http://localhost:8080/api/program/${programId}/class-plan`,
          formDataToSend,
          {
            params: { adminId },
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      // 프로그램 정보 수정
      await axios.put(
        `http://localhost:8080/api/program/${programId}`,
        updateData,
        {
          params: { adminId },
        }
      );

      alert("프로그램이 성공적으로 수정되었습니다.");
      navigate(`/admin/dong/${dongName}/success`);
    } catch (error) {
      console.error("프로그램 수정 실패:", error);
      alert("프로그램 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/admin/dong/${dongName}`);
  };

  const handleDuplicateCheck = () => {
    // TODO: 실제 API 호출로 프로그램명 중복 체크
    setIsDuplicateChecked(true);
  };

  return (
    <PageContainer>
      <Inner>
        <Title>{formData.programName || "프로그램 수정"}</Title>

        <Form onSubmit={handleSubmit}>
          {/* 프로그램 기본 설정 */}
          <Section>
            <SectionTitle>프로그램 기본 설정</SectionTitle>

            <TableRow>
              <FieldLabel>프로그램명</FieldLabel>
              <FieldValue>
                <InputWithButton>
                  <Input
                    id="programName"
                    name="programName"
                    type="text"
                    value={formData.programName}
                    onChange={handleChange}
                    required
                  />
                  <TextButton
                    type="button"
                    onClick={handleDuplicateCheck}
                    $isChecked={isDuplicateChecked}
                  >
                    중복체크
                  </TextButton>
                </InputWithButton>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>교육일정</FieldLabel>
              <FieldValue>
                <TimeRangeWrapper>
                  <TimeSelectGroup>
                    <TimeSelect
                      name="scheduleStartHour"
                      value={formData.scheduleStartHour}
                      onChange={handleChange}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={String(i).padStart(2, "0")}>
                          {String(i).padStart(2, "0")}
                        </option>
                      ))}
                    </TimeSelect>
                    <TimeLabel>시</TimeLabel>
                    <TimeSelect
                      name="scheduleStartMinute"
                      value={formData.scheduleStartMinute}
                      onChange={handleChange}
                    >
                      {["00", "10", "20", "30", "40", "50"].map((min) => (
                        <option key={min} value={min}>
                          {min}
                        </option>
                      ))}
                    </TimeSelect>
                    <TimeLabel>분</TimeLabel>
                  </TimeSelectGroup>
                  <Separator>~</Separator>
                  <TimeSelectGroup>
                    <TimeSelect
                      name="scheduleEndHour"
                      value={formData.scheduleEndHour}
                      onChange={handleChange}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={String(i).padStart(2, "0")}>
                          {String(i).padStart(2, "0")}
                        </option>
                      ))}
                    </TimeSelect>
                    <TimeLabel>시</TimeLabel>
                    <TimeSelect
                      name="scheduleEndMinute"
                      value={formData.scheduleEndMinute}
                      onChange={handleChange}
                    >
                      {["00", "10", "20", "30", "40", "50"].map((min) => (
                        <option key={min} value={min}>
                          {min}
                        </option>
                      ))}
                    </TimeSelect>
                    <TimeLabel>분</TimeLabel>
                  </TimeSelectGroup>
                </TimeRangeWrapper>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>분기</FieldLabel>
              <FieldValue>
                <Select
                  id="quarter"
                  name="quarter"
                  value={formData.quarter}
                  onChange={handleChange}
                >
                  <option value="">선택</option>
                  <option value="1분기">1분기</option>
                  <option value="2분기">2분기</option>
                  <option value="3분기">3분기</option>
                  <option value="4분기">4분기</option>
                </Select>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>교육기간</FieldLabel>
              <FieldValue>
                <DateRangeWrapper>
                  <Input
                    id="educationPeriodStart"
                    name="educationPeriodStart"
                    type="date"
                    value={formData.educationPeriodStart}
                    onChange={handleChange}
                  />
                  <Separator>~</Separator>
                  <Input
                    id="educationPeriodEnd"
                    name="educationPeriodEnd"
                    type="date"
                    value={formData.educationPeriodEnd}
                    onChange={handleChange}
                  />
                </DateRangeWrapper>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>모집기간</FieldLabel>
              <FieldValue>
                <DateTimeRangeWrapper>
                  <DateRangeWrapper>
                    <Input
                      id="recruitmentPeriodStart"
                      name="recruitmentPeriodStart"
                      type="date"
                      value={formData.recruitmentPeriodStart}
                      onChange={handleChange}
                    />
                    <TimeSelectGroup>
                      <TimeSelect
                        name="recruitmentPeriodStartHour"
                        value={formData.recruitmentPeriodStartHour}
                        onChange={handleChange}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={String(i).padStart(2, "0")}>
                            {String(i).padStart(2, "0")}
                          </option>
                        ))}
                      </TimeSelect>
                      <TimeLabel>시</TimeLabel>
                      <TimeSelect
                        name="recruitmentPeriodStartMinute"
                        value={formData.recruitmentPeriodStartMinute}
                        onChange={handleChange}
                      >
                        {["00", "10", "20", "30", "40", "50"].map((min) => (
                          <option key={min} value={min}>
                            {min}
                          </option>
                        ))}
                      </TimeSelect>
                      <TimeLabel>분</TimeLabel>
                    </TimeSelectGroup>
                  </DateRangeWrapper>
                  <Separator>~</Separator>
                  <DateRangeWrapper>
                    <Input
                      id="recruitmentPeriodEnd"
                      name="recruitmentPeriodEnd"
                      type="date"
                      value={formData.recruitmentPeriodEnd}
                      onChange={handleChange}
                    />
                    <TimeSelectGroup>
                      <TimeSelect
                        name="recruitmentPeriodEndHour"
                        value={formData.recruitmentPeriodEndHour}
                        onChange={handleChange}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={String(i).padStart(2, "0")}>
                            {String(i).padStart(2, "0")}
                          </option>
                        ))}
                      </TimeSelect>
                      <TimeLabel>시</TimeLabel>
                      <TimeSelect
                        name="recruitmentPeriodEndMinute"
                        value={formData.recruitmentPeriodEndMinute}
                        onChange={handleChange}
                      >
                        {["00", "10", "20", "30", "40", "50"].map((min) => (
                          <option key={min} value={min}>
                            {min}
                          </option>
                        ))}
                      </TimeSelect>
                      <TimeLabel>분</TimeLabel>
                    </TimeSelectGroup>
                  </DateRangeWrapper>
                </DateTimeRangeWrapper>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>교육장소</FieldLabel>
              <FieldValue>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                />
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>분류</FieldLabel>
              <FieldValue>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">선택</option>
                  <option value="유성형">유성형</option>
                  <option value="자치형">자치형</option>
                </Select>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>신청인원</FieldLabel>
              <FieldValue>
                <CapacityWrapper>
                  <InputWithUnit>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                    <UnitLabel>명</UnitLabel>
                  </InputWithUnit>
                  {hasForm ? (
                    <ApplicationFormButton
                      type="button"
                      onClick={handleEditApplicationForm}
                    >
                      신청폼 수정
                    </ApplicationFormButton>
                  ) : (
                    <ApplicationFormButton
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/dong/${dongName}/application-create?programId=${programId}`
                        )
                      }
                    >
                      신청폼 만들기
                    </ApplicationFormButton>
                  )}
                </CapacityWrapper>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>수강료</FieldLabel>
              <FieldValue>
                <InputWithUnit>
                  <Input
                    id="fee"
                    name="fee"
                    type="number"
                    value={formData.fee}
                    onChange={handleChange}
                  />
                  <UnitLabel>원</UnitLabel>
                </InputWithUnit>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>학습자준비물</FieldLabel>
              <FieldValue>
                <Input
                  id="materials"
                  name="materials"
                  type="text"
                  value={formData.materials}
                  onChange={handleChange}
                />
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>교육기관/모집제한</FieldLabel>
              <FieldValue>
                <MultiSelectWrapper>
                  <InstitutionInput>
                    <Input
                      id="institution"
                      name="institution"
                      type="text"
                      value={formData.institution}
                      onChange={handleChange}
                    />
                  </InstitutionInput>
                  <InstitutionInput>
                    <Input
                      id="recruitmentLimit"
                      name="recruitmentLimit"
                      type="text"
                      value={formData.recruitmentLimit}
                      onChange={handleChange}
                    />
                  </InstitutionInput>
                </MultiSelectWrapper>
              </FieldValue>
            </TableRow>
          </Section>

          {/* 프로그램 상세 설정 */}
          <Section>
            <SectionTitle>프로그램 상세 설정</SectionTitle>

            <TableRow>
              <FieldLabel>강사명</FieldLabel>
              <FieldValue>
                <Input
                  id="instructor"
                  name="instructor"
                  type="text"
                  value={formData.instructor}
                  onChange={handleChange}
                />
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>첨부파일</FieldLabel>
              <FieldValue>
                <FileInput
                  id="attachment"
                  name="attachment"
                  type="file"
                  onChange={handleFileChange}
                />
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>상세정보입력</FieldLabel>
              <WideFieldValue>
                <Textarea
                  id="detailInfo"
                  name="detailInfo"
                  rows={8}
                  placeholder="프로그램에 대한 상세 정보를 입력하세요"
                  value={formData.detailInfo}
                  onChange={handleChange}
                />
              </WideFieldValue>
            </TableRow>
          </Section>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit">프로그램 수정하기</SubmitButton>
          </ButtonGroup>
        </Form>
      </Inner>
    </PageContainer>
  );
};

export default ProgramEditPage;

const PageContainer = styled.section`
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 48px 40px 96px;
  background-color: #f5f6f9;
`;

const Inner = styled.div`
  width: min(1000px, 100%);
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
  font-family: "Pretendard", sans-serif;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  background-color: #fff;
  padding: 32px;
  border-radius: 8px;
  border: 1px solid #d2d6db;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d2d6db;
  font-family: "Pretendard", sans-serif;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d2d6db;
  min-height: 60px;

  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.div`
  width: 200px;
  min-width: 200px;
  padding: 16px 24px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  background-color: #f5f6f9;
  border-right: 1px solid #d2d6db;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  font-family: "Pretendard", sans-serif;
`;

const FieldValue = styled.div`
  flex: 1;
  padding: 16px 24px;
  background: #fff;
`;

const WideFieldValue = styled.div`
  flex: 1;
  padding: 16px 20px;
  width: 100%;
`;

const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DateTimeRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const MultiSelectWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const InstitutionInput = styled.div`
  max-width: 35%;
`;

const Separator = styled.span`
  color: #666;
`;

const TimeRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TimeSelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeSelect = styled.select`
  padding: 0.5rem 1rem 0.5rem 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
  width: 70px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const TimeLabel = styled.span`
  font-size: 0.95rem;
  color: #666;
`;

const InputWithButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputWithUnit = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnitLabel = styled.span`
  font-size: 0.95rem;
  color: #666;
  white-space: nowrap;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$isChecked ? "#1557b7" : "#666")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  transition: color 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    color: #1557b7;
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #333;
  font-family: "Pretendard", sans-serif;

  &:focus {
    outline: none;
    border-color: #1557b7;
    box-shadow: 0 0 0 3px rgba(21, 87, 183, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 40px 12px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background: #fff;
  color: #333;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  transition: all 0.2s ease;
  font-family: "Pretendard", sans-serif;

  &:hover {
    border-color: #1557b7;
    background-color: #f8f9fa;
  }

  &:focus {
    outline: none;
    border-color: #1557b7;
    box-shadow: 0 0 0 3px rgba(21, 87, 183, 0.1);
    background-color: #fff;
  }

  &:active {
    border-color: #1248a0;
  }

  option {
    padding: 8px;
    font-weight: 400;
  }
`;

const FileInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const BaseButton = styled.button`
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
`;

const SubmitButton = styled(BaseButton)`
  background: #1557b7;
  color: white;
  border-color: #1557b7;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }
`;

const CancelButton = styled(BaseButton)`
  background: #fff;
  color: #555;
  border-color: #d0d0d0;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #f5f5f5;
  }
`;

const CapacityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const ApplicationFormButton = styled.button`
  padding: 8px 16px;
  background: #1557b7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }
`;

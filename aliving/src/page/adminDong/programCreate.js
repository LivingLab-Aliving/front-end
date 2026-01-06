// src/page/adminDong/programCreate.js

import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ReactComponent as LogoSvg } from "../../assets/logo.svg";
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";
import { saveApplicationForm } from "../../assets/data/applicationForms";

const ProgramCreatePage = () => {
  const { dongName } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // dongName 디버깅
  useEffect(() => {
    console.log("=== ProgramCreatePage 마운트 ===");
    console.log("URL에서 추출한 dongName:", dongName);
    console.log("dongName 타입:", typeof dongName);
    console.log("dongName이 있는지:", !!dongName);
    console.log("================================");
  }, [dongName]);

  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [applicationFormId, setApplicationFormId] = useState(null);
  const [applicationFormData, setApplicationFormData] = useState(null);
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [adminName, setAdminName] = useState("나과정");

  // 날짜 포맷팅 (예: 2025.11.13. (목))
  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = days[today.getDay()];
    return `${year}.${month}.${day}. (${dayOfWeek})`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminId");
    navigate("/admin/login");
  };

  const [formData, setFormData] = useState({
    programName: "",
    scheduleStartHour: "10",
    scheduleStartMinute: "00",
    scheduleEndHour: "12",
    scheduleEndMinute: "00",
    quarter: "",
    educationPeriodStart: "",
    educationPeriodStartHour: "00",
    educationPeriodStartMinute: "00",
    educationPeriodEnd: "",
    educationPeriodEndHour: "23",
    educationPeriodEndMinute: "59",
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

  // URL 파라미터에서 tempFormId 확인 및 저장된 프로그램 정보 복원
  useEffect(() => {
    // 저장된 프로그램 정보 복원
    const savedFormData = sessionStorage.getItem("tempProgramFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        console.log("저장된 프로그램 정보 복원됨:", parsedData);
        // 복원 후에도 sessionStorage에 유지 (프로그램 생성 완료 시까지)
      } catch (error) {
        console.error("저장된 프로그램 정보 복원 실패:", error);
      }
    }

    const tempFormId = searchParams.get("tempFormId");
    if (tempFormId) {
      setApplicationFormId(tempFormId);
      console.log("임시 신청폼 ID 설정됨:", tempFormId);

      // 임시 폼 데이터 확인
      const tempForm = JSON.parse(
        sessionStorage.getItem("tempApplicationForm") || "{}"
      );
      if (tempForm.id === tempFormId) {
        console.log("임시 폼 데이터 확인됨:", tempForm);
        console.log("기본 필드:", tempForm.basicFields);
        console.log("추가 필드:", tempForm.additionalFields);
        setApplicationFormData(tempForm);
      }
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 날짜를 Date 객체로 변환하는 헬퍼 함수
  const parseDateString = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Date 객체를 YYYY-MM-DD 형식으로 변환하는 헬퍼 함수
  const formatDateString = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 변경 핸들러
  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: formatDateString(date),
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachment: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 handleSubmit 함수 호출됨!");
    console.log("현재 formData:", formData);

    // 필수 필드 검증
    const requiredFields = {
      programName: "프로그램명",
      educationPeriodStart: "교육기간 시작일",
      educationPeriodEnd: "교육기간 종료일",
      recruitmentPeriodStart: "모집기간 시작일",
      recruitmentPeriodEnd: "모집기간 종료일",
      location: "교육 장소",
      capacity: "정원",
      category: "프로그램 분류",
    };

    const missingFields = [];
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!formData[key] || formData[key].toString().trim() === "") {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      console.log("❌ 필수 필드 누락:", missingFields);
      alert(`다음 필수 항목을 입력해주세요:\n${missingFields.join(", ")}`);
      return;
    }

    console.log("✅ 필수 필드 검증 통과");

    try {
      const adminIdStr = localStorage.getItem("adminId");

      if (!adminIdStr) {
        alert("관리자 로그인이 필요합니다.");
        navigate("/admin/login");
        return;
      }

      // adminId를 숫자로 변환 (백엔드는 Long 타입을 기대함)
      const adminId = parseInt(adminIdStr, 10);

      if (isNaN(adminId)) {
        alert("유효하지 않은 관리자 ID입니다. 다시 로그인해주세요.");
        navigate("/admin/login");
        return;
      }

      console.log("adminId (숫자):", adminId, "타입:", typeof adminId);

      // 시간 포맷팅
      const eduTime = `${formData.scheduleStartHour}:${formData.scheduleStartMinute}-${formData.scheduleEndHour}:${formData.scheduleEndMinute}`;

      // 날짜를 LocalDateTime 형식으로 변환 (ISO 8601 형식)
      const formatDateTime = (dateStr, hour = "00", minute = "00") => {
        if (!dateStr) return null;
        // "2025-01-15" 형식을 "2025-01-15T00:00:00" 형식으로 변환
        return `${dateStr}T${hour}:${minute}:00`;
      };

      // targetAudience를 enum 값으로 변환
      // 백엔드 enum: ALL, ADULT, DISABLED, TEENAGER, CHILD
      const getTargetAudienceEnum = (value) => {
        if (!value) return "ALL";
        const valueStr = value.toString();
        if (valueStr.includes("전체") || valueStr.includes("ALL")) return "ALL";
        if (valueStr.includes("성인") || valueStr.includes("ADULT"))
          return "ADULT";
        if (valueStr.includes("장애인") || valueStr.includes("DISABLED"))
          return "DISABLED";
        if (valueStr.includes("청소년") || valueStr.includes("TEENAGER"))
          return "TEENAGER";
        if (valueStr.includes("어린이") || valueStr.includes("CHILD"))
          return "CHILD";
        return "ALL"; // 기본값
      };

      // dongName 확인 및 검증
      const currentDongName = dongName || "";
      console.log("=== handleSubmit 시작 ===");
      console.log("dongName 원본:", dongName);
      console.log("dongName 현재값:", currentDongName);
      console.log(
        "dongName이 비어있는지:",
        !currentDongName || currentDongName.trim() === ""
      );

      if (!currentDongName || currentDongName.trim() === "") {
        alert("동 이름이 없습니다. 올바른 경로로 접근해주세요.");
        navigate(`/admin/dong`);
        return;
      }

      const trimmedDongName = currentDongName.trim();
      console.log("사용할 dongName (trimmed):", trimmedDongName);

      // 프로그램 생성 데이터 준비 (백엔드 DTO 필드명에 맞춰서 매핑)
      const programDataForBackend = {
        programName: formData.programName.trim(),
        quarter: formData.quarter ? parseInt(formData.quarter) : null,
        eduStartDate: formatDateTime(
          formData.educationPeriodStart,
          formData.educationPeriodStartHour,
          formData.educationPeriodStartMinute
        ),
        eduEndDate: formatDateTime(
          formData.educationPeriodEnd,
          formData.educationPeriodEndHour,
          formData.educationPeriodEndMinute
        ),
        recruitStartDate: formatDateTime(
          formData.recruitmentPeriodStart,
          formData.recruitmentPeriodStartHour,
          formData.recruitmentPeriodStartMinute
        ),
        recruitEndDate: formatDateTime(
          formData.recruitmentPeriodEnd,
          formData.recruitmentPeriodEndHour,
          formData.recruitmentPeriodEndMinute
        ),
        eduPlace: formData.location.trim(),
        programType: formData.category === "자치형" ? "AUTONOMOUS" : "YUSEONG",
        capacity: formData.capacity ? parseInt(formData.capacity) : 0,
        eduPrice: formData.fee ? parseInt(formData.fee) : 0,
        needs: formData.materials || "",
        institution: formData.institution || trimmedDongName,
        instructorId: null, // 백엔드는 instructorId를 사용
        description: formData.detailInfo || "",
        eduTime: eduTime,
        targetAudience: getTargetAudienceEnum(formData.recruitmentLimit), // enum 값으로 변환
        dongName: trimmedDongName, // 확실히 전송되도록 trim된 값 사용
        additionalFields:
          applicationFormData?.additionalFields?.map((field) => ({
            label: field.label || "",
            type: field.type === "text" ? "TEXT" : "RADIO",
            required: field.required || false,
            options:
              field.options?.map((opt) =>
                typeof opt === "string" ? opt : opt.text
              ) || [],
          })) || [], // 신청폼 추가 필드
      };

      // 디버깅: 전송할 데이터 확인
      console.log("=== 프로그램 생성 요청 ===");
      console.log("전송할 프로그램 데이터:", programDataForBackend);
      console.log("dongName 원본:", dongName);
      console.log("dongName trimmed:", trimmedDongName);
      console.log(
        "dongName이 포함되었는지:",
        "dongName" in programDataForBackend
      );
      console.log("dongName 실제 값:", programDataForBackend.dongName);
      console.log(
        "dongName이 'none'인지:",
        programDataForBackend.dongName === "none"
      );
      console.log(
        "dongName이 undefined인지:",
        programDataForBackend.dongName === undefined
      );
      console.log("JSON 문자열:", JSON.stringify(programDataForBackend));
      console.log("adminId:", adminId);
      console.log(
        "URL:",
        `http://localhost:8080/api/program?adminId=${adminId}`
      );

      // 백엔드는 multipart/form-data 형식을 기대함
      const formDataToSend = new FormData();

      // DTO를 JSON 문자열로 변환하여 "dto" 파트로 추가
      const dtoJsonString = JSON.stringify(programDataForBackend);
      console.log("=== DTO JSON 문자열 확인 ===");
      console.log("전체 JSON:", dtoJsonString);
      console.log("dongName 포함 여부:", dtoJsonString.includes('"dongName"'));
      console.log(
        "dongName 값 확인:",
        dtoJsonString.match(/"dongName"\s*:\s*"([^"]*)"/)?.[1]
      );
      console.log("===========================");

      // Spring Boot가 @RequestPart로 JSON을 받을 수 있도록 Blob으로 변환
      // Content-Type을 명시적으로 설정
      const dtoBlob = new Blob([dtoJsonString], {
        type: "application/json",
      });
      formDataToSend.append(
        "dto",
        dtoBlob,
        "dto.json" // 파일명 지정
      );

      // Blob 내용을 다시 읽어서 확인
      dtoBlob.text().then((text) => {
        console.log("=== FormData에 추가된 dto 파일 내용 확인 ===");
        console.log("파일 내용:", text);
        const parsed = JSON.parse(text);
        console.log("파싱된 dongName:", parsed.dongName);
        console.log("==========================================");
      });

      // 썸네일 파일이 있으면 추가
      if (formData.attachment && formData.attachment instanceof File) {
        formDataToSend.append("classPlanFile", formData.attachment);
      }

      console.log("FormData 내용:");
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File || pair[1] instanceof Blob) {
          console.log(
            pair[0] + ": [File/Blob]",
            pair[1].type,
            pair[1].size,
            "bytes"
          );
        } else {
          console.log(pair[0] + ": ", pair[1]);
        }
      }

      // 프로그램 생성 - multipart/form-data 형식으로 전송
      // FormData를 사용하면 axios가 자동으로 multipart/form-data와 boundary를 설정함
      const response = await axios.post(
        `http://localhost:8080/api/program`,
        formDataToSend,
        {
          params: {
            adminId: adminId, // 숫자로 변환된 adminId 전송
            dongName: trimmedDongName, // dongName을 URL 파라미터로도 전송 (백엔드가 필요시 사용)
          },
          // headers를 명시하지 않으면 axios가 자동으로 multipart/form-data와 boundary를 설정
        }
      );

      const createdProgramId = response.data.data.programId;
      console.log("생성된 프로그램 ID:", createdProgramId);
      console.log("생성된 프로그램 전체 응답:", response.data.data);

      // 생성된 프로그램 조회해서 dongName 확인
      try {
        const checkResponse = await axios.get(
          `http://localhost:8080/api/program/${createdProgramId}`,
          {
            params: { adminId },
          }
        );
        console.log("=== 생성된 프로그램 확인 ===");
        console.log("프로그램 상세 정보:", checkResponse.data.data);
        console.log("dongName 값:", checkResponse.data.data.dongName);
        console.log("===========================");
      } catch (checkError) {
        console.error("생성된 프로그램 확인 실패:", checkError);
      }

      // 파일이 있으면 업로드
      if (formData.attachment && formData.attachment instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", formData.attachment);

        await axios.post(
          `http://localhost:8080/api/program/${createdProgramId}/class-plan`,
          formDataToSend,
          {
            params: { adminId },
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      // 임시 저장된 신청폼을 정식으로 저장
      if (applicationFormId) {
        const tempForm = JSON.parse(
          sessionStorage.getItem("tempApplicationForm") || "{}"
        );
        if (tempForm.tempId === applicationFormId) {
          // 임시 신청폼을 정식 신청폼으로 저장
          const savedForm = saveApplicationForm(dongName, createdProgramId, {
            programName: formData.programName,
            basicFields: tempForm.basicFields,
            additionalFields: tempForm.additionalFields,
          });
          console.log("신청폼이 프로그램과 연결되어 저장됨:", savedForm);

          // 임시 데이터 삭제
          sessionStorage.removeItem("tempApplicationForm");
        }
      }

      // 프로그램 생성 성공 시 임시 저장된 데이터 정리
      sessionStorage.removeItem("tempProgramFormData");
      sessionStorage.removeItem("tempApplicationForm");

      alert("프로그램이 성공적으로 생성되었습니다.");
      navigate(`/admin/dong/${dongName}/success`);
    } catch (error) {
      console.error("=== 프로그램 생성 실패 ===");
      console.error("에러 전체:", error);
      console.error("에러 응답:", error.response);
      console.error("에러 상태 코드:", error.response?.status);
      console.error("에러 메시지:", error.response?.data);
      console.error("에러 헤더:", error.response?.headers);
      console.error("요청 데이터:", error.config?.data);
      console.error("요청 URL:", error.config?.url);
      console.error("요청 헤더:", error.config?.headers);

      let errorMessage = "프로그램 생성 중 오류가 발생했습니다.";

      if (error.response) {
        // 서버 응답이 있는 경우
        if (error.response.status === 500) {
          // 백엔드 에러 메시지가 있으면 표시
          const backendMessage =
            error.response.data?.message || "서버 내부 오류가 발생했습니다.";

          if (backendMessage.includes("관리자 없음")) {
            errorMessage =
              "관리자 정보를 찾을 수 없습니다.\n\n데이터베이스가 리셋되었을 수 있습니다.\n다시 로그인해주세요.";
            // localStorage 정리 후 로그인 페이지로 이동
            localStorage.removeItem("adminId");
            localStorage.removeItem("isAdminLoggedIn");
            localStorage.removeItem("token");
            setTimeout(() => {
              navigate("/admin/login");
            }, 2000);
          } else {
            errorMessage = `서버 오류: ${backendMessage}\n\n관리자에게 문의하세요.`;
          }
        } else if (error.response.status === 415) {
          errorMessage =
            "서버가 요청 형식을 지원하지 않습니다. (415 오류)\n\n콘솔을 확인하여 전송된 데이터를 확인해주세요.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data) {
          errorMessage = `서버 오류: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        errorMessage =
          "서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.";
      }

      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    // 취소 시 임시 저장된 데이터 정리
    sessionStorage.removeItem("tempProgramFormData");
    sessionStorage.removeItem("tempApplicationForm");
    navigate(`/admin/dong/${dongName}`);
  };

  const handleBack = () => {
    navigate(`/admin/dong/${dongName}`);
  };

  const handleDuplicateCheck = () => {
    // TODO: 실제 API 호출로 프로그램명 중복 체크
    setIsDuplicateChecked(true);
  };

  const handleCreateApplicationForm = () => {
    // 현재 입력된 프로그램 정보를 sessionStorage에 저장
    sessionStorage.setItem("tempProgramFormData", JSON.stringify(formData));
    navigate(`/admin/dong/${dongName}/application-create`);
  };

  return (
    <PageContainer>
      <AdminHeader>
        <LogoContainer
          onClick={() => navigate("/admin/home")}
          style={{ cursor: "pointer" }}
        >
          <LogoSvg />
        </LogoContainer>
        <HeaderRight>
          <DateInfo>
            {getFormattedDate()} {dongName} 관리자 접속중
          </DateInfo>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </HeaderRight>
      </AdminHeader>
      <Inner>
        <TitleSection>
          <BackButton onClick={handleBack}>
            <ArrowLeft />
          </BackButton>
          <Title>프로그램 생성</Title>
        </TitleSection>

        <Form onSubmit={handleSubmit}>
          {/* 프로그램 기본 설정 */}
          <Section>
            <SectionTitle>프로그램 기본 설정</SectionTitle>

            <TableRow>
              <FieldLabel>
                <RequiredMark>*</RequiredMark>프로그램명
              </FieldLabel>
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
              <FieldLabel>
                <RequiredMark>*</RequiredMark>교육일정
              </FieldLabel>
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
              <FieldLabel>
                <RequiredMark>*</RequiredMark>분기
              </FieldLabel>
              <FieldValue>
                <Select
                  id="quarter"
                  name="quarter"
                  value={formData.quarter}
                  onChange={handleChange}
                >
                  <option value="">선택</option>
                  <option value="1">1분기</option>
                  <option value="2">2분기</option>
                  <option value="3">3분기</option>
                  <option value="4">4분기</option>
                </Select>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>
                <RequiredMark>*</RequiredMark>교육기간
              </FieldLabel>
              <FieldValue>
                <DateTimeRangeWrapper>
                  <DateRangeWrapper>
                    <DatePickerWrapper>
                      <CalendarIcon>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="14"
                            height="13"
                            rx="1"
                            stroke="#666"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <line
                            x1="3"
                            y1="8"
                            x2="17"
                            y2="8"
                            stroke="#666"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="7"
                            y1="2"
                            x2="7"
                            y2="6"
                            stroke="#666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1="13"
                            y1="2"
                            x2="13"
                            y2="6"
                            stroke="#666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </CalendarIcon>
                      <StyledDatePicker
                        selected={parseDateString(
                          formData.educationPeriodStart
                        )}
                        onChange={(date) =>
                          handleDateChange("educationPeriodStart", date)
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="날짜 선택"
                        showPopperArrow={false}
                      />
                    </DatePickerWrapper>
                    <TimeSelectGroup>
                      <TimeSelect
                        name="educationPeriodStartHour"
                        value={formData.educationPeriodStartHour}
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
                        name="educationPeriodStartMinute"
                        value={formData.educationPeriodStartMinute}
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
                    <DatePickerWrapper>
                      <CalendarIcon>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="14"
                            height="13"
                            rx="1"
                            stroke="#666"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <line
                            x1="3"
                            y1="8"
                            x2="17"
                            y2="8"
                            stroke="#666"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="7"
                            y1="2"
                            x2="7"
                            y2="6"
                            stroke="#666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1="13"
                            y1="2"
                            x2="13"
                            y2="6"
                            stroke="#666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </CalendarIcon>
                      <StyledDatePicker
                        selected={parseDateString(formData.educationPeriodEnd)}
                        onChange={(date) =>
                          handleDateChange("educationPeriodEnd", date)
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="날짜 선택"
                        showPopperArrow={false}
                      />
                    </DatePickerWrapper>
                    <TimeSelectGroup>
                      <TimeSelect
                        name="educationPeriodEndHour"
                        value={formData.educationPeriodEndHour}
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
                        name="educationPeriodEndMinute"
                        value={formData.educationPeriodEndMinute}
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
              <FieldLabel>
                <RequiredMark>*</RequiredMark>모집기간
              </FieldLabel>
              <FieldValue>
                <DateTimeRangeWrapper>
                  <DateRangeWrapper>
                    <DatePickerWrapper>
                      <CalendarIcon>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="14"
                            height="13"
                            rx="1"
                            stroke="#666"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <line
                            x1="3"
                            y1="8"
                            x2="17"
                            y2="8"
                            stroke="#666"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="7"
                            y1="2"
                            x2="7"
                            y2="6"
                            stroke="#666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1="13"
                            y1="2"
                            x2="13"
                            y2="6"
                            stroke="#666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </CalendarIcon>
                      <StyledDatePicker
                        selected={parseDateString(
                          formData.recruitmentPeriodStart
                        )}
                        onChange={(date) =>
                          handleDateChange("recruitmentPeriodStart", date)
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="날짜 선택"
                        showPopperArrow={false}
                      />
                    </DatePickerWrapper>
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
                    <DatePickerWrapper>
                      <CalendarIcon>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="14"
                            height="13"
                            rx="1"
                            stroke="#666"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <line
                            x1="3"
                            y1="8"
                            x2="17"
                            y2="8"
                            stroke="#666"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="7"
                            y1="2"
                            x2="7"
                            y2="6"
                            stroke="#666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1="13"
                            y1="2"
                            x2="13"
                            y2="6"
                            stroke="#666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </CalendarIcon>
                      <StyledDatePicker
                        selected={parseDateString(
                          formData.recruitmentPeriodEnd
                        )}
                        onChange={(date) =>
                          handleDateChange("recruitmentPeriodEnd", date)
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="날짜 선택"
                        showPopperArrow={false}
                      />
                    </DatePickerWrapper>
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
              <FieldLabel>
                <RequiredMark>*</RequiredMark>교육장소
              </FieldLabel>
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
              <FieldLabel>
                <RequiredMark>*</RequiredMark>분류
              </FieldLabel>
              <FieldValue>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">선택</option>
                  <option value="유성형">유성형</option>
                  <option value="자치형">자치형</option>
                </Select>
              </FieldValue>
            </TableRow>

            <TableRow>
              <FieldLabel>
                <RequiredMark>*</RequiredMark>신청인원
              </FieldLabel>
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
                  {applicationFormId ? (
                    <FormConnectedWrapper>
                      <FormConnectedIndicator>
                        ✓ 신청폼 연결됨
                        <EditFormButton
                          type="button"
                          onClick={handleCreateApplicationForm}
                        >
                          수정
                        </EditFormButton>
                      </FormConnectedIndicator>
                      {applicationFormData && (
                        <FormPreviewButton
                          type="button"
                          onClick={() => setShowFormPreview(!showFormPreview)}
                        >
                          {showFormPreview ? "미리보기 숨기기" : "미리보기"}
                        </FormPreviewButton>
                      )}
                    </FormConnectedWrapper>
                  ) : (
                    <ApplicationFormButton
                      type="button"
                      onClick={handleCreateApplicationForm}
                    >
                      신청폼 만들기
                    </ApplicationFormButton>
                  )}
                </CapacityWrapper>
              </FieldValue>
            </TableRow>

            {/* 폼 미리보기 행 */}
            {showFormPreview && applicationFormData && (
              <FormPreviewRow>
                <FieldLabel>신청폼 미리보기</FieldLabel>
                <FieldValue>
                  <FormPreviewContainer>
                    <PreviewTitle>생성된 신청폼</PreviewTitle>

                    {/* 기본 필드들 */}
                    <PreviewSection>
                      <PreviewSectionTitle>기본 정보</PreviewSectionTitle>
                      <PreviewFieldList>
                        <PreviewField>• 이름</PreviewField>
                        <PreviewField>• 주소</PreviewField>
                        <PreviewField>• 연락처</PreviewField>
                        <PreviewField>• 생년월일</PreviewField>
                        <PreviewField>• 이메일</PreviewField>
                      </PreviewFieldList>
                    </PreviewSection>

                    {/* 추가 필드들 */}
                    {applicationFormData.additionalFields &&
                      applicationFormData.additionalFields.length > 0 && (
                        <PreviewSection>
                          <PreviewSectionTitle>추가 정보</PreviewSectionTitle>
                          <PreviewFieldList>
                            {applicationFormData.additionalFields.map(
                              (field, index) => (
                                <PreviewField key={index}>
                                  • {field.label}
                                  <FieldTypeTag $type={field.type}>
                                    {field.type === "text"
                                      ? "단답형"
                                      : "객관식"}
                                  </FieldTypeTag>
                                  {field.required && (
                                    <RequiredTag>필수</RequiredTag>
                                  )}
                                  {field.type === "radio" && field.options && (
                                    <OptionsList>
                                      {field.options.map((option, optIndex) => (
                                        <OptionItem key={optIndex}>
                                          - {option.text}
                                        </OptionItem>
                                      ))}
                                    </OptionsList>
                                  )}
                                </PreviewField>
                              )
                            )}
                          </PreviewFieldList>
                        </PreviewSection>
                      )}

                    <PreviewFooter>
                      총{" "}
                      {5 + (applicationFormData.additionalFields?.length || 0)}
                      개 필드
                    </PreviewFooter>
                  </FormPreviewContainer>
                </FieldValue>
              </FormPreviewRow>
            )}

            <TableRow>
              <FieldLabel>
                <RequiredMark>*</RequiredMark>수강료
              </FieldLabel>
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
              <FieldLabel>
                <RequiredMark>*</RequiredMark>학습자준비물
              </FieldLabel>
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
              <FieldLabel>
                <RequiredMark>*</RequiredMark>교육기관/모집제한
              </FieldLabel>
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
            <SubmitButton type="submit">프로그램 등록하기</SubmitButton>
          </ButtonGroup>
        </Form>
      </Inner>
    </PageContainer>
  );
};

export default ProgramCreatePage;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
`;

const Inner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 40px 96px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  border-radius: 4px;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin: 0;
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
  border-top: 1px solid #d2d6db;
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

const RequiredMark = styled.span`
  color: #ff4d35;
  margin-right: 2px;
`;

const FieldLabel = styled.div`
  width: 200px;
  min-width: 200px;
  padding: 16px 24px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  text-align: left;
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
  gap: 8px;
  flex-shrink: 0;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background: #fff;
  min-width: 160px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1557b7;
  }

  &:focus-within {
    border-color: #1557b7;
    box-shadow: 0 0 0 3px rgba(21, 87, 183, 0.1);
  }
`;

const CalendarIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #666;
`;

const StyledDatePicker = styled(DatePicker)`
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  font-family: "Pretendard", sans-serif;
  background: transparent;
  width: 100%;
  cursor: pointer;
  padding: 0;

  &::placeholder {
    color: #999;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  .react-datepicker__input-container input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    padding: 0;
    font-size: 14px;
    color: #333;
    font-family: "Pretendard", sans-serif;
    cursor: pointer;
  }
`;

// react-datepicker 전역 스타일은 CSS 파일로 처리

const DateTimeRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  width: 100%;
`;

const MultiSelectWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const InstitutionInput = styled.div`
  max-width: 50%;
`;

const Separator = styled.span`
  color: #666;
  margin: 0 4px;
  flex-shrink: 0;
`;

const TimeRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TimeSelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const TimeSelect = styled.select`
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #fff;
  cursor: pointer;
  width: 60px;

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const TimeLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
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

const FormConnectedIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #e8f5e8;
  color: #2d5a2d;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Pretendard", sans-serif;
`;

const EditFormButton = styled.button`
  padding: 4px 8px;
  background: #1557b7;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }
`;

const FormConnectedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormPreviewButton = styled.button`
  padding: 4px 8px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #218838;
  }
`;

const FormPreviewRow = styled.tr`
  background: #f8f9fa;
`;

const FormPreviewContainer = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
`;

const PreviewTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  font-family: "Pretendard", sans-serif;
`;

const PreviewSection = styled.div`
  margin-bottom: 16px;
`;

const PreviewSectionTitle = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-family: "Pretendard", sans-serif;
`;

const PreviewFieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PreviewField = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Pretendard", sans-serif;
`;

const FieldTypeTag = styled.span`
  padding: 2px 6px;
  background: ${(props) => (props.$type === "text" ? "#e3f2fd" : "#fff3e0")};
  color: ${(props) => (props.$type === "text" ? "#1976d2" : "#f57c00")};
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
`;

const RequiredTag = styled.span`
  padding: 2px 6px;
  background: #ffebee;
  color: #d32f2f;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
`;

const OptionsList = styled.div`
  margin-left: 16px;
  margin-top: 4px;
`;

const OptionItem = styled.div`
  font-size: 11px;
  color: #888;
  margin-bottom: 2px;
`;

const PreviewFooter = styled.div`
  font-size: 12px;
  color: #999;
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
  font-family: "Pretendard", sans-serif;
`;

const AdminHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
`;

const LogoContainer = styled.div`
  svg {
    height: 40px;
    width: auto;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const DateInfo = styled.span`
  font-size: 14px;
  color: #333;
  font-family: "Pretendard", sans-serif;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  background-color: #ffffff;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background-color: #f5f5f5;
    border-color: #1557b7;
  }
`;

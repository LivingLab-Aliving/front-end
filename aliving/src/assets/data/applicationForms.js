// 프로그램별 신청폼 데이터 관리

// 임시 신청폼 데이터 (실제로는 API에서 가져올 데이터)
export const APPLICATION_FORMS_BY_PROGRAM = {
  // 관평동 프로그램들
  "관평동_B-17": {
    id: "관평동_B-17",
    dongName: "관평동",
    programId: "B-17",
    programName: "풍물 놀이",
    basicFields: {
      name: "",
      address: "",
      contact: "",
      birthDate: "",
      email: "",
    },
    additionalFields: [
      {
        id: 1,
        label: "참여 동기",
        type: "text",
        required: true,
        options: []
      },
      {
        id: 2,
        label: "경력 사항",
        type: "radio",
        required: false,
        options: [
          { id: 1, text: "초보자" },
          { id: 2, text: "1년 미만" },
          { id: 3, text: "1-3년" },
          { id: 4, text: "3년 이상" }
        ]
      },
      {
        id: 3,
        label: "특이사항",
        type: "text",
        required: false,
        options: []
      }
    ],
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  
  "관평동_B-18": {
    id: "관평동_B-18",
    dongName: "관평동",
    programId: "B-18",
    programName: "수채화 그리기",
    basicFields: {
      name: "",
      address: "",
      contact: "",
      birthDate: "",
      email: "",
    },
    additionalFields: [
      {
        id: 1,
        label: "그림 경험",
        type: "radio",
        required: true,
        options: [
          { id: 1, text: "전혀 없음" },
          { id: 2, text: "취미로 조금" },
          { id: 3, text: "어느 정도 있음" },
          { id: 4, text: "전문적" }
        ]
      },
      {
        id: 2,
        label: "준비물 구매 가능 여부",
        type: "radio",
        required: true,
        options: [
          { id: 1, text: "개별 구매 가능" },
          { id: 2, text: "센터에서 대여 희망" }
        ]
      }
    ],
    createdAt: "2024-01-01T00:00:00.000Z"
  }
};

// 신청폼 데이터 가져오기
export const getApplicationFormByProgram = (dongName, programId) => {
  const formKey = `${dongName}_${programId}`;
  return APPLICATION_FORMS_BY_PROGRAM[formKey] || null;
};

// 신청폼 데이터 저장하기
export const saveApplicationForm = (dongName, programId, formData) => {
  const formKey = `${dongName}_${programId}`;
  APPLICATION_FORMS_BY_PROGRAM[formKey] = {
    id: formKey,
    dongName,
    programId,
    ...formData,
    updatedAt: new Date().toISOString()
  };
  
  // 실제로는 API 호출로 서버에 저장
  console.log(`신청폼 저장됨: ${formKey}`, APPLICATION_FORMS_BY_PROGRAM[formKey]);
  return APPLICATION_FORMS_BY_PROGRAM[formKey];
};

// 모든 신청폼 데이터 가져오기
export const getAllApplicationForms = () => {
  return APPLICATION_FORMS_BY_PROGRAM;
};

// 동별 신청폼 목록 가져오기
export const getApplicationFormsByDong = (dongName) => {
  return Object.values(APPLICATION_FORMS_BY_PROGRAM).filter(
    form => form.dongName === dongName
  );
};
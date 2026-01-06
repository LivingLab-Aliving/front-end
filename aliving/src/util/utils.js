// ISO 8601 형식 날짜를 한국어 형식으로 변환 (예: 2026-01-05T00:00:00 -> 2026.01.05)
export const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    // ISO 8601 형식 또는 YYYY-MM-DD 형식 처리
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // 날짜 파싱 실패 시 원본 문자열에서 날짜 부분만 추출
      const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        return `${match[1]}.${match[2]}.${match[3]}`;
      }
      return dateString;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error, dateString);
    return dateString;
  }
};

// 날짜 범위 포맷팅 (예: 2026-01-05T00:00:00 ~ 2026-01-10T00:00:00 -> 2026.01.05 ~ 2026.01.10)
export const formatPeriod = (startDate, endDate) => {
  if (!startDate || !endDate) return "-";

  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  if (!formattedStart || !formattedEnd) return "-";

  return `${formattedStart} ~ ${formattedEnd}`;
};

export const calculateDaysRemaining = (startDate, endDate) => {
  if (!endDate) return { type: null, value: null };
  try {
    // 오늘 날짜 (자정 기준)
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const todayMidnight = new Date(todayYear, todayMonth, todayDay);

    // 종료일 파싱 (ISO 8601 형식: 2026-01-05T00:00:00 또는 YYYY-MM-DD 형식)
    let endMidnight;
    if (endDate.includes("T")) {
      // ISO 8601 형식인 경우 (예: 2026-01-05T00:00:00)
      const dateOnly = endDate.split("T")[0]; // "2026-01-05" 추출
      const [endYear, endMonth, endDay] = dateOnly.split("-").map(Number);
      endMidnight = new Date(endYear, endMonth - 1, endDay);
    } else {
      // YYYY-MM-DD 형식인 경우
      const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
      endMidnight = new Date(endYear, endMonth - 1, endDay);
    }

    // 날짜 유효성 검사
    if (isNaN(endMidnight.getTime())) {
      console.error("잘못된 날짜 형식:", endDate);
      return { type: null, value: null };
    }

    // 종료일까지 남은 일수 계산
    const diffTime = endMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 종료일이 지났는지 확인 (종료일이 오늘보다 이전이면 마감)
    if (diffDays < 0) {
      // 프로그램이 종료된 경우
      return { type: "closed", value: null };
    }

    // 종료일이 아직 안 왔거나 오늘인 경우 (diffDays >= 0)
    return { type: "days", value: diffDays };
  } catch (error) {
    console.error("날짜 계산 오류:", error, startDate, endDate);
    return { type: null, value: null };
  }
};

export const formatPeriod = (startDate, endDate) => {
  if (!startDate || !endDate) return "-";
  return `${startDate.replace(/-/g, ".")} ~ ${endDate.replace(/-/g, ".")}`;
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

    // 종료일 파싱 (YYYY-MM-DD 형식)
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
    const endMidnight = new Date(endYear, endMonth - 1, endDay);

    // 종료일까지 남은 일수 계산
    const diffTime = endMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 종료일이 지났는지 확인
    if (diffDays < 0) {
      // 프로그램이 종료된 경우
      return { type: "closed", value: null };
    }

    // 종료일이 아직 안 왔거나 오늘인 경우
    if (diffDays >= 0) {
      return { type: "days", value: diffDays };
    }

    // 기본값
    return { type: "closed", value: null };
  } catch (error) {
    console.error("날짜 계산 오류:", error, startDate, endDate);
    return { type: null, value: null };
  }
};


import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* CSS 변수를 사용하여 테마 색상 정의 */
  :root {
    --primary-color: #0070f3; /* 헤더 링크 호버 색상으로 변경 */
    --background-color: #ffffff; /* 흰색 배경으로 변경 */
    --text-color: #333333; /* 기본 텍스트 색상 변경 */
    --secondary-text-color: #555555; /* 보조 텍스트 색상 변경 */
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
  }

  body {
    background-color: var(--background-color);
    color: var(--text-color);
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }

  /* react-datepicker 커스텀 스타일 */
  .react-datepicker-popper {
    z-index: 9999 !important;
  }

  .react-datepicker {
    font-family: "Pretendard", sans-serif !important;
    border: 1px solid #d0d0d0 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

  .react-datepicker__header {
    background-color: #fff !important;
    border-bottom: 1px solid #e0e0e0 !important;
    border-radius: 8px 8px 0 0 !important;
    padding-top: 8px !important;
  }

  .react-datepicker__current-month {
    font-weight: 600 !important;
    color: #333 !important;
    margin-bottom: 8px !important;
  }

  .react-datepicker__day-name {
    color: #666 !important;
    font-weight: 500 !important;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #1557b7 !important;
    color: #fff !important;
    border-radius: 6px !important;
  }

  .react-datepicker__day:hover {
    background-color: #e8f0fe !important;
    border-radius: 6px !important;
  }

  .react-datepicker__day--today {
    font-weight: 600 !important;
  }
`;

export default GlobalStyle;

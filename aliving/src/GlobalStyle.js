import { createGlobalStyle } from 'styled-components';

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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }
`;

export default GlobalStyle;
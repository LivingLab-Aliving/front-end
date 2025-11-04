import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* CSS 변수를 사용하여 테마 색상 정의 */
  :root {
    --primary-color: #61dafb;
    --background-color: #282c34;
    --text-color: #ffffff;
    --secondary-text-color: #cccccc;
  }

  /* 기본적인 CSS 리셋 */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
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
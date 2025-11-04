import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import HomePage from './page/home';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* 다른 페이지 라우트를 이곳에 추가할 수 있습니다. */}
        </Routes>
      </Router>
    </>
  );
}

export default App;

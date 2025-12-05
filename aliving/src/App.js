import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import HomePage from "./page/home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import UserDongPage from "./page/userDong";
import ProgramDetail from "./page/userDong/ProgramDetail";

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dong/:dongName" element={<UserDongPage />} />
            <Route
              path="/dong/:dongName/program/:programId"
              element={<ProgramDetail />}
            />
          </Routes>
        </Main>
        <Footer />
      </Router>
    </>
  );
}

export default App;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

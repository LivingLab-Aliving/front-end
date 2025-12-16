import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import LoginPage from "./page/login";
import SignupPage from "./page/signup";
import HomePage from "./page/home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import UserDongPage from "./page/userDong";
import ProgramDetail from "./page/userDong/ProgramDetail";
import ProgramApplication from "./page/userDong/ProgramApplication";
import ProgramApplicationSuccess from "./page/userDong/ProgramApplicationSuccess";
import AdminDongPage from "./page/adminDong";
import ProgramCreatePage from "./page/adminDong/programCreate";
import ProgramEditPage from "./page/adminDong/programEdit";
import ProgramSuccessPage from "./page/adminDong/programSuccess";
import AdminProgramDetail from "./page/adminDong/ProgramDetail";
import ApplicationEdit from "./page/adminDong/ApplicationEdit";
import ApplicationCreate from "./page/adminDong/ApplicationCreate";
import ApplicationAdd from "./page/adminDong/ApplicationAdd";
import AdminLogin from "./page/login/AdminLogin";

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname.includes("/apply") &&
    !location.pathname.includes("/success");

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dong/:dongName" element={<UserDongPage />} />
          <Route
            path="/dong/:dongName/program/:programId"
            element={<ProgramDetail />}
          />
          <Route
            path="/dong/:dongName/program/:programId/apply"
            element={<ProgramApplication />}
          />
          <Route
            path="/dong/:dongName/program/:programId/apply/success"
            element={<ProgramApplicationSuccess />}
          />
          <Route path="/admin/dong/:dongName" element={<AdminDongPage />} />
          <Route
            path="/admin/dong/:dongName/program/:programId"
            element={<AdminProgramDetail />}
          />
          <Route
            path="/admin/dong/:dongName/add"
            element={<ProgramCreatePage />}
          />
          <Route
            path="/admin/dong/:dongName/edit/:programId"
            element={<ProgramEditPage />}
          />
          <Route
            path="/admin/dong/:dongName/success"
            element={<ProgramSuccessPage />}
          />
          <Route
            path="/admin/dong/:dongName/application-form-edit"
            element={<ApplicationEdit />}
          />
          <Route
            path="/admin/dong/:dongName/application-create"
            element={<ApplicationCreate />}
          />
          <Route
            path="/admin/dong/:dongName/application-add"
            element={<ApplicationAdd />}
          />
        </Routes>
      </Main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <AppContent />
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
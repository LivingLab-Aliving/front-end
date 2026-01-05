import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ReactComponent as LogoSvg } from "../../assets/logo.svg";
import { ReactComponent as SearchIcon } from "../../assets/icon/_search.svg";
import UnknownImage from "../../assets/unknown_image.svg";
import { formatPeriod, calculateDaysRemaining } from "../../util/utils";

// 모든 동 목록
const ALL_DONGS = [
  "진잠동",
  "원신흥동",
  "온천1동",
  "온천2동",
  "신성동",
  "전민동",
  "구즉동",
  "관평동",
  "노은1동",
  "노은2동",
  "노은3동",
];

const DongPage = () => {
  const { dongName } = useParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedFilter, setSelectedFilter] = useState("모든 항목");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
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

  // 백엔드 API 호출로 프로그램 목록 가져오기
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const adminId = localStorage.getItem("adminId");

        const response = await axios.get(`http://localhost:8080/api/program`, {
          params: {
            dongName: dongName,
            adminId: adminId,
          },
        });

        console.log("백엔드 응답:", response.data);

        if (response.data?.data?.content) {
          const backendData = response.data.data.content;

          const mappedPrograms = backendData.map((p) => ({
            id: p.programId,
            title: p.programName,
            startDate: p.recruitStartDate,
            endDate: p.recruitEndDate,
            eduStartDate: p.eduStartDate,
            eduEndDate: p.eduEndDate,
            quarter: p.quarter ? `${p.quarter}분기` : "-",
            class: p.programType === "AUTONOMOUS" ? "자치형" : "유성형",
            type: "정규강좌",
            instructor: { name: p.instructorName || "담당자" },
            imageUrl: p.thumbnailUrl,
            creator: p.createdBy || "관리자",
            createdAt: p.createdAt || new Date().toISOString().split("T")[0],
          }));

          setPrograms(mappedPrograms);
          setFilteredPrograms(mappedPrograms);
        }
      } catch (error) {
        console.error("프로그램 목록 로드 실패:", error);
        setPrograms([]);
        setFilteredPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    if (dongName) {
      fetchPrograms();
    }
  }, [dongName]);

  // 필터링 로직
  useEffect(() => {
    let filtered = [...programs];

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPrograms(filtered);
  }, [searchQuery, programs]);

  const handleNewProgram = () => {
    navigate(`/admin/dong/${dongName}/add`);
  };

  const handleViewProgram = (programId) => {
    navigate(
      `/admin/dong/${dongName}/program/${encodeURIComponent(programId)}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminId");
    navigate("/admin/login");
  };

  const handleDongChange = (e) => {
    const selectedDong = e.target.value;
    navigate(`/admin/dong/${selectedDong}`);
  };

  const formatCreatedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}.`;
  };

  return (
    <PageContainer>
      {/* 헤더 */}
      <AdminHeader>
        <LogoContainer>
          <LogoSvg />
        </LogoContainer>
        <HeaderRight>
          <DateInfo>
            {getFormattedDate()} {dongName} 관리자 {adminName} 접속중
          </DateInfo>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </HeaderRight>
      </AdminHeader>

      <ContentContainer>
        {/* 새 프로그램 시작하기 섹션 */}
        <NewProgramSection>
          <SectionTitle>새 프로그램 시작하기</SectionTitle>
          <NewProgramCard onClick={handleNewProgram}>
            <PlusIcon>+</PlusIcon>
            <CardText>새로운 프로그램 만들기</CardText>
          </NewProgramCard>
        </NewProgramSection>

        {/* 프로그램 목록 섹션 */}
        <ProgramsSection>
          <SectionHeader>
            <SectionTitle>{dongName} 프로그램</SectionTitle>
            <Controls>
              <FilterSelect
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="모든 항목">모든 항목</option>
                <option value="모집중">모집중</option>
                <option value="모집마감">모집마감</option>
                <option value="모집예정">모집예정</option>
              </FilterSelect>
              <SearchButton>
                <SearchIcon />
              </SearchButton>
              <ViewToggle>
                <ViewButton
                  $active={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                  aria-label="그리드 뷰"
                >
                  <GridIcon />
                </ViewButton>
                <ViewButton
                  $active={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                  aria-label="리스트 뷰"
                >
                  <ListIcon />
                </ViewButton>
              </ViewToggle>
            </Controls>
          </SectionHeader>

          {loading ? (
            <LoadingMessage>로딩 중...</LoadingMessage>
          ) : filteredPrograms.length > 0 ? (
            <ProgramGrid>
              {filteredPrograms.map((program) => {
                const status = calculateDaysRemaining(
                  program.startDate,
                  program.endDate
                );
                const period =
                  program.quarter && program.eduStartDate && program.eduEndDate
                    ? `${program.quarter} / ${formatPeriod(
                        program.eduStartDate,
                        program.eduEndDate
                      ).replace(/\./g, "")}`
                    : program.quarter || "-";

                let statusText = "";
                let statusType = "";
                if (status.type === "closed") {
                  statusText = "모집마감";
                  statusType = "closed";
                } else if (status.type === "days") {
                  statusText = `D-${status.value}`;
                  statusType = "days";
                } else {
                  statusText = "모집예정";
                  statusType = "scheduled";
                }

                return (
                  <ProgramCard
                    key={program.id}
                    onClick={() => handleViewProgram(program.id)}
                  >
                    <StatusBadge $type={statusType}>{statusText}</StatusBadge>
                    <ProgramImage
                      src={program.imageUrl || UnknownImage}
                      alt={program.title}
                      onError={(e) => {
                        e.target.src = UnknownImage;
                      }}
                    />
                    <ProgramTitle>{program.title}</ProgramTitle>
                    <ProgramPeriod>{period}</ProgramPeriod>
                    <ProgramType>{program.type}</ProgramType>
                    <ProgramCreator>
                      {program.creator} {formatCreatedDate(program.createdAt)}.
                      생성
                    </ProgramCreator>
                  </ProgramCard>
                );
              })}
            </ProgramGrid>
          ) : (
            <EmptyMessage>등록된 프로그램이 없습니다.</EmptyMessage>
          )}
        </ProgramsSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default DongPage;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
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

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
`;

const NewProgramSection = styled.section`
  margin-bottom: 60px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
  font-family: "Pretendard", sans-serif;
`;

const NewProgramCard = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 40px;
  background-color: #ffffff;
  border: 2px solid #37b7ec;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &:hover {
    background-color: #f8f9fa;
    border-color: #1557b7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const PlusIcon = styled.div`
  font-size: 64px;
  font-weight: 300;
  color: #37b7ec;
  line-height: 1;
`;

const CardText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  font-family: "Pretendard", sans-serif;
`;

const ProgramsSection = styled.section`
  width: 100%;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterSelect = styled.select`
  padding: 8px 32px 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  font-family: "Pretendard", sans-serif;

  &:hover {
    border-color: #1557b7;
  }

  &:focus {
    outline: none;
    border-color: #1557b7;
    box-shadow: 0 0 0 3px rgba(21, 87, 183, 0.1);
  }
`;

const SearchButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1557b7;
    background-color: #f8f9fa;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 4px;
  background-color: #ffffff;
`;

const ViewButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? "#1557b7" : "transparent")};
  color: ${({ active }) => (active ? "#ffffff" : "#666")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ active }) => (active ? "#1248a0" : "#f5f5f5")};
  }
`;

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="3" width="12" height="2" rx="1" />
    <rect x="2" y="7" width="12" height="2" rx="1" />
    <rect x="2" y="11" width="12" height="2" rx="1" />
  </svg>
);

const ProgramGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProgramCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    border-color: #1557b7;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Pretendard", sans-serif;
  background-color: ${({ $type }) => {
    if ($type === "closed") return "#ECECEC";
    if ($type === "scheduled") return "#37B7EC";
    return "#37B7EC";
  }};
  color: ${({ $type }) => {
    if ($type === "closed") return "#9D9D9C";
    return "#ffffff";
  }};
  border: 0.5px solid
    ${({ $type }) => {
      if ($type === "closed") return "#ECECEC";
      return "#37B7EC";
    }};
  z-index: 1;
`;

const ProgramImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-bottom: 8px;
`;

const ProgramTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin: 0;
  font-family: "Pretendard", sans-serif;
  line-height: 1.4;
`;

const ProgramPeriod = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  font-family: "Pretendard", sans-serif;
`;

const ProgramType = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  font-family: "Pretendard", sans-serif;
`;

const ProgramCreator = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
  margin-top: auto;
  font-family: "Pretendard", sans-serif;
`;

const LoadingMessage = styled.p`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 16px;
  font-family: "Pretendard", sans-serif;
`;

const EmptyMessage = styled.p`
  text-align: center;
  padding: 60px 20px;
  color: #9d9d9c;
  font-size: 16px;
  font-family: "Pretendard", sans-serif;
`;

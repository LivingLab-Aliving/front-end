import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PROGRAMS_BY_DONG, PROGRAM_TYPES } from '../../assets/data/data';
import { formatPeriod, calculateDaysRemaining } from '../../util/utils';

const DongPage = () => {
  const { dongName } = useParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const itemsPerPage = 6;

  // TODO: 실제 API 호출로 프로그램 목록 가져오기
  useEffect(() => {
    const dongPrograms = PROGRAMS_BY_DONG[dongName] || [];
    
    // localStorage에서 추가된 프로그램들도 가져오기
    const localPrograms = JSON.parse(localStorage.getItem('programs') || '{}');
    const localDongPrograms = localPrograms[dongName] || [];
    
    // 기존 데이터와 localStorage 데이터 합치기
    const allPrograms = [...dongPrograms, ...localDongPrograms];
    
    setPrograms(allPrograms);
    setFilteredPrograms(allPrograms);
    setCurrentPage(1);
  }, [dongName]);

  // 필터링 및 정렬 로직
  useEffect(() => {
    let filtered = [...programs];

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 프로그램 타입 필터
    if (selectedType !== '전체') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // 모집 상태 필터
    if (selectedStatus !== '전체') {
      filtered = filtered.filter(p => {
        const status = calculateDaysRemaining(p.startDate, p.endDate);
        if (selectedStatus === '모집중') return status.type === 'days';
        if (selectedStatus === '마감') return status.type === 'closed';
        return true;
      });
    }

    // 정렬
    if (sortBy === 'status-asc') {
      filtered.sort((a, b) => {
        const statusA = calculateDaysRemaining(a.startDate, a.endDate);
        const statusB = calculateDaysRemaining(b.startDate, b.endDate);
        if (statusA.type === 'closed' && statusB.type !== 'closed') return 1;
        if (statusA.type !== 'closed' && statusB.type === 'closed') return -1;
        return statusA.value - statusB.value;
      });
    } else if (sortBy === 'status-desc') {
      filtered.sort((a, b) => {
        const statusA = calculateDaysRemaining(a.startDate, a.endDate);
        const statusB = calculateDaysRemaining(b.startDate, b.endDate);
        if (statusA.type === 'closed' && statusB.type !== 'closed') return -1;
        if (statusA.type !== 'closed' && statusB.type === 'closed') return 1;
        return statusB.value - statusA.value;
      });
    } else if (sortBy === 'period-asc') {
      filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sortBy === 'period-desc') {
      filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }

    setFilteredPrograms(filtered);
    setCurrentPage(1);
  }, [selectedType, selectedStatus, searchQuery, sortBy, programs]);

  const handleNewProgram = () => {
    navigate(`/admin/dong/${dongName}/add`);
  };

  const handleEditProgram = (programId) => {
    navigate(`/admin/dong/${dongName}/edit/${encodeURIComponent(programId)}`);
  };

  const handleViewProgram = (programId) => {
    navigate(`/admin/dong/${dongName}/program/${encodeURIComponent(programId)}`);
  };

  // 페이지네이션 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <HeroSection>
        <Title>{dongName} 주민자치센터 프로그램</Title>
        <SubTitle>등록 및 운영 중인 프로그램을 관리합니다.</SubTitle>
      </HeroSection>

      <Container>
        <HeaderSection>
          <FilterSection>
            <FilterGroup>
              <FilterLabel>프로그램 유형</FilterLabel>
              <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="전체">전체</option>
                {PROGRAM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>모집 상태</FilterLabel>
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="전체">전체</option>
                <option value="모집중">모집중</option>
                <option value="마감">마감</option>
              </Select>
            </FilterGroup>
            <SearchGroup>
              <FilterLabel>검색</FilterLabel>
              <SearchInput
                type="text"
                placeholder="프로그램명 또는 담당자"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchGroup>
          </FilterSection>
          <AddButton onClick={handleNewProgram}>+ 새 프로그램 추가</AddButton>
        </HeaderSection>

        <TableWrapper>
          {currentItems.length > 0 ? (
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>
                    모집상태
                    <SortButton onClick={() => setSortBy(sortBy === 'status-asc' ? 'status-desc' : 'status-asc')}>
                      {sortBy === 'status-asc' ? '↑' : sortBy === 'status-desc' ? '↓' : '↕'}
                    </SortButton>
                  </TableHeader>
                  <TableHeader>프로그램명</TableHeader>
                  <TableHeader>분기</TableHeader>
                  <TableHeader>교육기간</TableHeader>
                  <TableHeader>
                    모집기간
                    <SortButton onClick={() => setSortBy(sortBy === 'period-asc' ? 'period-desc' : 'period-asc')}>
                      {sortBy === 'period-asc' ? '↑' : sortBy === 'period-desc' ? '↓' : '↕'}
                    </SortButton>
                  </TableHeader>
                  <TableHeader>이미지</TableHeader>
                  <TableHeader>분류</TableHeader>
                  <TableHeader>담당자</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {currentItems.map((program) => {
                  const status = calculateDaysRemaining(program.startDate, program.endDate);
                  const educationPeriod = formatPeriod(program.startDate, program.endDate);

                  return (
                    <TableRow key={program.id}>
                      <TableCell>
                        <StatusBadge status={status.type}>
                          {status.type === 'closed' ? '마감' : `D-${status.value}`}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <ProgramName onClick={() => handleViewProgram(program.id)}>
                          {program.title}
                        </ProgramName>
                      </TableCell>
                      <TableCell>{program.quarter ? (program.quarter.includes('분기') ? program.quarter : `${program.quarter}분기`) : '-'}</TableCell>
                      <TableCell>{educationPeriod}</TableCell>
                      <TableCell>{educationPeriod}</TableCell>
                      <TableCell>
                        <ImageCell>
                          {program.programImage ? (
                            <img src={program.programImage} alt={program.title} />
                          ) : (
                            "이미지"
                          )}
                        </ImageCell>
                      </TableCell>
                      <TableCell>{program.class || '-'}</TableCell>
                      <TableCell>{program.instructor?.name || '-'}</TableCell>
                      <TableCell>
                        {/* TODO: 드롭다운 메뉴 추가 (수정/삭제/복사 등) */}
                        <IconButton onClick={() => handleEditProgram(program.id)}>⋮</IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <EmptyMessage>등록된 프로그램이 없습니다.</EmptyMessage>
          )}
        </TableWrapper>

        <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
      </Container>
    </>
  );
};

export default DongPage;

const HeroSection = styled.header`
  width: 100%;
  padding: 48px 40px;
  background-color: #f5f6f9;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
  font-family: "Pretendard", sans-serif;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: #9d9d9c;
  font-family: "Pretendard", sans-serif;
`;

const Container = styled.section`
  flex: 1;
  padding: 48px 40px 96px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const SearchGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const SearchInput = styled.input`
  flex: 0.7;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #333;
  font-family: "Pretendard", sans-serif;
  
  &:focus {
    outline: none;
    border-color: #1557b7;
    box-shadow: 0 0 0 3px rgba(21, 87, 183, 0.1);
  }
  
  &::placeholder {
    color: #9d9d9c;
  }
`;

const HeaderSection = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const FilterSection = styled.div`
  background: #f5f6f9;
  border-top: 1px solid #d2d6db;
  border-bottom: 1px solid #d2d6db;
  padding: 32px 40px;
  display: flex;
  gap: 24px;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const FilterLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  min-width: 80px;
  width: 80px;
  font-family: "Pretendard", sans-serif;
`;

const Select = styled.select`
  flex: 1;
  min-width: 180px;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background: #fff;
  color: #333;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  transition: all 0.2s ease;
  font-family: "Pretendard", sans-serif;

  &:hover {
    border-color: #1557b7;
    background-color: #f8f9fa;
  }

  &:focus {
    outline: none;
    border-color: #1557b7;
    box-shadow: 0 0 0 3px rgba(21, 87, 183, 0.1);
    background-color: #fff;
  }

  &:active {
    border-color: #1248a0;
  }

  option {
    padding: 8px;
    font-weight: 400;
  }
`;

const AddButton = styled.button`
  padding: 10px 19px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  background: #1557b7;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e6e6e6;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  background-color: #f5f6f9;
  border-bottom: 1px solid #d2d6db;
  white-space: nowrap;
  position: relative;
  font-family: "Pretendard", sans-serif;
`;

const SortButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  margin-left: 4px;
  padding: 2px 4px;
  
  &:hover {
    color: #1557b7;
  }
`;

const TableCell = styled.td`
  padding: 16px 12px;
  font-size: 14px;
  color: #333;
  vertical-align: middle;
  font-family: "Pretendard", sans-serif;
`;

const ImageCell = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProgramName = styled.div`
  font-weight: 600;
  color: #1c1b1f;
  cursor: pointer;
  font-family: "Pretendard", sans-serif;
  
  &:hover {
    color: #1557b7;
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: ${({ status }) => (status === 'closed' ? "#ECECEC" : "#37B7EC")};
  color: ${({ status }) => (status === 'closed' ? "#9D9D9C" : "#fff")};
  font-size: 12px;
  font-weight: 600;
  border-radius: 16px;
  border: 0.5px solid ${({ status }) => (status === 'closed' ? "#fff" : "#37B7EC")};
  white-space: nowrap;
  width: fit-content;
  font-family: "Pretendard", sans-serif;
`;

const IconButton = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: opacity 0.2s ease;
  font-size: 16px;
  color: #666;

  &:hover {
    opacity: 0.7;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  margin-top: 4rem;
  color: #9d9d9c;
`;

// 페이지네이션 컴포넌트 
const Pagination = ({ totalPages, currentPage, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
      {pageNumbers.map(number => (
        <PageButton key={number} onClick={() => paginate(number)} active={number === currentPage}>
          {number}
        </PageButton>
      ))}
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  border: ${({ active }) => (active ? "none" : "none")};
  background: ${({ active }) => (active ? "#1557b7" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#000000")};
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  font-family: "Pretendard", sans-serif;

  &:hover {
    color: ${({ active }) => (active ? "#fff" : "#333")};
  }
`;
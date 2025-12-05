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
  const itemsPerPage = 6;

  // 프로그램 목록 설정
  useEffect(() => {
    const dongPrograms = PROGRAMS_BY_DONG[dongName] || [];
    setPrograms(dongPrograms);
    setFilteredPrograms(dongPrograms);
    setCurrentPage(1);
  }, [dongName]);

  // 필터링 로직
  useEffect(() => {
    let filtered = [...programs];

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

    setFilteredPrograms(filtered);
    setCurrentPage(1);
  }, [selectedType, selectedStatus, programs]);

  const handleNewProgram = () => {
    navigate(`/admin/dong/${dongName}/add`);
  };

  const handleEditProgram = (programId) => {
    navigate(`/admin/dong/${dongName}/edit/${encodeURIComponent(programId)}`);
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
          </FilterSection>
          <AddButton onClick={handleNewProgram}>+ 새 프로그램 추가</AddButton>
        </HeaderSection>

        <TableWrapper>
          {currentItems.length > 0 ? (
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>모집상태</TableHeader>
                  <TableHeader>프로그램명</TableHeader>
                  <TableHeader>분기</TableHeader>
                  <TableHeader>교육기간</TableHeader>
                  <TableHeader>모집기간</TableHeader>
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
                        <ProgramName>{program.title}</ProgramName>
                      </TableCell>
                      <TableCell>{program.quarter}</TableCell>
                      <TableCell>{educationPeriod}</TableCell>
                      <TableCell>{educationPeriod}</TableCell>
                      <TableCell>
                        <ImageCell>이미지</ImageCell>
                      </TableCell>
                      <TableCell>{program.class || '-'}</TableCell>
                      <TableCell>{program.instructor?.name || '-'}</TableCell>
                      <TableCell>
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

const HeroSection = styled.div`
  width: 100%;
  padding: 80px 24px;
  background-color: #f0f4f7;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
`;

const Title = styled.h1`
  font-size: 2.5rem; 
  font-weight: 700;
  color: #111; 
  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 24px 80px;
  gap: 32px;
  width: 100%;
`;

const HeaderSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 40px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.95rem;
  cursor: pointer;
  background-color: white;
  
  &:hover {
    border-color: #1976d2;
  }
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #1976d2;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  overflow-x: auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  
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
  font-size: 0.875rem;
  font-weight: 700;
  color: #555;
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 16px 12px;
  font-size: 0.9rem;
  color: #333;
  vertical-align: middle;
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
`;

const ProgramName = styled.div`
  font-weight: 600;
  color: #111;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ status }) => status === 'closed' ? '#f44336' : '#4caf50'};
  color: white;
  white-space: nowrap;
`;

const IconButton = styled.button`
  padding: 4px 8px;
  font-size: 1.5rem;
  color: #666;
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1;
  
  &:hover {
    background-color: #f0f0f0;
    color: #333;
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
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#1976d2' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#111')};

  &:hover {
    background-color: #f0f0f0;
    border-color: #ccc;
  }
`;
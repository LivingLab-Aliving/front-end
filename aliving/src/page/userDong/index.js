import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import UnknownImage from "../../assets/unknown_image.svg";
import { ReactComponent as ShareIcon } from "../../assets/icon/share.svg";
import { ReactComponent as HeartIcon } from "../../assets/icon/heart.svg";
import { ReactComponent as ArrowLeft } from "../../assets/icon/arrow_left.svg";
import { ReactComponent as ArrowRightDouble } from "../../assets/icon/arrow_right_double.svg";
import {
  PROGRAMS_PER_PAGE,
  PROGRAMS_BY_DONG,
  PROGRAM_TYPES,
  TARGET_AUDIENCE_OPTIONS,
  TUITION_OPTIONS,
} from "./data";
import { formatPeriod, calculateDaysRemaining } from "./utils";

const UserDongPage = () => {
  const { dongName } = useParams();
  const [keyword, setKeyword] = useState("");
  const [programType, setProgramType] = useState("유성형 프로그램");
  const [targetAudience, setTargetAudience] = useState("전체");
  const [tuitionFilter, setTuitionFilter] = useState("전체");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const programs = useMemo(() => PROGRAMS_BY_DONG[dongName] || [], [dongName]);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      if (program.type !== programType) {
        return false;
      }

      if (
        targetAudience !== "전체" &&
        program.targetAudience !== targetAudience
      ) {
        return false;
      }

      if (tuitionFilter === "무료" && program.tuition !== "무료") {
        return false;
      }

      if (tuitionFilter === "유료" && program.tuition === "무료") {
        return false;
      }

      if (keyword && !program.title.includes(keyword.trim())) {
        return false;
      }

      if (startDate && new Date(program.endDate) < new Date(startDate)) {
        return false;
      }

      if (endDate && new Date(program.startDate) > new Date(endDate)) {
        return false;
      }

      return true;
    });
  }, [
    programs,
    programType,
    targetAudience,
    tuitionFilter,
    keyword,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    dongName,
    programType,
    targetAudience,
    tuitionFilter,
    keyword,
    startDate,
    endDate,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPrograms.length / PROGRAMS_PER_PAGE)
  );
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * PROGRAMS_PER_PAGE,
    currentPage * PROGRAMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <Container>
      <HeaderSection>
        <Title>{dongName} 주민자치 프로그램 목록</Title>
      </HeaderSection>

      <FilterSection>
        <FilterRow>
          <Field>
            <Label>교육기간</Label>
            <DateInputs>
              <DateInput
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
              <span>~</span>
              <DateInput
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </DateInputs>
          </Field>
        </FilterRow>
        <FilterRow>
          <Field>
            <Label>교육대상</Label>
            <Select
              value={targetAudience}
              onChange={(event) => setTargetAudience(event.target.value)}
            >
              {TARGET_AUDIENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label>수강료</Label>
            <Select
              value={tuitionFilter}
              onChange={(event) => setTuitionFilter(event.target.value)}
            >
              {TUITION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
        </FilterRow>
        <FilterRow>
          <Field $flex>
            <Label>프로그램명</Label>
            <SearchWrapper>
              <SearchInput
                type="text"
                placeholder="검색어를 입력하세요"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    setCurrentPage(1);
                  }
                }}
              />
              <SearchButton type="button" onClick={() => setCurrentPage(1)}>
                검색
              </SearchButton>
            </SearchWrapper>
          </Field>
        </FilterRow>
      </FilterSection>

      <TabSection>
        {PROGRAM_TYPES.map((type) => (
          <TabButton
            key={type}
            type="button"
            $active={programType === type}
            onClick={() => setProgramType(type)}
          >
            {type}
          </TabButton>
        ))}
      </TabSection>

      {paginatedPrograms.length === 0 ? (
        <EmptyState>
          <EmptyTitle>등록된 프로그램이 없습니다.</EmptyTitle>
          <EmptyDescription>
            필터 조건을 변경하거나 다른 기간을 선택해 보세요.
          </EmptyDescription>
        </EmptyState>
      ) : (
        <>
          <ProgramList>
            {paginatedPrograms.map((program) => {
              const badgeInfo = calculateDaysRemaining(
                program.startDate,
                program.endDate
              );
              return (
                <ProgramItem key={program.id}>
                  <ImageWrapper>
                    <ProgramImage
                      src={UnknownImage}
                      alt={`${program.title} 썸네일`}
                    />
                  </ImageWrapper>
                  <ProgramContent>
                    {badgeInfo.type === "days" && (
                      <DaysBadge $closed={false}>D-{badgeInfo.value}</DaysBadge>
                    )}
                    {badgeInfo.type === "closed" && (
                      <DaysBadge $closed={true}>모집마감</DaysBadge>
                    )}
                    <ProgramTitle>{program.title}</ProgramTitle>
                    <ProgramMeta>
                      <span>{program.place}</span>
                      <Divider />
                      <span>{program.tuition}</span>
                      <Divider />
                      <span>{program.recruitment}</span>
                      <Divider />
                      <span>
                        일시 {formatPeriod(program.startDate, program.endDate)}{" "}
                        ({program.schedule})
                      </span>
                    </ProgramMeta>
                  </ProgramContent>
                  <IconButtons>
                    <IconButton type="button" aria-label="공유">
                      <ShareIcon />
                    </IconButton>
                    <IconButton type="button" aria-label="좋아요">
                      <HeartIcon />
                    </IconButton>
                  </IconButtons>
                </ProgramItem>
              );
            })}
          </ProgramList>

          <Pagination>
            <PageNavButton
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="첫 페이지"
            >
              <ArrowRightDouble />
            </PageNavButton>
            <PageNavButton
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="이전 페이지"
            >
              <ArrowLeft />
            </PageNavButton>
            <PageNumbers>
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                  <PageNumberButton
                    key={page}
                    type="button"
                    $active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PageNumberButton>
                );
              })}
            </PageNumbers>
            <PageNavButton
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="다음 페이지"
            >
              <ArrowLeft style={{ transform: "scaleX(-1)" }} />
            </PageNavButton>
            <PageNavButton
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="마지막 페이지"
            >
              <ArrowRightDouble style={{ transform: "scaleX(-1)" }} />
            </PageNavButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default UserDongPage;

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

const HeaderSection = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
`;

const FilterSection = styled.section`
  background: #f6f6f6;
  border-top: 1px solid #b2b2b2;
  border-bottom: 1px solid #b2b2b2;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  width: 100%;
`;

const Field = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  ${({ $flex }) => $flex && "flex: 1;"}
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  min-width: 80px;
  width: 80px;
`;

const DateInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  span {
    color: #9d9d9c;
    font-size: 14px;
  }
`;

const DateInput = styled.input`
  flex: 1;
  min-width: 180px;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #333;
`;

const Select = styled.select`
  flex: 1;
  min-width: 180px;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #333;
`;

const SearchWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
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
`;

const SearchButton = styled.button`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: #555;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;

  &:hover {
    background: #333;
  }
`;

const TabSection = styled.nav`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #d0d0d0;
  padding-bottom: 0;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#111" : "#999")};
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  text-align: center;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: ${({ $active }) => ($active ? "3px" : "0")};
    background: ${({ $active }) => ($active ? "#555" : "transparent")};
    transition: height 0.2s ease, background 0.2s ease;
  }
`;

const ProgramList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProgramItem = styled.li`
  display: flex;
  gap: 19px;
  padding: 23px;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ProgramImage = styled.img`
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 6px;
  background: #f0f0f0;
`;

const DaysBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: ${({ $closed }) => ($closed ? "#ECECEC" : "#fff")};
  color: ${({ $closed }) => ($closed ? "#9D9D9C" : "#424242")};
  font-size: 12px;
  font-weight: 600;
  border-radius: 16px;
  border: 0.5px solid ${({ $closed }) => ($closed ? "#fff" : "#424242")};
  white-space: nowrap;
  width: fit-content;
  align-self: flex-start;
`;

const ProgramContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 112px;
  justify-content: space-between;
  min-width: 0;
  align-items: flex-start;
`;

const ProgramTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: #1c1b1f;
  margin: 0;
  align-self: flex-start;
`;

const ProgramMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 14px;
  color: #878786;
  align-self: flex-start;
  width: 100%;
`;

const Divider = styled.span`
  width: 1px;
  height: 10px;
  background: #dcdcdc;
`;

const IconButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-shrink: 0;
  align-items: center;
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

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

const PageNavButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  background: #f5f5f5;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PageNumbers = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PageNumberButton = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  border: ${({ $active }) => ($active ? "none" : "none")};
  background: ${({ $active }) => ($active ? "#707070" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#707070")};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${({ $active }) => ($active ? "#fff" : "#333")};
  }
`;

const EmptyState = styled.div`
  padding: 80px 24px;
  border: 1px dashed #dcdcdc;
  border-radius: 16px;
  text-align: center;
  color: #777;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #444;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: #777;
`;

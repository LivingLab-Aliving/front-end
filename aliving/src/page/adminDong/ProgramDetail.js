// src/page/adminDong/ProgramDetail.js

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ReactComponent as DeleteIcon } from "../../assets/icon/delete.svg";
import { ReactComponent as SearchIcon } from "../../assets/icon/_search.svg";
import { ReactComponent as DownloadIcon } from "../../assets/icon/download.svg";
import { ReactComponent as GroupAddIcon } from "../../assets/icon/group_add.svg";
import { formatPeriod, formatDate } from "../../util/utils";

const AdminProgramDetail = () => {
  const { dongName, programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [applications, setApplications] = useState([]);
  const [hasForm, setHasForm] = useState(false); // 신청폼 존재 여부
  const [showOptionMenu, setShowOptionMenu] = useState(false); // 옵션 메뉴 표시 여부
  const optionMenuRef = useRef(null); // 옵션 메뉴 참조

  // 백엔드 API 호출로 프로그램 데이터 가져오기
  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true);
        const adminId = localStorage.getItem("adminId");
        const response = await axios.get(
          `http://localhost:8080/api/program/${programId}`,
          {
            params: { adminId },
          }
        );

        console.log("프로그램 상세 데이터:", response.data.data);

        const programData = response.data.data;

        // 신청폼 존재 여부 확인
        try {
          const formResponse = await axios.get(
            `http://localhost:8080/api/program/${programId}/form`
          );
          if (formResponse.data?.data && formResponse.data.data.length > 0) {
            setHasForm(true);
            console.log("신청폼 존재:", formResponse.data.data);
          } else {
            setHasForm(false);
          }
        } catch (error) {
          console.log("신청폼 조회 실패 (신청폼이 없을 수 있음):", error);
          setHasForm(false);
        }

        setProgram({
          id: programData.programId,
          title: programData.programName,
          startDate: programData.recruitStartDate,
          endDate: programData.recruitEndDate,
          recruitStartDate: programData.recruitStartDate,
          recruitEndDate: programData.recruitEndDate,
          eduStartDate: programData.eduStartDate,
          eduEndDate: programData.eduEndDate,
          quarter: programData.quarter ? `${programData.quarter}분기` : "",
          place: programData.eduPlace,
          capacity: programData.capacity,
          tuition:
            programData.eduPrice === 0
              ? "무료"
              : `${programData.eduPrice.toLocaleString()}원`,
          materials: programData.needs,
          organization: programData.institution,
          instructor: { name: programData.instructorName || "담당자" },
          detailInfo: programData.description,
          thumbnailUrl: programData.thumbnailUrl,
          classPlanUrl: programData.classPlanUrl,
          classPlanOriginalName: programData.classPlanOriginalName,
          info: programData.info,
          etc: programData.etc,
          eduTime: programData.eduTime,
          targetAudience: programData.targetAudience,
          programType: programData.programType,
          createdAt: programData.createdAt || null, // 생성일 추가
        });
      } catch (error) {
        console.error("프로그램 상세 정보를 불러오는데 실패했습니다.", error);
        alert("프로그램을 찾을 수 없습니다.");
        navigate(`/admin/dong/${dongName}`);
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgramDetail();
    }
  }, [dongName, programId, navigate]);

  // 백엔드 API 호출로 프로그램 신청자 데이터 가져오기
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const adminId = localStorage.getItem("adminId");
        if (!adminId) {
          console.warn("관리자 ID가 없습니다.");
          setApplications([]);
          return;
        }

        // 백엔드 엔드포인트: /api/program/{programId}/applications/admin
        const response = await axios.get(
          `http://localhost:8080/api/program/${programId}/applications/admin`
        );
        console.log("신청자 목록:", response.data);

        if (response.data?.data) {
          const applicantsData = Array.isArray(response.data.data)
            ? response.data.data
            : [];

          // 백엔드 AdminListResponse 형식에 맞춰서 매핑
          const mappedApplications = applicantsData.map((app, index) => ({
            id: app.applicationId || index + 1,
            name: app.userName || "",
            userId: app.loginId || "",
            address: app.address || "",
            phone: app.phone || "",
            email: app.email || "",
            birthDate: app.birthDate || "",
            discount: "-", // 백엔드에 discount 필드가 없음
            courseType: "신규", // 백엔드에 courseType 필드가 없음
            status: app.status || "",
            createdAt: app.createdAt || "",
          }));

          setApplications(mappedApplications);
        }
      } catch (error) {
        console.error("신청자 목록을 불러오는데 실패했습니다.", error);
        // 에러가 발생해도 빈 배열로 설정
        setApplications([]);
      }
    };

    if (programId) {
      fetchApplications();
    }
  }, [programId]);

  // 옵션 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionMenuRef.current &&
        !optionMenuRef.current.contains(event.target)
      ) {
        setShowOptionMenu(false);
      }
    };

    if (showOptionMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptionMenu]);

  if (loading) {
    return <Container>로딩 중...</Container>;
  }

  if (!program) {
    return <Container>프로그램을 찾을 수 없습니다.</Container>;
  }

  const handleBack = () => {
    navigate(`/admin/dong/${dongName}`);
  };

  const handleEditProgram = () => {
    navigate(`/admin/dong/${dongName}/edit/${programId}`);
    setShowOptionMenu(false);
  };

  const handleDeleteProgram = async () => {
    const confirmDelete = window.confirm(
      "정말 이 프로그램을 삭제하시겠습니까?"
    );
    if (!confirmDelete) {
      setShowOptionMenu(false);
      return;
    }

    try {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) {
        alert("관리자 인증이 필요합니다.");
        navigate("/admin/login");
        return;
      }

      await axios.delete(`http://localhost:8080/api/program/${programId}`, {
        params: { adminId: parseInt(adminId, 10) },
      });

      alert("프로그램이 삭제되었습니다.");
      navigate(`/admin/dong/${dongName}`);
    } catch (error) {
      console.error("프로그램 삭제 실패:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "프로그램 삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setShowOptionMenu(false);
    }
  };

  const toggleOptionMenu = () => {
    setShowOptionMenu(!showOptionMenu);
  };

  const handleAddApplication = () => {
    navigate(`/admin/dong/${dongName}/application-add?programId=${programId}`);
  };

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = () => {
    if (applications.length === 0) {
      alert("다운로드할 신청자가 없습니다.");
      return;
    }

    // CSV 형식으로 변환 (엑셀에서 열 수 있음)
    const headers = [
      "No.",
      "성명",
      "ID",
      "주소",
      "연락처",
      "이메일",
      "생년월일",
      "감면여부",
      "신규/재수강",
    ];

    const csvRows = [
      headers.join(","),
      ...applications.map((app, index) =>
        [
          index + 1,
          app.name || "",
          app.userId || "",
          app.address || "",
          app.phone || "",
          app.email || "",
          app.birthDate || "",
          app.discount || "-",
          app.courseType || "신규",
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const BOM = "\uFEFF"; // UTF-8 BOM (한글 깨짐 방지)
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${program?.title || "프로그램"}_신청자목록_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // 체크박스 핸들러
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(new Set(applications.map((app) => app.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === applications.length);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    // 로컬 alert 생성 - 삭제 확인 대화상자
    const confirmDelete = window.confirm(
      `선택된 ${selectedItems.size}명을 삭제하시겠습니까?`
    );
    if (confirmDelete) {
      // TODO: 실제 API 호출로 선택된 신청자들 삭제
      const updatedApplications = applications.filter(
        (app) => !selectedItems.has(app.id)
      );
      setApplications(updatedApplications);

      // 로컬 alert 생성 - 삭제 완료 알림
      alert(`${selectedItems.size}명이 삭제되었습니다.`);

      setSelectedItems(new Set());
      setSelectAll(false);
    }
  };

  // 프로그램 정보에서 인원 데이터 파싱
  // 백엔드에서 capacity는 숫자로 올 수 있으므로 안전하게 처리
  let currentApplicants = 0;
  let maxCapacity = 0;

  if (typeof program.capacity === "string") {
    // 문자열 형식인 경우: "22명 / 25명"
    const capacityInfo = program.capacity || "0명 / 0명";
    const parts = capacityInfo.split(" / ");
    if (parts.length === 2) {
      currentApplicants = parseInt(parts[0].replace("명", "")) || 0;
      maxCapacity = parseInt(parts[1].replace("명", "")) || 0;
    }
  } else if (typeof program.capacity === "number") {
    // 숫자 형식인 경우: capacity가 최대 인원
    maxCapacity = program.capacity || 0;
    currentApplicants = program.currentApplicants || applications.length || 0;
  } else {
    // 기본값
    maxCapacity = program.capacity || 0;
    currentApplicants = applications.length || 0;
  }

  // 통계 계산 (실제 신청자 데이터 기준)
  const totalCount = currentApplicants; // 프로그램 상세의 신청인원과 동일
  const maxCount = maxCapacity; // 모집인원
  const newCount = applications.filter(
    (app) => app.courseType === "신규"
  ).length;
  const returnCount = applications.filter(
    (app) => app.courseType === "재수강"
  ).length;
  const discountCount = applications.filter(
    (app) => app.discount !== "-"
  ).length;

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>←</BackButton>
        <HeaderInfo>
          <ProgramId>{program.id}</ProgramId>
          <ProgramTitle>{program.title}</ProgramTitle>
          <ProgramType>{program.type}</ProgramType>
        </HeaderInfo>
        <StatusInfo>
          <StatusLabel>모집상태</StatusLabel>
          <StatusDate>
            {program.recruitStartDate && program.recruitEndDate
              ? formatPeriod(program.recruitStartDate, program.recruitEndDate)
              : "모집기간 정보 없음"}
          </StatusDate>
        </StatusInfo>
        <OptionButtonContainer ref={optionMenuRef}>
          <OptionButton onClick={toggleOptionMenu}>⋮</OptionButton>
          {showOptionMenu && (
            <OptionDropdown>
              <OptionMenuItem onClick={handleEditProgram}>
                수정하기
              </OptionMenuItem>
              <OptionMenuItem onClick={handleDeleteProgram}>
                삭제하기
              </OptionMenuItem>
            </OptionDropdown>
          )}
        </OptionButtonContainer>
      </Header>

      <TabContainer>
        <Tab
          $active={activeTab === "info"}
          onClick={() => setActiveTab("info")}
        >
          프로그램 상세
        </Tab>
        <Tab
          $active={activeTab === "applications"}
          onClick={() => setActiveTab("applications")}
        >
          신청 현황
        </Tab>
      </TabContainer>

      {activeTab === "info" ? (
        <ContentWrapper>
          <LeftSection>
            <ProgramImage>
              <ImagePlaceholder>프로그램 이미지</ImagePlaceholder>
            </ProgramImage>

            <InstructorSection>
              <InstructorAvatar />
              <InstructorInfo>
                <InstructorName>
                  {program.instructor?.name || "강사명"}
                </InstructorName>
                <InstructorRole>
                  {program.instructor?.role || "강사 소개"}
                </InstructorRole>
              </InstructorInfo>
            </InstructorSection>

            {program.attachment && (
              <AttachmentSection>
                <AttachmentLabel>첨부파일</AttachmentLabel>
                <AttachmentLink>{program.attachment.name}</AttachmentLink>
              </AttachmentSection>
            )}
          </LeftSection>

          <RightSection>
            <InfoTable>
              <tbody>
                <InfoRow>
                  <InfoLabel>교육일정</InfoLabel>
                  <InfoValue>
                    {program.schedule || "월, 수 10:00~12:00"}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>분기</InfoLabel>
                  <InfoValue>{program.quarter || "2025년 4분기"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>교육기간</InfoLabel>
                  <InfoValue>
                    {formatPeriod(program.eduStartDate, program.eduEndDate)}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>모집기간</InfoLabel>
                  <InfoValue>
                    {formatPeriod(
                      program.recruitStartDate,
                      program.recruitEndDate
                    )}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>교육장소</InfoLabel>
                  <InfoValue>{program.place}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>신청인원 / 모집인원</InfoLabel>
                  <InfoValue>{program.capacity || "22명 / 25명"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>교육대상</InfoLabel>
                  <InfoValue>{program.targetAudience || "성인"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>수강료</InfoLabel>
                  <InfoValue>{program.tuition}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>학습자준비물</InfoLabel>
                  <InfoValue>
                    {program.materials || "물감, 워터브러쉬, 수채화용지"}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>교육기관 / 모집제한</InfoLabel>
                  <InfoValue>
                    {program.institution || `${dongName} / 대전광역시 유성구민`}
                  </InfoValue>
                </InfoRow>
              </tbody>
            </InfoTable>
          </RightSection>
        </ContentWrapper>
      ) : (
        <ApplicationsWrapper>
          <StatsSection>
            <StatCard>
              <StatLabel>전체 신청 인원</StatLabel>
              <StatNumber>{totalCount}명</StatNumber>
              <StatSubtext>/{maxCount}명</StatSubtext>
            </StatCard>
            <StatCard>
              <StatLabel>신규 수강 인원</StatLabel>
              <StatNumber>{newCount}명</StatNumber>
              <StatSubtext>/{totalCount}명</StatSubtext>
            </StatCard>
            <StatCard>
              <StatLabel>재 수강 인원</StatLabel>
              <StatNumber>{returnCount}명</StatNumber>
              <StatSubtext>/{totalCount}명</StatSubtext>
            </StatCard>
            <StatCard>
              <StatLabel>감면 인원</StatLabel>
              <StatNumber>{discountCount}명</StatNumber>
              <StatSubtext>/{totalCount}명</StatSubtext>
            </StatCard>
          </StatsSection>

          <ApplicationsHeader>
            <ApplicationsTitle>
              전체 인원 ({totalCount}){" "}
              <DetailButton>{selectedItems.size}명 선택</DetailButton>
            </ApplicationsTitle>
            <ActionButtons>
              <PlainIconButton title="삭제" onClick={handleDeleteSelected}>
                <DeleteIcon />
              </PlainIconButton>
              <SearchIconButton title="검색">
                <SearchIcon />
              </SearchIconButton>
              <TextButton onClick={handleExcelDownload}>
                <DownloadIcon />
                엑셀 다운로드
              </TextButton>
              <TextButton onClick={handleAddApplication}>
                <GroupAddIcon />
                인원 추가 등록
              </TextButton>
            </ActionButtons>
          </ApplicationsHeader>

          <ApplicationsTable>
            <thead>
              <TableRow>
                <TableHeader>
                  <Checkbox
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHeader>
                <TableHeader>No.</TableHeader>
                <TableHeader>성명</TableHeader>
                <TableHeader>ID</TableHeader>
                <TableHeader>주소</TableHeader>
                <TableHeader>연락처</TableHeader>
                <TableHeader>이메일</TableHeader>
                <TableHeader>생년월일</TableHeader>
                <TableHeader>감면여부</TableHeader>
                <TableHeader>신규/재수강</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <Checkbox
                      type="checkbox"
                      checked={selectedItems.has(app.id)}
                      onChange={(e) =>
                        handleSelectItem(app.id, e.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.userId}</TableCell>
                  <TableCell>{app.address}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.birthDate}</TableCell>
                  <TableCell>{app.discount}</TableCell>
                  <TableCell>
                    <CourseTypeBadge $type={app.courseType}>
                      {app.courseType}
                    </CourseTypeBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </ApplicationsTable>
        </ApplicationsWrapper>
      )}
    </Container>
  );
};

export default AdminProgramDetail;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 96px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const ProgramId = styled.span`
  color: #1976d2;
  font-weight: 600;
  font-size: 16px;
`;

const ProgramTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #111;
  margin: 0;
  font-family: "Pretendard", sans-serif;
`;

const ProgramType = styled.span`
  padding: 4px 12px;
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
`;

const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const StatusLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const StatusDate = styled.span`
  font-size: 14px;
  color: #333;
`;

const OptionButtonContainer = styled.div`
  position: relative;
`;

const OptionButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
`;

const OptionDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  z-index: 1000;
  overflow: hidden;
`;

const OptionMenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background-color: #ffffff;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: "Pretendard", sans-serif;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #e8e8e8;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
`;

const TabContainer = styled.nav`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #d0d0d0;
  padding-bottom: 0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#1557b7" : "#999")};
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  text-align: center;
  font-family: "Pretendard", sans-serif;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: ${({ $active }) => ($active ? "3px" : "0")};
    background: ${({ $active }) => ($active ? "#1557B7" : "transparent")};
    transition: height 0.2s ease, background 0.2s ease;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProgramImage = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  overflow: hidden;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const InstructorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const InstructorAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ddd;
`;

const InstructorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InstructorName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

const InstructorRole = styled.div`
  font-size: 14px;
  color: #666;
`;

const AttachmentSection = styled.div`
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const AttachmentLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
`;

const AttachmentLink = styled.a`
  font-size: 14px;
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #1565c0;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoTable = styled.table`
  width: 100%;
  border-top: 1px solid #d2d6db;
  border-bottom: 1px solid #d2d6db;
  border-collapse: collapse;
  border-radius: 0;
`;

const InfoRow = styled.tr`
  border-bottom: 1px solid #d2d6db;
  background: #f5f6f9;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.th`
  padding: 16px 24px;
  text-align: center;
  background: transparent;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  width: 200px;
  vertical-align: middle;
  white-space: nowrap;
  border-right: 1px solid #d2d6db;
  font-family: "Pretendard", sans-serif;
`;

const InfoValue = styled.td`
  padding: 16px 24px;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  background: #fff;
  font-family: "Pretendard", sans-serif;
`;

const ApplicationsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const ApplicationsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ApplicationsTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111;
`;

const ApplicationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e6e6e6;
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
  font-family: "Pretendard", sans-serif;
`;

const TableCell = styled.td`
  padding: 16px 12px;
  font-size: 14px;
  color: #333;
  font-family: "Pretendard", sans-serif;
`;

// eslint-disable-next-line
const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: ${(props) => (props.$status === "승인" ? "#37B7EC" : "#ECECEC")};
  color: ${(props) => (props.$status === "승인" ? "#fff" : "#9D9D9C")};
  font-size: 12px;
  font-weight: 600;
  border-radius: 16px;
  border: 0.5px solid
    ${(props) => (props.$status === "승인" ? "#37B7EC" : "#fff")};
  white-space: nowrap;
  width: fit-content;
  font-family: "Pretendard", sans-serif;
`;

// eslint-disable-next-line
const ActionButton = styled.button`
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

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CourseTypeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) =>
    props.$type === "신규" ? "#e3f2fd" : "#fff3e0"};
  color: ${(props) => (props.$type === "신규" ? "#1976d2" : "#f57c00")};
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-family: "Pretendard", sans-serif;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 4px;
  font-family: "Pretendard", sans-serif;
`;

const StatSubtext = styled.div`
  font-size: 12px;
  color: #999;
  font-family: "Pretendard", sans-serif;
`;

const DetailButton = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  font-family: "Pretendard", sans-serif;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// eslint-disable-next-line
const IconButton = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PlainIconButton = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
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

const SearchIconButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TextButton = styled.button`
  height: 26px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  font-family: "Pretendard", sans-serif;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

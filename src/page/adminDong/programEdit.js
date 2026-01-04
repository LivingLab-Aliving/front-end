import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'; // axios 추가
import { formatPeriod } from '../../util/utils';

const ProgramEditPage = () => {
    const { dongName, programId } = useParams();
    const navigate = useNavigate();
    
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(true); // 수정 시엔 이미 이름이 있으므로 true
    
    const [formData, setFormData] = useState({
        programName: '',
        scheduleStartHour: '10',
        scheduleStartMinute: '00',
        scheduleEndHour: '12',
        scheduleEndMinute: '00',
        quarter: '',
        educationPeriodStart: '',
        educationPeriodEnd: '',
        recruitmentPeriodStart: '',
        recruitmentPeriodStartHour: '09',
        recruitmentPeriodStartMinute: '00',
        recruitmentPeriodEnd: '',
        recruitmentPeriodEndHour: '18',
        recruitmentPeriodEndMinute: '00',
        location: '',
        category: '',
        capacity: '',
        fee: '',
        materials: '',
        institution: dongName,
        recruitmentLimit: '대전광역시 유성구민',
        instructor: '',
        attachment: null,
        detailInfo: '',
    });

    // 1. 🌟 실제 백엔드 API 호출로 기존 데이터 불러오기
    useEffect(() => {
        const fetchProgramData = async () => {
            try {
                // 백엔드의 상세 조회 API 호출
                const response = await axios.get(`http://localhost:8080/api/program/${programId}`);
                const data = response.data.data;

                if (data) {
                    // eduTime 분리 (예: "10:00 ~ 12:00")
                    const timeRange = data.eduTime ? data.eduTime.split(' ~ ') : ['10:00', '12:00'];
                    const startTime = timeRange[0].split(':');
                    const endTime = timeRange[1].split(':');

                    // recruitStartDate 분리 (예: "2026-01-01T09:00:00")
                    const rStart = data.recruitStartDate ? data.recruitStartDate.split('T') : ['', '09:00'];
                    const rEnd = data.recruitEndDate ? data.recruitEndDate.split('T') : ['', '18:00'];

                    setFormData({
                        programName: data.programName || '',
                        scheduleStartHour: startTime[0] || '10',
                        scheduleStartMinute: startTime[1] || '00',
                        scheduleEndHour: endTime[0] || '12',
                        scheduleEndMinute: endTime[1] || '00',
                        quarter: data.quarter ? `${data.quarter}분기` : '',
                        educationPeriodStart: data.eduStartDate ? data.eduStartDate.split('T')[0] : '',
                        educationPeriodEnd: data.eduEndDate ? data.eduEndDate.split('T')[0] : '',
                        recruitmentPeriodStart: rStart[0],
                        recruitmentPeriodStartHour: rStart[1].split(':')[0],
                        recruitmentPeriodStartMinute: rStart[1].split(':')[1],
                        recruitmentPeriodEnd: rEnd[0],
                        recruitmentPeriodEndHour: rEnd[1].split(':')[0],
                        recruitmentPeriodEndMinute: rEnd[1].split(':')[1],
                        location: data.eduPlace || '',
                        category: data.programType === 'AUTONOMOUS' ? '정규강좌' : '특별', // 매핑 필요
                        capacity: data.capacity || '',
                        fee: data.eduPrice || '',
                        materials: data.needs || '',
                        institution: data.institution || dongName,
                        recruitmentLimit: data.regionRestriction || '대전광역시 유성구민',
                        instructor: data.instructorName || '',
                        attachment: null, // 파일은 보안상 가져올 수 없으므로 null
                        detailInfo: data.description || '',
                    });
                }
            } catch (error) {
                console.error("프로그램 데이터 로드 실패:", error);
                alert("데이터를 불러오는데 실패했습니다.");
            }
        };

        if (programId) fetchProgramData();
    }, [programId, dongName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    };

    // 2. 🌟 수정 제출 로직 (Multipart/form-data)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const adminId = localStorage.getItem("adminId");
            
            const updateDto = {
                programName: formData.programName,
                eduTime: `${formData.scheduleStartHour}:${formData.scheduleStartMinute} ~ ${formData.scheduleEndHour}:${formData.scheduleEndMinute}`,
                quarter: parseInt(formData.quarter),
                eduStartDate: `${formData.educationPeriodStart}T00:00:00`,
                eduEndDate: `${formData.educationPeriodEnd}T23:59:59`,
                recruitStartDate: `${formData.recruitmentPeriodStart}T${formData.recruitmentPeriodStartHour}:${formData.recruitmentPeriodStartMinute}:00`,
                recruitEndDate: `${formData.recruitmentPeriodEnd}T${formData.recruitmentPeriodEndHour}:${formData.recruitmentPeriodEndMinute}:59`,
                eduPlace: formData.location,
                capacity: parseInt(formData.capacity),
                eduPrice: parseInt(formData.fee),
                description: formData.detailInfo,
                institutionName: formData.institution,
                needs: formData.materials
                // 추가 필드(신청폼)는 ApplicationEdit에서 별도로 처리하거나 여기에 포함
            };

            const sendData = new FormData();
            sendData.append("dto", new Blob([JSON.stringify(updateDto)], { type: "application/json" }));
            if (formData.attachment) {
                sendData.append("newThumbnailFile", formData.attachment);
            }

            await axios.put(`http://localhost:8080/api/program/${programId}?adminId=${adminId}`, sendData);
            
            alert("수정이 완료되었습니다.");
            navigate(`/admin/dong/${dongName}`);
        } catch (error) {
            console.error("수정 실패:", error);
            alert("수정 저장 중 오류가 발생했습니다.");
        }
    };

    const handleEditApplicationForm = () => {
        navigate(`/admin/dong/${dongName}/edit/${programId}/application`); 
    };

    const handleCancel = () => {
        navigate(`/admin/dong/${dongName}`);
    };

    const handleDuplicateCheck = () => {
        setIsDuplicateChecked(true);
    };

    return (
        <PageContainer>
            <Inner>
                <Title>{formData.programName || '프로그램 수정'}</Title>
                
                <Form onSubmit={handleSubmit}>
                    {/* 프로그램 기본 설정 */}
                    <Section>
                        <SectionTitle>프로그램 기본 설정</SectionTitle>
                        
                        <TableRow>
                            <FieldLabel>프로그램명</FieldLabel>
                            <FieldValue>
                                <InputWithButton>
                                    <Input
                                        id="programName"
                                        name="programName"
                                        type="text"
                                        value={formData.programName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <TextButton 
                                        type="button" 
                                        onClick={handleDuplicateCheck}
                                        $isChecked={isDuplicateChecked}
                                    >
                                        중복체크
                                    </TextButton>
                                </InputWithButton>
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>교육일정</FieldLabel>
                            <FieldValue>
                                <TimeRangeWrapper>
                                    <TimeSelectGroup>
                                        <TimeSelect
                                            name="scheduleStartHour"
                                            value={formData.scheduleStartHour}
                                            onChange={handleChange}
                                        >
                                            {Array.from({ length: 24 }, (_, i) => (
                                                <option key={i} value={String(i).padStart(2, '0')}>
                                                    {String(i).padStart(2, '0')}
                                                </option>
                                            ))}
                                        </TimeSelect>
                                        <TimeLabel>시</TimeLabel>
                                        <TimeSelect
                                            name="scheduleStartMinute"
                                            value={formData.scheduleStartMinute}
                                            onChange={handleChange}
                                        >
                                            {['00', '10', '20', '30', '40', '50'].map(min => (
                                                <option key={min} value={min}>{min}</option>
                                            ))}
                                        </TimeSelect>
                                        <TimeLabel>분</TimeLabel>
                                    </TimeSelectGroup>
                                    <Separator>~</Separator>
                                    <TimeSelectGroup>
                                        <TimeSelect
                                            name="scheduleEndHour"
                                            value={formData.scheduleEndHour}
                                            onChange={handleChange}
                                        >
                                            {Array.from({ length: 24 }, (_, i) => (
                                                <option key={i} value={String(i).padStart(2, '0')}>
                                                    {String(i).padStart(2, '0')}
                                                </option>
                                            ))}
                                        </TimeSelect>
                                        <TimeLabel>시</TimeLabel>
                                        <TimeSelect
                                            name="scheduleEndMinute"
                                            value={formData.scheduleEndMinute}
                                            onChange={handleChange}
                                        >
                                            {['00', '10', '20', '30', '40', '50'].map(min => (
                                                <option key={min} value={min}>{min}</option>
                                            ))}
                                        </TimeSelect>
                                        <TimeLabel>분</TimeLabel>
                                    </TimeSelectGroup>
                                </TimeRangeWrapper>
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>분기</FieldLabel>
                            <FieldValue>
                                <Select
                                    id="quarter"
                                    name="quarter"
                                    value={formData.quarter}
                                    onChange={handleChange}
                                >
                                    <option value="">선택</option>
                                    <option value="1분기">1분기</option>
                                    <option value="2분기">2분기</option>
                                    <option value="3분기">3분기</option>
                                    <option value="4분기">4분기</option>
                                </Select>
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>교육기간</FieldLabel>
                            <FieldValue>
                                <DateRangeWrapper>
                                    <Input
                                        id="educationPeriodStart"
                                        name="educationPeriodStart"
                                        type="date"
                                        value={formData.educationPeriodStart}
                                        onChange={handleChange}
                                    />
                                    <Separator>~</Separator>
                                    <Input
                                        id="educationPeriodEnd"
                                        name="educationPeriodEnd"
                                        type="date"
                                        value={formData.educationPeriodEnd}
                                        onChange={handleChange}
                                    />
                                </DateRangeWrapper>
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>모집기간</FieldLabel>
                            <FieldValue>
                                <DateTimeRangeWrapper>
                                    <DateRangeWrapper>
                                        <Input
                                            id="recruitmentPeriodStart"
                                            name="recruitmentPeriodStart"
                                            type="date"
                                            value={formData.recruitmentPeriodStart}
                                            onChange={handleChange}
                                        />
                                        <TimeSelectGroup>
                                            <TimeSelect
                                                name="recruitmentPeriodStartHour"
                                                value={formData.recruitmentPeriodStartHour}
                                                onChange={handleChange}
                                            >
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <option key={i} value={String(i).padStart(2, '0')}>
                                                        {String(i).padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </TimeSelect>
                                            <TimeLabel>시</TimeLabel>
                                            <TimeSelect
                                                name="recruitmentPeriodStartMinute"
                                                value={formData.recruitmentPeriodStartMinute}
                                                onChange={handleChange}
                                            >
                                                {['00', '10', '20', '30', '40', '50'].map(min => (
                                                    <option key={min} value={min}>{min}</option>
                                                ))}
                                            </TimeSelect>
                                            <TimeLabel>분</TimeLabel>
                                        </TimeSelectGroup>
                                    </DateRangeWrapper>
                                    <Separator>~</Separator>
                                    <DateRangeWrapper>
                                        <Input
                                            id="recruitmentPeriodEnd"
                                            name="recruitmentPeriodEnd"
                                            type="date"
                                            value={formData.recruitmentPeriodEnd}
                                            onChange={handleChange}
                                        />
                                        <TimeSelectGroup>
                                            <TimeSelect
                                                name="recruitmentPeriodEndHour"
                                                value={formData.recruitmentPeriodEndHour}
                                                onChange={handleChange}
                                            >
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <option key={i} value={String(i).padStart(2, '0')}>
                                                        {String(i).padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </TimeSelect>
                                            <TimeLabel>시</TimeLabel>
                                            <TimeSelect
                                                name="recruitmentPeriodEndMinute"
                                                value={formData.recruitmentPeriodEndMinute}
                                                onChange={handleChange}
                                            >
                                                {['00', '10', '20', '30', '40', '50'].map(min => (
                                                    <option key={min} value={min}>{min}</option>
                                                ))}
                                            </TimeSelect>
                                            <TimeLabel>분</TimeLabel>
                                        </TimeSelectGroup>
                                    </DateRangeWrapper>
                                </DateTimeRangeWrapper>
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>교육장소</FieldLabel>
                            <FieldValue>
                                <Input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>분류</FieldLabel>
                            <FieldValue>
                                <Select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">선택</option>
                                    <option value="정규강좌">정규강좌</option>
                                    <option value="특별">특별</option>
                                    <option value="동아리">동아리</option>
                                </Select>
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>신청인원</FieldLabel>
                            <FieldValue>
                                <CapacityWrapper>
                                    <InputWithUnit>
                                        <Input
                                            id="capacity"
                                            name="capacity"
                                            type="number"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                        />
                                        <UnitLabel>명</UnitLabel>
                                    </InputWithUnit>
                                    <ApplicationFormButton 
                                        type="button"
                                        onClick={handleEditApplicationForm}
                                    >
                                        신청폼 수정
                                    </ApplicationFormButton>
                                </CapacityWrapper>
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>수강료</FieldLabel>
                            <FieldValue>
                                <InputWithUnit>
                                    <Input
                                        id="fee"
                                        name="fee"
                                        type="number"
                                        value={formData.fee}
                                        onChange={handleChange}
                                    />
                                    <UnitLabel>원</UnitLabel>
                                </InputWithUnit>
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>학습자준비물</FieldLabel>
                            <FieldValue>
                                <Input
                                    id="materials"
                                    name="materials"
                                    type="text"
                                    value={formData.materials}
                                    onChange={handleChange}
                                />
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>교육기관/모집제한</FieldLabel>
                            <FieldValue>
                                <MultiSelectWrapper>
                                    <InstitutionInput>
                                        <Input
                                            id="institution"
                                            name="institution"
                                            type="text"
                                            value={formData.institution}
                                            onChange={handleChange}
                                        />
                                    </InstitutionInput>
                                    <InstitutionInput>
                                        <Input
                                            id="recruitmentLimit"
                                            name="recruitmentLimit"
                                            type="text"
                                            value={formData.recruitmentLimit}
                                            onChange={handleChange}
                                        />
                                    </InstitutionInput>
                                </MultiSelectWrapper>
                            </FieldValue>
                        </TableRow>
                    </Section>

                    {/* 프로그램 상세 설정 */}
                    <Section>
                        <SectionTitle>프로그램 상세 설정</SectionTitle>
                        
                        <TableRow>
                            <FieldLabel>강사명</FieldLabel>
                            <FieldValue>
                                <Input
                                    id="instructor"
                                    name="instructor"
                                    type="text"
                                    value={formData.instructor}
                                    onChange={handleChange}
                                />
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>첨부파일</FieldLabel>
                            <FieldValue>
                                <FileInput
                                    id="attachment"
                                    name="attachment"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </FieldValue>
                        </TableRow>

                        <TableRow>
                            <FieldLabel>상세정보입력</FieldLabel>
                            <WideFieldValue>
                                <Textarea
                                    id="detailInfo"
                                    name="detailInfo"
                                    rows={8}
                                    placeholder="프로그램에 대한 상세 정보를 입력하세요"
                                    value={formData.detailInfo}
                                    onChange={handleChange}
                                />
                            </WideFieldValue>
                        </TableRow>
                    </Section>

                    <ButtonGroup>
                        <CancelButton type="button" onClick={handleCancel}>취소</CancelButton>
                        <SubmitButton type="submit">프로그램 수정하기</SubmitButton>
                    </ButtonGroup>
                </Form>
            </Inner>
        </PageContainer>
    );
};

export default ProgramEditPage;

const PageContainer = styled.section`
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 48px 40px 96px;
  background-color: #f5f6f9;
`;

const Inner = styled.div`
  width: min(1000px, 100%);
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
  font-family: "Pretendard", sans-serif;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  background-color: #fff;
  padding: 32px;
  border-radius: 8px;
  border: 1px solid #d2d6db;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d2d6db;
  font-family: "Pretendard", sans-serif;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d2d6db;
  min-height: 60px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.div`
  width: 200px;
  min-width: 200px;
  padding: 16px 24px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  background-color: #f5f6f9;
  border-right: 1px solid #d2d6db;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  font-family: "Pretendard", sans-serif;
`;

const FieldValue = styled.div`
  flex: 1;
  padding: 16px 24px;
  background: #fff;
`;

const WideFieldValue = styled.div`
  flex: 1;
  padding: 16px 20px;
  width: 100%;
`;

const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DateTimeRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const MultiSelectWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const InstitutionInput = styled.div`
  max-width: 35%;
`;

const Separator = styled.span`
  color: #666;
`;

const TimeRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TimeSelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeSelect = styled.select`
  padding: 0.5rem 1rem 0.5rem 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
  width: 70px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const TimeLabel = styled.span`
  font-size: 0.95rem;
  color: #666;
`;

const InputWithButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputWithUnit = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnitLabel = styled.span`
  font-size: 0.95rem;
  color: #666;
  white-space: nowrap;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$isChecked ? '#1557b7' : '#666'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  transition: color 0.2s;
  font-family: "Pretendard", sans-serif;
  
  &:hover {
    color: #1557b7;
  }
`;

const Input = styled.input`
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
`;

const Select = styled.select`
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

const FileInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const BaseButton = styled.button`
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
`;

const SubmitButton = styled(BaseButton)`
  background: #1557b7;
  color: white;
  border-color: #1557b7;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }
`;

const CancelButton = styled(BaseButton)`
  background: #fff;
  color: #555;
  border-color: #d0d0d0;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #f5f5f5;
  }
`;

const CapacityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const ApplicationFormButton = styled.button`
  padding: 8px 16px;
  background: #1557b7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }
`;

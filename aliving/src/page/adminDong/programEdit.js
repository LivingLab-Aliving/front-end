// src/page/adminDong/programEdit.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PROGRAMS_BY_DONG } from '../../assets/data/data';

const ProgramEditPage = () => {
    const { dongName, programId } = useParams();
    const navigate = useNavigate();
    
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    
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
        programImage: null,
        detailInfo: '',
    });

    // TODO: 실제 API 호출로 기존 프로그램 데이터 불러오기
    useEffect(() => {
        const programs = PROGRAMS_BY_DONG[dongName] || [];
        
        // localStorage에서 추가된 프로그램들도 가져오기
        const localPrograms = JSON.parse(localStorage.getItem('programs') || '{}');
        const localDongPrograms = localPrograms[dongName] || [];
        
        // 기존 데이터와 localStorage 데이터 합치기
        const allPrograms = [...programs, ...localDongPrograms];
        const program = allPrograms.find(p => p.id === programId);
        
        if (program) {
            // localStorage에서 온 프로그램인지 확인 (originalData가 있으면 localStorage 데이터)
            if (program.originalData) {
                // localStorage 데이터는 originalData에서 가져오기
                const originalData = program.originalData;
                setFormData({
                    programName: originalData.programName || '',
                    scheduleStartHour: originalData.scheduleStartHour || '10',
                    scheduleStartMinute: originalData.scheduleStartMinute || '00',
                    scheduleEndHour: originalData.scheduleEndHour || '12',
                    scheduleEndMinute: originalData.scheduleEndMinute || '00',
                    quarter: originalData.quarter || '',
                    educationPeriodStart: originalData.educationPeriodStart || '',
                    educationPeriodEnd: originalData.educationPeriodEnd || '',
                    recruitmentPeriodStart: originalData.recruitmentPeriodStart || '',
                    recruitmentPeriodStartHour: originalData.recruitmentPeriodStartHour || '09',
                    recruitmentPeriodStartMinute: originalData.recruitmentPeriodStartMinute || '00',
                    recruitmentPeriodEnd: originalData.recruitmentPeriodEnd || '',
                    recruitmentPeriodEndHour: originalData.recruitmentPeriodEndHour || '18',
                    recruitmentPeriodEndMinute: originalData.recruitmentPeriodEndMinute || '00',
                    location: originalData.location || '',
                    category: originalData.category || '',
                    capacity: originalData.capacity || '',
                    fee: originalData.fee || '',
                    materials: originalData.materials || '',
                    institution: originalData.institution || dongName,
                    recruitmentLimit: originalData.recruitmentLimit || '대전광역시 유성구민',
                    instructor: originalData.instructor || '',
                    attachment: originalData.attachment || null,
                    programImage: originalData.programImage || null,
                    detailInfo: originalData.detailInfo || '',
                });
            } else {
                // 기존 하드코딩된 데이터 처리
                // capacity에서 숫자만 추출
                const capacityMatch = program.recruitment?.match(/(\d+)명/);
                const capacityNumber = capacityMatch ? capacityMatch[1] : '';
                
                // tuition에서 숫자만 추출
                const tuitionMatch = program.tuition?.match(/^([\d,]+)원/);
                const tuitionNumber = tuitionMatch ? tuitionMatch[1].replace(/,/g, '') : '';
                
                setFormData({
                    programName: program.title || '',
                    scheduleStartHour: '10',
                    scheduleStartMinute: '00',
                    scheduleEndHour: '12',
                    scheduleEndMinute: '00',
                    quarter: program.quarter?.replace('분기', '') || '',
                    educationPeriodStart: program.startDate || '',
                    educationPeriodEnd: program.endDate || '',
                    recruitmentPeriodStart: program.startDate || '',
                    recruitmentPeriodStartHour: '09',
                    recruitmentPeriodStartMinute: '00',
                    recruitmentPeriodEnd: program.endDate || '',
                    recruitmentPeriodEndHour: '18',
                    recruitmentPeriodEndMinute: '00',
                    location: program.place || '',
                    category: program.class || '',
                    capacity: capacityNumber,
                    fee: tuitionNumber,
                    materials: program.materials || '',
                    institution: program.organization || dongName,
                    recruitmentLimit: '대전광역시 유성구민',
                    instructor: program.instructor?.name || '',
                    attachment: program.attachment || null,
                    programImage: program.programImage || null,
                    detailInfo: program.detailInfo || '',
                });
            }
            
            console.log("불러온 프로그램 데이터:", program);
            console.log("localStorage 데이터 여부:", !!program.originalData);
        }
    }, [dongName, programId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            attachment: e.target.files[0]
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    programImage: event.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setFormData(prev => ({
            ...prev,
            programImage: null
        }));
        // 파일 input 초기화
        const fileInput = document.getElementById('programImage');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleEditApplicationForm = () => {
        navigate(`/admin/dong/${dongName}/application-form-edit?programId=${programId}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // localStorage에서 프로그램 업데이트
        const localPrograms = JSON.parse(localStorage.getItem('programs') || '{}');
        if (localPrograms[dongName]) {
            const programIndex = localPrograms[dongName].findIndex(p => p.id === programId);
            if (programIndex !== -1) {
                // 기존 데이터 구조에 맞게 변환하여 업데이트
                const updatedProgram = {
                    id: programId,
                    title: formData.programName,
                    type: "자치동 프로그램",
                    class: formData.category || "정규강좌",
                    place: formData.location,
                    tuition: formData.fee ? `${formData.fee}원` : "무료",
                    recruitment: `모집인원 ${formData.capacity}명`,
                    startDate: formData.educationPeriodStart,
                    endDate: formData.educationPeriodEnd,
                    schedule: `${formData.scheduleStartHour}:${formData.scheduleStartMinute}~${formData.scheduleEndHour}:${formData.scheduleEndMinute}`,
                    quarter: formData.quarter,
                    organization: formData.institution,
                    targetAudience: "성인",
                    instructor: {
                        name: formData.instructor || "미정",
                    },
                    programImage: formData.programImage, // 프로그램 이미지 추가
                    // 원본 데이터도 업데이트
                    originalData: formData,
                };
                
                localPrograms[dongName][programIndex] = updatedProgram;
                localStorage.setItem('programs', JSON.stringify(localPrograms));
                console.log("프로그램 수정 완료:", updatedProgram);
            }
        }
        
        navigate(`/admin/dong/${dongName}`);
    };

    const handleCancel = () => {
        navigate(`/admin/dong/${dongName}`);
    };

    const handleDelete = () => {
        if (window.confirm('정말로 이 프로그램을 삭제하시겠습니까?')) {
            // localStorage에서 프로그램 삭제
            const localPrograms = JSON.parse(localStorage.getItem('programs') || '{}');
            if (localPrograms[dongName]) {
                const programIndex = localPrograms[dongName].findIndex(p => p.id === programId);
                if (programIndex !== -1) {
                    localPrograms[dongName].splice(programIndex, 1);
                    localStorage.setItem('programs', JSON.stringify(localPrograms));
                    console.log("프로그램 삭제 완료:", programId);
                    alert('프로그램이 삭제되었습니다.');
                    navigate(`/admin/dong/${dongName}`);
                } else {
                    alert('삭제할 수 없는 프로그램입니다. (기본 데이터)');
                }
            } else {
                alert('삭제할 수 없는 프로그램입니다. (기본 데이터)');
            }
        }
    };

    const handleDuplicateCheck = () => {
        // TODO: 실제 API 호출로 프로그램명 중복 체크
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
                                    <option value="1분기">1</option>
                                    <option value="2분기">2</option>
                                    <option value="3분기">3</option>
                                    <option value="4분기">4</option>
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
                            <FieldLabel>프로그램 이미지</FieldLabel>
                            <FieldValue>
                                <ImageUploadWrapper>
                                    <FileInput
                                        id="programImage"
                                        name="programImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {formData.programImage && (
                                        <ImagePreview>
                                            <img src={formData.programImage} alt="프로그램 이미지 미리보기" />
                                            <ImageRemoveButton 
                                                type="button" 
                                                onClick={handleImageRemove}
                                                title="이미지 제거"
                                            >
                                                ×
                                            </ImageRemoveButton>
                                        </ImagePreview>
                                    )}
                                </ImageUploadWrapper>
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
                        <DeleteButton type="button" onClick={handleDelete}>제거하기</DeleteButton>
                        <ButtonRightGroup>
                            <CancelButton type="button" onClick={handleCancel}>취소</CancelButton>
                            <SubmitButton type="submit">프로그램 수정하기</SubmitButton>
                        </ButtonRightGroup>
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
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const ButtonRightGroup = styled.div`
  display: flex;
  gap: 12px;
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

const DeleteButton = styled(BaseButton)`
  background: #dc3545;
  color: white;
  border-color: #dc3545;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #c82333;
    border-color: #bd2130;
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
const ImageUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ImagePreview = styled.div`
  width: 200px;
  height: 150px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageRemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;
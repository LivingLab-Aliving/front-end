// src/page/adminDong/programCreate.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { saveApplicationForm } from '../../assets/data/applicationForms';

const ProgramCreatePage = () => {
    const { dongName } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [applicationFormId, setApplicationFormId] = useState(null);
    const [applicationFormData, setApplicationFormData] = useState(null);
    const [showFormPreview, setShowFormPreview] = useState(false);
    
    // 프로그램 데이터 임시 저장 키 정의
    const PROGRAM_DATA_SESSION_KEY = 'tempProgramData';
    const APPLICATION_FORM_SESSION_KEY = 'tempApplicationForm';


    // 프로그램 기본 데이터 초기 상태
    const initialFormData = {
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
    };
    
    const [formData, setFormData] = useState(initialFormData);

    // 🚩 [수정]: 컴포넌트 마운트 시 임시 폼 데이터 및 프로그램 데이터 확인 및 로드
    useEffect(() => {
        const tempFormId = searchParams.get('tempFormId');
        
        // 1. URL 파라미터로 신청폼 ID를 받고 돌아온 경우 (신청폼 만들기를 완료했을 때)
        if (tempFormId) {
            const tempForm = JSON.parse(sessionStorage.getItem(APPLICATION_FORM_SESSION_KEY) || '{}');
            
            if (tempForm.id === tempFormId) {
                setApplicationFormId(tempFormId);
                setApplicationFormData(tempForm);
            }
        }
        
        // 2. 임시 저장된 프로그램 데이터 확인 (ApplicationCreate에서 '취소' 등으로 돌아왔을 경우)
        const savedProgramData = sessionStorage.getItem(PROGRAM_DATA_SESSION_KEY);
        if (savedProgramData) {
            const savedData = JSON.parse(savedProgramData);
            // file 객체는 저장되지 않으므로, 나머지 데이터만 로드
            setFormData(prev => ({ ...prev, ...savedData }));
            
            // 프로그램 데이터는 한 번 로드 후 삭제 (신청폼 데이터는 유지)
            sessionStorage.removeItem(PROGRAM_DATA_SESSION_KEY);
        }

    }, [searchParams, dongName]);


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
        const fileInput = document.getElementById('programImage');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const programId = `program_${Date.now()}`;
        
        // ... (프로그램 데이터 구성 로직 유지)
        const programData = {
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
            programImage: formData.programImage,
            applicationFormId: applicationFormId,
            originalData: formData,
        };
        
        // ... (localStorage 저장 로직 유지)
        const existingPrograms = JSON.parse(localStorage.getItem('programs') || '{}');
        if (!existingPrograms[dongName]) {
            existingPrograms[dongName] = [];
        }
        existingPrograms[dongName].push(programData);
        localStorage.setItem('programs', JSON.stringify(existingPrograms));
        
        // 임시 저장된 신청폼을 정식으로 저장
        if (applicationFormId) {
            const tempForm = JSON.parse(sessionStorage.getItem(APPLICATION_FORM_SESSION_KEY) || '{}');
            if (tempForm.id === applicationFormId) {
                const savedForm = saveApplicationForm(dongName, programId, {
                    programName: formData.programName,
                    basicFields: tempForm.basicFields,
                    additionalFields: tempForm.additionalFields,
                });
                console.log("신청폼이 프로그램과 연결되어 저장됨:", savedForm);
                
                // 임시 데이터 삭제
                sessionStorage.removeItem(APPLICATION_FORM_SESSION_KEY);
            }
        }
        
        console.log("프로그램 데이터:", programData);
        
        navigate(`/admin/dong/${dongName}/success`);
    };

    const handleCancel = () => {
        // 취소 시 임시 데이터 모두 삭제
        sessionStorage.removeItem(APPLICATION_FORM_SESSION_KEY);
        sessionStorage.removeItem(PROGRAM_DATA_SESSION_KEY);
        navigate(`/admin/dong/${dongName}`);
    };

    const handleDuplicateCheck = () => {
        // TODO: 실제 API 호출로 프로그램명 중복 체크 
        setIsDuplicateChecked(true);
    };

    // 🚩 [수정]: 신청폼 만들기/수정 버튼 클릭 시, 현재 입력된 프로그램 데이터를 임시 저장하고 이동
    const handleCreateApplicationForm = () => {
        // 1. 현재 입력된 프로그램 데이터를 세션 스토리지에 임시 저장 (ProgramCreatePage의 상태 유지)
        // 파일(`attachment`, `programImage`)은 JSON 직렬화 불가하므로 제외하고 저장
        const dataToSave = { ...formData, attachment: null, programImage: formData.programImage }; 
        sessionStorage.setItem(PROGRAM_DATA_SESSION_KEY, JSON.stringify(dataToSave));

        // 2. 신청폼 생성 페이지로 이동
        navigate(`/admin/dong/${dongName}/application-create`);
    };


    return (
        <PageContainer>
            <Inner>
                <Title>새 프로그램 추가</Title>
                
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
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
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
                                    <option value="문화">문화</option>
                                    <option value="체육">체육</option>
                                    <option value="교육">교육</option>
                                    <option value="기타">기타</option>
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
                                    {applicationFormId ? (
                                        <FormConnectedWrapper>
                                            <FormConnectedIndicator>
                                                ✓ 신청폼 연결됨
                                                <EditFormButton 
                                                    type="button"
                                                    onClick={handleCreateApplicationForm}
                                                >
                                                    수정
                                                </EditFormButton>
                                            </FormConnectedIndicator>
                                            {applicationFormData && (
                                                <FormPreviewButton 
                                                    type="button"
                                                    onClick={() => setShowFormPreview(!showFormPreview)}
                                                >
                                                    {showFormPreview ? '미리보기 숨기기' : '미리보기'}
                                                </FormPreviewButton>
                                            )}
                                        </FormConnectedWrapper>
                                    ) : (
                                        <ApplicationFormButton 
                                            type="button"
                                            onClick={handleCreateApplicationForm}
                                        >
                                            신청폼 만들기
                                        </ApplicationFormButton>
                                    )}
                                </CapacityWrapper>
                            </FieldValue>
                        </TableRow>

                        {/* 폼 미리보기 행 */}
                        {showFormPreview && applicationFormData && (
                            <FormPreviewRow>
                                <FieldLabel>신청폼 미리보기</FieldLabel>
                                <FieldValue>
                                    <FormPreviewContainer>
                                        <PreviewTitle>생성된 신청폼</PreviewTitle>
                                        
                                        {/* 기본 필드들 */}
                                        <PreviewSection>
                                            <PreviewSectionTitle>기본 정보</PreviewSectionTitle>
                                            <PreviewFieldList>
                                                <PreviewField>• 이름</PreviewField>
                                                <PreviewField>• 주소</PreviewField>
                                                <PreviewField>• 연락처</PreviewField>
                                                <PreviewField>• 생년월일</PreviewField>
                                                <PreviewField>• 이메일</PreviewField>
                                            </PreviewFieldList>
                                        </PreviewSection>

                                        {/* 추가 필드들 */}
                                        {applicationFormData.additionalFields && applicationFormData.additionalFields.length > 0 && (
                                            <PreviewSection>
                                                <PreviewSectionTitle>추가 정보</PreviewSectionTitle>
                                                <PreviewFieldList>
                                                    {applicationFormData.additionalFields.map((field, index) => (
                                                        <PreviewField key={index}>
                                                            • {field.label} 
                                                            <FieldTypeTag $type={field.type}>
                                                                {field.type === 'text' ? '단답형' : '객관식'}
                                                            </FieldTypeTag>
                                                            {field.required && <RequiredTag>필수</RequiredTag>}
                                                            {field.type === 'radio' && field.options && (
                                                                <OptionsList>
                                                                    {field.options.map((option, optIndex) => (
                                                                        <OptionItem key={optIndex}>- {option.text}</OptionItem>
                                                                    ))}
                                                                </OptionsList>
                                                            )}
                                                        </PreviewField>
                                                    ))}
                                                </PreviewFieldList>
                                            </PreviewSection>
                                        )}
                                        
                                        <PreviewFooter>
                                            총 {5 + (applicationFormData.additionalFields?.length || 0)}개 필드
                                        </PreviewFooter>
                                    </FormPreviewContainer>
                                </FieldValue>
                            </FormPreviewRow>
                        )}

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
                        <CancelButton type="button" onClick={handleCancel}>취소</CancelButton>
                        <SubmitButton type="submit">프로그램 등록하기</SubmitButton>
                    </ButtonGroup>
                </Form>
            </Inner>
        </PageContainer>
    );
};

export default ProgramCreatePage;

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
  max-width: 50%;
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

const FormConnectedIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #e8f5e8;
  color: #2d5a2d;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Pretendard", sans-serif;
`;

const EditFormButton = styled.button`
  padding: 4px 8px;
  background: #1557b7;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #1248a0;
  }
`;

const FormConnectedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormPreviewButton = styled.button`
  padding: 4px 8px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #218838;
  }
`;

const FormPreviewRow = styled(TableRow)`
    /* FormPreviewRow가 TableRow에서 상속받으므로 border-bottom 제거 및 배경 설정 */
    border-bottom: none; 
    background: #f8f9fa;
    display: block; /* 내부 요소를 수직으로 배치하기 위해 block으로 변경 */
    padding: 0;
`;

const FormPreviewContainer = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
`;

const PreviewTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  font-family: "Pretendard", sans-serif;
`;

const PreviewSection = styled.div`
  margin-bottom: 16px;
`;

const PreviewSectionTitle = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-family: "Pretendard", sans-serif;
`;

const PreviewFieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PreviewField = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Pretendard", sans-serif;
`;

const FieldTypeTag = styled.span`
  padding: 2px 6px;
  background: ${props => props.$type === 'text' ? '#e3f2fd' : '#fff3e0'};
  color: ${props => props.$type === 'text' ? '#1976d2' : '#f57c00'};
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
`;

const RequiredTag = styled.span`
  padding: 2px 6px;
  background: #ffebee;
  color: #d32f2f;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
`;

const OptionsList = styled.div`
  margin-left: 16px;
  margin-top: 4px;
`;

const OptionItem = styled.div`
  font-size: 11px;
  color: #888;
  margin-bottom: 2px;
`;

const PreviewFooter = styled.div`
  font-size: 12px;
  color: #999;
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
  font-family: "Pretendard", sans-serif;
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
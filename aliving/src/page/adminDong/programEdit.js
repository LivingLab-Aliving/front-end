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
        detailInfo: '',
    });

    // 기존 프로그램 데이터 불러오기
    useEffect(() => {
        const programs = PROGRAMS_BY_DONG[dongName] || [];
        const program = programs.find(p => p.id === programId);
        
        if (program) {
            setFormData({
                programName: program.title || '',
                scheduleStartHour: '10',
                scheduleStartMinute: '00',
                scheduleEndHour: '12',
                scheduleEndMinute: '00',
                quarter: program.quarter || '',
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
                capacity: '',
                fee: '',
                materials: program.materials || '',
                institution: program.organization || dongName,
                recruitmentLimit: '대전광역시 유성구민',
                instructor: program.instructor?.name || '',
                attachment: null,
                detailInfo: '',
            });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 🚨 실제로는 여기서 서버 API 호출: PUT/PATCH 요청 (프로그램 수정)
        
        navigate(`/admin/dong/${dongName}/success`);
    };

    const handleCancel = () => {
        navigate(`/admin/dong/${dongName}`);
    };

    const handleDuplicateCheck = () => {
        // 🚨 실제로는 여기서 서버 API 호출: 프로그램명 중복 체크
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
  padding: 80px 24px;
  background-color: #f9f9f9;
`;

const Inner = styled.div`
  width: min(900px, 100%);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
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
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  min-height: 60px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.div`
  width: 200px;
  min-width: 200px;
  padding: 16px 20px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #444;
  background-color: #fafafa;
  border-right: 1px solid #f0f0f0;
`;

const FieldValue = styled.div`
  flex: 1;
  padding: 16px 20px;
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
  color: ${props => props.$isChecked ? '#0070f3' : '#666'};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  transition: color 0.2s;
  
  &:hover {
    color: #0070f3;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
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
  background: #0070f3;
  color: white;
  border-color: #0070f3;

  &:hover {
    background: #005bb5;
  }
`;

const CancelButton = styled(BaseButton)`
  background: #fff;
  color: #555;
  border-color: #d0d0d0;

  &:hover {
    background: #f5f5f5;
  }
`;

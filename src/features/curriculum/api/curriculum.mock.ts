import type {
  Curriculum,
  CurriculumVersion,
  Grade,
  LearningOutcome,
  SkillSummary,
} from '../types/curriculum.types'

export const MOCK_CURRICULA: Curriculum[] = [
  {
    id: 'curr-moet-gdpt',
    curriculum_code: 'MOET-GDPT-2018',
    name_en: 'General Education Curriculum 2018 — English (Grades 1–12)',
    name_vi: 'Chương trình Giáo dục phổ thông 2018 — Môn Tiếng Anh (Lớp 1–12)',
    authority_name: 'Ministry of Education and Training (Bộ GD&ĐT)',
    category: 'MOET_NATIONAL',
    status: 'ACTIVE',
    description_vi:
      'Chương trình 10 năm liên thông từ Tiểu học (Lớp 1-5), THCS (Lớp 6-9) đến THPT (Lớp 10-12) ban hành kèm Thông tư 32/2018/TT-BGDĐT.',
    description_en:
      'The 10-year articulated curriculum from Primary (Grades 1-5), Lower Secondary (Grades 6-9) to Upper Secondary (Grades 10-12) under Circular 32/2018/TT-BGDĐT.',
  },
  {
    id: 'curr-ielts',
    curriculum_code: 'IELTS-STANDARDS',
    name_en: 'IELTS Academic Competency Framework (Bands 4.0 – 8.0+)',
    name_vi: 'Khung năng lực Chuẩn hóa IELTS (Bands 4.0 – 8.0+)',
    authority_name: 'Cambridge Assessment & IDP / British Council',
    category: 'INTERNATIONAL_CERTIFICATE',
    status: 'ACTIVE',
    description_vi:
      'Khung mục tiêu năng lực và chuẩn đầu ra 4 kỹ năng (Nghe, Nói, Đọc, Viết) từ nền tảng Foundation đến Band 8.0+.',
    description_en:
      'Target competency framework across 4 skills (Listening, Speaking, Reading, Writing) from Foundation to Band 8.0+.',
  },
  {
    id: 'curr-toeic',
    curriculum_code: 'TOEIC-4SKILLS',
    name_en: 'TOEIC 4-Skills Career Competency Framework',
    name_vi: 'Khung năng lực Tiếng Anh Giao tiếp & Nghề nghiệp TOEIC 4 Kỹ năng',
    authority_name: 'ETS (Educational Testing Service)',
    category: 'INTERNATIONAL_CERTIFICATE',
    status: 'ACTIVE',
    description_vi:
      'Chuẩn đầu ra tiếng Anh giao tiếp công việc, thương mại và văn phòng theo thang điểm Target 450 - 650 - 800 - 900+.',
    description_en:
      'Workplace and international business communication standard mapped to Target 450 - 650 - 800 - 900+.',
  },
  {
    id: 'curr-cambridge',
    curriculum_code: 'CAMBRIDGE-YLE-CEFR',
    name_en: 'Cambridge English Qualifications (YLE / KET / PET / FCE)',
    name_vi:
      'Khung chứng chỉ Quốc tế Cambridge (Starters, Movers, Flyers, KET, PET)',
    authority_name: 'Cambridge University Press & Assessment',
    category: 'PROFICIENCY_FRAMEWORK',
    status: 'ACTIVE',
    description_vi:
      'Lộ trình liên thông từ Thiếu nhi (Starters/Movers/Flyers) tới Thiếu niên (A2 Key/B1 Preliminary) đối chiếu CEFR Companion 2020.',
    description_en:
      'Pathways from Young Learners (YLE) to Key/Preliminary aligned with Council of Europe CEFR 2020.',
  },
]

export const MOCK_CURRICULUM = MOCK_CURRICULA[0]

export const MOCK_VERSIONS: CurriculumVersion[] = [
  // MOET GDPT 2018
  {
    id: 'ver-2018-v1',
    curriculum_id: 'curr-moet-gdpt',
    source_version_id: 'SRC-MOET-GDPT-2018',
    version_label: 'v1.0 (TT 32/2018/TT-BGDĐT)',
    document_reference: 'Thông tư 32/2018/TT-BGDĐT',
    effective_from: '2019-02-15',
    effective_to: '2022-08-02',
    status: 'DEPRECATED',
    supersedes_version_id: null,
    amends_source_id: null,
    change_reason: 'Statutory baseline enactment',
    reviewed_by: 'Council of National Curriculum Review',
    reviewed_at: '2018-12-26T00:00:00Z',
    approved_by: 'Minister of Education',
    approved_at: '2018-12-26T00:00:00Z',
    created_at: '2019-01-01T00:00:00Z',
    updated_at: '2022-08-03T00:00:00Z',
  },
  {
    id: 'ver-2022-v2',
    curriculum_id: 'curr-moet-gdpt',
    source_version_id: 'SRC-MOET-GDPT-AMEND-2022-13',
    version_label: 'v2.0 (TT 13/2022/TT-BGDĐT)',
    document_reference: 'Thông tư 13/2022/TT-BGDĐT sửa đổi TT 32/2018',
    effective_from: '2022-08-03',
    effective_to: null,
    status: 'APPROVED',
    supersedes_version_id: 'ver-2018-v1',
    amends_source_id: 'SRC-MOET-GDPT-2018',
    change_reason:
      'Điều chỉnh cấu trúc phân phối môn học và chuẩn đầu ra cấp Tiểu học, THCS và THPT',
    reviewed_by: 'MOET Curriculum Commission',
    reviewed_at: '2022-08-01T08:00:00Z',
    approved_by: 'Minister of Education',
    approved_at: '2022-08-03T08:00:00Z',
    created_at: '2022-08-03T00:00:00Z',
    updated_at: '2026-08-27T00:00:00Z',
  },
  {
    id: 'ver-2026-draft',
    curriculum_id: 'curr-moet-gdpt',
    source_version_id: 'SRC-MOET-GDPT-DRAFT-2026',
    version_label: 'v2.1-Draft (Định hướng Kỹ năng số 2026)',
    document_reference: 'Dự thảo hướng dẫn thực hiện nhiệm vụ năm học mới',
    effective_from: '2026-09-01',
    effective_to: null,
    status: 'DRAFT',
    supersedes_version_id: 'ver-2022-v2',
    amends_source_id: 'SRC-MOET-GDPT-AMEND-2022-13',
    change_reason:
      'Bổ sung liên kết đánh giá năng lực thực tế & bám sát chuẩn SGK mới',
    reviewed_by: null,
    reviewed_at: null,
    approved_by: null,
    approved_at: null,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-04T00:00:00Z',
  },

  // IELTS
  {
    id: 'ver-ielts-2025',
    curriculum_id: 'curr-ielts',
    source_version_id: 'SRC-IELTS-ACAD-2025',
    version_label: 'v2025 (IELTS Band Descriptors v2)',
    document_reference: 'Official Cambridge IELTS Assessment Spec 2025',
    effective_from: '2025-01-01',
    effective_to: null,
    status: 'APPROVED',
    supersedes_version_id: null,
    change_reason:
      'Cập nhật chuẩn đánh giá Writing & Speaking band descriptors',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // TOEIC
  {
    id: 'ver-toeic-2025',
    curriculum_id: 'curr-toeic',
    source_version_id: 'SRC-TOEIC-4SKILLS-2025',
    version_label: 'v2025 (TOEIC 4-Skills Global)',
    document_reference: 'ETS TOEIC Official Blueprint Standard',
    effective_from: '2025-01-01',
    effective_to: null,
    status: 'APPROVED',
    supersedes_version_id: null,
    change_reason: 'Khung năng lực giao tiếp thương mại và công sở đa kỹ năng',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Cambridge
  {
    id: 'ver-cambridge-2024',
    curriculum_id: 'curr-cambridge',
    source_version_id: 'SRC-CAMBRIDGE-CEFR-2024',
    version_label: 'v2024 (Cambridge English Scale)',
    document_reference: 'Cambridge Assessment English Framework',
    effective_from: '2024-01-01',
    effective_to: null,
    status: 'APPROVED',
    supersedes_version_id: null,
    change_reason: 'Khung thang điểm Cambridge English Scale chuẩn A1–C1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

// All 12 Grades for GDPT 2018 + Modules for IELTS, TOEIC, Cambridge
export const MOCK_GRADES: Grade[] = [
  // --- TIỂU HỌC (Lớp 1 - 5) ---
  {
    id: 'grade-1',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G1',
    display_order: 1,
    name_en: 'Grade 1 (Primary)',
    name_vi: 'Lớp 1 (Tiểu học)',
    level_group: 'PRIMARY',
  },
  {
    id: 'grade-2',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G2',
    display_order: 2,
    name_en: 'Grade 2 (Primary)',
    name_vi: 'Lớp 2 (Tiểu học)',
    level_group: 'PRIMARY',
  },
  {
    id: 'grade-3',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G3',
    display_order: 3,
    name_en: 'Grade 3 (Primary)',
    name_vi: 'Lớp 3 (Tiểu học)',
    level_group: 'PRIMARY',
  },
  {
    id: 'grade-4',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G4',
    display_order: 4,
    name_en: 'Grade 4 (Primary)',
    name_vi: 'Lớp 4 (Tiểu học)',
    level_group: 'PRIMARY',
  },
  {
    id: 'grade-5',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G5',
    display_order: 5,
    name_en: 'Grade 5 (Primary)',
    name_vi: 'Lớp 5 (Tiểu học)',
    level_group: 'PRIMARY',
  },

  // --- THCS (Lớp 6 - 9) ---
  {
    id: 'grade-6',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G6',
    display_order: 6,
    name_en: 'Grade 6 (Lower Secondary)',
    name_vi: 'Lớp 6 (THCS)',
    level_group: 'SECONDARY',
  },
  {
    id: 'grade-7',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G7',
    display_order: 7,
    name_en: 'Grade 7 (Lower Secondary)',
    name_vi: 'Lớp 7 (THCS)',
    level_group: 'SECONDARY',
  },
  {
    id: 'grade-8',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G8',
    display_order: 8,
    name_en: 'Grade 8 (Lower Secondary)',
    name_vi: 'Lớp 8 (THCS)',
    level_group: 'SECONDARY',
  },
  {
    id: 'grade-9',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G9',
    display_order: 9,
    name_en: 'Grade 9 (Lower Secondary)',
    name_vi: 'Lớp 9 (THCS)',
    level_group: 'SECONDARY',
  },

  // --- THPT (Lớp 10 - 12) ---
  {
    id: 'grade-10',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G10',
    display_order: 10,
    name_en: 'Grade 10 (Upper Secondary)',
    name_vi: 'Lớp 10 (THPT)',
    level_group: 'HIGH',
  },
  {
    id: 'grade-11',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G11',
    display_order: 11,
    name_en: 'Grade 11 (Upper Secondary)',
    name_vi: 'Lớp 11 (THPT)',
    level_group: 'HIGH',
  },
  {
    id: 'grade-12',
    curriculum_version_id: 'ver-2022-v2',
    grade_code: 'G12',
    display_order: 12,
    name_en: 'Grade 12 (Upper Secondary)',
    name_vi: 'Lớp 12 (THPT)',
    level_group: 'HIGH',
  },

  // --- IELTS Bands ---
  {
    id: 'ielts-band-4',
    curriculum_version_id: 'ver-ielts-2025',
    grade_code: 'BAND 4.0 - 4.5',
    display_order: 1,
    name_en: 'Foundation (Band 4.0 - 4.5)',
    name_vi: 'Nền tảng (Band 4.0 - 4.5)',
    level_group: 'BAND',
  },
  {
    id: 'ielts-band-5',
    curriculum_version_id: 'ver-ielts-2025',
    grade_code: 'BAND 5.0 - 5.5',
    display_order: 2,
    name_en: 'Intermediate (Band 5.0 - 5.5)',
    name_vi: 'Trung cấp (Band 5.0 - 5.5)',
    level_group: 'BAND',
  },
  {
    id: 'ielts-band-6',
    curriculum_version_id: 'ver-ielts-2025',
    grade_code: 'BAND 6.0 - 6.5',
    display_order: 3,
    name_en: 'Upper-Intermediate (Band 6.0 - 6.5)',
    name_vi: 'Trung cao (Band 6.0 - 6.5)',
    level_group: 'BAND',
  },
  {
    id: 'ielts-band-7',
    curriculum_version_id: 'ver-ielts-2025',
    grade_code: 'BAND 7.0 - 8.0+',
    display_order: 4,
    name_en: 'Advanced (Band 7.0 - 8.0+)',
    name_vi: 'Cao cấp (Band 7.0 - 8.0+)',
    level_group: 'BAND',
  },

  // --- TOEIC Targets ---
  {
    id: 'toeic-450',
    curriculum_version_id: 'ver-toeic-2025',
    grade_code: 'TARGET 450+',
    display_order: 1,
    name_en: 'Basic Workplace (450+)',
    name_vi: 'Giao tiếp cơ bản (450+)',
    level_group: 'BAND',
  },
  {
    id: 'toeic-650',
    curriculum_version_id: 'ver-toeic-2025',
    grade_code: 'TARGET 650+',
    display_order: 2,
    name_en: 'Professional Working (650+)',
    name_vi: 'Làm việc chuyên nghiệp (650+)',
    level_group: 'BAND',
  },
  {
    id: 'toeic-850',
    curriculum_version_id: 'ver-toeic-2025',
    grade_code: 'TARGET 850+',
    display_order: 3,
    name_en: 'Executive Fluency (850+)',
    name_vi: 'Thành thạo công sở (850+)',
    level_group: 'BAND',
  },

  // --- Cambridge ---
  {
    id: 'cam-yle',
    curriculum_version_id: 'ver-cambridge-2024',
    grade_code: 'YLE (Pre-A1/A1/A2)',
    display_order: 1,
    name_en: 'Starters / Movers / Flyers',
    name_vi: 'Thiếu nhi (Starters/Movers/Flyers)',
    level_group: 'LEVEL',
  },
  {
    id: 'cam-ket-pet',
    curriculum_version_id: 'ver-cambridge-2024',
    grade_code: 'A2 KEY / B1 PRELIMINARY',
    display_order: 2,
    name_en: 'A2 Key & B1 Preliminary',
    name_vi: 'KET & PET (A2 / B1)',
    level_group: 'LEVEL',
  },
]

export const MOCK_SKILLS: SkillSummary[] = [
  {
    id: 'skl-gram-pres-simple',
    skill_code: 'SKL-GRM-001',
    name_en: 'Present Simple Tense for Daily Routines',
    name_vi: 'Thì Hiện tại đơn diễn tả thói quen hằng ngày',
    domain: 'GRAMMAR',
    cefr_reference_band: 'A1-A2',
  },
  {
    id: 'skl-gram-past-simple',
    skill_code: 'SKL-GRM-002',
    name_en: 'Past Simple with Regular and Irregular Verbs',
    name_vi: 'Thì Quá khứ đơn với động từ có quy tắc và bất quy tắc',
    domain: 'GRAMMAR',
    cefr_reference_band: 'A2',
  },
  {
    id: 'skl-gram-relative-clause',
    skill_code: 'SKL-GRM-008',
    name_en: 'Defining and Non-defining Relative Clauses',
    name_vi: 'Mệnh đề quan hệ xác định và không xác định',
    domain: 'GRAMMAR',
    cefr_reference_band: 'B1-B2',
  },
  {
    id: 'skl-voc-school-env',
    skill_code: 'SKL-VOC-010',
    name_en: 'School Objects and Learning Activities Vocabulary',
    name_vi: 'Từ vựng đồ dùng học tập và hoạt động ở trường',
    domain: 'VOCABULARY',
    cefr_reference_band: 'A1',
  },
  {
    id: 'skl-voc-academic-essay',
    skill_code: 'SKL-VOC-035',
    name_en: 'Academic Collocations and Formal Essay Linking Words',
    name_vi: 'Cụm từ học thuật và từ liên kết viết luận nghị luận',
    domain: 'VOCABULARY',
    cefr_reference_band: 'B2-C1',
  },
  {
    id: 'skl-lis-gist-dialog',
    skill_code: 'SKL-LIS-005',
    name_en: 'Listening for Main Idea in Short Everyday Dialogues',
    name_vi: 'Nghe hiểu ý chính trong đoạn hội thoại hằng ngày ngắn',
    domain: 'LISTENING',
    cefr_reference_band: 'A2',
  },
  {
    id: 'skl-lis-academic-lecture',
    skill_code: 'SKL-LIS-022',
    name_en: 'Note-taking from Academic Lectures and Monologues',
    name_vi: 'Ghi chép ý chính từ bài thuyết trình và bài giảng học thuật',
    domain: 'LISTENING',
    cefr_reference_band: 'B2',
  },
  {
    id: 'skl-rea-detail-notices',
    skill_code: 'SKL-REA-008',
    name_en: 'Reading for Specific Information in Notices and Signs',
    name_vi: 'Đọc quét thông tin chi tiết trong thông báo và biển hiệu',
    domain: 'READING',
    cefr_reference_band: 'A2',
  },
  {
    id: 'skl-rea-skimming-articles',
    skill_code: 'SKL-REA-019',
    name_en: 'Skimming and Scanning Long Informational Articles',
    name_vi: 'Đọc lướt và đọc quét bài báo thông tin chuyên sâu',
    domain: 'READING',
    cefr_reference_band: 'B1-B2',
  },
  {
    id: 'skl-spk-self-intro',
    skill_code: 'SKL-SPK-003',
    name_en: 'Self-introduction: Personal Information, Hobbies & Family',
    name_vi: 'Tự giới thiệu bản thân: Thông tin cá nhân, sở thích & gia đình',
    domain: 'SPEAKING',
    cefr_reference_band: 'A1-A2',
  },
  {
    id: 'skl-spk-discursive-argument',
    skill_code: 'SKL-SPK-015',
    name_en: 'Expressing Opinions with Supporting Evidence and Justification',
    name_vi: 'Trình bày quan điểm có dẫn chứng và lập luận bảo vệ',
    domain: 'SPEAKING',
    cefr_reference_band: 'B2',
  },
  {
    id: 'skl-wri-short-email',
    skill_code: 'SKL-WRI-004',
    name_en: 'Writing a Short Email / Note about Weekend Plans',
    name_vi: 'Viết email / ghi chú ngắn về kế hoạch cuối tuần',
    domain: 'WRITING',
    cefr_reference_band: 'A2',
  },
  {
    id: 'skl-wri-opinion-essay',
    skill_code: 'SKL-WRI-018',
    name_en: 'Writing a 250-word Discursive Essay on Social Topics',
    name_vi: 'Viết bài luận nghị luận xã hội 250 từ hoàn chỉnh',
    domain: 'WRITING',
    cefr_reference_band: 'B2',
  },
]

export const MOCK_OUTCOMES_BY_GRADE: Record<string, LearningOutcome[]> = {
  // Lớp 1 (Tiểu học)
  'grade-1': [
    {
      id: 'out-g1-001',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-1',
      outcome_code: 'MOET-G1-LIS-01',
      statement_en:
        'Listen and respond with body language / actions to simple classroom instructions.',
      statement_vi:
        'Nghe và phản hồi bằng cử chỉ/hành động với các câu lệnh lớp học đơn giản (Stand up, Sit down, Look at me).',
      source_locator: 'Chương trình GDPT Tiếng Anh Làm quen Lớp 1, Mục 4.1',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-g1-01',
          learning_outcome_id: 'out-g1-001',
          skill_id: 'skl-voc-school-env',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.95,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Primary Team',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[3],
        },
      ],
    },
    {
      id: 'out-g1-002',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-1',
      outcome_code: 'MOET-G1-SPK-01',
      statement_en:
        'Pronounce basic alphabet sounds and repeat common greetings and single words.',
      statement_vi:
        'Phát âm các âm chữ cái quen thuộc và lặp lại lời chào, từ chỉ đồ chơi, con vật đơn giản.',
      source_locator: 'Chương trình GDPT Tiếng Anh Làm quen Lớp 1, Mục 4.1',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-g1-02',
          learning_outcome_id: 'out-g1-002',
          skill_id: 'skl-spk-self-intro',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'CORE',
          confidence: 0.92,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Primary Team',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[9],
        },
      ],
    },
  ],

  // Lớp 3 (Bắt đầu bắt buộc)
  'grade-3': [
    {
      id: 'out-g3-001',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-3',
      outcome_code: 'MOET-G3-REA-01',
      statement_en:
        'Read aloud single words, short phrases, and simple sentences with pictures.',
      statement_vi:
        'Đọc to các từ đơn, cụm từ ngắn và câu văn đơn giản có tranh ảnh minh họa.',
      source_locator: 'Chương trình GDPT Tiếng Anh, Mục 4.2 - Lớp 3, Đọc',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-g3-01',
          learning_outcome_id: 'out-g3-001',
          skill_id: 'skl-voc-school-env',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.93,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Primary Team',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[3],
        },
      ],
    },
  ],

  // Lớp 6 (THCS)
  'grade-6': [
    {
      id: 'out-g6-001',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-6',
      outcome_code: 'MOET-G6-L01',
      statement_en:
        'Listen and identify key details in short monologues/dialogues related to school and personal life.',
      statement_vi:
        'Nghe và xác định được thông tin chi tiết trong các đoạn độc thoại/hội thoại ngắn về chủ đề trường học và đời sống cá nhân.',
      source_locator:
        'Chương trình GDPT Tiếng Anh, Mục 4.2 - Lớp 6, Kỹ năng Nghe',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-001',
          learning_outcome_id: 'out-g6-001',
          skill_id: 'skl-lis-gist-dialog',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.95,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Academic Lead',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[5],
        },
      ],
    },
    {
      id: 'out-g6-002',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-6',
      outcome_code: 'MOET-G6-S01',
      statement_en:
        'Introduce self, family members and describe simple daily routines using present simple.',
      statement_vi:
        'Tự giới thiệu bản thân, các thành viên trong gia đình và mô tả thói quen hằng ngày đơn giản sử dụng thì hiện tại đơn.',
      source_locator:
        'Chương trình GDPT Tiếng Anh, Mục 4.2 - Lớp 6, Kỹ năng Nói',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-002',
          learning_outcome_id: 'out-g6-002',
          skill_id: 'skl-spk-self-intro',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.98,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Academic Lead',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[9],
        },
        {
          id: 'map-003',
          learning_outcome_id: 'out-g6-002',
          skill_id: 'skl-gram-pres-simple',
          mapping_role: 'SECONDARY_TARGET',
          importance: 'CORE',
          confidence: 0.9,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Academic Lead',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[0],
        },
      ],
    },
    {
      id: 'out-g6-003',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-6',
      outcome_code: 'MOET-G6-R01',
      statement_en:
        'Read and comprehend simple informational texts (posters, emails, timetables) of about 100-120 words.',
      statement_vi:
        'Đọc hiểu các văn bản thông tin ngắn gọn (áp phích, email, thời khóa biểu) độ dài khoảng 100-120 từ.',
      source_locator:
        'Chương trình GDPT Tiếng Anh, Mục 4.2 - Lớp 6, Kỹ năng Đọc',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-004',
          learning_outcome_id: 'out-g6-003',
          skill_id: 'skl-rea-detail-notices',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.92,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Academic Lead',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[7],
        },
      ],
    },
  ],

  // Lớp 7 (THCS)
  'grade-7': [
    {
      id: 'out-g7-001',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-7',
      outcome_code: 'MOET-G7-W01',
      statement_en:
        'Write a short passage (50-60 words) describing a past holiday, community activity or favorite hobby.',
      statement_vi:
        'Viết một đoạn văn ngắn (50-60 từ) kể lại chuyến đi chơi trong quá khứ, hoạt động cộng đồng hoặc sở thích cá nhân.',
      source_locator:
        'Chương trình GDPT Tiếng Anh, Mục 4.2 - Lớp 7, Kỹ năng Viết',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-005',
          learning_outcome_id: 'out-g7-001',
          skill_id: 'skl-gram-past-simple',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.96,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Academic Lead',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[1],
        },
        {
          id: 'map-006',
          learning_outcome_id: 'out-g7-001',
          skill_id: 'skl-wri-short-email',
          mapping_role: 'SECONDARY_TARGET',
          importance: 'SUPPORTING',
          confidence: 0.85,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'Academic Lead',
          verified_at: '2022-08-10T09:00:00Z',
          skill: MOCK_SKILLS[11],
        },
      ],
    },
  ],

  // Lớp 10 (THPT)
  'grade-10': [
    {
      id: 'out-g10-001',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-10',
      outcome_code: 'MOET-G10-REA-01',
      statement_en:
        'Read and evaluate opinions in longer texts (250-300 words) on environmental protection and community development.',
      statement_vi:
        'Đọc và đánh giá quan điểm trong các văn bản dài (250-300 từ) về bảo vệ môi trường và phát triển cộng đồng.',
      source_locator:
        'Chương trình GDPT Tiếng Anh, Mục 4.3 - Lớp 10, Kỹ năng Đọc',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-g10-01',
          learning_outcome_id: 'out-g10-001',
          skill_id: 'skl-rea-skimming-articles',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.95,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'High School Lead',
          verified_at: '2022-08-12T09:00:00Z',
          skill: MOCK_SKILLS[8],
        },
      ],
    },
    {
      id: 'out-g10-002',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-10',
      outcome_code: 'MOET-G10-WRI-01',
      statement_en:
        'Write a formal opinion paragraph / essay (120-150 words) using compound and complex sentences.',
      statement_vi:
        'Viết đoạn văn / bài luận bày tỏ quan điểm (120-150 từ) sử dụng câu ghép và câu phức chính xác.',
      source_locator:
        'Chương trình GDPT Tiếng Anh, Mục 4.3 - Lớp 10, Kỹ năng Viết',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-g10-02',
          learning_outcome_id: 'out-g10-002',
          skill_id: 'skl-gram-relative-clause',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.94,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'High School Lead',
          verified_at: '2022-08-12T09:00:00Z',
          skill: MOCK_SKILLS[2],
        },
      ],
    },
  ],

  // Lớp 12 (Tốt nghiệp THPT & Đại học)
  'grade-12': [
    {
      id: 'out-g12-001',
      curriculum_version_id: 'ver-2022-v2',
      grade_id: 'grade-12',
      outcome_code: 'MOET-G12-SYN-01',
      statement_en:
        'Synthesize information from multiple sources and present structured arguments on global career trends.',
      statement_vi:
        'Tổng hợp thông tin từ nhiều nguồn và trình bày lập luận có cấu trúc về xu hướng nghề nghiệp toàn cầu và trí tuệ nhân tạo.',
      source_locator: 'Chương trình GDPT Tiếng Anh, Mục 4.3 - Lớp 12',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-g12-01',
          learning_outcome_id: 'out-g12-001',
          skill_id: 'skl-spk-discursive-argument',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.98,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'High School Lead',
          verified_at: '2022-08-12T09:00:00Z',
          skill: MOCK_SKILLS[10],
        },
        {
          id: 'map-g12-02',
          learning_outcome_id: 'out-g12-001',
          skill_id: 'skl-voc-academic-essay',
          mapping_role: 'SECONDARY_TARGET',
          importance: 'CORE',
          confidence: 0.92,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'High School Lead',
          verified_at: '2022-08-12T09:00:00Z',
          skill: MOCK_SKILLS[4],
        },
      ],
    },
  ],

  // IELTS Band 6.5
  'ielts-band-6': [
    {
      id: 'out-ielts-w2',
      curriculum_version_id: 'ver-ielts-2025',
      grade_id: 'ielts-band-6',
      outcome_code: 'IELTS-WRI-TASK2',
      statement_en:
        'Present a clear position throughout the response with relevant and extended supporting ideas (Task Response Band 7.0).',
      statement_vi:
        'Trình bày lập trường rõ ràng xuyên suốt bài viết với các luận điểm hỗ trợ thích đáng và có phát triển ý (Task 2 Band 7.0).',
      source_locator: 'IELTS Writing Band Descriptors (Public Version), Task 2',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-ielts-01',
          learning_outcome_id: 'out-ielts-w2',
          skill_id: 'skl-wri-opinion-essay',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.99,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'IELTS Master Trainer',
          verified_at: '2025-01-10T09:00:00Z',
          skill: MOCK_SKILLS[12],
        },
      ],
    },
    {
      id: 'out-ielts-l3',
      curriculum_version_id: 'ver-ielts-2025',
      grade_id: 'ielts-band-6',
      outcome_code: 'IELTS-LIS-SEC3',
      statement_en:
        'Follow academic discussions between up to four people in an educational context.',
      statement_vi:
        'Nghe hiểu và theo dõi cuộc thảo luận học thuật giữa tối đa 4 người trong bối cảnh trường đại học.',
      source_locator: 'IELTS Listening Specifications, Section 3',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-ielts-02',
          learning_outcome_id: 'out-ielts-l3',
          skill_id: 'skl-lis-academic-lecture',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.95,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'IELTS Master Trainer',
          verified_at: '2025-01-10T09:00:00Z',
          skill: MOCK_SKILLS[6],
        },
      ],
    },
  ],

  // TOEIC 650+
  'toeic-650': [
    {
      id: 'out-toeic-p7',
      curriculum_version_id: 'ver-toeic-2025',
      grade_id: 'toeic-650',
      outcome_code: 'TOEIC-READ-PART7',
      statement_en:
        'Analyze cross-referenced multiple passages (emails, invoices, memos) to extract implied conclusions.',
      statement_vi:
        'Phân tích đối chiếu giữa nhiều văn bản (email, hóa đơn, thông báo nội bộ) để rút ra kết luận logic.',
      source_locator: 'TOEIC Reading Test Format, Part 7 (Multi-Passage)',
      status: 'APPROVED',
      mappings: [
        {
          id: 'map-toeic-01',
          learning_outcome_id: 'out-toeic-p7',
          skill_id: 'skl-rea-skimming-articles',
          mapping_role: 'PRIMARY_TARGET',
          importance: 'REQUIRED',
          confidence: 0.94,
          mapping_version: 'v1.0',
          status: 'APPROVED',
          verified_by: 'TOEIC Specialist',
          verified_at: '2025-01-15T09:00:00Z',
          skill: MOCK_SKILLS[8],
        },
      ],
    },
  ],
}

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

export type Language = 'vi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  vi: {
    // Admin Shell & Navigation
    'brand.title': 'EnglishFam Admin',
    'brand.subtitle': 'Quản trị nền tảng gia đình',
    'nav.section': '7 Phân hệ Chuẩn (Canonical Surfaces)',
    'nav.dashboard': 'Tổng quan hệ thống',
    'nav.accounts': 'Tài khoản & Người dùng',
    'nav.assignments': 'Phân công Phụ huynh - Học sinh',
    'nav.curriculum': 'Chương trình học (Curriculum)',
    'nav.questions': 'Ngân hàng câu hỏi',
    'nav.assessmentReview': 'Duyệt bài đánh giá gắn cờ',
    'nav.operations': 'Vận hành & Giám sát',
    'nav.capability': 'Quyền hạn (Capability):',
    'profile.role': 'Administrator',
    'profile.email': 'admin@englishfam.internal',

    // Curriculum Page Header & Switcher
    'curr.category': 'QUẢN TRỊ KHUNG CHUẨN (ADMIN CURRICULUM)',
    'curr.selectProgram': 'Chọn chương trình đào tạo:',
    'curr.authority': 'Cơ quan ban hành:',
    'curr.identifier': 'Mã định danh:',
    'curr.simulateDenied': 'Mô phỏng từ chối quyền',
    'curr.permissionRestored': 'Bật lại quyền (Dành cho kiểm thử UI)',

    // Versions Section
    'ver.title': 'Phiên bản chương trình',
    'ver.subtitle':
      'Quản trị phiên bản theo phả hệ văn bản pháp quy. Lịch sử được bảo toàn bất biến.',
    'ver.validateBtn': 'Thẩm định cấu trúc',
    'ver.approveBtn': 'Phê duyệt ban hành',
    'ver.createBtn': '+ Tạo bản mới',
    'ver.testConflict': 'Test xung đột',
    'ver.legalRef': 'Văn bản căn cứ:',
    'ver.effectiveFrom': 'Hiệu lực từ:',
    'ver.supersedes': 'Thay thế bản:',
    'ver.immutableRuleTitle': 'Quy tắc bất biến:',
    'ver.immutableRuleText':
      'Phiên bản này đã được công bố chính thức. Dữ liệu chuẩn đầu ra và ánh xạ là bất biến để bảo vệ lịch sử học tập của học sinh.',
    'ver.statusApproved': 'Đã ban hành',
    'ver.statusDraft': 'Bản thảo',
    'ver.statusDeprecated': 'Hết hiệu lực',

    // Grade & Outcomes
    'ssot.ruleTitle': 'Quy tắc Benchmark không ép học lại (FR-CURR-004):',
    'ssot.ruleText':
      'Chuẩn đầu ra và ánh xạ theo khối lớp đóng vai trò định vị mục tiêu trường học. Hệ thống cá nhân hóa không ép học sinh học lại toàn bộ một khối lớp nếu năng lực thực tế đã đạt hoặc cần lấp lỗ hổng ở mức độ khác.',
    'grade.filterAll': 'Tất cả khối lớp',
    'grade.filterPrimary': 'Tiểu học (Lớp 1–5)',
    'grade.filterSecondary': 'THCS (Lớp 6–9)',
    'grade.filterHigh': 'THPT (Lớp 10–12)',
    'grade.filterBands': 'Phân cấp cấp độ / Band',
    'grade.searchPlaceholder': 'Tìm mã chuẩn đầu ra, kỹ năng...',
    'outcome.mappedSkills': 'Kỹ năng EnglishFam được ánh xạ:',
    'outcome.manyToMany': 'Quan hệ nhiều-nhiều',
    'outcome.noMappedSkills':
      'Chưa có kỹ năng nào được ánh xạ tới chuẩn đầu ra này.',
    'outcome.mapSkillBtn': '+ Ánh xạ kỹ năng',
    'outcome.confidence': 'Độ tin cậy:',
    'outcome.rolePrimary': 'Trọng tâm',
    'outcome.roleSecondary': 'Bổ trợ',
    'outcome.rolePrereq': 'Tiên quyết',
    'outcome.roleReview': 'Ôn tập',
    'outcome.emptyTitle': 'Không tìm thấy chuẩn đầu ra',
    'outcome.emptyDesc':
      'Không có kết quả khớp với từ khóa tìm kiếm hoặc khối lớp được chọn.',

    // Modal Skill Mapping
    'modal.mapTitle': 'Ánh xạ kỹ năng cho chuẩn',
    'modal.mapSubtitle':
      'Thiết lập quan hệ nhiều-nhiều giữa Chuẩn đầu ra chương trình và Kỹ năng chuẩn EnglishFam',
    'modal.outcomeLabel': 'Chuẩn đầu ra được chọn:',
    'modal.selectSkill': 'Chọn Kỹ năng EnglishFam (*)',
    'modal.mappingRole': 'Vai trò ánh xạ (Mapping Role)',
    'modal.importance': 'Mức độ quan trọng (Importance)',
    'modal.cancel': 'Hủy bỏ',
    'modal.save': 'Lưu ánh xạ',
    'modal.allSkillsMapped':
      'Tất cả kỹ năng mẫu trong danh mục đã được ánh xạ vào chuẩn đầu ra này.',
    'modal.ssotNote':
      '* Quy tắc SSoT: Việc ánh xạ không làm thay đổi ID của Skill chuẩn và không trực tiếp tạo ra Mastery của người học.',

    // Modal Create Version
    'modal.createTitle': 'Tạo phiên bản chương trình mới',
    'modal.createSubtitle':
      'Tuân thủ quy tắc bảo toàn lịch sử: Phiên bản mới sẽ kế thừa và ghi nhận phiên bản tiền nhiệm.',
    'modal.versionLabel': 'Tên phiên bản (*) — VD: v2.1 (TT 17/2025/TT-BGDĐT)',
    'modal.documentRef': 'Văn bản pháp quy / Căn cứ ban hành (*)',
    'modal.effectiveDate': 'Ngày bắt đầu hiệu lực (*)',
    'modal.supersedesSelect': 'Thay thế phiên bản tiền nhiệm (Supersedes)',
    'modal.noSupersede': '-- Không thay thế (Khởi tạo mới) --',
    'modal.changeReason': 'Lý do cập nhật / Ghi chú sửa đổi (*)',
    'modal.historyNote':
      'Bảo toàn lịch sử: Phiên bản mới sẽ khởi tạo ở trạng thái DRAFT để Admin thẩm định trước khi phê duyệt ban hành.',
    'modal.submitCreate': 'Tạo phiên bản',

    // Conflict & Notifications
    'conflict.title':
      'Phát hiện xung đột phiên bản (Version Conflict / Stale Data)',
    'conflict.text':
      'Phiên bản chương trình này đã được cập nhật bởi một quản trị viên khác kể từ lúc bạn mở trang. Để ngăn việc vô tình ghi đè dữ liệu, hãy tải lại trang.',
    'conflict.reloadBtn': 'Tải lại dữ liệu mới nhất (Reload)',
    'notif.success': 'Thao tác thành công',
    'notif.error': 'Lỗi xử lý dữ liệu',
    'notif.retry': 'Thử lại (Retry)',
    'notif.deniedTitle': 'Không có quyền truy cập (Permission Denied)',
    'notif.deniedDesc':
      'Tài khoản quản trị của bạn không có capability admin:curriculum:manage. Theo nguyên tắc đặc quyền tối thiểu (Least Privilege), bạn không thể xem hoặc chỉnh sửa khung chương trình học.',
  },
  en: {
    // Admin Shell & Navigation
    'brand.title': 'EnglishFam Admin',
    'brand.subtitle': 'Family Learning Platform Governance',
    'nav.section': '7 Canonical Surfaces',
    'nav.dashboard': 'System Dashboard',
    'nav.accounts': 'Accounts / Users',
    'nav.assignments': 'Guardian–Student Assignments',
    'nav.curriculum': 'Curriculum Governance',
    'nav.questions': 'Question Bank',
    'nav.assessmentReview': 'Flagged Assessment Review',
    'nav.operations': 'Operations & Monitoring',
    'nav.capability': 'Capability:',
    'profile.role': 'Administrator',
    'profile.email': 'admin@englishfam.internal',

    // Curriculum Page Header & Switcher
    'curr.category': 'ADMIN CURRICULUM GOVERNANCE',
    'curr.selectProgram': 'Select Training Curriculum:',
    'curr.authority': 'Issuing Authority:',
    'curr.identifier': 'Identifier Code:',
    'curr.simulateDenied': 'Simulate Permission Denied',
    'curr.permissionRestored': 'Restore Permission (For UI Testing)',

    // Versions Section
    'ver.title': 'Curriculum Versions',
    'ver.subtitle':
      'Version governance based on regulatory statutory lineage. History remains immutable.',
    'ver.validateBtn': 'Validate Structure',
    'ver.approveBtn': 'Approve & Publish',
    'ver.createBtn': '+ Create New Version',
    'ver.testConflict': 'Test Conflict',
    'ver.legalRef': 'Statutory Basis:',
    'ver.effectiveFrom': 'Effective From:',
    'ver.supersedes': 'Supersedes Version:',
    'ver.immutableRuleTitle': 'Immutability Rule:',
    'ver.immutableRuleText':
      'This version is officially approved and immutable to protect learners’ historical evidence.',
    'ver.statusApproved': 'APPROVED',
    'ver.statusDraft': 'DRAFT',
    'ver.statusDeprecated': 'DEPRECATED',

    // Grade & Outcomes
    'ssot.ruleTitle': 'Benchmark Non-Repetition Rule (FR-CURR-004):',
    'ssot.ruleText':
      'Curriculum outcomes and grade mappings serve as reference benchmarks. The personalization engine will never force a student to repeat a whole grade if their actual ability differs.',
    'grade.filterAll': 'All Grades',
    'grade.filterPrimary': 'Primary (Grades 1–5)',
    'grade.filterSecondary': 'Lower Secondary (Grades 6–9)',
    'grade.filterHigh': 'Upper Secondary (Grades 10–12)',
    'grade.filterBands': 'Bands / Level Tiers',
    'grade.searchPlaceholder': 'Search outcome code, skill name...',
    'outcome.mappedSkills': 'Mapped EnglishFam Skills:',
    'outcome.manyToMany': 'Many-to-Many Relationship',
    'outcome.noMappedSkills':
      'No skills have been mapped to this learning outcome yet.',
    'outcome.mapSkillBtn': '+ Map Skill',
    'outcome.confidence': 'Confidence:',
    'outcome.rolePrimary': 'Primary',
    'outcome.roleSecondary': 'Secondary',
    'outcome.rolePrereq': 'Prerequisite',
    'outcome.roleReview': 'Review',
    'outcome.emptyTitle': 'No Learning Outcomes Found',
    'outcome.emptyDesc':
      'No outcomes match the current search filter or selected grade.',

    // Modal Skill Mapping
    'modal.mapTitle': 'Map Skill to Outcome',
    'modal.mapSubtitle':
      'Establish many-to-many link between Curriculum Learning Outcome and fine-grained EnglishFam Skills',
    'modal.outcomeLabel': 'Target Learning Outcome:',
    'modal.selectSkill': 'Select EnglishFam Skill (*)',
    'modal.mappingRole': 'Mapping Role',
    'modal.importance': 'Importance Level',
    'modal.cancel': 'Cancel',
    'modal.save': 'Save Mapping',
    'modal.allSkillsMapped':
      'All taxonomy skills are already mapped to this outcome.',
    'modal.ssotNote':
      '* SSoT Rule: Mapping never alters stable Skill IDs and does not directly create learner mastery.',

    // Modal Create Version
    'modal.createTitle': 'Create New Curriculum Version',
    'modal.createSubtitle':
      'Adheres to history preservation: New version links to and records its superseded lineage.',
    'modal.versionLabel':
      'Version Label (*) — e.g. v2.1 (Circular 17/2025/TT-BGDĐT)',
    'modal.documentRef': 'Statutory Document Reference (*)',
    'modal.effectiveDate': 'Effective From Date (*)',
    'modal.supersedesSelect': 'Supersedes Previous Version',
    'modal.noSupersede': '-- None (Initial Version) --',
    'modal.changeReason': 'Change Reason / Amendment Scope (*)',
    'modal.historyNote':
      'History Preservation: New version initializes in DRAFT status for administrative validation before publishing.',
    'modal.submitCreate': 'Create Version',

    // Conflict & Notifications
    'conflict.title': 'Version Conflict / Stale Data Detected',
    'conflict.text':
      'This curriculum version was updated by another administrator while you had it open. Please reload to avoid overwriting recent changes.',
    'conflict.reloadBtn': 'Reload Latest Data',
    'notif.success': 'Operation Completed Successfully',
    'notif.error': 'Data Processing Error',
    'notif.retry': 'Retry',
    'notif.deniedTitle': 'Access Denied (Permission Denied)',
    'notif.deniedDesc':
      'Your account lacks the capability admin:curriculum:manage. Following the principle of Least Privilege, you cannot view or edit curriculum structures.',
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ef_admin_lang')
      return saved === 'en' ? 'en' : 'vi'
    } catch {
      return 'vi'
    }
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('ef_admin_lang', lang)
    } catch {
      // storage unavailable
    }
  }

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

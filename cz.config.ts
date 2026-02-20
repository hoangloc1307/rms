import type { CommitizenGitOptions } from 'cz-git';

const commitizenConfig: CommitizenGitOptions = {
  messages: {
    type: 'Chọn loại thay đổi:',
    scope: 'Chọn scope:',
    customScope: 'Nhập scope tùy chỉnh:',
    subject: 'Mô tả ngắn gọn:',
    body: 'Mô tả chi tiết (tùy chọn):',
    footer: 'Footer (tùy chọn):',
    confirmCommit: 'Bạn có chắc chắn muốn tạo commit này?',
    footerPrefixesSelect: 'Chọn prefix footer:',
  },
  types: [
    { value: 'feat', name: 'feat     : ✨ Thêm feature mới' },
    { value: 'fix', name: 'fix      : 🐛 Fix bug' },
    { value: 'refactor', name: 'refactor : ♻️  Tái cấu trúc code' },
    { value: 'docs', name: 'docs     : 📝 Thay đổi tài liệu' },
    { value: 'chore', name: 'chore    : 🔨 Thay đổi config/tooling' },
    { value: 'test', name: 'test     : ✅ Thêm hoặc sửa test' },
    { value: 'perf', name: 'perf     : ⚡️ Cải thiện hiệu năng' },
  ],
  useEmoji: true,
  scopes: [],
  allowCustomScopes: true,
  customScopesAlias: 'tuỳ chỉnh',
  emptyScopesAlias: 'không scope',
  emptyIssuePrefixAlias: 'bỏ qua',
  customIssuePrefixAlias: 'tuỳ chỉnh',
  confirmColorize: true,
  allowEmptyScopes: true,
  maxSubjectLength: 100,
  defaultBody: '',
  defaultIssues: '',
  defaultScope: '',
  defaultSubject: '',
  upperCaseSubject: false,
};

export default commitizenConfig;

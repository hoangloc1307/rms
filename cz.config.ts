import type { CommitizenGitOptions, CommitMessageOptions } from 'cz-git';

const commitizenConfig: CommitizenGitOptions = {
  messages: {
    type: 'Chọn loại thay đổi:',
    scope: 'Chọn scope:',
    customScope: 'Nhập scope tùy chỉnh:',
    subject: 'Mô tả ngắn gọn:',
    body: 'Mô tả chi tiết (tùy chọn):',
    footer: 'Footer (tùy chọn):',
    confirmCommit: 'Bạn có chắc chắn muốn tạo commit này?',
    footerPrefixesSelect: 'Chọn footer prefix:',
    customFooterPrefix: 'Nhập footer prefix tuỳ chỉnh:',
    breaking: 'Liệt kê bất kỳ thay đổi quan trọng nào (tùy chọn). Sử dụng "|" để xuống dòng:\n',
  },
  types: [
    { value: 'feat', name: '✨ feat     : Thêm feature mới', emoji: '✨' },
    { value: 'fix', name: '🐛 fix      : Fix bug', emoji: '🐛' },
    { value: 'refactor', name: '♻️  refactor : Tái cấu trúc code', emoji: '♻️' },
    { value: 'docs', name: '📝 docs     : Thay đổi tài liệu', emoji: '📝' },
    { value: 'chore', name: '🔨 chore    : Thay đổi config/tooling', emoji: '🔨' },
    { value: 'test', name: '✅ test     : Thêm hoặc sửa test', emoji: '✅' },
    { value: 'perf', name: '⚡️ perf     : Cải thiện hiệu năng', emoji: '⚡️' },
    { value: 'style', name: '💄 style    : Thay đổi format code', emoji: '💄' },
  ],
  useEmoji: true,
  emojiAlign: 'center',
  formatMessageCB: ({ type, scope, subject, body, footer, breaking, emoji }: CommitMessageOptions) => {
    let message = `${emoji} ${type}`;
    if (scope) {
      message += `(${scope})`;
    }
    message += `: ${subject}`;

    if (body) {
      message += `\n\n${body}`;
    }
    if (breaking) {
      message += `\n\nBREAKING CHANGE: ${breaking}`;
    }
    if (footer) {
      message += `${footer}`;
    }
    return message;
  },
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

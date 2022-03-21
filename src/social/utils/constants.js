export default {
  // 敏感词类型:1-政治类;2-侮辱性词汇;3-其他
  TYPES_OF_SENSITIVE_WORDS: { 1: '政治类', 2: '侮辱性词汇', 3: '其他' },
  // 回复状态
  ANSWER_STATUS_LIST: [{ label: '已回复', value: 1 }, { label: '未回复', value: 0 }],
  ANSWER_STATUS_MAP: { 1: '已回复', 0: '未回复' },
  // 显示状态
  SHOW_STATUS_LIST: [{ label: '显示', value: '1' }, { label: '已屏蔽', value: '0' }],
  // 审核状态
  AUDIT_STATUS_MAP: { 0: '审核通过', 1: '审核不通过', 2: '待审核' },
  // APP升级设置
  UPDATE_CONFIG: [{ label: '需要', value: 1 }, { label: '不需要', value: 0 }]
}

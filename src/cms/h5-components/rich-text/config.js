export default {
  code: 'rich-text',
  name: '富文本',
  groupName: 'common',
  model: {
    customName: null, // 栏目名称
    content: '这里是富文本', // 富文本内容
    bgColor: '#ffffff',
    use: [] // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
  },
  fields: [
    {
      label: '栏目名称',
      prop: 'customName',
      tag: 'el-input',
      maxlength: '20',
      showWordLimit: true
    },
    {
      label: '栏目有效期',
      prop: 'use',
      tag: 'el-date-picker',
      type: 'datetimerange',
      'value-format': 'yyyy-MM-dd HH:mm:ss',
      clearable: false
    },
    {
      label: '富文本',
      prop: 'content',
      tag: 'ody-tinymce'
    },
    {
      label: '背景颜色',
      prop: 'bgColor',
      tag: 'el-color-picker'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请输入内容', trigger: 'blur' }
    ]
  }
}

export default {
  code: 'point-info',
  name: '积分信息',
  groupName: 'navigate',
  model: {
    customName: null, // 栏目名称
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
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}


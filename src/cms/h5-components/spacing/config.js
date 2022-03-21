export default {
  code: 'spacing',
  name: '辅助空白',
  groupName: 'common',
  model: {
    use: [],
    customName: null, // 栏目名称
    height: 25,
    bgColor: '#ffffff'
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
      label: '空白高度',
      prop: 'height',
      tag: 'cms-el-slider',
      min: 0,
      max: 50
    },
    {
      label: '空白底色',
      prop: 'bgColor',
      tag: 'el-color-picker'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

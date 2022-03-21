export default {
  code: 'bulletin',
  name: '公告信息',
  groupName: 'common',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    imgUrl: '//cdn.oudianyun.com/h5_static/icon-bulletin.png',
    fontColor: '#333333',
    bgColor: '#c57272',
    content: '请在这里输入公告内容',
    link: {}
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
      label: '图标',
      prop: 'imgUrl',
      tag: 'cms-bulletin-icon'
    },
    {
      label: '内容',
      prop: 'content',
      tag: 'el-input',
      'maxLength': 30
    },
    {
      label: '文字颜色',
      prop: 'fontColor',
      tag: 'el-color-picker'
    },
    {
      label: '背景颜色',
      prop: 'bgColor',
      tag: 'el-color-picker'
    },
    {
      label: '',
      prop: 'link',
      tag: 'cms-link-url',
      showtip: false
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

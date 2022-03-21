export default {
  code: 'h5-multipic', // 原code： h5_multipic
  name: '单列多图',
  groupName: 'common',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    margin: 1, // 图片间距
    images: [] // 配置图片信息
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
      label: '图片间距',
      prop: 'margin',
      tag: 'cms-h5multipic-space'
    },
    {
      label: null,
      prop: 'images',
      tag: 'cms-h5multipic-images'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

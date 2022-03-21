export default {
  code: 'slide-show', // 原 slideShow
  name: '单行多图',
  groupName: 'common',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    imgWidth: 25, // 单个图片宽度比例
    items: [] // 设置的图片信息
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
      label: '单个图片宽度比例',
      prop: 'imgWidth',
      tag: 'cms-slide-show-imgwidth'
    },
    {
      label: '',
      prop: 'items',
      tag: 'cms-slider-show-image'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

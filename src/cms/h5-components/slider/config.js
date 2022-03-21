export default {
  code: 'slider',
  name: '轮播',
  groupName: 'common',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    manner: 1, // 风格
    style: 1, // 样式
    height: 290, // 轮播模板高度
    pictureList: [] // 轮播图内容
  },
  fields: [
    {
      label: '轮播图风格',
      prop: 'manner',
      tag: 'cms-slider-manner'
    },
    {
      label: '轮播图样式',
      prop: 'style',
      tag: 'cms-slider-style'
    },
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
      label: '',
      prop: 'pictureList',
      tag: 'cms-slider-picture-list'
    }

  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

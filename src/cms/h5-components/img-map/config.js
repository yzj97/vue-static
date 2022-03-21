export default {
  code: 'img-map',
  name: '热区图',
  groupName: 'common',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    src: '//cdn.oudianyun.com/h5_static/img-map.jpg',
    imgInfo: {
      width: 320,
      height: 150
    },
    data: []
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
      label: '热区图片',
      prop: 'src',
      tag: 'cms-url'
    },
    {
      label: null,
      prop: 'data',
      tag: 'cms-image-hotmap'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

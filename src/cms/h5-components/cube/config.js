export default {
  code: 'cube',
  name: '魔方',
  groupName: 'common',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    layout: 0, // 布局类型
    cdata: {
      width: '100%',
      children: [
        {
          width: '50%',
          float: 'left',
          sort: '1',
          link: {},
          imgUrl: '//cdn.oudianyun.com/h5_static/1490762821218_4264_66.png@base@tag=imgScale&q=80',
          sug: '375x220'
        },
        {
          width: '50%',
          float: 'left',
          sort: '2',
          link: {},
          imgUrl: '//cdn.oudianyun.com/h5_static/1490762821218_4264_66.png@base@tag=imgScale&q=80',
          sug: '375x220'
        }
      ]
    }
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
      label: '组合样式',
      prop: 'layout',
      tag: 'cms-cube-radio'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ],
    layout: [
      { required: true, message: '请选择组合样式', trigger: 'blur' }
    ]
  }
}

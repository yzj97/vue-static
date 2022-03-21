export default {
  code: 'shops',
  name: '店铺',
  groupName: 'shops',
  model: {
    displayNum: 100,
    dataSortRole: 0, // 排序
    customName: null, // 栏目名称
    dataChange: 0, // 监听这个值 改变编辑H5Iphone的时候的数据
    use: [] // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
  },
  fields: [
    {
      label: '栏目名称',
      prop: 'customName',
      tag: 'el-input',
      maxlength: '100',
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
      prop: '',
      tag: 'cms-choose-shops'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}


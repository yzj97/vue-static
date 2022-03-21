export default {
  code: 'channel',
  name: '图片导航',
  groupName: 'navigate',
  model: {
    channel: ['110001', '110002', '110003'], // 渠道
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    selected: 1, // 选择的模板 -- 模板-、二、三
    selectedStyle: 1, // 导航样式 -- 一行n个/两行n个
    backgroundImg: '', // 导航背景图
    navigation: [] // 导航信息
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
      label: '导航模板',
      prop: 'selected',
      tag: 'cms-channel-choose-template'
    },
    {
      label: '导航样式',
      prop: 'selectedStyle',
      tag: 'cms-channel-choose-style'
    },
    {
      label: '',
      prop: 'backgroundImg',
      tag: 'cms-channel-background-img'
    },
    {
      label: '',
      prop: 'navigation',
      tag: 'cms-channel-navigation'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

export default {
  code: 'count-down', // 原 countDown
  name: '倒计时',
  groupName: 'market',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    style: 1, // 倒计时样式
    backgroundImg: '', // 倒计时背景图
    link: {}, // 链接到
    desc: '限时秒杀', // 倒计时提示文案
    descColor: '#333333', // 倒计时提示文案字体颜色
    tipColor: '#999999', // 倒计时样式提示文字颜色
    symboColor: '#333333', // 倒计时 符号字体颜色
    stylebgColor: '#F43142', // 倒计时样式背景颜色
    styleColor: '#ffffff', // 倒计时样式字体颜色
    countDownUse: [] // 倒计时开始-结束时间
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
      label: '倒计时样式',
      prop: 'style',
      tag: 'cms-count-down-style'
    },
    {
      label: '倒计时背景图',
      prop: 'backgroundImg',
      tag: 'cms-count-down-backgroundimg'
    },
    {
      label: '文案',
      prop: 'desc',
      tag: 'el-input',
      maxlength: 20,
      showWordLimit: true
    },
    {
      label: '文案字体颜色',
      prop: 'descColor',
      tag: 'el-color-picker'
    },
    {
      label: '提示文字颜色',
      prop: 'tipColor',
      tag: 'el-color-picker'
    },
    {
      label: '提示符号颜色',
      prop: 'symboColor',
      tag: 'el-color-picker'
    },
    {
      label: '背景颜色',
      prop: 'stylebgColor',
      tag: 'el-color-picker'
    },
    {
      label: '文字颜色',
      prop: 'styleColor',
      tag: 'el-color-picker'
    },
    {
      label: '链接到',
      prop: 'link',
      tag: 'cms-count-down-link'
    },
    {
      label: '倒计时',
      prop: 'countDownUse',
      tag: 'cms-count-down-use'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ],
    countDownUse: [
      { required: true, message: '请选择开始以及结束时间', trigger: 'blur' }
    ]
  }
}

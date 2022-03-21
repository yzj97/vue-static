export default {
  model: {
    channelCodeList: ['110001', '110002', '110003'],
    lang: 'zh_CN',
    name: '',
    displayTitle: '',
    bgColor: '#ffffff',
    startDate: '',
    shareTitle: '', // 分享标题
    shareImg: '', // 分享图片
    shareDesc: '' // 分享描述
  },
  fields: [
    {
      label: '渠道',
      prop: 'channelCodeList',
      tag: 'el-checkbox-group',
      children: [
        {
          html: '自建BBC',
          label: '110001',
          tag: 'el-checkbox'
        },
        {
          html: '自建B2B',
          label: '110002',
          tag: 'el-checkbox'
        },
        {
          html: '自建O2O',
          label: '110003',
          tag: 'el-checkbox'
        }
      ]
    },
    {
      label: '语言',
      prop: 'lang',
      tag: 'el-select',
      children: [
        {
          label: '中文',
          value: 'zh_CN',
          tag: 'el-option'
        },
        {
          label: '英文',
          value: 'en_US',
          tag: 'el-option'
        }
      ]
    },
    {
      label: '页面名称',
      prop: 'name',
      tag: 'el-input',
      maxlength: '10',
      showWordLimit: true
    },
    {
      label: '页面标题',
      prop: 'displayTitle',
      tag: 'el-input',
      maxlength: '10',
      showWordLimit: true
    },
    {
      label: '页面背景色',
      prop: 'bgColor',
      tag: 'el-color-picker'
    },
    {
      label: '页面生效时间',
      prop: 'startDate',
      type: 'datetime',
      tag: 'el-date-picker'
    },
    {
      label: '分享标题',
      prop: 'shareTitle',
      tag: 'el-input',
      maxlength: '200',
      showWordLimit: true
    },
    {
      label: '分享图片',
      prop: 'shareImg',
      tag: 'cms-url',
      tip: '建议尺寸100*100'
    },
    {
      label: '分享描述',
      prop: 'shareDesc',
      tag: 'el-input',
      maxlength: '200',
      showWordLimit: true
    }

  ],
  rules: {
    channelCodeList: [
      { required: true, message: '请选择渠道', trigger: 'blur' }
    ],
    lang: [
      { required: true, message: '请选择语言', trigger: ['blur', 'change'] }
    ],
    name: [
      { required: true, message: '请输入页面名称', trigger: 'blur' }
    ],
    displayTitle: [
      { required: true, message: '请输入页面标题', trigger: 'blur' }
    ],
    shareTitle: [
      { required: true, message: '请输入分享标题', trigger: 'blur' }
    ],
    shareImg: [
      { required: true, message: '请上传分享图片', trigger: ['blur', 'change'] }
    ],
    shareDesc: [
      { required: true, message: '请输入分享描述', trigger: 'blur' }
    ]

  }
}

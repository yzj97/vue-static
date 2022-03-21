export default {
  model: {
    channelCodeList: ['110001'],
    displayTitle: '', // 文章标题
    categoryId: '', // 文章分类
    coverImage: '', // 上传封面
    platformTypeList: ['1'], // 推送平台集合
    showHeadline: 1, // 是否头条
    description: '', // 文章摘要
    startDate: '', // 页面生效时间
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
        }
      ]
    },
    {
      label: '文章标题',
      prop: 'displayTitle',
      tag: 'el-input',
      maxlength: '20',
      showWordLimit: true
    },
    {
      label: '所属分类',
      prop: 'categoryId',
      tag: 'cms-category'
    },
    {
      label: '上传封面',
      prop: 'coverImage',
      tag: 'cms-url'
    },
    {
      label: '推送平台',
      prop: 'platformTypeList',
      tag: 'el-checkbox-group',
      children: [
        {
          html: '微信',
          label: 1,
          tag: 'el-checkbox'
        }
      ]
    },
    {
      label: '是否头条',
      prop: 'showHeadline',
      tag: 'el-switch',
      'active-value': 1,
      'inactive-value': 0
    },
    {
      label: '文章摘要',
      prop: 'description',
      tag: 'el-input',
      placeholder: '默认显示第一个富文本模板中的前54个字符',
      maxlength: '100',
      showWordLimit: true
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
      maxlength: '50',
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
      maxlength: '100',
      showWordLimit: true
    }

  ],
  rules: {
    channelCodeList: [
      { required: true, message: '请选择渠道', trigger: 'blur' }
    ],
    displayTitle: [
      { required: true, message: '请输入文章标题', trigger: 'blur' }
    ],
    categoryId: [
      { required: true, message: '请选择所属分类', trigger: ['blur', 'change'] }
    ],
    coverImage: [
      { required: true, message: '请上传封面', trigger: ['blur', 'change'] }
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

export default {
  code: 'title', // code -- 和以前不一致，之前的templateCode
  name: '标题',
  groupName: 'common',
  dataType: '0', // 数据类型，0：静态数据，1：普通商品，2：促销商品，3：单拼商品，4：多拼活动，5：优惠券，6：口令券，7：扫码券，8：领卡，10：选品，11：广告数据，12：分销商品，13：平台优惠券，14：砍价活动
  model: {
    displayTime: 1, // 展示时效
    customName: null, // 栏目名称
    titleName: '这是默认标题', // 标题
    titleType: 0, // 标题类型  0-热搜词  1-更多
    iconSrc: '', // 标题图标
    color: '', // 标题颜色
    more: {}, // titleType-1 链接到的地址
    keyword: [] // titleType-0 热搜词数组
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
      label: '展示时效',
      prop: 'displayTime',
      tag: 'el-radio-group',
      children: [
        {
          html: '保持一直展示',
          label: 1,
          tag: 'el-radio'
        }
      ]
    },
    {
      label: '标题图标',
      prop: 'iconSrc',
      tag: 'cms-title-url'
    },
    {
      label: '标题名称',
      prop: 'titleName',
      tag: 'el-input',
      maxlength: '20',
      showWordLimit: true
    },
    {
      label: '标题颜色',
      prop: 'color',
      tag: 'el-color-picker'
    },
    {
      label: '标题类型',
      prop: 'titleType',
      tag: 'el-radio-group',
      children: [
        {
          html: '热搜词(最多可添加12个热搜词)',
          label: 0,
          tag: 'el-radio'
        },
        {
          html: '更多',
          label: 1,
          tag: 'el-radio'
        }
      ]
    },
    {
      label: null,
      prop: 'keyword',
      tag: 'cms-pc-title-keyword'
    },
    {
      label: null,
      prop: 'more',
      tag: 'cms-pc-title-more'
    }
  ],
  rules: {
    displayTime: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ],
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

export default {
  code: 'goods', // code -- 和以前不一致，之前的templateCode
  name: '商品',
  groupName: 'goods',
  dataType: '0', // 数据类型，0：静态数据，1：普通商品，2：促销商品，3：单拼商品，4：多拼活动，5：优惠券，6：口令券，7：扫码券，8：领卡，10：选品，11：广告数据，12：分销商品，13：平台优惠券，14：砍价活动
  model: {
    customName: null, // 栏目名称
    displayTime: 1, // 展示时效
    col: 5, // 展示样式
    displayNum: 100,
    dataSortRole: 0, // 排序
    goodsType: 0, // 选品方式
    dataChange: 0 // 监听这个值 改变编辑H5Iphone的时候的数据
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
      label: '展示样式',
      prop: 'col',
      tag: 'el-radio-group',
      children: [
        {
          html: '一行2个',
          label: 2,
          tag: 'el-radio'
        },
        {
          html: '一行3个',
          label: 3,
          tag: 'el-radio'
        },
        {
          html: '一行4个',
          label: 4,
          tag: 'el-radio'
        },
        {
          html: '一行5个',
          label: 5,
          tag: 'el-radio'
        }
      ]
    },
    {
      label: '商品展示数',
      prop: 'displayNum',
      tag: 'el-input'
    },
    {
      label: '商品排序规则',
      prop: 'dataSortRole',
      tag: 'el-select',
      children: [
        {
          label: '自定义排序',
          value: 0,
          tag: 'el-option'
        },
        {
          label: '按价格从高到低',
          value: 1,
          tag: 'el-option'
        },
        {
          label: '按价格从低到高',
          value: 2,
          tag: 'el-option'
        },
        {
          label: '按销售量从高到低',
          value: 3,
          tag: 'el-option'
        },
        {
          label: '按销售量从低到高',
          value: 4,
          tag: 'el-option'
        }
      ]
    },
    {
      label: '选品方式',
      prop: 'goodsType',
      tag: 'cms-choose-goods-type'
    },
    {
      label: '',
      prop: '',
      tag: 'cms-choose-goods'
    }

  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ],
    displayTime: [
      { required: true, message: '请选择展示时效', trigger: ['blur', 'change'] }
    ]
  }
}

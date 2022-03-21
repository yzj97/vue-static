export default {
  code: 'goods-r1cn',
  name: '单行滚动',
  groupName: 'goods',
  model: {
    displayNum: 100,
    dataSortRole: 0, // 排序
    customName: null, // 栏目名称
    displayBuyBtn: false, // 显示购买按钮
    displayEvaluate: false, // 显示评论
    goodsType: 0, // 选品方式
    dataChange: 0, // 监听这个值 改变编辑H5Iphone的时候的数据
    use: [] // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
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
    // {
    //   label: '显示购买按钮',
    //   prop: 'displayBuyBtn',
    //   tag: 'el-switch',
    //   'active-value': true,
    //   'inactive-value': false
    // },
    // {
    //   label: '显示评论',
    //   prop: 'displayEvaluate',
    //   tag: 'el-switch',
    //   'active-value': true,
    //   'inactive-value': false
    // },
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
    ]
  }
}


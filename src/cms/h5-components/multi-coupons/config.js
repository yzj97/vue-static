export default {
  code: 'multi-coupons',
  name: '优惠券',
  groupName: 'market',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    displayType: 1, // 显示样式
    title: '', // 楼层标题
    icon: '', // 楼层图片
    linkTitle: '更多', // 楼层跳转地址
    link: {}, // 设置连接地址
    showTitle: true,
    dataChange: 0
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
      label: '显示样式',
      prop: 'displayType',
      tag: 'el-radio-group',
      children: [
        {
          html: '一行一个',
          label: 1,
          tag: 'el-radio'
        },
        {
          html: '一行三个',
          label: 2,
          tag: 'el-radio'
        }
      ]
    },
    {
      label: '楼层标题',
      prop: 'title',
      tag: 'el-input',
      maxlength: 6
    },
    {
      label: '楼层图标',
      prop: 'icon',
      tag: 'cms-title-url'
    },
    {
      label: '楼层跳转地址',
      prop: 'linkTitle',
      tag: 'el-input',
      maxlength: 6
    },
    {
      label: '',
      prop: 'link',
      tag: 'cms-link-url',
      showtip: false
    },
    {
      label: '显示楼层标题',
      prop: 'showTitle',
      tag: 'el-switch',
      'active-value': true,
      'inactive-value': false
    },
    {
      label: '',
      prop: '',
      tag: 'cms-choose-coupon'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

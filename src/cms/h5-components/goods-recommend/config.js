export default {
  code: 'goods-recommend',
  name: '精准化推荐',
  groupName: 'goods',
  model: {
    displayBuyBtn: true, // 显示购买按钮
    displayEvaluate: true, // 显示评论
    goodsType: 4, // 选品方式
    customName: null, // 栏目名称
    displayType: 0,
    displayNum: 100,
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
      label: '显示样式',
      prop: 'displayType',
      tag: 'el-radio-group',
      children: [
        {
          html: '一行两列',
          label: 0,
          tag: 'el-radio'
        },
        {
          html: '单列小图',
          label: 1,
          tag: 'el-radio'
        },
        {
          html: '单列大图',
          label: 2,
          tag: 'el-radio'
        }
      ]
    },
    {
      label: '',
      prop: 'displayBuyBtn',
      tag: 'el-checkbox-group',
      children: [
        {
          html: '显示购买按钮',
          label: true,
          tag: 'el-checkbox'
        }
      ]
    },
    {
      label: '',
      prop: 'displayEvaluate',
      tag: 'el-checkbox-group',
      children: [
        {
          html: '显示评论数',
          label: true,
          tag: 'el-checkbox'
        }
      ]
    },
    {
      label: '',
      prop: '',
      tag: 'cms-warn-text',
      text: '【备注】该模块商品由系统根据算法自动展现，前台查看'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

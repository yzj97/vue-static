export default {
  code: 'rich-text', // code -- 和以前不一致，之前的templateCode
  name: '富文本',
  groupName: 'common',
  dataType: '0', // 数据类型，0：静态数据，1：普通商品，2：促销商品，3：单拼商品，4：多拼活动，5：优惠券，6：口令券，7：扫码券，8：领卡，10：选品，11：广告数据，12：分销商品，13：平台优惠券，14：砍价活动
  model: {
    displayTime: 1,
    customName: null, // 栏目名称
    content: '这里是富文本'
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
      label: '富文本',
      prop: 'content',
      tag: 'ody-tinymce'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请输入内容', trigger: 'blur' }
    ],
    displayTime: [
      { required: true, message: '请选择展示时效', trigger: 'blur' }
    ]
  }
}

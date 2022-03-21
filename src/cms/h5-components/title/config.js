export default {
  code: 'title', // code -- 和以前不一致，之前的templateCode
  name: '标题',
  groupName: 'common',
  dataType: '0', // 数据类型，0：静态数据，1：普通商品，2：促销商品，3：单拼商品，4：多拼活动，5：优惠券，6：口令券，7：扫码券，8：领卡，10：选品，11：广告数据，12：分销商品，13：平台优惠券，14：砍价活动
  model: {
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    leftUrl: '',
    rightUrl: '',
    customName: null, // 栏目名称
    titleName: '这是默认标题', // 标题
    titleType: 3, // 标题模板，可选：1，2，3，4
    titlePosition: 'left', // 显示方式, 可选：left, center, right
    color: '#b48b32', // 字体颜色
    fontSize: 22, // 字体大小
    titleBgColor: '#ffffff', // 背景颜色
    splitColor: '#b48b32' // 分割线颜色
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
      label: '标题名称',
      prop: 'titleName',
      tag: 'el-input',
      maxlength: '20',
      showWordLimit: true
    },
    {
      label: '标题模板',
      prop: 'titleType',
      tag: 'el-radio-group',
      children: [
        {
          html: '模板一',
          label: 1,
          tag: 'el-radio'
        },
        {
          html: '模板二',
          label: 2,
          tag: 'el-radio'
        },
        {
          html: '模板三',
          label: 3,
          tag: 'el-radio'
        },
        {
          html: '模板四',
          label: 4,
          tag: 'el-radio'
        }
      ]
    },
    {
      label: '显示方式',
      prop: 'titlePosition',
      tag: 'el-radio-group',
      children: [
        {
          html: '居左',
          label: 'left',
          tag: 'el-radio'
        },
        {
          html: '居中',
          label: 'center',
          tag: 'el-radio'
        },
        {
          html: '居右',
          label: 'right',
          tag: 'el-radio'
        }
      ]
    },
    {
      label: '左边图片',
      prop: 'leftUrl',
      tag: 'cms-title-url-disable'
    },
    {
      label: '右边图片',
      prop: 'rightUrl',
      tag: 'cms-title-url-disable'
    },
    {
      label: '字体颜色',
      prop: 'color',
      tag: 'el-color-picker'
    },
    {
      label: '字体大小',
      prop: 'fontSize',
      tag: 'el-select',
      children: [
        {
          label: '12px',
          value: 12,
          tag: 'el-option'
        },
        {
          label: '14px',
          value: 14,
          tag: 'el-option'
        },
        {
          label: '16px',
          value: 16,
          tag: 'el-option'
        },
        {
          label: '18px',
          value: 18,
          tag: 'el-option'
        },
        {
          label: '20px',
          value: 20,
          tag: 'el-option'
        },
        {
          label: '22px',
          value: 22,
          tag: 'el-option'
        },
        {
          label: '24px',
          value: 24,
          tag: 'el-option'
        },
        {
          label: '26px',
          value: 26,
          tag: 'el-option'
        },
        {
          label: '28px',
          value: 28,
          tag: 'el-option'
        },
        {
          label: '30px',
          value: 30,
          tag: 'el-option'
        },
        {
          label: '32px',
          value: 32,
          tag: 'el-option'
        },
        {
          label: '34px',
          value: 34,
          tag: 'el-option'
        },
        {
          label: '36px',
          value: 36,
          tag: 'el-option'
        }
      ]
    },
    {
      label: '背景颜色',
      prop: 'titleBgColor',
      tag: 'el-color-picker'
    },
    {
      label: '分割线颜色',
      prop: 'splitColor',
      tag: 'el-color-picker'
    }
  ],
  rules: {
    titleName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ],
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

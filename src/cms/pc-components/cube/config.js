export default {
  code: 'cube', // code -- 和以前不一致，之前的templateCode
  name: '魔方',
  groupName: 'common',
  dataType: '0', // 数据类型，0：静态数据，1：普通商品，2：促销商品，3：单拼商品，4：多拼活动，5：优惠券，6：口令券，7：扫码券，8：领卡，10：选品，11：广告数据，12：分销商品，13：平台优惠券，14：砍价活动
  model: {
    displayTime: 1,
    customName: null, // 栏目名称
    layout: 0, // 魔方展示类型
    cdata: {
      'width': '1200px',
      'imgBg': require('../../img/layout-one.png'),
      'children': [
        {
          'width': '224px',
          'height': '404px',
          'float': 'left',
          'marginRight': '20px',
          'sort': '1',
          'link': {

          },
          'desc': '',
          'imgUrl': '//cdn.oudianyun.com/h5_static/1505188703201_6168_40.png@base@tag=imgScale&q=80',
          'sug': '224x404'
        },
        {
          'width': '224px',
          'height': '404px',
          'float': 'left',
          'marginRight': '20px',
          'sort': '2',
          'link': {

          },
          'desc': '',
          'imgUrl': '//cdn.oudianyun.com/h5_static/1505188728394_500_41.png@base@tag=imgScale&q=80',
          'sug': '224x404'
        },
        {
          'width': '224px',
          'height': '404px',
          'float': 'left',
          'marginRight': '20px',
          'sort': '3',
          'link': {

          },
          'desc': '',
          'imgUrl': '//cdn.oudianyun.com/h5_static/1505188746151_2290_32.png@base@tag=imgScale&q=80',
          'sug': '224x404'
        },
        {
          'width': '224px',
          'height': '404px',
          'float': 'left',
          'marginRight': '20px',
          'sort': '4',
          'link': {

          },
          'desc': '',
          'imgUrl': '//cdn.oudianyun.com/h5_static/1505188758651_7766_33.png@base@tag=imgScale&q=80',
          'sug': '224x404'
        },
        {
          'width': '224px',
          'height': '404px',
          'float': 'left',
          'sort': '5',
          'link': {

          },
          'desc': '',
          'imgUrl': '//cdn.oudianyun.com/h5_static/1505188776640_468_36.png@base@tag=imgScale&q=80',
          'sug': '224x404'
        }
      ]
    }
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
      label: null,
      prop: 'layout',
      tag: 'cms-pc-cube-layout'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ],
    displayTime: [
      { required: true, message: '请选择展示时效', trigger: 'blur' }
    ]
  }
}

export default {
  code: 'header', // 原code： h5_multipic
  name: '导航栏',
  groupName: 'navigate',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    manner: 1, // 风格
    style: 1, // 样式
    locationIcon: '//cdn.oudianyun.com/dev/cms/1590387467351_83.25100597514134_f989f65d-f494-44f5-bc4c-ec9e0c2ac10e.png', // 定位icon
    downIcon: '//cdn.oudianyun.com/dev/cms/1590387552190_94.19667470510048_56ff2e05-b9d7-4a85-9c1d-83f26f771762.png', // 下拉icon
    newsIcon: '//cdn.oudianyun.com/dev/cms/1590387572419_4.740975334912689_065bda0c-3f45-4631-82c9-e45dad3dabd6.png', // 消息icon
    searchIcon: '//cdn.oudianyun.com/dev/cms/1590387595257_26.68603087157545_a9694a26-acfd-4167-b4f3-b06e9e54a203.png', // 搜索icon
    scanIcon: '//cdn.oudianyun.com/dev/cms/1591244611988_24.94969003567199_e1cab8a9-e391-44ba-bcf2-526ad2675f2e.png', // 扫一扫
    background: {
      style: 1,
      color: '',
      startColor: '',
      endColor: ''
    },
    btnShow: {
      displayLocation: true,
      displayNews: true,
      displayScan: true,
      displayLang: true
    },
    searchTxt: '请输入品牌、零件号、VIN码等'
  },
  fields: [
    {
      label: '栏目名称',
      prop: 'customName',
      tag: 'el-input',
      maxlength: '20',
      showWordLimit: true
    },
    // {
    //   label: '栏目有效期',
    //   prop: 'use',
    //   tag: 'el-date-picker',
    //   type: 'datetimerange',
    //   'value-format': 'yyyy-MM-dd HH:mm:ss',
    //   clearable: false
    // },
    {
      label: '导航风格',
      prop: 'manner',
      tag: 'el-radio-group',
      children: [
        {
          html: '风格A',
          label: 1,
          tag: 'el-radio'
        },
        {
          html: '风格B',
          label: 2,
          tag: 'el-radio'
        }

      ]
    },
    {
      label: '导航样式',
      prop: 'style',
      tag: 'cms-header-style'
      // tag: 'el-radio-group',
      // children: [
      //   {
      //     html: '样式1',
      //     label: 1,
      //     tag: 'el-radio'
      //   },
      //   {
      //     html: '样式2',
      //     label: 2,
      //     tag: 'el-radio'
      //   }

      // ]
    },
    {
      label: '搜索文字提示',
      prop: 'searchTxt',
      tag: 'el-input',
      maxlength: 15
    },
    {
      label: '导航背景颜色',
      prop: 'background',
      tag: 'cms-header-background'
    },
    {
      label: '导航功能',
      prop: 'btnShow',
      tag: 'cms-header-btn'
    },
    {
      label: '定位图标',
      prop: 'locationIcon',
      tag: 'cms-header-url'
    },
    {
      label: '定位下拉图标',
      prop: 'downIcon',
      tag: 'cms-header-url'
    },
    {
      label: '消息图标',
      prop: 'newsIcon',
      tag: 'cms-header-url',
      tip: '备注: 添加图片尺寸为44*44px, 切换样式恢复默认'
    },
    {
      label: '搜索图标',
      prop: 'searchIcon',
      tag: 'cms-header-url'
    },
    {
      label: '扫一扫图标',
      prop: 'scanIcon',
      tag: 'cms-header-url'
    }

  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

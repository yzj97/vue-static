export default {
  code: 'tabs',
  name: '页签',
  groupName: 'navigate',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    tabMode: 1, // 页签内容展示 1 同屏 2 分屏
    tabInteractive: 1, // 交互方式 1 标签模块 2 锚点定位
    defaultTab: 0,
    modeType: 0,
    currentTab: 0,
    defaultColor: {
      fontColor: '#333333',
      bgColor: '#eeeeee'
    },
    activeColor: {
      activeFontColor: '#ffffff',
      activeBgColor: '#ff8040'
    },
    tabStyle: 'style1',
    tabStyles: {
      'style1': {
        'fontColor': '#333333',
        'bgColor': '#eeeeee',
        'activeFontColor': '#ff8040',
        'activeBgColor': '#ff8040'
      },
      'style2': {
        'fontColor': '#333333',
        'bgColor': '#eeeeee',
        'activeFontColor': '#ffffff',
        'activeBgColor': '#ff8040'
      },
      'style3': {
        'fontColor': '#333333',
        'bgColor': '#eeeeee',
        'activeFontColor': '#ffffff',
        'activeBgColor': '#ff8040'
      }
    },
    tabs: []
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
      label: '页签样式:',
      prop: 'tabStyle',
      tag: 'el-radio-group',
      children: [
        {
          html: '样式一',
          label: 'style1',
          tag: 'el-radio'
        },
        {
          html: '样式二',
          label: 'style2',
          tag: 'el-radio'
        },
        {
          html: '样式三',
          label: 'style3',
          tag: 'el-radio'
        }
      ]
    },
    {
      label: '默认颜色:',
      prop: 'defaultColor',
      tag: 'cms-tabs-choose-default-color'
    },
    {
      label: '选中颜色:',
      prop: 'activeColor',
      tag: 'cms-tabs-choose-active-color'
    },
    {
      label: '页签内容展示:',
      prop: 'tabMode',
      // tag: 'cms-tabs-change-pages'
      tag: 'el-radio-group',
      children: [
        {
          html: '同页面',
          label: 1,
          tag: 'el-radio'
        },
        {
          html: '分页面',
          label: 2,
          tag: 'el-radio'
        }
      ]
    },
    {
      label: null,
      prop: 'tabs',
      tag: 'cms-tabs-content-show'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

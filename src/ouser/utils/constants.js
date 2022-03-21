export default {
  messageStatusOptions: [{
    value: '2',
    label: '全部'
  }, {
    value: '0',
    label: '未发布'
  }, {
    value: '1',
    label: '已发布'
  }],
  isAvailable: [
    {
      value: 0,
      label: '停用'
    },
    {
      value: 1,
      label: '启用'
    },
    {
      value: 2,
      label: '已注销'
    }
  ],
  sex: [
    {
      value: 0,
      label: '男'
    },
    {
      value: 1,
      label: '女'
    },
    {
      value: 2,
      label: '保密'
    }
  ],
  datePickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
    shortcuts: [
      {
        text: '今天',
        onClick(picker) {
          picker.$emit('pick', new Date())
        }
      }
    ]
  },
  futureDatePickerOptions: {
    disabledDate(time) {
      return time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000)
    }
  },
  identitySubTypes: [
    {
      value: 11,
      label: '运营员工'
    },
    {
      value: 20,
      label: '商家主账号'
    },
    {
      value: 21,
      label: '商家员工'
    },
    {
      value: 30,
      label: '店铺主账号'
    },
    {
      value: 31,
      label: '店铺员工'
    }
  ],
  purchasingMethodList: [
    { value: '1', label: '普通采购' },
    { value: '2', label: '集团采购' }
  ],
  purchasingStatusList: [
    { value: '1', label: '启用' },
    { value: '0', label: '停用' }
  ],
  isAvailableList: [
    { value: '1', label: '启用' },
    { value: '2', label: '关闭' }
  ]
}

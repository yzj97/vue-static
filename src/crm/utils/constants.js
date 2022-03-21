export default {
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
  socialAccountIndingList: [
    {
      value: 1,
      label: 'QQ'
    },
    {
      value: 2,
      label: '微信'
    }
  ],
  subscribeList: [
    {
      value: 0,
      label: '未关注'
    },
    {
      value: 1,
      label: '已关注'
    }
  ]
}

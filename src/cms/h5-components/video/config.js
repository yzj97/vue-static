export default {
  code: 'video',
  name: '视频',
  groupName: 'common',
  model: {
    customName: null, // 栏目名称
    use: [], // 栏目有效期 -- 和以前字段不一致之前是startDate 和 endDate
    videoInfo: {}, // 视频地址
    src: null // 上传封面
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
      label: '视频地址',
      prop: 'videoInfo',
      tag: 'cms-upload-video'
    },
    {
      label: '上传封面',
      prop: 'src',
      tag: 'cms-title-url'
    }
  ],
  rules: {
    customName: [
      { required: true, message: '请输入栏目名称', trigger: 'blur' }
    ]
  }
}

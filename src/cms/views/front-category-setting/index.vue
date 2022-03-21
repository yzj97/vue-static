<template>
  <div>
    <el-col :span="10" :offset="8">
      <el-card>
        <el-form
          ref="form"
          label-width="180px"
          label-position="right">
          <el-form-item v-for="item in channelList" :key="item.channelCode" :label="item.label + '：'">
            <el-select v-model="item.value" :placeholder="$t('请选择')" name="item_value">
              <el-option v-for="category in categoryList" :key="category.idStr" :label="category.name" :value="category.idStr"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <ody-button name="CmsFrontCategorySetting02_init" code="CmsFrontCategorySetting02" size="small" @click="init">{{ $t('重置') }}</ody-button>
          <ody-button name="CmsFrontCategorySetting01_handleSave" code="CmsFrontCategorySetting01" size="small" type="primary" @click="handleSave">{{ $t('保存') }}</ody-button>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'CmsFrontCategorySetting',
  data() {
    return {
      channelList: [
        {
          channelCode: '',
          channelName: '',
          value: '',
          key: ''
        }
      ],
      pageTypeList: [
      ],
      categorySettingList: [],
      categoryList: [
        {
          idStr: '',
          name: ''
        }
      ]
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      await this.initPageTypeList()
      await this.initChannel()
      this.initFrontCategory()
    },
    async initPageTypeList() {
      const vue = this
      const res = await vue.$cms.$api.common.listByCategorys({ categorys: ['MALL_TYPE'] })
      if (res.data) {
        this.pageTypeList = res.data.MALL_TYPE
      }
    },
    async initChannel() {
      const vue = this
      const res = await vue.$cms.$api.common.listChannel({
        filters: {
          onOrOffLine: '1',
          channelType: '1',
          channelMode: [
            'B2B',
            'BBC'
          ]
        }
      })

      if (res.data && res.data.length > 0) {
        const channelList = []
        vue.pageTypeList.map(page => {
          res.data.map(item => {
            item.value = ''
            item.key = item.channelCode + '.categorySettings.' + page.code
            item.label = page.name + ' ' + item.channelName
            channelList.push(vue.$portal.deepClone(item))
          })
        })
        vue.channelList = channelList
      }
    },
    async initFrontCategory() {
      const vue = this
      const params = []
      vue.channelList.map(item => {
        params.push(item.key)
      })

      const res = await vue.$cms.$api.common.listPageInfoConfig({ keyList: params })
      if (res.data && res.data.length > 0) {
        res.data.map(item => {
          if (item) {
            vue.channelList.map(channel => {
              if (item.key === channel.key) {
                channel.value = item.value
              }
            })
          }
        })
        vue.getFrontCategories()
      }
    },
    async getFrontCategories() {
      const res = await this.$cms.$api.common.getFrontCategories()
      this.categoryList = res.data
      const idList = []
      this.categoryList.map(item => {
        item.idStr = item.id.toString()
        idList.push(item.id.toString())
      })
      this.channelList.map(channel => {
        if (!contains(idList, channel.value)) {
          channel.value = ''
        }
      })
    },
    handleSave() {
      const vue = this
      const params = []
      vue.channelList.map(item => {
        params.push({
          key: item.key,
          value: item.value,
          note: this.$t('前台页面类目树设置，根据channelCode')
        })
      })
      vue.$cms.$api.common.batchSetConfig(params).then(res => {
        vue.$message.success(vue.$t('保存成功'))
        vue.init()
      })
    }
  }
}
function contains(list, o) {
  for (const item of list) {
    if (item === o) {
      return true
    }
  }
  return false
}
</script>

<style scoped>

</style>

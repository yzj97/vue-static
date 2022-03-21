<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <el-form-item :label="$t('页面ID:')" label-width="auto">
        <el-input v-model="search.id" :placeholder="$t('输入页面ID')" name="search_page_id" clearable/>
      </el-form-item>
      <el-form-item :label="$t('页面标题:')" label-width="auto">
        <el-input v-model="search.name" :placeholder="$t('输入页面标题')" name="search_page_title" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button name="handleSubmit" type="primary" size="small" @click="handleSubmit">{{ $t('查询') }}</el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrapper">
      <ody-table
        ref="table"
        :checked="checked"
        :page-size="10"
        :columns="table.columns"
        :highlight-current-row = "true"
        :can-filter="false"
        :response="convertResponse"
        max-height="290"
        row-key="id"
        request-page-type="page"
        request-url="/cms-web/cmsPage/listPage"
        @selection-change="handleSelectionChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    pageModel: {
      type: Object,
      default: () => {}
    },
    pageType: {
      type: String,
      default: ''
    },
    platForm: { // 平台 1:PC ,2:H5
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      search: {
        type: 3,
        status: 1,
        id: '',
        name: ''
      },
      table: {
        columns: [
          {
            label: this.$t('页面ID'),
            prop: 'id',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('页面标题'),
            show: true,
            minWidth: 120,
            prop: 'name'
          },
          {
            label: this.$t('渠道'),
            prop: 'channelStr',
            minWidth: 180,
            show: true
          }
        ]
      },
      checked: []
    }
  },
  computed: {

  },
  async mounted() {
    if (this.value.data) {
      this.initChecked(this.value)
    }
    await this.query()
  },
  methods: {
    initChecked(val) {
      const ItemId = val.data.split('=')[1]
      this.checked = [{ id: ItemId }]
    },
    handleSelectionChange(val) {
      this.checked = [val]
      const { name, id } = [val][0]
      let templink = '/promotion/index.html?id=' + id
      if (this.pageType === 18) {
        templink += '&pageType=18&canConversion=true'
      }
      const data = { status: true, type: this.$t('页面') + '|' + name, data: templink, appData: templink }
      this.$emit('input', data)
    },
    async handleSubmit() {
      await this.query()
    },
    async query() {
      const {
        ...params
      } = this.search
      params.platform = this.platForm
      params.channelList = this.pageModel.model.channelCodeList

      // 有值才传递
      return this.$refs.table.getList({ filters: this.formHasValue(params) })
    },
    convertResponse(res) {
      if (res.data && res.data.length > 0) {
        res.data.map(item => {
          if (item.channelList && item.channelList.length > 0) {
            let channelStr = ''
            item.channelList.map(c => {
              channelStr = channelStr + ',' + c.channelName
            })
            item.channelStr = channelStr.substring(1)
          }
        })
      }
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
.table-wrapper{
  padding: 0.15rem 0;
}
</style>

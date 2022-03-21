<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <el-form-item :label="$t('商品编码:')" label-width="auto">
        <el-input v-model="search.codes" :placeholder="$t('输入商品编码')" name="search_codes" clearable/>
      </el-form-item>
      <el-form-item :label="$t('商品关键字:')" label-width="auto">
        <el-input v-model="search.keyword" :placeholder="$t('输入商品关键字')" name="search_keyword" clearable/>
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
        max-height="290"
        row-key="mpId"
        request-url="/cms-web/cmsModule/selectionSearch2"
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
      default: '1'
    }

  },
  data() {
    return {
      search: {
        codes: '',
        keyword: ''
      },
      table: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品名称'),
            show: true,
            minWidth: 120,
            prop: 'mpName'
          },
          {
            label: this.$t('商品分类'),
            prop: 'categoryName',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('商品品牌'),
            prop: 'brandName',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('店铺'),
            prop: 'storeName',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('渠道'),
            prop: 'channel',
            minWidth: 120,
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
      this.checked = [{ mpId: ItemId }]
    },
    handleSelectionChange(val) {
      this.checked = [val]
      const { mpName, mpId } = [val][0]
      let templink = '/detail.html?itemId=' + mpId
      if (this.pageType === 18) {
        templink += '&pageType=18&canConversion=true'
      }
      const data = { status: true, type: this.$t('商品|') + mpName, data: templink, appData: templink }
      this.$emit('input', data)
    },
    async handleSubmit() {
      await this.query()
    },
    query() {
      const {
        ...params
      } = this.search
      params.channels = this.pageModel.model.channelCodeList
      params.mpFlag = 3
      params.pageType = this.pageType || 1
      if (this.pageModel.model.shopIdList) {
        params.storeIds = this.pageModel.model.shopIdList
      }
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    }
  }
}
</script>
<style lang="scss" scoped>
.table-wrapper{
  padding: 0.15rem 0;
}
</style>

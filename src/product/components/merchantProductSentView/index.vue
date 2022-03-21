<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :modal-append-to-body="false"
      :title="$t('查看分发')"
      width="40%"
      @open="init"
    >
      <ody-table
        ref="table"
        :multiple="false"
        :columns="table.columns"
        request-url="/back-product-web/back/mp/merchantProductDispatch/queryMerchantProductDispatchByPage.do"
      />
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="mini" @click="handleClose">{{ $t('cancel') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mpId: {
      type: Number,
      default: null
    }
  },
  data() {
    const vue = this
    return {
      queryParams: {
        mpId: null,
        dispatchType: 1
      },
      table: {
        columns: [
          {
            show: true,
            prop: 'storeName',
            label: this.$t('store_name'),
            align: 'center'
          },
          {
            show: true,
            prop: 'channelCode',
            label: this.$t('channel'),
            align: 'center',
            formatter(row, column) {
              const channel = vue.channelCodeMap[row.channelCode]
              if (channel) {
                return channel.channelName
              }
              return ''
            }
          }
        ]
      },
      channelCodeMap: {}
    }
  },

  methods: {
    async init() {
      await this.loadChannelList()
      this.$nextTick(async() => {
        await this.query()
      })
    },
    async loadChannelList() {
      const channel = await this.$product.$api.userApi.queryChannelMap({})
      if (channel && channel.data) {
        this.channelCodeMap = channel.data
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.queryParams = {
        mpId: null,
        dispatchType: 1
      }
    },
    async query() {
      if (this.mpId) {
        this.queryParams.mpId = this.mpId
        return this.$refs.table.getList(this.formHasValue(this.queryParams))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

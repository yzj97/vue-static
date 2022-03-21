<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
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
    platformMpId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      queryParams: {
        platformMpId: null,
        dispatchType: 0
      },
      table: {
        columns: [
          {
            show: true,
            prop: 'merchantName',
            label: this.$t('common_merchant_name'),
            align: 'center'
          },
          {
            show: true,
            prop: 'merchantCode',
            label: this.$t('common_merchant_code'),
            align: 'center'
          }
        ]
      }
    }
  },

  methods: {
    async init() {
      this.$nextTick(async() => {
        await this.query()
      })
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.queryParams = {
        platformMpId: null,
        dispatchType: 0
      }
    },
    async query() {
      if (this.platformMpId) {
        this.queryParams.platformMpId = this.platformMpId
        return this.$refs.table.getList(this.formHasValue(this.queryParams))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

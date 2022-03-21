<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :title="$t('添加商品映射')"
      width="60%"
      @open="init" >
      <section class="pg-editMapping">
        <ody-table
          :loading="loading"
          :data.sync="dataList"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
        />
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button :disabled="subminting" name="OdtsMpMapping_Save_handleOk" code="OdtsMpMapping_Save" size="small" type="primary" @click="handleOk()">{{ this.$t('确定') }}</ody-button>
      </span>
    </ody-dialog>
    <mp-item :visible.sync="mpDialogVisable" :merchant-map.sync="merchantMap" :store-map.sync="storeMap" :product.sync="selectedItem" :use-sku="true" @ok="checkedItem" />
  </div>
</template>

<script>
import MpItem from '@/components/mpMapping'
export default {
  components: {
    MpItem
  },
  props: {
    mainProd: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: null
    },
    merchantMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    storeMap: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const self = this
    return {
      prod: {},
      skuDataList: [],
      dataList: [],
      mpDialogVisable: false,
      columns: [
        {
          show: true,
          label: '类型',
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            return row.isMain ? '主品' : '子品'
          }
        },
        {
          show: true,
          label: '渠道商品',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let code
            let name
            let outerId
            if (params.row.isMain) {
              code = <div>{ '商品编码' }：{ params.row.itemId }</div>
              name = <div>{ '商品名称' }：{ params.row.itemName}</div>
            } else {
              code = <div>{ '商品编码' }：{ params.row.skuId }</div>
              name = <div>{ '商品名称' }：{ params.row.skuName}</div>
            }
            if (params.row.outerId) {
              outerId = <div>{ '外部商品编码' }：{ params.row.outerId }</div>
            }

            return (<div>
              { code }
              { name }
              { outerId }
            </div>)
          }
        },
        {
          show: true,
          label: '本地商品',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            const component = <div>
              <span>{ '商品编码' }：{ params.row.productCode }</span>
              <br/>
              <span>{ '商品名称' }：{ params.row.productCname }</span>
            </div>
            return (component)
          }
        }
      ],
      selectedItem: {},
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('匹配'),
            method: (index, row) => {
              self.showItemDialog(row)
            },
            hidden(index, row) {
              return (row.isMain && row.matchStatus === 3) || !row.isMain
            },
            code: 'ui'
          },
          {
            label: this.$t('选择'),
            method: (index, row) => {
              self.showItemDialog(row)
            },
            hidden(index, row) {
              return row.isMain || (!row.isMain && row.mpId)
            },
            code: 'ui'
          }
        ]
      },
      subminting: false
    }
  },
  methods: {
    showItemDialog(row) {
      this.selectedItem = row
      if (!row.isMain) {
        this.selectedItem.parentId = this.prod.storeMpId
        if (!this.prod.storeMpId) {
          this.$message({
            type: 'warning',
            message: '请选择主商品后再进行映射'
          })
          return
        }
      } else {
        this.selectedItem.hasSkuItem = (this.skuDataList.length > 0)
      }
      this.mpDialogVisable = true
    },
    async init() {
      this.prod = Object.assign({}, this.mainProd)
      this.prod.isMain = true
      await this.getItemSkuData()
    },
    async getItemSkuData() {
      const vue = this
      this.dataList = []
      this.skuDataList = []
      this.dataList.push(this.prod)

      await this.$odts.$api.odtsMp.listSku({
        filters: {
          channelItemId: vue.mainProd.id,
          channelCode: vue.mainProd.channelCode
        }
      }).then(result => {
        if (result.data && result.data.length > 0) {
          this.skuDataList = result.data
          this.skuDataList.forEach(element => {
            this.dataList.push(element)
          })
        }
      })
    },
    checkedItem(prodInfo) {
      this.selectedItem.mpId = prodInfo.mpId
      this.selectedItem.storeMpId = prodInfo.id
      this.selectedItem.productCode = prodInfo.code
      this.selectedItem.productCname = prodInfo.chineseName
      if (this.selectedItem.isMain) {
        for (var i in this.skuDataList) {
          const item = this.skuDataList[i]
          item.storeMpId = null
          item.mpId = null
          item.productCode = null
          item.productCname = null
        }
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      const vue = this
      const seriesProducts = []
      let matchSkuItem = false
      for (var i in this.skuDataList) {
        const item = this.skuDataList[i]
        const seriesProduct = {
          id: item.id,
          channelCode: item.channelCode,
          storeMpId: item.storeMpId,
          mpId: item.mpId,
          productCode: item.productCode,
          productCname: item.productCname
        }
        seriesProducts.push(seriesProduct)

        if (item.mpId) {
          matchSkuItem = true
        }
      }
      if (this.prod.mpId === null && this.prod.storeMpId === null) {
        this.$message({
          type: 'warning',
          message: '请选择主商品后再进行映射'
        })
        return
      }

      if (this.skuDataList.length !== 0 && !matchSkuItem) {
        this.$message({
          type: 'warning',
          message: '必须选一个子商品后再进行映射'
        })
        return
      }

      const condition = {
        id: this.prod.id,
        channelCode: this.prod.channelCode,
        storeMpId: this.prod.storeMpId,
        mpId: this.prod.mpId,
        productCode: this.prod.productCode,
        productCname: this.prod.productCname,
        channelSkus: seriesProducts
      }

      const promise = this.$odts.$api.odtsMp.updateChannelItemMapping
      vue.subminting = true
      promise(condition).then(res => {
        if (res.code === '0') {
          vue.$emit('update:visible', !vue.visible)
          vue.$emit('ok')
        }
      }).finally(r => {
        vue.subminting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <section>
    <ody-button name="oms1000101001_dialogVisible" code="OmsOrderList_Edit_Given" size="mini" @click="dialogVisible=true">{{ this.$t('edit') + this.$t('giveProduct') }}</ody-button>
    <ody-dialog-full-right
      :visible.sync="dialogVisible"
      :title="this.$t('edit') + this.$t('giveProduct')"
      @open="handleOpen">
      <div>
        <el-table :data="data" name="data952" style="width:100%">
          <el-table-column :label="this.$t('manual_order_product_name')" prop="productCname" min-width="200"/>
          <el-table-column :label="this.$t('manual_order_product_code')" prop="code" min-width="100"/>
          <el-table-column :label="this.$t('product_bar_code')" prop="barCode" min-width="100"/>
          <el-table-column :label="this.$t('manual_order_product_attr')" prop="extInfoStr" min-width="100"/>
          <el-table-column :label="this.$t('manual_order_quantity')" prop="productItemNum" min-width="120">
            <template slot-scope="scope">
              <el-input-number v-if="!scope.row.id" v-model="scope.row.productItemNum" :min="0" name="scope_row_productItemNum" size="small" style="width: 120px"/>
              <span v-if="scope.row.id">{{ scope.row.productItemNum }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="this.$t('common_operations')" fixed="right" min-width="50">
            <template slot-scope="scope">
              <el-button name="handleDel" type="text" size="small" @click="handleDel(scope.row,scope.$index)">{{ $t('delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-button name="showProductModal" type="primary" size="small" @click="showProductModal=true">{{ this.$t('common_append') + this.$t('giveProduct') }}</el-button>
      </div>
      <div slot="footer">
        <ody-button code="ui" name="save" size="small" type="primary" @click="save">{{ this.$t('common_save') }}</ody-button>
        <el-button name="close" size="small" @click="close">{{ this.$t('common_cancel') }}</el-button>
      </div>
    </ody-dialog-full-right>
    <productModal :is-gift-mode.sync="isGiftMode" :visible.sync="showProductModal" :form-data.sync="formData" :collect="collect" @ok="giveProductList"/>
  </section>
</template>

<script>
import ProductModal from '@/components/productModal'

export default {
  name: 'EditGiveProduct',
  components: {
    ProductModal
  },
  props: {
    soInfo: {
      type: Object,
      required: true
    },
    warehouseType: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      isGiftMode: true,
      data: [],
      waitDelete: [],
      showProductModal: false,
      formData: {},
      collect: {
        coinTypeMap: {},
        coinTypeSignMap: {}
      }
    }
  },
  methods: {
    async init() {
      this.waitDelete = []
      const result = await this.$oms.$api.soItem.orderSoItemListPage({
        limit: 1000000,
        page: 1,
        joinFields: ['productItemOutNum'],
        filters: {
          orderCode: this.soInfo.orderCode,
          productSaleType: 4 // 赠品
        }
      })
      this.data = result.data
    },
    giveProductList(item) {
      item = JSON.parse(JSON.stringify(item))

      if (item instanceof Array) {
        item.forEach(it => this.pushItem(it))
      } else {
        this.pushItem(item)
      }
    },
    pushItem(item) {
      let existed = false
      this.data.forEach(it => {
        if (item.mpId === it.mpId) {
          existed = true
        }
      })
      if (existed) { return }
      item.orderCode = this.soInfo.orderCode
      item.parentOrderCode = this.soInfo.parentOrderCode
      item.userId = this.soInfo.userId
      item.storeMpId = item.id
      item.id = null
      // 字段转换呀
      item.productCname = item.chineseName
      const attributes = []
      if (item.saleAttribute) {
        item.saleAttribute.split(';').forEach(it => {
          const d = it.split(':')
          attributes.push({
            name: d[0],
            value: d[1]
          })
        })
      }
      item.productPicPath = item.mainPictureUrl
      item.extInfoStr = item.saleAttribute
      item.extInfo = JSON.stringify({ attributeList: attributes })
      item.itemStatus = this.soInfo.orderStatus
      item.productItemNum = 1
      item.unit = item.mainUnitName
      item.wholeCategoryId = item.fullIdPath
      item.wholeCategoryName = item.fullNamePath
      item.productGrossWeight = item.grossWeight
      this.data.push(item)
    },
    handleDel(row, index) {
      this.data.splice(index, 1)
      if (row.id) {
        row.isDeleted = 1
        this.waitDelete.push(row)
      }
    },
    async save() {
      const params = [...this.data, ...this.waitDelete]

      if (params.length > 0) {
        await this.$oms.$api.so.editGiveProduct({
          soItemList: [...this.data, ...this.waitDelete]
        })
      }

      this.$emit('ok')
      this.close()
    },
    close() {
      this.waitDelete = []
      this.dialogVisible = false
    },
    handleOpen() {
      this.formData = {
        orderCode: this.soInfo.orderCode,
        orderSysSource: null,
        goodReceiverAreaCode: this.soInfo.goodReceiverAreaCode,
        merchantId: this.soInfo.merchantId,
        customerId: this.soInfo.customerId,
        coinType: null,
        storeId: this.soInfo.storeId,
        warehouseType: this.warehouseType
      }
      this.init()
    }
  }
}
</script>

<style scoped>

</style>

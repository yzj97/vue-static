<template>
  <div class="cp-product-batch-inventory-drawer">
    <batch-icon />
    <div class="cp-product-batch-inventory-drawer__text">
      {{ product.inventoryStockNum }}
      <batch-button class="cp-product-batch-inventory-drawer__btn" @click.native="handleDrawerOpen"/>
    </div>
    <ody-dialog-full-right
      ref="batchInventoryDialogFullRight"
      :visible.sync="drawerVisible"
      :close-tip="product.isEdit ? $t('取消会导致录入的页面信息丢失，确认取消？') : false"
      :append-to-body="true"
      :title="$t('商品批次盘点')"
      @open="handleDrawerOpened"
      @close="handleDrawerClosed"
    >
      <el-form ref="product" :inline="true" :disabled="!product.isEdit" :model="product" label-suffix=":">
        <el-form-item :label="$t('商品编码')">
          {{ product.productCode }}
        </el-form-item>
        <el-form-item :label="$t('商品名称')">
          {{ product.productCname }}
        </el-form-item>
        <el-form-item :label="$t('计量单位')">
          {{ product.productUnit }}
        </el-form-item>
        <div>
          <el-form-item>
            <el-table
              :data="product.temp_mpBatchVOS"
              style="width: 100%">
              <el-table-column
                :label="$t('Batchnumber')"
                prop="batchNo"
                width="180"/>
              <batch-attr-column :product="product" temp-name="temp_mpBatchVOS" />
              <el-table-column
                :label="$t('库存数量')"
                prop="stockNum"
                width="180"/>
              <el-table-column
                :label="$t('实盘数量')"
                width="180">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'temp_mpBatchVOS.' + scope.$index + '.inventoryStockNum'"
                    style="min-width: 200px; margin-bottom: 16px;"
                  >
                    <el-input-number
                      v-model="scope.row.inventoryStockNum"
                      :label="$t('描述文字')"
                      :min="0"
                      :step="1"
                      :step-strictly="true"
                      :precision="0"
                      size="mini"
                      @change="handleInventoryStockNumChange(scope.row)"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('盈亏数量')"
                prop="differStockNum"
                width="180">
                <template slot-scope="scope">
                  <span v-if="scope.row.differStockNum > 0" class="ying">+{{ scope.row.differStockNum }}</span>
                  <span v-else-if="scope.row.differStockNum < 0" class="kui">{{ scope.row.differStockNum }}</span>
                  <span v-else>{{ scope.row.differStockNum }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('操作')"
                fixed="right"
                width="100">
                <template v-if="!scope.row.batchNo" slot-scope="scope">
                  <el-popconfirm :title="$t('你确定要删除这行内容吗') + '?'" @onConfirm="handleBatchDelete(scope.row, scope.$index)" >
                    <el-button slot="reference" type="text" size="small" >
                      {{ $t('删除') }}
                    </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="small" style="margin-top: 20px;" @click="handleBatchAdd">{{ $t('新建批次') }}</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="handleDrawerClose">{{ $t('取消') }}</el-button>
        <ody-button v-if="product.isEdit" code="ui" type="primary" @click="handleDrawerSubmit">{{ $t('确定') }}</ody-button>
      </div>
    </ody-dialog-full-right>
  </div>
</template>

<script>
import BatchIcon from './batch-icon'
import BatchButton from './batch-button'
import BatchAttrColumn from './batch-attr-column'

export default {
  components: {
    BatchIcon,
    BatchButton,
    BatchAttrColumn
  },
  props: {
    product: {
      type: Object,
      default: () => ({
      })
    }
  },
  data() {
    return {
      drawerVisible: false
    }
  },
  async mounted() {
  },
  methods: {
    handleDrawerClosed() {
      this.product.temp_mpBatchVOS.forEach(x => {
        x.temp_batchAttrVisible = false
      })
    },
    async handleDrawerOpened() {
      let temp_mpBatchVOS
      if (this.product.mpBatchVOS && this.product.mpBatchVOS.length) {
        temp_mpBatchVOS = this.$portal.deepClone(this.product.mpBatchVOS)
      } else if (this.$portal.hasValue(this.product.inventoryStockNum)) {
        // 调用 陈吕接口
        temp_mpBatchVOS = await this.getBatchInventory()
      } else {
        // 调用 卓伟接口
        temp_mpBatchVOS = await this.getBatchStockList()
      }

      this.$set(this.product, 'temp_mpBatchVOS', temp_mpBatchVOS)
    },
    handleInventoryStockNumChange(row) {
      const hasInventoryStockNum = this.$portal.hasValue(row.inventoryStockNum)
      // 新增的没有batchNo
      if (!row.batchNo) {
        row.stockNum = ''
        row.differStockNum = hasInventoryStockNum ? row.inventoryStockNum : ''
        return
      }

      if (hasInventoryStockNum) {
        const differStockNum = row.inventoryStockNum - row.stockNum

        row.differStockNum = differStockNum
      } else {
        row.differStockNum = ''
      }
    },
    async getBatchStockList() {
      const { data = [] } = await this.$api.imBatchWarehouseRealStock.queryBatchStockList({
        merchantProductId: this.product.merchantProductId,
        warehouseId: this.product.warehouseId
      })

      return data.map(x => ({
        inventoryStockNum: undefined,
        differStockNum: undefined,
        inventoryCode: this.product.inventoryCode,
        ...x
      }))
    },
    async getBatchInventory() {
      const { data = [] } = await this.$api.imInventoryPlan.queryBatchInventory({
        inventoryCode: this.product.inventoryCode,
        merchantProductId: this.product.merchantProductId
      })

      return data.map(x => {
        // element-ui组件只有undefined 默认值为空
        if (x.inventoryStockNum === null) {
          x.inventoryStockNum = undefined
        }
        return x
      })
    },
    async handleBatchAdd() {
      this.product.temp_mpBatchVOS.push({
        batchNo: null,
        batchAttrs: [],
        temp_batchAttrs: [],
        stockNum: '',
        inventoryStockNum: undefined,
        differStockNum: undefined,
        inventoryCode: this.product.inventoryCode,
        merchantProductId: this.product.merchantProductId
      })
    },
    handleBatchDelete(row, index) {
      this.product.temp_mpBatchVOS.splice(index, 1)
    },
    handleDrawerOpen() {
      this.drawerVisible = true
    },
    handleDrawerClose() {
      this.$refs.batchInventoryDialogFullRight.closeDialog()
      // this.drawerVisible = false
    },
    async handleDrawerSubmit() {
      const [err] = await this.formValidate('product')

      if (err) {
        return
      }

      // 删除临时数据
      const mpBatchVOS = this.product.temp_mpBatchVOS.map((item) => {
        const rtv = {}

        Object.keys(item).forEach(key => {
          if (!/^temp_/.test(key)) {
            rtv[key] = item[key]
          }
        })

        return rtv
      }).filter(x => {
        // 过滤掉新建，并且没有输入收货库存
        if (!x.batchNo && this.$portal.isEmpty(x.inventoryStockNum)) {
          return false
        }

        return true
      })
      this.product.mpBatchVOS = mpBatchVOS

      // 统计整体数量
      const inventoryStockNum = mpBatchVOS.reduce((totalPrice, item) => {
        let inventoryStockNum = item.inventoryStockNum

        if (this.$portal.isEmpty(inventoryStockNum)) {
          inventoryStockNum = item.stockNum || 0
        }

        return totalPrice + (+inventoryStockNum)
      }, 0)
      this.product.inventoryStockNum = inventoryStockNum

      // 删除临时数据
      delete this.product.temp_mpBatchVOS
      // console.log('this.product', this.product)
      this.$emit('ok', this.product)
      // this.handleDrawerClose()
      this.drawerVisible = false
    }
  }
}
</script>

<style>
  .ying {
    color: green;
  }
  .kui {
    color: red;
  }
</style>
<style lang="scss" scoped>
.cp-product-batch-inventory-drawer {
  position: relative;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  &__text {
    position: relative;
    display: inline-block;
  }
  &__btn {
    display: inline-block;
    position: absolute;
    margin-top: -15px;
  }
}
</style>

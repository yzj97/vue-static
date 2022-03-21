<template>
  <div class="cp-product-batch-receive-drawer">
    <batch-icon />
    <div class="cp-product-batch-receive-drawer__text">
      {{ product.receiveNum }}
      <batch-button class="cp-product-batch-receive-drawer__btn" @click.native="handleDrawerOpen" />
    </div>
    <ody-dialog-full-right
      ref="batchReceiveDialogFullRight"
      :close-tip="product.isRecord ? false : $t('取消会导致录入的页面信息丢失，确认取消？')"
      :visible.sync="drawerVisible"
      :append-to-body="true"
      :title="$t('商品批次收货')"
      @open="handleDrawerOpened"
      @close="handleDrawerClosed"
    >
      <el-form ref="product" :inline="true" :model="product" label-suffix=":">
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
              :data="product.temp_batchInfo"
              style="width: 100%">
              <el-table-column
                :label="$t('Batchnumber')"
                prop="batchNo"
                width="180"/>
              <batch-attr-column :product="product" temp-name="temp_batchInfo" />
              <el-table-column
                :label="$t('本次收货数量')"
                width="180">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'temp_batchInfo.' + scope.$index + '.receiveNum'"
                    :rules="{ required: true, message: $t('收货数量不能为空'), trigger: 'blur' }"
                    style="min-width: 200px; margin-bottom: 16px;"
                  >
                    <el-input-number
                      v-model="scope.row.receiveNum"
                      :step="1"
                      :step-strictly="true"
                      :min="1"
                      :precision="0"
                      :label="$t('描述文字')"
                      :disabled="product.isRecord"
                      size="mini"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('操作')"
                fixed="right"
                width="100">
                <template v-if="!product.isRecord" slot-scope="scope">
                  <el-popconfirm :title="$t('你确定要删除这行内容吗')" @onConfirm="handleBatchDelete(scope.row, scope.$index)" >
                    <el-button slot="reference" type="text" size="small" >
                      {{ $t('删除') }}
                    </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-button v-if="!product.isRecord" type="primary" size="small" style="margin-top: 20px;" @click="handleBatchAdd">{{ $t('新建批次') }}</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="handleDrawerClose">{{ $t('取消') }}</el-button>
        <ody-button code="ui" type="primary" @click="handleDrawerSubmit">{{ $t('确定') }}</ody-button>
      </div>
    </ody-dialog-full-right>
  </div>
</template>

<script>
import BatchIcon from '../product-batch-inventory-drawer/batch-icon'
import BatchButton from '../product-batch-inventory-drawer/batch-button'
import BatchAttrColumn from '../product-batch-inventory-drawer/batch-attr-column'

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
      this.product.temp_batchInfo.forEach(x => {
        x.temp_batchAttrVisible = false
      })
    },
    async handleDrawerOpened() {
      let temp_batchInfo

      if (this.product.batchInfo && this.product.batchInfo.length) {
        temp_batchInfo = this.$portal.deepClone(this.product.batchInfo)
      } else if (this.product.isRecord) {
        // 调用 晓烨接口
        temp_batchInfo = await this.getReceiveRecordBatchInfo()
      } else {
        // 没有赋值空对象
        temp_batchInfo = []
      }

      this.$set(this.product, 'temp_batchInfo', temp_batchInfo)
    },
    async getReceiveRecordBatchInfo() {
      if (this.product.isTask) {
        const { data: { batchInfo = [] }} = await this.$api.receiveRecordItem.listMpDetails({
          id: this.product.id
        })

        return batchInfo.map(x => {
          x.batchAttrs = JSON.parse(x.batchAttrs || '[]')
          return x
        })
      } else {
        const { data: { batchInfo = [] }} = await this.$api.receiveRecordItem.getMpDetail({
          id: this.product.id
        })

        return batchInfo.map(x => {
          x.batchAttrs = JSON.parse(x.batchAttrs || '[]')
          return x
        })
      }
    },
    async handleBatchAdd() {
      this.product.temp_batchInfo.push({
        batchNo: null,
        batchAttrs: [],
        temp_batchAttrs: [],
        receiveNum: undefined
      })
    },
    handleBatchDelete(row, index) {
      this.product.temp_batchInfo.splice(index, 1)
    },
    handleDrawerOpen() {
      this.drawerVisible = true
    },
    handleDrawerClose() {
      this.$refs.batchReceiveDialogFullRight.closeDialog()
      // this.drawerVisible = false
    },
    async handleDrawerSubmit() {
      const [err] = await this.formValidate('product')

      if (err) {
        return
      }

      // 删除临时数据
      const batchInfo = this.product.temp_batchInfo.map((item) => {
        const rtv = {}

        Object.keys(item).forEach(key => {
          if (!/^temp_/.test(key)) {
            rtv[key] = item[key]
          }
        })

        return rtv
      })
      this.product.batchInfo = batchInfo

      // 统计整体数量
      const receiveNum = batchInfo.reduce((totalPrice, item) => totalPrice + (+item.receiveNum), 0)
      this.product.receiveNum = receiveNum

      // 删除临时数据
      delete this.product.temp_batchInfo
      this.$emit('ok', this.product)
      // this.handleDrawerClose()
      this.drawerVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.cp-product-batch-receive-drawer {
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

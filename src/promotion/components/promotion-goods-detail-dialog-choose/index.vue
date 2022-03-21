<template>
  <div>
    <ody-dialog
      v-if="visible"
      :visible.sync="visible"
      :title="$t('商品组详情')"
      width="960px"
      @close="handleClose"
      @submit="handleSubmit"
    >
      <ody-list-search-area>
        <div slot="content">
          <el-form
            ref="queryProductByRule"
            :model="queryProductByRule"
            label-width="100px"
            class="form"
          >
            <ody-search-item :label="$t('商品编码')" prop="obj.mpCode">
              <el-input
                v-model="queryProductByRule.obj.mpCode"
                name="queryProductByRule_obj_mpCode"
              />
            </ody-search-item>
            <ody-search-item :label="$t('商品名称')" prop="obj.mpName">
              <el-input
                v-model="queryProductByRule.obj.mpName"
                name="queryProductByRule_obj_mpName"
              />
            </ody-search-item>
            <el-button
              class="margin20"
              size="small"
              type="primary"
              @click.prevent="handleQuery"
            >{{ $t('查询') }}</el-button>
          </el-form>
        </div>
      </ody-list-search-area>

      <ody-title v-if="!isEdit" :title="$t('批量设置')" />
      <ody-list-search-area v-if="!isEdit">
        <div slot="content">
          <el-form ref="batchConfig" :model="batchConfig" label-width="80px" class="form">
            <ody-search-item :label="$t('套餐价')" prop="promPrice">
              <el-input v-model="batchConfig.promPrice" name="batchConfig_promPrice" />
            </ody-search-item>
            <ody-search-item :label="$t('商家单渠道限购')" prop="channelMerchantLimit">
              <el-input
                v-model="batchConfig.channelMerchantLimit"
                name="batchConfig_channelMerchantLimit"
              />
            </ody-search-item>
            <ody-search-item :label="$t('店铺单渠道限购')" prop="channelStoreLimit">
              <el-input
                v-model="batchConfig.channelStoreLimit"
                name="batchConfig_channelStoreLimit"
              />
            </ody-search-item>
            <ody-search-item :label="$t('个人单渠道限购')" prop="channelIndividualLimit">
              <el-input
                v-model="batchConfig.channelIndividualLimit"
                name="batchConfig_channelIndividualLimit"
              />
            </ody-search-item>
            <el-button
              name="handleBatchSave"
              class="margin20"
              size="small"
              type="primary"
              @click="handleBatchSave"
            >{{ $t('保存') }}</el-button>
          </el-form>
        </div>
      </ody-list-search-area>

      <ody-table
        ref="mpTable"
        :columns="mpTable.columns"
        :operates="mpTable.operates"
        :multiple="true"
        :default-expand-all="false"
        :request-url="mpTable.requestUrl"
        :is-tree="true"
        :tree-props="treeProps"
        :can-filter="false"
        :load="loadChildren"
        :selectable="selectable"
        :response="mpTableResponse"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <template slot="promPriceSlot">
          <ody-tip-star :content="$t('套餐价')" />
        </template>
        <template slot="channelMerchantLimitSlot">
          <ody-tip-star :content="$t('商家单渠道限购')" />
        </template>
        <template slot="channelStoreLimitSlot">
          <ody-tip-star :content="$t('店铺单渠道限购')" />
        </template>
        <template slot="channelIndividualLimitSlot">
          <ody-tip-star :content="$t('个人单渠道限购')" />
        </template>
        <template slot="promPrice" slot-scope="scope">
          <ody-input-number
            :empty-tip="true"
            :min="0.01"
            :max="Math.max(scope.row.salePrice - 0.01, 0.01)"
            :decimal="2"
            v-model="scope.row.promPrice"
            :disabled="isEdit"
            name="scope_row_promPrice"
            @input.self="updatePriceAndLimit(scope.row, 'promPrice')"
          />
        </template>
        <template v-if="!scope.row.disable" slot="channelMerchantLimit" slot-scope="scope">
          <ody-input-number
            :empty-tip="false"
            :min="1"
            :max="1000000000"
            :disabled="isEdit"
            v-model="scope.row.channelMerchantLimit"
            name="scope_row_channelMerchantLimit"
            @input.self="updatePriceAndLimit(scope.row, 'channelMerchantLimit')"
          />
        </template>
        <template v-if="!scope.row.disable" slot="channelStoreLimit" slot-scope="scope">
          <ody-input-number
            :empty-tip="false"
            :min="1"
            :max="1000000000"
            :disabled="isEdit"
            v-model="scope.row.channelStoreLimit"
            name="scope_row_channelStoreLimit"
            @input.self="updatePriceAndLimit(scope.row, 'channelStoreLimit')"
          />
        </template>
        <template v-if="!scope.row.disable" slot="channelIndividualLimit" slot-scope="scope">
          <ody-input-number
            :empty-tip="false"
            :min="1"
            :max="1000000000"
            :disabled="isEdit"
            v-model="scope.row.channelIndividualLimit"
            name="scope_row_channelIndividualLimit"
            @input.self="updatePriceAndLimit(scope.row, 'channelIndividualLimit')"
          />
        </template>
      </ody-table>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
        <el-button
          name="handleSaveSelectedGifts"
          size="small"
          type="primary"
          @click="handleSaveSelectedGifts"
        >{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    chooseKey: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    },
    promotionId: {
      type: String,
      default: ''
    },
    promotionRuleId: {
      type: String,
      default: null
    },
    contentType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeProps: {
        rootVal: '0',
        parentKey: 'parentId',
        hasChildren: 'hasChildren',
        children: 'childMpList'
      },
      queryProductByRule: {
        obj: {
          mpCode: null,
          mpName: null,
          promotionRuleId: this.promotionRuleId,
          // promotionId: this.promotionId,
          activityId: +this.promotionId
        }
      },
      batchConfig: {
        promPrice: null,
        channelMerchantLimit: null,
        channelStoreLimit: null,
        channelIndividualLimit: null
      },
      mpTable: {
        requestUrl:
            '/back-promotion-web/promotionActivityRead/querySelectionProductList.do',
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true,
            minWidth: 250
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('零售价（元）'),
            prop: 'salePrice',
            show: true,
            minWidth: 120
          },
          {
            // label: this.$t('套餐价'),
            labelSlot: 'promPriceSlot',
            slot: 'promPrice',
            show: true,
            minWidth: 120
          },
          {
            // label: this.$t('商家单渠道限购'),
            labelSlot: 'channelMerchantLimitSlot',
            slot: 'channelMerchantLimit',
            show: true,
            minWidth: 180
          },
          {
            // label: this.$t('店铺单渠道限购'),
            labelSlot: 'channelStoreLimitSlot',
            slot: 'channelStoreLimit',
            show: true,
            minWidth: 180
          },
          {
            // label: this.$t('个人单渠道限购'),
            labelSlot: 'channelIndividualLimitSlot',
            slot: 'channelIndividualLimit',
            show: true,
            minWidth: 180
          }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteSelectionProduct([row])
              },
              hidden: (index, row) => {
                return row.disable
              },
              disabled: (index, row) => {
                return this.isEdit
              },
              code: 'ui'
            }
          ]
        },
        data: []
      }
    }
  },
  computed: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.$nextTick(async() => {
      await this.querySelectionProductList()
    })
  },
  methods: {
    handleQuery() {
      this.querySelectionProductList()
    },
    checkData(batch) {
      const checkResult = {
        flg: true,
        errMsg: ''
      }

      if (+batch.channelStoreLimit > +batch.channelMerchantLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '店铺单渠道限购数应小于商家单渠道限购数，请重新填写'
        )
      }

      if (
        +batch.channelIndividualLimit > +this.batchConfig.channelMerchantLimit
      ) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '个人单渠道限购数应小于商家单渠道限购数，请重新填写'
        )
      }

      if (+batch.channelIndividualLimit > +this.batchConfig.channelStoreLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '个人单渠道限购数应小于店铺单渠道限购数，请重新填写'
        )
      }

      if (+batch.orderLimit > +this.batchConfig.channelMerchantLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '订单限购数应小于商家单渠道限购数，请重新填写'
        )
      }

      if (+batch.orderLimit > +this.batchConfig.channelStoreLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '订单限购数应小于店铺单渠道限购数，请重新填写'
        )
      }

      if (!checkResult.flg) {
        this.$message({
          type: 'error',
          message: checkResult.errMsg
        })
      }

      return checkResult.flg
    },
    async handleBatchSave() {
      if (this.checkedProductList.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要修改的商品')
        })
        return
      }
      const flag = this.checkData(this.batchConfig)
      const _promPrice = parseFloat(this.batchConfig.promPrice)
      let flag_price = true
      if (_promPrice !== 0.01) {
        this.checkedProductList.forEach(item => {
          if (_promPrice > (item.salePrice - 0.01) || _promPrice < 0.01) { flag_price = false }
        })
      }

      if (!flag) {
        return
      }
      if (!flag_price) {
        this.$message({
          type: 'error',
          message: this.$t('请输入正确的套餐价')
        })
        return
      }

      // this.checkedProductList.forEach(async item => {
      //   let key
      //   for (key in this.batchConfig) {
      //     if (Object.prototype.hasOwnProperty.call(this.batchConfig, key)) {
      //       const itemVal = this.batchConfig[key]
      //       await this.updatePriceAndLimit(item, key, itemVal)
      //     }
      //   }
      // })

      this.$nextTick(async() => {
        const params = this.checkedProductList
          .filter(item => !item.childMpList)
          .map(x => {
            return {
              channelIndividualLimit: this.batchConfig.channelIndividualLimit,
              channelMerchantLimit: this.batchConfig.channelMerchantLimit,
              channelStoreLimit: this.batchConfig.channelStoreLimit,
              contentType: this.contentType,
              id: x.id,
              promotionRuleId: this.promotionRuleId,
              individualLimit: x.individualLimit,
              mpId: x.mpId,
              mpName: x.mpName,
              orderLimit: x.orderLimit,
              promPrice: this.batchConfig.promPrice,
              promotionId: x.promotionId,
              totalLimit: x.totalLimit,
              typeOfProduct: x.typeOfProduct
            }
          })
        await this.promotionAPI.updatePriceAndLimit(params)
        await this.querySelectionProductList()
      })
    },
    checkBlurData(row, type) {
      console.log('row', row, type)
      const limitList = ['channelMerchantLimit', 'channelStoreLimit', 'channelIndividualLimit', 'orderLimit']
      const limitNameList = ['商家单渠道限购数', '店铺单渠道限购数', '个人单渠道限购数', '订单限购数']
      const limitIndex = limitList.indexOf(type)

      if (type === 'promType') {
        if (!+row['promType']) {
          this.$message({
            type: 'error',
            message: `不能为空`
          })
          return false
        }
      } else if (type === 'promPrice') {
        if (row.promPrice === '') {
          this.$message({
            type: 'error',
            message: `套餐价不能为空`
          })
          return false
        }
      } else if (type === 'channelMerchantLimit') {
        if (row.channelMerchantLimit === '') {
          this.$message({
            type: 'error',
            message: `商家单渠道不能为空`
          })
          return false
        }
      } else if (type === 'channelStoreLimit') {
        if (row.channelStoreLimit === '') {
          this.$message({
            type: 'error',
            message: `店铺单渠道不能为空`
          })
          return false
        }
      } else if (type === 'channelIndividualLimit') {
        if (row.channelIndividualLimit === '') {
          this.$message({
            type: 'error',
            message: `个人单渠道不能为空`
          })
          return false
        }
      } else if (limitIndex >= 0) {
        const errMsg = util.compareArr([
          +row.channelMerchantLimit,
          +row.channelStoreLimit,
          +row.channelIndividualLimit,
          +row.orderLimit
        ], limitIndex)

        if (errMsg) {
          this.$message({
            type: 'warning',
            message: this.$t(errMsg.replace(/\$(\d+)/g, ($0, $1) => limitNameList[$1]))
          })

          this.$nextTick(() => {
            row[type] = ''
          })
          return false
        }

        return true
      }
    },
    async updatePriceAndLimit(row, type, val) {
      // 异步执行，让控件校验走在该方法前边
      await Promise.resolve()
      /* if (this.checkBlurData(row, type) === false) {
          return
        }
  */
      let rowList = []
      let params = []
      if (row.childMpList && row.hasChildren) {
        row.childMpList.forEach(j => {
          // 对于中间的处理
          if (val && type === 'promPrice') {
            j[type] = val
          } else {
            j[type] = row[type]
          }
        })
      }
      if (row.childMpList && !row.hasChildren) {
        if (val) {
          row[type] = val
        }

        row.childMpList.forEach(x => {
          if (val) {
            x[type] = val
          } else {
            x[type] = row[type]
          }
          // 对于最高等级的处理
          if (x.childMpList) {
            x.childMpList.map(j => {
              if (val && type === 'promPrice') {
                j[type] = val
              } else {
                j[type] = row[type]
              }
            })
          }
        })
        rowList = row.childMpList
      } else if (!row.disable) {
        let parent = []
        if (this.checkedProductList.length) {
          parent =
              this.checkedProductList.find(item => {
                return item.id === row.parentId
              }) || []
        } else {
          parent =
              this.mpTable.data.find(item => {
                return item.id === row.parentId
              }) || []
        }

        if (val) {
          parent[type] = val
        } else {
          parent[type] = row[type]
        }
        rowList = [row]
      } else {
        rowList = [row]
      }

      params = rowList.map(x => {
        return {
          channelIndividualLimit: x.channelIndividualLimit,
          channelMerchantLimit: x.channelMerchantLimit,
          channelStoreLimit: x.channelStoreLimit,
          contentType: this.contentType,
          id: x.id,
          promotionRuleId: this.promotionRuleId,
          individualLimit: x.individualLimit,
          mpId: x.mpId,
          mpName: x.mpName,
          promPrice: x.promPrice,
          promotionId: x.promotionId,
          totalLimit: x.totalLimit,
          typeOfProduct: x.typeOfProduct
        }
      })
      if (!val) {
        await this.promotionAPI.updatePriceAndLimit(params)
      }
    },
    handleSaveSelectedGifts() {
      const params = {
        promotionId: this.promotionId,
        promRuleId: this.promotionRuleId
      }
      this.promotionAPI.confirmPriceAndLimit(params).then(res => {
        if (res.code === '0') {
          this.handleClose()
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
      /*      let canClose = true
        const params = {
          currentPage: 1,
          itemsPerPage: 10000000,
          obj: this.formHasValue({
            ...this.queryProductByRule.obj
          })
        }
        this.promotionAPI.querySelectionProListMethod(params).then(res => {
          const { listObj } = res.data
          for (let i = 0; i < listObj.length; i++) {
            const { childMpList, mpName } = listObj[i] || {}

            const promPrice = childMpList[0].promPrice || listObj[i].promPrice
            const channelMerchantLimit = childMpList[0].channelMerchantLimit || listObj[i].channelMerchantLimit
            const channelStoreLimit = childMpList[0].channelStoreLimit || listObj[i].channelStoreLimit
            const channelIndividualLimit = childMpList[0].channelIndividualLimit || listObj[i].channelIndividualLimit
            if (promPrice === null || channelMerchantLimit === null || channelStoreLimit == null || channelIndividualLimit === null) {
              this.$message({
                type: 'warning',
                message: this.$t('请检验必填数据')
              })
              canClose = false
              break
            }
            if (Number(channelIndividualLimit) > Number(channelStoreLimit)) {
              this.$message({
                type: 'warning',
                message: mpName + this.$t('个人单渠道限购不能大于店铺单渠道限购')
              })
              canClose = false
              return
            }
            if (Number(channelIndividualLimit) > Number(channelMerchantLimit)) {
              this.$message({
                type: 'warning',
                message: mpName + this.$t('个人单渠道限购不能大于商家单渠道限购')
              })
              canClose = false
              return
            }
            if (Number(channelStoreLimit) > Number(channelMerchantLimit)) {
              this.$message({
                type: 'warning',
                message: mpName + this.$t('店铺单渠道限购不能大于商家单渠道限购')
              })
              canClose = false
              return
            }
          }
          if (canClose === true) {
            this.handleClose()
          }
        })*/
    },
    async deleteSelectionProduct(row) {
      if (row.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要删除的商品')
        })
        return
      }

      const res = await this.$confirm(this.$t('确定删除吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })

      if (!res) {
        return
      }

      const ids = row
        .map(x => {
          if (x.typeOfProduct === 1000) {
            return x.childMpList[0].id
          }
          return x.id
        })

      await this.promotionAPI.deleteSelectionProduct({
        ids: [...new Set(ids)]
      })
      await this.querySelectionProductList()
    },
    async querySelectionProductList() {
      await this.$refs.mpTable.getList({
        obj: this.formHasValue({
          ...this.queryProductByRule.obj
        })
      })
    },
    handleSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },
    mpTableResponse(res) {
      const {
        data: { listObj }
      } = res
      const listData = listObj || []
      listData.forEach(x => {
        x.id = x.mpId
        const merchantProductList = x.childMpList
        merchantProductList &&
          merchantProductList.forEach(y => {
            x.salePrice = y.salePrice
            x.channelIndividualLimit = y.channelIndividualLimit
            x.channelMerchantLimit = y.channelMerchantLimit
            x.channelStoreLimit = y.channelStoreLimit
            x.promPrice = y.promPrice
            // 如果是系列品
            if (y.typeOfProduct === 3) {
              y.hasChildren = true
            }
          })
      })

      return res
    },
    async loadChildren(tree, treeNode, resolve) {
      const params = {
        mpId: treeNode.mpId,
        promotionId: this.promotionId
      }
      const res = await this.promotionAPI.getPromotionChildMpSelectedList(
        params
      )
      res.data && res.data.forEach(item => {
        item.disable = true
      })
      resolve(res.data)
    },
    selectable(row, index) {
      return !row.disable
    },
    searchFormat(params) {
      return {
        obj: params
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    handleSubmit(val) {
      this.$emit('ok', val)
      this.$emit('update:selected', val)
      this.handleClose()
    },
    changeInput(node) {
      this.choose.searchValue.categoryIds = node
    }
  }
}
</script>
<style lang="less" scoped>
  .margin20 {
    margin-left: 20px;
  }
  .box {
    max-height: none !important;
  }
  .cp-tree-select {
    width: 200px;
    display: inline-block;
  }
</style>

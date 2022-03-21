<template>
  <div class="bg-promotion-single-set-product">
    <div class="activity-merchant">
      <div>
        <ody-tip-star :content="$t('设置活动商品')" />
        <el-button
          name="goodsVisible"
          size="small"
          type="primary"
          @click="goodsVisible = true"
        >{{ append ? $t('添加追加商品'):$t('添加活动商品') }}</el-button>
        <el-button
          v-if="selectFlag === '2'"
          name="reAddPromotionScope"
          size="small"
          class="batch-delete"
          @click="reAddPromotionScope(checkedMutexProductList)"
        >{{ $t('批量重新添加') }}</el-button>
        <el-button
          v-if="selectFlag === '1'"
          name="deleteSelectionProduct"
          size="small"
          class="batch-delete"
          @click="deleteSelectionProduct(checkedProductList)"
        >{{ $t('批量删除') }}</el-button>
        <el-button
          v-if="selectFlag === '1'"
          name="handleShowSearch"
          size="small"
          class="batch-delete"
          @click="handleShowSearch"
        >{{ $t('搜索') }}</el-button>
      </div>

      <div class="search-wrap">
        <el-button
          name="importVisible"
          size="small"
          plain
          @click="importVisible = true"
        >{{ $t('批量导入') }}</el-button>
      </div>
    </div>

    <ody-list-search-area v-if="searchShow && selectFlag === '1'">
      <div slot="content">
        <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
          <ody-search-item :label="$t('商家')" prop="obj.merchantId" name="obj.merchantId">
            <promotion-merchant-select
              v-model="mpSearch.obj.merchantId"
              :search=" {
                merchantType: merchantType,
                promotionId: promotionId } "
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')" prop="obj.mpCode" name="obj.mpCode">
            <el-input v-model="mpSearch.obj.mpCode" name="mpSearch_obj_mpCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')" prop="obj.mpName" name="obj.mpName">
            <el-input v-model="mpSearch.obj.mpName" name="mpSearch_obj_mpName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品条码')" prop="obj.barcode" name="obj.barcode">
            <el-input v-model="mpSearch.obj.barcode" name="mpSearch_obj_barcode" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <el-button size="small" type="primary" @click.prevent="query('effect')">{{ $t('查询') }}</el-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="selectFlag" name="selectFlag" @tab-click="handleTabChange">
          <el-tab-pane :label="`${$t('生效商品')}(${mpTableListTotal})`" name="1">
            <div>
              <ody-table
                ref="mpTable"
                :columns="mpTable.columns"
                :operates="mpTable.operates"
                :multiple="true"
                :default-expand-all="false"
                :request-url="mpTable.requestUrl"
                :response="mpTableResponse"
                :is-tree="true"
                :tree-props="treeProps"
                :can-filter="false"
                :load="loadChildren"
                :selectable="selectable"
                row-key="id"
                @getTableListTotal="getMpTableListTotal"
                @getTableList="getMpTableList"
                @selection-change="handleSelectionChange"
              >
                <template slot="promPrice" slot-scope="scope">
                  <el-input
                    v-model="scope.row.promPrice"
                    name="scope_row_promPrice"
                    @blur="updatePriceAndLimit(scope.row, 'promPrice')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="channelMerchantLimit" slot-scope="scope">
                  <ody-input-number
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.channelMerchantLimit"
                    name="scope_row_channelMerchantLimit"
                    @blur="updatePriceAndLimit(scope.row, 'channelMerchantLimit')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="channelStoreLimit" slot-scope="scope">
                  <ody-input-number
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.channelStoreLimit"
                    name="scope_row_channelStoreLimit"
                    @blur="updatePriceAndLimit(scope.row, 'channelStoreLimit')"
                  />
                </template>
                <template
                  v-if="!scope.row.disable"
                  slot="channelIndividualLimit"
                  slot-scope="scope"
                >
                  <ody-input-number
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.channelIndividualLimit"
                    name="scope_row_channelIndividualLimit"
                    @blur="updatePriceAndLimit(scope.row, 'channelIndividualLimit')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="orderLimit" slot-scope="scope">
                  <ody-input-number
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.orderLimit"
                    name="scope_row_orderLimit"
                    @blur="updatePriceAndLimit(scope.row, 'orderLimit')"
                  />
                </template>
              </ody-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`${$t('互斥商品')}(${mutexTableListTotal})`" name="2">
            <div>
              <ody-table
                ref="mutexTable"
                :columns="mutexTable.columns"
                :operates="mutexTable.operates"
                :multiple="true"
                :default-expand-all="false"
                :request-url="mutexTable.requestUrl"
                :is-tree="true"
                :tree-props="treeProps"
                :response="mutexTableResponse"
                :can-filter="false"
                :load="loadChildren"
                :selectable="selectableMutex"
                row-key="id"
                @getTableListTotal="getMutexTableListTotal"
                @selection-change="handleMutexSelectionChange"
              >
                <template slot="exclusiveRecordingTime" slot-scope="scope">
                  <span
                    v-if="!!scope.row.exclusiveRecordingTime"
                  >{{ scope.row.exclusiveRecordingTime | parseTime }}</span>
                </template>
              </ody-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </ody-list-table-area>

    <promotion-batch-import-product-model
      :visible.sync="importVisible"
      :activity-id="promotionId"
      :prom-type="promType"
      @close="handleImportClose"
    />

    <promotion-goods-dialog-choose
      v-if="goodsVisible"
      :visible.sync="goodsVisible"
      :multiple="true"
      :prom-type="promType"
      :params="searchParams"
      choose-key="mpId"
      @ok="ok"
    />

    <promotion-mutex-goods-look
      v-if="visibleMutex"
      :scope-id="scopeItemId"
      :prom-type="promType"
      :visible.sync="visibleMutex"
    />
  </div>
</template>

<script>
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
import PromotionBatchImportProductModel from '@/components/promotion-batch-import-product-model'
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'
import PromotionMutexGoodsLook from '@/components/promotion-mutex-goods-look'

import util from '@/utils/util'

export default {
  components: {
    PromotionMerchantSelect,
    PromotionBatchImportProductModel,
    PromotionGoodsDialogChoose,
    PromotionMutexGoodsLook
  },
  props: {
    append: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'text'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scopeItemId: '',
      visibleMutex: false,
      useAppendList: [],
      mpTableListTotal: '',
      mutexTableListTotal: '',
      searchParams: {
        merchantType: '',
        promType: this.promType,
        promotionId: this.promotionId,
        searchType: 1,
        sellType: 1,
        storeIds: [],
        categoryType: '1',
        brandType: '1'
      },
      goodsVisible: false,
      batchEdit: false,
      importVisible: false,
      searchShow: false,
      selectFlag: '1',
      treeProps: {
        rootVal: '0',
        parentKey: 'parentId',
        hasChildren: 'hasChildren',
        children: 'childMpList'
      },
      mpSearch: {
        obj: {
          merchantId: undefined,
          mpCode: undefined,
          mpName: undefined,
          barcode: undefined,
          activityId: this.promotionId,
          isMutexList: [0]
        }
      },
      mpTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('原价（元）'),
            prop: 'salePrice',
            align: 'center',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                // console.log('delete-id', row.id)
                this.deleteSelectionProduct([row])
              },
              disabled: (index, row) => {
                return this.append && row.isAvailable === 1
              },
              code: 'button023'
            }
          ]
        },
        data: [],
        requestUrl:
          '/back-promotion-web/promotionActivityRead/querySelectionProductList.do'
      },
      mutexSearch: {
        obj: {
          merchantId: undefined,
          mpCode: undefined,
          mpName: undefined,
          barcode: undefined,
          activityId: this.promotionId,
          isMutexList: [-1]
        }
      },
      mutexTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('互斥记录时间'),
            slot: 'exclusiveRecordingTime',
            align: 'center',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 120,
          fixed: 'right',
          list: [
            {
              label: this.$t('查看更多'),
              method: (index, row) => {
                this.viewMutexGoods(row)
              },
              hidden: (index, row) => {
                return !!row.childMpList
                // const show = row.hasChildren && !row.isLast
                // return !show
              },
              code: 'button020'
            },
            {
              label: this.$t('重新添加'),
              method: (index, row) => {
                this.reAddPromotionScope([row])
              },
              hidden: (index, row) => {
                const show = !row.isLast
                return !show
              },
              disabled: (index, row) => {
                return this.append
              },
              code: 'button024'
            }]
        },
        requestUrl:
          '/back-promotion-web/promotionActivityRead/querySelectionProductList.do'
      },
      batchConfig: {
        promPrice: '',
        channelMerchantLimit: '',
        channelStoreLimit: '',
        channelIndividualLimit: '',
        orderLimit: ''
      },
      promotionAPI: null,
      contentType: '',
      merchantType: '',
      checkedProductList: [],
      checkedMutexProductList: []
    }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPromotionActivityDetail()

    this.$nextTick(async() => {
      await this.query('effect')
      await this.query('mutex')
    })
  },
  methods: {
    getMutexTableListTotal(total) {
      this.mutexTableListTotal = total
    },
    getMpTableListTotal(total) {
      this.mpTableListTotal = total
    },
    mutexTableResponse(res) {
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
            // 如果是系列品
            if (y.typeOfProduct === 3) {
              y.hasChildren = true
            }
          })
      })
      return res
    },
    mpTableResponse(res) {
      const {
        data: { listObj }
      } = res
      const listData = listObj || []
      this.useAppendList = this.$portal.deepClone(listData)
      listData.forEach(x => {
        x.id = x.mpId
        const merchantProductList = x.childMpList
        merchantProductList &&
          merchantProductList.forEach(y => {
            x.channelIndividualLimit = y.channelIndividualLimit
            x.channelMerchantLimit = y.channelMerchantLimit
            x.channelStoreLimit = y.channelStoreLimit
            x.orderLimit = y.orderLimit
            x.salePrice = y.salePrice
            // 如果是系列品
            if (y.typeOfProduct === 3) {
              y.hasChildren = true
            }
            y.agentList &&
              y.agentList.forEach(item => {
                if (!util.isEmpty(item.contentValue)) {
                  if (this.contentType === 1 || this.contentType === 3) {
                    x.promPrice = +item.contentValue / 100
                    y.promPrice = +item.contentValue / 100
                  } else if (this.contentType === 2) {
                    x.promPrice = +item.contentValue / 10
                    y.promPrice = +item.contentValue / 10
                  }
                }
              })
          })
      })

      // console.log('res', res)
      // debugger

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
      // 樹形展開懶加載 有的個人單渠道限購要除以或者乘以
      res.data && res.data.forEach(item => {
        item.isLast = true
        item.disable = true
      })

      resolve(res.data)
    },
    selectable(row, index) {
      return !row.disable && !(this.append && row.isAvailable === 1)
    },
    selectableMutex(row, index) {
      return !row.disable && !(this.append && row.isAvailable === 1)
    },
    getMpTableList(list) {
      this.mpTable.data = list || []
    },
    cancel() {
      this.goodsVisible = false
    },
    async ok(val) {
      const querySelectionProductList = val.map(item => {
        return {
          activityId: this.promotionId,
          barcode: item.barcode,
          contentType: this.contentType,
          id: item.mpId,
          isAvailable: this.append ? 0 : 1,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          mpCode: item.mpCode,
          mpName: item.mpName,
          productId: item.productId,
          promotionType: this.promType,
          typeOfProduct: item.typeOfProduct,
          scopeType: item.scopeType
        }
      })

      const params = {
        isCommonPrice: true,
        querySelectionProductList: querySelectionProductList,
        selectionType: 1
      }
      await this.saveSelectionProduct(params)
    },
    async saveSelectionProduct(params) {
      const { code } = await this.promotionAPI.saveSelectionProduct(params)
      if (code === '0') {
        await this.query('effect')
        await this.query('mutex')
      }
    },
    async handleImportClose(val) {
      await this.query('effect')
      await this.query('mutex')
    },
    async handleReset() {
      this.formReset('mpSearch')
      await this.query('effect')
    },
    async query(type) {
      await this.querySelectionProductList(type)
    },
    handleSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },
    handleMutexSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedMutexProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },
    viewMutexGoods(row) {
      this.scopeItemId = row.id
      this.visibleMutex = true
    },
    async reAddPromotionScope(row) {
      if (row.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要重新添加的商品')
        })
        return
      }
      const ids = []
      row.forEach(x => {
        if (x.childMpList) {
          ids.push(x.childMpList[0].id)
        } else {
          if (!ids.includes(x.id)) {
            ids.push(x.id)
          }
        }
      })
      const querySelectionProductList = []
      row.forEach(x => {
        if (x.childMpList) {
          querySelectionProductList.push({
            activityId: this.promotionId,
            barcode: x.childMpList[0].barcode,
            id: x.childMpList[0].mpId,
            contentType: this.contentType,
            isAvailable: 1,
            merchantId: x.childMpList[0].merchantId,
            merchantName: x.childMpList[0].merchantName,
            mpCode: x.childMpList[0].mpCode,
            mpId: x.childMpList[0].mpId,
            mpName: x.childMpList[0].mpName,
            scopeType: x.childMpList[0].scopeType,
            productId: x.childMpList[0].productId,
            promotionType: this.promType,
            typeOfProduct: x.childMpList[0].typeOfProduct,
            deliveryTimeString: null,
            preSellEndTime: null,
            preSellStartTime: null
          })
        } else {
          if (
            querySelectionProductList.findIndex(y => x.mpId === y.id) === -1
          ) {
            querySelectionProductList.push({
              activityId: this.promotionId,
              barcode: x.barcode,
              id: x.mpId,
              contentType: this.contentType,
              isAvailable: 1,
              merchantId: x.merchantId,
              merchantName: x.merchantName,
              mpCode: x.mpCode,
              mpId: x.mpId,
              mpName: x.mpName,
              scopeType: x.scopeType,
              productId: x.productId,
              promotionType: this.promType,
              typeOfProduct: x.typeOfProduct,
              deliveryTimeString: null,
              preSellEndTime: null,
              preSellStartTime: null
            })
          }
        }
      })
      const res = await this.promotionAPI.reAddPromotionScope({
        ids: ids,
        promType: this.promType,
        querySelectionProductList: querySelectionProductList
      })
      if (res.code === '0') {
        await this.querySelectionProductList('effect')
        await this.querySelectionProductList('mutex')
        this.$message({
          message: this.$t('重新添加成功'),
          type: 'success'
        })
      }
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
      await this.querySelectionProductList('effect')
      await this.querySelectionProductList('mutex')
    },
    checkBlurData(row, type) {
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
      if (this.checkBlurData(row, type) === false) {
        return
      }
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
          if (type === 'promPrice') {
            x.agentList.forEach(item => {
              // item.contentValue = x[type]
              if (this.contentType === 1 || this.contentType === 3) {
                if (val) {
                  item.contentValue = +val * 100
                } else {
                  item.contentValue = +x[type] * 100
                }
              } else if (this.contentType === 2) {
                if (val) {
                  item.contentValue = +val * 10
                } else {
                  item.contentValue = +x[type] * 10
                }
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
        if (type === 'promPrice') {
          row.agentList.forEach(item => {
            item.contentValue = row[type]
            if (this.contentType === 1 || this.contentType === 3) {
              item.contentValue = +row[type] * 100
              if (val) {
                item.contentValue = +val * 100
              } else {
                item.contentValue = +row[type] * 100
              }
            } else if (this.contentType === 2) {
              if (val) {
                item.contentValue = +val * 10
              } else {
                item.contentValue = +row[type] * 10
              }
            }
          })
        }
        rowList = [row]
      } else {
        if (type === 'promPrice') {
          row.agentList.forEach(item => {
            item.contentValue = row[type]
            if (this.contentType === 1 || this.contentType === 3) {
              item.contentValue = +row[type] * 100
              if (val) {
                item.contentValue = +val * 100
              } else {
                item.contentValue = +row[type] * 100
              }
            } else if (this.contentType === 2) {
              if (val) {
                item.contentValue = +val * 10
              } else {
                item.contentValue = +row[type] * 10
              }
            }
          })
        }
        rowList = [row]
      }

      params = rowList.map(x => {
        return {
          agentList: x.agentList,
          channelIndividualLimit: x.channelIndividualLimit,
          channelMerchantLimit: x.channelMerchantLimit,
          channelStoreLimit: x.channelStoreLimit,
          contentType: x.contentType,
          id: x.id,
          individualLimit: x.individualLimit,
          mpId: x.mpId,
          mpName: x.mpName,
          orderLimit: x.orderLimit,
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
    async handleTabChange(val) {
      this.selectFlag = val.name
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }

      const { data = {}, code } = await this.promotionAPI.getPromotionDetailUrl(
        params
      )

      if (code === '0') {
        this.contentType = data.promotionMethod
        this.merchantType = data.merchantType
        this.searchParams.merchantType = data.merchantType
        this.searchParams.promType = data.frontPormotionType
      }
    },
    // type : 'effect' 生效商品， 'mutex' 互斥商品
    async querySelectionProductList(type) {
      if (type === 'effect') {
        this.$refs.mpTable.getList(this.mpSearch)
      } else {
        this.$refs.mutexTable.getList(this.mutexSearch)
      }
    },
    handleShowEdit() {
      this.batchEdit = !this.batchEdit
      if (this.searchShow) {
        this.searchShow = !this.searchShow
      }
    },
    handleShowSearch() {
      this.searchShow = !this.searchShow
      if (this.batchEdit) {
        this.batchEdit = !this.batchEdit
      }
    },
    isCanSave() {
      return new Promise((resolve, reject) => {
        var params = {
          obj: {
            activityId: this.promotionId
          },
          currentPage: 0,
          itemsPerPage: 10
        }
        this.promotionAPI.querySelectionProListMethod(params).then(res => {
          resolve(res)
        })
      })
    },
    async appendSave() {
      const params = {
        activityId: this.promotionId,
        promType: this.promType
      }
      const { code } = await this.promotionAPI.appendPromotionMps(params)
      if (code === '0') {
        this.$message({
          message: this.$t('追加商品成功'),
          type: 'success'
        })
        await this.query('effect')
        await this.query('mutex')
      }
    },
    getUseAppendList() {
      return this.useAppendList
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-promotion-single-set-product {
  padding: 20px 10px 10px 10px;

  .activity-merchant {
    margin-bottom: 20px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .search-wrap {
      display: flex;

      .batch-delete {
        margin-left: 10px;
      }

      /deep/ .el-input-group__prepend {
        width: 120px;
        background-color: #fff;
      }

      /deep/ .el-input-group__append {
        padding: 0;
        background-color: #fff;

        /deep/ .el-button--default:hover,
        .el-button--default:focus {
          background: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
      }
    }
  }
}
</style>

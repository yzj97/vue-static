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
        >{{ $t('添加活动商品') }}</el-button>
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
        <el-button
          v-if="selectFlag === '1'"
          name="handleShowEdit"
          size="small"
          class="batch-delete"
          @click="handleShowEdit"
        >{{ $t('批量编辑') }}</el-button>
      </div>
    </div>

    <ody-list-search-area v-if="batchEdit">
      <div slot="content">
        <el-form ref="batchConfig" :rules="rules" :model="batchConfig" label-width="100px" class="form">
          <ody-search-item :label="$t('已预订数量')" prop="bookNum" name="bookNum">
            <ody-input-number
              :empty-tip="false"
              :min="1"
              :max="1000000000"
              v-model="batchConfig.bookNum"
              name="batchConfig_bookNum" />
          </ody-search-item>
          <ody-search-item :label="$t('预售价')" prop="presellTotalPrice" name="presellTotalPrice">
            <ody-input-number
              :empty-tip="false"
              :decimal="2"
              :min="0.01"
              :max="99999999.99"
              v-model="batchConfig.presellTotalPrice"
              name="batchConfig_presellTotalPrice" />
          </ody-search-item>
          <ody-search-item :label="$t('定金')" prop="presellDownPrice" name="presellDownPrice">
            <ody-input-number
              :empty-tip="false"
              :decimal="2"
              :min="0.01"
              :max="99999999.99"
              v-model="batchConfig.presellDownPrice"
              name="batchConfig_presellDownPrice" />
          </ody-search-item>
          <ody-search-item :label="$t('定金抵扣金额')" prop="presellOffsetPrice" name="presellOffsetPrice">
            <ody-input-number
              :empty-tip="false"
              :decimal="2"
              :min="0.01"
              :max="99999999.99"
              v-model="batchConfig.presellOffsetPrice"
              name="batchConfig_presellOffsetPrice"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商家单渠道限购')" prop="channelMerchantLimit" name="channelMerchantLimit">
            <ody-input-number
              :empty-tip="false"
              :min="1"
              :max="1000000000"
              v-model="batchConfig.channelMerchantLimit"
              name="batchConfig_channelMerchantLimit"
            />
          </ody-search-item>
          <ody-search-item :label="$t('个人单渠道限购')" prop="channelIndividualLimit" name="channelIndividualLimit" >
            <ody-input-number
              :empty-tip="false"
              :min="1"
              :max="1000000000"
              v-model="batchConfig.channelIndividualLimit"
              name="batchConfig_channelIndividualLimit"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button
          name="ui"
          code="ui"
          size="small"
          type="primary"
          @click.prevent="handleBatchSave">
          {{ $t('保存') }}
        </ody-button>
      </div>
    </ody-list-search-area>

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
                :checked.sync="checkedProductList"
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
              >
                <template slot="priceLabel">
                  <ody-tip-star :content="$t('预售价')" />
                </template>
                <template slot="presellDownPriceLabel">
                  <ody-tip-star :content="$t('定金')" />
                </template>
                <template slot="presellOffsetPriceLabel">
                  <ody-tip-star :content="$t('定金抵扣金额')" />
                </template>
                <template v-if="!scope.row.disable" slot="bookNum" slot-scope="scope" maxLength="10">
                  <ody-input-number
                    v-model="scope.row.bookNum"
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    name="scope_row_bookNum"
                    @focus="scope.row._bookNum = scope.row.bookNum;"
                    @blur.self="updatePriceAndLimit(scope.row, 'bookNum')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="presellTotalPrice" slot-scope="scope" :rule="ruleInput" maxLength="7">
                  <ody-input-number
                    :empty-tip="false"
                    :decimal="2"
                    :min="0.01"
                    :max="99999999.99"
                    v-model="scope.row.presellTotalPrice"
                    name="scope_row_presellTotalPrice"
                    @focus="scope.row._presellTotalPrice = scope.row.presellTotalPrice;"
                    @blur.self="updatePriceAndLimit(scope.row, 'presellTotalPrice')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="presellDownPrice" slot-scope="scope">
                  <ody-input-number
                    :empty-tip="false"
                    :decimal="2"
                    :min="0.01"
                    :max="99999999.99"
                    v-model="scope.row.presellDownPrice"
                    name="scope_row_presellDownPrice"
                    @focus="scope.row._presellDownPrice = scope.row.presellDownPrice;"
                    @blur.self="updatePriceAndLimit(scope.row, 'presellDownPrice')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="presellOffsetPrice" slot-scope="scope">
                  <ody-input-number
                    :empty-tip="false"
                    :decimal="2"
                    :min="0.01"
                    :max="99999999.99"
                    v-model="scope.row.presellOffsetPrice"
                    name="scope_row_presellOffsetPrice"
                    @focus="scope.row._presellOffsetPrice = scope.row.presellOffsetPrice;"
                    @blur.self="updatePriceAndLimit(scope.row, 'presellOffsetPrice')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="channelMerchantLimit" slot-scope="scope" maxLength="10">
                  <ody-input-number
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.channelMerchantLimit"
                    name="scope_row_channelMerchantLimit"
                    @focus="scope.row._channelMerchantLimit = scope.row.channelMerchantLimit;"
                    @blur.self="updatePriceAndLimit(scope.row, 'channelMerchantLimit')"
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
                    @focus="scope.row._channelIndividualLimit = scope.row.channelIndividualLimit;"
                    @blur.self="updatePriceAndLimit(scope.row, 'channelIndividualLimit')"
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
                :response="mutexTableResponse"
                :is-tree="true"
                :tree-props="treeProps"
                :can-filter="false"
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
      ruleInput: {
        presellTotalPrice: [
          { required: true, validator: this.validatePresellTotalPrice }
        ]
      },
      // 表单验证
      rules: {
        bookNum: [
          { min: 1, max: 9999, message: '长度在 1 到 9999 个字符', trigger: 'change' }
        ],
        presellTotalPrice: [
          { required: true, message: '定金必须小于预售价', trigger: 'blur' }
        ],
        presellDownPrice: [
          { required: true, validator: this.validatePresellDownPrice }
        ],
        presellOffsetPrice: [
          { required: true, validator: this.validatePresellOffsetPrice }
        ]
      },
      scopeItemId: '',
      visibleMutex: false,
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
          merchantId: '',
          mpCode: '',
          mpName: '',
          barcode: '',
          activityId: this.promotionId,
          isMutexList: [0]
        }
      },
      mpTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            minWidth: 250, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            minWidth: 200, show: true
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            minWidth: 130, show: true
          },
          {
            label: this.$t('原价（元）'),
            prop: 'salePrice',
            minWidth: 120, show: true,
            formatter: (row, column, cellValue) => {
              if (row.childMpList && row.childMpList.length > 0) {
                return row.childMpList[0].salePrice
              } else {
                return row.salePrice
              }
            }
          },
          {
            label: this.$t('已预订数量'),
            slot: 'bookNum',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'priceLabel',
            slot: 'presellTotalPrice',
            minWidth: 120,
            show: true
          },
          {
            labelSlot: 'presellDownPriceLabel',
            slot: 'presellDownPrice',
            minWidth: 120, show: true
          },
          {
            // label: this.$t('定金抵扣金额'),
            labelSlot: 'presellOffsetPriceLabel',
            slot: 'presellOffsetPrice',
            minWidth: 140, show: true
          },
          {
            label: this.$t('商家单渠道限购'),
            slot: 'channelMerchantLimit',
            minWidth: 120, show: true
          },
          //   {
          //     label: this.$t('店铺单渠道限购'),
          //     slot: 'channelStoreLimit',
          //     width: 120
          //   },
          {
            label: this.$t('个人单渠道限购'),
            slot: 'channelIndividualLimit',
            minWidth: 120, show: true
          }
          //   {
          //     label: this.$t('订单限购'),
          //     slot: 'orderLimit',
          //     width: 120
          //   }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                // var list = row.childMpList
                // debugger
                // this.deleteSelectionProduct(list)

                this.deleteSelectionProduct([row])
              },
              code: 'button024'
            }
          ]
        },
        data: [],
        requestUrl:
          '/back-promotion-web/promotionActivityRead/querySelectionProductList.do'
      },
      mutexSearch: {
        obj: {
          merchantId: '',
          mpCode: '',
          mpName: '',
          barcode: '',
          activityId: this.promotionId,
          isMutexList: [-1]
        }
      },
      mutexTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            minWidth: 250, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            minWidth: 200, show: true
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            minWidth: 200, show: true
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            minWidth: 220, show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            minWidth: 220, show: true
          },
          {
            label: this.$t('互斥记录时间'),
            minWidth: 250, show: true,
            slot: 'exclusiveRecordingTime'
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('重新添加'),
              method: (index, row) => {
                this.reAddPromotionScope([row])
              },
              code: 'button025'
            },
            {
              label: this.$t('查看更多'),
              method: (index, row) => {
                this.viewMutexGoods(row)
              },
              hidden: (index, row) => {
                return !!row.childMpList
              },
              code: 'button020'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/promotionActivityRead/querySelectionProductList.do'
      },
      batchConfig: {
        channelMerchantLimit: '',
        channelIndividualLimit: '',
        bookNum: '', // 已预订数量
        presellTotalPrice: '', // 预售价
        presellDownPrice: '', // 定金
        presellOffsetPrice: '' // 定金抵扣金额
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
    validatePresellTotalPrice(rule, value, callback) {
      if (value < this.mpTable.presellDownPrice) {
        callback('定金要小于预售价')
      } else {
        callback()
      }
    },
    validatePresellDownPrice(rule, value, callback) {
      if (value > this.batchConfig.presellTotalPrice) {
        callback('定金要小于预售价')
      } else {
        callback()
      }
    },
    validatePresellOffsetPrice(rule, value, callback) {
      if (value > this.batchConfig.presellTotalPrice) {
        callback('定金抵扣金额要小于预售价')
      } else {
        callback()
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
      }
    },
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
      listData.forEach(x => {
        x.id = x.mpId
        const merchantProductList = x.childMpList
        merchantProductList &&
          merchantProductList.forEach(y => {
            // console.log('y', y)
            x.channelMerchantLimit = y.channelMerchantLimit
            x.channelIndividualLimit = y.channelIndividualLimit
            // 如果是系列品
            if (y.typeOfProduct === 3) {
              y.hasChildren = true
            }
            y.agentList && y.agentList.forEach(z => {
              x.bookNum = z.bookNum
              x.presellTotalPrice = z.presellTotalPrice
              x.presellDownPrice = z.presellDownPrice
              x.presellOffsetPrice = z.presellOffsetPrice

              y.bookNum = z.bookNum
              y.presellTotalPrice = z.presellTotalPrice
              y.presellDownPrice = z.presellDownPrice
              y.presellOffsetPrice = z.presellOffsetPrice
            })
          })
      })

      console.log('new-res', res)

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
          deliveryTimeString: this.deliveryTimeString,
          preSellEndTime: this.preSellEndTime,
          preSellStartTime: this.preSellStartTime,
          isAvailable: 1,
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
        +batch.channelIndividualLimit > +batch.channelMerchantLimit
      ) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '个人单渠道限购数应小于商家单渠道限购数，请重新填写'
        )
      }

      if (+batch.channelIndividualLimit > +batch.channelStoreLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '个人单渠道限购数应小于店铺单渠道限购数，请重新填写'
        )
      }

      if (+batch.orderLimit > +batch.channelMerchantLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '订单限购数应小于商家单渠道限购数，请重新填写'
        )
      }

      if (+batch.orderLimit > +batch.channelStoreLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '订单限购数应小于店铺单渠道限购数，请重新填写'
        )
      }

      if (+batch.orderLimit > +batch.channelIndividualLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '订单限购数应小于个人单渠道限购数，请重新填写'
        )
      }

      if (+batch.orderLimit > +batch.channelIndividualLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '订单限购数应小于个人单渠道限购数，请重新填写'
        )
      }

      if (+batch.presellDownPrice > +batch.presellTotalPrice) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '定金应小于预售价，请重新填写'
        )
      }

      if (+batch.presellOffsetPrice > +batch.presellTotalPrice) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '定金抵扣金额应小于预售价，请重新填写'
        )
      }

      if (+batch.presellDownPrice > +batch.presellOffsetPrice) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '定金抵扣金额应大于定金，请重新填写'
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

      if (!flag) {
        return
      }

      const params = this.checkedProductList
        .filter(x => x.typeOfProduct !== 1000)
        .map(x => ({
          // 后端接口不能多传递值，不然有各种问题
          agentList: [{
            'currenAgenttId': null,
            'currentAgentName': null,
            'targetAgentId': 0,
            'targetAgentName': null,
            'fromLevel': null,
            'toLevel': null,
            'leastNum': null,
            'leastMoney': null,
            'checkedNum': false,
            'checkedMoney': false,
            'contentValueBatch': null,
            'contentValue': null,
            'presellTotalPrice': this.batchConfig.presellTotalPrice || x.presellTotalPrice || null,
            'presellDownPrice': this.batchConfig.presellDownPrice || x.presellDownPrice || null,
            'presellOffsetPrice': this.batchConfig.presellOffsetPrice || x.presellOffsetPrice || null,
            'bookNum': this.batchConfig.bookNum || x.bookNum || null,
            'totalLimit': null,
            'individualLimit': null,
            'typeOfProduct': null,
            'channelMerchantLimit': null,
            'channelStoreLimit': null,
            'channelIndividualLimit': null,
            'orderLimit': null
          }],
          'channelIndividualLimit': this.batchConfig.channelIndividualLimit || x.channelIndividualLimit || null,
          'channelMerchantLimit': this.batchConfig.channelMerchantLimit || x.channelMerchantLimit || null,
          contentType: this.contentType,
          'id': x.id,
          'mpId': x.mpId,
          'mpName': x.mpName,
          promotionId: x.promotionId,
          'typeOfProduct': x.typeOfProduct
        }))

      await this.promotionAPI.updatePriceAndLimit(params)
      await this.query('effect')
      this.checkedProductList = []
    },
    async handleReset() {
      this.formReset('mpSearch')
      // await this.query('effect')
    },
    async query(type) {
      await this.querySelectionProductList(type)
    },
    handleMutexSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedMutexProductList = val.filter(item => {
          return item.isChecked
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
    // 预售只有商家单渠道限购数 和 个人单渠道限购数
    checkBlurData(row, type) {
      const limitList = ['channelMerchantLimit', 'channelIndividualLimit']
      const limitNameList = ['商家单渠道限购数', '个人单渠道限购数']
      const limitIndex = limitList.indexOf(type)

      const limit2List = ['presellTotalPrice', 'presellOffsetPrice', 'presellDownPrice']
      const limit2NameList = ['预售价', '定金抵扣金额', '定金']
      const limit2Index = limit2List.indexOf(type)

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
          +row.channelIndividualLimit
        ], limitIndex)

        if (errMsg) {
          this.$message({
            type: 'warning',
            message: this.$t(errMsg.replace(/\$(\d+)/g, ($0, $1) => limitNameList[$1]))
          })

          row[type] = row['_' + type]

          return false
        }
      } else if (limit2Index >= 0) {
        const errMsg = util.compareArr([
          +row.presellTotalPrice,
          +row.presellOffsetPrice,
          +row.presellDownPrice
        ], limit2Index, true)

        if (errMsg) {
          this.$message({
            type: 'warning',
            message: this.$t(errMsg.replace(/\$(\d+)/g, ($0, $1) => limit2NameList[$1]))
          })

          row[type] = row['_' + type]

          return false
        }
      }
      return true
    },
    async updatePriceAndLimit(row, type, val) {
      await Promise.resolve()
      if (this.checkBlurData(row, type) === false) {
        return
      }
      let newRow

      if (row.typeOfProduct === 1000) {
        newRow = row.childMpList[0]
        // js更新子和孙子
        this.$refs.mpTable.tableData
          .filter(x => (x.parentId === row.id || x.parentId === newRow.id))
          .forEach(tableRow => {
            tableRow[type] = row[type]
          })
      } else if (!row.disable) {
        newRow = row
        // js更新子和父
        this.$refs.mpTable.tableData
          .filter(x => (x.parentId === row.id || x.id === row.parentId))
          .forEach(tableRow => {
            tableRow[type] = row[type]
          })
      } else {
        newRow = row
      }

      const params = [newRow]
        .map(x => ({
          'id': x.id,
          'mpId': x.mpId,
          'typeOfProduct': x.typeOfProduct,
          'mpName': x.mpName,
          'promotionId': x.promotionId,
          'promPrice': x.promPrice,
          'channelMerchantLimit': x.channelMerchantLimit,
          'channelIndividualLimit': x.channelIndividualLimit,
          'contentType': this.contentType,
          agentList: [{
            'currenAgenttId': null,
            'currentAgentName': null,
            'targetAgentId': 0,
            'targetAgentName': null,
            'fromLevel': null,
            'toLevel': null,
            'leastNum': null,
            'leastMoney': null,
            'checkedNum': false,
            'checkedMoney': false,
            'contentValueBatch': null,
            'contentValue': null,
            'presellTotalPrice': x.presellTotalPrice,
            'presellDownPrice': x.presellDownPrice,
            'presellOffsetPrice': x.presellOffsetPrice,
            'bookNum': x.bookNum,
            'totalLimit': null,
            'individualLimit': null,
            'typeOfProduct': null,
            'channelMerchantLimit': null,
            'channelStoreLimit': null,
            'channelIndividualLimit': null,
            'orderLimit': null
          }]
        }))

      // console.log('params', params)
      await this.promotionAPI.updatePriceAndLimit(params)
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
        this.deliveryTimeString = data.deliveryTimeString
        this.preSellEndTime = data.preSellEndTime
        this.preSellStartTime = data.preSellStartTime
        this.promotionType = data.promotionType
        this.promotionMethod = data.promotionMethod
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
        const params = {
          promotionMethod: this.promType,
          id: this.promotionId,
          isCommonPrice: true
        }
        this.promotionAPI.promotionPriceCheck(params).then(res => {
          resolve(res)
        })
      })
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

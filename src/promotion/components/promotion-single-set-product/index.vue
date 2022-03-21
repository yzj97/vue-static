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
        <el-form ref="batchConfig" :model="batchConfig" :rules="batchConfigRules" label-width="200px" class="form">
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item :label="getLabelName" prop="promPrice" name="promPrice">
                <ody-input-number
                  v-if="contentType === 2"
                  :empty-tip="false"
                  :min="0.1"
                  :max="9.9"
                  :decimal="1"
                  v-model="batchConfig.promPrice"
                  name="batchConfig_promPrice"
                />
                <ody-input-number
                  v-else
                  :empty-tip="false"
                  :decimal="2"
                  :min="0.01"
                  :max="99999999.99"
                  v-model="batchConfig.promPrice"
                  name="batchConfig_promPrice7"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item :label="$t('商家单渠道限购')" prop="channelMerchantLimit" name="channelMerchantLimit">
                <ody-input-number
                  :empty-tip="false"
                  :min="1"
                  :max="1000000000"
                  v-model="batchConfig.channelMerchantLimit"
                  name="batchConfig_channelMerchantLimit"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item :label="$t('店铺单渠道限购')" prop="channelStoreLimit" name="channelStoreLimit">
                <ody-input-number
                  :empty-tip="false"
                  :min="1"
                  :max="1000000000"
                  v-model="batchConfig.channelStoreLimit"
                  name="batchConfig_channelStoreLimit"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item :label="$t('个人单渠道限购')" prop="channelIndividualLimit" name="channelIndividualLimit">
                <ody-input-number
                  :empty-tip="false"
                  :min="1"
                  :max="1000000000"
                  v-model="batchConfig.channelIndividualLimit"
                  name="batchConfig_channelIndividualLimit"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item :label="$t('订单限购')" prop="orderLimit" nmae="orderLimit">
                <ody-input-number
                  :empty-tip="false"
                  :min="1"
                  :max="1000000000"
                  v-model="batchConfig.orderLimit"
                  name="batchConfig_orderLimit"
                />
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
      <div slot="btn">
        <ody-button
          name="ui_handleBatchSave"
          code="ui"
          size="small"
          type="primary"
          @click="handleBatchSave">
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
              :search="{
                merchantType: merchantType,
                promotionId: promotionId
              }"
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
                <template slot="promPrice" slot-scope="scope">
                  <ody-input-number
                    v-if="contentType === 2"
                    :disabled="append && scope.row.isAvailable === 1"
                    :min="0.1"
                    :max="9.9"
                    :decimal="1"
                    v-model="scope.row.promPrice"
                    name="scope_row_promPrice"
                    @blur="updatePriceAndLimit(scope.row, 'promPrice')"
                  />
                  <ody-input-number
                    v-else
                    :disabled="append && scope.row.isAvailable === 1"
                    :decimal="2"
                    :min="0.01"
                    :max="99999999.99"
                    v-model="scope.row.promPrice"
                    onkeyup="value = value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                    name="scope_row_promPrice2"
                    @blur="updatePriceAndLimit(scope.row, 'promPrice')"
                  />
                </template>
                <template slot="salePriceLabel">
                  <el-tooltip
                    :content="$t('商品零售价仅供参考，与实际售卖价会有出入')"
                    class="item"
                    effect="dark"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  <span>{{ $t('零售价(元)') }}</span>
                </template>
                <template slot="priceLabel">
                  <div>
                    <ody-tip-star :content="getLabelName" />
                  </div>
                </template>
                <template slot="orderLimitLabel">
                  <el-tooltip
                    :content="$t('POS渠道:不校验渠道、门店、个人、订单限购数量，固定不限制')"
                    class="item"
                    effect="dark"
                    placement="top"
                  >
                    <i class="el-icon-warning" />
                  </el-tooltip>
                  <span>{{ $t('订单限购') }}</span>
                </template>
                <template v-if="!scope.row.disable" slot="channelMerchantLimit" slot-scope="scope">
                  <ody-input-number
                    :disabled="append && scope.row.isAvailable === 1"
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.channelMerchantLimit"
                    onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                    name="scope_row_channelMerchantLimit"
                    @focus="scope.row._channelMerchantLimit = scope.row.channelMerchantLimit;"
                    @blur="updatePriceAndLimit(scope.row, 'channelMerchantLimit')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="channelStoreLimit" slot-scope="scope">
                  <ody-input-number
                    :disabled="append && scope.row.isAvailable === 1"
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.channelStoreLimit"
                    onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                    name="scope_row_channelStoreLimit"
                    @focus="scope.row._channelStoreLimit = scope.row.channelStoreLimit;"
                    @blur="updatePriceAndLimit(scope.row, 'channelStoreLimit')"
                  />
                </template>
                <template
                  v-if="!scope.row.disable"
                  slot="channelIndividualLimit"
                  slot-scope="scope"
                >
                  <ody-input-number
                    :disabled="append && scope.row.isAvailable === 1"
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.channelIndividualLimit"
                    onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                    name="scope_row_channelIndividualLimit"
                    @focus="scope.row._channelIndividualLimit = scope.row.channelIndividualLimit;"
                    @blur="updatePriceAndLimit(scope.row, 'channelIndividualLimit')"
                  />
                </template>
                <template v-if="!scope.row.disable" slot="orderLimit" slot-scope="scope">
                  <ody-input-number
                    :disabled="append && scope.row.isAvailable === 1"
                    :empty-tip="false"
                    :min="1"
                    :max="1000000000"
                    v-model="scope.row.orderLimit"
                    onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                    name="scope_row_orderLimit"
                    @focus="scope.row._orderLimit = scope.row.orderLimit;"
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
        brandType: '1',
        brandIds: [],
        categoryIds: []
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
            minWidth: 120, show: true
          },
          {
            labelSlot: 'salePriceLabel',
            prop: 'salePrice',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'priceLabel',
            // label: this.$t('特价（元）'),
            slot: 'promPrice',
            minWidth: 140, show: true
          },
          {
            label: this.$t('商家单渠道限购'),
            slot: 'channelMerchantLimit',
            minWidth: 180, show: true
          },
          {
            label: this.$t('店铺单渠道限购'),
            slot: 'channelStoreLimit',
            minWidth: 180, show: true
          },
          {
            label: this.$t('个人单渠道限购'),
            slot: 'channelIndividualLimit',
            minWidth: 180, show: true
          },
          {
            labelSlot: 'orderLimitLabel',
            prop: 'orderLimit',
            label: this.$t('个人限购'),
            slot: 'orderLimit',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              disabled: (index, row) => {
                return this.append && row.isAvailable === 1
              },
              hidden: (index, row) => {
                return row.disable
              },
              method: (index, row) => {
                var list = row.childMpList
                this.deleteSelectionProduct(list)
              },
              code: 'ui'
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
            minWidth: 120, show: true
          },
          {
            label: this.$t('互斥记录时间'),
            slot: 'exclusiveRecordingTime',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 120,
          fixed: 'right',
          list: [
            {
              label: this.$t('重新添加'),
              method: (index, row) => {
                this.reAddPromotionScope([row])
              },
              disabled: (index, row) => {
                return this.append
              },
              code: 'ui'
            },
            {
              label: this.$t('查看更多'),
              method: (index, row) => {
                this.viewMutexGoods(row)
              },
              hidden: (index, row) => {
                return !!row.childMpList
              },
              code: 'ui'
            }
          ]
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
      checkedMutexProductList: [],
      batchConfigRules: {
        channelMerchantLimit: [
          { required: true, message: '请输入商家单渠道限购数量', trigger: 'blur' }
        ],
        channelStoreLimit: [
          { required: true, message: '请输入店铺单渠道限购数量', trigger: 'blur' }
        ],
        channelIndividualLimit: [
          { required: true, message: '请输入个人单渠道限购数量', trigger: 'blur' }
        ],
        orderLimit: [
          { required: true, message: '请输入订单限购数量', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    getLabelName() {
      if (this.contentType === 1) {
        return '特价（元）'
      } else if (this.contentType === 2) {
        return '折扣'
      } else if (this.contentType === 3) {
        return '直降（元）'
      } else {
        return '...'
      }
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
        if (!util.isEmpty(item.agentList[0].contentValue)) {
          // item.promPrice = item.agentList[0].contentValue / 100
          if (this.contentType === 1 || this.contentType === 3) {
            item.promPrice = item.agentList[0].contentValue / 100
          } else if (this.contentType === 2) {
            item.promPrice = item.agentList[0].contentValue / 10
          }
        }
      })
      resolve(res.data)
    },
    selectable(row, index) {
      return !row.disable && !(this.append && row.isAvailable === 1)
    },
    selectableMutex() {
      return !this.append
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

      if (+batch.orderLimit > +this.batchConfig.channelIndividualLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t(
          '订单限购数应小于个人单渠道限购数，请重新填写'
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
      this.$refs.batchConfig.validate((valid) => {
        if (!valid) {
          return false
        }
      })
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
          'id': x.id,
          'mpId': x.mpId,
          'typeOfProduct': x.typeOfProduct,
          'mpName': x.mpName,
          'promotionId': x.promotionId,
          'individualLimit': x.individualLimit,
          'totalLimit': x.totalLimit,
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
            'contentValue': this.getContentValue(x, this.batchConfig.promPrice) || null,
            'presellTotalPrice': null,
            'presellDownPrice': null,
            'presellOffsetPrice': null,
            'bookNum': null,
            'totalLimit': null,
            'individualLimit': null,
            'typeOfProduct': null,
            'channelMerchantLimit': null,
            'channelStoreLimit': null,
            'channelIndividualLimit': null,
            'orderLimit': null
          }],
          contentType: this.contentType,
          promPrice: null,
          'channelMerchantLimit': this.batchConfig.channelMerchantLimit || x.channelMerchantLimit || null,
          'channelStoreLimit': this.batchConfig.channelStoreLimit || x.channelStoreLimit || null,
          'channelIndividualLimit': this.batchConfig.channelIndividualLimit || x.channelIndividualLimit || null,
          'orderLimit': this.batchConfig.orderLimit || x.orderLimit || null
        }))

      await this.promotionAPI.updatePriceAndLimit(params)
      await this.query('effect')
      this.checkedProductList = []
    },
    getContentValue(item, val) {
      if (!val) {
        return ''
      }
      // item.contentValue = x[type]
      if (this.contentType === 1 || this.contentType === 3) {
        return parseFloat((+val * 100).toFixed(2))
      } else if (this.contentType === 2) {
        return parseFloat((+val * 10).toFixed(2))
      }
    },
    async handleReset() {
      // this.formReset('mpSearch')
      this.mpSearch.obj = {}
      this.mpSearch.obj.activityId = this.promotionId
      await this.query('effect')
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
      // console.log(row)
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
    // 单一促销4个 '商家单渠道限购数', '店铺单渠道限购数', '个人单渠道限购数', '订单限购数
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

          row[type] = row['_' + type]

          return false
        }
      }

      if (isNaN(row.promPrice)) {
        return false
      }

      return true
    },
    // 如果有个人渠道限购，但是没有商家和店铺的渠道限购，则将商家和店铺渠道限购修改为个人渠道限购
    updateMerchantAndStoreLimit(row) {
      if (row.channelIndividualLimit) {
        if (!row.channelMerchantLimit) {
          row.channelMerchantLimit = row.channelIndividualLimit
        }
        if (!row.channelStoreLimit) {
          row.channelStoreLimit = row.channelIndividualLimit
        }
      }
    },

    async updatePriceAndLimit(row, type) {
      if (this.checkBlurData(row, type) === false) {
        return
      }

      if (type === 'channelIndividualLimit') {
        this.updateMerchantAndStoreLimit(row)
      }
      let newRow

      if (row.typeOfProduct === 1000) {
        newRow = row.childMpList[0]
        // js更新子和孙子
        this.$refs.mpTable.tableData
          .filter(x => (x.parentId === row.id || x.parentId === newRow.id))
          .forEach(tableRow => {
            tableRow[type] = row[type]
            if (type === 'channelIndividualLimit') {
              this.updateMerchantAndStoreLimit(tableRow)
            }
          })
      } else if (!row.disable) {
        newRow = row
        // js更新子和父
        this.$refs.mpTable.tableData
          .filter(x => (x.parentId === row.id || x.id === row.parentId))
          .forEach(tableRow => {
            tableRow[type] = row[type]
            if (type === 'channelIndividualLimit') {
              this.updateMerchantAndStoreLimit(tableRow)
            }
          })
      } else {
        newRow = row
      }

      // 修复有childMpList没有正常返回

      if (newRow.childMpList) {
        newRow.childMpList.forEach(child => {
          if (child.agentList) {
            child.agentList.forEach(item => {
              item.contentValue = this.getContentValue(newRow, row.promPrice)
            })
          }
        })
      }

      const params = [newRow]
        .map(x => ({
          ...x,
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
            'contentValue': this.getContentValue(x, row.promPrice),
            'presellTotalPrice': null,
            'presellDownPrice': null,
            'presellOffsetPrice': null,
            'bookNum': null,
            'totalLimit': null,
            'individualLimit': null,
            'typeOfProduct': null,
            'channelMerchantLimit': null,
            'channelStoreLimit': null,
            'channelIndividualLimit': null,
            'orderLimit': null
          }],
          contentType: this.contentType,
          promPrice: row.promPrice,
          'channelMerchantLimit': row.channelMerchantLimit,
          'channelStoreLimit': row.channelStoreLimit,
          'channelIndividualLimit': row.channelIndividualLimit,
          'orderLimit': row.orderLimit
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
          id: this.promotionId
        }
        this.promotionAPI.promotionPriceCheck(params).then(res => {
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

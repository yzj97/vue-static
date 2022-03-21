<template>
  <div class="bg-promotion-single-set-product">
    <div class="activity-merchant">
      <div>
        <ody-tip-star :content="$t('设置活动商品')" />
        <el-button
          name="goodsVisible"
          size="small"
          type="primary"
          @click="isAll = true; goodsVisible = true; searchParams.activityScheduleId = null;"
        >{{ append ? $t('追加活动商品') : $t('添加促销商品') }}</el-button>
        <el-button
          v-if="selectFlag === '2'"
          name="reAddPromotionScope"
          size="small"
          class="batch-delete"
          @click="reAddPromotionScope(checkedMutexProductList)"
        >{{ $t('批量重新添加') }}</el-button>
        <el-button
          v-if="selectFlag !== '2'"
          name="delActivityScheduleMp"
          size="small"
          type="danger"
          class="batch-delete"
          @click="delActivityScheduleMp(checkedProductList)"
        >{{ $t('批量删除') }}</el-button>
      </div>
      <div class="search-wrap" />
    </div>
    <ody-list-search-area v-if="batchEdit">
      <div slot="content">
        <el-form
          ref="batchConfig"
          :rules="rules"
          :model="batchConfig"
          label-width="100px"
          class="form"
        >
          <ody-search-item :label="$t('秒杀价（元）')" prop="promPrice" name="promPrice">
            <ody-input-number
              :empty-tip="false"
              :decimal="2"
              :min="0.01"
              :max="99999999.99"
              v-model="batchConfig.promPrice"
              name="batchConfig_promPrice"
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
          <ody-search-item :label="$t('店铺单渠道限购')" prop="channelStoreLimit" name="channelStoreLimit">
            <ody-input-number
              :empty-tip="false"
              :min="1"
              :max="1000000000"
              v-model="batchConfig.channelStoreLimit"
              name="batchConfig_channelStoreLimit"
            />
          </ody-search-item>
          <ody-search-item :label="$t('个人单渠道限购')" prop="channelIndividualLimit" name="channelIndividualLimit">
            <ody-input-number
              :empty-tip="false"
              :min="1"
              :max="1000000000"
              v-model="batchConfig.channelIndividualLimit"
              name="batchConfig_channelIndividualLimit"
            />
          </ody-search-item>
          <ody-search-item :label="$t('订单限购')" prop="orderLimit" name="orderLimit">
            <ody-input-number
              :empty-tip="false"
              :min="1"
              :max="1000000000"
              v-model="batchConfig.orderLimit"
              name="batchConfig_orderLimit"
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
          @click.prevent="handleBatchSave"
        >
          {{ $t('保存') }}
        </ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-search-area v-if="searchShow && selectFlag !== '2'">
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
        <el-button size="small" type="primary" @click.prevent="query()">{{ $t('查询') }}</el-button>
      </div>
    </ody-list-search-area>

    <div>
      <div slot="tabs">
        <el-tabs
          v-model="selectSchedule"
          name="selectSchedule"
          @tab-click="handleTabSchedule(selectSchedule)"
        >
          <el-tab-pane
            v-for="(item,index) in scheduleList"
            :key="index"
            :label="item.startTime + '--' + item.endTime"
            :name="(index+'')"
            class="schedule-tab"
          />
        </el-tabs>
      </div>
      <div slot="tabs" class="btnBox">
        <el-button
          name="goodsVisible9"
          size="small"
          class="btnL"
          type="primary"
          @click="isAll = false; goodsVisible = true; searchParams.activityScheduleId = activityScheduleId;"
        >{{ $t('添加商品') }}</el-button>
        <el-button
          class="btnR"
          name="importVisible"
          size="small"
          plain
          @click="importVisible = true"
        >{{ $t('批量导入') }}</el-button>
        <!-- 【GJZT-4515】无需展示 -->
        <el-button
          v-if="selectFlag !== '2'"
          name="handleShowEdit"
          size="small"
          class="batch-delete btnEdit"
          @click="handleShowEdit"
        >{{ $t('批量编辑') }}</el-button>
        <el-button
          v-if="selectFlag !== '2'"
          name="handleShowSearch"
          size="small"
          class="batch-delete btnSearch"
          @click="handleShowSearch"
        >{{ $t('搜索') }}</el-button>
      </div>
      <ody-list-table-area>
        <div slot="tabs" class="tabsBtnBox">
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
                  <template slot="salePriceLabel">
                    {{ $t('零售价(元)') }}
                    <el-tooltip
                      :content="$t('商品零售价仅供参考，与实际售卖价会有出入')"
                      class="item"
                      effect="dark"
                      placement="bottom"
                    >
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </template>
                  <template slot="priceLabel">
                    <ody-tip-star :content="$t('秒杀价(元)')" />
                  </template>
                  <template slot="channelMerchantLimitLabel">
                    <ody-tip-star :content="$t('商家单渠道限购')" />
                  </template>
                  <template slot="channelStoreLimitLabel">
                    <ody-tip-star :content="$t('店铺单渠道限购')" />
                  </template>
                  <template slot="channelIndividualLimitLabel">
                    <ody-tip-star :content="$t('个人单渠道限购')" />
                  </template>
                  <template slot="orderLimitLabel">
                    <ody-tip-star :content="$t('订单限购')" />
                  </template>
                  <template slot="showIndexLabel">
                    <ody-tip-star :content="$t('顺序')" />
                    <el-tooltip
                      :content="$t('顺序值设置越大，在前台显示顺序越靠前')"
                      class="item"
                      effect="dark"
                      placement="bottom"
                    >
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </template>
                  <template slot="promPrice" slot-scope="scope">
                    <ody-input-number
                      :disabled="append && scope.row.isAvailable === 1"
                      :empty-tip="false"
                      :decimal="2"
                      :min="0.01"
                      :max="chekcPromPrice(scope.row.salePrice)"
                      v-model="scope.row.promPrice"
                      name="scope_row_promPrice"
                      @focus="scope.row._promPrice = scope.row.promPrice;"
                      @blur="updatePriceAndLimit(scope.row, 'promPrice')"
                    />
                  </template>
                  <template
                    v-if="!scope.row.disable"
                    slot="channelMerchantLimit"
                    slot-scope="scope"
                  >
                    <ody-input-number
                      :disabled="append && scope.row.isAvailable === 1"
                      :empty-tip="false"
                      :min="1"
                      :max="1000000000"
                      v-model="scope.row.channelMerchantLimit"
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
                      name="scope_row_orderLimit"
                      @focus="scope.row._orderLimit = scope.row.orderLimit;"
                      @blur="updatePriceAndLimit(scope.row, 'orderLimit')"
                    />
                  </template>
                  <template v-if="!scope.row.disable" slot="showIndex" slot-scope="scope">
                    <ody-input-number
                      :disabled="append && scope.row.isAvailable === 1"
                      :empty-tip="false"
                      :min="0"
                      :max="999999"
                      v-model="scope.row.showIndex"
                      name="scope_row_showIndex"
                      @focus="scope.row._showIndex = scope.row.showIndex;"
                      @blur="updatePriceAndLimit(scope.row, 'showIndex')"
                      @keydown.native="handleKeydown"
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
    </div>

    <promotion-batch-import-product-model
      :visible.sync="importVisible"
      :activity-id="promotionId"
      :prom-type="promType"
      :activity-schedule-id="activityScheduleId"
      :ref-type="1"
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
      isAll: false,
      rules: {
        promPrice: [
          { required: true, message: '请输入秒杀价', trigger: 'blur' }
        ]
      },
      userAppendList: [],
      scheduleList: [],
      scopeItemId: '',
      visibleMutex: false,
      activityScheduleList: [],
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
      selectSchedule: '0',
      treeProps: {
        rootVal: '0',
        parentKey: 'parentId',
        hasChildren: 'hasChildren',
        children: 'childMpList'
      },
      scheduleParams1: {
        activityScheduleId: '',
        refType: undefined,
        refThemeId: '',
        status: 0
      },
      scheduleParams2: {
        activityScheduleId: '',
        refType: undefined,
        refThemeId: '',
        status: -1
      },
      mpSearch: {
        obj: {
          merchantId: '',
          mpCode: '',
          mpName: '',
          barcode: '',
          activityId: this.promotionId,
          isMutexList: [0, 5]
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
            // label: this.$t('零售价（元）'),
            labelSlot: 'salePriceLabel',
            prop: 'salePrice',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'priceLabel',
            slot: 'promPrice',
            minWidth: 120, show: true
          },
          {
            // label: this.$t('商家单渠道限购'),
            labelSlot: 'channelMerchantLimitLabel',
            slot: 'channelMerchantLimit',
            minWidth: 126, show: true
          },
          {
            // label: this.$t('店铺单渠道限购'),
            labelSlot: 'channelStoreLimitLabel',
            slot: 'channelStoreLimit',
            minWidth: 126, show: true
          },
          {
            // label: this.$t('个人单渠道限购'),
            labelSlot: 'channelIndividualLimitLabel',
            slot: 'channelIndividualLimit',
            minWidth: 126, show: true
          },
          {
            // label: this.$t('订单限购'),
            labelSlot: 'orderLimitLabel',
            slot: 'orderLimit',
            minWidth: 120, show: true
          },
          {
            // label: this.$t('订单限购'),
            labelSlot: 'showIndexLabel',
            slot: 'showIndex',
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
                this.delActivityScheduleMp([row])
              },
              disabled: (index, row) => {
                return this.append && row.isAvailable === 1
              },
              code: 'button024'
            }
          ]
        },
        data: [],
        requestUrl:
          '/back-promotion-web/promotionActivityRead/getActivityScheduleMpList.action'
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
            minWidth: 250, show: true
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
          '/back-promotion-web/promotionActivityRead/getActivityScheduleMpList.action'
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
      querySelectionProductMap: []
    }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPromotionActivityDetail()

    this.$nextTick(async() => {
      await this.query()
    })
  },
  methods: {
    handleKeydown(e) {
      var keycode1 = (e.keyCode ? e.keyCode : e.which)
      if (keycode1 === 0 || keycode1 === 9) {
        e.preventDefault()
        e.stopPropagation()
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
            if (y.childMpList && y.childMpList.length === 0) {
              delete y['childMpList']
            }
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
            x.showIndex = y.showIndex
            x.salePrice = y.salePrice
            x.barcode = y.barcode
            x.merchantName = y.merchantName

            if (y.contentValue !== null) {
              x.promPrice = +y.contentValue / 100
              y.promPrice = +y.contentValue / 100
            } else {
              x.promPrice = ''
              y.promPrice = ''
            }

            // 如果是系列品
            if (y.typeOfProduct === 3) {
              y.childMpList = null
              y.hasChildren = true
            }
            y.agentList &&
              y.agentList.forEach(item => {
                if (!util.isEmpty(item.contentValue)) {
                  x.promPrice = +item.contentValue / 100
                  y.promPrice = +item.contentValue / 100
                }
              })
          })
      })
      return res
    },
    async loadChildren(tree, treeNode, resolve) {
      const params = {
        refType: 1,
        refThemeId: this.promotionId,
        activityScheduleId: this.activityScheduleId,
        mpId: treeNode.mpId
      }
      const res = await this.promotionAPI.getActivityScheduleChildMpList(
        params
      )
      res.data && res.data.forEach(item => {
        item.disable = true
        item.promPrice = item.contentValue ? item.contentValue / 100 : ''
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
    async ok(val) {
      this.querySelectionProductMap = val.map(item => {
        return {
          mpId: item.mpId,
          typeOfProduct: item.typeOfProduct,
          mpCode: item.mpCode,
          mpName: item.mpName,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          showIndex: 0,
          refType: 1,
          refThemeId: this.promotionId,
          isAvailable: this.append ? 0 : 1,
          productId: item.productId,
          scopeType: item.scopeType,
          barcode: item.barcode
        }
      })
      const params = {
        mpList: this.querySelectionProductMap,
        activityScheduleId: this.isAll ? -1 : this.activityScheduleId,
        refType: 1,
        refThemeId: this.promotionId
      }
      await this.saveSelectionProduct(params)
    },
    async saveSelectionProduct(params) {
      const { code } = await this.promotionAPI.saveActivityScheduleMp(params)
      if (code === '0') {
        await this.handleTabSchedule(this.selectSchedule)
      }
    },
    async handleImportClose(val) {
      await this.query()
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
      if (this.checkedProductList.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要修改的商品')
        })
        return
      }
      const batchPrice = this.batchConfig.promPrice || null
      const batchIndividualLimit = this.batchConfig.individualLimit || null
      const batchTotalLimit = this.batchConfig.totalLimit || null
      const batchChannelMerchantLimit = this.batchConfig.channelMerchantLimit || null
      const batchChannelStoreLimit = this.batchConfig.channelStoreLimit || null
      const batchChannelIndividualLimit = this.batchConfig.channelIndividualLimit || null
      const batchOrderLimit = this.batchConfig.orderLimit || null

      for (const i in this.checkedProductList) {
        const mp = this.checkedProductList[i]
        if (batchPrice) {
          if (batchPrice > this.chekcPromPrice(+mp.salePrice) || batchPrice < 0.01) {
            this.$message.error(mp.mpName + ' 秒杀价不正确')
            return
          }
        }
        if (batchChannelMerchantLimit) {
          mp.channelMerchantLimit = batchChannelMerchantLimit
          if (!this.checkBlurData(mp, 'channelMerchantLimit', true)) {
            return
          }
        }
        if (batchChannelStoreLimit) {
          mp.channelStoreLimit = batchChannelStoreLimit
          if (!this.checkBlurData(mp, 'channelStoreLimit', true)) {
            return
          }
        }
        if (batchChannelIndividualLimit) {
          mp.channelIndividualLimit = batchChannelIndividualLimit
          if (!this.checkBlurData(mp, 'channelIndividualLimit', true)) {
            return
          }
        }
        if (batchOrderLimit) {
          mp.orderLimit = batchOrderLimit
          if (!this.checkBlurData(mp, 'orderLimit', true)) {
            return
          }
        }
      }

      const params = {
        // 后端接口不能多传递值，不然有各种问题
        'activityScheduleId': this.activityScheduleId,
        'contentValue': this.getContentValue(this.batchConfig.promPrice) || null,
        'individualLimit': batchIndividualLimit,
        'totalLimit': batchTotalLimit || null,
        'channelMerchantLimit': batchChannelMerchantLimit,
        'channelStoreLimit': batchChannelStoreLimit,
        'channelIndividualLimit': batchChannelIndividualLimit,
        'orderLimit': batchOrderLimit,
        mpList: this.checkedProductList
          .filter(x => x.typeOfProduct !== 1000)
          .map(x => ({
            id: x.id,
            'mpId': x.mpId,
            'mpName': x.mpName,
            'typeOfProduct': x.typeOfProduct,
            'individualLimit': this.batchConfig.individualLimit || x.individualLimit || null,
            'totalLimit': this.batchConfig.totalLimit || x.totalLimit || null,
            'channelMerchantLimit': this.batchConfig.channelMerchantLimit || x.channelMerchantLimit || null,
            'channelStoreLimit': this.batchConfig.channelStoreLimit || x.channelStoreLimit || null,
            'channelIndividualLimit': this.batchConfig.channelIndividualLimit || x.channelIndividualLimit || null,
            'orderLimit': this.batchConfig.orderLimit || null
          }))
      }

      await this.promotionAPI.updateActivityScheduleMp(params)
      await this.query('effect')
      this.checkedProductList = []
    },
    getContentValue(val) {
      if (!val) {
        return ''
      }
      // item.contentValue = x[type]
      return (+val * 100 + '')
    },
    async handleReset() {
      // this.formReset('mpSearch')
      this.mpSearch.obj = {}
      this.mpSearch.obj.activityId = this.promotionId
      await this.query()
    },
    async query() {
      await this.querySelectionProductList()
    },
    handleMutexSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedMutexProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },
    async delActivityScheduleMp(row) {
      if (row.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要删除的商品')
        })
        return
      }
      const mpList = []
      row.forEach(x => {
        if (x.childMpList && x.childMpList.length > 0) {
          mpList.push({
            id: x.childMpList[0].id,
            mpId: x.childMpList[0].mpId,
            typeOfProduct: x.childMpList[0].typeOfProduct
          })
        } else {
          if (mpList.findIndex(j => j.id === x.id) === -1) {
            mpList.push({
              id: x.id,
              mpId: x.mpId,
              typeOfProduct: x.typeOfProduct
            })
          }
        }
      })
      // 单个商品删除的时候， 需要清除已选list数据
      if (mpList.length === 1) {
        for (let i = 0; i < this.checkedProductList.length; i++) {
          if (this.checkedProductList[i].id === mpList[0].id) {
            this.checkedProductList.splice(i, 1)
          }
        }
      }
      const params = {
        mpList: mpList,
        activityScheduleId: this.activityScheduleId
      }
      await this.promotionAPI.delActivityScheduleMp(params)
      await this.querySelectionProductList()
    },
    // 重新添加
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
        activityScheduleId: this.activityScheduleId,
        refType: 1,
        refThemeId: this.scheduleParams1.refThemeId,
        mpList: querySelectionProductList
      })
      if (res.code === '0') {
        await this.querySelectionProductList('effect')
        await this.querySelectionProductList('mutex')
      }
    },
    // 查看更多
    viewMutexGoods(row) {
      this.scopeItemId = row.id
      this.visibleMutex = true
    },
    // 秒杀4个，并且必填 '商家单渠道限购数', '店铺单渠道限购数', '个人单渠道限购数', '订单限购数'
    checkBlurData(row, type, showMpName) {
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

        var namePrefix = ''
        if (showMpName) {
          namePrefix = row.mpName
        }
        if (errMsg) {
          this.$message({
            type: 'error',
            message: namePrefix + this.$t(errMsg.replace(/\$(\d+)/g, ($0, $1) => limitNameList[$1]))
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
      if (!row.promPrice) {
        row.promPrice = 0.01
      }
      if (+row.promPrice > this.chekcPromPrice(+row.salePrice)) {
        row.promPrice = this.chekcPromPrice(+row.salePrice)
      }
      if (Number.isNaN(Number.parseInt(row.showIndex)) || Number.parseInt(row.showIndex) >= 0 && Number.parseInt(row.showIndex) >= 999999) {
        this.$message.error('顺序必须是<=999999的非负整数')
        return
      }

      if (this.checkBlurData(row, type) === false) {
        if (!row.promPrice) {
          row.promPrice = 0.01
        }
        if (Number.isNaN(+row.channelMerchantLimit) || +row.channelMerchantLimit < 0) {
          row.channelMerchantLimit = 1
          console.log(row.channelMerchantLimit)
        }
        if (Number.isNaN(+row.channelStoreLimit) || +row.channelMerchantLimit < 0) {
          row.channelStoreLimit = 1
          console.log(row.channelStoreLimit)
        }
        if (Number.isNaN(+row.channelIndividualLimit) || +row.channelMerchantLimit < 0) {
          row.channelIndividualLimit = 1
          console.log(row.channelIndividualLimit)
        }
        if (Number.isNaN(+row.orderLimit) || +row.channelMerchantLimit < 0) {
          row.orderLimit = 1
          console.log(row.orderLimit)
        }
      }

      const limitList = ['channelMerchantLimit', 'channelStoreLimit', 'channelIndividualLimit', 'orderLimit']
      const limitNameList = ['商家单渠道限购数', '店铺单渠道限购数', '个人单渠道限购数', '订单限购数']
      for (let i = 0; i < limitList.length; ++i) {
        if (row[limitList[i]] > 1000000000) {
          this.$message.error(limitNameList[i] + '不能大于1000000000')
          return
        }
      }

      if (row.showIndex > 999999) {
        this.$message.error('顺序不能大于999999')
        return
      }
      if (row.showIndex > 999999) {
        this.$message.error('秒杀价不能大于9999999.99')
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

      const mpList = [newRow]
        .map(x => ({
          id: x.id,
          mpId: x.mpId,
          mpName: x.mpName,
          scopeType: null
        }))

      const params = {
        activityScheduleId: this.activityScheduleId,
        mpList,
        channelIndividualLimit: newRow.channelIndividualLimit,
        channelMerchantLimit: newRow.channelMerchantLimit,
        channelStoreLimit: newRow.channelStoreLimit,
        orderLimit: newRow.orderLimit,
        showIndex: newRow.showIndex
      }

      if (newRow.promPrice) {
        params.contentValue = (+newRow.promPrice * 100).toFixed()
      } else {
        params.contentValue = null
      }

      await this.promotionAPI.updateActivityScheduleMp(params)
    },
    async handleTabSchedule(val) {
      this.selectSchedule = val
      this.activityScheduleId = this.scheduleList[val].id
      await this.querySelectionProductList()
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
        this.activityScheduleList = data.activityScheduleList
        this.activityScheduleId =
          data.activityScheduleList[this.selectSchedule].id
        this.contentType = data.promotionMethod
        this.merchantType = data.merchantType
        this.searchParams.merchantType = data.merchantType
        this.searchParams.promType = data.frontPormotionType

        this.scheduleList = data.activityScheduleList
      }
    },
    // type : 'effect' 生效商品， 'mutex' 互斥商品
    async querySelectionProductList() {
      if (this.activityScheduleList) {
        const activitySchedule = this.activityScheduleList
        this.scheduleParams1.activityScheduleId =
          activitySchedule[this.selectSchedule].id
        this.scheduleParams1.refType =
          activitySchedule[this.selectSchedule].refType
        this.scheduleParams1.refThemeId =
          activitySchedule[this.selectSchedule].refThemeId + ''

        this.scheduleParams2.activityScheduleId =
          activitySchedule[this.selectSchedule].id
        this.scheduleParams2.refType =
          activitySchedule[this.selectSchedule].refType
        this.scheduleParams2.refThemeId =
          activitySchedule[this.selectSchedule].refThemeId + ''
      }
      this.$refs.mpTable.getList({ ...this.mpSearch.obj, ...this.scheduleParams1 })
      this.$refs.mutexTable.getList({ ...this.mutexSearch.obj, ...this.scheduleParams2 })
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
          refType: 1,
          refThemeId: this.scheduleParams1.refThemeId
        }
        if (this.append) {
          params.isAvailable = 0
          params.activityScheduleId = this.activityScheduleId
        }
        this.promotionAPI.activityScheduleMpCheck(params).then(res => {
          resolve(res)
        })
      })
    },
    async appendSave() {
      const params = {
        activityId: this.promotionId,
        promType: this.promType,
        // 'refType': 1,
        // 'refThemeId': this.promotionId,
        // 'isAvailable': 0,
        activityScheduleId: this.activityScheduleId
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
    },
    chekcPromPrice(num) {
      if (num) {
        const a = parseFloat(num).toFixed(2)
        if (a > 9999999.99) {
          return 9999999.99
        }
        return a
      }
      return 9999999.99
    }
  }
}
</script>

<style lang="scss" scoped>
.btnBox {
  position: relative;
  margin-bottom: 30px;
  .btnL {
    position: absolute;
    left: 0;
    top: 0;
  }
  .btnR {
    position: absolute;
    right: 20px;
    top: 0;
  }
  .btnEdit {
    position: absolute;
    right: 110px;
    top: 0;
  }
  .btnSearch {
    position: absolute;
    right: 210px;
    top: 0;
  }
}

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
  .schedule-tab {
    display: inline-block;
    width: 130px;
  }
}
</style>

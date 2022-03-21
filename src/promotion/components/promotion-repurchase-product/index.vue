<template>
  <div class="bg-promotion-single-set-product">
    <el-tabs v-model="promotionSelectFlag" name="promotionSelectFlag">
      <el-tab-pane :label="$t('参与商品')" name="1">
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
        <ody-list-search-area v-show="searchShow && selectFlag === '1'">
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
            <el-tabs v-model="selectFlag" name="selectFlag">
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
                    :load="loadChildren"
                    :selectable="selectable"
                    :can-filter="false"
                    row-key="id"
                    @getTableListTotal="getMpTableListTotal"
                    @selection-change="handleSelectionChange"
                  />
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
                    :request-url="mpTable.requestUrl"
                    :is-tree="true"
                    :can-filter="false"
                    :tree-props="treeProps"
                    :load="loadChildren"
                    :response="mutexTableResponse"
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
      </el-tab-pane>
      <el-tab-pane v-if="!append" :label="$t('换购商品')" name="2">
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :data="giftTable.data"
              :columns="giftTable.columns"
              :operates="giftTable.operates"
              :can-filter="false"
              name="giftTable_data290"
            >
              <template slot="promotionId" slot-scope="scope">{{ scope.$index + 1 }}</template>
              <template slot="conditionValue" slot-scope="scope">
                <div class="condition-value">
                  {{ $t('满') }}
                  <ody-input-number
                    v-if="frontPormotionType === 1018"
                    v-model="scope.row.conditionValue"
                    :min="0.01"
                    :max="9999999"
                    :decimal="2"
                    :empty-tip="false"
                    name="scope_row_conditionValue"
                  />
                  <ody-input-number
                    v-if="frontPormotionType === 1019"
                    v-model="scope.row.conditionValue"
                    :empty-tip="false"
                    name="scope_row_conditionValue2"
                  />
                  {{ frontPormotionType === 1018 ? '元': '件' }}
                </div>
              </template>
            </ody-table>
          </div>
          <div slot="btn">
            <el-button
              :disabled=" giftTable.data.length >= 5 "
              name="addGiftLevel"
              size="small"
              type="primary"
              @click="addGiftLevel"
            >{{ $t('新增换购') }}</el-button>
          </div>
        </ody-list-table-area>
      </el-tab-pane>
    </el-tabs>
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
      @ok="goodsOk"
    />

    <promotion-repurchase-dialog-choose
      v-if="giftVisible"
      :visible.sync="giftVisible"
      :multiple="true"
      :params="giftSearchParams"
      choose-key="mpId"
      @ok="giftOk"
    />

    <promotion-repurchase-dialog-look
      v-if="giftLookVisible && promotionRuleId"
      :visible.sync="giftLookVisible"
      :content-type="contentType"
      :content-value="contentValue"
      :gift-show-type="giftShowType"
      :params="{
        promotionId: promotionId,
        promotionRuleId: promotionRuleId
      }"
      @cancel="giftLookCancel"
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
import PromotionRepurchaseDialogChoose from '@/components/promotion-repurchase-dialog-choose'
import PromotionRepurchaseDialogLook from '@/components/promotion-repurchase-dialog-look'
import PromotionMutexGoodsLook from '@/components/promotion-mutex-goods-look'
import util from '@/utils/util'

export default {
  components: {
    PromotionMerchantSelect,
    PromotionBatchImportProductModel,
    PromotionGoodsDialogChoose,
    PromotionRepurchaseDialogChoose,
    PromotionRepurchaseDialogLook,
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
      mutexTableListTotal: '',
      mpTableListTotal: '',
      frontPormotionType: '',
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
      giftSearchParams: {
        merchantType: '',
        promType: -1,
        promotionId: this.promotionId,
        searchType: 1,
        sellType: 1,
        storeIds: [],
        categoryType: '1',
        brandType: '1'
      },
      promotionSelectFlag: '1',
      goodsSelected: [],
      goodsVisible: false,
      giftVisible: false,
      giftLookVisible: false,
      giftSelected: [],
      importVisible: false,
      searchShow: false,
      selectFlag: '1',
      contentValue: '',
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
            minWidth: 250, show: true
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
            label: this.$t('原价（元）'),
            prop: 'salePrice',
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
                this.deleteSelectionProduct([row])
              },
              disabled: (index, row) => {
                return this.append && row.isAvailable === 1
              },
              code: 'button024'
            }
          ]
        },
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
        }
      },
      giftTable: {
        columns: [
          {
            label: this.$t('优惠阶梯'),
            slot: 'promotionId',
            show: true
          },
          {
            label: this.$t('换购门槛'),
            slot: 'conditionValue',
            show: true,
            minWidth: 180
          }
        ],
        operates: {
          width: 280,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              hidden: () => {
                return this.giftTable.data.length === 1
              },
              method: (index, row) => {
                this.delPromotionRule(row)
              },
              code: 'button026'
            },
            {
              label: this.$t('添加换购商品'),
              method: (index, row) => {
                this.initAddGiftModal(row)
              },
              code: 'button027'
            },
            {
              label: this.$t('查看换购商品'),
              method: (index, row) => {
                this.lookGiftModal(row)
              },
              code: 'button023'
            }
          ]
        },
        data: []
      },
      promotionAPI: null,
      contentType: '',
      conditionType: '',
      merchantType: '',
      promotionRuleId: '',
      giftShowType: '',
      checkedProductList: [],
      checkedMutexProductList: []
    }
  },
  computed: {
    // append() {
    //   return +this.contentType !== 5
    // }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.$nextTick(async() => {
      await this.queryPromotionActivityDetail()
      await this.query('effect')
      await this.query('mutex')
      await this.queryGiftLevelList()
    })
  },
  methods: {
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
      })
      resolve(res.data)
    },
    selectable(row, index) {
      return !row.disable && !(this.append && row.isAvailable === 1)
    },
    selectableMutex() {
      return !this.append
    },
    lookGiftModal(row) {
      this.contentValue = row.contentValue
      this.promotionRuleId = row.promotionRuleId
      this.giftShowType = row.giftShowType
      this.giftLookVisible = true
    },
    initAddGiftModal(row) {
      this.promotionRuleId = row.promotionRuleId
      this.giftVisible = true
    },
    async delPromotionRule(row) {
      await this.promotionAPI.delGiftLevel({
        promotionId: row.promotionId,
        promotionRuleId: row.promotionRuleId
      })
      await this.queryGiftLevelList()
    },
    async addGiftLevel() {
      const params = {
        promotionId: this.promotionId,
        conditionType: this.conditionType,
        contentType: this.contentType,
        giftType: this.giftType
      }

      const { code } = await this.promotionAPI.addGiftLevel(params)
      if (code === '0') {
        await this.queryGiftLevelList()
      }
    },
    async queryGiftLevelList() {
      const { data, code } = await this.promotionAPI.queryGiftLevelList({
        promotionId: this.promotionId
      })
      if (code === '0') {
        if (this.frontPormotionType === 1018) {
          data.map(item => {
            item.conditionValue = item.conditionValue / 100
          })
        }
        this.giftTable.data = data || []
      }
    },
    async giftOk(val) {
      const gifts = val
      gifts.map(item => {
        item.giftCode = item.mpCode
        item.giftName = item.mpName
        item.giftNum = 1
      })
      const params = {
        gifts: gifts,
        merchantType: this.merchantType,
        promotionId: this.promotionId,
        promotionRuleId: this.promotionRuleId
      }
      const { code } = await this.promotionAPI.addLevelGifts(params)
      if (code === '0') {
        this.giftVisible = false
      }
    },
    giftCancel() {
      this.giftVisible = false
    },
    giftLookCancel() {
      this.giftLookVisible = false
      this.queryGiftLevelList()
    },
    goodsCancel() {
      this.goodsVisible = false
    },
    async goodsOk(val) {
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
    async handleCurrentChange(type) {
      await this.querySelectionProductList(type)
    },
    async handleSizeChange(type) {
      await this.query(type)
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
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }

      const { data = {}, code } = await this.promotionAPI.getPromotionDetailUrl(
        params
      )

      if (code === '0') {
        this.contentType = data.promotionMethod
        this.conditionType = data.conditionType
        this.giftType = data.giftType
        this.merchantType = data.merchantType
        this.searchParams.merchantType = data.merchantType
        this.giftSearchParams.merchantType = data.merchantType
        this.frontPormotionType = data.frontPormotionType
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
    handleShowSearch() {
      this.searchShow = !this.searchShow
    },
    async isCanSave() {
      // 验证是否选商品
      const params = {
        currentPage: 0,
        itemsPerPage: 10,
        obj: {
          activityId: this.promotionId
        }
      }
      const res = await this.promotionAPI.querySelectionProListMethod(params)
      if (res.data.listObj == null) {
        this.$message({
          type: 'warning',
          message: this.$t('促销商品不能为空')
        })
        return false
      }
      // 追加商品的时候的校验
      if (this.append) {
        return true
      }
      // 验证是否选赠品
      const list = this.$portal.deepClone(this.giftTable.data)
      let flag = true
      var arrCount = []
      const arr = list.map(item => {
        if (item.conditionValue) {
          arrCount.push(item.conditionValue)
          if (this.frontPormotionType === 1018) {
            item.conditionValue = item.conditionValue * 100
          }
        } else {
          flag = false
        }
        return item
      })
      if (!flag) {
        this.$message({
          type: 'warning',
          message: this.$t('促销规则不能为空')
        })
        return false
      }
      if (arr.length !== [...new Set(arrCount)].length) {
        this.$message({
          type: 'warning',
          message: this.$t('阶梯优惠门槛不能重复')
        })
        return false
      }
      const search = {
        promotionId: this.promotionId,
        giftLevelVOs: arr
      }
      const result = await this.promotionAPI.updateGiftLevels(search)
      if (+result.code === 0) {
        return true
      } else {
        return false
      }
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

  .condition-value {
    width: 200px;
  }
}
</style>

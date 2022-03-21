<template>
  <div>
    <div class="bg-promotion-set-merchant-store">
      <div class="pg-promotion-detail">
        <ody-box :title="$t('促销中心') + '/' + $t('报名活动') + '/' + $t('活动报名申请')">
          <div class="base-info">
            <div class="header">{{ activityAttendDetail.activityTitle }}</div>
            <div class="item">
              <span>活动报名时间：</span>
              {{ activityAttendDetail.startTime | parseTime }} - {{ activityAttendDetail.endTime | parseTime }}
            </div>
            <div class="item">
              <span>促销活动名称：</span>
              {{ refThemeName }}
            </div>
            <div class="item">
              <span>促销活动时间：</span>
              {{ refThemeStartTime }} - {{ refThemeEndTime }}
            </div>
            <div class="item">
              <span>促销活动ID：</span>
              {{ activityAttendDetail.refThemeId }}
            </div>
            <div class="item">
              <span>活动描述：</span>
              {{ activityAttendDetail.description }}
            </div>
          </div>
        </ody-box>
      </div>
    </div>
    <div class="bg-promotion-single-set-product">
      <div class="activity-merchant">
        <div>
          <ody-button
            v-if="statusTab===-2 || statusTab===-1"
            :disabled="disabled"
            name="goodsVisible"
            type="primary"
            size="small"
            code="RegistrationAddProduct"
            @click="goodsVisible = true"
          >{{ '添加报名商品' }}</ody-button>
          <ody-button
            v-if="statusTab===-1 || statusTab===4"
            :disabled="disabled"
            name="deleteSelectionProduct"
            type="primary"
            size="small"
            class="batch-delete"
            code="RegistrationBatchDelProduct"
            @click="delAllSelectedMerchantProduct()"
          >{{ $t('批量删除') }}</ody-button>
          <ody-button
            v-if="statusTab===2 || operateModel===1"
            :disabled="disabled"
            name="deleteSelectionProduct"
            type="primary"
            size="small"
            code="RegistrationBatchRelCallProduct"
            @click="vacateSelection(checkedProductList)"
          >{{ $t('商品撤回') }}</ody-button>
          <ody-button
            v-if="statusTab === -1"
            :disabled="disabled"
            name="vacateSelection"
            type="primary"
            size="small"
            class="batch-delete"
            code="RegistrationExportParamProduct"
            @click="exportAllMps(-1)"
          >{{ $t('导出待设置参数商品') }}</ody-button>
          <ody-button
            v-if="statusTab === 4"
            :disabled="disabled"
            name="vacateSelection"
            type="primary"
            size="small"
            class="batch-delete"
            code="RegistrationExportNoPassProduct"
            @click="exportAllMps(4)"
          >{{ $t('导出审核未通过商品') }}</ody-button>
          <ody-batch-import-button
            v-if="(statusTab === -1 || statusTab === 4) && showExportBtn"
            :disabled="disabled"
            :import-api="importModel.importApi"
            :download-show="false"
            name="RegistrationImportFile"
            code="RegistrationImportFile"
            size="small"
            @ok="exportSuccess"
          >
            {{ $t('导入促销参数文件') }}
          </ody-batch-import-button>
          <ody-button
            v-if="selectFlag === '1'"
            name="handleShowSearch"
            type="primary"
            size="small"
            class="batch-delete"
            code="RegistrationProductSearch"
            @click="handleShowSearch"
          >{{ $t('搜索') }}</ody-button>
        </div>
      </div>
      <ody-list-search-area v-if="searchShow && selectFlag === '1'">
        <div slot="content">
          <el-form ref="mpSearch" :model="mpSearch" label-width="80px" class="form">
            <ody-search-item :label="$t('商家名称')" prop="obj.mpName">
              <span>{{ activityAttendDetail.attendRecord.merchantName }}</span>
            </ody-search-item>
            <ody-search-item :label="$t('联系方式')" prop="attendRecord.mobile">
              <span>{{ activityAttendDetail.attendRecord.mobile }}</span>
            </ody-search-item>
            <ody-search-item :label="$t('商家ID')" prop="attendRecord.merchantId">
              <span>{{ activityAttendDetail.attendRecord.merchantId }}</span>
            </ody-search-item>
            <ody-search-item :label="$t('商品名称')" prop="obj.mpName">
              <el-input v-model="queryContent.obj.mpName" name="mpSearch_obj_mpName" />
            </ody-search-item>
            <ody-search-item :label="$t('商品编码')" prop="obj.mpCode">
              <el-input v-model="queryContent.obj.mpCode" name="mpSearch_obj_mpCode" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <ody-button name="RegistrationProductQuery" type="primary" size="small" code="RegistrationProductQuery" @click.prevent="queryAttendMpList">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>

      <ody-list-table-area>
        <div slot="tabs">
          <el-tabs
            v-model="statusTabStr"
            name="status_tab"
            @tab-click="queryApplyMp4Status(statusTabStr)"
          >
            <el-tab-pane :label="$t('全部')" name="-2" />
            <el-tab-pane :label="$t('待提交')" name="-1" />
            <el-tab-pane :label="$t('审核未通过')" name="4" />
            <el-tab-pane v-if="operateModel === 2" :label="$t('待商家审核')" name="1"/>
            <el-tab-pane :label="$t('待平台审核')" name="2" />
            <el-tab-pane :label="$t('已进入促销活动')" name="3" />
          </el-tabs>
        </div>
        <div slot="table">
          <ody-table
            ref="mpTable"
            :columns="listTable.columns"
            :operates="listTable.operates"
            :is-tree="true"
            :tree-props="treeProps"
            :load="loadChildren"
            :response="mpTableResponse"
            :request-url="listTable.requestUrl"
            :checked.sync="listTable.checkedList"
            :multiple="true"
            row-key="id"
          >
            <template slot="labelPromotionText" slot-scope="{}">
              <ody-tip-star :content="getPromContentTypeText()" />
            </template>
            <template slot="pPurchase" slot-scope="{}">
              <ody-tip-star :content="$t('个人单渠道限购')" />
            </template>
            <template slot="mPurchase" slot-scope="{}">
              <ody-tip-star :content="$t('商家单渠道限购')" />
            </template>
            <template slot="mpName" slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <span v-if="scope.row.isAvailable === 0">{{ $t('失效') }}</span>
            </template>
            <template slot="salePrice" slot-scope="scope">
              <span>¥{{ scope.row.salePrice }}</span>
            </template>
            <template slot="originalSettlePrice" slot-scope="scope">
              <span>¥{{ scope.row.originalSettlePrice }}</span>
            </template>
            <template slot="settlementPrice" slot-scope="scope">
              <span>¥{{ scope.row.settlementPrice }}</span>
            </template>
            <template slot="orderStartNum" slot-scope="scope">
              <span>{{ scope.row.orderStartNum || '--' }}</span>
            </template>
            <template slot="orderMultiple" slot-scope="scope">
              <span>{{ scope.row.orderMultiple || '--' }}</span>
            </template>
            <template slot="orderMultiple" slot-scope="scope">
              <span>{{ scope.row.orderMultiple || '--' }}</span>
            </template>
            <template slot="promotionPrice" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType ===1 && (statusTab === -1 || statusTab === 4) && (promotionDetail.promotionType === 1 || promotionDetail.promotionType === 7)"
                v-model="scope.row.contentValue"
                :decimal="2"
                :min="0.01"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkPrice(scope.row,true,1,null,'contentValue',scope.row.contentValue)"/>
              <span v-if="activityAttendDetail.refType===1 && (statusTab === 1 || statusTab === 2||statusTab === 3) && (promotionDetail.promotionType === 1|| promotionDetail.promotionType === 7)">
                {{ promotionDetail.promotionType === 1 && promotionDetail.promotionMethod === 2?'':'¥' }}{{ scope.row.contentValue }}
              </span>
              <ody-input-number
                v-if="activityAttendDetail.refType===2 && (statusTab ===-1 || statusTab===4)"
                v-model="scope.row.contentValue"
                :decimal="2"
                :min="0.01"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkPrice(scope.row,true,1,null,'contentValue',e.contentValue)"/>
              <span v-if="activityAttendDetail.refType===2 && (statusTab===1 || statusTab===2||statusTab===3)">
                ¥{{ scope.row.contentValue }}
              </span>
            </template>
            <template slot="reservedQuantity" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===1 && (statusTab===-1 || statusTab===4) && promotionDetail.promotionType === 13"
                v-model="scope.row.bookNum"
                :decimal="2"
                :min="0.01"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkLimit(e,true,null,'bookNum',e.bookNum)"/>
              <span v-if="activityAttendDetail.refType===1 && (statusTab===1 || statusTab===2||statusTab===3) && promotionDetail.promotionType === 13">
                {{ scope.row.bookNum }}
              </span>
            </template>
            <template slot="presellTotalPrice" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===1 && (statusTab===-1 || statusTab===4) && promotionDetail.promotionType === 13"
                v-model="scope.row.presellTotalPrice"
                :decimal="2"
                :min="0.01"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkPrice(scope.row,true,2,null,'presellTotalPrice',scope.row.presellTotalPrice)"/>
              <span v-if="activityAttendDetail.refType===1 && (statusTab===1 || statusTab===2||statusTab===3) && promotionDetail.promotionType === 13">
                ¥{{ scope.row.presellTotalPrice }}
              </span>
            </template>
            <template slot="presellDownPrice" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===1 && (statusTab===-1 || statusTab===4) && promotionDetail.promotionType === 13"
                v-model="scope.row.presellDownPrice"
                :decimal="2"
                :min="0.01"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkPrice(scope.row,true,3,null,'presellDownPrice',scope.row.presellDownPrice)"/>
              <span v-if="activityAttendDetail.refType===1 && (statusTab===1 || statusTab===2||statusTab===3) && promotionDetail.promotionType === 13">
                ¥{{ scope.row.presellDownPrice }}
              </span>
            </template>
            <template slot="presellOffsetPrice" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===1 && (statusTab===-1 || statusTab===4) && promotionDetail.promotionType === 13"
                v-model="scope.row.presellOffsetPrice"
                :decimal="2"
                :min="0.01"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkPrice(scope.row,true,4,null,'presellOffsetPrice',scope.row.presellOffsetPrice)"/>
              <span v-if="activityAttendDetail.refType===1 && (statusTab===1 || statusTab===2||statusTab===3) && promotionDetail.promotionType === 13">
                ¥{{ scope.row.presellOffsetPrice }}
              </span>
            </template>
            <template slot="priceStartingPrice" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===3 && (statusTab===-1 || statusTab===4)"
                v-model="scope.row.startPrice"
                :decimal="2"
                :min="0.01"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkPrice(scope.row,true,1,null,'startPrice',scope.row.startPrice)"/>
              <span v-if="activityAttendDetail.refType===3 && (statusTab===1 || statusTab===2 || statusTab===3)">
                ¥{{ scope.row.startPrice }}
              </span>
            </template>
            <template slot="cutOffPrice" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===3 && (statusTab===-1 || statusTab===4)"
                v-model="scope.row.endPrice"
                :decimal="2"
                :min="0.01"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkPrice(e,true,2,null,'endPrice',e.endPrice)"/>
              <span v-if="activityAttendDetail.refType===3 && (statusTab===1 || statusTab===2 || statusTab===3)">
                ¥{{ scope.row.endPrice }}
              </span>
            </template>
            <template slot="personalSingleChannelPurchase1" slot-scope="scope">
              <ody-input-number
                v-if="scope.row.flow && activityAttendDetail.refType === 1 && (statusTab === -1 || statusTab === 4) && (promotionDetail.promotionType === 1 || promotionDetail.promotionType === 7 || promotionDetail.promotionType === 13)"
                v-model="scope.row.channelIndividualLimit"
                :min="1"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkLimit(scope.row,null,null,'channelIndividualLimit',scope.row.channelIndividualLimit)"/>
              <span v-if="activityAttendDetail.refType===1 && (statusTab===1 || statusTab===2||statusTab===3) && (promotionDetail.promotionType === 1 || promotionDetail.promotionType === 7 || promotionDetail.promotionType === 13)">
                {{ scope.row.channelIndividualLimit }}
              </span>
            </template>
            <template slot="personalSingleChannelPurchase2" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===3 && (statusTab===-1 || statusTab===4)"
                v-model="scope.row.channelIndividualLimit"
                :min="1"
                :max="999999"
                name="scope_row_contentValue"
                @blur="checkLimit(scope.row,null,null,'channelIndividualLimit',scope.row.channelIndividualLimit)"/>
              <span v-if="activityAttendDetail.refType===3 && (statusTab===1 || statusTab===2||statusTab===3)">
                {{ scope.row.channelIndividualLimit }}
              </span>
            </template>
            <template slot="merchantSingleChannelPurchase1" slot-scope="scope">
              <ody-input-number
                v-if="scope.row.flow && activityAttendDetail.refType===1 && ((statusTab===-1 || statusTab===4)) && (promotionDetail.promotionType === 1 || promotionDetail.promotionType === 7 || promotionDetail.promotionType === 13)"
                v-model="scope.row.channelMerchantLimit"
                :min="1"
                :max="999999"
                name="scope_row_contentValue"
                @init="cutPriceStockLimitInit(scope.row)"
                @blur="checkLimit(scope.row,null,null,'channelMerchantLimit',scope.row.channelMerchantLimit)"/>
              <span v-if="activityAttendDetail.refType===1 && (statusTab===1 || statusTab===2||statusTab===3) && (promotionDetail.promotionType === 1 || promotionDetail.promotionType === 7 || promotionDetail.promotionType === 13)">
                {{ scope.row.channelMerchantLimit }}
              </span>
            </template>
            <template slot="merchantSingleChannelPurchase2" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===2 && (statusTab===-1 || statusTab===4)"
                v-model="scope.row.channelMerchantLimit"
                :min="1"
                :max="999999"
                name="scope_row_contentValue"
                @init="cutPriceStockLimitInit(scope.row)"
                @blur="checkLimit(scope.row,null,null,'channelMerchantLimit',scope.row.channelMerchantLimit)"/>
              <span v-if="activityAttendDetail.refType===2 && (statusTab===1 || statusTab===2||statusTab===3)">
                {{ scope.row.channelMerchantLimit }}
              </span>
            </template>
            <template slot="merchantSingleChannelPurchase3" slot-scope="scope">
              <ody-input-number
                v-if="activityAttendDetail.refType===3 && (statusTab===-1 || statusTab===4)"
                v-model="scope.row.channelMerchantLimit"
                :min="1"
                :max="999999"
                name="scope_row_contentValue"
                @init="cutPriceStockLimitInit(scope.row)"
                @blur="checkLimit(scope.row,null,null,'channelMerchantLimit',scope.row.channelMerchantLimit)"/>
              <span v-if="activityAttendDetail.refType===3 && (statusTab===1 || statusTab===2||statusTab===3)">
                {{ scope.row.channelMerchantLimit === 0 ? '' : scope.row.channelMerchantLimit }}
              </span>
            </template>
            <template slot="auditStatus" slot-scope="scope">
              <span>{{ getStatusTextById(scope.row.status) }}</span>
              <span v-if="scope.row.remark &&(scope.row.status===4 || scope.row.status === 0)">{{ scope.row.remark }} </span>
            </template>
          </ody-table>
          <div class="row text-center" style="margin-bottom: 30px;" ng-show="statusTab==4 || statusTab==-1">
            <ody-button v-if="statusTab==4 || statusTab==-1" name="RegistrationApply_queryPromotionMutexList" size="small" type="primary" code="RegistrationApply" @click="queryPromotionMutexList">{{ $t('申请报名') }}</ody-button>
          </div>
        </div>
      </ody-list-table-area>

      <registration-mutex-product-dialog
        v-if="visibleProductDialog"
        :visible.sync="visibleProductDialog"
        :table-data="mutexList"
        @success="deleteMutexExistMp"
        @deleteMutxMp="deleteMutexMp"
        @queryProduct="queryPromotionMutexList"
      />
      <registration-product-dialog-choose
        v-if="goodsVisible"
        :visible.sync="visibleMutex"
        :multiple="true"
        :params="selectionMPQueryContent"
        choose-key="code"
        @cancel="clearParam"
        @ok="addSelectedMP"
      />
    </div>
  </div>
</template>

<script>
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'
import RegistrationMutexProductDialog from '@/components/registration-mutex-product-dialog'
import RegistrationProductDialogChoose from '@/components/registration-product-dialog-choose'

import util from '@/utils/util'
export default {
  components: {
    PromotionGoodsDialogChoose,
    RegistrationMutexProductDialog,
    RegistrationProductDialogChoose
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
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
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isLoaded: false,
      id: '',
      promotionId: '',
      activityId: '',
      viewFlag: '',
      refType: '',
      merchantId: '',
      importParams: {
        activityAttendId: '',
        activityAttendRecordId: '',
        refType: '',
        promotionType: '',
        promotionMethod: ''
      },
      importModel: {
        importApi: ['back-promotion-web', 'applyActivityUpload', 'importExcel.do', this.importParams]
      },
      mutexQueryContent: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {}
      },
      selectionMPQueryContent: {
      },
      statusArr: [{ 'id': -1, 'text': '待提交' },
        { 'id': 0, 'text': '促销参数审核未通过' },
        { 'id': 1, 'text': '待设置促销参数' },
        { 'id': 2, 'text': '待财务审核' },
        { 'id': 3, 'text': '已进入促销活动' },
        { 'id': 4, 'text': '财务审核未通过' }
      ],
      attendId: '',
      addFlag: false,
      attendRecordId: '',
      imgPic: {},
      scopeItemId: '',
      visibleMutex: false,
      visibleProductDialog: false,
      useAppendList: [],
      mpTableListTotal: '',
      mutexTableListTotal: '',
      statusTab: -2,
      statusTabStr: '-2',
      mpDelRequest: {
        selectionList: []
      },
      mpAddRequest: {
        selectionList: []
      },
      mutexList: {
        page: {
          currentPage: 1,
          itemsPerPage: 10,
          total: 0
        },
        data: []
      }, // 促销限制列表
      queryContent: {
        obj: {}
      },
      groupDetail: {},
      operateModel: '',
      settlementPriceShowConfig: false,
      merchantAuditArr: [
        { 'id': '0', 'text': '待商家审核' },
        { 'id': '1', 'text': '待设置参数' }],
      platformAuditArr: [
        { 'id': '0', 'text': '待平台审核' },
        { 'id': '1', 'text': '待财务审核' }],
      canOrderStartNumShow: '0',
      canOrderMultipleShow: '0',
      channelCodeArrs: [],
      promotionDetail: {},
      activityAttendDetail: {},
      attendRecordDetail: {},
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
          mpCode: '',
          mpName: ''
        }
      },
      listTable: {
        requestUrl: '/back-promotion-web/applyActivityRead/queryAttendMpList.action',
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'code',
            minWidth: 150, show: true
          },
          {
            label: this.$t('商品名称'),
            slot: 'mpName',
            minWidth: 100, show: true
          },
          {
            label: this.$t('市场价'),
            slot: 'salePrice',
            minWidth: 100,
            show: this.settlementPriceShowConfig
          },
          {
            label: this.$t('商品条码'),
            prop: 'barCode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('原结算价'),
            slot: 'originalSettlePrice',
            minWidth: 120,
            show: () => this.settlementPriceShowConfig
          },
          {
            label: this.$t('活动结算价'),
            slot: 'settlementPrice',
            minWidth: 120,
            show: this.settlementPriceShowConfig
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('原价'),
            slot: 'salePrice',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品起订量'),
            slot: 'orderStartNum',
            show: this.canOrderStartNumShow === '1'
          },
          {
            label: this.$t('商品起订倍数'),
            slot: 'orderMultiple',
            minWidth: 120,
            show: this.canOrderMultipleShow === '1'
          },
          // 促销折扣、特价、减价显示
          {
            labelSlot: 'labelPromotionText',
            slot: 'promotionPrice',
            minWidth: 120,
            show: () => {
              return this.activityAttendDetail.refType === 1 && this.statusTab !== -2 && (this.promotionDetail.promotionType === 1 || this.promotionDetail.promotionType === 7)
            }
          },
          {
            labelSlot: 'pPurchase',
            slot: 'personalSingleChannelPurchase1',
            minWidth: 120,
            show: () => {
              return this.activityAttendDetail.refType === 1 && this.statusTab !== -2 && (this.promotionDetail.promotionType === 1 || this.promotionDetail.promotionType === 7 || this.promotionDetail.promotionType === 13)
            }
          },
          {
            labelSlot: 'pPurchase',
            slot: 'personalSingleChannelPurchase2',
            minWidth: 120,
            show: () => {
              return this.activityAttendDetail.refType === 3 && this.statusTab !== -2
            }
          },
          // 活动库存量显示判断(秒杀、拼团、砍价)
          {
            labelSlot: 'mPurchase',
            slot: 'merchantSingleChannelPurchase1',
            minWidth: 120,
            show: () => {
              return this.activityAttendDetail.refType === 1 && this.statusTab !== -2 && (this.promotionDetail.promotionType === 1 || this.promotionDetail.promotionType === 7 || this.promotionDetail.promotionType === 13)
            }
          },
          {
            labelSlot: 'mPurchase',
            slot: 'merchantSingleChannelPurchase2',
            minWidth: 120,
            show: () => {
              return this.activityAttendDetail.refType === 2 && this.statusTab !== -2
            }
          },
          {
            labelSlot: 'mPurchase',
            slot: 'merchantSingleChannelPurchase3',
            minWidth: 120,
            show: () => {
              return this.activityAttendDetail.refType === 3 && this.statusTab !== -2
            }
          },
          {
            label: this.$t('审核状态'),
            slot: 'auditStatus',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 120,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              hidden: (index, row) => {
                const show = this.statusTab === -1 && !this.disabled

                return !show
              },
              method: (index, row) => {
                this.delSelectedMerchantProduct(row)
              },
              code: 'ui'
            }
          ]
        },
        checkedList: [],
        page: {
          currentPage: 1,
          itemsPerPage: 10,
          total: 0
        },
        data: []
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
  computed: {
    getColumns() {
      const rtv = []

      // console.log('rtv', rtv)

      return rtv
    },
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
    this.promotionId = this.params.refThemeId
    this.activityId = this.params.id
    this.viewFlag = this.params.viewFlag
    this.refType = this.params.refType
    this.merchantId = this.params.merchantId
    this.id = this.params.id
    this.importParams.refType = this.refType
    this.statusTab = -1
    this.getChannelMap()
    await this.initDictionary()
    await this.queryApplyActivityDetail()
    this.isLoaded = true
  },
  methods: {
    mpTableResponse(res) {
      const {
        data: { listObj }
      } = res

      const listData = listObj || []
      this.useAppendList = this.$portal.deepClone(listData)
      listData.forEach(x => {
        x.id = x.mpId
        x.flow = true
        // 如果是系列品
        if (x.typeOfProduct === 3) {
          x.hasChildren = true
        }
      })

      return res
    },
    async initDictionary() {
      // 结算价是否显示
      const self = this
      const result = await self.promotionAPI.loadSettlementPriceConfig()

      if (result.code === '0') {
        this.settlementPriceShowConfig = result.data
      }
      self.canOrderStartNumShow = '0'
      self.canOrderMultipleShow = '0'
      self.promotionAPI
        .getLoadPageConfigCommonOscUrl('PAGE_CONFIG_NOT_SAME')
        .then(result => {
          if (result.data.CAN_ORDER_START_NUM_SHOW !== undefined && result.data.CAN_ORDER_START_NUM_SHOW.length !== 0) {
            self.canOrderStartNumShow = result.data.CAN_ORDER_START_NUM_SHOW
          }
          if (result.data.CAN_ORDER_MULTIPLE_SHOW !== undefined && result.data.CAN_ORDER_MULTIPLE_SHOW.length !== 0) {
            self.canOrderMultipleShow = result.data.CAN_ORDER_MULTIPLE_SHOW
          }
        })
      self.promotionAPI
        .getLoadPageConfigCommonOscUrl('APPLY_ACTIVITY_PAGE')
        .then(result => {
          // 活动类型
          self.applyFirstAudit = result.data.applyFirstAudit
          self.applySecondAudit = result.data.applySecondAudit
          self.operateModel = result.data.operateModel
        })
    },
    async loadChildren(tree, treeNode, resolve) {
      var condition = {
        'recordId': this.id,
        'mpId': treeNode.mpId,
        'refType': this.activityAttendDetail.refType
      }
      if (this.activityAttendDetail.refType === 1) {
        condition.contentType = this.promotionDetail.promotionMethod
      }
      const res = await this.promotionAPI.getChildMpSelectedList(condition)

      res.data && res.data.forEach(item => {
        item.disable = true
        item.id = item.mpId
      })

      resolve(res.data)
    },
    getStatusTextById(status) {
      if (status === 1) {
        for (var i = 0; i < this.merchantAuditArr.length; i++) {
          if (this.merchantAuditArr[i]['id'] === this.applyFirstAudit) {
            return this.merchantAuditArr[i]['text']
          }
        }
      } else if (status === 2) {
        for (var j = 0; j < this.platformAuditArr.length; j++) {
          if (this.platformAuditArr[j]['id'] === this.applySecondAudit) {
            return this.platformAuditArr[j]['text']
          }
        }
      } else if (status === 0) {
        if (this.applyFirstAudit === '0') {
          return this.$t('商家审核未通过')
        } else {
          return this.$t('促销参数审核未通过')
        }
      } else if (status === 4) {
        if (this.applySecondAudit === '0') {
          return this.$t('平台审核未通过')
        } else {
          return this.$t('财务审核未通过')
        }
      }
      for (var k = 0; k < this.statusArr.length; k++) {
        if (this.statusArr[k]['id'] === status) {
          return this.statusArr[k]['text']
        }
      }
    },
    async getChannelMap() {
      const { data } = await this.$api.channel.queryChannelMap({})
      this.channelCodeArrs = data
    },
    // 导出所有的报名记录对应的商品
    exportAllMps(status) {
      var url = '/api/back-promotion-web/applyActivityRead/exportAllApplyMp.do'
      url = url + '?activityAttendId=' + this.attendId + '&activityAttendRecordId=' + this.attendRecordId + '&status=' + status
      if (this.activityAttendDetail.refType) {
        url = url + '&refType=' + this.activityAttendDetail.refType
      }
      if (this.activityAttendDetail.promotionType) {
        url = url + '&promotionType=' + this.activityAttendDetail.promotionType
        if (this.promotionDetail.promotionMethod) {
          url = url + '&promotionMethod=' + this.promotionDetail.promotionMethod
        }
      }
      this.$portal.downloadFileByGet(
        url
      )
    },
    // 添加商品
    addSelectedMP(val) {
      const self = this
      self.mpAddRequest.selectionList = val.map(item => {
        return {
          name: item.name,
          code: item.code,
          mpId: item.id,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          typeOfProduct: item.typeOfProduct,
          productId: item.productId
        }
      })
      self.addFlag = true
      if (util.isEmpty(this.mpAddRequest.selectionList)) {
        self.addFlag = false
        self.$message.warn('请选择需要添加的商品')
      } else {
        self.saveMPSelection(this.mpAddRequest.selectionList, function(result) {
          self.addFlag = false
          self.goodsVisible = false
          self.queryAttendMpList()
        }, function(result) {
          self.addFlag = false
        })
      }
    },
    exportSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('导入成功!')
      })
      this.queryAttendMpList()
    },
    // 保存选品
    async saveMPSelection(selectedList, callbackYes, callbackNo) {
      var updateContent = {}
      updateContent.activityAttendId = this.attendId
      updateContent.activityAttendRecordId = this.attendRecordId
      updateContent.mobile = this.activityAttendDetail.attendRecord.mobile
      updateContent.mpDetailList = selectedList
      this.promotionAPI.saveRegistrationMPSelection(updateContent).then(result => {
        if (result.code === '0') {
          callbackYes(result)
        } else {
          callbackNo(result)
        }
      })
    },
    clearParam() {
      this.selectionMPQueryContent = {}
      this.selectionMPQueryContent.activityRecordId = this.attendRecordId
      this.selectionMPQueryContent.activityId = this.activityId
      this.goodsVisible = false
    },
    getPromContentTypeText() {
      if (this.promotionDetail.promotionMethod === 1 || this.promotionDetail.promotionType === 7) {
        return this.$t('促销特价')
      } else if (this.promotionDetail.promotionMethod === 2) {
        return this.$t('促销折扣')
      } else if (this.promotionDetail.promotionMethod === 3) {
        return this.$t('促销直降')
      }
    },
    // 删除已选商品
    async delSelectedMerchantProduct(data, flag, parent) {
      const self = this
      if (data.status === -1 || data.status === 0 || data.status === 4) {
        self.mpDelRequest.selectionList = []
        var temp = {}
        temp.salesPrice = data.salesPrice
        temp.name = data.name
        temp.code = data.code
        temp.mpId = data.mpId
        temp.categoryId = data.categoryId
        temp.categoryName = data.categoryName

        self.mpDelRequest.selectionList.push(temp)
        self.delSelection(self.mpDelRequest.selectionList, function(result) {
          if (flag === 1) {
            var condition = {
              'recordId': this.id,
              'mpId': this.mpId,
              'refType': this.activityAttendDetail.refType
            }
            if (this.activityAttendDetail.refType === 1) {
              condition.contentType = this.promotionDetail.promotionMethod
            }
            this.promotionAPI.getChildMpSelectedList(condition).then(res => {
              if (res.code === '0') {
                parent.childMpList = res.data
              }
            })
          } else {
            self.queryAttendMpList()
          }
        })
      }
    },
    // 撤出待设置参数商品
    vacateSelection() {
      const self = this
      if (util.isEmpty(this.listTable.checkedList)) {
        self.$message({
          type: 'warn',
          message: self.$t('请选择需要撤出的产品!')
        })
      } else {
        var delContent = {}
        delContent.activityAttendId = this.attendId
        delContent.activityAttendRecordId = this.attendRecordId
        delContent.status = -1	// 设置成待提交状态
        delContent.mpDetailList = this.listTable.checkedList
        this.promotionAPI.updateMPStatusSelection(delContent).then(result => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('撤回成功!')
            })
            this.queryAttendMpList()
          }
        })
      }
    },
    // 批量删除商品
    delAllSelectedMerchantProduct() {
      const self = this
      if (util.isEmpty(this.listTable.checkedList)) {
        self.$message({
          type: 'warn',
          message: self.$t('请选择需要删除的商品!')
        })
      } else {
        self.delSelection(self.listTable.checkedList, function(result) {
          self.queryAttendMpList()
        })
      }
    },
    // 删除商品
    delSelection(selectedList, callback) {
      var delContent = {}
      delContent.activityAttendId = this.attendId
      delContent.activityAttendRecordId = this.attendRecordId
      delContent.mpDetailList = selectedList
      this.promotionAPI.deleteMPSelection(delContent).then(result => {
        callback(result)
      })
    },
    // 删除互斥商品
    deleteMutexMp() {
      var data = {}
      data.obj = {}
      data.currentPage = 1
      data.itemsPerPage = 10000
      data.obj.promotionId = this.promotionId
      data.obj.activityAttendRecordId = this.attendRecordId
      data.obj.status = this.statusTab
      this.promotionAPI.deleteMutexMpList(data).then(res => {
        this.closeActivityMutexModal()
        // this.selectedMPQueryContent.currentPage = 1;
        this.queryAttendMpList()
      })
    },
    deleteMutexExistMp() {
      this.$confirm(this.$t('继续提交会导致与该批商品在之前互斥的活动中不生效'), this.$t('提示'), {
        confirmButtonText: this.$t('是否确认继续提交？'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        var data = {}
        data.obj = {}
        data.currentPage = 1
        data.itemsPerPage = 10000
        data.obj.promotionId = this.promotionId
        data.obj.activityAttendId = this.attendId
        data.obj.activityAttendRecordId = this.attendRecordId
        this.promotionAPI.deleteMutexExistMpList(data).then(res => {
          this.closeActivityMutexModal()
          // this.selectedMPQueryContent.currentPage = 1;
          this.queryAttendMpList()
        })
      }).catch(() => {
      })
    },
    // 关闭互斥弹窗
    closeActivityMutexModal() {
      this.mutexList.data = []
      this.visibleMutex = false
    },
    buttonInListDisabled(e) {
      var disabledFlag = false
      disabledFlag = (this.viewFlag === 0)
      disabledFlag = disabledFlag || (e.status > 0 && e.status !== 4)
      return !disabledFlag
    },
    unbuttonInListDisabled(e) {
      return !this.buttonInListDisabled(e)
    },
    showUploadImg() {
      return this.groupDetail.type === 1
    },
    // 查询互斥商品
    async queryPromotionMutexList() {
      if (this.showUploadImg()) {
        if (util.isEmpty(this.imgPic.mpPicUrl)) {
          this.$message.warn('图片必须上传')
          return
        }
      }
      this.mutexQueryContent.obj.activityAttendId = this.attendId
      this.mutexQueryContent.obj.activityAttendRecordId = this.attendRecordId
      this.mutexQueryContent.obj.mobile = this.activityAttendDetail.attendRecord.mobile
      this.mutexQueryContent.obj.checkParams = 1
      this.mutexQueryContent.obj.status = this.statusTab
      this.mutexQueryContent.currentPage = this.mutexList.page.currentPage
      this.mutexQueryContent.itemsPerPage = this.mutexList.page.itemsPerPage
      if (this.activityAttendDetail.refType === 1) {
        this.mutexQueryContent.obj.contentType = this.promotionDetail.promotionMethod
      }
      const { data = {}, code } = await this.promotionAPI.merchantApplyMPMutexList(this.mutexQueryContent)
      if (code === '0') {
        if (data.listObj.length === 0) {
          // todo 审核通过弹窗
          this.$message({
            type: 'success',
            message: this.$t('操作成功!')
          })
          this.queryAttendMpList()
          this.closeActivityMutexModal()
        } else {
          this.visibleProductDialog = true
          this.mutexList.data = data.listObj
          this.mutexList.page.total = data.total
        }
      }
    },
    handleSizeChange() {
      this.queryAttendMpList()
    },
    cutPriceStockLimitInit(e) {
      if (e != null) {
        if (e.stockLimit === null) {
          e.stockLimit = e.stock === 0 ? null : e.stock
        } else if (e.stockLimit === 0) {
          e.stockLimit = null
        }
      }
    },
    // 校验价格（单一、预售、拼团、砍价），实时保存价格
    checkPrice(data, isVirtual, index, parent, field, fieldValue) {
      if (this.activityAttendDetail.refType === 1) {
        if (this.promotionDetail.promotionType === 1 || this.promotionDetail.promotionType === 13) {
          if (this.promotionDetail.promotionMethod === 1) { // 促销
            if (!util.isEmpty(data.contentValue)) {
              if (!util.validatePrice(data.contentValue)) {
                this.$message({
                  type: 'warn',
                  message: this.$t('价格最多输入2位小数')
                })
                return
              }
              if (isVirtual) {
                if (!util.isEmpty(data.childMpList)) {
                  data.childMpList.forEach(item => {
                    item.contentValue = data.contentValue
                  })
                }
              }
            }
            if (!isVirtual) {
              if (!util.isEmpty(parent.childMpList)) {
                var minPrice = 0
                parent.childMpList.forEach(item => {
                  if (minPrice * 1.0 < item.contentValue && minPrice === 0) {
                    minPrice = item.contentValue
                  }
                  if (minPrice * 1.0 > item.contentValue * 1.0) {
                    minPrice = item.contentValue
                  }
                })
                if (minPrice > 0) {
                  parent.contentValue = minPrice
                }
              }
            }
          } else if (this.promotionDetail.promotionMethod === 2) {
            if (!util.isEmpty(data.contentValue)) {
              if (!util.validateDiscount(data.contentValue)) {
                this.$message({
                  type: 'warn',
                  message: this.$t('折扣必须是0-10之间的最多1位小数')
                })
                return
              }
              if (isVirtual) {
                if (!util.isEmpty(data.childMpList)) {
                  data.childMpList.forEach(item => {
                    item.contentValue = data.contentValue
                  })
                }
              }
            }
            if (!isVirtual) {
              if (!util.isEmpty(parent.childMpList)) {
                var minPrice1 = 0
                parent.childMpList.forEach(d => {
                  if (!util.isEmpty(d.contentValue)) {
                    if (minPrice1 * 1.0 < d.contentValue && minPrice1 === 0) {
                      minPrice1 = d.contentValue
                    }
                    if (minPrice1 * 1.0 > d.contentValue * 1.0) {
                      minPrice1 = d.contentValue
                    }
                  }
                })
                if (minPrice1 > 0) {
                  parent.contentValue = minPrice1
                }
              }
            }
          } else if (this.promotionDetail.promotionMethod === 3) {
            if (!util.isEmpty(data.contentValue)) {
              if (!util.validatePrice(data.contentValue)) {
                this.$message({
                  type: 'warn',
                  message: this.$t('直降最多输入2位小数')
                })
                return
              }
              if (isVirtual) {
                if (!util.isEmpty(data.childMpList)) {
                  data.childMpList.forEach(d => {
                    d.contentValue = data.contentValue
                  })
                }
              }
            }
            if (!isVirtual) {
              if (!util.isEmpty(parent.childMpList)) {
                var minPrice2 = 0
                parent.childMpList.forEach(d => {
                  if (!util.isEmpty(d.contentValue)) {
                    if (minPrice2 * 1.0 < d.contentValue && minPrice2 === 0) {
                      minPrice2 = d.contentValue
                    }
                    if (minPrice2 * 1.0 > d.contentValue * 1.0) {
                      minPrice2 = d.contentValue
                    }
                  }
                })
                if (minPrice2 > 0) {
                  parent.contentValue = minPrice2
                }
              }
            }
          } else if (this.promotionDetail.promotionType === 13) {
            if (!util.isEmpty(data.bookNum)) {
              if (!util.validateNum(data.bookNum)) {
                this.$message({
                  type: 'warn',
                  message: this.$t('已预订数量必须为正整数')
                })
                return
              }
            }
            if (!util.isEmpty(data.presellTotalPrice)) {
              if (!util.validatePrice(data.presellTotalPrice)) {
                this.$message({
                  type: 'warn',
                  message: this.$t('价格最多输入两位小数')
                })
                return
              }
            }
            if (!util.isEmpty(data.presellDownPrice)) {
              if (!util.validatePrice(data.presellDownPrice)) {
                this.$message({
                  type: 'warn',
                  message: this.$t('价格最多输入两位小数')
                })
                return
              }
            }
            if (!util.isEmpty(data.presellOffsetPrice)) {
              if (!util.validatePrice(data.presellOffsetPrice)) {
                this.$message({
                  type: 'warn',
                  message: this.$t('价格最多输入两位小数')
                })
                return
              }
            }
            if (!util.isEmpty(data.presellOffsetPrice) && !util.isEmpty(data.presellDownPrice)) {
              if (data.presellOffsetPrice * 1.0 < data.presellDownPrice * 1.0) {
                this.$message({
                  type: 'warn',
                  message: this.$t('定金抵扣金额不能小于定金')
                })
                return
              }
            }
            if (!util.isEmpty(data.presellTotalPrice) && !util.isEmpty(data.presellDownPrice)) {
              if (data.presellTotalPrice * 1.0 < data.presellDownPrice * 1.0) {
                this.$message({
                  type: 'warn',
                  message: this.$t('定金不能大于预售价')
                })
                return
              }
            }
            if (!util.isEmpty(data.presellTotalPrice) && !util.isEmpty(data.presellOffsetPrice)) {
              if (data.presellTotalPrice * 1.0 < data.presellOffsetPrice * 1.0) {
                this.$message({
                  type: 'warn',
                  message: this.$t('定金抵扣金额不能大于预售价')
                })
                return
              }
            }
            if (index === 2) {
              if (isVirtual) {
                if (!util.isEmpty(data.childMpList)) {
                  data.childMpList.forEach(d => {
                    d.presellTotalPrice = data.presellTotalPrice
                  })
                }
              }
            }
            if (index === 3) {
              if (isVirtual) {
                if (!util.isEmpty(data.childMpList)) {
                  data.childMpList.forEach(d => {
                    d.presellDownPrice = data.presellDownPrice
                  })
                }
              }
            }
            if (index === 4) {
              if (isVirtual) {
                if (!util.isEmpty(data.childMpList)) {
                  data.childMpList.forEach(d => {
                    d.presellOffsetPrice = data.presellOffsetPrice
                  })
                }
              }
            }
            if (!isVirtual) {
              if (!util.isEmpty(parent.childMpList)) {
                var minPrice3 = 0
                var p = {}
                parent.childMpList.forEach(d => {
                  if (!util.isEmpty(d.presellTotalPrice)) {
                    if (minPrice * 1.0 < d.presellTotalPrice && minPrice === 0) {
                      minPrice = d.presellTotalPrice
                      p = d
                    }
                    if (minPrice * 1.0 > d.presellTotalPrice * 1.0) {
                      minPrice = d.presellTotalPrice
                      p = d
                    }
                  }
                })
                if (minPrice3 > 0) {
                  parent.presellTotalPrice = minPrice
                  if (!util.isEmpty(p.presellDownPrice)) {
                    parent.presellDownPrice = p.presellDownPrice
                  }
                  if (!util.isEmpty(p.presellOffsetPrice)) {
                    parent.presellOffsetPrice = p.presellOffsetPrice
                  }
                  if (!util.isEmpty(p.bookNum)) {
                    parent.bookNum = p.bookNum
                  }
                }
              }
            }
          }
        }
      } else if (this.activityAttendDetail.refType === 2) { // 拼团
        if (!util.isEmpty(data.contentValue)) {
          if (!util.validatePrice(data.contentValue)) {
            this.$message({
              type: 'warn',
              message: this.$t('拼团价最多输入2为小数')
            })
            return
          }
          if (isVirtual) {
            if (!util.isEmpty(data.childMpList)) {
              data.childMpList.forEach(d => {
                d.contentValue = data.contentValue
              })
            }
          }
        }
        if (!isVirtual) {
          if (!util.isEmpty(parent.childMpList)) {
            var minPrice5 = 0
            parent.childMpList.forEach(d => {
              if (!util.isEmpty(d.contentValue)) {
                if (minPrice5 * 1.0 < d.contentValue && minPrice5 === 0) {
                  minPrice5 = d.contentValue
                }
                if (minPrice5 * 1.0 > d.contentValue * 1.0) {
                  minPrice5 = d.contentValue
                }
              }
            })
            if (minPrice5 > 0) {
              parent.contentValue = minPrice5
            }
          }
        }
      } else if (this.activityAttendDetail.refType === 3) { // 砍价
        if (!util.isEmpty(data.startPrice)) {
          if (!util.validatePrice(data.startPrice)) {
            this.$message({
              type: 'warn',
              message: this.$t('砍价起始价最多输入2位小数')
            })
            return
          }
          if (index === 1) {
            if (isVirtual) {
              if (!util.isEmpty(data.childMpList)) {
                data.childMpList.forEach(d => {
                  d.startPrice = data.startPrice
                })
              }
            }
          }
        }
        if (!util.isEmpty(data.endPrice)) {
          if (!util.validatePrice(data.endPrice)) {
            this.$message({
              type: 'warn',
              message: this.$t('砍价截止价最多输入最多输入2位小数')
            })
            return
          }
          if (data.endPrice * 1 >= data.startPrice * 1) {
            this.$message({
              type: 'warn',
              message: this.$t('砍价截止价必须小于砍价起始价')
            })
            return
          }
          if (data.endPrice * 1 <= 0) {
            this.$message({
              type: 'warn',
              message: this.$t('砍价截止价必须大于0')
            })
            return
          }
          if (index === 2) {
            if (isVirtual) {
              if (!util.isEmpty(data.childMpList)) {
                data.childMpList.forEach(d => {
                  d.endPrice = data.endPrice
                })
              }
            }
          }
        }
        if (!isVirtual) {
          if (!util.isEmpty(parent.childMpList)) {
            var minPrice7 = 0
            var p1 = {}
            parent.childMpList.forEach(d => {
              if (!util.isEmpty(d.endPrice)) {
                if (minPrice7 * 1.0 < d.endPrice && minPrice7 === 0) {
                  minPrice7 = d.endPrice
                  p1 = d
                }
                if (minPrice7 * 1.0 > d.endPrice * 1.0) {
                  minPrice7 = d.endPrice
                  p1 = d
                }
              }
            })
            if (minPrice7 > 0) {
              parent.endPrice = minPrice7
              if (!util.isEmpty(p1.startPrice)) {
                parent.startPrice = p1.startPrice
              }
            }
          }
        }
      }
      if (util.isEmpty(fieldValue)) {
        fieldValue = null
      }
      if (!util.isEmpty(field)) {
        var saveCondition = {
          'mpId': data.mpId,
          'activityAttendId': this.id,
          'name': field,
          'value': fieldValue,
          'typeOfProduct': data.typeOfProduct
        }
        // 更新子品时要实时更新虚品，更新虚品也要更新子品（在后台处理）
        if (!util.isEmpty(parent)) {
          saveCondition.isParent = false
          saveCondition.parentValue = parent[field]
          if (field === 'contentValue' && !util.isEmpty(parent[field])) {
            if (this.activityAttendDetail.refType === 1 && this.promotionDetail.promotionMethod === 2) {
              saveCondition.parentValue = util.multiply10(saveCondition.parentValue)
            } else {
              saveCondition.parentValue = util.multiply100(saveCondition.parentValue)
            }
          }
          saveCondition.parentMpId = parent.mpId
        }
        if (field === 'contentValue' && !util.isEmpty(fieldValue)) {
          if (this.activityAttendDetail.refType === 1 && this.promotionDetail.promotionMethod === 2) {
            saveCondition.value = util.multiply10(saveCondition.value)
          } else {
            saveCondition.value = util.multiply100(saveCondition.value)
          }
        }
        if (saveCondition.value) {
          this.promotionAPI.realTimeSave(saveCondition)
        }
      }
    },
    checkLimit(data, isVirtual, parent, field, fieldValue) {
      if (this.activityAttendDetail.refType === 1) {
        if (this.promotionDetail.promotionType === 1) {
          if (!util.isEmpty(data.individualLimit) && !util.validateNum(data.individualLimit)) {
            this.$message({
              type: 'warn',
              message: this.$t('个人限购数必须为正整数')
            })
            return
          }
          if (this.promotionDetail.isSeckill === 1 && !util.isEmpty(data.stockLimit) && !util.validateNum(data.stockLimit)) {
            this.$message({
              type: 'warn',
              message: this.$t('活动库存量必须为正整数')
            })
            return
          }
        }
        if (this.promotionDetail.promotionType === 13) {
          if (!util.isEmpty(data.bookNum) && !util.validateNum(data.bookNum)) {
            this.$message({
              type: 'warn',
              message: this.$t('已预订数量必须为正整数')
            })
            return
          }
          if (!util.isEmpty(data.bookNum)) {
            if (isVirtual) {
              if (!util.isEmpty(data.childMpList)) {
                data.childMpList.forEach(d => {
                  d.bookNum = data.bookNum
                })
              }
            }
          }
          if (!isVirtual) {
            if (!util.isEmpty(parent.childMpList)) {
              var minPrice = 0
              var p = {}
              parent.childMpList.forEach(d => {
                if (!util.isEmpty(d.presellTotalPrice)) {
                  if (minPrice * 1.0 < d.presellTotalPrice && minPrice === 0) {
                    minPrice = d.presellTotalPrice
                    p = d
                  }
                  if (minPrice * 1.0 > d.presellTotalPrice * 1.0) {
                    minPrice = d.presellTotalPrice
                    p = d
                  }
                }
              })
              if (minPrice > 0) {
                parent.presellTotalPrice = minPrice
                if (!util.isEmpty(p.presellDownPrice)) {
                  parent.presellDownPrice = p.presellDownPrice
                }
                if (!util.isEmpty(p.presellOffsetPrice)) {
                  parent.presellOffsetPrice = p.presellOffsetPrice
                }
                if (!util.isEmpty(p.bookNum)) {
                  parent.bookNum = p.bookNum
                }
              }
            }
          }
        }
      } else if (this.activityAttendDetail.refType === 2) { // 拼团
        if (!util.isEmpty(data.stockLimit)) {
          this.$message({
            type: 'warn',
            message: this.$t('拼团库存必须为正整数')
          })
          return
        }
      } else if (this.activityAttendDetail.refType === 3) { // 砍价
        if (!util.isEmpty(data.individualLimit)) {
          if (!util.validateNum(data.individualLimit)) {
            this.$message({
              type: 'warn',
              message: this.$t('砍价个人限购必须为正整数')
            })
            return
          }
        }
        if (!util.isEmpty(data.stockLimit)) {
          if (!util.validateNum(data.stockLimit)) {
            if (!util.validateNum(data.individualLimit)) {
              this.$message({
                type: 'warn',
                message: this.$t('砍价库存必须为正整数')
              })
              return
            }
          }
        }
      }
      // 即时保存
      if (!util.isEmpty(field)) {
        var saveCondition = {
          'mpId': data.mpId,
          'activityAttendId': this.id,
          'name': field,
          'value': fieldValue,
          'typeOfProduct': data.typeOfProduct
        }

        // 更新子品时要实时更新虚品，更新虚品也要更新子品（在后台处理）
        if (!util.isEmpty(parent) && name !== 'bookNum') {
          saveCondition.isParent = false
          saveCondition.parentValue = parent[field]
          saveCondition.parentMpId = parent.mpId
        }
        if (saveCondition.value) {
          this.promotionAPI.realTimeSave(saveCondition)
        }
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
    showExportBtn() {
      var detail = this.activityAttendDetail
      if (util.isEmpty(detail)) {
        return true
      }
      if (detail.refType !== 1 || (detail.refType === 1 && (detail.promotionType === 1 || detail.promotionType === 5 || detail.promotionType === 8))) {
        return true
      }
      return false
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

      const flag = this.checkData(this.batchConfig)

      if (!flag) {
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
              agentList: x.agentList,
              channelIndividualLimit: this.batchConfig.channelIndividualLimit,
              channelMerchantLimit: this.batchConfig.channelMerchantLimit,
              channelStoreLimit: this.batchConfig.channelStoreLimit,
              contentType: x.contentType,
              id: x.id,
              individualLimit: this.batchConfig.individualLimit,
              mpId: x.mpId,
              mpName: x.mpName,
              orderLimit: this.batchConfig.orderLimit,
              promPrice: this.batchConfig.promPrice,
              promotionId: x.promotionId,
              totalLimit: x.totalLimit,
              typeOfProduct: x.typeOfProduct
            }
          })
        await this.promotionAPI.updatePriceAndLimit(params)
        await this.query('effect')
      })
    },
    async handleReset() {
      // this.formReset('mpSearch')
      //  await this.query('effect')
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
    // 查询报名活动详情
    async queryApplyActivityDetail() {
      const params = {
        activityAttendId: this.id,
        merchantId: this.merchantId
      }
      const { data = {}, code } = await this.promotionAPI.queryActiveAttendDetail(
        params
      )
      if (code === '0') {
        this.activityAttendDetail = data || {}
        this.attendId = data.attendRecord.activityAttendId
        this.attendRecordId = data.attendRecord.id
        this.attendRecordDetail = data.attendRecord
        this.status = data.attendRecord.status
        this.mutexQueryContent.obj.promotionId = this.activityId
        this.selectionMPQueryContent.activityRecordId = this.attendRecordId
        this.selectionMPQueryContent.activityId = this.activityId
        this.importParams.activityAttendId = this.attendId
        this.importParams.activityAttendRecordId = this.attendRecordId
        if (this.activityAttendDetail.promotionType) {
          this.importParams.promotionType = this.activityAttendDetail.promotionType
          if (this.promotionDetail.promotionMethod) {
            this.importParams.promotionMethod = this.promotionDetail.promotionMethod
          }
        }
        // this.upload_data.activityAttendId = this.attendId
        // this.upload_data.activityAttendRecordId = this.attendRecordId
        // this.upload_data.refType = this.activityAttendDetail.refType
        // if (this.activityAttendDetail.promotionType) {
        //  this.upload_data.promotionType = this.activityAttendDetail.promotionType
        // }
        if (this.activityAttendDetail.refType === 2) {
          this.getBatchGrouponThemeDetail(this.activityAttendDetail.refThemeId)
          this.queryApplyMp4Status('-2')
        } else if (this.activityAttendDetail.refType === 1) {
          this.queryPromotionActivityDetail(this.activityAttendDetail.refThemeId)
        } else {
          this.getCutPriceThemeDetail(this.activityAttendDetail.refThemeId)
          this.queryApplyMp4Status('-2')
        }

        this.queryImages()
        this.importModel.importApi[3] = { ...this.importParams }
      }
    },
    // tab切换，根据活动状态查询
    async queryApplyMp4Status(status) {
      this.queryContent.obj.status = status
      this.listTable.data = []
      this.statusTab = parseInt(status)
      this.statusTabStr = status
      this.queryAttendMpList()
    },
    // 查询报名活动商品列表
    async queryAttendMpList() {
      this.queryContent.obj.activityAttendId = this.activityAttendId
      this.queryContent.obj.activityAttendRecordId = this.attendRecordId
      this.queryContent.obj.refType = this.activityAttendDetail.refType
      this.queryContent.obj.refThemeId = this.activityAttendDetail.refThemeId
      if (this.queryContent.obj.refType === 1) {
        this.queryContent.obj.contentType = this.promotionDetail.promotionMethod
      }
      this.listTable.checkedList = []
      await this.$refs.mpTable.getList(this.queryContent)

      // await this.promotionAPI.queryAttendMpList(
      // this.queryContent
      // )
      // if (code === '0') {
      //   // data.listObj.forEach(x => {
      //   //   x.id = x.mpId
      //   //   const merchantProductList = x.childMpList
      //   //   merchantProductList &&
      //   //   merchantProductList.forEach(y => {
      //   //     // 如果是系列品
      //   //     if (y.typeOfProduct === 3) {
      //   //       y.hasChildren = true
      //   //     }
      //   //     x.salePrice = y.salePrice
      //   //   })
      //   // })
      //   this.listTable.data = data.listObj
      //   this.mutexQueryContent.obj.mpDetailList = data.listObj
      //   this.listTable.page.total = data.total
      // }
    },
    // 查询拼团活动详情
    getBatchGrouponThemeDetail(id) {
      var params = {
        'id': id
      }
      this.promotionAPI.queryPatchGrouponThemeDetail(params).then(res => {
        if (res && res.code === '0') {
          this.groupDetail = res.data
          this.refThemeName = this.groupDetail.activityTitle
          this.refThemeStartTime = this.groupDetail.effStartDate
          this.refThemeEndTime = this.groupDetail.effEndDate
        }
      })
    },
    // 查询促销活动详情
    queryPromotionActivityDetail(id) {
      const promotionActivityDetail = {}
      promotionActivityDetail.id = id
      this.promotionAPI.getPromotionDetailUrl(promotionActivityDetail).then(res => {
        if (res && res.code === '0') {
          this.promotionDetail = res.data
          this.refThemeName = this.promotionDetail.promTitle
          this.refThemeStartTime = this.promotionDetail.fromDate
          this.refThemeEndTime = this.promotionDetail.endDate
          this.queryApplyMp4Status('-2')
        }
      })
    },
    queryImages() {
      var data = {}
      data.refType = 4 // 拼团
      data.refTheme = this.attendRecordId
      this.promotionAPI.queryAttendImages(data).then(res => {
        if (res && res.code === '0') {
          this.imgPic = res.data
        }
      })
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
.header {
  font-size: 30px;
  margin-bottom: 30px;
  text-align: center;
}
.item {
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  line-height:40px;
  text-align: left;
  padding-left: 150px;
  .label {
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
  }
}
</style>

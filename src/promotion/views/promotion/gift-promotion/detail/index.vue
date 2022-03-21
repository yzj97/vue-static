<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('赠送类详情')">
      <div class="detail-top">
        <div class="detail-top-titte">{{ $t('活动名称') }}：{{ detailData.promTitle }}</div>
        <el-row>
          <el-col :span="10">
            <div class="detail-top-content">
              <span>{{ $t('活动ID') }}：{{ detailData.id }}</span>
              <span
                class="detail-top-content-item"
              >{{ $t('当前状态') }}：{{ detailData.activityStatus | keyVal(getActivityStatus) }}</span>
            </div>
          </el-col>
          <el-col v-if="isCanSave" :span="4">
            <div>
              <ody-button
                v-show="submitVerifyBtnShow"
                name="submitVerifyActivity"
                type="primary"
                size="small"
                code="button018"
                @click="submitVerifyActivity"
              >{{ $t('提交审核') }}</ody-button>
              <ody-button
                v-show="verifyBtnShow"
                name="openVerifyPop"
                type="primary"
                size="small"
                code="button019"
                @click="openVerifyPop"
              >{{ $t('审核') }}</ody-button>
            </div>
          </el-col>
          <!-- 查看营销报告 -->
          <el-col :span="4">
            <PromotionReportBtn v-if="viewBtnShow" :promotion-id="promotionId"/>
          </el-col>
        </el-row>
      </div>

      <el-tabs v-model="activeName" name="activeName" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('促销规则')" name="first" class="promotion-rules">
          <ody-space :space="4">
            <div class="base-info">
              <div class="header">{{ $t('基本信息') }}</div>
              <div class="item">
                <label>{{ $t('促销名称') }}：</label>
                {{ detailData.promTitle }}
              </div>
              <div class="item">
                <label>{{ $t('活动时间') }}：</label>
                {{ detailData.fromDate }} — {{ detailData.endDate }}
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('活动规则') }}</div>
              <div class="item">
                <label>{{ $t('平台类型') }}：</label>
                {{ detailData.activityPlatformType | keyVal(getActivityPlatformTypeList) }}
              </div>
              <div class="item">
                <label>{{ $t('促销类型') }}：</label>
                {{ detailData.conditionType | keyVal(getConditionTypeList) }}
              </div>
              <div class="item">
                <label>{{ $t('是否叠加应用') }}：</label>
                <span v-if="detailData.isSuperposition === 0">{{ $t('否（超量：按最高层级享受优惠）') }}</span>
                <span v-if="detailData.isSuperposition === 1">{{ $t('是（倍量：每满一级优惠一次）') }}，上限{{ detailData.giftLimit4Multy }}次
                </span>
              </div>
              <div class="item">
                <label>{{ $t('主赠相同') }}：</label>
                {{ detailData.giftSameAsProductFlg | keyVal(getGiftSameAsProductFlgList) }}
              </div>
              <div class="item">
                <label>{{ $t('赠品类型') }}:</label>
                {{ getGiftType }}
              </div>
              <div class="item">
                <label>{{ $t('活动规则说明') }}：</label>
                {{ $t('中文') }}:{{ detailData.ruleDesc }}
                <div>{{ $t('英文') }}:{{ detailData.ruleDescLan2 }}</div>
              </div>
            </div>
            <div v-show="platformId != 2" class="base-info">
              <div class="header">{{ $t('交易规则') }}</div>
              <div class="item">
                <label>{{ $t('是否排斥优惠券') }}：</label>
                {{ detailData.canUseCoupon | keyVal(getCanUseCouponList) }}
              </div>
              <div class="item">
                <label>{{ $t('是否包邮') }}：</label>
                {{ detailData.freeShipping | keyVal(getFreeShippingList) }}
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('参与条件') }}</div>
              <div v-show="detailData.channelCodes" class="item">
                <label>{{ $t('活动渠道') }}：</label>
                {{ detailData.channelCodes | getChannelName(channelMap) }}
              </div>
              <div v-show="detailData.applicablePlatformList" class="item">
                <label>{{ $t('活动平台') }}：</label>
                {{ detailData.applicablePlatformList | getApplicablePlatform(applicableMap) }}
              </div>
              <div v-show="detailData.userScopeList && platformId != 2" class="item">
                <label>{{ $t('新老用户') }}：</label>
                {{ detailData.userScopeList | getUserScopeList(userScopeListMap) }}
              </div>
              <div v-show="detailData.memberTypes && platformId != 2" class="item">
                <label>{{ $t('会员类型') }}：</label>
                {{ memberTypeList.join('、') }}
              </div>
              <div v-show="detailData.memberLevels && platformId != 2" class="item">
                <label>{{ $t('会员等级') }}：</label>
                <div
                  v-for="item in detailData.memberTypeList"
                  :key="item.memberType"
                  class="levels-content"
                >
                  <el-tag type="info" class="levels-tag">{{ item.memberTypeName }}</el-tag>
                  {{ item.memberLevelList.map(x => x.levelName).join('、') }}
                </div>
              </div>
              <div v-if="giftSameTypeShow" class="item">
                <label>{{ $t('优惠设置') }}:</label>
                {{ getPreferentialSettings }}
              </div>
              <div class="item">
                <label>{{ $t('备注') }}：</label>
                <span class="item-description" v-html="detailData.description" />
              </div>
            </div>
          </ody-space>
        </el-tab-pane>

        <el-tab-pane :label="$t('参与商家/店铺')" name="second">
          <ody-list-search-area>
            <div slot="content">
              <el-form
                ref="merchantSearch"
                :model="merchantSearch"
                label-width="100px"
                class="form"
              >
                <ody-search-item :label="$t('商家编码')" prop="merchantCode">
                  <el-input
                    v-model="merchantSearch.merchantCode"
                    name="merchantSearch_merchantCode"
                  />
                </ody-search-item>
                <ody-search-item :label="$t('商家名称')" prop="merchantName">
                  <el-input
                    v-model="merchantSearch.merchantName"
                    name="merchantSearch_merchantName"
                  />
                </ody-search-item>
              </el-form>
            </div>
            <div slot="btn">
              <el-button
                name="handleMerchantReset"
                size="small"
                @click="handleMerchantReset"
              >{{ $t('重置') }}</el-button>
              <el-button
                size="small"
                type="primary"
                @click.prevent="handleMerchantSubmit(1)"
              >{{ $t('查询') }}</el-button>
            </div>
          </ody-list-search-area>

          <ody-table
            ref="merchantTable"
            :data="merchantTable.data"
            :can-filter="false"
            :columns="merchantTable.columns"
            name="merchantTable_data518"
          />
          <ody-pagination
            :current-page.sync="merchantTable.page.currentPage"
            :list="merchantTable.data"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="merchantTable.page.itemsPerPage"
            :total.sync="merchantTable.page.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange(1)"
            @current-change="handleCurrentChange(1)"
          />

          <ody-list-search-area>
            <div slot="content">
              <el-form ref="storeSearch" :model="storeSearch" label-width="100px" class="form">
                <ody-search-item :label="$t('店铺编码')" prop="storeCode">
                  <el-input v-model="storeSearch.storeCode" name="storeSearch_storeCode" />
                </ody-search-item>
                <ody-search-item :label="$t('店铺名称')" prop="storeName">
                  <el-input v-model="storeSearch.storeName" name="storeSearch_storeName" />
                </ody-search-item>
              </el-form>
            </div>
            <div slot="btn">
              <el-button
                name="handleStoreReset"
                size="small"
                @click="handleStoreReset"
              >{{ $t('重置') }}</el-button>
              <el-button
                size="small"
                type="primary"
                @click.prevent="handleMerchantSubmit(2)"
              >{{ $t('查询') }}</el-button>
            </div>
          </ody-list-search-area>

          <ody-table
            ref="storeTable"
            :data="storeTable.data"
            :can-filter="false"
            :columns="storeTable.columns"
            name="storeTable_data030"
          />
          <ody-pagination
            :current-page.sync="storeTable.page.currentPage"
            :list="storeTable.data"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="storeTable.page.itemsPerPage"
            :total.sync="storeTable.page.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange(2)"
            @current-change="handleCurrentChange(2)"
          />
        </el-tab-pane>

        <el-tab-pane :label="$t('参与商品')" name="third">
          <ody-list-search-area>
            <div slot="content">
              <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
                <ody-search-item :label="$t('商家')" prop="obj.merchantId">
                  <promotion-merchant-select
                    v-model="mpSearch.obj.merchantId"
                    :search=" {
                      merchantType: merchantType,
                      promotionId: promotionId }"
                  />
                </ody-search-item>
                <ody-search-item :label="$t('商品编码')" prop="obj.mpCode">
                  <el-input v-model="mpSearch.obj.mpCode" name="mpSearch_obj_mpCode" />
                </ody-search-item>
                <ody-search-item :label="$t('商品名称')" prop="obj.mpName">
                  <el-input v-model="mpSearch.obj.mpName" name="mpSearch_obj_mpName" />
                </ody-search-item>
                <ody-search-item :label="$t('商品条码')" prop="obj.barcode">
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
                <el-tab-pane :label="`${$t('生效商品')}(${mpTable.page.total})`" name="1">
                  <div class="bottom10">
                    <ody-button
                      v-if="detailData.activityStatus === 4"
                      name="outProduct"
                      size="small"
                      type="primary"
                      code="button022"
                      @click="outProduct"
                    >{{ $t('撤出商品') }}</ody-button>
                  </div>
                  <div>
                    <ody-table
                      :can-filter="false"
                      :data="mpTable.data"
                      :columns="mpTable.columns"
                      :is-tree="true"
                      :default-expand-all="false"
                      :operates="mpTable.operates"
                      :multiple="true"
                      :selectable="selectable"
                      :tree-props="{ rootVal: '0', parentKey: 'parentId', hasChildren: 'hasChildren', children: 'childMpList' }"
                      :load="loadChildren"
                      name="mpTable_data243"
                      row-key="id"
                      @selection-change="handleSelectionChange"
                    />
                    <ody-pagination
                      :current-page.sync="mpSearch.currentPage"
                      :list="mpTable.data"
                      :page-sizes="[10, 20, 30, 50]"
                      :page-size.sync="mpSearch.itemsPerPage"
                      :total.sync="mpTable.page.total"
                      background
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="querySelectionProductList('effect')"
                      @current-change="querySelectionProductList('effect')"
                    />
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="`${$t('互斥商品')}(${mutexTable.page.total})`" name="2">
                  <div>
                    <ody-table
                      :data="mutexTable.data"
                      :columns="mutexTable.columns"
                      :is-tree="true"
                      :operates="mutexTable.operates"
                      :multiple="true"
                      :can-filter="false"
                      :default-expand-all="false"
                      :tree-props="{ rootVal: '0', parentKey: 'parentId', hasChildren: 'hasChildren', children: 'childMpList' }"
                      name="mutexTable_data818"
                      row-key="id"
                      @selection-change="handleMutexSelectionChange"
                    >
                      <template slot="exclusiveRecordingTime" slot-scope="scope">
                        <span
                          v-if="!!scope.row.exclusiveRecordingTime"
                        >{{ scope.row.exclusiveRecordingTime | parseTime }}</span>
                      </template>
                    </ody-table>
                    <ody-pagination
                      :current-page.sync="mutexSearch.currentPage"
                      :list="mutexTable.data"
                      :page-sizes="[10, 20, 30, 50]"
                      :page-size.sync="mutexSearch.itemsPerPage"
                      :total.sync="mutexTable.page.total"
                      background
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="querySelectionProductList('mutex')"
                      @current-change="querySelectionProductList('mutex')"
                    />
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </ody-list-table-area>
        </el-tab-pane>
        <el-tab-pane v-if="giftPromotionShow() && giftTabShow()" :label="$t('参与赠品')" name="fourth">
          <ody-table
            :data="giftTable.data"
            :columns="giftTable.columns"
            :operates="giftTable.operates"
            :can-filter="false"
            name="giftTable_data423"
          >
            <template slot="promotionId" slot-scope="scope">{{ scope.$index + 1 }}</template>
            <template slot="conditionValue" slot-scope="scope">
              <div class="condition-value">
                {{ $t('满') }}
                {{ scope.row.conditionValue }}
                {{ conditionType === 1 ? '元': '件' }}
              </div>
            </template>
          </ody-table>

          <div v-if="detailData.giftType==2">
            {{ $t('赠券节点') }}
            {{ getCouponSendTimingValue(detailData.couponSendTiming) }}
          </div>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
    <promotion-gift-dialog-look
      v-if="giftLookVisible && promotionRuleId"
      :visible="giftLookVisible"
      :edit-flag="true"
      :content-value="contentValue"
      :gift-show-type="giftShowType"
      :params="{
        promotionId: promotionId,
        promotionRuleId: promotionRuleId
      }"
      @cancel="giftLookCancel"
    />

    <promotion-gift-coupon-look
      v-if="couponLookVisible && promotionRuleId"
      :visible="couponLookVisible"
      :edit-flag="true"
      :params="{
        promotionId: promotionId,
        promotionRuleId: promotionRuleId
      }"
      @cancel="couponLookVisible=false"
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
import constants from '@/utils/constants'
import packagesConstant from 'packages/utils/constant'
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
import PromotionGiftDialogLook from '@/components/promotion-gift-dialog-look'
import PromotionGiftCouponLook from '@/components/promotion-gift-coupon-look'
import PromotionMutexGoodsLook from '@/components/promotion-mutex-goods-look'
import PromotionReportBtn from '@/components/ViewMarketingReportBtn'
import util from '@/utils/util'
import constantService from '@/utils/constants'

export default {
  name: 'PromGiftPromotionDetail',
  components: {
    PromotionMerchantSelect,
    PromotionGiftDialogLook,
    PromotionGiftCouponLook,
    PromotionMutexGoodsLook,
    PromotionReportBtn
  },
  filters: {
    getChannelName(channelCodes, channelMap) {
      if (channelCodes) {
        return channelCodes
          .map(item => {
            if (channelMap[item]) {
              return channelMap[item].channelName
            }
          })
          .join('、')
      }
      return ''
    },
    getApplicablePlatform(applicablePlatformList, applicableMap) {
      if (applicablePlatformList) {
        var applicableArr = []
        if (applicableMap && applicableMap.length > 0) {
          applicablePlatformList.map(item => {
            const index = applicableMap.findIndex(key => key.id === item)
            if (applicableMap[index]) {
              applicableArr.push(applicableMap[index].text)
            }
          })
          return applicableArr.join('、')
        }
      }
      return ''
    },
    getUserScopeList(userScopeList, userScopeListMap) {
      if (userScopeList) {
        var userScopeArr = []
        if (userScopeListMap && userScopeListMap.length > 0) {
          userScopeList.map(item => {
            const index = userScopeListMap.findIndex(key => key.id === item)
            if (userScopeListMap[index]) {
              userScopeArr.push(userScopeListMap[index].text)
            }
          })
          return userScopeArr.join('、')
        }
      }
      return ''
    }
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      couponSendTimingArr: constantService.couponSendTimingList,
      ruleChinesePlaceholder: '',
      ruleEnglishPlaceholder: '',
      platformId: '',
      scopeItemId: '',
      visibleMutex: false,
      checkedProductList: [],
      giftType: '',
      couponSendTiming: 1,
      conditionType: '',
      couponLookVisible: false,
      promType: '',
      isCanSave: false,
      giftLookVisible: false,
      overLimitTypeList: [],
      selectFlag: '1',
      channelMap: {},
      applicableMap: {},
      userScopeListMap: [],
      memberTypeList: [],
      activeName: 'first',
      promotionId: '',
      promotionAPI: '',
      detailData: {},
      merchantSearch: {
        merchantCode: '',
        merchantName: ''
      },
      mpSearch: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          isAvailable: 1,
          merchantId: '',
          mpCode: '',
          mpName: '',
          barcode: '',
          activityId: '',
          isMutexList: [0, 5]
        }
      },
      mutexSearch: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          isAvailable: 1,
          merchantId: '',
          mpCode: '',
          mpName: '',
          barcode: '',
          activityId: '',
          isMutexList: [-1]
        }
      },
      merchantTable: {
        data: [],
        columns: [
          {
            label: this.$t('商家编码'),
            prop: 'merchantCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商家类型'),
            prop: 'merchantTypeName',
            minWidth: 120, show: true
          }
        ],
        page: {
          currentPage: 1,
          itemsPerPage: 10,
          total: 0
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
            minWidth: 120, show: true
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
        data: [],
        page: {
          total: 0
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
            minWidth: 120, show: true
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
        data: [],
        page: {
          total: 0
        }
      },
      storeSearch: {
        storeCode: '',
        storeName: ''
      },
      storeTable: {
        data: [],
        columns: [
          {
            label: this.$t('店铺编码'),
            prop: 'storeCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('店铺名称'),
            prop: 'storeName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('店铺类型'),
            prop: 'storeTypeName',
            minWidth: 120, show: true
          }
        ],
        page: {
          currentPage: 1,
          itemsPerPage: 10,
          total: 0
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
            label: this.$t('促销规则'),
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
              label: this.$t('查看赠品'),
              method: (index, row) => {
                this.lookGiftModal(row)
              },
              code: 'button021'
            }
          ]
        },
        data: []
      }
    }
  },
  computed: {
    giftSameTypeShow() {
      return +this.detailData.conditionType === 2 && +this.detailData.giftSameAsProductFlg === 1
    },
    getGiftType() {
      if (this.giftSameTypeShow) {
        return this.$t('赠商品')
      } else {
        if (+this.detailData.giftType === 1) {
          return this.$t('赠商品')
        } else {
          return this.$t('赠优惠券')
        }
      }
    },
    getPreferentialSettings() {
      if (this.$portal.getLocale() === 'zh_CN') {
        return this.ruleChinesePlaceholder
      } else {
        return this.ruleEnglishPlaceholder
      }
    },
    viewBtnShow() {
      var isShow = false
      if (
        this.detailData.activityStatus === 4 ||
        this.detailData.activityStatus === 5 ||
        this.detailData.activityStatus === 6
      ) {
        isShow = true
      }
      var flag = isShow && this.detailData.hasWriteRole
      return flag
    },
    getActivityPlatformTypeList() {
      return packagesConstant.activityPlatformTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getConditionTypeList() {
      return packagesConstant.conditionTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getCanUseCouponList() {
      return constants.promotionCanUseCouponList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getGiftSameAsProductFlgList() {
      return packagesConstant.giftSameAsProductFlgList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getFreeShippingList() {
      return constants.promotionFreeShippingList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getActivityStatus() {
      return constants.activityStatus.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    submitVerifyBtnShow() {
      //  商家显示平台创建的促销时，不显示改按钮
      if (+this.detailData.merchantTyp === 3 && this.platformId === 2) {
        return false
      }
      return (
        +this.detailData.activityStatus === 0 ||
        +this.detailData.activityStatus === 3
      )
    },
    verifyBtnShow() {
      return +this.detailData.activityStatus === 1
    }
  },
  created() {
    this.promotionId = this.$route.params.promotionId
    this.promType = this.$route.params.promotionType
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPromotionActivityDetail()
    await this.getChannelArrByBusiness()
    await this.getLoadPageConfigUrl()
    await this.getLoadOscConfigUrl()
    await this.handleMerchantSubmit(1)
    await this.handleMerchantSubmit(2)
    await this.query('effect')
    await this.query('mutex')
    await this.queryGiftLevelList()
    await this.handleCanSave()
    this.platformId = +this.$portal.getPlatformId()
    this.buildFrontPromDesc()
  },
  methods: {
    selectable(row, index) {
      return !row.disable && !(this.append && row.isAvailable === 1)
    },
    getCouponSendTimingValue(key) {
      return util.getDictionaryText(key, this.couponSendTimingArr)
    },
    giftPromotionShow() {
      return this.detailData.promotionType === 4
    },
    giftTabShow() {
      return this.detailData.promotionMethod !== 5
    },
    buildFrontPromDesc() {
      var params = {
        conditionType: this.detailData.conditionType,
        favourableList: this.detailData.favourableList,
        giftType: this.detailData.giftType,
        isSuperposition: +this.detailData.promotionGiftRule === 1 ? 0 : 1,
        promotionMethod: this.detailData.promotionMethod,
        giftLimit4Multy: this.detailData.giftLimit4Multy,
        promotionType: this.promType
      }
      this.$promotion.$api.promotion.buildFrontPromDesc(params).then(res => {
        this.ruleChinesePlaceholder = res.data[0].desc
        this.ruleEnglishPlaceholder = res.data[1].desc
      })
    },
    viewMutexGoods(row) {
      this.scopeItemId = row.id
      this.visibleMutex = true
    },
    outProduct() {
      if (this.checkedProductList.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要撤出的商品')
        })
        return
      }
      this.$confirm('确定要撤出商品吗？')
        .then(_ => {
          this.promotionAPI.deleteMpBatch(this.checkedProductList.filter(x => x.typeOfProduct !== 1000)).then(res => {
            this.$message({
              message: this.$t('撤出商品成功'),
              type: 'success'
            })
            this.query('effect')
          })
        })
        .catch(_ => {})
    },
    viewMarketingReport() {
      this.$router.push({
        name: 'ObiShowActivityEffectReport',
        query: { id: this.promotionId }
      })
    },
    async handleCanSave() {
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
        this.isCanSave = false
        return false
      }
      this.isCanSave = true
      // // 验证是否选赠品
      // const list = this.$portal.deepClone(this.giftTable.data)
      // let flag = true
      // var arrCount = []
      // const arr = list.map(item => {
      //   if (item.conditionValue) {
      //     arrCount.push(item.conditionValue)
      //     if (this.conditionType === 1) {
      //       item.conditionValue = item.conditionValue * 100
      //     }
      //   } else {
      //     flag = false
      //   }
      //   return item
      // })
      // if (!flag) {
      //   return false
      // }
      // if (arr.length !== [...new Set(arrCount)].length) {
      //   return false
      // }
      // const search = {
      //   giftType: this.giftType,
      //   couponSendTiming: this.couponSendTiming,
      //   promotionId: this.promotionId,
      //   giftLevelVOs: arr
      // }

      // const result = await this.promotionAPI.updateGiftLevels(search)
      // if (+result.code === 0) {
      //   this.isCanSave = true
      // }
    },
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      const { code } = await this.promotionAPI.submitActivity({
        id: this.promotionId
      })
      if (+code === 0) {
        await this.queryPromotionActivityDetail()
      }
    },
    openVerifyPop() {
      this.$prompt('管理员备注:', this.$t('提示'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('通过'),
        cancelButtonText: this.$t('不通过'),
        showClose: true,
        inputType: 'textarea',
        inputPattern: /^.{0,100}$/,
        inputErrorMessage: this.$t('只能输入100字符以内'),
        beforeClose: async(action, instance, done) => {
          const remark = instance.inputValue

          if ((remark === '' || remark === null) && action === 'cancel') {
            this.$message('请填写备注')
            return
          }

          if (action === 'close') {
            done()
            return
          }

          if (instance.editorErrorMessage !== '') {
            return false
          }

          if (action === 'cancel') {
            this.promotionAPI
              .verifyActivityNotPass({
                id: this.promotionId,
                remark: remark
              })
              .then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
          } else if (action === 'confirm') {
            const { code } = await this.promotionAPI.verifyActivityPass({
              id: this.promotionId,
              remark: remark
            })
            if (+code === 0) {
              await this.queryPromotionActivityDetail()
              done()
            }
          }
        }
      })
    },

    async queryGiftLevelList() {
      const { data, code } = await this.promotionAPI.queryGiftLevelList({
        promotionId: this.promotionId
      })
      if (code === '0') {
        if (this.conditionType === 1) {
          data.map(item => {
            if (item.conditionValue) {
              item.conditionValue = item.conditionValue / 100
            }
          })
        }
        this.giftTable.data = data || []
      }
    },
    giftLookCancel() {
      this.giftLookVisible = false
    },
    lookGiftModal(row) {
      this.promotionRuleId = row.promotionRuleId
      if (this.giftType === 1) {
        this.contentValue = row.contentValue
        this.giftShowType = row.giftShowType
        this.giftLookVisible = true
      } else if (this.giftType === 2) {
        this.couponLookVisible = true
      }
    },
    async getLoadOscConfigUrl() {
      const { data = {}} = await this.promotionAPI.loadOscConfigUrl(
        'overlimitRule',
        {}
      )
      if (data && data.result) {
        this.overLimitTypeList = data.result
      }
    },
    async query(type) {
      if (type === 'effect') {
        this.mpSearch.currentPage = 1
        this.mpSearch.obj.activityId = this.promotionId
      } else {
        this.mutexSearch.currentPage = 1
        this.mutexSearch.obj.activityId = this.promotionId
      }
      await this.querySelectionProductList(type)
    },
    async handleTabChange(val) {
      this.selectFlag = val.name
    },
    handleStoreReset() {
      this.formReset('storeSearch')
    },
    async handleReset() {
      this.formReset('mpSearch')
      await this.query('effect')
    },
    handleSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedProductList = val
          .filter(item => {
            return item.isChecked && item.parentId === '0'
          })
          .map(item => {
            return item.childMpList[0]
          })
      }
    },
    // 互斥商品
    handleMutexSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedMutexProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },
    async handleSizeChange(merchantType) {
      if (merchantType === 1) {
        this.merchantTable.page.currentPage = 1
      } else {
        this.storeTable.page.currentPage = 1
      }
      await this.handleMerchantSubmit(merchantType)
    },
    async handleCurrentChange(merchantType) {
      await this.handleMerchantSubmit(merchantType)
    },
    async querySelectedMerchantUrl(merchantType) {
      let addIdList = []
      let currentPage = 1
      let itemsPerPage = 10

      if (merchantType === 1) {
        addIdList = this.allAuthMerchant.map(x => {
          return x.merchantId
        })
        currentPage = this.merchantTable.page.currentPage
        itemsPerPage = this.merchantTable.page.itemsPerPage
      } else {
        addIdList = this.allAuthStore.map(x => {
          return x.storeId
        })
        currentPage = this.storeTable.page.currentPage
        itemsPerPage = this.storeTable.page.itemsPerPage
      }

      const {
        data: { listObj = [], total = 0 } = {}
      } = await this.promotionAPI.querySelectedMerchantUrl({
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
        merchantType: merchantType,
        promotionId: this.promotionId,
        merchantIdList: addIdList
      })

      if (merchantType === 1) {
        this.merchantTable.page.total = total
        const merchantIdList = listObj.map(x => {
          return x.merchantId
        })

        return (
          this.allAuthMerchant.filter(x => {
            return merchantIdList.includes(x.merchantId)
          }) || []
        )
      } else {
        this.storeTable.page.total = total
        const storeIdList = listObj.map(x => {
          return x.merchantId
        })

        return (
          this.allAuthStore.filter(x => {
            return storeIdList.includes(x.storeId)
          }) || []
        )
      }
    },
    async queryAuthStorePageUrl() {
      let params = {
        currentPage: 1,
        itemsPerPage: 30000,
        channelCodes: this.detailData.channelCodes
      }

      params = Object.assign({}, params, this.storeSearch)

      const {
        data: { listObj = [] } = {}
      } = await this.promotionAPI.queryAuthStorePageUrl(params)

      this.allAuthStore = listObj || []
    },
    async queryAuthMerchantPageUrl() {
      let params = {
        currentPage: 1,
        itemsPerPage: 30000,
        channelCodes: this.detailData.channelCodes
      }

      params = Object.assign({}, params, this.merchantSearch)

      const {
        data: { listObj = [] } = {}
      } = await this.promotionAPI.queryAuthMerchantPageUrl(params)

      this.allAuthMerchant = listObj || []
    },
    async handleMerchantSubmit(merchantType) {
      if (merchantType === 1) {
        await this.queryAuthMerchantPageUrl()
        if (this.allAuthMerchant.length > 0) {
          this.merchantTable.data = await this.querySelectedMerchantUrl(
            merchantType
          )
        } else {
          this.merchantTable.data = []
          this.merchantTable.page.total = 0
        }
      } else {
        await this.queryAuthStorePageUrl()
        if (this.allAuthStore.length > 0) {
          this.storeTable.data = await this.querySelectedMerchantUrl(
            merchantType
          )
        } else {
          this.storeTable.data = []
          this.storeTable.page.total = 0
        }
      }
    },
    handleMerchantReset() {
      this.formReset('merchantSearch')
    },
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }
      const { data = {}, code } = await this.promotionAPI.getPromotionDetailUrl(
        params
      )
      if (code === '0' && data) {
        this.detailData = data
        this.giftType = data.giftType
        this.conditionType = data.conditionType

        this.couponSendTiming = data.couponSendTiming
        if (data.memberTypeList) {
          this.memberTypeList = data.memberTypeList.map(
            item => item.memberTypeName
          )
        }

        // 判断是否是买一赠一
        if (+this.detailData.promotionMethod === 5) {
          // 增商品   买一赠一
          // 促销类型为2：买商品赠
          this.detailData.conditionType = 2
          // 主赠相同为1：是
          this.$set(this.detailData, 'giftSameAsProductFlg', 1)
        } else if (+this.detailData.promotionMethod === 4) {
          // 增商品-或者赠优惠券
          // 主赠相同为2：否
          this.$set(this.detailData, 'giftSameAsProductFlg', 2)
        }
      }
    },
    // 读取商家渠道信息
    async getChannelArrByBusiness() {
      const { data } = await this.promotionAPI.queryChannelMap({})
      this.channelMap = data
    },
    // 活动平台
    async getLoadPageConfigUrl() {
      const { data } = await this.promotionAPI.loadPageConfigMethod({})
      this.applicableMap = data.applicablePlatform
      this.userScopeListMap = data.userScope
    },
    // type : 'effect' 生效商品， 'mutex' 互斥商品
    async querySelectionProductList(type) {
      let params = {}
      if (type === 'effect') {
        params = this.mpSearch
      } else {
        params = this.mutexSearch
      }

      const {
        data: { listObj = [], total = 10 } = {}
      } = await this.promotionAPI.querySelectionProListMethod(params)

      if (type === 'mutex') {
        this.mutexTable.page.total = total
        var mutexTableList = listObj || []
        mutexTableList.forEach(x => {
          x.id = x.mpId
          const merchantProductList = x.childMpList
          merchantProductList &&
            merchantProductList.forEach(y => {
              // 如果是系列品
              if (y.typeOfProduct === 3) {
                y.hasChildren = true
              }
            })
        })
        this.mutexTable.data = mutexTableList
        return
      }

      this.mpTable.page.total = total
      const selectedProductList = listObj || []

      selectedProductList.forEach(x => {
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

      this.mpTable.data = selectedProductList
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
    }
  }
}
</script>

<style lang="less" scoped>
.bottom10 {
  margin-bottom: 10px;
}
.pg-promotion-detail {
  .detail-top {
    margin-bottom: 20px;

    &-titte {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(69, 90, 100, 1);
      line-height: 22px;
      margin-bottom: 10px;
    }

    &-content {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(69, 90, 100, 1);
      line-height: 32px;

      &-item {
        margin-left: 32px;
      }
    }
  }

  .promotion-rules {
    .base-info {
      height: 100px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(69, 90, 100, 1);
      line-height: 17px;
    }

    .header {
      font-size: 14px;
      margin-bottom: 20px;
    }

    .item {
      margin-bottom: 10px;
      word-break: break-all;
    }
    .item-description {
      display: inline-block;
    }
  }
}
</style>

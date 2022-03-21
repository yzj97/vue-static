<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('优惠券内容')">
      <div class="detail-top">
        <div class="detail-top-titte">{{ $t('优惠券名称') }}：{{ detailData.themeTitle }}</div>
        <div class="detail-top-content">
          <span>{{ $t('优惠券ID') }}：{{ detailData.id }}</span>
          <span
            class="detail-top-content-item"
          >{{ $t('当前状态') }}：{{ getTrueStatus(detailData.status,detailData.startTime, detailData.endTime) | keyVal(getActivityStatus) }}</span>
          <ody-button
            v-if="detailData.status === 0 || detailData.status === 3"
            name="submitVerifyActivity"
            type="primary"
            size="small"
            code="button018"
            @click="submitVerifyActivity"
          >{{ $t('提交审核') }}</ody-button>
          <ody-button
            v-if="detailData.status === 1"
            name="openVerifyPop"
            type="primary"
            size="small"
            code="button019"
            @click="openVerifyPop"
          >{{ $t('审核') }}</ody-button>
          <el-button
            name="handdleback"
            type="primary"
            size="small"
            @click="handdleback"
          >{{ $t('返回列表') }}</el-button>
        </div>
      </div>

      <el-tabs v-model="activeName" name="activeName" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('券活动规则')" name="first" class="promotion-rules">
          <ody-space :space="4">
            <div class="base-info">
              <div class="header">{{ $t('基本信息') }}</div>
              <div class="item">{{ $t('优惠券名称') }} {{ $t('中文') }}: {{ detailData.themeTitle }}</div>
              <div
                class="item"
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;{{ $t('英文') }}: {{ detailData.themeTitleLan2 }}</div>
              <div
                class="item"
              >{{ $t('优惠券种类') }}：{{ detailData.couponType | keyVal(getCouponTypeMap) }}</div>
              <div
                class="item"
              >{{ $t('金额抵扣类型') }}：{{ detailData.couponDeductionType | keyVal(getCouponDeductionTypeMap) }}</div>
              <div
                class="item"
              >{{ $t('优惠方式') }}：{{ detailData.couponDiscountType | keyVal(getCouponDiscountTypeMap) }}</div>
              <div
                class="item"
              >{{ $t('适用范围') }}：{{ detailData.applicationScope | keyVal(applicationScopeMap) }}</div>
              <!-- <div class="item">
                {{ $t('优惠券面值种类') }}:
                <span v-if="detailData.couponFaceValueType === 1 ">{{$t('随机面值')}}</span>
                <span v-if="detailData.couponFaceValueType === 0 ">{{$t('优惠券面值')}}</span>
              </div>-->
              <div v-show="detailData.couponDiscountType === 0" class="item">
                {{ $t('优惠券面值') }}：{{ detailData.couponAmount }}
                {{
                  (detailData.couponGiveRule == 12 && detailData.couponAmountExt != null)
                    ? '-' + detailData.couponAmountExt
                    : ''
                }}
                (元)
              </div>

              <div
                v-show="detailData.couponDiscountType === 1"
                class="item"
              >
                {{ $t('优惠折扣') }}：{{ detailData.couponDiscount >= 10 ? detailData.couponDiscount / 10 : detailData.couponDiscount }}{{ $t('折') }},{{ $t('折扣上限') }}{{ detailData.couponAmount }}{{ $t('元') }}</div>
              <div class="item">{{ $t('发行总量') }}：{{ detailData.totalLimit }}</div>
              <div
                v-if="detailData.startTime && detailData.endTime"
                class="item"
              >{{ $t('活动日期') }}：{{ detailData.startTime | parseTime }} — {{ detailData.endTime | parseTime }}</div>
              <div class="item">
                <label>{{ $t('活动规则说明') }}：</label>
                中文:{{ detailData.themeDesc }}
                <div>英文:{{ detailData.themeDescLan2 }}</div>
              </div>
              <div v-if="detailData.couponGiveRule === 12">
                <div
                  v-show="detailData.couponDiscountType === 0"
                  class="item"
                >{{ $t('分享标题') }}：{{ detailData.shareTitle }}</div>
                <div
                  v-show="detailData.couponDiscountType === 0"
                  class="item"
                >{{ $t('分享描述') }}：{{ detailData.shareDesc }}</div>
                <div v-show="detailData.couponDiscountType === 0" class="item item-img">
                  {{ $t('分享图片') }}：
                  <img :src="detailData.shareImgUrl" alt width="80" height="80" >
                  <div>
                    建议尺寸100*100,仅限JPG PNG格式,小于3M：
                    <a
                      name="getDefaultSharePic"
                      class="img-click"
                      @click="getDefaultSharePic"
                    >{{ $t('点击查看默认的系统图') }}</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="base-info">
              <div class="header">{{ $t('使用规则') }}</div>
              <div class="item">
                {{ $t('券有效期') }}：
                <span
                  v-if="detailData.effDays"
                >{{ $t('自用户领取') }}{{ detailData.effDays }}{{ $t('天后失效') }}</span>
                <span
                  v-if="detailData.startTimeConfig && detailData.endTimeConfig"
                >{{ detailData.startTimeConfig | parseTime }} - {{ detailData.endTimeConfig | parseTime }}</span>
              </div>
              <div
                v-if="detailData.useLimit !== null && detailData.useLimit != undefined"
                class="item"
              >{{ $t('使用条件') }}：订单满{{ detailData.useLimit }}元使用</div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('发券规则') }}</div>
              <div
                class="item"
              >{{ $t('发券类型') }}：{{ detailData.couponGiveRule | keyVal(getCouponGiveRuleMap) }}</div>

              <div class="item">
                <span v-if="detailData.couponGiveRule === 12">
                  分享后可领取个数： {{ detailData.shareNumLimit }}
                </span>
              </div>
              <div class="item">
                {{ $t('领取条件') }}:
                <span v-if="!canShowEveryDayLimit()">每ID总共可以领取{{ detailData.individualLimit }}{{ $t('张') }} </span>
                <span v-if="canShowEveryDayLimit()">每ID总共可以领取{{ detailData.individualLimit }}{{ $t('张') }} 每ID每日可以领取{{ detailData.everyDayLimit }} 张 </span>
                <!-- <span v-if="detailData.couponDiscountType === 0">
                  每ID每日可以领取{{ detailData.everyDayLimit }} 张
                </span> -->
                <!-- {{ detailData.couponDiscountType }} -->
              </div>
              <div
                v-show="detailData.couponGiveRule !== 2"
                class="item"
              >{{ $t('领取对象') }}：{{ detailData.userScopeList | getUserScopeList(userScopeListMap) }}</div>
              <!-- <div v-show="detailData.memberTypes && detailData.couponGiveRule !== 2" class="item">
                <label>{{ $t('会员类型') }}：</label>
                {{ memberTypeList.join('、') }}
              </div>-->

              <div v-show="detailData.memberTypes && detailData.couponGiveRule === 4" class="item">
                <label>{{ $t('会员类型') }}：</label>
                {{ memberTypeList.join('、') }}
              </div>

              <div v-show="detailData.memberTypes && detailData.couponGiveRule === 4" class="item">
                <label>{{ $t('会员等级') }}：</label>
                <div v-for="item in memberTypeList1" :key="item.memberType" class="levels-content">
                  <el-tag type="info" class="levels-tag">{{ item.memberTypeName }}</el-tag>
                  {{ item.memberLevelList.map(x => x.levelName).join('、') }}
                </div>
              </div>
              <div
                class="item"
              >{{ $t('使用渠道') }}：{{ detailData.receiveChannelCodes | getChannelName(channelMap) }}</div>
            </div>
          </ody-space>
        </el-tab-pane>

        <!-- {{ detailData.applicationScope }} -->
        <el-tab-pane v-if="detailData.applicationScope == 11" :label="$t('参与商家/店铺')" name="second">
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

          <!-- {{ merchantTable.data }} -->
          <ody-table
            ref="merchantTable"
            :data="merchantTable.data"
            :can-filter="false"
            :columns="merchantTable.columns"
            name="merchantTable_data706"
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
            name="storeTable_data418"
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

        <el-tab-pane v-if="detailData.couponDeductionType != 1" :label="$t('参与商品')" name="third">
          <!-- <ody-list-search-area>
            <div slot="content">
              <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
                <ody-search-item :label="$t('商家')" prop="merchantId">
                  <promotion-merchant-select
                    v-model="mpSearch.merchantId"
                    :search=" {
                      merchantType: merchantType,
                      promotionId: promotionId }"
                  />
                </ody-search-item>
                <ody-search-item :label="$t('商品编码')" prop="mpCode">
                  <el-input v-model="mpSearch.mpCode" name="mpSearch_mpCode" />
                </ody-search-item>
                <ody-search-item :label="$t('商品名称')" prop="mpName">
                  <el-input v-model="mpSearch.mpName" name="mpSearch_mpName" />
                </ody-search-item>
                <ody-search-item :label="$t('商品条码')" prop="barcode">
                  <el-input v-model="mpSearch.barcode" name="mpSearch_barcode" />
                </ody-search-item>
              </el-form>
            </div>
            <div slot="btn">
              <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
              <el-button size="small" type="primary" @click.prevent="query('effect')">{{ $t('查询') }}</el-button>
            </div>
          </ody-list-search-area>-->
          <ody-list-table-area>
            <div slot="tabs">
              <el-tabs v-model="selectFlag" name="selectFlag" @tab-click="handleTabChange">
                <el-tab-pane v-if="detailData.applicationScope == 11" :label="$t('商品限制')" name="0">
                  <ody-list-search-area v-if="searchShow">
                    <div slot="content">
                      <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
                        <ody-search-item :label="$t('商品编码')" prop="limitRef">
                          <el-input v-model="mpSearch.limitRef" name="mpSearch_limitRef" />
                        </ody-search-item>
                        <ody-search-item :label="$t('商品名称')" prop="refDescription">
                          <el-input v-model="mpSearch.refDescription" name="mpSearch_refDescription" />
                        </ody-search-item>
                      </el-form>
                    </div>
                    <div slot="btn">
                      <ody-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</ody-button>
                      <ody-button size="small" type="primary" @click.prevent="query()">{{ $t('查询') }}</ody-button>
                    </div>
                  </ody-list-search-area>
                  <ody-list-table-area>
                    <div slot="tabs">
                      <ody-table
                        ref="mpTable"
                        :columns="mpTable.columns"
                        :request-url="mpTable.requestUrl"
                        :can-filter="false"
                        @selection-change="handleSelectionChange(checkedBrandList)"
                      />
                    </div>
                  </ody-list-table-area>
                </el-tab-pane>
                <el-tab-pane :label="$t('类目限制')" name="1">
                  <ody-list-search-area>
                    <div slot="content">
                      <el-form
                        ref="cateSearch"
                        :model="cateSearch"
                        label-width="100px"
                        class="form"
                        @submit.native.prevent
                      >
                        <ody-search-item :label="$t('类目名称')" prop="refDescription">
                          <el-input
                            v-model="cateSearch.refDescription"
                            name="cateSearch_refDescription"
                          />
                        </ody-search-item>
                        <ody-search-item prop="refDescription">
                          <el-button
                            size="small"
                            type="primary"
                            @click.prevent="queryCate()"
                          >{{ $t('查询') }}</el-button>
                        </ody-search-item>
                      </el-form>
                    </div>
                  </ody-list-search-area>
                  <ody-list-table-area>
                    <div slot="tabs">
                      <ody-table
                        ref="cateTable"
                        :columns="cateTable.columns"
                        :request-url="cateTable.requestUrl"
                        :can-filter="false"
                        @selection-change="handleSelectionChangeCate"
                      />
                    </div>
                  </ody-list-table-area>
                </el-tab-pane>
                <el-tab-pane :label="$t('品牌限制')" name="2">
                  <ody-list-search-area>
                    <div slot="content">
                      <el-form
                        ref="brandSearch"
                        :model="brandSearch"
                        label-width="100px"
                        class="form"
                        @submit.native.prevent
                      >
                        <ody-search-item :label="$t('品牌名称')" prop="refDescription">
                          <el-input
                            v-model="brandSearch.refDescription"
                            name="brandSearch_refDescription"
                          />
                        </ody-search-item>
                        <ody-search-item>
                          <el-button
                            size="small"
                            type="primary"
                            @click.prevent="queryBrand()"
                          >{{ $t('查询') }}</el-button>
                        </ody-search-item>
                      </el-form>
                    </div>
                  </ody-list-search-area>
                  <ody-list-table-area>
                    <div slot="tabs">
                      <ody-table
                        ref="brandTable"
                        :columns="brandTable.columns"
                        :request-url="brandTable.requestUrl"
                        :can-filter="false"
                        @selection-change="handleSelectionChangeBrand"
                      />
                    </div>
                  </ody-list-table-area>
                </el-tab-pane>
              </el-tabs>
            </div>
          </ody-list-table-area>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
    <ody-dialog
      :visible.sync="isShowDefaultPic"
      :title="$t('系统图')"
      width="600px"
      class="default-share-pic"
    >
      <img :src="defaultSharePic" alt >
    </ody-dialog>
  </div>
</template>

<script>
import constants from '@/utils/constants'
import * as utilService from '@/services/utilService'
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
import PromotionCouponAmountDetail from '@/components/coupon-amount-detail'

export default {
  name: 'PromPromotionCouponThemeDetail',
  components: {
    PromotionMerchantSelect,
    PromotionCouponAmountDetail
  },
  filters: {
    getChannelName(receiveChannelCodes, channelMap) {
      if (receiveChannelCodes) {
        return receiveChannelCodes
          .map(item => {
            if (channelMap[item]) {
              return channelMap[item].channelName
            }
          })
          .join('、')
      }
      return ''
    },
    getUserScopeName(userScopeList, userScopeMap) {
      if (userScopeList) {
        var userScopeListArr = []
        if (userScopeMap && userScopeMap.length > 0) {
          userScopeList.map(item => {
            const index = userScopeMap.findIndex(key => key.id === item)
            userScopeListArr.push(userScopeMap[index].text)
          })
          return userScopeListArr.join('、')
        }
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
    const { promotionId, status } = this.$route.params
    // console.log('data', this.promotionId)
    return {
      everyDayLimitGiveRuleArr: [4],
      isShowDefaultPic: null,
      defaultSharePic: null,
      platformId: '',
      selectFlag: '1',
      status,
      couponDiscountMap: [],
      channelMap: [],
      userScopeMap: [],
      applicableMap: {},
      userScopeListMap: [],
      memberTypeList: [],
      memberTypeList1: [],
      activeName: 'first',
      promotionId,
      promotionAPI: '',
      detailData: {},
      merchantSearch: {
        merchantCode: '',
        merchantName: ''
      },
      mutexSearch: {
        currentPage: 1,
        itemsPerPage: 10,
        themeRef: promotionId,
        ruleType: 3,
        refType: 0
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
            label: this.$t('组织分类'),
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
      mpSearch: {
        isAvailable: 1,
        limitRef: '',
        refDescription: '',
        refType: 0,
        themeRef: promotionId,
        ruleType: 5
      },
      mpTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'extendRef',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'refDescription',
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
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteSelectionProduct([row], 5)
              },
              code: 'ui'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/couponSelectionRead/querySelectedSelectionList.do'
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
                this.deleteSelectionProduct([row])
              }
            },
            {
              label: this.$t('查看更多'),
              method: (index, row) => {
                this.deleteSelectionProduct([row])
              },
              hidden: (index, row) => {
                return !!row.childMpList
              },
              code: 'button011'
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
      brandSearch: {
        refDescription: '',
        refType: 0,
        themeRef: promotionId,
        ruleType: 3
      },
      brandTable: {
        columns: [
          {
            label: this.$t('品牌名称'),
            prop: 'refDescription',
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
                this.deleteSelectionProduct([row], 3)
              },
              code: 'ui'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/couponSelectionRead/querySelectedSelectionList.do'
      },
      cateSearch: {
        refDescription: '',
        refType: 0,
        themeRef: promotionId,
        ruleType: 2
      },
      cateTable: {
        columns: [
          {
            label: this.$t('类目名称'),
            prop: 'refDescription',
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
                this.deleteSelectionProduct([row], 2)
              },
              code: 'ui'
            }
          ]
        },
        requestUrl:
          '/back-promotion-web/couponSelectionRead/querySelectedSelectionList.do'
      }
    }
  },
  computed: {
    getCouponDeductionTypeMap() {
      return constants.couponDeductionTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getCouponDiscountTypeMap() {
      return constants.couponTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getCouponTypeMap() {
      return constants.couponTypeMapList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getCouponGiveRuleMap() {
      if (!(constants.couponGiveRuleList[this.platformId] instanceof Array)) {
        return
      }
      return constants.couponGiveRuleList[this.platformId].reduce(
        (rtv, item) => {
          rtv[item.value] = item.label
          return rtv
        },
        {}
      )
    },
    getCouponTypeArrMap() {
      return constants.couponTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    applicationScopeMap() {
      return constants.applicationScopeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getActivityStatus() {
      return constants.couponListStatus.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  created() {
    const { promotionId } = this.$route.params
    // console.log('created', promotionId)
    this.promotionId = promotionId
    this.promotionAPI = this.$promotion.$api.promotion
    // 隐藏tooltip
    console.log('隐藏tooltip')
    const tooltips = document.getElementsByClassName('el-tooltip__popper')
    for (let i = 0; i < tooltips.length; i++) {
      tooltips[i].style.display = 'none'
    }
  },
  async mounted() {
    await this.queryLoadOscConfigUrl()
    await this.queryPromotionActivityDetail()
    await this.getChannelArrByBusiness()
    await this.getLoadPageConfigUrl()
    // await this.queryCouponDetailById()
    await this.handleMerchantSubmit(1)
    await this.handleMerchantSubmit(2)
    await this.query()
    await this.queryBrand()
    await this.queryCate()
    // console.log(this.detailData, 555)
    console.log('隐藏tooltip==mounted')
    const tooltips = document.getElementsByClassName('el-tooltip__popper')
    for (let i = 0; i < tooltips.length; i++) {
      tooltips[i].style.display = 'none'
    }
  },
  methods: {
    canShowEveryDayLimit() {
      if (utilService.isEmpty(this.everyDayLimitGiveRuleArr) || utilService.isEmpty(this.detailData.everyDayLimit)) {
        return false
      }
      for (var i = 0; i < this.everyDayLimitGiveRuleArr.length; i++) {
        if (this.everyDayLimitGiveRuleArr[i] === this.detailData.couponGiveRule) {
          return true
        }
      }
      return false
    },
    // 查看系统大图
    async getDefaultSharePic() {
      const {
        code,
        data = {}
      } = await this.$promotion.$api.promotion.loadOscConfigUrl(
        'DEFAULT_SHARE_PIC',
        {}
      )
      if (code === '0' && data.result) {
        this.isShowDefaultPic = true
        this.defaultSharePic = data.result
      }
    },
    async deleteSelectionProduct(row, ruleType) {
      if (row.length === 0) {
        if (ruleType === 5) {
          this.$message({
            type: 'error',
            message: this.$t('请选择需要删除的商品')
          })
        } else if (ruleType === 3) {
          this.$message({
            type: 'error',
            message: this.$t('请选择需要删除的品牌')
          })
        } else if (ruleType === 2) {
          this.$message({
            type: 'error',
            message: this.$t('请选择需要删除的类目')
          })
        }
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

      const ids = []
      row.forEach(x => {
        ids.push({ id: x.id })
      })
      await this.promotionAPI.delSelectionLimit({
        refType: 0,
        ruleType,
        selectionList: ids,
        themeRef: this.promotionId
      })
      if (ruleType === 5) {
        await this.query()
      } else if (ruleType === 3) {
        this.queryBrand()
      } else if (ruleType === 2) {
        this.queryCate()
      }
    },
    $nextTickPromise() {
      return new Promise(resolve => {
        this.$nextTick(resolve)
      })
    },
    async query() {
      await this.$nextTickPromise()

      if (this.$refs.mpTable) {
        await this.$refs.mpTable.getList(this.mpSearch)
      }
    },
    async queryBrand() {
      await this.$nextTickPromise()

      if (this.$refs.brandTable) {
        await this.$refs.brandTable.getList(this.brandSearch)
      }
    },
    async queryCate() {
      await this.$nextTickPromise()

      if (this.$refs.cateTable) {
        await this.$refs.cateTable.getList(this.cateSearch)
      }
    },
    getTrueStatus(status, startTime, endTime) {
      return utilService.getTrueStatusByStatusAndTimeRange(
        status,
        startTime,
        endTime,
        2,
        4,
        5
      )
    },
    async loadCouponPageConfig() {
      const {
        data = {}
      } = await this.$promotion.$api.promotion.loadCouponPageConfig(
        'COUPON_PAGE_CONFIG',
        {}
      )
      this.couponDiscountMap = data.COUPON_DISCOUNT_TYPE
      this.userScopeMap = data.COUPON_USER_SCOPE
      // 每日限领限制类型
      this.everyDayLimitGiveRuleArr = data.EVERY_DAY_LIMIT_GIVE_RULE
    },
    async handleTabChange(val) {
      this.selectFlag = val.name
      // TODO
      // 5 商品 3 品牌 2 类目

      if (this.selectFlag === '0') {
        await this.query()
      } else if (this.selectFlag === '2') {
        this.queryBrand()
      } else if (this.selectFlag === '1') {
        this.queryCate()
      }
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
        this.checkedProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },

    async queryLoadOscConfigUrl() {
      const params = 'PAGE_CONFIG_NOT_SAME'
      const {
        data = {}
      } = await this.promotionAPI.getLoadPageConfigCommonOscUrl(params)
      this.platformId = data.platformId
    },
    async queryMemberTypeList() {
      const {
        data = []
      } = await this.$promotion.$api.promotion.queryMemberTypeList({})
      this.memberTypeList1 = data
    },
    // 互斥商品
    handleMutexSelectionChange(val) {
      if (Array.isArray(val)) {
        this.checkedMutexProductList = val.filter(item => {
          return item.isChecked
        })
      }
    },
    async updatePriceAndLimit(row, type, val) {
      let rowList = []
      let params = []
      if (row.childMpList) {
        if (val) {
          row[type] = val
        }

        row.childMpList.forEach(x => {
          if (val) {
            x[type] = val
          } else {
            x[type] = row[type]
          }
        })

        rowList = row.childMpList
      } else {
        let parent = []
        if (this.checkedProductList.length) {
          parent = this.checkedProductList.find(item => {
            return item.id === row.parentId
          })
        } else {
          parent = this.mpTable.data.find(item => {
            return item.id === row.parentId
          })
        }

        if (val) {
          parent[type] = val
        } else {
          parent[type] = row[type]
        }

        rowList = [row]
      }

      params = rowList.map(x => {
        return {
          agentList: x.agentList,
          contentType: x.contentType,
          id: x.id,
          individualLimit: x.individualLimit,
          mpId: x.mpId,
          mpName: x.mpName,
          promotionId: x.promotionId,
          totalLimit: x.totalLimit,
          typeOfProduct: x.typeOfProduct
        }
      })
      if (!val) {
        await this.promotionAPI.updatePriceAndLimit(params)
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
      } = await this.promotionAPI.querySelectedMerchantList({
        // currentPage: currentPage,
        // itemsPerPage: itemsPerPage,
        // merchantType: merchantType,
        // promotionId: this.promotionId,
        // merchantIdList: addIdList,
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
        merchantType: merchantType,
        themeRef: this.promotionId,
        merchantIds: addIdList,
        refType: 0,
        ruleType: 2
      })

      if (merchantType === 1) {
        this.merchantTable.page.total = total
        const merchantIdList = listObj.map(x => {
          return x.id
        })

        return (
          this.allAuthMerchant.filter(x => {
            return merchantIdList.includes(x.merchantId)
          }) || []
        )
      } else {
        this.storeTable.page.total = total
        const storeIdList = listObj.map(x => {
          return x.id
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
        channelCodes: this.detailData.receiveChannelCodes
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
        channelCodes: this.detailData.receiveChannelCodes
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
      const { data = {}, code } = await this.promotionAPI.queryCouponDetailById(
        params
      )
      if (code === '0' && data) {
        this.detailData = data
        this.contentType = data.promotionMethod
        // 处理不同ThemeType，适用范围applicationScope默认勾选值不一样
        this.detailData.applicationScope = data.themeType
        if (data.themeType === 11) {
          this.selectFlag = '0'
          await this.query()
        }
        await this.queryMemberTypeList()
        const vue = this
        if (data.memberTypes && data.memberTypes.length > 0) {
          this.memberTypeList1 = this.memberTypeList1.filter(function(item) {
            return data.memberTypes.indexOf(item.memberType) >= 0
          })
        }

        this.memberTypeList1.forEach(function(item) {
          if (data.memberTypes.indexOf(item.memberType) >= 0) {
            vue.memberTypeList.push(item.memberTypeName)
          }
        })

        // 过滤会员等级
        if (data.memberTypes && data.memberTypes.length > 0) {
          this.memberTypeList1.forEach(function(item) {
            item.memberLevelList = item.memberLevelList.filter(function(info) {
              return data.memberLevels.indexOf(info.levelCode) >= 0
            })
          })
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
      } = await this.promotionAPI.querySelectedSelectionList(params)

      if (type === 'mutex') {
        this.mutexTable.page.total = total
        this.mutexTable.data = listObj || []
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

            // y.agentList && y.agentList.forEach((item) => {
            //   if (!util.isEmpty(item.contentValue)) {
            //     if (this.contentType === 1 || this.contentType === 3) {
            //       x.promPrice = +item.contentValue / 100
            //       y.promPrice = +item.contentValue / 100
            //     } else if (this.contentType === 2) {
            //       x.promPrice = +item.contentValue / 10
            //       y.promPrice = +item.contentValue / 10
            //     }
            //   }
            // })
          })
      })

      this.mpTable.data = selectedProductList
    },
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      const { code } = await this.promotionAPI.couponActivitySubmitAudit(
        this.detailData
      )
      if (code) {
        await this.queryLoadOscConfigUrl()
        await this.queryPromotionActivityDetail()
        await this.getChannelArrByBusiness()
        await this.getLoadPageConfigUrl()
        // await this.queryCouponDetailById()
        await this.query('effect')
        await this.query('mutex')
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
              .couponActivityAuditNotPass({
                id: this.promotionId,
                remark: remark,
                status: 1
              })
              .then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
          } else if (action === 'confirm') {
            const { code } = await this.promotionAPI.couponActivityAuditPass({
              id: this.promotionId,
              status: 1,
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
    handdleback() {
      this.$router.push({
        name: 'PromPromotionCouponThemeList'
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
      line-height: 20px;

      &-item {
        margin-left: 20px;
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

  .img-click {
    color: #00a0e9;
  }
}
</style>

<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('促销活动详情')">
      <div class="detail-top">
        <div class="detail-top-titte">{{ $t('活动名称') }}：{{ detailData.promTitle }}</div>
        <el-row>
          <el-col :span="10">
            <div class="detail-top-content">
              <span>活动ID：{{ detailData.id }}</span>
              <span
                class="detail-top-content-item"
              >当前状态：{{ detailData.activityStatus | keyVal(getActivityStatus) }}</span>
            </div>
          </el-col>
          <el-col :span="3">
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
              <div class="item">{{ $t('活动名称') }}：{{ detailData.promTitle }}</div>
              <div
                class="item"
              >{{ $t('活动时间') }}：{{ detailData.fromDate }} — {{ detailData.endDate }}</div>
              <div class="item">{{ $t('预热时间') }}: {{ detailData.schPreheatingTime }}{{ $t('小时') }}</div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('活动规则') }}</div>
              <div
                class="item"
              >{{ $t('活动类型') }}：{{ detailData.promotionType | keyVal(getPromotionTypeList) }}</div>
              <div class="item">
                <label>{{ $t('活动规则说明') }}：</label>
                {{ $t('中文') }}:{{ detailData.ruleDesc }}
                <div>{{ $t('英文') }}:{{ detailData.ruleDescLan2 }}</div>
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('交易规则') }}</div>
              <div
                class="item"
              >{{ $t('是否排斥优惠券') }}：{{ detailData.canUseCoupon | keyVal(getCanUseCouponList) }}</div>
              <div
                class="item"
              >{{ $t('是否包邮') }}：{{ detailData.freeShipping | keyVal(getFreeShippingList) }}</div>
              <div class="item">
                <label>{{ $t('超限规则') }}：</label>
                {{ detailData.overlimitType | keyVal(getOverLimitTypeList) }}
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('参与条件') }}</div>
              <div
                v-show="detailData.channelCodes"
                class="item"
              >{{ $t('活动渠道') }}：{{ detailData.channelCodes | getChannelName(channelMap) }}</div>
              <div
                v-show="detailData.applicablePlatformList"
                class="item"
              >{{ $t('活动平台') }}：{{ detailData.applicablePlatformList | getApplicablePlatform(applicableMap) }}</div>
              <div
                v-show="detailData.userScopeList"
                class="item"
              >{{ $t('新老用户') }}：{{ detailData.userScopeList | getUserScopeList(userScopeListMap) }}</div>
              <div v-show="detailData.memberTypes" class="item">
                <label>{{ $t('会员类型') }}：</label>
                {{ memberTypeList.join('、') }}
              </div>
              <div v-show="detailData.memberLevels" class="item">
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
              <div class="time-of-day">
                {{ $t('每日时间段') }}：
                <div v-for="(n,index) in detailData.activityScheduleList" :key="index">
                  <p>{{ n.startTime }}{{ $t('至') }}{{ n.endTime }}</p>
                </div>
              </div>
              <div class="item">
                {{ $t('备注') }}：
                <div class="item-description" v-html="detailData.description" />
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
            name="merchantTable_data438"
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
            name="storeTable_data654"
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
          <el-tabs
            v-model="selectSchedule"
            name="selectSchedule"
            @tab-click="handleTabSchedule(selectSchedule)"
          >
            <el-tab-pane
              v-for="(item,index) in activityScheduleList"
              :key="index"
              :label="item.startTime + '--' + item.endTime"
              :name="(index+'')"
              class="schedule-tab"
            />
          </el-tabs>
          <ody-list-search-area>
            <div slot="content">
              <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
                <ody-search-item :label="$t('商家')" prop="merchantId">
                  <promotion-merchant-select
                    v-model="mpSearch.merchantId"
                    :search=" {
                      merchantType: merchantType,
                      promotionId: promotionId
                    }"
                  />
                </ody-search-item>
                <ody-search-item :label="$t('商品编码')" prop="mpCode">
                  <el-input v-model="mpSearch.mpCode" name="mpSearch_obj_mpCode" />
                </ody-search-item>
                <ody-search-item :label="$t('商品名称')" prop="mpName">
                  <el-input v-model="mpSearch.mpName" name="mpSearch_obj_mpName" />
                </ody-search-item>
                <ody-search-item :label="$t('商品条码')" prop="barcode">
                  <el-input v-model="mpSearch.barcode" name="mpSearch_obj_barcode" />
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
                  <div>
                    <!-- <div class="bottom10">
                      <ody-button
                        v-if="detailData.activityStatus === 4"
                        name="outProduct"
                        size="small"
                        type="primary"
                        code="button022"
                        @click="outProduct"
                      >{{ $t('撤出商品') }}</ody-button>
                    </div>-->
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
                      name="mpTable_data801"
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
                      name="mutexTable_data885"
                      children-key="childMpList"
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
      </el-tabs>
    </ody-box>
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
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
import PromotionMutexGoodsLook from '@/components/promotion-mutex-goods-look'
import util from '@/utils/util'
import PromotionReportBtn from '@/components/ViewMarketingReportBtn'
export default {
  name: 'PromSpikeActivityDetail',
  components: {
    PromotionMerchantSelect,
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
      promType: '',
      scopeItemId: '',
      visibleMutex: false,
      selectSchedule: '0',
      treeProps: {
        rootVal: '0',
        parentKey: 'parentId',
        hasChildren: 'hasChildren',
        children: 'childMpList'
      },
      isCanSave: false,
      overLimitTypeList: [],
      promTypeArr: [],
      activityScheduleList: [],
      selectFlag: '1',
      status: '',
      channelMap: {},
      applicableMap: {},
      userScopeListMap: [],
      memberTypeList: [],
      memberLevelsList: {},
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
        refType: 1,
        refThemeId: null,
        status: 0,
        activityScheduleId: null
      },
      mutexSearch: {
        currentPage: 1,
        itemsPerPage: 10,
        refType: 1,
        refThemeId: null,
        status: -1,
        activityScheduleId: null
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
            label: this.$t('零售价（元）'),
            prop: 'salePrice',
            minWidth: 120, show: true
          },
          {
            label: this.$t('秒杀价(元)'),
            prop: 'promPrice',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商家单渠道限购'),
            prop: 'channelMerchantLimit',
            minWidth: 160, show: true
          },
          {
            label: this.$t('店铺单渠道限购'),
            prop: 'channelStoreLimit',
            minWidth: 160, show: true
          },
          {
            label: this.$t('个人单渠道限购'),
            prop: 'channelIndividualLimit',
            minWidth: 160, show: true
          },
          {
            label: this.$t('订单限购'),
            prop: 'orderLimit',
            minWidth: 120, show: true
          },
          {
            label: this.$t('顺序'),
            prop: 'showIndex',
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
          '/back-promotion-web/promotionActivityRead/getActivityScheduleMpList.action',
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
      }
    }
  },
  computed: {
    getOverLimitTypeList() {
      return this.overLimitTypeList.reduce((rtv, item) => {
        rtv[item.id] = item.text
        return rtv
      }, {})
    },
    getPromotionMethodList() {
      return constants.promotionMethodList.reduce((rtv, item) => {
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
    getPromotionTypeList() {
      return this.promTypeArr.reduce((rtv, item) => {
        rtv[item.id] = item.text
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
    }
  },
  created() {
    this.promotionId = this.$route.params.promotionId
    this.status = this.$route.params.status
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.getLoadOscConfigUrl()
    await this.getPromTypeList()
    await this.queryPromotionActivityDetail()
    await this.getChannelArrByBusiness()
    await this.getLoadPageConfigUrl()
    await this.handleMerchantSubmit(1)
    await this.handleMerchantSubmit(2)
    // 调用生效
    await this.query('effect')
    await this.query('mutex')
  },
  methods: {
    selectable(row, index) {
      return !row.disable && !(this.append && row.isAvailable === 1)
    },
    viewMutexGoods(row) {
      this.scopeItemId = row.id
      this.visibleMutex = true
    },
    // async saveSelectionProduct(params) {
    //   const { code } = await this.promotionAPI.saveActivityScheduleMp(params)
    //   if(code === '0') {
    //     await this.handleTabSchedule(this.selectSchedule)
    //   }
    // },
    async handleTabSchedule(val) {
      this.selectSchedule = val
      await this.query('effect')
      await this.query('mutex')
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
    viewMarketingReport() {
      this.$router.push({
        name: 'ObiShowActivityEffectReport',
        query: { id: this.promotionId }
      })
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
            this.promotionAPI
              .verifyActivityPass({
                id: this.promotionId,
                remark: remark
              })
              .then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
          }
        }
      })
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
    async getPromTypeList() {
      const { data = {}} = await this.promotionAPI.loadOscConfigUrl(
        'promTypeList',
        {}
      )
      if (data && data.result) {
        this.promTypeArr = data.result
      }
    },
    async query(type) {
      if (type === 'effect') {
        this.mpSearch.currentPage = 1
        this.mpSearch.refThemeId = this.promotionId
        this.mpSearch.activityScheduleId = this.activityScheduleList[
          this.selectSchedule
        ].id
      } else {
        this.mutexSearch.currentPage = 1
        this.mutexSearch.refThemeId = this.promotionId
        this.mutexSearch.activityScheduleId = this.activityScheduleList[
          this.selectSchedule
        ].id
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
        this.checkedProductList = val.filter(item => {
          return item.isChecked
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
      // console.log(tab, event)
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
        this.promType = data.promotionType
        if (data.memberTypeList) {
          this.memberTypeList = data.memberTypeList.map(
            item => item.memberTypeName
          )
        }
        if (data.activityScheduleList) {
          this.activityScheduleList = data.activityScheduleList
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
      // debugger
      const {
        data: { listObj = [], total = 10 } = {}
      } = await this.promotionAPI.getActivityScheduleMpListUrl(params)
      if (type === 'mutex') {
        this.mutexTable.page.total = total
        var mutexTableList = listObj || []

        mutexTableList.forEach(x => {
          x.id = x.mpId
          const merchantProductList = x.childMpList
          merchantProductList &&
            merchantProductList.forEach(y => {
              if (y.childMpList && y.childMpList.length === 0) {
                delete y.childMpList
              }
              // 如果是系列品
              if (y.typeOfProduct === 3) {
                y.hasChildren = true
                delete y.childMpList
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
            x.channelIndividualLimit = y.channelIndividualLimit
            x.channelMerchantLimit = y.channelMerchantLimit
            x.channelStoreLimit = y.channelStoreLimit
            x.orderLimit = y.orderLimit
            x.salePrice = y.salePrice
            y.promPrice = y.contentValue / 100
            x.promPrice = y.promPrice

            // 如果是系列品
            if (y.typeOfProduct === 3) {
              y.hasChildren = true
              delete y.childMpList
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

      this.mpTable.data = selectedProductList
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
    .time-of-day {
      p {
        font-size: 12px;
        margin-left: 15px;
      }
    }
  }
}
</style>

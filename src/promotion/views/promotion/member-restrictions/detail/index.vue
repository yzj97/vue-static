<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('购买限制')">
      <el-tabs v-model="activeName" name="activeName">
        <el-tab-pane :label="$t('购买限制')" name="first" class="promotion-rules">
          <ody-space :space="4">
            <div class="base-info">
              <div class="item">活动渠道：{{ detailData.channelCodes | getChannelName(channelMap) }}</div>
              <div class="item">限购对象：{{ memberTypeName }}</div>
              <div class="item">时间范围：
                <span v-if="detailData.timeScope==='time_nolimit' && detailData.startDate">无期限，规则开始时间：{{ detailData.startDate | parseTime }}</span>
                <span v-if="detailData.timeScope==='time_period' && detailData.period">按周期，每{{ detailData.period }}{{ detailData.unit | keyVal(getUnitMap) }}</span>
                <span v-if="detailData.timeScope==='time_range' && detailData.startDate && detailData.endDate">自定义期限：{{ detailData.startDate | parseTime }} — {{ detailData.endDate | parseTime }}</span>
              </div>
              <div class="item">
                限购条件：
                <div v-if="canShowAmountLimit()">
                  购买总额限制:{{ detailData.totalAmountLimit }}
                </div>
                <div v-if="canShowOrderCountLimit()">
                  下单数量限制: {{ detailData.orderCountLimit }} 单
                </div>
                <div v-if="canShowLimit4Skus()">
                  购买商品数量限制:
                  所有商品: 每sku最多买{{ detailData.countLimit4Skus }}件
                </div>
                <div v-if="detailData.countLimit4Partials && detailData.countLimit4Partials.length">
                  <span >限购部分商品：</span>
                  <ody-list-table-area v-if="partialLoaded">
                    <div slot="table">
                      <ody-table
                        ref="table"
                        :data="detailData.countLimit4Partials"
                        :can-filter="false"
                        :columns="countLimit.columns"
                        name="detailData_countLimit4Partials004"/>
                    </div>
                  </ody-list-table-area>
                </div>

              </div>
              <div class="item">备注：{{ detailData.description }} </div>
            </div>
          </ody-space>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
    <ody-fixed>
      <ody-button
        name="handleBack"
        type="default"
        code="ui"
        @click="handleBack"
      >
        {{ $t('返回') }}
      </ody-button>
    </ody-fixed>
  </div>
</template>

<script>
// import util from '@/utils/util'
import constants from '@/utils/constants'
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
export default {
  name: 'PromMemberRestrictionsDetail',
  components: {
    PromotionMerchantSelect
  },
  filters: {
    getChannelName(channelCodes, channelMap) {
      if (channelCodes) {
        return channelCodes.map((item) => {
          if (channelMap[item]) {
            return channelMap[item].channelName
          }
        }).join('、')
      }
      return ''
    },
    getMemberTypes(memberTypes, memberTypeList) {
      if (memberTypes) {
        return memberTypes.map((item) => {
          if (memberTypeList[item]) {
            return memberTypeList[item].memberTypeName
          }
        }).join('、')
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
      partialLoaded: false,
      tradeLimitCount4Partials: [],
      tableCountLimit: {},
      memberList: [],

      selectFlag: '1',
      status: '',
      channelMap: {},
      applicableMap: {},
      userScopeListMap: [],
      memberTypeList: [],
      memberLevelsList: {},
      memberTypeName: '',
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
      countLimitParams: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {}
      },
      countLimit: {
        columns: [
          {
            label: this.$t('类目'),
            prop: 'categoryName',
            show: true,
            minWidth: 250
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true,
            minWidth: 220
          },
          {
            label: this.$t('商品价格'),
            prop: 'price',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('个人限购总数'),
            prop: 'limitCount',
            show: true,
            minWidth: 120
          }
        ]
      },
      storeSearch: {
        storeCode: '',
        storeName: ''
      }
    }
  },
  computed: {
    getSelectionRangeTypeList() {
      return constants.selectionRangeTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getUnitMap() {
      return constants.unitTypeMap.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  created() {
    this.promotionId = this.$route.params.promotionId
    this.status = this.$route.params.status
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.query()
    await this.queryPromotionActivityDetail()
    await this.getChannelArrByBusiness()
    await this.getLoadPageConfigUrl()
  },
  methods: {
    handleBack() {
      this.$portal.delActiveView()
    },
    canShowLimit4Skus() {
      return !!this.detailData.countLimit4Skus
    },
    canShowOrderCountLimit() {
      return !!this.detailData.orderCountLimit
    },
    canShowAmountLimit() {
      return !!this.detailData.totalAmountLimit
    },
    async query() {
      await this.querySelectionProductList()
      await this.queryTableList()
    },
    async handleTabChange(val) {
      this.selectFlag = val.name
    },
    async queryTableList() {
      const promotionActivityDetail = this.detailData

      if (!(promotionActivityDetail && promotionActivityDetail.countLimit4Partials && promotionActivityDetail.countLimit4Partials.length)) {
        return false
      }

      const mpIds = promotionActivityDetail.countLimit4Partials.map(x => x.mpId)
      const mpIdLimitCountMap = promotionActivityDetail.countLimit4Partials.reduce((rtv, item) => {
        rtv[item.mpId] = item.limitCount
        return rtv
      }, {})
      const { data: { listObj: countLimit4Partials = [] }} = await this.promotionAPI.queryOmnichannelProductList({
        'obj': {
          'brandType': 1, 'categoryType': 1, 'promType': 10000, 'sellType': 1, 'merchantType': 1,
          mpIds,
          'promotionId': this.promotionId
        }, 'currentPage': 1, 'itemsPerPage': mpIds.length })

      this.detailData.countLimit4Partials = countLimit4Partials.map(x => {
        return {
          ...x,
          limitCount: mpIdLimitCountMap[x.mpId]
        }
      })

      this.partialLoaded = true

      // console.log('sscountLimit4Partials', this.detailData.countLimit4Partials)
    },
    async querySelectedMerchantUrl(merchantType) {
      let addIdList = []
      let currentPage = 1
      let itemsPerPage = 10

      if (merchantType === 1) {
        addIdList = this.allAuthMerchant.map((x) => {
          return x.merchantId
        })
        currentPage = this.merchantTable.page.currentPage
        itemsPerPage = this.merchantTable.page.itemsPerPage
      } else {
        addIdList = this.allAuthStore.map((x) => {
          return x.storeId
        })
        currentPage = this.storeTable.page.currentPage
        itemsPerPage = this.storeTable.page.itemsPerPage
      }

      const { data: { listObj = [], total = 0 } = {}} = await this.promotionAPI.querySelectedMerchantUrl({
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
        merchantType: merchantType,
        promotionId: this.promotionId,
        merchantIdList: addIdList
      })

      if (merchantType === 1) {
        this.merchantTable.page.total = total
        const merchantIdList = listObj.map((x) => {
          return x.merchantId
        })

        return this.allAuthMerchant.filter((x) => {
          return merchantIdList.includes(x.merchantId)
        }) || []
      } else {
        this.storeTable.page.total = total
        const storeIdList = listObj.map((x) => {
          return x.merchantId
        })

        return (this.allAuthStore.filter((x) => {
          return storeIdList.includes(x.storeId)
        }) || [])
      }
    },
    async queryAuthStorePageUrl() {
      let params = {
        currentPage: 1,
        itemsPerPage: 30000,
        channelCodes: this.detailData.channelCodes
      }

      params = Object.assign({}, params, this.storeSearch)

      const { data: { listObj = [] } = {}} = await this.promotionAPI.queryAuthStorePageUrl(params)

      this.allAuthStore = listObj || []
    },
    async queryAuthMerchantPageUrl() {
      let params = {
        currentPage: 1,
        itemsPerPage: 30000,
        channelCodes: this.detailData.channelCodes
      }

      params = Object.assign({}, params, this.merchantSearch)

      const { data: { listObj = [] } = {}} = await this.promotionAPI.queryAuthMerchantPageUrl(params)

      this.allAuthMerchant = listObj || []
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }
      const { data = {}, code } = await this.promotionAPI.queryMemberTypeList(params)
      if (code === '0' && data) {
        this.memberTypeList = data
        for (let i = 0; i < data.length; i++) {
          this.memberLevelsList = data[i].memberLevelList
        }
        for (let j = 0; j < this.memberTypeList.length; j++) {
          for (let r = 0; r < this.memberTypes.length; r++) {
            if (this.memberTypes[r] === this.memberTypeList[j].memberType) {
              this.memberTypeName += this.memberTypeList[j].memberTypeName + '、'
            }
          }
        }
        this.memberTypeName = this.memberTypeName.substring(0, this.memberTypeName.lastIndexOf('、'))
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
    async querySelectionProductList() {
      const params = this.promotionId
      const { data } = await this.promotionAPI.editRestrictions(params)
      if (data) {
        this.detailData = data
        if (data.memTypeList) {
          this.memberTypes = data.memTypeList
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pg-promotion-detail {
  .detail-top{
    margin-bottom: 20px;

    &-titte{
      font-size:16px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(69,90,100,1);
      line-height:22px;
      margin-bottom: 10px;
    }

    &-content{
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(69,90,100,1);
      line-height:20px;

      &-item{
        margin-left: 20px;
      }
    }
  }

  .promotion-rules{
    .base-info{
      height: 100px;
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(69,90,100,1);
      line-height:17px;
    }

    .header{
      font-size:14px;
      margin-bottom: 20px;
    }

    .item{
      margin-bottom: 10px;
      word-break: break-all;
    }

  }
}
</style>

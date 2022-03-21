<template>
  <div class="pg-trial-management">
    <ody-box :title="$t('促销活动详情')">
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
          <el-col v-if="isCanSave" :span="3">
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
          <!-- <el-col :span="4">
            <PromotionReportBtn v-if="viewBtnShow" :promotion-id="promotionId"/>
          </el-col> -->
        </el-row>
      </div>

      <el-tabs v-model="activeName" name="activeName" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('试用规则')" name="first" class="promotion-rules">
          <ody-space :space="4">
            <div class="base-info">
              <div class="header">{{ $t('基本信息') }}</div>
              <div class="item">{{ $t('促销名称') }}：{{ detailData.promTitle }}</div>
              <div
                class="item"
              >{{ $t('活动时间') }}：{{ detailData.fromDate }} — {{ detailData.endDate }}</div>
              <div class="item">
                <label>{{ $t('活动规则说明') }}：</label>
                {{ $t('中文') }}:{{ detailData.ruleDesc }}
                <div>{{ $t('英文') }}:{{ detailData.ruleDescLan2 }}</div>
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
              <div
                v-show="detailData.memberTypes"
                class="item"
              >{{ $t('会员类型') }}：{{ memberTypeList.join('、') }}</div>
              <div v-show="detailData.memberLevels" class="item">
                {{ $t('会员等级') }}：
                <div
                  v-for="item in detailData.memberTypeList"
                  :key="item.memberType"
                  class="levels-content"
                >
                  <el-tag type="info" class="levels-tag">{{ item.memberTypeName }}</el-tag>
                  {{ item.memberLevelList.map(x => x.levelName).join('、') }}
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
            name="merchantTable_data483"
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
            name="storeTable_data828"
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
                  <div>
                    <ody-table
                      :can-filter="false"
                      :data="mpTable.data"
                      :columns="mpTable.columns"
                      :is-tree="true"
                      :default-expand-all="false"
                      :operates="mpTable.operates"
                      :multiple="true"
                      :tree-props="{ rootVal: '0', parentKey: 'parentId', hasChildren: 'hasChildren', children: 'childMpList' }"
                      :load="loadChildren"
                      name="mpTable_data867"
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
              </el-tabs>
            </div>
          </ody-list-table-area>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
  </div>
</template>

<script>
import constants from '@/utils/constants'
import util from '@/utils/util'
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
import PromotionReportBtn from '@/components/ViewMarketingReportBtn'
export default {
  name: 'PromTrialActivityListDetail',
  components: {
    PromotionMerchantSelect,
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
      isCanSave: false,
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
            minWidth: 200, show: true
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
          },
          {
            label: this.$t('试用限量'),
            prop: 'channelMerchantLimit',
            minWidth: 120, show: true
          },
          {
            label: this.$t('剩余试用量'),
            prop: 'spareLimitNum',
            minWidth: 120, show: true
          },
          {
            label: this.$t('已申请人数'),
            prop: 'appliedNum',
            minWidth: 120, show: true
          }
        ],
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
    },
    getSelectionRangeTypeList() {
      return constants.selectionRangeTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
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
    }
  },
  created() {
    this.promotionId = this.$route.params.promotionId
    this.status = this.$route.params.status
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.handleCanSave()
    await this.queryPromotionActivityDetail()
    await this.getChannelArrByBusiness()
    await this.getLoadPageConfigUrl()
    await this.query('effect')
    await this.handleMerchantSubmit(1)
    await this.handleMerchantSubmit(2)
  },
  methods: {
    viewMarketingReport() {
      this.$router.push({
        name: 'ObiShowActivityEffectReport',
        query: { id: this.promotionId }
      })
    },
    async query(type) {
      if (type === 'effect') {
        this.mpSearch.currentPage = 1
        this.mpSearch.obj.activityId = this.promotionId
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
          // if (type === 'promPrice') {
          //   x.agentList.forEach((item) => {
          //     // item.contentValue = x[type]
          //     if (this.contentType === 1 || this.contentType === 3) {
          //       if (val) {
          //         item.contentValue = +val * 100
          //       } else {
          //         item.contentValue = +x[type] * 100
          //       }
          //     } else if (this.contentType === 2) {
          //       if (val) {
          //         item.contentValue = +val * 10
          //       } else {
          //         item.contentValue = +x[type] * 10
          //       }
          //     }
          //   })
          // }
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
        // if (type === 'promPrice') {
        //   row.agentList.forEach((item) => {
        //     item.contentValue = row[type]
        //     if (this.contentType === 1 || this.contentType === 3) {
        //       item.contentValue = +row[type] * 100
        //       if (val) {
        //         item.contentValue = +val * 100
        //       } else {
        //         item.contentValue = +row[type] * 100
        //       }
        //     } else if (this.contentType === 2) {
        //       if (val) {
        //         item.contentValue = +val * 10
        //       } else {
        //         item.contentValue = +row[type] * 10
        //       }
        //     }
        //   })
        // }

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
        if (data.memberTypeList) {
          this.memberTypeList = data.memberTypeList.map(
            item => item.memberTypeName
          )
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
    // type : 'effect' 生效商品
    async querySelectionProductList(type) {
      let params = {}
      if (type === 'effect') {
        params = this.mpSearch
      }

      const {
        data: { listObj = [], total = 10 } = {}
      } = await this.promotionAPI.querySelectionProListMethod(params)

      this.mpTable.page.total = total
      const selectedProductList = listObj || []

      selectedProductList.forEach(x => {
        x.id = x.mpId
        const merchantProductList = x.childMpList
        merchantProductList &&
          merchantProductList.forEach(y => {
            x.salePrice = y.salePrice
            x.channelMerchantLimit = y.channelMerchantLimit
            x.channelIndividualLimit = y.channelIndividualLimit
            x.sortIndex = y.sortIndex
            x.appliedNum = y.appliedNum
            x.spareLimitNum = y.spareLimitNum

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
          item.promPrice = item.agentList[0].contentValue / 100
        }
      })
      resolve(res.data)
    },
    handleCanSave() {
      const params = {
        promotionMethod: 21,
        id: this.promotionId
      }
      this.promotionAPI.promotionPriceCheck(params).then(res => {
        if (res.data.flag) {
          this.isCanSave = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pg-trial-management {
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
    .report-btn {
      text-align: center;
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
    }
    .item-description {
      display: inline-block;
      p {
        font-size: 12px;
      }
    }
  }
}
</style>

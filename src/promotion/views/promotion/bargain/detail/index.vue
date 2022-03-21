<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('砍价活动详情')">
      <div class="detail-top">
        <div class="detail-top-titte">{{ $t('活动名称') }}：{{ detailData.activityTitle }}</div>
        <el-row>
          <el-col :span="10">
            <div class="detail-top-content">
              <span>{{ $t('活动ID') }}：{{ detailData.id }}</span>
              <span
                class="detail-top-content-item"
              >{{ $t('当前状态') }}：{{ detailData.status | keyVal(getActivityStatus) }}</span>
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
          <el-col :span="4">
            <PromotionReportBtn v-if="viewBtnShow" :promotion-id="promotionId"/>
          </el-col>
        </el-row>
      </div>

      <el-tabs v-model="activeName" name="activeName" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('砍价规则')" name="first" class="promotion-rules">
          <ody-space :space="4">
            <div class="base-info">
              <div class="header">{{ $t('基本信息') }}</div>
              <div class="item">
                <label>{{ $t('促销名称') }}：</label>
                {{ detailData.activityTitle }}
              </div>
              <div class="item">
                <label>{{ $t('活动时间') }}：</label>
                {{ detailData.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} — {{ detailData.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('活动规则') }}</div>
              <div class="item">
                <label>{{ $t('砍价方式') }}：</label>
                {{ getStyle }}
              </div>
              <div class="item">
                <label>{{ $t('个人砍价限制次数') }}：</label>
                {{ detailData.individualLimit }}
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('交易规则') }}</div>
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
              <div v-show="detailData.userScopeList" class="item">
                <label>{{ $t('新老用户') }}：</label>
                {{ detailData.userScopeList | getUserScopeList(userScopeListMap) }}
              </div>
              <div class="item">
                <label>{{ $t('备注') }}：</label>
                <span class="item-description" v-html="detailData.description" />
              </div>
            </div>
          </ody-space>
        </el-tab-pane>

        <el-tab-pane :label="$t('参与商品')" name="third">
          <ody-list-search-area>
            <div slot="content">
              <el-form ref="mpSearch" :model="mpSearch" label-width="100px" class="form">
                <ody-search-item :label="$t('商品编码')" prop="obj.mpCode">
                  <el-input v-model="mpSearch.obj.mpCode" name="mpSearch_obj_mpCode" />
                </ody-search-item>
                <ody-search-item :label="$t('商品名称')" prop="obj.mpName">
                  <el-input v-model="mpSearch.obj.mpName" name="mpSearch_obj_mpName" />
                </ody-search-item>
              </el-form>
            </div>
            <div slot="btn">
              <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
              <el-button size="small" type="primary" @click.prevent="query()">{{ $t('查询') }}</el-button>
            </div>
          </ody-list-search-area>

          <ody-list-table-area>
            <div slot="tabs">
              <el-tabs v-model="selectFlag" name="selectFlag" @tab-click="handleTabChange">
                <el-tab-pane :label="`${$t('生效商品')}(${mpTable.page.total})`" name="1">
                  <div>
                    <!-- multiple="false" 有个bug，不展示 -->
                    <ody-table
                      :can-filter="false"
                      :data="mpTable.data"
                      :columns="mpTable.columns"
                      :is-tree="true"
                      :default-expand-all="false"
                      :multiple="true"
                      :tree-props="{ rootVal: '0', parentKey: 'parentId', hasChildren: 'hasChildren', children: 'children' }"
                      :load="loadChildren"
                      name="mpTable_data866"
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
                      @size-change="handleSizeChange()"
                      @current-change="handleCurrentChange()"
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
import PromotionReportBtn from '@/components/ViewMarketingReportBtn'
export default {
  name: 'PromBargainPromotionDetail',
  components: {
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
    getUserScopeList(userScopeList, userScopeListMap) {
      if (userScopeList) {
        var userScopeArr = []
        if (userScopeListMap && userScopeListMap.length > 0) {
          userScopeList.map(item => {
            const index = userScopeListMap.findIndex(key => key.id === item)
            userScopeArr.push(userScopeListMap[index].text)
          })
          return userScopeArr.join('、')
        }
      }
      return ''
    }
  },
  data() {
    return {
      promType: '',
      isCanSave: false,
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
      mpSearch: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          mpCode: '',
          mpName: '',
          isAvailable: 1
        }
      },
      mpTable: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
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
            label: this.$t('店铺名称'),
            prop: 'storeName',
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
            label: this.$t('原价（元）'),
            prop: 'salePrice',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('起始价（元）'),
            prop: 'startPrice',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('砍价底线（元）'),
            prop: 'endPrice',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('个人单渠道限购'),
            prop: 'individualLimit',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('店铺单渠道限购'),
            prop: 'saleLimit',
            show: true,
            minWidth: 120
          }
        ],
        data: [],
        page: {
          total: 0
        }
      }
    }
  },
  computed: {
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
    getStyle() {
      switch (this.detailData.type) {
        case 0:
          return this.$t('固定金额') + ` ${this.detailData.firstMoney}` + this.$t('元')
        case 1:
          return this.$t('随机金额') + ` ${this.detailData.firstMoney}-${this.detailData.endMoney}元`
        case 2:
          return this.$t('限制次数') + ` ${this.detailData.totalLimit}` + this.$t('次金额随机')
      }
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
      return +this.detailData.status === 0 || +this.detailData.status === 3
    },
    verifyBtnShow() {
      return +this.detailData.status === 1
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
    await this.query()
    await this.handleCanSave()
  },
  methods: {
    async loadChildren(tree, treeNode, resolve) {
      // debugger
      const params = {
        mpId: treeNode.mpId,
        refThemeId: treeNode.refThemeId
      }
      const res = await this.promotionAPI.getPromotionCutPriceMpChildList(
        params
      )

      res.data && res.data.forEach(item => {
        item.disable = true
      })

      resolve(res.data)
    },
    viewMarketingReport() {
      this.$router.push({
        name: 'ObiShowActivityEffectReport',
        query: { id: this.promotionId }
      })
    },
    async handleCanSave() {
      const result = await this.promotionAPI.checkCutPriceMPPrice({
        refThemeId: this.promotionId
      })
      this.isCanSave = result.data.flag
    },
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      const { code } = await this.promotionAPI.cutPriceActivitySubmitAudit({
        id: this.promotionId,
        status: this.detailData.status
      })
      if (+code === 0) {
        await this.queryPromotionActivityDetail()
      }
    },
    openVerifyPop() {
      this.$prompt(this.$t('管理员备注') + ':', this.$t('提示'), {
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
            this.$message(this.$t('请填写备注'))
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
              .cutPriceActivityAuditNotPass({
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
            const { code } = await this.promotionAPI.cutPriceActivityAuditPass({
              id: this.promotionId,
              remark: remark,
              status: 1
            })
            if (+code === 0) {
              await this.queryPromotionActivityDetail()
              done()
            }
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
    async query() {
      await this.querySelectionProductList()
    },
    async handleTabChange(val) {
      this.selectFlag = val.name
    },

    async handleReset() {
      this.mpSearch.currentPage = 1
      this.mpSearch.obj.mpCode = null
      this.mpSearch.obj.mpName = null
      await this.query()
    },

    async handleSizeChange() {
      this.mpSearch.currentPage = 1
      this.query()
    },
    async handleCurrentChange() {
      this.query()
    },
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    async queryPromotionActivityDetail() {
      const { data = {}, code } = await this.promotionAPI.queryCutPriceDetail(
        this.promotionId
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
    async querySelectionProductList() {
      const params = this.mpSearch
      params.obj.refThemeId = this.promotionId

      const { data: { total, listObj }} = await this.promotionAPI.queryCutPriceMpList(params)

      this.mpTable.page.total = total
      listObj.forEach(x => {
        // console.log(x, 77)
        x.type = 'parent'
        // 如果是系列品
        // console.log(merchantProductList, 8888999)
        if (x.typeOfProduct === 3) {
          // console.log('2222')
          // x.children = []
          x.hasChildren = true
          // x.children = []
        }
      })

      this.mpTable.data = listObj || []
      // console.log(this.mpTable.data, 111111)
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

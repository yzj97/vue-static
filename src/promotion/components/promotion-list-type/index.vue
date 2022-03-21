<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form :model="listQuery">
          <ody-search-item :label="$t('活动名称:')" prop="obj.title">
            <el-input
              v-model="listQuery.obj.title"
              :placeholder="$t('请输入活动名称')"
              name="listQuery_obj_title"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动ID:')" prop="obj.activityId">
            <ody-input-number
              v-model="listQuery.obj.activityId"
              :max="9999999999999999"
              :empty-tip="false"
              :placeholder="$t('请输入活动ID')"
              name="listQuery_obj_activityId"
              maxlength="16"
              style="width:100%"
              clearable
            />
          </ody-search-item>
          <ody-search-item
            v-if="frontPromTypeArr && frontPromTypeArr.length >=1"
            :label="$t('活动类型:')"
            prop="obj.frontPromotionType"
          >
            <front-promotion-type-select
              v-model="listQuery.obj.frontPromotionType"
              :prom-type="listQuery.obj.promType"
              :placeholder="$t('全部')"
              name="listQuery_obj_frontPromotionType"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建人:')" prop="obj.createUsername">
            <el-input
              v-model="listQuery.obj.createUsername"
              :placeholder="$t('请输入创建人')"
              name="listQuery_obj_createUsername"
              clearable
            />
          </ody-search-item>

          <ody-search-item
            v-if="frontPromTypeArr && frontPromTypeArr.length >=1"
            :label="$t('活动渠道:')"
            prop="obj.channelCode"
          >
            <promotion-channel-code-select
              v-model="listQuery.obj.channelCode"
              :prom-type="listQuery.obj.promType"
              :placeholder="$t('全部')"
              name="listQuery_obj_channelCode"
              @channelCodeArr="getChannelCodeArr"
            />
          </ody-search-item>
          <ody-search-item v-if="canShowActivityType()" :label="$t('参与方式:')" prop="obj.activityType">
            <promotion-activity-type-select
              v-model="listQuery.obj.activityType"
              :placeholder="$t('全部')"
              name="listQuery_obj_activityType"
            />
          </ody-search-item>
          <ody-search-item v-if="canMerchantStoreShow()" :label="$t('活动商家:')" prop="obj.merchantId">
            <ody-merchant-select
              v-model="listQuery.obj.merchantId"
              :placeholder="$t('全部')"
              name="listQuery_obj_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item v-if="canMerchantStoreShow()" :label="$t('活动店铺:')" prop="obj.storeId">
            <ody-store-select
              v-model="listQuery.obj.storeId"
              :placeholder="$t('全部')"
              name="listQuery_obj_storeId"
              value-key="storeId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动时间:')" :space="2" prop="obj.createTime">
            <ody-date-range-picker
              v-model="listQuery.obj.createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="listQuery_obj_createTime"
              type="date"
              range-separator="-"
            />
          </ody-search-item>

          <!-- 秒杀活动链接 -->
          <!-- <ody-search-item v-if="+listQuery.obj.promType === 14" :space="2" class="spike-link">
            <div v-for="code in channelCodeArr" :key="code.channelCode" class="link-btn">
              <el-popover
                :title="code.channelName"
                :content="linkContent"
                placement="top-start"
                width="200"
                trigger="hover">
                <ody-button slot="reference" name="resetCode" class="filter-item" size="small" @click="resetCode(code.channelCode)">{{ code.channelName }}</ody-button>
              </el-popover>
              <el-input id="input1" style="display:none;"/>
            </div>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="$t('发送此活动链接或将其设置到页面上，您都可以把活动推送给他们啦~')">
              <ody-button slot="reference" name="copyLink" class="filter-item" size="small" type="primary" @click="copyLink">{{ $t('复制活动链接') }}</ody-button>
            </el-popover>
          </ody-search-item>-->
        </el-form>
      </div>
      <div slot="btn">
        <el-button
          name="resetQuery"
          class="filter-item"
          size="small"
          @click="resetQuery"
        >{{ $t('重置') }}</el-button>
        <ody-button
          name="handleSearchSubmit"
          class="filter-item"
          type="primary"
          size="small"
          code="button001"
          @click="handleSearchSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <!-- <router-link :to="{ name: 'PromSinglePromotionEdit',params: {promotionType: listQuery.obj.promType} }"> -->
        <ody-button
          code="button002"
          name="createPromotion"
          type="primary"
          size="small"
          @click="createPromotion(listQuery.obj.promType)"
        >{{ $t('创建活动') }}</ody-button>
        <!-- </router-link> -->
        <template v-if="promType === 14">
          <el-radio-group v-model="copy.channel" name="copy_channel" size="small" style="margin-left: 16px">
            <el-radio-button v-for="link in copy.links" :label="link.key" :key="link.key" >
              {{ link.text }}
            </el-radio-button>
          </el-radio-group>
          <ody-button
            v-clipboard:copy="getCopyData"
            v-clipboard:success="handleClipboardSuccess"
            code="ui"
            size="small"
            type="primary"
            style="margin-left: 16px"
          >
            复制活动链接
          </ody-button>
          <el-tooltip :content="$t('发送此活动链接或将其设置到页面上，您都可以把活动推送给他们啦~')" class="item" effect="dark" placement="right">
            <i class="el-icon-question" />
          </el-tooltip>
        </template>
      </div>
      <div slot="tabs">
        <el-tabs
          v-model="listQuery.obj.status"
          name="listQuery_obj_status"
          @tab-click="handleSearchSubmit"
        >
          <el-tab-pane :label="$t('全部')" name="-1" />
          <el-tab-pane :label="$t('进行中')" name="4" />
          <el-tab-pane :label="$t('已过期')" name="5" />
          <el-tab-pane :label="$t('已关闭')" name="6" />
          <el-tab-pane :label="$t('未开始')" name="2" />
          <el-tab-pane :label="$t('待提交')" name="0" />
          <el-tab-pane :label="$t('待审核')" name="1" />
          <el-tab-pane :label="$t('审核未通过')" name="3" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="columns"
          :operates="operates"
          request-url="/back-promotion-web/promotionRead/queryPromotionList.do"
        >
          <template slot="startTime" slot-scope="scope">
            <span
              v-if="scope.row.startTime && scope.row.endTime"
            >{{ scope.row.startTime | parseTime }}-{{ scope.row.endTime | parseTime }}</span>
          </template>

          <template slot="status" slot-scope="scope">
            <div v-if="scope.row.remark">
              <el-tooltip :content="scope.row.remark" class="item" effect="dark" placement="right">
                <div>
                  <!-- {{ scope.row.status }} -->
                  <span
                    v-if="scope.row.status == 3"
                    style="color:red"
                  >{{ scope.row.status | keyVal(getActivityStatus) }}</span>
                  <span
                    v-if="scope.row.status != 3"
                  >{{ scope.row.status | keyVal(getActivityStatus) }}</span>
                  <i v-if="scope.row.remark" class="el-icon-question" />
                </div>
              </el-tooltip>
            </div>
            <div v-else>
              <span
                v-if="scope.row.status == 3"
                style="color:red"
              >{{ scope.row.status | keyVal(getActivityStatus) }}</span>
              <span
                v-if="scope.row.status != 3"
              >{{ scope.row.status | keyVal(getActivityStatus) }}</span>
            </div>
          </template>

          <template slot="createTime" slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime }}</span>
          </template>
          <template slot="activityType" slot-scope="scope">
            <div v-if="scope.row.activityType">
              <span>{{ getActivityTypeName(scope.row.activityType) }}</span>
            </div>
            <div v-else>
              <span>{{ scope.row.payType | keyVal(getPayTypeName) }}</span>
            </div>
          </template>
          <template slot="activityId" slot-scope="scope">
            <a
              v-if="$portal.hasPermission('button003')"
              name="seeNewTab"
              class="activity-id-link"
              @click="seeNewTab(scope.row)"
            >{{ scope.row.activityId }}</a>
            <a
              v-if="!$portal.hasPermission('button003')"
              name="seeNewTab"
              class="activity-id-link"
            >{{ scope.row.activityId }}</a>
          </template>

          <!-- <template slot="orgCode" slot-scope="scope">
            <el-button name="handleTableView" size="small" type="text" class="width-auto" @click="handleTableView(scope.row)">
              {{ scope.row.orgCode }}
            </el-button>
          </template>
          <template slot="storeOnlineType" slot-scope="scope">
            {{ scope.row.storeOnlineType | keyVal(getStoreBigTypeMap) }}
          </template>-->
        </ody-table>
      </div>
    </ody-list-table-area>

    <input id="input" style="opacity: 0;" >
  </div>
</template>

<script>
import * as utilService from '@/services/utilService'
import * as constantService from '@/services/constantService'

import constants from '@/utils/constants'
import FrontPromotionTypeSelect from '@/components/front-promotion-type-select'
import PromotionChannelCodeSelect from '@/components/promotion-channel-code-select'
import PromotionActivityTypeSelect from '@/components/promotion-activity-type-select'
import PromotionTypeRadio from '@/components/promotion-type-radio'
import { listEdit, listDetail, listCreate, listAppend } from '@/utils/listType'

export default {
  components: {
    FrontPromotionTypeSelect,
    PromotionChannelCodeSelect,
    PromotionActivityTypeSelect,
    PromotionTypeRadio
  },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    const { type } = this
    const promType = parseInt(type, 10)

    return {
      copy: {
        channel: '',
        links: []
      },
      radio1: 'ss',
      payTypeList: [],
      linkContent: '',
      channelCodeArr: [],
      merchantType: undefined,
      title: this.$t('promotion'),
      platformId: null,
      promotionDictionary: null,
      applyActivityTypeArr: undefined,
      patchGroupModel: 0,
      channelMap: null,
      frontPromTypeArr: {},
      persellPromotionType: 13,
      activityTypeArray: constantService.getActivityTypeArray(),
      promType,
      listQuery: {
        obj: {
          promType,
          status: '-1',
          title: undefined, // 活动名称
          activityId: undefined, // 活动Id
          activityType: undefined,
          createUsername: undefined,
          startTime: undefined,
          endTime: undefined,
          channelCode: undefined,
          frontPromotionType: undefined,
          merchantId: undefined,
          storeId: undefined,
          createTime: []
        }
      },
      columns: [
        {
          show: true,
          slot: 'activityId',
          label: this.$t('活动ID'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'title',
          label: this.$t('活动名称'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'channelCodes',
          label: this.$t('活动渠道'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            return `<span>${this.getChannelName(row.channelCodes)}</span>`
          }
        },
        {
          show: true,
          slot: 'startTime',
          label: this.$t('活动时间'),
          align: 'center',
          minWidth: 200
        },
        {
          show: promType !== 12,
          prop: 'frontPromotionType',
          label: this.$t('活动类型'),
          align: 'center',
          formatter: (row, colum, cellValue) => {
            return `<span>${this.getFrontPromotionTypeName(row) || ''}</span>`
          }
        },
        {
          show: this.showActivityType,
          slot: 'activityType',
          label: this.type === 12 ? this.$t('支付方式') : this.$t('参与方式'),
          align: 'center'
        },
        {
          show: true,
          label: this.$t('状态'),
          slot: 'status',
          align: 'center'
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('创建人'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          slot: 'createTime',
          label: this.$t('创建时间'),
          align: 'center',
          minWidth: 200
        }
      ],
      operates: {
        width: 300,
        fixed: 'right',
        list: [
          {
            label: this.$t('see'),
            hidden: (index, row) => {
              return !(
                row.promType < 100 ||
                row.promType === 2000 ||
                row.promType === 3001 ||
                row.promType === 4001 ||
                row.promType === 5001
              )
            },
            method: (index, row) => {
              this.seeNewTab(row)
            },
            code: 'button003'
          },
          {
            label: this.$t('复制'),
            // hidden:true隐藏，false显示
            hidden: (index, row) => {
              return this.copyBtnShow(row)
            },
            method: (index, row) => {
              this.copyActivity(row)
            },
            code: 'button005'
          },
          {
            label: this.$t('edit'),
            hidden: (index, row) => {
              const show = this.updateBtnShow(row) && this.isHasWriteRoll(row)
              return !show
            },
            method: (index, row) => {
              this.editActivity(row)
            },
            code: 'button006'
          },
          {
            label: this.$t('delete'),
            hidden: (index, row) => {
              return this.deleteBtnShow(row)
            },
            method: (index, row) => {
              this.deleteActivity(row)
            },
            code: 'button007'
          },
          {
            label: this.$t('close'),
            hidden: (index, row) => {
              return this.stopBtnShow(row)
            },
            method: (index, row) => {
              this.closeActivity(row)
            },
            code: 'button008'
          },
          {
            label: this.$t('抽奖干预'),
            hidden: (index, row) => {
              const show = this.interveneLotteryBtnShow(row)
              return !show
            },
            method: (index, row) => {
              this.interveneLottery(row)
            },
            code: 'button009'
          },
          {
            label: this.$t('追加商品'),
            hidden: (index, row) => {
              const show = this.appendBtnShow(row) && this.isHasWriteRoll(row) // && this.showMerchantClientPromotion() 先拿出来
              return !show
            },
            method: (index, row) => {
              this.appendMerchantProduct(row)
            },
            code: 'button010'
          },
          {
            label: this.$t('创建报名'),
            hidden: (index, row) => {
              const show = this.createApplyActivityBtnShow(row)
              return !show
            },
            method: (index, row) => {
              this.createApplyActivity(row)
            },
            code: 'button011'
          },
          {
            label: this.$t('查看营销报告'),
            hidden: (index, row) => {
              const show = this.viewMarketingReportBtnShow(row)
              return !show
            },
            method: (index, row) => {
              this.viewMarketingReport(row)
            },
            code: 'button012'
          },
          {
            label: this.$t('抽奖链接'),
            hidden: (index, row) => {
              const show = this.showLotteryLinkBtnShow(row)
              return !show
            },
            method: (index, row, $event) => {
              this.showLotteryLink(row, $event)
            },
            code: 'button013'
          }
          // {
          //   // slot 设置 tooltips 发送此活动链接或将其设置到页面上，您都可以把活动推送给他们啦~
          // }
        ]
      }
    }
  },
  computed: {
    getCopyData() {
      const copyItem = this.copy.links.find(x => x.key === this.copy.channel)

      return copyItem && copyItem.url
    },
    getActivityStatus() {
      return constants.activityStatus.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getPayTypeName() {
      return this.payTypeList.reduce((rtv, item) => {
        rtv[item.channelCode] = item.channelName
        return rtv
      }, {})
    }
  },
  created() {
    // 取路由promType
    this.listQuery.obj.promType = parseInt(this.type, 10)
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPayChannel()
    this.getChannelMap()

    await this.init()

    if (this.promType === 14) {
      await this.getPromotionLinks()
    }
  },
  methods: {
    handleClipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    async getPromotionLinks() {
      const params = {
        'channelCodes': ['110001', '110002', '110003'],
        'lable': 'h5',
        'promType': '14'
      }
      const { data = [], code } = await this.promotionAPI.getPromotionLinks(
        params
      )

      if (code === '0') {
        const textMap = {
          '110001_h5': '自建BBC',
          '110002_h5': '自建B2B',
          '110003_h5': '自建O2O'
        }

        this.copy.links = data.map(link => {
          link.text = textMap[link.key]
          return link
        })
        this.copy.channel = data[0].key
      }
    },
    getPromoitionTypeByApplyType(promotionType) {
      // 秒杀
      if (promotionType === 5) {
        return 7
      }
      // 预售
      if (promotionType === 8) {
        return 13
      }
      // TODO 报名增加类型需要修改，报名目前只支持1---8
      if (promotionType < 5) {
        return promotionType
      }
    },
    canShowActivityType() {
      if (this.platformId !== 1) {
        return false
      }
      // if (this.activityType !== '0') {
      //   return false
      // }
      if (utilService.isEmpty(this.applyActivityTypeArr)) {
        return false
      }
      var flag = false
      // console.log(this.applyActivityTypeArr, this.promType)
      this.applyActivityTypeArr.forEach(data => {
        if (this.getPromoitionTypeByApplyType(data.id) === this.promType) {
          flag = true
        }
      })
      return flag
    },
    showActivityType() {
      if (
        this.listQuery.obj.promType === 5001 ||
        this.listQuery.obj.promType === 9 ||
        this.listQuery.obj.promType === 4 ||
        this.listQuery.obj.promType === 11 ||
        this.listQuery.obj.promType === 3001 ||
        this.listQuery.obj.promType === 2 ||
        this.listQuery.obj.promType === 3 ||
        this.listQuery.obj.promType === 10 ||
        this.listQuery.obj.promType === 13 ||
        this.listQuery.obj.promType === 14 ||
        this.listQuery.obj.promType === 15 ||
        this.listQuery.obj.promType === 16 ||
        this.listQuery.obj.promType === 18
      ) {
        return false
      } else {
        return true
      }
    },
    // 创建活动报名
    createApplyActivity(e) {
      let params

      // 针对秒杀活动特殊处理，创建报名活动链接的类型为5
      if (e.frontPromotionType === 1012) {
        params = { refThemeId: e.activityId, refType: 1, promotionType: 5 }
      } else if (e.promType === 13) {
        params = { refThemeId: e.activityId, refType: 1, promotionType: 8 }
      } else if (e.promType < 100) {
        params = {
          refThemeId: e.activityId,
          refType: 1,
          promotionType: e.promType
        }
      } else if (e.promType === 2000) {
        params = { refThemeId: e.activityId, refType: 2, promotionType: 6 }
      } else if (e.promType === 3001) {
        params = { refThemeId: e.activityId, refType: 3, promotionType: 7 }
      }

      this.$router.push({
        name: 'PromRegistrationRecordRule',
        params
      })
    },
    // 抽奖链接-展示
    showLotteryLinkBtnShow(e) {
      return e.promType === 5001
    },
    // 创建报名-展示
    createApplyActivityBtnShow(e) {
      return (
        (e.status === 2 || e.status === 4) &&
        e.activityType === 2 &&
        this.type === 1 &&
        e.promType !== 5001 &&
        e.canCreateActivity === 1
      )
    },
    // 跳转到追加商品页
    appendMerchantProduct(e) {
      // var url = 'app.appendMerchantProduct'
      // if (e.promType == 14) {
      //   url = 'app.appendActivitySchedule'
      // } else if (e.promType == 3001) {
      //   url = 'app.appendCutPriceMp'
      // }
      // var data = { id: e.activityId, promType: e.promType }
      // $rootScope.tabNewCtrl(url, e.activityId, $scope.i18n('promotion.additional_goods', ''), data)
      const params = {
        promotionId: e.activityId,
        promotionType: e.promType
      }

      this.$router.push({
        name: listAppend[e.promType],
        params: params
      })
    },
    // 判断活动是否过期
    getTrueStatusByStatusAndTimeRange(status, startTime, endTime) {
      return utilService.getTrueStatusByStatusAndTimeRange(
        status,
        startTime,
        endTime,
        2,
        4,
        5
      )
    },
    // 获取促销活动状态的值
    getPromotionActivityStatusValue(key) {
      return utilService.getDictionaryText(key, this.promotionActivityStatusArr)
    },
    // 获取促销类型的值
    getPromTypeValue(key) {
      if (this.frontPromTypeArr) {
        return utilService.getDictionaryText(key, this.frontPromTypeArr)
      }
    },
    // 获取促销类型的值
    getFrontPromTypeValue(item) {
      if (this.frontPromTypeArr) {
        return utilService.getDictionaryText(
          item.frontPromotionType,
          this.frontPromTypeArr
        )
      }
    },
    // 查看链接
    async showLotteryLink(e) {
      let data
      if (this.promType === 5001) {
        data = {
          channelCodes: e.channelCodes,
          // 目前先写死为h5
          lable: 'h5',
          promType: e.promType,
          themeId: e.activityId
        }
        this.dialogChannelCode = e.channelCodes
      } else if (this.promType === 14) {
        data = {
          channelCodes: this.linkChannelCodes,
          // 目前先写死为h5
          lable: 'h5',
          promType: this.promType
        }
      }

      const {
        data: [{ url }] = []
      } = await this.$promotion.$api.promotion.getPromotionLinks(data)
      const className = `my-copy-${new Date() * 1}`

      // this.promotionLinks = result.data
      const res = await this.$alert(this.$t('自建BBC') + `: \n ${url}`, this.$t('抽奖链接'), {
        confirmButtonText: this.$t('复制'),
        confirmButtonClass: className
      })

      if (res) {
        const input = document.getElementById('input')
        input.value = url
        input.select() // 选择对象
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$message.success('复制成功')
      }
    },
    canMerchantStoreShow() {
      if (this.promType < 1000) {
        if (this.promType === 12 || this.promType === 16) {
          return false
        }
        return true
      } else {
        return false
      }
    },
    showMerchantClientPromotion() {
      if (!utilService.isEmpty(this.merchantType)) {
        return false // 不显示
      } else {
        return true // 显示
      }
    },
    // 追加商品按钮显示(普通促销和砍价允许追加商品, 排除支付优惠、预售、套餐)
    appendBtnShow(e) {
      return (
        (e.status === 2 || e.status === 4) &&
        ((e.promType === 1 && e.activityType === 1) ||
        e.promType === 2 ||
        e.promType === 3 ||
        e.promType === 4 ||
        e.promType === 9 ||
        e.promType === 10 ||
        e.promType === 11 ||
        e.promType === 14 || // 秒杀
        e.promType === 3001 || // 砍价
          e.promType === 16 ||
          e.promType === 18)
      )
    },
    // 抽奖干预显示
    interveneLotteryBtnShow(row) {
      return row.promType === 5001 && row.status === 4
    },
    // 抽奖干预
    interveneLottery(e) {
      // angular
      /**
       * var data = {lotteryActivityId: e.activityId,editType:2};
       * $rootScope.tabNewCtrl('app.lotteryAwards',e.activityId,$scope.i18n('promotion.lottery_intervention',''),data);
       */
      const params = {
        promotionId: e.activityId,
        promotionType: e.promType,
        steps: 1,
        interveneLottery: true
      }
      this.$router.push({
        name: 'PromLotteryActivityIntervene',
        params: params
      })
    },
    async queryPayChannel() {
      const res = await this.promotionAPI.queryPayChannel({})
      this.payTypeList = res.data
    },
    createPromotion(promType) {
      this.$router.push({
        name: listCreate[promType],
        params: {
          promotionType: promType
        }
      })
    },
    // 编辑按钮显示
    updateBtnShow(e) {
      // 促销活动状态为0：待提交或3：审核未通过时按钮显示
      return e.status === 0 || e.status === 3
    },
    resetQuery() {
      this.listQuery.obj = {
        promType: parseInt(this.type, 10),
        status: '-1',
        title: undefined,
        activityId: undefined,
        activityType: undefined,
        createUsername: undefined,
        startTime: undefined,
        endTime: undefined,
        channelCode: undefined,
        frontPromotionType: undefined,
        merchantId: undefined,
        storeId: undefined,
        createTime: []
      }
    },
    /**
     * 获取渠道名称
     * @param channelCodes
     */
    getChannelName(channelCodes) {
      if (utilService.isEmpty(channelCodes)) {
        return ''
      } else {
        return channelCodes
          .filter(x => this.channelMap[x])
          .map(item => {
            return this.channelMap[item].channelName
          })
          .join('、')
      }
    },
    /**
     * 获取活动类型名称
     * @param val
     * @returns {string}
     */
    getActivityTypeName(val) {
      if (utilService.isEmpty(val)) {
        return ''
      } else {
        const activityTypeName = utilService.getDictionaryText(
          val,
          this.activityTypeArray
        )
        return activityTypeName
      }
    },
    /**
     * 获取全局促销子类型名称
     * @param item
     * @returns {*}
     */
    getFrontPromotionTypeName(item) {
      if (utilService.isEmpty(item)) {
        return ''
      } else {
        const frontPromotionTypeName = utilService.getDictionaryText(
          item.frontPromotionType,
          this.frontPromTypeArr
        )
        return frontPromotionTypeName
      }
    },
    /**
     * 加载渠道名称
     */
    getChannelMap() {
      this.promotionAPI.queryChannelMap().then(response => {
        if (response.code === '0') {
          this.channelMap = response.data
        }
      })
    },
    getChannelCodeArr(val) {
      this.channelCodeArr = val
    },
    resetCode(code) {
      if (+code === 110001) {
        this.linkContent = 'http://mb2c2d8d1devfront.oudianyun.com/seckill.html'
      }
      if (+code === 110002) {
        this.linkContent = 'http://mb2b2d8d1devfront.oudianyun.com/seckill.html'
      }
      if (+code === 110003) {
        this.linkContent = 'http://mo2o2d8d1devfront.oudianyun.com/seckill.html'
      }
    },
    // 复制链接
    copyLink() {
      let input = {}
      var text
      if (+this.listQuery.obj.promType === 5001) {
        text = document.getElementById('text').innerHTML
        input = document.getElementById('input')
      } else if (+this.listQuery.obj.promType === 14) {
        text = this.getSeckillUrl('h5', this.choosenChannelCode)
        input = document.getElementById('input1')
      }
      input.value = text
      input.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
    },
    getSeckillUrl(platform, channelCode) {
      var url = ''
      this.promotionLinks.forEach(obj => {
        if (obj.key === channelCode + '_' + platform) {
          url = obj.url
        }
      })
      return url
    },
    // 复制促销活动
    copyActivity(e) {
      this.$confirm(this.$t('是否确认复制该活动？'), this.$t('系统提示'), {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          const data = { promotionId: e.activityId }
          let request
          if (e.promType < 100) {
            request = this.promotionAPI.copyPromotionActivityUrl(data)
          } else if (e.promType === 3001) {
            request = this.promotionAPI.copyCutPriceActivityUrl(data)
          } else if (e.promType === 5001) {
            request = this.promotionAPI.copyLotteryActivityUrl(data)
          }
          request.then(response => {
            if (response.code === constantService.getSuccessStatus()) {
              this.$message({
                type: 'success',
                message: this.$t('复制成功!')
              })
              this.handleSearchSubmit()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消复制')
          })
        })
    },
    // 复制按钮显示
    copyBtnShow(e) {
      const flag = e.canCreateActivity === 1 && this.isHasWriteRoll(e)
      const result = !(
        (e.promType < 100 && e.promType !== 14 && e.promType !== 12 && flag) ||
        e.promType === 3001 ||
        e.promType === 5001
      )
      return result
    },
    // appendBtnShow(e) {
    //   let isShow = false
    //   if (
    //     (e.promType === 1 && e.activityType === 1)

    //   ) {
    //     if (e.status === 2 || e.status === 4) {
    //       isShow = true
    //     }
    //   }
    //   const flag = !(isShow && this.isHasWriteRoll(e))
    //   return flag
    // },
    // 关闭按钮显示
    stopBtnShow(e) {
      // 促销活动状态为2/4：未开始/进行中时按钮显示
      let isShow = false
      if (
        e.promType < 100 ||
        e.promType === 3001 ||
        e.promType === 4001 ||
        e.promType === 5001
      ) {
        if (e.status === 2 || e.status === 4) {
          isShow = true
        } else if (
          e.promType === 4001 &&
          (e.status === 7 || e.status === 8 || e.status === 9)
        ) {
          isShow = true
        }
      }
      const flag = !(isShow && this.isHasWriteRoll(e))
      return flag
    },
    // 关闭活动
    closeActivity(e) {
      this.$confirm(this.$t('是否确认关闭活动') + '？', '系统提示', {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          let request, data
          if (e.promType < 100) {
            data = { promotionId: e.activityId }
            request = this.promotionAPI.stopPromotionActivityMethod(data)
          } else if (e.promType === 4001) {
            data = {
              id: e.activityId,
              status: e.status
            }
            request = this.promotionAPI.closeFreeOrderActivityUrl(data)
          } else if (e.promType === 5001) {
            data = {
              lotteryThemeId: e.activityId
            }
            request = this.promotionAPI.lotteryCloseActivityUrl(data)
          } else if (e.promType === 3001) {
            data = e.activityId
            request = this.promotionAPI.closeCutThemeUrl(data)
          }
          request.then(response => {
            if (response.code === constantService.getSuccessStatus()) {
              this.$message({
                type: 'success',
                message: this.$t('关闭成功!')
              })
              this.handleSearchSubmit()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消关闭')
          })
        })
    },
    // 查看营销报告
    viewMarketingReportBtnShow(e) {
      return (
        (e.status === 4 || e.status === 5 || e.status === 6) &&
        (e.promType === 1 ||
          e.promType === 2 ||
          e.promType === 3 ||
          e.promType === 4 ||
          e.promType === 9 ||
          e.promType === 10 ||
          e.promType === 11 ||
          e.promType === 13 ||
          e.promType === 14 ||
          e.promType === 15 ||
          // 大数据没有完成这个，先展示隐藏 试用
          // e.promType === 16 ||
          e.promType === 18)
      )
    },
    // 查看营销报告
    viewMarketingReport(row) {
      this.$router.push({
        name: 'ObiShowActivityEffectReport',
        query: { id: row.activityId }
      })
    },
    // 是否可写操作
    isHasWriteRoll(e) {
      return e.hasWriteRoll
    },
    // 删除活动
    deleteActivity(e) {
      this.$confirm(this.$t('是否确认删除活动') + '？', '系统提示', {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          let request, data
          if (e.promType < 100) {
            data = { promotionId: e.activityId }
            request = this.promotionAPI.deletePromotionActivityMethod(data)
          } else if (e.promType === 4001) {
            data = {
              id: e.activityId
            }
            request = this.promotionAPI.deleteFreeOrderActivityUrl(data)
          } else if (e.promType === 5001) {
            data = {
              lotteryThemeId: e.activityId
            }
            request = this.promotionAPI.lotteryDeleteActivityUrl(data)
          } else if (e.promType === 3001) {
            data = e.activityId
            request = this.promotionAPI.deleteCutThemeUrl(data + '')
          }
          request.then(response => {
            if (response.code === constantService.getSuccessStatus()) {
              this.$message({
                type: 'success',
                message: this.$t('删除成功!')
              })
              this.handleSearchSubmit()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消删除')
          })
        })
    },
    // 删除按钮显示
    deleteBtnShow(e) {
      // 促销活动为0：待提交时显示按钮
      return e.status !== 0
    },
    initSearchCondition(dictionary) {
      if (this.listQuery.obj.promType === this.persellPromotionType) {
        this.promotionAPI
          .loadOscConfigUrl('PRESELL_CONTENT_TYPE')
          .then(response => {
            this.title = this.$t('advance_sale_promotion')
            this.frontPromTypeArr = response.data.result
            const tempCode = 1
            const tempText = this.$t('deposit_in_advance')
            const promMoneyCode = 1022
            for (let i = 0; i < this.frontPromTypeArr.length; i++) {
              if (this.frontPromTypeArr[i].id === tempCode) {
                this.frontPromTypeArr[i].id = promMoneyCode
                this.frontPromTypeArr[i].text = tempText
              }
            }
          })
      } else {
        if (dictionary) {
          // console.log(dictionary)
          // console.log(this.listQuery.obj.promType)
          for (let i = 0; i < dictionary.length; i++) {
            if (dictionary[i]['id'] === this.listQuery.obj.promType) {
              this.title = dictionary[i]['text']
              this.frontPromTypeArr = dictionary[i]['children']
              // console.log(this.frontPromTypeArr)
              // 如果是单拼，需要删除第二个：多拼，反之删除第一个，目前这个是写死的
              if (this.promType === 2000 && this.patchGroupModel === 0) {
                this.frontPromTypeArr.splice(1, 1)
              } else if (this.promType === 2000 && this.patchGroupModel === 2) {
                this.frontPromTypeArr.splice(0, 1)
              }
              break
            }
          }
        }
      }
    },
    seeNewTab(e) {
      const params = {
        promotionId: e.activityId,
        promotionType: e.promType,
        status: e.status
      }
      this.$router.push({
        name: listDetail[e.promType],
        params: params
      })
    },
    async query() {
      this.listQuery.obj.createTime = this.listQuery.obj.createTime || []
      const {
        createTime: [createTimeStart, createTimeEnd],
        ...params
      } = JSON.parse(JSON.stringify(this.listQuery.obj))
      params.startTime = createTimeStart
      params.endTime = createTimeEnd

      if (params.status === '-1') {
        delete params.status
      }

      const param = {
        obj: this.formHasValue(params)
      }

      return this.$refs.table.getList(param)
    },
    async handleSearchSubmit() {
      await this.query()
    },
    async init() {
      await this.query()

      this.promotionAPI
        .getLoadPageConfigCommonOscUrl('PAGE_CONFIG_NOT_SAME')
        .then(response => {
          // 活动类型
          this.activityType = response.data.promotionCreateType
          this.merchantType = response.data.merchantType
          this.patchGroupModel = response.data.patchGroupModel
        })
      // this.promotionAPI
      //   .getLoadPageConfigCommonOscUrl('PROMOTION_CHANNEL_CODES')
      //   .then(response => {
      //     // 促销渠道列表
      //     const list = response.data.result
      //     this.channelList = []
      //     list.forEach(list, function(obj) {
      //       if (obj.promotionType === this.promType) {
      //         this.channelList = obj
      //         return
      //       }
      //     })
      //   })

      this.promotionAPI.loadPageConfigMethod({}).then(response => {
        // 平台id， 1：运营平台  2：商家平台
        this.platformId = response.data.platformId
        this.applyActivityTypeArr = response.data.applyActivityTypeList
        if (!utilService.isEmpty(response.data.allPromotionTypes)) {
          this.promotionDictionary = response.data.allPromotionTypes
        } else {
          this.promotionDictionary = constantService.getAllPromotionTypes()
        }
        this.initSearchCondition(this.promotionDictionary)
      })
    },
    editActivity(e) {
      const params = {
        promotionId: e.activityId,
        promotionType: e.promType
      }
      this.$router.push({
        name: listEdit[e.promType],
        params: params
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .spike-link {
    // padding-bottom: 20px;
    .link-btn {
      display: inline-block;
    }
  }
}
.activity-id-link {
  color: #409eff;
}
/deep/ .cp-search-item {
  overflow: unset !important
}
/deep/ .cp-list-search-area .box{
  overflow: unset;
  height: 150px;
}
/deep/ .cp-list-search-area .inner{
  overflow: unset;
}
</style>

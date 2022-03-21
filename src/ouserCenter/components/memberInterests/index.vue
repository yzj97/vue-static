<template>
  <div>
    <ody-title :title="$t('会员等级')" />
    <ody-box>
      <el-row>
        <el-col :span="12" style="padding-top:26px;">
          <el-row>
            <el-col :span="24" style="padding-bottom:10px;font-size:14px;text-align:center;">
              <el-tag>{{ crmDetail.growthAccountInfo.totalAmount }} / {{ !nextLevelDetail ? crmDetail.growthAccountInfo.totalAmount : nextLevelDetail.growthValue }}</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5" style="font-size:14px;text-align:center;">
              <i
                class="el-icon-trophy"
              >{{ crmDetail.memberLevelInfo != null ? crmDetail.memberLevelInfo.levelName : '-' }}</i>
            </el-col>
            <el-col :span="14">
              <el-progress
                :percentage="levelNum"
                :color="colors"
                type="line"
                text-inside="nmsls"
                show-text="true"
                stroke-width="18"
              />
            </el-col>
            <el-col :span="5" style="font-size:14px;text-align:center">
              <i
                class="el-icon-trophy"
              >{{ nextLevelDetail == null ? $t('已达最大') : nextLevelDetail.levelName }}</i>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="padding-top:20px;font-size:14px;text-align:center;">
              <i
                v-show="levelStatus === 1"
                class="el-icon-timer"
              >{{ $t('等级有效期至') }}：{{ crmDetail.memberLevelEndTimeStr }}</i>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-form
            ref="form"
            :model="form"
            label-width="150px"
            style="border-left:1px solid #ebebeb;"
          >
            <el-form-item
              :label="$t('会员类型')+':'"
            >{{ crmDetail.memberTypeInfo != null ? crmDetail.memberTypeInfo.name : '-' }}</el-form-item>
            <el-form-item :label="$t('当前会员等级')+':'">
              {{ crmDetail.memberLevelInfo != null ? crmDetail.memberLevelInfo.levelName : '-' }}
              <el-button
                name="openLevelSetting"
                type="primary"
                size="mini"
                style="margin-left:31px;"
                @click="openLevelSetting"
              >{{ $t('调整等级') }}</el-button>
            </el-form-item>
            <el-form-item :label="$t('当前成长值')+':'">
              {{ crmDetail.growthAccountInfo.totalAmount }}
              <add-modal
                :type="2"
                :title="$t('调整成长值')"
                :user-id="userId"
                :ok="queryPointDetail"
                style="margin-left:31px;"
              />
              <!-- <el-button type="primary" size="mini" style="margin-left:31px;">{{ $t('调整成长值') }}</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </ody-box>
    <ody-title :title="$t('会员等级流水')" />
    <ody-box>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :space="24" :label="$t('成长值变动时间')" prop="createTime">
              <ody-date-range-picker v-model="growthSearch.createTime" name="growthSearch_createTime" type="datetimer" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="growthHandleReset" size="small" @click="growthHandleReset">{{ $t('common_reset') }}</el-button>
          <el-button
            name="growthHandleSubmit"
            size="small"
            type="primary"
            @click="growthHandleSubmit"
          >{{ $t('common_select') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-table
        :loading="loading"
        :data="growthList"
        :columns="growthTable.columns"
        :can-filter="false"
        name="growthList596"
      />
      <ody-pagination
        :current-page.sync="growthPage.current"
        :list="growthList"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="growthPage.size"
        :total.sync="growthPage.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="growthHandleSubmit"
        @current-change="growthHandleSubmit"
      />
    </ody-box>
    <ody-title :title="$t('拥有权益卡')" />
    <ody-box>
      <ody-table
        :loading="loading"
        :data="cardList"
        :columns="cardTable.columns"
        :can-filter="false"
        name="cardList821"
      />
      <ody-pagination
        :current-page.sync="cardPage.current"
        :list="cardList"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="cardPage.size"
        :total.sync="cardPage.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="cardHandlePageSizeChange"
        @current-change="cardHandlePageCurrentChange"
      />
    </ody-box>
    <ody-title :title="$t('会员等级权益')" />
    <ody-box>
      <ody-table
        :loading="loading"
        :data="groupList"
        :columns="levelTable.columns"
        :can-filter="false"
        name="groupList061"
      />
    </ody-box>

    <MemberSetting
      :visible.sync="showMemberLevleSetting"
      :id-list.sync="userIds"
      :member-type-id.sync="memberTypeId"
      @ok="clearCheck"
    />
  </div>
</template>

<script>
import AddModal from '@/components/manulOperation/add'
import MemberSetting from '@/components/memberSetting'

export default {
  components: {
    AddModal,
    MemberSetting
  },
  props: {
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      crmDetail: {
        growthAccountInfo: {
          totalAmount: 0
        },
        memberTypeInfo: {},
        pointAccountInfo: {},
        memberLevelInfo: {}
      },
      colors: [
        { color: '#409EFF', percentage: 20 },
        { color: '#409EFF', percentage: 40 },
        { color: '#409EFF', percentage: 60 },
        { color: '#409EFF', percentage: 80 },
        { color: '#409EFF', percentage: 100 }
      ],
      channels: [],
      nextLevelDetail: null,
      levelNum: 0, // 等级百分比
      cardList: [],
      cardPage: {
        size: 10,
        current: 1,
        total: 0
      },
      levelStatus: 0,
      groupList: [],
      growthList: [],
      addGrowthManualOperation: {
        showDialog: false,
        form: {
          opeObj: this.$route.query.userId,
          changeAmount: 1,
          channelCode: null,
          opeReason: null,
          opeObjs: [{ userId: this.$route.query.userId, username: null }],
          growthType: '1',
          remark: null
        }
      },
      editFunction: false,
      showMemberLevleSetting: false,
      memberTypeId: null,
      userIds: [],
      growthProcessType: [],
      // ===========================
      growthSearch: {
        createTime: []
      },
      growthPage: {
        size: 10,
        current: 1,
        total: 0
      },
      growthTable: {
        columns: [
          {
            label: this.$t('成长值变动类型'),
            prop: 'name',
            show: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              if (row.changeDetail) {
                var param = JSON.parse(row.changeDetail)
                if (param.opeReason) {
                  return param.opeReason
                } else {
                  if (row.processType === 10 || row.processType === 8) {
                    return this.$t('发放')
                  } else if (row.processType === 11 || row.processType === 9) {
                    return this.$t('扣减')
                  } else if (row.processType === 100) {
                    return this.$t('会员改变等级增加成长值')
                  } else if (row.processType === 101) {
                    return this.$t('会员改变等级减少成长值')
                  } else if (row.processTypeStr) {
                    return row.processTypeStr
                  }
                  return '-'
                }
              } else {
                if (row.processType === 10 || row.processType === 8) {
                  return this.$t('发放')
                } else if (row.processType === 11 || row.processType === 9) {
                  return this.$t('扣减')
                } else if (row.processType === 100) {
                  return this.$t('会员改变等级增加成长值')
                } else if (row.processType === 101) {
                  return this.$t('会员改变等级减少成长值')
                } else if (row.processTypeStr) {
                  return row.processTypeStr
                }
                return '-'
              }
            }
          },
          {
            label: this.$t('渠道'),
            prop: 'name',
            show: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              if (!row.changeDetail) {
                return '-'
              }
              var param = JSON.parse(row.changeDetail)
              if (param.channelCode) {
                if (param.channelCode !== '000000') {
                  return this.channels[param.channelCode].channelName
                } else if (param.channelCode === '000000') {
                  return this.$t('全渠道')
                }
              }
            }
          },
          {
            label: this.$t('变动成长值'),
            prop: 'changeAmount',
            minWidth: 120,
            show: true,
            formatter: (row, column, cellValue) => {
              if (
                row.processType === 10 ||
                row.processType === 8 ||
                row.processType === 100
              ) {
                return '+' + row.changeAmount
              } else if (
                row.processType === 11 ||
                row.processType === 9 ||
                row.processType === 101
              ) {
                return '-' + row.changeAmount
              } else if (row.changeType && row.changeType === 1) {
                return '+' + row.changeAmount
              } else if (row.changeType && row.changeType === 2) {
                return '-' + row.changeAmount
              } else {
                return row.changeAmount
              }
            }
          },
          {
            label: this.$t('变动后等级'),
            prop: 'name',
            show: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              if (!row.changeDetail) {
                return '-'
              }
              var param = JSON.parse(row.changeDetail)
              if (param.memberLevelName) {
                return param.memberLevelName
              } else {
                return '-'
              }
            }
          },
          {
            label: this.$t('成长值变动时间'),
            prop: 'createTime',
            minWidth: 120,
            show: true,
            formatter: (row, column, cellValue) => {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        ]
      },
      cardTable: {
        columns: [
          {
            label: this.$t('卡编号'),
            prop: 'id',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('卡名称'),
            prop: 'cardName',
            show: true,
            minWidth: 160,
            render: (h, pa) => {
              return h(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'CrmInterestsCardDetail',
                        params: {
                          id: pa.row.cardId,
                          isEdit: 0
                        }
                      })
                    }
                  }
                },
                pa.row.cardName
              )
            }
          },
          {
            label: this.$t('卡号'),
            prop: 'no',
            minWidth: 150,
            show: true
          },
          {
            label: this.$t('到期时间'),
            prop: 'expirationTime',
            show: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              if (!row.expirationTime) {
                return this.$t('永久有效')
              } else {
                var endDate = row.expirationTime // 得到毫秒数
                var bindTime = row.bindTime
                var times = endDate + bindTime
                return this.$portal.parseTime(times, '{y}-{m}-{d} {h}:{i}:{s}')
              }
            }
          },
          {
            label: this.$t('卡片状态'),
            prop: 'id',
            show: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              if (!row.expirationTime) {
                return this.$t('使用中')
              } else {
                var endDate = row.expirationTime // 得到毫秒数
                var bindTime = row.bindTime
                var times = endDate + bindTime
                var now = new Date().getTime()
                if (now > times) {
                  return this.$t('已过期')
                } else {
                  return this.$t('使用中')
                }
              }
            }
          }
        ]
      },
      levelTable: {
        columns: [
          {
            label: this.$t('权益组编号'),
            prop: 'id',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('权益组名称'),
            prop: 'name',
            show: true,
            minWidth: 120,
            render: (h, pa) => {
              return h(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'CrmRightsInterestsDetial',
                        params: {
                          id: pa.row.id,
                          isEdit: 0
                        }
                      })
                    }
                  }
                },
                pa.row.name
              )
            }
          }
        ]
      }
    }
  },
  methods: {
    mounted() {
      // this.init()
    },
    openLevelSetting() {
      this.showMemberLevleSetting = true
    },
    async init() {
      this.getGrowthRuleInfo()
      // this.queryCode()
      this.queryChannelMap()
      this.queryPointDetail()
      this.queryGrowthFlow()
    },
    queryChannelMap() {
      // 获取渠道
      this.$ouserCenter.$api.points.queryChannelMap({}).then(resp => {
        this.channels = resp.data
      })
    },
    queryGrowthFlow() {
      const crmService = this.$ouserCenter.$api.crmService
      var param = {
        entityId: this.userId,
        page: this.growthPage.current,
        limit: this.growthPage.size
      }
      if (
        this.growthSearch.createTime &&
        this.growthSearch.createTime.length > 0
      ) {
        param.createTimeStart = this.growthSearch.createTime[0]
        param.createTimeEnd = this.growthSearch.createTime[1]
      } else {
        param.createTimeStart = null
        param.createTimeEnd = null
      }
      crmService.listGrowthLogPage(param).then(res => {
        this.growthList = res.data
        this.growthPage.total = res.total
      })
    },
    async levelNumCount() {
      // 数一数百分之多少了等级
      if (!this.nextLevelDetail) {
        // 最大等级
        this.levelNum = 100
      } else if (this.crmDetail.growthAccountInfo) {
        var totalAmount = this.crmDetail.growthAccountInfo.totalAmount // 当前成长值
        var nextLevelAmount = this.nextLevelDetail.growthValue // 下一级要求成长值
        this.levelNum = ((totalAmount / nextLevelAmount) * 100).toFixed(2)
      }
    },
    queryPointDetail() {
      const crmService = this.$ouserCenter.$api.crmService
      crmService.getDetail({ userId: this.userId }).then(res => {
        this.crmDetail = res.data
        if (this.crmDetail.memberLevelEndTime) {
          this.crmDetail.memberLevelEndTimeStr = this.$portal.parseTime(
            this.crmDetail.memberLevelEndTime,
            '{y}-{m}-{d}'
          )
        } else {
          this.crmDetail.memberLevelEndTimeStr = '-'
        }
        if (!this.crmDetail.growthAccountInfo) {
          this.crmDetail.growthAccountInfo = {
            totalAmount: 0
          }
        }
        if (!this.crmDetail.memberLevelInfo) {
          // 为空不调用
          return
        }
        this.userIds = [this.userId]
        this.memberTypeId = this.crmDetail.memberTypeInfo.id
        // 查下一等级
        this.queryNextLevelDetail()
        // 查卡片
        this.getUserInterestsCard()
        // 查权益组
        this.getListInterestsGroup()
      })
    },
    async queryNextLevelDetail() {
      const crmService = this.$ouserCenter.$api.crmService
      crmService.getNextLevelDetail({ userId: this.userId }).then(res => {
        this.nextLevelDetail = res.data
        // 计算进度条
        this.levelNumCount()
      })
    },
    getUserInterestsCard() {
      // 查权益卡
      const crmService = this.$ouserCenter.$api.crmService
      var param = {
        page: this.cardPage.current,
        limit: this.cardPage.size,
        filters: {
          mobile: this.crmDetail.mobile
        }
      }
      crmService.getUserInterestsCard(param).then(res => {
        this.cardList = res.data
        this.cardPage.total = res.total
      })
    },
    getListInterestsGroup() {
      // 查权益组
      const crmService = this.$ouserCenter.$api.crmService
      crmService
        .getUcMembershipLevelInterestsList([
          { id: this.crmDetail.memberLevelInfo.id }
        ])
        .then(res => {
          this.groupList = res.data[0].interestsGroupList
        })
    },
    cardHandlePageSizeChange() {
      this.getUserInterestsCard()
    },
    cardHandlePageCurrentChange() {
      this.getUserInterestsCard()
    },
    growthHandleReset() {
      this.growthSearch = {}
    },
    growthHandleSubmit() {
      this.queryGrowthFlow()
    },
    getGrowthRuleInfo() {
      const vue = this
      const param = {
        type: 2,
        subType: 0,
        entityType: 2
      }
      const crmService = vue.$ouserCenter.$api.crmService
      crmService.listRulePage(param).then(result => {
        if (result.code === '0' && result.data.length > 0) {
          var obj = result.data[0]
          vue.levelStatus = obj.status
        }
      })
    }
    // queryCode() {
    //   var categorys = {
    //     pool: 'crm',
    //     categories: [
    //       'GROWTH_PROCESS_TYPE'
    //     ]
    //   }
    //   this.$ouserCenter.$api.userService.listMulti(categorys).then(resp => {
    //     this.growthProcessType = resp.data.GROWTH_PROCESS_TYPE
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

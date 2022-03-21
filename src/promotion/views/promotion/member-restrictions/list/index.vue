<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form
          ref="queryContent"
          :rules="rules"
          :model="queryContent"
          label-width="100px"
          class="form"
        >
          <ody-search-item :label="$t('用户名:')" prop="obj.username">
            <el-input
              :placeholder="$t('请输入用户名')"
              v-model="queryContent.obj.username"
              name="queryContent_obj_username"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建人:')" prop="obj.createUsername">
            <el-input
              :placeholder="$t('请输入创建人')"
              v-model="queryContent.obj.createUsername"
              name="queryContent_obj_createUsername"
            />
          </ody-search-item>
          <ody-search-item :label="$t('用户ID:')" prop="obj.userId">
            <el-input
              :placeholder="$t('请输入用户ID')"
              v-model="queryContent.obj.userId"
              name="queryContent_obj_userId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('限购会员类型:')" prop="obj.memberType">
            <promotion-member-type-select
              v-model="queryContent.obj.memberType"
              :placeholder="$t('全部')"
              name="queryContent_obj_memberType"
            />
          </ody-search-item>
          <ody-search-item :label="$t('限购条件:')" prop="obj.conditionType">
            <ody-select2
              v-model="queryContent.obj.conditionType"
              :placeholder="$t('全部')"
              name="queryContent_obj_conditionType"
              list-key="conditionTypeMap"
            />
          </ody-search-item>
          <ody-search-item :label="$t('状态:')" prop="obj.status">
            <ody-select2
              v-model="queryContent.obj.status"
              :placeholder="$t('全部')"
              name="queryContent_obj_status"
              list-key="statusRestrictionsMap"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动渠道')" prop="obj.channel">
            <promotion-restrictions-channel-type-select
              v-model="queryContent.obj.channel"
              :placeholder="$t('全部')"
              name="queryContent_obj_channel"
              @emitChannelCode="getChannelCodeList"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建时间:')" :space="2" prop="timeContent.createTime">
            <ody-date-range-picker
              v-model="queryContent.timeContent.createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="queryContent_timeContent_createTime"
              type="datetimer"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
            />-
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="button001"
          size="small"
          type="primary"
          code="button001"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="createLimitRuleActivity"
          size="small"
          type="primary"
          code="button002"
          @click="createLimitRuleActivity"
        >{{ $t('添加限购') }}</ody-button>
        <ody-button
          name="exportDown"
          size="small"
          code="button003"
          @click="exportDown"
        >{{ $t('导出') }}</ody-button>
      </div>
      <div slot="tabs">
        <!-- {{ queryContent.obj.status }} -->
        <el-tabs
          v-model="queryContent.obj.status"
          name="queryContent_obj_status2"
          @tab-click="query"
        >
          <el-tab-pane :label="$t('全部')" name="-1" />
          <el-tab-pane :label="$t('启用')" name="1" />
          <el-tab-pane :label="$t('停用')" name="0" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :response="handleReseponse"
          name="memberRestrictionsList670"
          request-url="/frontier-trade-web/purchaseRule/back/newList.do"
        >
          <template
            slot="getTotalLimit4Product"
            slot-scope="scope"
          >{{ getTotalLimit4Product(scope.row) }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
          <template
            slot="status"
            slot-scope="scope"
          >{{ scope.row.status | keyVal(getRegistrationType) }}</template>
          <template
            slot="channelCodes"
            slot-scope="scope"
          >{{ scope.row.channelCodes | getChannelName(channelMap) }}</template>
          <template slot="id" slot-scope="scope">
            <a
              v-if="$portal.hasPermission('button005')"
              name="seeNewTab"
              class="activity-id-link"
              @click="seeNewTab(scope.row)"
            >{{ scope.row.id }}</a>
            <a
              v-if="!$portal.hasPermission('button005')"
              name="seeNewTab"
              class="activity-id-link"
            >{{ scope.row.id }}</a>
          </template>
        </ody-table>
        <!-- <ody-pagination
          :current-page.sync="queryContent.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="queryContent.itemsPerPage"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import util from '@/utils/util'
import constants from '@/utils/constants'
import PromotionTypeSelect from '@/components/promotion-type-select'
import PromotionMemberTypeSelect from '@/components/promotion-member-type-select'
import PromotionRestrictionsChannelTypeSelect from '@/components/promotion-restrictions-channel-type-select'
export default {
  name: 'PromMemberRestrictions',
  components: {
    PromotionTypeSelect,
    PromotionMemberTypeSelect,
    PromotionRestrictionsChannelTypeSelect
  },
  filters: {
    getChannelName(channelCodes, channelMap) {
      if (channelCodes) {
        return channelCodes
          .map(item => {
            return channelMap[item].channelName
          })
          .join('、')
      }

      return ''
    }
  },
  data() {
    return {
      total: '',
      label: this.$t('启用'),
      channelMap: {},
      channelName: '',
      memberType: '',
      channelCodeArr: [],
      queryContent: {
        obj: {
          username: undefined,
          createUsername: undefined,
          createFromTime: '',
          createToTime: '',
          userId: undefined,
          memberType: undefined,
          conditionType: undefined,
          status: '-1',
          channel: undefined,
          startTime: undefined,
          endTime: undefined
        },
        timeContent: {
          createTime: []
        }
      },
      memberRestrictionsList: [],
      memberTypeList: [],
      channelCodeList: [],
      table: {
        columns: [
          {
            label: this.$t('编号'),
            slot: 'id',
            align: 'center',
            show: true,
            minWidth: 200
          },

          {
            show: true,
            slot: 'channelCodes',
            label: this.$t('活动渠道'),
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('限购对象'),
            prop: 'memberTypeList',
            align: 'center',
            show: true,
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              return `<span>${this.getMemberTypeListMap(
                row.memberTypeList
              )}</span>`
            }
          },
          {
            label: this.$t('限购周期'),
            prop: 'timeScopeValue',
            align: 'center',
            show: true
          },
          {
            label: this.$t('限购总额'),
            prop: 'totalAmountLimit',
            align: 'center',
            show: true
          },
          {
            label: this.$t('限购商品'),
            slot: 'getTotalLimit4Product',
            align: 'center',
            show: true
          },
          {
            label: this.$t('限购订单'),
            prop: 'orderCountLimit',
            align: 'center',
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            align: 'center',
            show: true
          },
          {
            label: this.$t('创建时间'),
            prop: 'createTime',
            align: 'center',
            show: true,
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              if (row.createTime) {
                return `<span>${this.$portal.parseTime(row.createTime)}</span>`
              }
            }
          },
          {
            label: this.$t('创建人'),
            prop: 'createUsername',
            align: 'center',
            show: true
          },
          {
            label: this.$t('备注'),
            prop: 'description',
            show: true,
            align: 'center'
          }
        ],
        operates: {
          width: 200,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.$router.push({
                  name: 'PromMemberRestrictionsEdit',
                  params: {
                    promotionId: row.id
                  }
                })
              },
              code: 'button006'
            },
            {
              label: this.$t('启用'),
              method: (index, row) => {
                this.enable(row.id)
              },
              hidden(index, row) {
                if (row.status === 1) {
                  return true
                } else {
                  return false
                }
              },
              code: 'button007'
            },
            {
              label: this.$t('禁用'),
              method: (index, row) => {
                this.enable(row.id)
              },
              hidden(index, row) {
                if (row.status === 0) {
                  return true
                } else {
                  return false
                }
              },
              code: 'button008'
            },
            {
              label: this.$t('查看'),
              method: (index, row) => {
                this.seeNewTab(row)
              },
              code: 'button005'
            }
          ]
        }
      }
    }
  },
  computed: {
    getRegistrationType() {
      return {
        0: this.$t('停用'),
        1: this.$t('启用')
      }
    },
    channelCodesMap() {
      return constants.channelCodesList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  async mounted() {
    this.promotionAPI = this.$promotion.$api.promotion
    this.getChannelMap()
    await this.getQueryMemberTypeList()
    await this.query()
  },
  methods: {
    handleReseponse(res) {
      const { data: listObj, total, ...other } = res

      return {
        ...other,
        data: {
          listObj,
          total
        }
      }
    },
    getTotalLimit4Product(row) {
      if (row.countLimit4Partials && row.countLimit4Partials.length) {
        return '部分'
      }

      if (row.countLimit4Skus) {
        return '全部'
      }
    },
    seeNewTab(e) {
      this.$router.push({
        name: 'PromMemberRestrictionsDetail',
        params: {
          promotionId: e.id
        }
      })
    },
    getChannelCodeList(item) {
      this.channelCodeList = item
    },
    async getQueryMemberTypeList() {
      const {
        data = {}
      } = await this.$promotion.$api.promotion.queryMemberTypeList({})
      if (!util.isEmpty(data)) {
        this.memberTypeList = data
      }
    },
    // 限购对象
    getMemberTypeListMap(memberTypes) {
      var memberTypeName = ''
      for (let j = 0; j < this.memberTypeList.length; j++) {
        for (let r = 0; r < memberTypes.length; r++) {
          if (memberTypes[r] === this.memberTypeList[j].memberType) {
            memberTypeName += this.memberTypeList[j].memberTypeName + '、'
          }
        }
      }
      memberTypeName = memberTypeName.substring(0, memberTypeName.lastIndexOf('、'))
      return memberTypeName
    },
    createLimitRuleActivity() {
      this.$router.push({
        name: 'PromMemberRestrictionsCreate',
        params: {

        }
      })
    },
    handleReset() {
      this.formReset('queryContent')
      this.queryContent.obj = {
        username: undefined,
        createUsername: undefined,
        createFromTime: '',
        createToTime: '',
        userId: undefined,
        memberType: undefined,
        conditionType: undefined,
        status: '-1',
        channel: undefined,
        startTime: undefined,
        endTime: undefined
      }
      this.queryContent.timeContent = {
        createTime: []
      }
    },
    async getChannelMap() {
      const { data } = await this.$api.channel.queryChannelMap({})

      this.channelMap = data
    },
    async handleSubmit() {
      const [validError] = await this.formValidate('queryContent')

      if (validError) {
        return
      }
      await this.query()
    },
    async query() {
      const params = this.$portal.deepClone(this.queryContent)
      console.log(params)
      if (params.obj.username) {
        if (!/^1\d{10}/.test(params.obj.username)) {
          this.$message.error('用户名为手机号码')
          return false
        }
      }
      // console.log(params.timeContent.createTime[0])
      if (params.timeContent.createTime != null) {
        params.obj.createFromTime = params.timeContent.createTime[0]
        params.obj.createToTime = params.timeContent.createTime[1]
      }

      if (params.obj.conditionType == null) {
        params.obj.conditionType = -1
      }
      if (params.obj.memberType == null) {
        params.obj.memberType = -1
      }

      await this.$refs.table.getList({
        obj: this.formHasValue(params.obj)
      })
    },
    exportDown() {
      // debugger
      const params = {
        status: this.queryContent.obj.status
      }
      if (this.queryContent.obj.username) {
        params.username = this.queryContent.obj.username
      }
      if (this.queryContent.obj.createUsername) {
        params.createUsername = this.queryContent.obj.createUsername
      }
      const [
        createFromTime,
        createToTime
      ] = this.queryContent.timeContent.createTime
      if (createFromTime) {
        params.createFromTime = new Date(createFromTime) * 1
      }
      if (createToTime) {
        params.createToTime = new Date(createToTime) * 1
      }
      if (this.queryContent.obj.userId) {
        params.userId = this.queryContent.obj.userId
      }
      if (this.queryContent.obj.memberType) {
        params.memberType = this.queryContent.obj.memberType
      }
      if (this.queryContent.obj.conditionType) {
        params.conditionType = this.queryContent.obj.conditionType
      }
      if (this.queryContent.obj.channel) {
        params.channel = this.queryContent.obj.channel
      }
      this.$portal.downloadFileByGet(
        '/api/frontier-trade-web/purchaseRule/back/export.do',
        params
      )
    },
    enable(id) {
      this.promotionAPI.enableRestrictions(id).then(res => {
        if (res && res.code === '0') {
          this.$message({
            showClose: true,
            message: this.$t('修改规则状态成功'),
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: this.$t('修改规则状态失败'),
            type: 'error'
          })
        }
        this.query()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-id-link {
  color: #409eff;
}
</style>

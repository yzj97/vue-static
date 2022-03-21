<template>
  <div class="app-container">
    <ody-list-search-area>
      <div slot="content">
        <el-form :model="listQuery">
          <ody-search-item :label="$t('活动名称:')" prop="obj.name">
            <el-input
              v-model="listQuery.obj.name"
              :placeholder="$t('请输入活动名称')"
              name="listQuery_obj_name"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动ID:')" prop="obj.id">
            <el-input
              v-model="listQuery.obj.id"
              :placeholder="$t('请输入活动ID')"
              :maxlength="20"
              name="listQuery_obj_id"
              clearable
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建人:')" prop="obj.createMerchantName">
            <el-input
              v-model="listQuery.obj.createMerchantName"
              :placeholder="$t('请输入创建人')"
              name="listQuery_obj_createMerchantName"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动时间:')" :space="2" prop="obj.createTime">
            <ody-date-range-picker
              v-model="listQuery.obj.createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="listQuery_obj_createTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动渠道:')" prop="obj.channelCode">
            <promotion-channel-code-select
              v-model="listQuery.obj.channelCode"
              :prom-type="listQuery.obj.promType"
              :placeholder="$t('全部')"
              name="listQuery_obj_channelCode"
            />
          </ody-search-item>
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
        <ody-button
          name="createPromotion"
          type="primary"
          size="mini"
          code="button002"
          @click="createPromotion"
        >{{ $t('创建活动') }}</ody-button>
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
          :can-filter="false"
          request-url="/back-promotion-web/referralCodeRead/queryReferralCodeActivityList.action"
        >
          <template slot="status" slot-scope="scope">
            <div>
              <el-tooltip v-if="scope.row.status == 3" class="item" effect="dark" placement="right">
                <div slot="content">{{ scope.row.remark }}</div>
                <div>
                  <span style="color:red">{{ scope.row.status | keyVal(getActivityStatus) }}</span>
                  <i class="el-icon-question" />
                </div>
              </el-tooltip>

              <div v-if="scope.row.status != 3">{{ scope.row.status | keyVal(getActivityStatus) }}</div>
            </div>
          </template>

          <template slot="createTime" slot-scope="scope">
            <span
              v-if="scope.row.startTime && scope.row.endTime"
            >{{ scope.row.startTime | parseTime }}-{{ scope.row.endTime | parseTime }}</span>
          </template>
          <template slot="startTime" slot-scope="scope">
            <span v-if="scope.row.createTime">{{ scope.row.createTime | parseTime }}</span>
          </template>
          <template slot="id" slot-scope="scope">
            <a
              v-if="$portal.hasPermission('button003')"
              name="seeNewTab"
              class="activity-id-link"
              @click="seeNewTab(scope.row)"
            >{{ scope.row.id }}</a>
            <a
              v-if="!$portal.hasPermission('button003')"
              name="seeNewTab"
              class="activity-id-link"
            >{{ scope.row.id }}</a>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>
import * as utilService from '@/services/utilService'
import * as constantService from '@/services/constantService'

import constants from '@/utils/constants'
import PromotionChannelCodeSelect from '@/components/promotion-channel-code-select'
import PromotionTypeRadio from '@/components/promotion-type-radio'

export default {
  name: 'PromPromotionRecommendationLists',
  components: {
    PromotionChannelCodeSelect,
    PromotionTypeRadio
  },
  data() {
    return {
      merchantType: undefined,
      title: this.$t('promotion'),
      platformId: null,
      promotionDictionary: null,
      applyActivityTypeArr: undefined,
      patchGroupModel: 0,
      channelMap: null,
      promType: 8000,
      frontPromTypeArr: {},
      listQuery: {
        // 搜索对象
        obj: {
          promType: 8000,
          name: undefined, // 活动名称
          id: undefined, // 活动id
          createMerchantName: undefined, // 创建人
          startTime: undefined,
          endTime: undefined,
          channelCode: undefined,
          createTime: [],
          status: '-1' // 状态
        }
      },
      columns: [
        {
          show: true,
          slot: 'id',
          label: this.$t('活动ID'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'name',
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
          slot: 'createTime',
          label: this.$t('活动时间'),
          align: 'center',
          minWidth: 280
        },
        {
          show: true,
          label: this.$t('活动状态'),
          slot: 'status',
          align: 'center'
        },
        {
          show: true,
          prop: 'createMerchantName',
          label: this.$t('创建人'),
          align: 'center'
        },
        {
          show: true,
          slot: 'startTime',
          label: this.$t('创建时间'),
          align: 'center',
          minWidth: 200
        }
      ],
      operates: {
        width: 220,
        fixed: 'right',
        list: [
          {
            label: this.$t('see'),
            hidden: (index, row) => {
              // return this.
            },
            method: (index, row) => {
              this.seeNewTab(row)
            },
            code: 'button003'
          },
          {
            label: this.$t('复制'),
            hidden: (index, row) => {
              //   return this.copyBtnShow(row)
            },
            method: (index, row) => {
              this.copyActivity(row)
            },
            code: 'button004'
          },
          {
            label: this.$t('edit'),
            hidden: (index, row) => {
              return !this.editBtnShow(row)
            },
            method: (index, row) => {
              this.editActivity(row)
            },
            code: 'button005'
          },
          {
            label: this.$t('delete'),
            hidden: (index, row) => {
              return !this.deleteBtnShow(row)
            },
            method: (index, row) => {
              this.deleteActivity(row)
            },
            code: 'button006'
          },
          {
            label: this.$t('close'),
            hidden: (index, row) => {
              return !this.closeBtnShow(row)
            },
            method: (index, row) => {
              this.closeActivity(row)
            },
            code: 'button007'
          }
        ]
      }
    }
  },
  computed: {
    getActivityStatus() {
      return constants.activityStatus.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  created() {
    // 取路由promType
  },
  beforeUpdate(to, from, next) {
    console.log('wogengxinle ')
  },
  async mounted() {
    this.promotionAPI = this.$promotion.$api.promotion
    this.getChannelMap()
    await this.init()
  },
  methods: {
    createPromotion() {
      this.$router.push({
        name: 'PromRecommendCodeCreate',
        params: {
          promotionType: this.listQuery.obj.promType
        }
      })
    },
    editBtnShow(e) {
      // 免单活动状态为待提交或审核拒绝时显示编辑按钮
      var flag = false
      if (e.status === 4 || e.status === 2) {
        return true
      }
      return e.status === 0 || e.status === 3 || flag
    },
    updateBtnShow(e) {
      // 促销活动状态为0：待提交或3：审核未通过时按钮显示
      return e.status === 0 || e.status === 3 || e.status === 4
    },
    resetQuery() {
      this.listQuery.obj = {
        promType: 8000,
        status: '-1',
        patchGroupName: undefined,
        id: undefined,
        createUsername: undefined,
        fromDate: null,
        endDate: null,
        channelCode: undefined,
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
     * 加载渠道名称
     */
    getChannelMap() {
      this.promotionAPI.queryChannelMap().then(response => {
        if (response.code === '0') {
          this.channelMap = response.data
        }
      })
    },
    // 复制促销活动
    copyActivity(e) {
      this.$confirm(this.$t('是否确认复制该活动？'), this.$t('系统提示'), {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          const data = { id: e.id }
          let request
          if (this.promType === 8000) {
            request = this.promotionAPI.getCopyRecommendUrl(data)
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
    // 关闭按钮显示
    closeBtnShow(e) {
      // 免单活动状态为4：进行中、未开始时按钮显示
      return e.status === 4 || e.status === 2
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
          if (this.promType === 8000) {
            data = {
              id: e.id
            }
            request = this.promotionAPI.getCloseRecommendItemUrl(
              JSON.stringify(data) + ''
            )
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
    // 是否可写操作
    isHasWriteRoll(e) {
      return e.stockType
    },
    // 删除活动
    deleteActivity(e) {
      this.$confirm(this.$t('是否确认删除活动') + '？', '系统提示', {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          let request
          if (this.promType === 8000) {
            const data = {
              id: e.id
            }
            request = this.promotionAPI.getDelRecommendUrl(
              JSON.stringify(data) + ''
            )
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
      return e.status === 0
    },
    seeNewTab(e) {
      const params = {
        promotionId: e.id,
        status: e.status
      }
      if (this.listQuery.obj.promType === 8000) {
        this.$router.push({ name: 'PromRecommendCodeDetail', params: params })
      }
    },
    async query() {
      const {
        createTime,
        ...params
      } = JSON.parse(JSON.stringify(this.listQuery.obj))
      const [startTime = null, endTime = null] = createTime || []
      params.startTime = startTime ? startTime + ' 00:00:00' : null
      params.endTime = endTime ? endTime + ' 23:59:59' : null
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
          this.merchantType = response.data.merchantType
          this.patchGroupModel = response.data.patchGroupModel
        })
    },
    // 编辑
    editActivity(e) {
      const params = {
        promotionId: e.id,
        status: e.status,
        from: 'edit',
        promotionType: this.promType
      }

      if (e.status === 0 || e.status === 3) {
        this.$router.push({
          name: 'PromRecommendCodeEdit',
          params: params
        })
      } else {
        this.$router.push({
          name: 'PromRecommendCodeEditShare',
          params: params
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-id-link {
  color: #409eff;
}
</style>

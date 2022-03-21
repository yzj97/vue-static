<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form :model="listQuery">
          <ody-search-item :label="$t('拼团活动名称:')" prop="obj.patchGroupName">
            <el-input
              v-model="listQuery.obj.patchGroupName"
              :placeholder="$t('请输入拼团活动名称')"
              name="listQuery_obj_patchGroupName"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('拼团活动ID:')" prop="obj.id">
            <ody-input-number
              v-model="listQuery.obj.id"
              :max="9999999999999999"
              :empty-tip="false"
              :placeholder="$t('请输入活动ID')"
              name="listQuery_obj_id"
              maxlength="16"
              style="width:100%"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建人:')" prop="obj.createUserName">
            <el-input
              v-model="listQuery.obj.createUserName"
              :placeholder="$t('请输入创建人')"
              name="listQuery_obj_createUserName"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('拼团活动时间:')" :space="2" prop="obj.createTime">
            <ody-date-range-picker
              v-model="listQuery.obj.createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="listQuery_obj_createTime"
              type="date"
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
        >{{ $t('新建拼团活动') }}</ody-button>
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
          request-url="/back-promotion-web/patchGrouponRead/queryGrouponList.do"
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

              <div
                v-if="scope.row.status != 3"
              >{{ getPatchgrouponStatusText(scope.row.status, scope.row.effStartDate, scope.row.effEndDate) }}</div>
            </div>
          </template>

          <template slot="createTime" slot-scope="scope">
            <span
              v-if="scope.row.effStartDate && scope.row.effEndDate"
            >{{ scope.row.effStartDate | parseTime }}-{{ scope.row.effEndDate | parseTime }}</span>
          </template>
          <template slot="startTime" slot-scope="scope">
            <span v-if="scope.row.createTime">{{ scope.row.createTime | parseTime }}</span>
          </template>
          <template slot="id" slot-scope="scope">
            <a
              v-if="!$portal.hasPermission('button003')"
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
  name: 'PromGrouponList',
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
      promType: 2000,
      frontPromTypeArr: {},
      status: [
        {
          id: -1,
          text: this.$t('全部')
        },
        {
          id: 0,
          text: this.$t('待提交')
        },
        {
          id: 1,
          text: this.$t('待审核')
        },
        {
          id: 2,
          text: this.$t('未开始')
        },
        {
          id: 3,
          text: this.$t('审核未通过')
        },
        {
          id: 4,
          text: this.$t('进行中')
        },
        {
          id: 5,
          text: this.$t('已过期')
        },
        {
          id: 6,
          text: this.$t('已关闭')
        }
      ],
      listQuery: {
        obj: {
          promType: 2000,
          status: '-1',
          patchGroupName: undefined, // 拼团活动名称
          id: undefined, // 拼团活动id
          createUsername: undefined,
          fromDate: undefined,
          endDate: undefined,
          channelCode: undefined,
          createTime: []
        }
      },
      columns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('拼团活动ID'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'activityTitle',
          label: this.$t('拼团活动名称'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'groupMembers',
          label: this.$t('拼团人数'),
          align: 'center'
        },
        {
          show: true,
          slot: 'createTime',
          label: this.$t('活动时间'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('创建人'),
          align: 'center'
        },
        {
          show: true,
          label: this.$t('活动状态'),
          slot: 'status',
          align: 'center'
        },
        {
          show: true,
          prop: 'channelCodes',
          label: this.$t('活动渠道'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return `<span>${this.getChannelName(row.channelCodes)}</span>`
          }
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
              return !(this.updateBtnShow(row) && this.isHasWriteRoll(row))
            },
            method: (index, row) => {
              this.editActivity(row)
            },
            code: 'button005'
          },
          {
            label: this.$t('delete'),
            hidden: (index, row) => {
              return this.deleteBtnShow(row)
            },
            method: (index, row) => {
              this.deleteActivity(row)
            },
            code: 'button006'
          },
          {
            label: this.$t('close'),
            hidden: (index, row) => {
              return this.stopBtnShow(row)
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
  async mounted() {
    this.promotionAPI = this.$promotion.$api.promotion
    await this.getChannelMap()

    await this.init()
  },
  methods: {
    getPatchgrouponStatusText(id, effStartDate, effEndDate) {
      const d = Date.now()
      if (id === 2 && effStartDate < d && effEndDate > d) {
        id = 4
      }
      return utilService.getDictionaryText(id, this.status)
    },
    createPromotion() {
      this.$router.push({
        name: 'PromGroupActivitiesCreate',
        params: {
          promotionType: this.listQuery.obj.promType
        }
      })
    },
    updateBtnShow(e) {
      // 促销活动状态为0：待提交或3：审核未通过时按钮显示
      return e.status === 0 || e.status === 3
    },
    resetQuery() {
      this.listQuery.obj = {
        promType: 2000,
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
     * 获取全局促销子类型名称
     * @param item
     * @returns {*}
     */
    // getFrontPromotionTypeName(item) {
    //   if (utilService.isEmpty(item)) {
    //     return ''
    //   } else {
    //     const frontPromotionTypeName = utilService.getDictionaryText(
    //       item.frontPromotionType,
    //       this.frontPromTypeArr
    //     )
    //     return frontPromotionTypeName
    //   }
    // },
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
          const data = { promotionId: e.id }
          let request
          if (this.promType === 2000) {
            request = this.promotionAPI.getCopyPatchThemeUrl(data)
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
    stopBtnShow(e) {
      // 促销活动状态为2/4：未开始/进行中时按钮显示
      let isShow = false
      if (this.promType === 2000) {
        if (e.status === 2 || e.status === 4) {
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
          if (this.promType === 2000) {
            data = e.id
            request = this.promotionAPI.getClosePatchThemeUrl(data + '')
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
          if (this.promType === 2000) {
            const data = e.id
            request = this.promotionAPI.getDeletePatchThemeUrl(data + '')
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
    seeNewTab(e) {
      const params = {
        promotionId: e.id,
        status: e.status
      }
      if (this.listQuery.obj.promType === 2000) {
        this.$router.push({ name: 'PromGroupActivitiesDetail', params: params })
      }
    },
    async query() {
      this.listQuery.obj.createTime = this.listQuery.obj.createTime || []

      const {
        createTime: [fromDate, endDate],
        ...params
      } = JSON.parse(JSON.stringify(this.listQuery.obj))
      params.fromDate = fromDate
      params.endDate = endDate
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
        promotionType: this.promType
      }

      if (this.promType === 2000) {
        this.$router.push({
          name: 'PromGroupActivitiesEdit',
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

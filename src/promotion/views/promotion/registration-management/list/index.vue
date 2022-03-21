<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="queryContent" :model="queryContent" label-width="100px" class="form">
          <ody-search-item :label="$t('报名活动名称:')" prop="obj.activityTitle">
            <el-input
              :placeholder="$t('请输入报名活动名称')"
              v-model="queryContent.obj.activityTitle"
              name="queryContent_obj_activityTitle"
            />
          </ody-search-item>
          <ody-search-item :label="$t('报名ID:')" prop="obj.id">
            <ody-input-number
              v-model="queryContent.obj.id"
              :max="9999999999999999"
              :empty-tip="false"
              :placeholder="$t('请输入报名ID')"
              name="queryContent_obj_id"
              maxlength="16"
              style="width:100%"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('关联活动类型:')" prop="obj.refType">
            <promotion-ref-type-select
              v-model="queryContent.obj.refType"
              :placeholder="$t('全部')"
              name="queryContent_obj_refType"
            />
          </ody-search-item>
          <ody-search-item :label="$t('关联活动ID:')" prop="obj.refThemeId">
            <ody-input-number
              v-model="queryContent.obj.refThemeId"
              :max="9999999999999999"
              :empty-tip="false"
              :placeholder="$t('请输入关联活动ID')"
              name="queryContent_obj_refThemeId"
              maxlength="16"
              style="width:100%"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动报名时间:')" :space="2" prop="obj.dataPicker">
            <ody-date-range-picker
              v-model="queryContent.obj.dataPicker"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="queryContent_obj_dataPicker"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="button001"
          size="small"
          type="primary"
          code="PromotionRegistrationListQueryBut"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs
          v-model="queryContent.obj.status"
          name="queryContent_obj_status"
          @tab-click="handleFilterGroupon"
        >
          <el-tab-pane :label="$t('全部')" name="-1" />
          <el-tab-pane :label="$t('待开始')" name="0" />
          <el-tab-pane :label="$t('报名中')" name="1" />
          <el-tab-pane :label="$t('已结束')" name="2" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :data="applyActivityList"
          :columns="table.columns"
          :operates="table.operates"
          name="applyActivityList863"
          request-url="/back-promotion-web/applyActivityRead/queryApplyActivityList.do"
        >
          <template
            slot="refType"
            slot-scope="scope"
          >{{ scope.row.refType | keyVal(getRefTypeMap) }}</template>
          <template
            slot="status"
            slot-scope="scope"
          >{{ getActivityStatusValue(scope.row.startTime, scope.row.endTime) }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
          <template slot="activityTitle" slot-scope="scope">
            <a
              v-if="$portal.hasPermission('PromotionRegistrationListSeeBut')"
              name="seeNewTab"
              class="activity-id-link"
              @click="seeNewTab(scope.row)"
            >{{ scope.row.activityTitle }}</a>
            <a
              v-if="!$portal.hasPermission('PromotionRegistrationListSeeBut')"
              name="seeNewTab"
              class="activity-id-link"
            >{{ scope.row.activityTitle }}</a>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import constants from '@/utils/constants'
import PromotionRefTypeSelect from '@/components/promotion-ref-type-select'
export default {
  name: 'PromotionRegistrationList',
  components: {
    PromotionRefTypeSelect
  },
  data() {
    return {
      queryContent: {
        applyActivityType: undefined,
        queryStatus: undefined,
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: undefined,
        obj: {
          status: '-1',
          activityTitle: undefined,
          id: '',
          refThemeId: '',
          refType: undefined,
          promotionType: undefined,
          startTime: '',
          endTime: '',
          dataPicker: []
        }
      },
      applyActivityList: [],

      table: {
        columns: [
          {
            label: this.$t('报名名称'),
            slot: 'activityTitle',
            align: 'center',
            show: true
          },
          {
            label: this.$t('报名ID'),
            prop: 'id',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            show: true,
            align: 'center',
            label: this.$t('报名时间'),
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              return `<span>${this.$portal.parseTime(
                row.startTime,
                '{y}-{m}-{d} {h}:{i}'
              )}-</span>
            <span>${this.$portal.parseTime(
    row.endTime,
    '{y}-{m}-{d} {h}:{i}'
  )}</span>`
            }
          },
          {
            show: true,
            slot: 'status',
            label: this.$t('活动状态'),
            align: 'center',
            minWidth: 88
          },
          {
            label: this.$t('报名商品总数'),
            prop: 'totalNum',
            align: 'center',
            show: true
          },
          {
            label: this.$t('待平台审核编号'),
            prop: 'awaitFinaneAuditNum',
            align: 'center',
            show: true
          },
          {
            label: this.$t('关联活动类型'),
            slot: 'refType',
            align: 'center',
            show: true
          },
          {
            label: this.$t('关联活动ID'),
            prop: 'refThemeId',
            align: 'center',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('创建人'),
            prop: 'createUsername',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('创建时间'),
            prop: 'createTime',
            align: 'center',
            minWidth: 200,
            show: true,
            formatter: (row, column) => {
              if (row.createTime) {
                return this.$portal.parseTime(row.createTime)
              }
            }
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('报名记录'),
              method: (index, row) => {
                this.$router.push({
                  name: 'PromotionRegistrationRecord',
                  params: {
                    activityTitle: row.activityTitle,
                    id: row.id,
                    queryStatus: row.refType,
                    startTime: row.startTime,
                    endTime: row.endTime,
                    refThemeId: row.refThemeId
                  }
                })
              },
              code: 'PromotionRegistrationListRecordBut'
            },
            {
              label: this.$t('编辑'),
              hidden: function(index, row) {
                if (row.startTime <= new Date() && row.promotionType === 1) {
                  return true
                }
              },
              method: (index, row) => {
                this.updateApplyActivity(row)
              },
              code: 'PromotionRegistrationListEditBut'
            },
            {
              label: this.$t('查看'),
              hidden: function(index, row) {
                if (row.startTime > new Date()) {
                  return true
                }
              },
              method: (index, row) => {
                this.seeNewTab(row)
              },
              code: 'PromotionRegistrationListSeeBut'
            }
          ]
        }
      }
    }
  },
  computed: {
    getRefTypeMap() {
      return constants.applyActivityTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getRegistrationType() {
      return constants.registrationTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    getActivityStatusValue(startTime, endTime) {
      var now = new Date()
      if (startTime > now) {
        return '未开始'
      } else if (endTime < now) {
        return '已过期'
      }
      return '进行中'
    },
    seeNewTab(e) {
      this.$router.push({
        name: 'PromotionRegistrationDetail',
        params: {
          refType: e.refType,
          refThemeId: e.refThemeId,
          promotionType: e.promotionType,
          id: e.id
        }
      })
    },
    // 编辑按钮显示
    updateBtnShow(startTime) {
      return startTime > new Date()
    },
    // 查看按钮显示
    updateApplyActivity(id) {},
    handleReset() {
      this.formReset('queryContent')
      this.queryContent.obj.refType = ''
    },
    async handleSubmit() {
      const [validError] = await this.formValidate('queryContent')
      if (validError) {
        return
      }
      await this.query()
    },
    async query() {
      const {
        dataPicker,
        ...params
      } = JSON.parse(JSON.stringify(this.queryContent.obj))
      const [createTimeStart, createTimeEnd] = dataPicker || []
      params.startTime = createTimeStart
      params.endTime = createTimeEnd

      if (params.status === '-1') {
        delete params.status
      }
      const param = {
        obj: this.formHasValue(params)
      }
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(param))
    },
    handleFilterGroupon() {
      this.queryContent.currentPage = 1
      this.query()
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-id-link {
  color: #409eff;
}
</style>

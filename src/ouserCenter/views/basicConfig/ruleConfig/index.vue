<template>
  <div slot="tabs">
    <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick">
      <!--积分基础设置-->
      <el-tab-pane :label="$t('point_basic_config')">
        <el-form ref="form" :model="pointRuleInfo">
          <el-form-item :label="$t('rule_status')">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="pointRuleInfo.status"
              :active-text="pointRuleInfo.status === 1 ? $t('open') : $t('close')"
              :disabled="!$portal.hasPermission('OuserCenterRuleConfigUpdatePointRuleStatus')"
              name="pointRuleInfo_status"
            />
            <sapn style="margin-left: 30px">{{ $t('point_basic_config_tips') }}</sapn>
          </el-form-item>

          <el-form-item :label="$t('rule_modify')">
            <el-row>
              <el-col :span="1">
                <ody-input-number
                  v-model="pointRuleInfo.value"
                  :min="1"
                  :max="999"
                  name="pointRuleInfo_value"
                  style="width: 60px;margin-left: 10px"
                />
              </el-col>
              <el-col :span="2">
                <el-select
                  v-model="pointRuleInfo.type"
                  :placeholder="$t('please_choose')"
                  :clearable="false"
                  name="pointRuleInfo_type"
                  style="width: 100px;margin-left: 10px"
                >
                  <el-option
                    v-for="item in dateTypes"
                    :key="item.value"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-col>
              <el-col :span="7" style="margin-left: 10px">
                <sapn>{{ $t('deduction_point_tips') }}</sapn>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item>
            <ody-button
              name="OuserCenterRuleConfigUpdatePonitRule_updatePointRule"
              size="small"
              type="primary"
              code="OuserCenterRuleConfigUpdatePonitRule"
              @click="updatePointRule"
            >{{ $t('preservation') }}</ody-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!--等级基础设置-->
      <el-tab-pane :label="$t('level_basic_config')">
        <el-form ref="form" :model="growthRuleInfo">
          <el-form-item :label="$t('rule_status')">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="growthRuleInfo.status"
              :active-text="growthRuleInfo.status === 1 ? $t('open') : $t('close')"
              :disabled="!$portal.hasPermission('OuserCenterRuleConfigUpdateGrowthRuleSatus')"
              name="growthRuleInfo_status"
              @change="updateGrowthRuleStatus(growthRuleInfo.id, growthRuleInfo.status)"
            />

            <sapn style="margin-left: 30px">{{ $t('point_basic_config_tips') }}</sapn>
          </el-form-item>

          <el-form-item :label="$t('rule_modify')">
            <sapn>{{ $t('continuous') }}</sapn>
            <sapn style="font-weight:bold">{{ growthRuleInfo.value }}{{ growthRuleInfo.typeStr }}</sapn>
            <sapn>{{ $t('deduction_growth_tips') }}</sapn>
          </el-form-item>
          <ody-title :title="$t('level_info')" />
          <ody-table
            :can-filter="false"
            :data="levelList"
            :columns="levelColumns"
            name="levelList889"
            style="width: 50%"
          />
        </el-form>
      </el-tab-pane>
      <!--操作日志-->
      <el-tab-pane :label="$t('operation_log')">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <ody-search-item :label="$t('common_operationUserId')" prop="param.userId">
                <el-input v-model="search.param.userId" name="search_param_userId" type="number" />
              </ody-search-item>
              <ody-search-item :label="$t('common_operationUserName')" prop="param.userName">
                <el-input v-model="search.param.userName" name="search_param_userName" />
              </ody-search-item>
              <ody-search-item :space="2" :label="$t('common_operationTime')" prop="data.createTime">
                <ody-date-range-picker
                  ref="createTime"
                  v-model="search.data.createTime"
                  :default="7"
                  name="search_data_createTime"
                  type="datetimer"
                />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="initLogData" size="small" @click="initLogData">{{ $t('common_reset') }}</el-button>
            <ody-button
              name="OuserCenterRuleConfigQueryOperateLog_queryLogList"
              size="small"
              type="primary"
              code="OuserCenterRuleConfigQueryOperateLog"
              @click="queryLogList"
            >{{ $t('common_select') }}</ody-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="btn">
            <ody-button
              name="ruleLogExport_download"
              size="small"
              style="float:right;margin-left: 10px"
              code="ruleLogExport"
              @click="download"
            >{{ $t('common_export') }}</ody-button>
            <ody-button
              name="ruleLogExportEventList_downloadTaskVisible"
              size="small"
              style="float:right"
              code="ruleLogExportEventList"
              @click="downloadTaskVisible=true"
            >{{ $t('common_see_task') }}</ody-button>
          </div>
          <div slot="table">
            <ody-table :loading="loading" :data="list" :columns="columns" name="list091" />
          </div>
          <div slot="page">
            <ody-pagination
              :current-page.sync="page.current"
              :list="list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.size"
              :total.sync="page.total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="onPageChange"
              @current-change="onPageChange"
            />
          </div>
        </ody-list-table-area>
      </el-tab-pane>
    </el-tabs>

    <downloadTask :task-type-list-str="'ruleLogExport'" :visible.sync="downloadTaskVisible" />
  </div>
</template>

<script>
import downloadTask from '@/components/downloadTask'

export default {
  name: 'OuserCenterRuleConfig',
  components: {
    downloadTask
  },
  data() {
    const self = this
    return {
      activeState: '0',
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      search: {
        data: {
          createTime: []
        },
        param: {
          userId: null,
          userName: null
        }
      },
      pointRuleInfo: {
        type: '',
        value: 1
      },
      growthRuleInfo: {},
      dateTypes: [],
      dateMap: {
        day: this.$t('common_unit_day'),
        month: this.$t('month'),
        year: this.$t('natural_year')
      },
      columns: [
        {
          show: true,
          prop: 'userName',
          label: this.$t('common_operationUserName'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'userId',
          label: this.$t('common_operationUserId'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('operation_menu'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'content',
          label: this.$t('operation_content'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('operation_time'),
          align: 'center',
          minWidth: 120,
          formatter(row, columns) {
            if (row.createTime) {
              return self.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
            return ''
          }
        }
      ],
      levelList: [],
      levelColumns: [
        {
          show: true,
          prop: 'levelName',
          label: this.$t('rank_name'),
          align: 'center',
          minWidth: 60
        },
        {
          show: true,
          prop: 'memberTypeStr',
          label: this.$t('rank_type'),
          align: 'center',
          minWidth: 60
        },
        {
          show: true,
          prop: 'growthValue',
          label: this.$t('required_growth_value'),
          align: 'center',
          minWidth: 60
        }
      ],
      downloadTaskVisible: false
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      this.queryCode()
      this.getPointRuleInfo()
      this.getGrowthRuleInfo()
      this.getLevelList()
    },
    async handleTabsClick() {
      try {
        this.switchTab(this.activeState)
      } catch (ex) {
        console.log(ex)
      }
    },
    switchTab(type) {
      this.type = Number(type)
      if (this.type === 0) {
        this.getPointRuleInfo()
      } else if (this.type === 1) {
        this.getGrowthRuleInfo()
      } else if (this.type === 2) {
        this.queryLogList()
      }
    },
    queryCode() {
      const categorys = {
        categories: ['RULE_BAISC_DATE_UNIT']
      }
      this.$ouserCenter.$api.userService.listMulti(categorys).then(resp => {
        this.dateTypes = resp.data['RULE_BAISC_DATE_UNIT']
      })
    },
    onPageChange() {
      this.listLogData()
    },
    async queryLogList() {
      this.page.current = 1
      await this.listLogData()
    },
    async initLogData() {
      this.search.param = {
        userId: null,
        userName: null
      }
      this.search.data = {
        createTime: []
      }
      this.$refs.createTime.setDefault(7)
    },
    async listLogData() {
      const vue = this
      vue.list = []

      if (vue.search.data.createTime) {
        vue.search.param.startCreateTime = this.search.data.createTime[0]
        vue.search.param.endCreateTime = this.search.data.createTime[1]
      } else {
        delete vue.search.param.startCreateTime
        delete vue.search.param.endCreateTime
      }

      var relationIds = new Array(2)
      relationIds[0] = 'Rule:' + vue.growthRuleInfo.id
      relationIds[1] = 'Rule:' + vue.pointRuleInfo.id

      const param = {
        filters: {},
        startCreateTime: vue.search.param.startCreateTime,
        endCreateTime: vue.search.param.endCreateTime,
        relationIds: relationIds,
        needContext: true,
        limit: vue.page.size,
        page: vue.page.current
      }

      if (vue.search.param.userId !== null && vue.search.param.userId !== '') {
        param.filters.createUserid = parseInt(vue.search.param.userId)
      }

      if (vue.search.param.userName !== null) {
        param.filters.createUsername =
          vue.search.param.userName !== ''
            ? vue.search.param.userName.trim()
            : null
      }

      const crmService = vue.$ouserCenter.$api.crmService
      crmService.listOperActionPage(param).then(result => {
        if (result.code === '0') {
          result.data.forEach(item => {
            var logData = {
              name: item.context.name,
              content: item.note,
              userId: item.userId,
              userName: item.userName,
              createTime: item.timeStr
            }
            vue.list.push(logData)
          })

          vue.page.total = result.total
          vue.total = result.total
        }
      })
    },
    async getPointRuleInfo() {
      const vue = this
      const param = {
        type: 2,
        subType: 0,
        entityType: 1
      }
      const crmService = vue.$ouserCenter.$api.crmService
      crmService.listRulePage(param).then(result => {
        if (result.code === '0' && result.data.length > 0) {
          var obj = result.data[0]
          vue.pointRuleInfo.status = obj.status
          vue.pointRuleInfo.id = obj.id
          var param = JSON.parse(obj.param)
          vue.pointRuleInfo.value = param.value
          vue.pointRuleInfo.type = param.type
        }
      })
    },
    async getGrowthRuleInfo() {
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
          vue.growthRuleInfo.status = obj.status
          vue.growthRuleInfo.id = obj.id
          var param = JSON.parse(obj.param)
          vue.growthRuleInfo.value = param.value
          vue.growthRuleInfo.typeStr = vue.dateMap[param.type]
        }
      })
    },
    async getLevelList() {
      var vue = this
      var param = {
        filters: {
          sort: 2
        }
      }
      const levelService = vue.$ouserCenter.$api.crmService
      levelService.getUcMembershipLevelList(param).then(result => {
        if (result.code === '0') {
          const data = result.data
          vue.levelList = data
          for (var i = 0; i < vue.levelList.length; i++) {
            if (vue.levelList[i].memberType === 1) {
              vue.levelList[i].memberTypeStr = this.$('ordinary_member')
            }
          }
        }
      })
    },
    async updateGrowthRuleStatus(id, status) {
      this.$ouserCenter.$api.crmService
        .updateRuleStatus({ id: id, status: status })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_update_success')
            })
          }
          this.getGrowthRuleInfo()
        })
    },
    async updatePointRule() {
      const vue = this
      var paramJson = {
        type: vue.pointRuleInfo.type,
        value: parseInt(vue.pointRuleInfo.value)
      }

      var pointInfoParam = {
        id: vue.pointRuleInfo.id,
        status: vue.pointRuleInfo.status,
        paramJson: paramJson
      }

      this.$ouserCenter.$api.crmService.updateRule(pointInfoParam).then(res => {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_update_success')
          })
        }
        this.getPointRuleInfo()
      })
    },
    async download() {
      const vue = this
      const param = {
        filters: {},
        currentPage: 1,
        itemsPerPage: 1000,
        startCreateTime: this.search.data.createTime[0],
        endCreateTime: this.search.data.createTime[1]
      }

      if (vue.search.param.userId !== null && vue.search.param.userId !== '') {
        param.filters.createUserid = parseInt(vue.search.param.userId)
      }

      if (vue.search.param.userName !== null) {
        param.filters.createUsername =
          vue.search.param.userName !== ''
            ? vue.search.param.userName.trim()
            : null
      }

      const res = await this.$ouserCenter.$api.crmService.exportRuleLog(param)
      if (res.code === '0') {
        this.$message.success(this.$t('创建导出任务成功'))
      } else {
        this.$message.error(this.$t('创建导出任务失败'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

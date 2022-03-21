<template>
  <div class="cp-task-analysis-member-detail-list">
    <el-form :inline="true">
      <ody-left-right class="toolbar">
        <div slot="left">
          <el-form-item :label="$t('会员类型:')">
            <el-select
              v-model="search.indicatorType"
              :placeholder="$t('请选择')"
              :clearable="false"
              name="search_indicatorType"
              class="form-select"
              @change="handleIndicatorTypeChange"
            >
              <el-option
                v-for="item in getOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div slot="right">
          <crm-task-save-group-button
            :task-status="taskStatus"
            :task-id="taskId"
            :search-params="{refValue: search.indicatorType || null}"
            :save-params="{refValue: search.indicatorType || null}"
            :page-node-id="pageNodeId"
          />
          <ody-button
            name="exportMktUserAttrAnalysisReport_handleExport"
            size="small"
            type="default"
            code="exportMktUserAttrAnalysisReport"
            @click="handleExport"
          >
            {{ $t('导出报表') }}
          </ody-button>
        </div>
      </ody-left-right>
    </el-form>
    <ody-table
      ref="table"
      :can-filter="false"
      :columns="getColumns"
      pagination-style="noborder"
      request-url="/obi-web/crm/report/mktUserAnalysisReport.do"
    >
      <template slot-scope="scope" slot="growthValue">
        {{ scope.row.growthValue }}
      </template>
    </ody-table>
  </div>
</template>

<script>
import CrmTaskSaveGroupButton from '@/components/task-save-group-button'

export default {
  components: {
    CrmTaskSaveGroupButton
  },
  props: {
    taskId: {
      type: String,
      default: null
    },
    taskStatus: {
      type: String,
      default: null
    },
    pageNodeId: {
      type: String,
      default: null
    },
    crmModelCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      modal: {
        groupStatic: {
          visible: false
        }
      },
      isSaved: true, // 是否保存过
      optionsMap: {
        payEndMoney: [
          {
            value: 'payEnd',
            label: this.$t('成功支付尾款')
          },
          {
            value: 'notPayEnd',
            label: this.$t('未支付尾款')
          },
          {
            value: 'afterSale',
            label: this.$t('发起售后')
          }
        ],
        growth: [
          {
            value: 'all',
            label: this.$t('全部会员')
          },
          {
            value: 'upgrade',
            label: this.$t('升级会员')
          },
          {
            value: 'notUpgrade',
            label: this.$t('未升级会员')
          }
        ],
        common: [
          {
            value: 'intention',
            label: this.$t('意向会员')
          },
          {
            value: 'pay',
            label: this.$t('成交会员')
          },
          {
            value: 'return',
            label: this.$t('售后会员')
          }
        ]
      },
      search: {
        indicatorType: 'pay',
        pageNodeId: this.pageNodeId,
        taskId: this.taskId
      },
      table: {
        growthColumns: [
          {
            label: this.$t('会员昵称'),
            prop: 'nickname',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('会员手机号'),
            prop: 'mobile',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('会员等级'),
            prop: 'userLevel',
            minWidth: 100,
            show: true
          },
          {
            label: this.$t('成长值'),
            slot: 'growthValue',
            minWidth: 180,
            show: true
          }
        ],
        columns: [
          {
            label: this.$t('会员昵称'),
            prop: 'nickname',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('会员手机号'),
            prop: 'mobile',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('订单数'),
            prop: 'orderNum',
            minWidth: 80,
            show: true
          },
          {
            label: this.$t('订单金额'),
            prop: 'orderAmount',
            minWidth: 80,
            show: true
          },
          {
            label: this.$t('商品件数'),
            prop: 'orderMpNum',
            minWidth: 80,
            show: true
          }
        ]
      }
    }
  },
  computed: {
    getOptions() {
      return this.optionsMap[this.crmModelCode] || ''
    },
    getColumns() {
      if (this.crmModelCode === 'growth') {
        return this.table.growthColumns
      }
      return this.table.columns
    }
  },
  async mounted() {
    this.search.indicatorType = this.getOptions[0].value
    await this.query()
    await this.loadIsSaved()
  },
  methods: {
    async handleGroupStaticOk() {
      await this.loadIsSaved()
    },
    async loadIsSaved() {
      const { taskId: mktId, pageNodeId: mktPageNodeId } = this
      const { data } = await this.$crm.$api.userGroupMktRelation.list({
        filters: {
          mktId,
          mktPageNodeId
        }
      })

      console.log(data)
    },
    async handleIndicatorTypeChange() {
      await this.query()
    },
    async handleExport() {
      const { taskId, pageNodeId, search: { indicatorType }} = this

      await this.$portal.downloadFileByGet(`/api/obi-web/crm/report/exportMktUserAnalysisReport.do`, {
        taskId,
        pageNodeId,
        indicatorType
      })
    },
    async handleSaveUserGroup() {
      this.modal.groupStatic.visible = true
    },
    query() {
      const {
        ...params
      } = this.search

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    }
  }

}
</script>

<style lang="scss" scoped>
.cp-task-analysis-member-detail-list {
  padding-bottom: 10px;
  .toolbar {
    .form-select {
      display: inline-block;
      width: 100px;
    }
    margin-bottom: 10px;
  }
}
</style>

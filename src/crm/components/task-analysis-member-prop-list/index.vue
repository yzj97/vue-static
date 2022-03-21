<template>
  <div class="cp-task-analysis-member-prop-list">
    <el-form :inline="true">
      <ody-left-right class="toolbar">
        <div slot="left">
          <el-form-item :label="$t('会员列表:')">
            <el-select
              v-model="search.indicatorType"
              :placeholder="$t('请选择')"
              :clearable="false"
              name="search_indicatorType"
              class="form-select"
              @change="handleIndicatorTypeChange"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('会员属性:')">
            <el-select
              v-model="search.attrType"
              :placeholder="$t('请选择')"
              :clearable="false"
              name="search_attrType"
              class="form-select"
              @change="handleIndicatorTypeChange"
            >
              <el-option
                v-for="item in attrTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div slot="right">
          <el-button name="handleExport" size="small" type="default" @click="handleExport">
            {{ $t('导出报表') }}
          </el-button>
        </div>
      </ody-left-right>
    </el-form>
    <ody-table
      ref="table"
      :can-filter="false"
      :columns="getColumns"
      pagination-style="noborder"
      request-url="/obi-web/crm/report/mktUserAttrAnalysisReport.do"
    />
  </div>
</template>

<script>
export default {
  props: {
    taskId: {
      type: String,
      default: null
    },
    pageNodeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      options: [
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
      ],
      attrTypeOptions: [
        {
          value: '1',
          label: this.$t('会员等级')
        },
        {
          value: '2',
          label: this.$t('性别')
        },
        {
          value: '3',
          label: this.$t('新老客')
        },
        {
          value: '4',
          label: this.$t('下单区域')
        }
      ],
      search: {
        indicatorType: 'intention',
        attrType: '1',
        pageNodeId: this.pageNodeId,
        taskId: this.taskId
      },
      table: {
        columns: [

        ]
      }
    }
  },
  computed: {
    getColumns() {
      const baseColumns = [
        {
          label: this.$t('会员数量'),
          prop: 'userNum',
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
      const customColumsMap = {
        1: [
          {
            label: this.$t('会员等级'),
            prop: 'attrName',
            show: true,
            minWidth: 180
          }
        ],
        2: [
          {
            label: this.$t('性别'),
            prop: 'attrName',
            minWidth: 80,
            show: true
          }
        ],
        3: [
          {
            label: this.$t('新老客'),
            prop: 'attrName',
            minWidth: 80,
            show: true
          }
        ],
        4: [
          {
            label: this.$t('下单区域'),
            prop: 'attrName',
            minWidth: 80,
            show: true
          }
        ]
      }

      return [
        ...customColumsMap[this.search.attrType],
        ...baseColumns
      ]
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    async handleIndicatorTypeChange() {
      await this.query()
    },
    async handleExport() {
      const {
        ...params
      } = this.search
      const { taskId, pageNodeId } = this
      await this.$portal.downloadFileByGet(`/api/obi-web/crm/report/exportMktUserAttrAnalysisReport.do`, {
        ...params,
        taskId,
        pageNodeId
      })
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
.cp-task-analysis-member-prop-list {
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

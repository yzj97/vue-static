<template>
  <div class="cp-task-analysis-product-list">
    <el-form :inline="true">
      <ody-left-right class="toolbar">
        <div slot="left">
          <el-form-item :label="$t('商品类型:')">
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
      request-url="/obi-web/crm/report/mktMpAnalysisReport.do"
    >
      <template slot="mpPic" slot-scope="scope">
        <img :src="scope.row.mpPic" width="50">
      </template>
      <template slot="mpPrice" slot-scope="scope">
        {{ scope.row.mpPrice | curreny('￥', 2) }}
      </template>
    </ody-table>
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
          value: '1',
          label: this.$t('购买')
        },
        {
          value: '2',
          label: this.$t('售后')
        },
        {
          value: '3',
          label: this.$t('加车')
        },
        {
          value: '4',
          label: this.$t('收藏')
        },
        {
          value: '5',
          label: this.$t('下单')
        }
      ],
      search: {
        indicatorType: '1',
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
          label: this.$t('商品图片'),
          slot: 'mpPic',
          show: true,
          minWidth: 180
        },
        {
          label: this.$t('商品名称'),
          prop: 'mpName',
          show: true,
          minWidth: 180
        },
        {
          label: this.$t('商品编码'),
          prop: 'mpCode',
          minWidth: 180,
          show: true
        },
        {
          label: this.$t('商品价格'),
          slot: 'mpPrice',
          minWidth: 80,
          show: true
        }
      ]
      const customColumsMap = {
        1: [
          {
            label: this.$t('支付商品数量'),
            prop: 'mpNum',
            minWidth: 120,
            show: true
          }
        ],
        2: [
          {
            label: this.$t('售后单数量'),
            prop: 'mpNum',
            minWidth: 120,
            show: true
          }
        ],
        3: [
          {
            label: this.$t('加车次数'),
            prop: 'mpNum',
            minWidth: 120,
            show: true
          }
        ],
        4: [
          {
            label: this.$t('收藏次数'),
            prop: 'mpNum',
            minWidth: 120,
            show: true
          }
        ],
        5: [
          {
            label: this.$t('下单商品数量'),
            prop: 'mpNum',
            minWidth: 120,
            show: true
          }
        ]
      }

      return [
        ...baseColumns,
        ...customColumsMap[this.search.indicatorType]
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
      const { taskId, pageNodeId, search: { indicatorType }} = this
      await this.$portal.downloadFileByGet(`/api/obi-web/crm/report/exportMktMpAnalysisReport.do`, {
        taskId,
        pageNodeId,
        indicatorType
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
  .cp-task-analysis-product-list {
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

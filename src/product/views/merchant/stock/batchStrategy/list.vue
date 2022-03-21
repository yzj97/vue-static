<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('批次策略名称') + '：'" :space="1">
            <el-input v-model="filters.batchStrategyName" :placeholder="$t('请输入') + $t('批次策略名称')" name="searchForm_filters_batchStrategyName" maxlength="20"/>
          </ody-search-item>
          <ody-search-item :label="$t('商家') + '：'">
            <ody-merchant-select ref="merchantId" v-model="filters.merchantId" :placeholder="$t('全部')" value-key="merchantId" name="merchantId"/>
          </ody-search-item>
          <ody-search-item :label="$t('创建时间') + '：'">
            <el-date-picker
              v-model="createTimeRange"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="searchForm_filters_createTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="BatchStrategy_list"
          code="BatchStrategy_list"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="BatchStrategy_add"
          code="BatchStrategy_add"
          size="small"
          type="primary"
          @click="add"
        >{{ $t('新增批次策略') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          name="batchStrategyTable">
          <template slot="batchStrategyName" slot-scope="scope">
            <el-link type="primary" name="BatchStrategy_detail" code="BatchStrategy_detail" @click="handleViewDetail(scope.row)">{{ scope.row.batchStrategyName }}</el-link>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="search"
          @current-change="search"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>
<script>
export default {
  name: 'BatchStrategyList',
  data() {
    return {
      createTimeRange: [],
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('批次策略名称'),
          slot: 'batchStrategyName',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('商家'),
          prop: 'merchantName',
          show: true
        },
        {
          label: this.$t('批次属性'),
          prop: 'batchAttrs',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            try {
              if (row.batchAttrs) {
                const attrs = JSON.parse(row.batchAttrs)
                return attrs.map(x => x['name']).join('；')
              }
            } catch (e) {
              console.log(e)
            }
            return ''
          }
        },
        {
          label: this.$t('备注'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('创建人'),
          prop: 'createUsername',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          show: true,
          align: 'center',
          formatter: (row, column, cellValue) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('编辑'),
            code: 'BatchStrategy_update',
            method: (index, row) => {
              this.$router.push({
                name: 'BatchStrategyEdit',
                params: {
                  id: row.id,
                  operate: 'edit'
                }
              })
            }
          },
          {
            label: this.$t('删除'),
            code: 'BatchStrategy_delete',
            method: (index, row) => {
              this.delete(row)
            }
          }
        ]
      },
      filters: this.initFilters(),
      page: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.search()
  },
  methods: {
    async init() {
      this.search()
    },
    search() {
      this.loading = true

      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$product.$api.batchStrategyApi.listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          this.total = res.total
        },
        () => {
          this.loading = false
        }
      )
    },
    handleFilters() {
      if (this.createTimeRange && this.createTimeRange.length > 1) {
        this.filters.startCreateTime = this.createTimeRange[0]
        this.filters.endCreateTime = this.createTimeRange[1]
      } else {
        delete this.filters.startCreateTime
        delete this.filters.endCreateTime
      }
    },
    reset() {
      this.checked = []
      this.filters = this.initFilters()
      this.createTimeRange = []
      this.$refs.createTimeRange.setDefault(30)
    },
    add() {
      this.$router.push({
        name: 'BatchStrategyAdd',
        params: {
          operate: 'add'
        }
      })
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('确定要删除当前批次策略吗'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$product.$api.batchStrategyApi.delete(
          ids
        )
        if (result && result.code === '0') {
          this.search()
          this.$message({
            type: 'success',
            message: this.$t('common_delete_success')
          })
        }
      }
    },
    handleViewDetail(row) {
      this.$router.push({
        name: 'BatchStrategyDetail',
        params: {
          id: row.id,
          operate: 'detail'
        }
      })
    },
    initFilters() {
      return {
        merchantId: null,
        batchStrategyName: null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.popover-container {
  .popover-input {
    margin-bottom: 10px;
  }
}
.btn-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-button {
    margin-bottom: 4px;
  }
}
</style>

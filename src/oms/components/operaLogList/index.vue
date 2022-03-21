<template>
  <section id="order-log">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="soPickDeliveryDetailForm" label-width="150px">
          <el-row>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item :label="$t('operation_time') + ':'">
                <el-date-picker
                  v-model="operateTime"
                  :start-placeholder="$t('startDate')"
                  :end-placeholder="$t('endDate')"
                  name="operateTime"
                  type="datetimerange"
                  range-separator="~"
                  style="width: 400px; padding-right: 0px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item :label="$t('operation_people') + ':'">
                <el-input v-model="createUsername" name="createUsername"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</el-button>
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <el-table v-loading="loading" :data="dataList" name="dataList339" style="width: 100%">
          <el-table-column :label="$t('operation_time')" prop="timeStr"/>
          <el-table-column :label="$t('operation_people')" prop="userName"/>
          <el-table-column :label="$t('order_ports_operation_log')" prop="note"/>
        </el-table>
      </div>
      <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="limit"
            :total.sync="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"/>
        </div>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    model: {
      type: String,
      default: 'So'
    },
    modelId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      operateTime: null,
      createUsername: null,
      limit: 10,
      page: 1,
      total: 0,
      dataList: [],
      loading: false
    }
  },
  created() {
    this.initSearch()
    this.getLogList()
  },
  methods: {
    handleSearchSubmit() {
      this.getLogList()
    },
    handleSearchReset() {
      this.initSearch()
      this.createUsername = null
    },

    handlePageSizeChange(value) {
      this.limit = value
      this.getLogList()
    },
    handlePageCurrentChange(value) {
      this.page = value
      this.getLogList()
    },

    getLogList() {
      this.loading = true
      const req = {
        filters: {},
        limit: this.limit,
        model: this.model,
        modelId: this.modelId,
        page: this.page
      }
      if (this.operateTime) {
        req.startDateStr = this.$portal.parseTime(this.operateTime[0], '{y}-{m}-{d} {h}:{i}:{s}')
        req.endDateStr = this.$portal.parseTime(this.operateTime[1], '{y}-{m}-{d} {h}:{i}:{s}')
      }
      if (this.createUsername) {
        req.filters.createUsername = this.createUsername
        req.filters.methodNote = null
      }
      this.$oms.$api.common.listOperActionPage(req).then(resp => {
        this.total = resp.total
        this.dataList = resp.data
      }).finally(() => {
        this.loading = false
      })
    },
    initSearch() {
      this.operateTime = [new Date(), new Date()]
      this.operateTime[0].setDate(this.operateTime[0].getDate() - 7)
    }
  }
}
</script>

<style scoped>

</style>

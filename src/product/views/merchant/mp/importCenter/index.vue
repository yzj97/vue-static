<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('文件名称') + ':'" prop="fileName">
            <el-input
              v-model="search.fileName"
              :placeholder="$t('请输入文件名称')"
              name="search_fileName"
            />
          </ody-search-item>
          <ody-search-item :label="$t('类型') + ':'" prop="taskType">
            <el-select v-model="search.taskType" :placeholder="$t('全部')" :popper-append-to-body="false" name="search_importType">
              <el-option
                v-for="(value, key) in importTypeMap"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('处理状态') + ':'" prop="status">
            <el-select v-model="search.status" :placeholder="$t('全部')" name="search_status">
              <el-option v-for="(value, key) in statusMap" :key="key" :label="value" :value="key" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('创建时间') + ':'" :space="2" prop="createTimeRange">
            <ody-date-range-picker v-model="createTimeRange" name="search_createTime" type="datetimer" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="ImportCenterTask_btn"
          code="ImportCenterTask_btn"
          size="small"
          type="primary"
          @click="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :request-url="$product.$api.common.dataTask_listPageWithDataAuth.url"
          request-page-type="page"
        />
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
export default {
  name: 'ImportCenter',
  data() {
    const vue = this
    return {
      statusMap: {},
      importTypeMap: {},
      search: getDefaultForm(),
      createTimeRange: [],
      table: {
        columns: [
          {
            label: vue.$t('文件名称'),
            prop: 'fileName',
            show: true,
            minWidth: 200
          },
          {
            label: vue.$t('类型'),
            prop: 'importType',
            show: true,
            formatter(row, column) {
              return vue.importTypeMap[row.taskType]
            }
          },
          {
            label: vue.$t('处理状态'),
            prop: 'status',
            show: true,
            formatter(row, column) {
              return vue.statusMap[row.status]
            }
          },
          {
            label: vue.$t('处理数量'),
            prop: 'totalCount',
            show: true
          },
          {
            label: vue.$t('处理成功数量'),
            prop: 'successCount',
            show: true
          },
          {
            label: vue.$t('处理失败数量'),
            prop: 'failedCount',
            show: true
          },
          {
            label: vue.$t('创建时间'),
            prop: 'startTime',
            show: true,
            minWidth: 200,
            formatter: (row, column) => {
              if (row.startTime) {
                return vue.$portal.parseTime(row.startTime)
              }
              return ''
            }
          },
          {
            label: vue.$t('操作人'),
            prop: 'createUsername',
            show: true
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: vue.$t('下载'),
              hidden: (index, row) => {
                return !row.failedFilePath
              },
              method: (index, row) => {
                this.downloadFile(row)
              },
              code: 'ImportCenterDownLoadFile'
            }
          ]
        }
      }
    }
  },
  async mounted() {
    await this.initCodes()
    await this.query()
  },
  methods: {
    async initCodes() {
      const { data } = await this.$product.$api.common.listMultiCode({
        categorys: ['DATA_TASK_TYPE', 'DATA_TASK_STATUS']
      })
      this.importTypeMap = data.DATA_TASK_TYPE
      this.statusMap = data.DATA_TASK_STATUS
    },
    handleReset() {
      this.search = getDefaultForm()
      this.createTimeRange = []
    },
    async handleSubmit() {
      await this.query()
    },
    query() {
      const params = {
        filters: {
          type: 1
        }
      }
      params.filters = Object.assign(params.filters, this.search)
      params.sorts = [
        {
          field: 'id',
          asc: false
        }
      ]
      if (this.createTimeRange) {
        const [createTimeStart, createTimeEnd] = this.createTimeRange
        if (createTimeStart) {
          params.filters.startStartTime = createTimeStart + ' 00:00:00'
        }
        if (createTimeEnd) {
          params.filters.endStartTime = createTimeEnd + ' 23:59:59'
        }
      } else {
        delete params.filters.startStartTime
        delete params.filters.endStartTime
      }
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    downloadFile(row) {
      if (row.failedFilePath) {
        this.$portal.downloadFileByGet(
          row.failedFilePath || row.filePath,
          {},
          row.fileName
        )
      }
    }
  }
}
function getDefaultForm() {
  return Object.assign(
    {},
    {
      fileName: null,
      status: null,
      taskType: null
    }
  )
}
</script>
<style lang="less" scoped>
</style>

<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item label="App:" prop="app">
              <el-input v-model="searchForm.app" name="searchForm_app" placeholder="Pool对应包路径" />
            </ody-search-item>
            <ody-search-item label="UUID:" prop="uuid">
              <el-input v-model="searchForm.uuid" name="searchForm_uuid" placeholder="uuid" />
            </ody-search-item>
            <ody-search-item label="Type:" prop="type">
              <el-input v-model="searchForm.type" name="searchForm_type" placeholder="调用类型" />
            </ody-search-item>
            <ody-search-item label="Service:" prop="service">
              <el-input v-model="searchForm.service" name="searchForm_service" placeholder="Service" />
            </ody-search-item>
            <ody-search-item label="Api:" prop="api">
              <el-input v-model="searchForm.api" name="searchForm_api" placeholder="请求URL"/>
            </ody-search-item>
            <ody-search-item :space="2" :label="$t('入参:')" prop="model">
              <el-col :span="12">
                <el-input v-model="searchForm.requestKey" name="searchForm_requestKey" placeholder="字段名(支持点号分割)"/>
              </el-col>
              <el-col :span="12">
                <el-input v-model="searchForm.requestValue" name="searchForm_requestValue" placeholder="字段值"/>
              </el-col>
            </ody-search-item>
            <ody-search-item :space="2" :label="$t('出参:')" prop="model">
              <el-col :span="12">
                <el-input v-model="searchForm.responseKey" name="searchForm_responseKey" placeholder="字段名(支持点号分割)"/>
              </el-col>
              <el-col :span="12">
                <el-input v-model="searchForm.responseValue" name="searchForm_responseValue" placeholder="字段值"/>
              </el-col>
            </ody-search-item>
            <ody-search-item :label="$t('操作时间:')" class="register" prop="dateTime">
              <ody-date-range-picker
                ref="dateTime"
                v-model="searchForm.dateTime"
                :default="7"
                :placeholder="$t('选择日期')"
                type="datetimer"/>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <ody-button code="ui" name="findMongoLog" size="small" type="primary" @click="findMongoLog(true)">{{ $t('查询') }}</ody-button>
          <ody-button code="ui" name="initForm" size="small" @click="initForm">{{ $t('重置') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list260">
            <template slot-scope="scope" slot="uuid">
              <template-cell :row="scope.row" prop="uuid" width="350" />
            </template>
            <template slot-scope="scope" slot="type">
              <template-cell :row="scope.row" prop="type" width="350" />
            </template>
            <template slot-scope="scope" slot="api">
              <template-cell :row="scope.row" prop="api" width="350" />
            </template>
            <template slot-scope="scope" slot="service">
              <template-cell :row="scope.row" prop="service" pop-prop="serviceClass" width="350" />
            </template>
            <template slot-scope="scope" slot="requests">
              <template-cell :row="scope.row" :scroll="true" prop="requests" width="400" />
            </template>
            <template slot-scope="scope" slot="response">
              <template-cell :row="scope.row" :scroll="true" prop="response" width="400" />
            </template>
          </ody-table>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="searchForm.pageNo"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="searchForm.pageSize"
              :total="listTable.total"
              :list="listTable.list"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="findMongoLog()"
              @current-change="findMongoLog()"/>
          </div>
        </div>
      </ody-list-table-area>
    </section>
    <data-dialog :visible.sync="dataDialog.visible" :row-data="dataDialog.data" />
    <relate-data-dialog :visible.sync="relateDataDialog.visible" :type="relateDataDialog.type" :uuid="relateDataDialog.uuid" />
  </div>
</template>

<script>
import DataDialog from '@/components/mongoLog/dataDialog.vue'
import RelateDataDialog from '@/components/mongoLog/relateDataDialog.vue'
import TemplateCell from '@/components/mongoLog/templateCell.vue'
export default {
  components: {
    DataDialog,
    RelateDataDialog,
    TemplateCell
  },
  data() {
    return {
      dataDialog: {
        visible: false,
        data: {}
      },
      relateDataDialog: {
        visible: false,
        type: 'invoke',
        uuid: null
      },
      listTable: {
        list: [],
        columns: [{
          'show': true,
          'prop': 'app',
          'label': 'App',
          'align': 'center',
          'minWidth': 200
        }, {
          'show': true,
          'prop': 'uuid',
          'slot': 'uuid',
          'label': 'UUID',
          'align': 'center',
          'minWidth': 200,
          'tooltip': false
        }, {
          'show': true,
          'prop': 'trace',
          'label': 'Trace',
          'align': 'center',
          'minWidth': 200,
          'tooltip': false
        }, {
          'show': true,
          'prop': 'type',
          'label': 'Type',
          'slot': 'type',
          'align': 'center',
          'minWidth': 200,
          'tooltip': false
        }, {
          'show': true,
          'prop': 'service',
          'slot': 'service',
          'label': 'Service',
          'align': 'center',
          'minWidth': 200,
          'tooltip': false
        }, {
          'show': true,
          'prop': 'api',
          'slot': 'api',
          'label': 'Api',
          'align': 'center',
          'minWidth': 200,
          'tooltip': false
        }, {
          'show': true,
          'prop': 'requests',
          'slot': 'requests',
          'label': '入参',
          'align': 'center',
          'width': 200,
          'tooltip': false
        }, {
          'show': true,
          'prop': 'response',
          'slot': 'response',
          'label': '出参',
          'align': 'center',
          'width': 200,
          'tooltip': false
        }, {
          'show': true,
          'prop': 'createTimestamp',
          'label': '操作时间',
          'align': 'center',
          'width': 200,
          formatter: (row, column) => {
            if (row.createTimestamp) {
              return this.$portal.parseTime(row.createTimestamp, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return
          }
        }],
        operates: {
          width: 200,
          align: 'center',
          fixed: 'right',
          list: [
            {
              label: this.$t('详情'),
              disabled: false,
              method: (index, row) => {
                this.showData(index, row)
              },
              code: 'ui'
            },
            {
              label: this.$t('关联数据'),
              disabled: false,
              method: (index, row) => {
                this.showRelate(row.uuid)
              },
              code: 'ui'
            }
          ]
        },
        total: 0
      },
      searchForm: getDefaultForm()
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    async init() {
      await this.findMongoLog()
    },
    initForm() {
      this.searchForm = getDefaultForm()
      this.$refs.dateTime.setDefault(7)
    },
    checkPageNo() {
      if (!this.listTable.list || this.listTable.list.length === 0) {
        this.searchForm.pageNo = 1
      }
    },
    findMongoLog(checkNo) {
      if (checkNo === true) {
        this.checkPageNo()
      }
      const mongoLogService = this.$ouser.$api.mongoLogService
      const self = this
      mongoLogService.invoke(this.buildRequestData()).then(res => {
        const data = res.data || []
        data.forEach(element => {
          if (element.uuid) {
            const traceArray = element.uuid.split('-')
            if (traceArray.length === 2) {
              element.trace = traceArray[0]
            }
          }
        })
        self.listTable.list = data
        self.listTable.total = res.total
      })
    },
    buildRequestData() {
      let createTimeFrom, createTimeTo
      if (this.searchForm.dateTime) {
        createTimeFrom = this.searchForm.dateTime[0]
        createTimeTo = this.searchForm.dateTime[1]
      }
      const extensionQuery = {
        app: this.searchForm.app ? this.searchForm.app : null,
        type: this.searchForm.type ? this.searchForm.type : null,
        api: this.searchForm.api ? this.searchForm.api : null,
        likeOrEqMap: {}
      }
      if (this.searchForm.service) {
        if (this.searchForm.service.indexOf('.') >= 0) {
          extensionQuery.serviceClass = this.searchForm.service
        } else {
          extensionQuery.service = this.searchForm.service
        }
      }
      if (this.searchForm.requestValue) {
        if (this.searchForm.requestKey) {
          extensionQuery.likeOrEqMap['requests.' + this.searchForm.requestKey] = this.searchForm.requestValue
        } else {
          extensionQuery.likeOrEqMap['requests'] = this.searchForm.requestValue
        }
      }
      if (this.searchForm.responseValue) {
        if (this.searchForm.responseKey) {
          extensionQuery.likeOrEqMap['response.' + this.searchForm.responseKey] = this.searchForm.responseValue
        } else {
          extensionQuery.likeOrEqMap['response'] = this.searchForm.responseValue
        }
      }
      return {
        baseQuery: {
          uuid: this.searchForm.uuid ? this.searchForm.uuid : null,
          pageNo: this.searchForm.pageNo,
          pageSize: this.searchForm.pageSize,
          createTimeFrom: createTimeFrom,
          createTimeTo: createTimeTo
        },
        extensionQuery: extensionQuery
      }
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    showData(index, row) {
      this.dataDialog.data = row
      this.dataDialog.visible = true
    },
    showRelate(uuid) {
      this.relateDataDialog.uuid = uuid
      this.relateDataDialog.visible = true
    }
  }
}
function getDefaultForm() {
  return {
    pageNo: 1,
    pageSize: 10,
    app: null,
    uuid: null,
    service: null,
    type: null,
    requestKey: null,
    requestValue: null,
    responseKey: null,
    responseValue: null,
    dateTime: []
  }
}
</script>

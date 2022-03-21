<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item label="pool" prop="pool">
              <el-input v-model="searchForm.pool" name="searchForm_pool"/>
            </ody-search-item>
            <ody-search-item :label="$t('模块')" prop="model">
              <el-input v-model="searchForm.model" name="searchForm_model"/>
            </ody-search-item>
            <ody-search-item :label="$t('操作对象')" prop="opObject">
              <el-input v-model="searchForm.opObject" name="searchForm_opObject"/>
            </ody-search-item>
            <ody-search-item :label="$t('操作类型')" prop="opType">
              <el-input v-model="searchForm.opType" name="searchForm_opType"/>
            </ody-search-item>
            <ody-search-item :label="$t('操作对象主键')" prop="opObjectId">
              <el-input v-model="searchForm.opObjectId" name="searchForm_opObjectId"/>
            </ody-search-item>
            <ody-search-item :label="$t('操作人')" prop="createUsername">
              <el-input v-model="searchForm.createUsername" name="searchForm_createUsername"/>
            </ody-search-item>
            <ody-search-item :space="2" :label="$t('操作时间:')" class="register" prop="dateTimeStart">
              <el-col :span="10">
                <el-date-picker
                  v-model="searchForm.dateTimeStart"
                  :placeholder="$t('选择日期')"
                  name="searchForm_dateTimeStart"
                  type="date"/>
              </el-col>
              <el-col :span="1">{{ $t('至') }}</el-col>
              <el-col :span="10">
                <el-date-picker
                  v-model="searchForm.dateTimeEnd"
                  :picker-options="pickerOptions"
                  :placeholder="$t('选择日期')"
                  name="searchForm_dateTimeEnd"
                  type="date"/>
              </el-col>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="findOplog" size="small" type="primary" @click="findOplog">{{ $t('查询') }}</el-button>
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list260"/>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="searchForm.currentPage"
              :list="listTable.list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="searchForm.itemsPerPage"
              :total.sync="listTable.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="findOplog"
              @current-change="findOplog"/>
          </div>
        </div>
      </ody-list-table-area>
    </section>
  </div>
</template>

<script>
import util from '@/utils/util'
export default {
  name: 'OuserOplog',
  data() {
    return {
      pickerOptions: {},
      listTable: {
        list: [],
        columns: [{
          'show': true,
          'prop': 'pool',
          'label': 'pool',
          'align': 'center',
          'minWidth': 20
        }, {
          'show': true,
          'prop': 'model',
          'label': '模块',
          'align': 'center',
          'minWidth': 50
        }, {
          'show': true,
          'prop': 'opObject',
          'label': '操作对象',
          'align': 'center',
          'minWidth': 50
        }, {
          'show': true,
          'prop': 'opType',
          'label': '操作类型',
          'align': 'center',
          'minWidth': 35
        }, {
          'show': true,
          'prop': 'opObjectId',
          'label': '操作对象主键',
          'align': 'center',
          'minWidth': 45
        }, {
          'show': true,
          'prop': 'opDesc',
          'label': '操作内容',
          'align': 'center',
          'minWidth': 25,
          render: function(h, params) {
            return (
              <el-popover
                placement='top-start'
                width='auto'
                trigger='hover'
                content={params.row.opDesc}>
                <el-button slot='reference'>详情</el-button>
              </el-popover>
            )
          }
        }, {
          'show': true,
          'prop': 'createUsername',
          'label': '操作人',
          'align': 'center',
          'minWidth': 35
        }, {
          'show': true,
          'prop': 'opTimeStr',
          'label': '操作时间',
          'align': 'center',
          'minWidth': 60
        }],
        operates: {},
        total: 0
      },
      searchForm: {
        currentPage: 1,
        itemsPerPage: 10
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.findOplog()
    },
    initForm() {
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
    },
    findOplog() {
      const oplogService = this.$ouser.$api.oplogService
      const self = this
      oplogService.findOplogPage(this.searchForm).then(res => {
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
        util.formatDate(self.listTable.list, 'opTime')
      })
    }
  }
}
</script>

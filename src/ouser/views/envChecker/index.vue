<template>
  <div>
    <ody-list-search-area>
      <div slot="btn">
        <span style="color: red">{{ $t('使用本页面功能需要保证服务器可以直接通过域名访问系统') }}</span>
      </div>
    </ody-list-search-area>
    <ody-list-search-area>
      <div slot="btn">
        <el-button name="queryAll" size="small" type="success" @click="queryAll">{{ $t('检测所有') }}</el-button>
        <el-button name="queryDomain" size="small" type="primary" plain @click="queryDomain">{{ $t('检测域名') }}</el-button>
        <el-button name="queryDbVariate" size="small" type="primary" @click="queryDbVariate">{{ $t('检测数据库变量') }}</el-button>
        <el-button name="queryTime" size="small" type="primary" plain @click="queryTime">{{ $t('检测数据库和服务时间') }}</el-button>
        <el-button name="queryHealth" size="small" type="primary" @click="queryHealth">{{ $t('检测health') }}</el-button>
        <el-button name="queryXxlJob" size="small" type="primary" plain @click="queryXxlJob">{{ $t('检测xxljob') }}</el-button>
        <el-button name="queryRedis" size="small" type="primary" @click="queryRedis">{{ $t('检测redis') }}</el-button>
        <el-button name="queryMq" size="small" type="primary" plain @click="queryMq">{{ $t('检测mq') }}</el-button>
        <el-button name="queryMongodb" size="small" type="primary" @click="queryMongodb">{{ $t('检测mongodb') }}</el-button>
        <el-button name="querySoa" size="small" type="primary" plain @click="querySoa">{{ $t('检测SOA') }}</el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="resultList"
          :columns="columns"
          :row-class-name="tableRowClassName"
          name="resultList877"
        />
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      columns: [
        {
          label: '检测项',
          prop: 'checkItem',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: '状态',
          prop: 'statusStr',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('检测时间'),
          prop: 'checkTimeStr',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('备注'),
          prop: 'extInfo',
          show: true,
          align: 'center',
          minWidth: 200
        }
      ],
      resultList: []
    }
  },
  methods: {
    tableRowClassName(obj) {
      if (obj.row.status === 0) {
        return 'warning-row'
      } else if (obj.row.status === 1) {
        return 'success-row'
      }
      return ''
    },
    queryAll() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryAll().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    queryDomain() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryDomain().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    queryDbVariate() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryDbVariate().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    queryTime() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryTime().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    queryHealth() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryHealth().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    queryXxlJob() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryXxlJob().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    queryRedis() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryRedis().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    queryMq() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryMq().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    queryMongodb() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.queryMongodb().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    },
    querySoa() {
      this.resultList = []
      this.loading = true
      this.$ouser.$api.envCheckerService.querySoa().then(res => {
        this.resultList = res.data
      }).finally(res => {
        this.loading = false
      })
    }

  }
}
</script>
<style>
  .warning-row /deep/ td {
    background: #ff5741;
  }

  .success-row /deep/ td {
    background: #10ec57;
  }
</style>

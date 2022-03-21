<template>
  <div>
    <el-button name="visible" size="small" @click="visible = true">{{ $t('查看任务') }}</el-button>
    <ody-dialog
      :visible.sync="visible"
      :title="$t('文件任务列表')"
      width="960px"
      @opened="handleOpen">
      <ody-table
        ref="table"
        :data="querySendCouponTaskList"
        :page-size="1"
        :columns="table.columns"
        :operates="table.operates"
        name="querySendCouponTaskList654"
      >
        <template
          slot="sendCouponStatus"
          slot-scope="scope"
        >{{ scope.row.sendCouponStatus | keyVal(getSendCouponStatusMap) }}</template>
      </ody-table>
      <ody-pagination
        :current-page.sync="searchValue.currentPage"
        :list="querySendCouponTaskList"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="searchValue.itemsPerPage"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <span slot="footer">
        <div class="line-top" />
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取 消') }}</el-button>
        <el-button
          name="handleSubmit"
          size="small"
          type="primary"
          @click="handleSubmit"
        >{{ $t('确 定') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import constants from '@/utils/constants'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      total: 0,
      querySendCouponTaskList: [],
      checked: null,
      visible: false,
      options: [
        {
          label: this.$t('启用'),
          value: '1'
        },
        {
          label: this.$t('停用'),
          value: '2'
        }
      ],
      searchValue: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {}
      },
      table: {
        columns: [
          {
            label: this.$t('任务编号'),
            prop: 'id',
            align: 'center',
            minWidth: 160, show: true
          },
          {
            label: this.$t('任务类型'),
            prop: 'type',
            align: 'center',
            minWidth: 160, show: true,
            formatter: (row, column) => {
              if (row.type === 2) {
                return `<span>${'优惠券'}</span>`
              }
            }
          },
          {
            label: this.$t('操作'),
            prop: 'type',
            align: 'center',
            minWidth: 80, show: true,
            formatter: (row, column) => {
              if (row.type === 2) {
                return `<span>${'发券'}</span>`
              }
            }
          },
          {
            label: this.$t('任务状态'),
            slot: 'sendCouponStatus',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('任务开始时间'),
            prop: 'createTime',
            align: 'center',
            minWidth: 180, show: true,
            formatter: (row, column) => {
              if (row.createTime) {
                return this.$portal.parseTime(row.createTime)
              }
            }
          },
          {
            label: this.$t('任务结束时间'),
            prop: 'finishTime',
            align: 'center',
            minWidth: 180, show: true,
            formatter: (row, column) => {
              if (row.finishTime) {
                return this.$portal.parseTime(row.finishTime)
              }
            }
          },
          {
            label: this.$t('总记录数'),
            prop: 'totalRecord',
            align: 'center',
            minWidth: 160, show: true
          },
          {
            label: this.$t('成功记录数'),
            prop: 'successRecord',
            align: 'center',
            minWidth: 160, show: true
          },
          {
            label: this.$t('失败记录数'),
            prop: 'failRecord',
            align: 'center',
            minWidth: 160, show: true
          }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('下载结果'),
              method: (index, row) => {
                this.deleteRole(row)
              },
              code: 'ui'
            }
          ]
        }
      }
    }
  },
  computed: {
    getSendCouponStatusMap() {
      return constants.sendCouponStatusList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    async handleOpen() {
      await this.query()
    },
    handleSizeChange(val) {
      this.searchValue.itemsPerPage = val
      this.query()
    },
    handleCurrentChange(val) {
      this.searchValue.currentPage = val
      this.query()
    },
    handleClose() {
      this.visible = false
    },
    handleSubmit(val) {
      this.checked = val
      this.visible = false
    },
    deleteRole(e) {
      this.$portal.downloadFileByGet(
        '/api/back-promotion-web/couponActivityRead/exportSendCouponTask.do',
        {
          couponGenerateBatchId: e.id
        }
      )
    },
    async query() {
      const params = {
        currentPage: this.searchValue.currentPage,
        itemsPerPage: this.searchValue.itemsPerPage,
        obj: this.searchValue.obj
      }

      await this.$promotion.$api.promotion
        .querySendCouponTaskList(params, {})
        .then(res => {
          if (res.code === '0' && res.data && res.data.listObj) {
            this.querySendCouponTaskList = res.data.listObj
            this.total = res.data.total
          }
        })
    }
  }
}
</script>

<template>
  <ody-dialog
    :title="$t('查看')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="960px">
    <el-form ref="form" :model="comment" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('提问时间')">
            {{ comment.consultTime | parseTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品编码')">
            {{ comment.code }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('提问人账号')">
            {{ comment.userTelephone }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品类目')">
            {{ comment.categoryName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('显示状态')">
            {{ comment.showStatusStr }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品名称')">
            {{ comment.chineseName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('回答状态')">
            {{ comment.answerStatusStr }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('来源渠道')">
            {{ comment.channelName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('提问内容')">
        {{ comment.content }}
      </el-form-item>
    </el-form>
    &nbsp;&nbsp;&nbsp;<span>{{ $t('回答内容') }}</span>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :operates="operates"
          :loading="loading"
          :can-filter="false"
          name="data300"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />

      </div>
    </ody-list-table-area>
    <span slot="footer">
      <el-button name="handleBack" size="small" type="primary" @click="handleBack">{{ $t('关闭') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const self = this
    return {
      data: [],
      columns: [
        {
          show: true,
          prop: 'answerUsername',
          label: this.$t('回答人账号'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'content',
          label: this.$t('回答内容'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'answerTimeStr',
          label: this.$t('回复时间'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'showStatusStr',
          label: this.$t('显示状态'),
          align: 'center',
          minWidth: 120
        }
      ],
      operates: {
        width: 300,
        align: 'center',
        list: [
          {
            label: this.$t('显示'),
            disabled: false,
            hidden(index, row) {
              return row.showStatus === 1
            },
            method(index, row) {
              self.handleChangeShowStatus(row, 1)
            }
          },
          {
            label: this.$t('屏蔽'),
            disabled: false,
            hidden(index, row) {
              return row.showStatus === 0
            },
            method(index, row) {
              self.handleChangeShowStatus(row, 0)
            }
          }
        ]
      },
      loading: false,
      form: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  watch: {
    visible: {
      handler() {
        if (this.visible) {
          this.handleQuery()
        }
      }
    }
  },
  mounted() {
    this.socialApi = this.$social.$api.socialApi
    this.init()
  },
  methods: {
    handleBack() {
      this.form.replyContent = ''
      this.page = {
        size: 10,
        current: 1,
        total: 0
      }
      this.data = []
      this.$emit('update:visible', !this.visible)
    },
    handleChangeShowStatus(value, showStatus) {
      const message = showStatus === 1 ? this.$t('您确定要显示吗') : this.$t('您确定要屏蔽吗')
      this.$confirm(message, this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const param = {
          parentConsultItemId: this.comment.parentConsultItemId,
          parentConsultHeadId: this.comment.parentConsultHeadId,
          showStatus: showStatus,
          consultItemId: value.consultItemId
        }
        this.socialApi.updateConsultStatus(param).then(res => {
          this.handleQuery()
        })
      })
    },
    init() {
      this.handleQuery()
    },
    handleQuery() {
      if (this.comment && this.comment.consultItemId) {
        const param = {
          consultItemId: this.comment.consultItemId,
          currentPage: this.page.current,
          itemsPerPage: this.page.size,
          showButton: false
        }
        this.loading = true
        try {
          this.socialApi.getConsultAnswerList(param).then(res => {
            if (res.code === '0' && res.data) {
              this.data = res.data.listObj
              if (this.data.length > 0) {
                this.consultAnswerList = this.data
                const lastData = this.consultAnswerList[this.consultAnswerList.length - 1]
                this.comment.answerTime = lastData.answerTime
                this.comment.answerUsername = lastData.answerUsername
                this.comment.userTelephone = lastData.userTelephone
                this.data.forEach(item => {
                  item.answerTimeStr = this.$portal.parseTime(item.answerTime, '{y}-{m}-{d} {h}:{i}:{s}')
                  item.showStatusStr = item.showStatus === 1 ? this.$t('显示') : this.$t('已屏蔽')
                })
              }
            } else {
              this.data = []
            }
            this.page.total = res.data.total
          })
        } finally {
          this.loading = false
        }
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.handleQuery()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.handleQuery()
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <ody-dialog
    :title="$t('咨询回复')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="960px"
    @open="init">
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :can-filter="false"
          name="data452" >
          <template slot="createTime" slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
        </ody-table>
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
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="form" >
      <el-form-item :label="$t('回复咨询')" prop="content">
        <el-input v-model="form.content" :autosize="{ minRows: 4, maxRows: 6}" name="form_content" maxlength="200" show-word-limit type="textarea" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button name="handleSave" size="small" type="primary" @click="handleSave">{{ $t('确定') }}</el-button>
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
    return {
      data: [],
      columns: [
        {
          show: true,
          prop: 'answerUsername',
          label: this.$t('回复人'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'content',
          label: this.$t('内容'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'answerTimeStr',
          label: this.$t('回复时间'),
          align: 'center',
          minWidth: 120
        }
      ],
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
  mounted() {
    this.socialApi = this.$social.$api.socialApi
    this.init()
  },
  methods: {
    init() {
      this.query()
    },
    query() {
      if (this.comment && this.comment.consultItemId) {
        const param = {
          consultItemId: this.comment.consultItemId,
          currentPage: this.page.current,
          itemsPerPage: this.page.size
        }
        this.loading = true
        try {
          this.socialApi.getConsultAnswerList(param).then(res => {
            if (res.code === '0' && res.data) {
              this.data = res.data.listObj
              this.data.forEach(item => {
                item.answerTimeStr = this.$portal.parseTime(item.answerTime, '{y}-{m}-{d} {h}:{i}:{s}')
              })
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
        await this.query()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.query()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleBack() {
      this.form.replyContent = ''
      this.page = {
        size: 10,
        current: 1,
        total: 0
      }
      this.$emit('update:visible', !this.visible)
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const param = {
            consultHeaderId: this.comment.headId,
            content: this.form.content,
            consultItemId: this.comment.consultItemId
          }
          this.socialApi.answerTheConsult(param).then(res => {
            this.$message.success(this.$t('保存成功'))
            this.form.content = ''
            this.page = {
              size: 10,
              current: 1,
              total: 0
            }
            this.$emit('update:visible', !this.visible)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

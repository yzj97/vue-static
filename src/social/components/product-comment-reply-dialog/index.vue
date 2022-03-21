<template>
  <ody-dialog
    :title="$t('回复内容')"
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
          name="data230" >
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
    <el-form v-if="data.length<=0 && !loading" ref="form" :model="form" :rules="rules" label-width="100px" class="form" >
      <el-form-item :label="$t('回复')" prop="replyContent">
        <el-input v-model="form.replyContent" :autosize="{ minRows: 4, maxRows: 6}" name="form_replyContent" maxlength="600" show-word-limit type="textarea" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('返回') }}</el-button>
      <el-button name="handleSave" size="small" type="primary" @click="handleSave">{{ $t('确定') }}</el-button>
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
          prop: 'createUserName',
          label: this.$t('回复人'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'replyContent',
          label: this.$t('内容'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'createTime',
          label: this.$t('回复时间'),
          align: 'center',
          minWidth: 120
        }
      ],
      loading: false,
      form: {
        replyContent: ''
      },
      rules: {
        replyContent: [
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
    this.init()
  },
  methods: {
    init() {
      this.query()
    },
    query() {
      const vue = this
      if (vue.comment && vue.comment.id) {
        const param = {
          pageNo: vue.page.current,
          pageSize: vue.page.size,
          commentId: vue.comment.id
        }
        vue.loading = true

        try {
          vue.$social.$api.socialApi.listProductCommentReplyPage(param).then(res => {
            if (res.data && res.data.listObj) {
              vue.data = res.data.listObj
            } else {
              vue.data = []
            }
            vue.page.total = res.data.total
          })
        } finally {
          vue.loading = false
        }
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleBack() {
      this.form.replyContent = ''
      this.$emit('update:visible', !this.visible)
    },
    handleSave() {
      if (this.data.length > 0 || this.loading) {
        this.handleBack()
        return
      }
      const vue = this
      vue.$refs['form'].validate(valid => {
        if (valid) {
          vue.$social.$api.socialApi.replyProductComment({ commentId: vue.comment.id, replyContent: vue.form.replyContent }).then(res => {
            vue.$message.success(vue.$t('保存成功'))
            vue.form.replyContent = ''
            vue.$emit('update:visible', !vue.visible)
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

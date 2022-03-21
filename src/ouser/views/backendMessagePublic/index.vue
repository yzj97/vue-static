<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="60px" class="form">
            <ody-search-item :label="$t('公告类型:')" style="margin-top: 10px;" prop="type">
              <el-select
                v-model="searchForm.type"
                :placeholder="$t('全部')"
                name="searchForm_type"
                @change="parentTypeChange"
              >
                <el-option
                  v-for="item in messageTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('公告状态:')" style="margin-top: 10px;" prop="status">
              <el-select v-model="searchForm.status" :placeholder="$t('全部')" name="searchForm_status">
                <el-option
                  v-for="item in messageStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button
            name="OuserBackendMessagePublicList_handleQuery"
            code="OuserBackendMessagePublicList"
            size="small"
            type="primary"
            @click="handleQuery"
          >{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button
            name="OuserBackendMessagePublicAdd_initAdd"
            code="OuserBackendMessagePublicAdd"
            size="small"
            type="primary"
            @click="initAdd"
          >{{ $t('新增') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list793"
          />
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
              @size-change="query"
              @current-change="query"
            />
          </div>
        </div>
      </ody-list-table-area>
    </section>

    <!--发布公告-->
    <ody-dialog
      v-if="addDialog.show"
      :visible.sync="addDialog.show"
      :title="addDialog.title"
      :before-close="cancel"
      width="960px"
    >
      <el-form
        ref="form"
        :rules="addDialog.rules"
        :model="addDialog.obj"
        label-position="right"
        label-width="80px"
      >
        <el-form-item :label="$t('公告类型')" prop="type">
          <el-select
            v-model="addDialog.obj.type"
            :placeholder="$t('请选择')"
            name="addDialog_obj_type"
            @change="parentTypeChange"
          >
            <el-option
              v-for="item in messageTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('公告标题')" prop="title">
          <el-input
            v-model="addDialog.obj.title"
            name="addDialog_obj_title"
            style="width: 300px; display: inline-block; float: left;"
            maxlength="20"
            type="text"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('公告内容')" prop="content">
          <ody-tinymce :height="300" v-model="addDialog.obj.content" name="addDialog_obj_content" />
        </el-form-item>
      </el-form>
      <el-row style="text-align: center">
        <ody-button
          name="OuserBackendMessagePublicSave_commit"
          type="primary"
          code="OuserBackendMessagePublicSave"
          @click="commit"
        >{{ $t('保存') }}</ody-button>
        <el-button name="cancel" type="primary" @click="cancel">{{ $t('取消') }}</el-button>
      </el-row>
    </ody-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'OuserBackendMessagePublic',
  data() {
    const self = this
    return {
      loading: false,
      addDialog: {
        show: false,
        title: '',
        obj: { type: null, title: null, content: null },
        rules: {
          type: [
            {
              required: true,
              message: self.$t('请选择类型'),
              trigger: 'change'
            }
          ],
          title: [
            {
              required: true,
              message: self.$t('请输入标题'),
              trigger: 'change'
            },
            {
              min: 1,
              max: 20,
              message:
                self.$t('长度在') +
                ' 1 ' +
                self.$t('到') +
                ' 20 ' +
                self.$t('个字符'),
              trigger: 'change'
            }
          ],
          content: [
            {
              required: true,
              message: self.$t('请输入公告内容'),
              trigger: 'change'
            }
          ]
        }
      },
      searchForm: { currentPage: 1, itemsPerPage: 10 },
      listTable: {
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'title',
            label: self.$t('公告标题'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            prop: 'typeStr',
            label: self.$t('公告类型'),
            align: 'center',
            minWidth: 88
          },
          {
            show: true,
            prop: 'publicTimeStr',
            label: self.$t('发布时间'),
            align: 'center',
            minWidth: 200
          }
        ],
        operates: {
          width: 200,
          fixed: 'right',
          list: [
            {
              label: self.$t('发布'),
              show: false,
              hidden: (index, row) => {
                if (row.status === 1) {
                  return true
                } else {
                  return false
                }
              },
              disabled: false,
              method(index, row) {
                self.handleModifyMessageStatus(row, 1)
              },
              code: 'OuserBackendMessagePublicModify'
            },
            {
              label: self.$t('编辑'),
              show: false,
              hidden: (index, row) => {
                if (row.status === 1) {
                  return true
                } else {
                  return false
                }
              },
              disabled: false,
              method(index, row) {
                self.initEdit(row)
              },
              code: 'OuserBackendMessagePublicEdit'
            },
            {
              label: self.$t('撤回'),
              show: true,
              hidden: (index, row) => {
                if (row.status === 1) {
                  return false
                } else {
                  return true
                }
              },
              disabled: false,
              method(index, row) {
                self.handleModifyMessageStatus(row, 0)
              },
              code: 'OuserBackendMessagePublicRecall'
            },
            {
              label: self.$t('删除'),
              show: true,
              hidden: (index, row) => {
                if (row.status === 1) {
                  return true
                } else {
                  return false
                }
              },
              disabled: false,
              method(index, row) {
                self.delete(row)
              },
              code: 'OuserBackendMessagePublicDelete'
            }
          ]
        }
      },
      messageStatusOptions: [
        {
          value: '0',
          label: self.$t('未发布')
        },
        {
          value: '1',
          label: self.$t('已发布')
        }
      ]
    }
  },
  async mounted() {
    this.loading = true
    await this.init()
    this.loading = false
  },
  methods: {
    async handleQuery() {
      this.searchForm.currentPage = 1
      await this.query()
    },
    async init() {
      // 1、初始化站内信类型列表
      const self = this
      const oscService = this.$ouser.$api.oscService
      await oscService
        .pageGet({ key: 'MESSAGE_TYPE_OPTIONS', pool: 'ouser' })
        .then(res => {
          self.messageTypeOptions = JSON.parse(res.data.value)
        })
      await this.query()
    },
    async query() {
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService
      // 设置时间区间
      // 2、获取站内信列表
      try {
        this.loading = true
        const res = await backendMessageService.getMessageList(this.searchForm)

        // 初始化类型
        util.formatDate(res.data.listObj, 'publicTime')
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
        self.listTable.list.forEach(one => {
          one.typeStr = util.getOnePropByKeyFromArr(
            self.messageTypeOptions,
            one.type.toString(),
            'value',
            'label'
          )
          one.type = one.type.toString()
        })
      } finally {
        this.loading = false
      }
    },
    initAdd() {
      this.addDialog.obj = { type: null, title: null, content: null }
      this.addDialog.show = true
      this.addDialog.title = this.$t('新增')
    },
    initEdit(row) {
      this.addDialog.obj = row
      this.addDialog.show = true
      this.addDialog.title = this.$t('编辑')
    },
    handleModifyMessageStatus(row, status) {
      // 修改公告状态
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService
      row.status = status
      backendMessageService.modifyMessageStatus(row).then(res => {
        self.$message({
          message: self.$t('信息更新成功'),
          type: 'success'
        })
        self.query()
      })
    },
    cancel() {
      this.$refs['form'].resetFields()
      this.addDialog.show = false
      this.addDialog.title = ''
      this.addDialog.obj = { type: null, title: null, content: null }
    },
    commit() {
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.addDialog.obj.id) {
            backendMessageService
              .editBackendMessage(this.addDialog.obj)
              .then(res => {
                self.$message({
                  message: self.$t('修改成功'),
                  type: 'success'
                })
                self.query()
                self.cancel()
              })
          } else {
            this.addDialog.obj.isTop = 0
            this.addDialog.obj.syncMobileMessage = 0
            backendMessageService
              .insertBackendMessage(this.addDialog.obj)
              .then(res => {
                self.$message({
                  message: self.$t('新增成功'),
                  type: 'success'
                })
                self.query()
                self.cancel()
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    initForm() {
      this.searchForm = { currentPage: 1, itemsPerPage: 10 }
    },
    delete(row) {
      const self = this
      this.$ouser.$api.backendMessageService
        .deleteMessage({ id: row.id })
        .then(res => {
          self.$message({
            message: self.$t('删除成功'),
            type: 'success'
          })
          self.query()
        })
    }
  }
}
</script>

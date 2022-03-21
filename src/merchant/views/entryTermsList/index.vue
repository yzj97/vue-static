<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('条款类型') + ':'" prop="filters.entryType">
              <el-select v-model="searchForm.filters.entryType" :placeholder="$t('全部')" name="searchForm_filters_entryType">
                <el-option
                  v-for="entry in entryTermsType"
                  :key="entry.code"
                  :label="entry.name"
                  :value="entry.code"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('状态') + ':'" prop="filters.status">
              <el-select v-model="searchForm.filters.status" :placeholder="$t('全部')" name="searchForm_filters_status">
                <el-option
                  v-for="i in isAvailable"
                  :key="i.value"
                  :label="$t(i.label)"
                  :value="i.value"
                />
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button
            name="MerchantEntryTermsListOperList_search"
            code="MerchantEntryTermsListOperList"
            size="small"
            type="primary"
            @click="search"
          >{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button
            name="MerchantEntryTermsListOperAdd_initEditDialog"
            code="MerchantEntryTermsListOperAdd"
            size="mini"
            type="primary"
            @click="initEditDialog({})"
          >{{ $t('新增条款') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list374"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.page"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.limit"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePaginationSizeChange"
            @current-change="handlePaginationCurrentChange"
          />
        </div>
      </ody-list-table-area>
    </section>
    <ody-dialog
      v-if="editObj.show"
      :visible.sync="editObj.show"
      :before-close="cancel"
      :title="editObj.title"
      width="960px"
    >
      <el-form
        ref="entry"
        :label-position="left"
        :rules="rules"
        :model="editObj.obj"
        :disabled="editObj.edit === false"
        label-width="100px"
      >
        <el-form-item :label="$t('条款类型')" prop="entryType">
          <el-select
            v-model="editObj.obj.entryType"
            :disabled="editObj.obj.id"
            :placeholder="$t('请选择')"
            name="editObj_obj_entryType"
          >
            <el-option
              v-for="entry in entryTermsType"
              :key="entry.code"
              :label="entry.name"
              :value="entry.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('条款标题')" prop="title">
          <el-input
            v-model="editObj.obj.title"
            :placeholder="$t('请输入条款标题')"
            name="editObj_obj_title"
            type="text"
            show-word-limit
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="$t('条款编码')" prop="entryCode">
          <el-input
            v-model="editObj.obj.entryCode"
            :placeholder="$t('请输入条款编码（仅支持数字、字母）')"
            name="editObj_obj_entryCode"
            type="text"
            show-word-limit
            maxlength="20"
          />
        </el-form-item>
        <el-form-item v-if="editObj.obj.entryType !== '12'" :label="$t('条款内容')" prop="content">
          <ody-tinymce :height="300" v-model="editObj.obj.content" name="editObj_obj_content" style="float: left;" />
        </el-form-item>
        <el-form-item v-if="editObj.obj.entryType === '12'" :label="$t('条款内容')" prop="content">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="editObj.obj.content" type="textarea" name="editObj_obj_content" maxlength="150" show-word-limit/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancel" @click="cancel">{{ $t('取消') }}</el-button>
        <ody-button
          name="MerchantEntryTermsListOperSave_commit"
          type="primary"
          code="MerchantEntryTermsListOperSave"
          @click="commit"
        >{{ $t('保存') }}</ody-button>
      </div>
    </ody-dialog>
  </div>
</template>
<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'MerchantEntryTermsList',
  data() {
    const self = this
    return {
      loading: false,
      rules: {
        entryType: [
          {
            required: true,
            message: self.$t('请选择条款类型'),
            trigger: 'change'
          }
        ],
        title: [
          {
            required: true,
            message: self.$t('请输入条款标题'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 20,
            message: self.$t('长度在_到_个字符', { min: 5, max: 20 }),
            trigger: 'change'
          }
        ],
        entryCode: [
          {
            required: true,
            message: self.$t('请输入条款编码'),
            trigger: 'change'
          },
          {
            pattern: /^[0-9a-zA-Z]*$/,
            message: self.$t('仅支持数字、字母'),
            trigger: 'change'
          },
          {
            min: 1,
            max: 20,
            message: self.$t('长度在_到_个字符', { min: 1, max: 20 }),
            trigger: 'change'
          }
        ],
        content: [
          {
            required: true,
            message: self.$t('请输入条款内容'),
            trigger: 'change'
          }
        ]
      },
      // 搜索框对象
      searchForm: {
        page: 1,
        limit: 10,
        filters: {}
      },
      entryTermsType: [],
      isAvailable: [],
      editObj: {
        show: false,
        obj: {}
      },
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'entryCode',
            label: self.$t('条款编码'),
            align: 'center'
          },
          {
            show: true,
            prop: 'title',
            label: self.$t('条款标题'),
            align: 'center'
          },
          {
            show: true,
            prop: 'entryTypeStr',
            label: self.$t('条款类型'),
            align: 'center'
          },
          {
            show: true,
            prop: 'createTimeStr',
            label: self.$t('创建时间'),
            align: 'center'
          },
          {
            show: true,
            prop: 'statusStr',
            label: self.$t('Enabledstate'),
            align: 'center',
            render: function(h, params) {
              const enable = self.$t('启用')
              const changeStatus = self.changeStatus
              return (
                <div on-click={e => changeStatus(params.row)}>
                  <el-switch
                    value={params.row.status}
                    active-text={enable}
                  ></el-switch>
                </div>
              )
            }
          }
        ],
        operates: {
          width: 250,
          fixed: 'right',
          list: [
            {
              label: self.$t('编辑'),
              code: 'MerchantEntryTermsListOperEdit',
              show: true,
              disabled: false,
              method(index, row) {
                self.initEditDialog(row)
              }
            },
            {
              label: self.$t('删除'),
              code: 'MerchantEntryTermsListOperDelete',
              show: true,
              disabled: false,
              method(index, row) {
                self.delete(row)
              },
              hidden(index, row) {
                return row.status
              }
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    initCode() {
      const vue = this
      vue.$merchant.$api.commonService
        .listMultiCode({ categories: ['ENTRY_TERMS_TYPE'] })
        .then(res => {
          vue.entryTermsType = res.data.ENTRY_TERMS_TYPE
        })
    },
    async init() {
      this.initCode()
      this.initEditObj()
      this.isAvailable = constants.isAvailable
      try {
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    changeStatus(row) {
      const self = this
      const entryTermsService = this.$merchant.$api.entryTermsService
      const message = !row.status ? self.$t('若启用本条款，原已启用状态的相同条款类型则停用，确定启用该条款吗？') : self.$t('确定停用该条款吗？')
      util.confirm(
        this,
        message,
        function() {
          row.status = !row.status
          entryTermsService
            .update({
              entryType: row.entryType,
              id: row.id,
              status: row.status ? 1 : 0
            })
            .then(res => {
              self.$message({
                message: self.$t('操作成功'),
                type: 'success'
              })
              self.init()
            })
        }
      )
    },
    async search() {
      this.searchForm.page = 1
      await this.query()
    },
    handlePaginationSizeChange() {
      this.searchForm.page = 1
      this.query()
    },
    handlePaginationCurrentChange() {
      this.query()
    },
    async query() {
      const self = this
      const entryTermsService = this.$merchant.$api.entryTermsService
      try {
        this.loading = true
        const res = await entryTermsService.listPage(this.searchForm)
        self.listTable.list = res.data
        self.listTable.total = res.total
        self.listTable.list.forEach(one => {
          one.status = one.status === 1
        })
        util.formatDate(self.listTable.list, 'createTime')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    cancel() {
      this.$refs['entry'].resetFields()
      this.initEditObj()
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        page: 1,
        limit: 10,
        filters: {}
      }
    },
    initEditObj() {
      this.editObj = {
        show: false,
        obj: {}
      }
    },
    initEditDialog(obj) {
      this.initEditObj()
      this.editObj.obj = util.copy(obj)
      this.editObj.show = true
      this.editObj.obj.status = this.editObj.obj.status === true ? '1' : '0'
      if (this.editObj.obj.id) {
        this.editObj.title = this.$t('编辑条款')
      } else {
        this.editObj.title = this.$t('新增条款')
      }
    },
    commit() {
      const self = this
      this.$refs['entry'].validate(valid => {
        if (valid) {
          const entryTermsService = self.$merchant.$api.entryTermsService

          if (self.editObj.obj.id) {
            entryTermsService.update(self.editObj.obj).then(res => {
              self.$message({
                message: self.$t('操作成功'),
                type: 'success'
              })
              self.$refs['entry'].resetFields()
              self.init()
            })
          } else {
            entryTermsService.add(self.editObj.obj).then(res => {
              self.$message({
                message: self.$t('操作成功'),
                type: 'success'
              })
              self.$refs['entry'].resetFields()
              self.init()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delete(row) {
      const self = this
      const entryTermsService = this.$merchant.$api.entryTermsService
      util.confirm(
        this,
        self.$t('此操作将删除该条款，且不可恢复，要继续吗？'),
        function() {
          entryTermsService.delete([row.id]).then(res => {
            self.$message({
              type: 'success',
              message: self.$t('操作成功')
            })
            self.init()
          })
        }
      )
    }
  }
}
</script>

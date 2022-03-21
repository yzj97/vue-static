<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('标签名称') + ':'" prop="name">
              <el-input
                id="searchFlagName"
                v-model="searchForm.name"
                :placeholder="$t('请输入标签名称')"
                name="searchForm_name"
              />
            </ody-search-item>
            <ody-search-item :label="$t('创建时间:')" :space="2" class="register" prop="createDateBegin">
              <!-- <el-col :span="10">
                <el-date-picker
                  v-model="searchForm.createDateBegin"
                  :placeholder="$t('选择日期')"
                  name="searchForm_createDateBegin"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
              </el-col>
              <el-col :span="1">{{ $t('至') }}</el-col>
              <el-col :span="10">
                <el-date-picker
                  v-model="searchForm.createDateEnd"
                  :placeholder="$t('选择日期')"
                  name="searchForm_createDateEnd"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
              </el-col>-->
              <ody-date-range-picker
                v-model="createTime"
                :start-placeholder="$t('startDate')"
                :end-placeholder="$t('endDate')"
                name="searchForm_createTime"
                value-format="yyyy-MM-dd"
                type="datetimer"
                range-separator="-"
              />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button
            id="searchFlag"
            name="MerchantMerchantFlagListOperList_search"
            code="MerchantMerchantFlagListOperList"
            size="small"
            type="primary"
            @click="search"
          >{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button
            id="merchantFlagAdd"
            name="MerchantMerchantFlagListOperAdd_initEditDialog"
            code="MerchantMerchantFlagListOperAdd"
            size="mini"
            type="primary"
            @click="initEditDialog({})"
          >{{ $t('新增店铺标签') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list967"
          >
            <template slot="url" slot-scope="scope">
              <el-image v-if="scope.row.url" :src="scope.row.url" />
              <div v-else>{{ $t('(无)') }}</div>
            </template>
          </ody-table>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="search"
            @current-change="query"
          />
        </div>
      </ody-list-table-area>
    </section>
    <ody-dialog
      v-if="editObj.show"
      :visible.sync="editObj.show"
      :before-close="cancel"
      :title="editObj.title"
      width="600px"
    >
      <el-form
        ref="form"
        :label-position="left"
        :rules="rules"
        :model="editObj.obj"
        :disabled="editObj.edit === false"
        label-width="100px"
      >
        <el-form-item :label="$t('标签名称：')" prop="name">
          <el-input
            id="merchantFlagName"
            v-model="editObj.obj.name"
            :placeholder="$t('请输入标签名称')"
            name="editObj_obj_name"
            type="text"
            show-word-limit
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="$t('图片：')">
          <ody-upload-image
            v-model="editObj.obj.url"
            :pic-type="['jpg','png']"
            :pic-size="4096"
            :show-tip="true"
            name="editObj_obj_url"
          />
        </el-form-item>
        <el-form-item :label="$t('描述：')" prop="description">
          <el-input
            id="merchantFlagDescription"
            v-model="editObj.obj.description"
            :placeholder="$t('请输入描述')"
            name="editObj_obj_description"
            type="textarea"
            show-word-limit
            maxlength="100"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancel" @click="cancel">{{ $t('取消') }}</el-button>
        <el-button id="merchantFlagSave" name="commit" type="primary" @click="commit">{{ $t('保存') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>
<script>
import util from '@/utils/util'

export default {
  name: 'MerchantMerchantFlagList',
  data() {
    const self = this
    return {
      loading: false,
      rules: {
        name: [
          {
            required: true,
            message: this.$t('请输入标签名称'),
            trigger: 'change'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'change'
          }
        ],
        description: [
          {
            min: 0,
            max: 100,
            message: '长度在 0 到 100 个字符',
            trigger: 'change'
          }
        ]
      },
      // 搜索框对象
      searchForm: {
        name: ''
      },
      createTime: [],
      entryTermsType: [],
      isAvailable: [],
      editObj: {
        show: false,
        obj: {
          name: ' ',
          url: ' ',
          description: ' '
        }
      },
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'name',
            label: this.$t('标签名称'),
            align: 'center'
          },
          {
            show: true,
            prop: 'description',
            label: this.$t('描述'),
            align: 'center'
          },
          {
            show: true,
            slot: 'url',
            label: this.$t('图片'),
            align: 'center'
          },
          {
            show: true,
            prop: 'createTimeStr',
            label: this.$t('创建时间'),
            align: 'center'
          }
        ],
        operates: {
          width: 250,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              code: 'MerchantMerchantFlagListOperEdit',
              show: true,
              disabled: false,
              method(index, row) {
                self.initEditDialog(row)
              }
            },
            {
              label: this.$t('删除'),
              code: 'MerchantMerchantFlagListOperDelete',
              show: true,
              disabled: false,
              method(index, row) {
                self.delete(row)
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
    async init() {
      this.initForm()
      this.initEditObj()
      try {
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    async search() {
      this.searchForm.currentPage = 1
      await this.query()
    },
    async query() {
      const self = this
      const merchantFlagService = this.$merchant.$api.merchantFlagService
      if (this.createTime && this.createTime.length) {
        this.searchForm.createDateBegin = this.createTime[0]
        this.searchForm.createDateEnd = this.createTime[1]
        this.searchForm.createDateBegin =
          this.searchForm.createDateBegin + ' 00:00:00'
        this.searchForm.createDateEnd =
          this.searchForm.createDateEnd + ' 23:59:59'
      } else {
        this.searchForm.createDateBegin = null
        this.searchForm.createDateEnd = null
      }
      try {
        this.loading = true
        const res = await merchantFlagService.findAllMerchantFlagList(
          this.searchForm
        )
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
        util.formatDate(self.listTable.list, 'createTime')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    cancel() {
      this.$refs['form'].resetFields()
      this.initEditObj()
    },
    // 初始化搜索对象
    initForm() {
      this.createTime = []
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
    },
    initEditObj() {
      this.editObj = { show: false, obj: {}}
    },
    initEditDialog(obj) {
      this.initEditObj()
      console.info(obj)
      this.editObj.obj = util.copy(obj)
      this.editObj.show = true
      if (this.editObj.obj.id) {
        this.editObj.title = this.$t('编辑店铺标签')
      } else {
        this.editObj.title = this.$t('新增店铺标签')
      }
    },
    commit() {
      const self = this
      const merchantFlagService = this.$merchant.$api.merchantFlagService
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.editObj.obj.id) {
            this.editObj.obj.url = this.editObj.obj.url || ''
            merchantFlagService
              .updateMerchantFlag(this.editObj.obj)
              .then(res => {
                self.$message({
                  message: this.$t('修改成功'),
                  type: 'success'
                })
                this.$refs['form'].resetFields()
                self.init()
              })
          } else {
            merchantFlagService.addMerchantFlag(this.editObj.obj).then(res => {
              self.$message({
                message: this.$t('添加成功'),
                type: 'success'
              })
              this.$refs['form'].resetFields()
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
      const merchantFlagService = this.$merchant.$api.merchantFlagService
      util.confirm(
        this,
        this.$t('此操作将删除该标签') + '，' + this.$t('且不可恢复') + '，' + this.$t('要继续吗') + '？',
        function() {
          merchantFlagService.deleteMerchantFlag({ id: row.id }).then(res => {
            self.$message({
              type: 'success',
              message: self.$t('操作成功!')
            })
            self.init()
          })
        }
      )
    }
  }
}
</script>

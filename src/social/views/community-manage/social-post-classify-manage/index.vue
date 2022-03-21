<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('分类名称：')" prop="classifyName">
              <el-input v-model="searchForm.classifyName" :placeholder="$t('请输入帖子分类名称')" name="searchForm_classifyName"/>
            </ody-search-item>
            <ody-search-item :label="$t('状态')" prop="isAvailable">
              <el-select v-model="searchForm.isAvailable" :placeholder="$t('全部')" name="searchForm_isAvailable">
                <el-option
                  v-for="item in isAvailableList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('创建时间:')" :space="2">
              <ody-date-range-picker
                ref="dateRangePicker"
                v-model="searchForm.createTime"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                name="searchForm_createTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimer"
              />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button id="searchClassify" name="post_classify_search" code="PostClassifyQuery" size="small" type="primary" @click="search">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button id="PostClassifyAdd" name="PostClassifyAdd" code="PostClassifyAdd" size="mini" type="primary" @click="initEditDialog({})">{{ $t('新增帖子分类') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable"/>
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
            @current-change="query"/>

        </div>
      </ody-list-table-area>
    </section>
    <ody-dialog :visible.sync="editObj.show" :before-close="cancel" :title="editObj.title">
      <el-form ref="form" :label-position="left" :rules="rules" :model="editObj.obj" label-width="120px">
        <el-form-item :label="$t('帖子分类名称：')" prop="classifyName">
          <el-input
            id="classifyName"
            v-model="editObj.obj.classifyName"
            :placeholder="$t('请输入帖子分类名称')"
            name="editObj_obj_classifyName"
            type="text"
            show-word-limit
            maxlength="10"/>
        </el-form-item>
        <el-form-item v-if="!editObj.obj.id" :label="$t('帖子分类状态：')" prop="isAvailable">
          <!-- <el-radio-group v-model="editObj.obj.isAvailable">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group> -->
          <el-radio v-model="editObj.obj.isAvailable" :label="1" name="form_isAvailable1">{{ $t('启用') }}</el-radio>
          <el-radio v-model="editObj.obj.isAvailable" :label="0" name="form_isAvailable0">{{ $t('停用') }}</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancel" @click="cancel">{{ $t('取消') }}</el-button>
        <ody-button id="PostClassifyAdd" name="PostClassifyAdd_commit" code="PostClassifyAdd" type="primary" @click="commit">{{ $t('保存') }}</ody-button>
      </div>
    </ody-dialog>
  </div>
</template>
<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'SocialPostClassifyManage',
  data() {
    const self = this
    return {
      loading: false,
      rules: {
        classifyName: [
          { required: true, message: this.$t('请输入帖子分类名称'), trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
        ]
      },
      // 搜索框对象
      searchForm: {},
      editObj: { show: false, obj: {}},
      createTime: [],
      isAvailableList: [
        {
          value: '1',
          label: this.$t('启用')
        },
        {
          value: '0',
          label: this.$t('停用')
        }
      ],
      releaseChannelCodeList: [
        {
          value: '1',
          label: this.$t('嗨享小程序')
        }
      ],
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'classifyName',
            'label': this.$t('分类名称'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'createUsername',
            'label': this.$t('创建人'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'createTimeStr',
            'label': this.$t('创建时间'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'updateTimeStr',
            'label': this.$t('更新时间'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'isAvailable',
            'label': this.$t('分类状态'),
            'align': 'center',
            formatter: (row, column) => {
              return row.isAvailable === 1 ? '启用' : '停用'
            }
          }
        ],
        operates: {
          'width': 200,
          'fixed': 'right',
          'list': [
            {
              'label': this.$t('编辑'),
              show: true,
              'disabled': false,
              method(index, row) {
                self.initEditDialog(row)
              },
              code: 'PostClassifyEdit'
            },
            {
              'label': this.$t('启用'),
              show: true,
              'disabled': false,
              method(index, row) {
                self.openClassify(row)
              },
              hidden: (index, row) => {
                return row.isAvailable === 1
              },
              code: 'PostClassifyOpen'
            },
            {
              'label': this.$t('停用'),
              show: true,
              'disabled': false,
              hidden: (index, row) => {
                return row.isAvailable === 0
              },
              method(index, row) {
                self.closeClassify(row)
              },
              code: 'PostClassifyClose'
            }
          ]
        }}

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initForm()
      this.initEditObj()
      // 常量赋值
      this.isAvailable = constants.isAvailable
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
      const postClassifyApi = this.$social.$api.postClassifyApi
      try {
        if (this.searchForm.createTime && this.searchForm.createTime.length > 0) {
          this.searchForm.startCreateTime = this.searchForm.createTime[0]
          this.searchForm.endCreateTime = this.searchForm.createTime[1]
        }
        const params = {
          filters: this.searchForm,
          page: this.searchForm.currentPage,
          limit: this.searchForm.itemsPerPage
        }
        this.loading = true
        const res = await postClassifyApi.listPage(params)
        self.listTable.list = res.data
        self.listTable.total = res.total
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
      this.editObj.obj = util.copy(obj)
      this.editObj.show = true
      if (this.editObj.obj.id) {
        this.editObj.title = this.$t('编辑帖子分类')
      } else {
        this.editObj.title = this.$t('新增帖子分类')
      }
    },
    commit() {
      const self = this
      const postClassifyApi = this.$social.$api.postClassifyApi
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.editObj.obj.id) {
            postClassifyApi.update(this.editObj.obj).then(res => {
              self.$message({
                message: this.$t('修改成功'),
                type: 'success'
              })
              this.$refs['form'].resetFields()
              self.init()
            })
          } else {
            postClassifyApi.add(this.editObj.obj).then(res => {
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
    openClassify(row) {
      const self = this
      const postClassifyApi = this.$social.$api.postClassifyApi
      postClassifyApi.enable({ id: row.id, isAvailable: 1 }).then(res => {
        self.$message({
          message: this.$t('启用成功'),
          type: 'success'
        })
        this.$refs['form'].resetFields()
        self.init()
      })
    },
    closeClassify(row) {
      const self = this
      const postClassifyApi = this.$social.$api.postClassifyApi
      postClassifyApi.enable({ id: row.id, isAvailable: 0 }).then(res => {
        self.$message({
          message: this.$t('停用成功'),
          type: 'success'
        })
        this.$refs['form'].resetFields()
        self.init()
      })
    }
  }
}
</script>

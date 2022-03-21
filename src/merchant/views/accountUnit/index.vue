<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('核算单位名称：')" prop="unitName">
              <el-input id="searchUnitName" v-model="searchForm.unitName" :placeholder="$t('请输入核算单位名称')" name="searchForm_unitName"/>
            </ody-search-item>
            <ody-search-item :label="$t('核算单位编码：')" prop="unitCode">
              <el-input id="searchUnitCode" v-model="searchForm.unitCode" :placeholder="$t('请输入核算单位编码')" name="searchForm_unitCode"/>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button id="searchUnit" name="MerchantAccountUnitQuery_search" code="MerchantAccountUnitQuery" size="small" type="primary" @click="search">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button id="merchantAccountUnitAdd" name="MerchantAccountUnitAdd_initEditDialog" code="MerchantAccountUnitAdd" size="mini" type="primary" @click="initEditDialog({})">{{ $t('新增核算单位') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list122"/>
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
      <el-form ref="form" :label-position="left" :rules="rules" :model="editObj.obj" :disabled="editObj.edit === false" label-width="120px">
        <el-form-item :label="$t('核算单位编码：')" prop="unitCode">
          <el-input
            id="unitCode"
            v-model="editObj.obj.unitCode"
            :disabled="editObj.obj.id"
            :placeholder="$t('请输入标签名称')"
            name="editObj_obj_unitCode"
            type="text"
            show-word-limit
            maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('核算单位名称：')" prop="unitName">
          <el-input
            id="unitName"
            v-model="editObj.obj.unitName"
            :placeholder="$t('请输入标签名称')"
            name="editObj_obj_unitName"
            type="text"
            show-word-limit
            maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('描述：')" prop="description">
          <el-input
            id="unitDesc"
            v-model="editObj.obj.unitDesc"
            :placeholder="$t('请输入描述')"
            name="editObj_obj_unitDesc"
            type="textarea"
            show-word-limit
            maxlength="100"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancel" @click="cancel">{{ $t('取消') }}</el-button>
        <ody-button id="merchantAccountUnitSave" name="MerchantAccountUnitSave_commit" code="MerchantAccountUnitSave" type="primary" @click="commit">{{ $t('保存') }}</ody-button>
      </div>
    </ody-dialog>
  </div>
</template>
<script>
import util from '@/utils/util'

export default {
  name: 'MerchantAccountUnit',
  data() {
    const self = this
    return {
      loading: false,
      rules: {
        unitCode: [
          { required: true, message: this.$t('请输入核算单位编码'), trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          { pattern: /^[0-9a-zA-Z]*$/, message: this.$t('仅支持数字、字母'), trigger: 'change' }
        ],
        unitName: [
          { required: true, message: this.$t('请输入核算单位名称'), trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
        ]
      },
      // 搜索框对象
      searchForm: {},
      entryTermsType: [],
      isAvailable: [],
      editObj: { show: false, obj: {}},
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'unitCode',
            'label': this.$t('核算单位编码'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'unitName',
            'label': this.$t('核算单位名称'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'unitDesc',
            'label': this.$t('描述'),
            'align': 'center'
          }
        ],
        operates: {
          'width': 250,
          'fixed': 'right',
          'list': [
            {
              'label': this.$t('编辑'),
              show: true,
              'disabled': false,
              method(index, row) {
                self.initEditDialog(row)
              },
              code: 'MerchantAccountUnitEdit'
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
      const accountUnitService = this.$merchant.$api.accountUnitService
      try {
        this.loading = true
        const res = await accountUnitService.queryAccountUnitInfoPage(this.searchForm)
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
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
        this.editObj.title = this.$t('编辑核算单位')
      } else {
        this.editObj.title = this.$t('新增核算单位')
      }
    },
    commit() {
      const self = this
      const accountUnitService = this.$merchant.$api.accountUnitService
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.editObj.obj.id) {
            accountUnitService.updateAccountUnitInfo(this.editObj.obj).then(res => {
              self.$message({
                message: this.$t('修改成功'),
                type: 'success'
              })
              this.$refs['form'].resetFields()
              self.init()
            })
          } else {
            accountUnitService.addAccountUnitInfo(this.editObj.obj).then(res => {
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
      util.confirm(this, this.$t('此操作将删除该标签') + '，' + this.$t('且不可恢复') + '，' + this.$t('要继续吗') + '？', function() {
        merchantFlagService.deleteMerchantFlag({ id: row.id }).then(res => {
          self.$message({
            type: 'success',
            message: this.$t('操作成功!')
          })
          self.init()
        })
      })
    }
  }
}
</script>

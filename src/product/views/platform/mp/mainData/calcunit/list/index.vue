<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('单位编码') + ':'" prop="calculationUnitCode">
            <el-input v-model="search.calculationUnitCode" name="search_calculationUnitCode" />
          </ody-search-item>
          <ody-search-item :label="$t('单位名称') + ':'" prop="calculationUnitName">
            <el-input v-model="search.calculationUnitName" name="search_calculationUnitName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{
          $t("重置")
        }}</el-button>
        <ody-button
          name="Product1007PageQuery"
          size="small"
          type="primary"
          code="Product1007PageQuery"
          @click.prevent="handleSubmit"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="Product1007Add_openAdd"
          size="small"
          type="primary"
          code="Product1007Add"
          @click="openAdd"
        >{{ $t("新增") }}</ody-button
        >
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/back-product-web/back/mp/calculation/queryCalculationUnitInfoByPage.do"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="dialogVisible"
      :title="$t('新增单位')"
      width="600px"
    >
      <el-form
        ref="dialogData"
        :model="dialogData"
        :rules="rules2"
        label-width="160px"
        class="form"
      >
        <el-form-item :label="$t('单位编码') + ':'" prop="calculationUnitCode">
          <el-input
            v-model="dialogData.calculationUnitCode"
            name="dialogData_calculationUnitCode"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="$t('单位名称') + ':'" prop="calculationUnitName">
          <el-input
            v-model="dialogData.calculationUnitName"
            name="dialogData_calculationUnitName"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="$t('单位名称（第二语言）') + ':'">
          <el-input
            v-model="dialogData.calculationUnitNameLan2"
            name="dialogData_calculationUnitNameLan2"
            maxlength="30"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top" />
        <el-button name="hideDialog" size="small" @click="hideDialog">{{
          $t("取消")
        }}</el-button>
        <ody-button
          name="Product1007Save_confirmDialog"
          size="small"
          type="primary"
          code="Product1007Save"
          @click="confirmDialog('dialogData')"
        >{{ $t("确定") }}</ody-button
        >
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  name: 'Product1007',
  data() {
    return {
      search: {
        calculationUnitCode: '',
        calculationUnitName: ''
      },
      dialogData: {
        calculationUnitCode: null,
        calculationUnitName: '',
        calculationUnitNameLan2: '',
        isAvailable: 1
      },
      rules2: {
        calculationUnitCode: [
          {
            required: true,
            message: this.$t('单位编码不能为空'),
            trigger: 'blur'
          }
        ],
        calculationUnitName: [
          {
            required: true,
            message: this.$t('单位名称不能为空'),
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      message: '',
      table: {
        columns: [
          {
            label: this.$t('单位编码'), // 单位编码
            prop: 'calculationUnitCode',
            show: true
          },
          {
            label: this.$t('单位名称'), // 单位名称
            show: true,
            prop: 'calculationUnitName'
          },
          {
            label: this.$t('单位名称（第二语言）'),
            prop: 'calculationUnitNameLan2',
            minWidth: 200,
            show: true
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.openAdd(row)
              },
              hidden: (index, row) => {
                if (row.calculationUnitCode === 'Pcs') {
                  return true
                } else {
                  return false
                }
              },
              code: 'Product1007Edit'
            }
          ]
        }
      }
    }
  },
  computed: {},
  async mounted() {
    await this.query()
  },
  methods: {
    handleReset() {
      this.search = {}
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    query() {
      const { ...params } = this.search
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    openAdd(row) {
      if (row) {
        this.dialogData.calculationUnitCode = row.calculationUnitCode
        this.dialogData.calculationUnitName = row.calculationUnitName
        this.dialogData.calculationUnitNameLan2 = row.calculationUnitNameLan2
        this.dialogData.id = row.id
      }
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    },
    confirmDialog(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = Object.assign({}, this.dialogData)
          this.message = this.$t('新增成功')
          if (param.id) {
            this.message = this.$t('更新成功')
          }
          return this.$product.$api.mpApi
            .addOrUpdateCalculationUnit(param)
            .then(res => {
              if (res.code === '0') {
                this.$message({
                  showClose: true,
                  message: this.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.query()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error'
                })
              }
            })
        }
      })
    }
  }
}
</script>

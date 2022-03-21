<template>
  <ody-dialog
    :title="pageType === 'add' ? $t('新增业务员') : $t('编辑业务员')"
    :visible.sync="visible"
    width="600px"
    @open="initData"
    @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item :label="$t('归属组织类型')" prop="orgType">
        <el-radio-group v-model="form.orgType" :disabled="pageType !== 'add'" name="form_orgType" @change="changeOrgType">
          <el-radio v-for="(v, k) in orgTypeList" :key="k" :label="k">{{ v }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('归属组织')" prop="orgId">
        <ody-merchant-select
          v-show="showType=='metchant'"
          v-model="form.orgId"
          :placeholder="$t('全部')"
          :disabled="pageType !== 'add'"
          name="form_orgId"
          value-key="merchantId"
          @change="()=>{}"/>
        <ody-store-select
          v-show="showType=='store'"
          v-model="form.orgId"
          :placeholder="$t('全部')"
          :disabled="pageType !== 'add'"
          name="form_orgId"
          value-key="storeId"/>
      </el-form-item>
      <el-form-item :label="$t('业务员')" prop="name">
        <el-input v-model="form.name" name="form_name" maxlength="10" show-word-limit/>
      </el-form-item>
      <el-form-item :label="$t('业务员手机')" prop="mobile">
        <el-input v-model="form.mobile" name="form_mobile" maxlength="11" show-word-limit/>
      </el-form-item>
      <el-form-item :label="$t('业务员类型')" prop="type">
        <ody-dict-select v-model="form.type" :disabled="pageType !== 'add'" pool="ouser" category="SALESMAN_TYPE" name="form_type"/>
      </el-form-item>
      <el-form-item :label="$t('备注')">
        <el-input v-model="form.remark" type="textarea" name="form_remark" maxlength="100" show-word-limit/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <ody-button name="ui_close" code="ui" size="small" @click="close">{{ $t('取消') }}</ody-button>
      <ody-button name="ui_save" code="ui" size="small" type="primary" @click="save">{{ $t('保存') }}</ody-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  name: 'Detail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pageType: {
      type: String,
      default: ''
    },
    salesman: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    const vue = this
    return {
      showType: 'store',
      orgTypeList: {},
      form: {
        orgType: '2'
      },
      rules: {
        orgType: [{ required: true, message: vue.$t('请选择归属组织类型'), trigger: 'blur' }],
        orgId: [{ required: true, message: vue.$t('请选择归属组织'), trigger: 'blur' }],
        name: [{ required: true, message: vue.$t('请输入业务员'), trigger: 'blur' }],
        mobile: [
          { required: true, message: vue.$t('请输入业务员手机'), trigger: 'blur' },
          {
            pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/,
            message: vue.$t('请输入正确的手机号'),
            trigger: 'blur'
          }
        ],
        type: [{ required: true, message: vue.$t('请选择业务员类型'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    initData() {
      console.log(this.pageType !== 'add')
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      this.form = {
        orgType: '2'
      }
      if (this.salesman.id !== undefined && this.salesman.id !== null) {
        const data = Object.assign({ orgType: '2' }, this.salesman)
        data.type = data.type + ''
        data.orgType = data.orgType + ''
        this.form = data
      }
      this.showType = this.form.orgType === '1' ? 'metchant' : 'store'
    },
    async init() {
      const data = await this.$api.code.select({ pool: 'ouser', category: 'SALESMAN_DEPARTMENT_TYPE' })
      this.orgTypeList = data.data
    },
    changeOrgType(key) {
      this.form.orgId = null
      this.showType = key === '1' ? 'metchant' : 'store'
    },
    close() {
      this.$emit('update:visible', false)
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.pageType === 'edit' && this.form.id !== null) {
            this.$ouser.$api.salesmanService.update(this.form).then(() => {
              this.$message({
                type: 'success',
                message: this.$t('保存成功')
              })
              this.close()
              this.$emit('ok')
            })
          } else {
            this.$ouser.$api.salesmanService.save(this.form).then(() => {
              this.$message({
                type: 'success',
                message: this.$t('保存成功')
              })
              this.close()
              this.$emit('ok')
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

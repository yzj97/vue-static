<template>
  <ody-dialog
    :visible.sync="innerVisible"
    :title="ruleForm.id ? $t('编辑设备') : $t('增加设备')"
    width="640px"
    append-to-body
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item :label="$t('区域') + ':'">
        <div>{{ checkDetail.parentName }}</div>
      </el-form-item>
      <el-form-item :label="$t('子区域') + ':'">
        <div>{{ checkDetail.newLocationName }}</div>
      </el-form-item>
      <el-form-item :label="$t('设备编码') + ':'" prop="terminalCode">
        <el-input v-model="ruleForm.terminalCode" :placeholder="$t('请输入设备编码')" name="ruleForm_terminalCode" maxlength="20"/>
      </el-form-item>
      <el-form-item :label="$t('设备名称') + ':'" prop="terminalName">
        <el-input v-model="ruleForm.terminalName" :placeholder="$t('请输入设备名称')" name="ruleForm_terminalName" maxlength="20"/>
      </el-form-item>
      <el-form-item :label="$t('设备类型') + ':'" prop="terminalType">
        <el-select v-model="ruleForm.terminalType" :placeholder="$t('请选择设备类型')" name="ruleForm_terminalType">
          <el-option v-for="item in terminalTypeMap" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('ip') + ':'" prop="ip">
        <el-input v-model="ruleForm.ip" :placeholder="$t('请输入设备ip')" name="ruleForm_ip" maxlength="20"/>
      </el-form-item>
      <el-form-item :label="$t('端口') + ':'" prop="port">
        <ody-input-number :empty-tip="false" :max="99999" v-model="ruleForm.port" :placeholder="$t('请输入设备端口')" name="ruleForm_port" />
      </el-form-item>
      <el-form-item :label="$t('供应商') + ':'" prop="terminalSupplierCode">
        <el-select v-model="ruleForm.terminalSupplierCode" :placeholder="$t('请选择供应商')" name="ruleForm_terminalSupplierCode">
          <el-option label="insight" value="insight"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('状态') + ':'" prop="isAvailable">
        <el-switch
          v-model="ruleForm.isAvailable"
          :active-value="1"
          :inactive-value="0"
          name="ruleForm_isAvailable"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <div class="line-top"/>
      <el-button name="hideDialog" size="small" @click="hideDialog">{{ $t('取消') }}</el-button>
      <el-button name="confirm" size="small" type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    checkDetail: {
      type: Object,
      default: () => {}
    },
    chooseEquipment: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      terminalTypeMap: [{
        value: '1',
        label: this.$t('POS机')
      }, {
        value: '2',
        label: this.$t('摄像头')
      }, {
        value: '3',
        label: this.$t('厨打机')
      }],
      innerVisible: this.visible,
      ruleForm: {
        terminalCode: '',
        terminalName: '',
        terminalType: '',
        ip: '',
        port: '',
        terminalSupplierCode: '',
        isAvailable: 1
      },
      rules: {
        terminalCode: [{ required: true, message: this.$t('请输入设备编码'), trigger: 'change' }],
        terminalName: [{ required: true, message: this.$t('请输入设备名称'), trigger: 'change' }],
        terminalType: [{ required: true, message: this.$t('请选择设备类型'), trigger: 'change' }]
      },
      postApi: this.$merchant.$api.areaService

    }
  },

  watch: {
    visible() {
      this.innerVisible = this.visible
    },
    innerVisible(val) {
      this.$emit('update:visible', val)
    }

  },
  created() {
    if (this.chooseEquipment.id) {
      this.ruleForm = this.chooseEquipment
    }
  },
  methods: {
    hideDialog() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.checkDetail)
          var params = {
            storeId: this.checkDetail.storeId,
            storeLocationId: this.checkDetail.id
          }
          params = { ...params, ...this.ruleForm }
          this.postApi.saveEquipment([params]).then(res => {
            this.$emit('init')
            this.hideDialog()
          })
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>

</style>

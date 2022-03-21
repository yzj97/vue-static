<template>
  <ody-dialog
    :visible="visible"
    :before-close="handleClose"
    :title="$t('' + modalType)"
    @open="init">
    <section class="pg-expressConfigSet-list">
      <el-form v-if="modalType=='add'" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
        <el-form-item :label="$t('so_return_type')" prop="returnType">
          <el-select v-model="ruleForm.returnType" :placeholder="$t('please_choose')" name="ruleForm_returnType">
            <el-option
              v-for="(item,index) in returnType"
              :key="index"
              :label="item"
              :value="index"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('so_return_channel')" prop="channelCode">
          <el-select v-model="ruleForm.channelCode" :popper-append-to-body="false" :placeholder="$t('please_choose_so_return_channel_code')" popper-class="channel-popper" name="ruleForm_channelCode">
            <el-option
              v-for="item in channelCode"
              :key="item.channelCode"
              :label="item.channelName"
              :value="item.channelCode"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('so_return_days')" prop="returnDays">
          <span v-if="ruleForm.returnType === '4'" v-text="$t('订单发货后')"/>
          <span v-else v-text="$t('so_return_order_signed')"/>
          <ody-input-number
            v-model="ruleForm.returnDays"
            name="ruleForm_returnDays"
            min="1"
            max="365"
            controls="false"
            controls-position="right"
            size="mini"/>
          <span v-text="$t('so_return_day')"/>
        </el-form-item>
      </el-form>
      <el-form v-else ref="ruleForm2" :model="selectedItem" :rules="rules" label-width="120px">
        <el-form-item :label="$t('so_return_type')">
          <span>{{ returnType[selectedItem.returnType] }}</span>
        </el-form-item>
        <el-form-item :label="$t('so_return_channel')">
          <span>{{ selectedItem.isDefault?selectedItem.channelCode:(channelCode[selectedItem.channelCode]?channelCode[selectedItem.channelCode].channelName:'') }}</span>
        </el-form-item>
        <el-form-item :label="$t('so_return_days')" prop="returnDays">
          <span v-if="selectedItem.returnType + '' === '4'" v-text="$t('订单发货后')"/>
          <span v-else v-text="$t('so_return_order_signed')"/>
          <ody-input-number
            v-model="selectedItem.returnDays"
            name="selectedItem_returnDays"
            min="1"
            max="365"
            controls="false"
            controls-position="right"
            size="mini"/>
          <span v-text="$t('so_return_day')"/>
        </el-form-item>
      </el-form>

    </section>
    <span slot="footer" class="dialog-footer">
      <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
      <ody-button
        :disabled="submiting"
        name="OmsSoReturnConfig_Save_handleOk"
        code="OmsSoReturnConfig_Save"
        type="primary"
        @click="handleOk('ruleForm2')">{{ $t('common_save') }}</ody-button>
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
    modalType: {
      type: String,
      default: 'add'
    },
    selectedItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      submiting: false,
      returnType: {
        '1': ''
      },
      channelCode: [
        { channelName: '' }
      ],

      ruleForm: {
        returnType: null,
        channelCode: null,
        returnDays: 1
      },
      rules: {
        returnType: [
          {
            required: true, message: this.$t('so_return_type_not_null'), trigger: 'change'
          }
        ],
        channelCode: [
          {
            required: true, message: this.$t('channelCode_not_null'), trigger: 'change'
          }
        ],
        returnDays: [
          {
            required: true, message: this.$t('return_days_not_null'), trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    this.ruleForm = {
      returnType: '',
      channelCode: '',
      returnDays: 1
    }

    this.$oms.$api.common.selectCodes({
      category: 'RETURN_TYPE'
    }).then(resp => {
      this.returnType = resp.data.reduce((map, curr) => {
        if (curr.code !== '1') { // 仅退款（未发货）不在配置范围内
          map[curr.code] = curr.name
        }
        return map
      }, {})
    })
    this.$oms.$api.common.listAllChannels().then(resp => {
      this.channelCode = resp.data
    })
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      if (this.modalType === 'add') {
        this.$refs['ruleForm'].resetFields()
      } else {
        // this.$refs['ruleForm2'].resetFields()
      }
    },
    async handleOk() {
      if (this.modalType === 'add') {
        this.$refs['ruleForm'].validate(valid => {
          if (valid && this.ruleForm.channelCode !== '' && this.ruleForm.returnType !== '' && this.ruleForm.returnDays !== '' && this.ruleForm.returnDays > 0) {
            this.submiting = true
            this.$oms.$api.soReturnConfig.soReturnConfigAdd(this.ruleForm).then(resp => {
              this.$message({
                type: 'success',
                message: this.$t('common_save_success')
              })
              this.$emit('ok')
              this.handleClose()
            }).finally(() => {
              this.submiting = false
            })
          }
        })
      } else if (this.modalType === 'edit') {
        this.$refs['ruleForm2'].validate(valid => {
          if (valid && this.selectedItem.returnDays !== '' && this.selectedItem.returnDays > 0) {
            this.submiting = true
            this.$oms.$api.soReturnConfig.soReturnConfigUpdate(this.selectedItem).then(resp => {
              this.$message({
                type: 'success',
                message: this.$t('common_save_success')
              })
              this.$emit('ok')
              this.handleClose()
            }).finally(() => {
              this.submiting = false
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .el-input-number--mini {
    width: 100px !important;
  }
  .pg-expressConfigSet-list{
    height: 600px;
  }
 /deep/ .channel-popper{
    top:140px !important;
    left:160px !important;
  }
</style>

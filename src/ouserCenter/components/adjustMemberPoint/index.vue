<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('积分调整')"
      width="500px"
      @open="init"
    >
      <el-form
        ref="memberPointAdjustForm"
        :model="memberPointAdjustForm"
        label-position="right"
        label-width="80px"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item
              :label="$t('积分')"
              :rules="[{ required: true, message: $t('please_select_the_type_of_integral_change'), trigger: 'change' }]"
              class="register"
              required
              prop="growthType"
            >
              <el-select v-model="memberPointAdjustForm.growthType" name="memberPointAdjustForm_growthType">
                <el-option
                  v-for="item in growthType"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="[{ required: true, message: $t('请选择积分变动数值'), trigger: 'change' }]"
              class="register"
              required
              prop="changeAmount"
            >
              <ody-input-number
                :controls="false"
                :precision="0"
                v-model="memberPointAdjustForm.changeAmount"
                name="memberPointAdjustForm_changeAmount"
                min="1"
                max="99999999"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          :label="$t('渠道')"
          :rules="[{ required: true, message: $t('please_choose_channel'), trigger: 'change' }]"
          class="register"
          required
          prop="channelCode"
        >
          <el-select v-model="memberPointAdjustForm.channelCode" name="memberPointAdjustForm_channelCode">
            <el-option
              v-for="item in channels"
              :label="item.channelName"
              :key="item.channelCode"
              :value="item.channelCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('理由')"
          :rules="[{ required: true, message: $t('please_select_the_izu_change_reason'), trigger: 'change' }]"
          class="register"
          required
          prop="opeReason"
        >
          <el-select v-model="memberPointAdjustForm.opeReason" name="memberPointAdjustForm_opeReason" style="width:270px;">
            <el-option
              v-for="item in opeReasonList"
              :label="item.name"
              :key="item.code"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button name="handleClose" @click="handleClose()">{{ $t('common_cancel') }}</ody-button>
        <ody-button
          name="OuserCenterMemberListMemberAdjustPoint_submitForm"
          type="primary"
          code="OuserCenterMemberListMemberAdjustPoint"
          @click="submitForm('memberPointAdjustForm')"
        >{{ $t('submission_of_audit') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      growthType: [],
      channels: [],
      opeReasonList: [],
      memberPointAdjustForm: {
        growthType: '8',
        changeAmount: null,
        channelCode: null,
        opeReason: null
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleClose() {
      this.$refs['memberPointAdjustForm'].resetFields()
      this.$emit('update:visible', !this.visible)
      this.growthType = []
      this.channels = []
      this.opeReasonList = []
    },
    queryChannelMap() {
      // 获取渠道
      this.$ouserCenter.$api.points.queryChannelMap({}).then(resp => {
        this.channels = resp.data
      })
    },
    queryCode() {
      const reasonKey = 'POINT_JOB_REASON'
      this.growthType = [
        { name: this.$t('grant'), code: '8' },
        { name: this.$t('扣减'), code: '9' }
      ]
      const categorys = {
        categories: [reasonKey]
      }
      this.$ouserCenter.$api.userService.listMulti(categorys).then(resp => {
        this.opeReasonList = resp.data[reasonKey]
      })
    },
    submitForm(memberPointAdjustForm) {
      this.$refs[memberPointAdjustForm].validate(valid => {
        if (valid) {
          const param = {
            uniqueIdentification: this.$portal.getUuid() + '',
            changeAmount: this.memberPointAdjustForm.changeAmount,
            processType: this.memberPointAdjustForm.growthType,
            processDetail: {
              channelCode: this.memberPointAdjustForm.channelCode,
              opeReason: this.memberPointAdjustForm.opeReason
            },
            entityIdStr: this.userId
          }
          const op = this.$ouserCenter.$api.crmService.adjustMemberPoint(param)
          op.then(res => {
            this.$message({
              type: 'success',
              message: this.$t('common_operate_success')
            })
            this.handleClose()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async init() {
      try {
        this.queryCode()
        this.queryChannelMap()
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

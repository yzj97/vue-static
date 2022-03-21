<template>
  <span>
    <el-button
      :disabled="disabled"
      :code="type === 2 ? 'GrowthManualOperationAdd' : 'ManualOperationAddPoint'"
      name="onAddManualOperationShow"
      size="small"
      type="primary"
      @click="onAddManualOperationShow"
    >{{ title }}</el-button>
    <ody-dialog
      :visible.sync="addManualOperation.showDialog"
      :title="type === 2?$t('新增成长值人工作业'):$t('新增积分人工作业')"
      width="400px"
      @open="initDialog"
    >
      <el-form
        ref="addManualOperationForm"
        :model="addManualOperation.form"
        :rules="addManualOperation.rules"
        label-width="60px"
        label-position="right"
      >
        <el-form-item
          v-if="!userId"
          :rules="[{ required: true, message: $t('请选择对象') }]"
          :label="$t('对象')+':'"
          class="register"
          required
          prop="opeObj"
        >
          <el-input
            v-model="addManualOperation.form.opeObj"
            name="addManualOperation_form_opeObj"
            readonly="true"
            @focus="onShowUserModal"
          />
        </el-form-item>
        <el-form-item
          :label="$t('数量')+':'"
          :rules="[{ required: true, message: type === 2?$t('请填写成长值'):$t('请填写积分') },{ pattern: /^[1-9][0-9]{0,9}$/, message: this.$t('最大') + '10' + this.$t('位正整数'), trigger: 'change' }]"
          class="register"
          prop="changeAmount"
        >
          <el-col :span="9">
            <el-select v-model="addManualOperation.form.growthType" name="addManualOperation_form_growthType" style="width:90px;">
              <el-option
                v-for="item in growthType"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-input
              v-model="addManualOperation.form.changeAmount"
              :maxlength="10"
              name="addManualOperation_form_changeAmount"
              style="width:150px;"
              type="text"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item
          :label="$t('渠道')+':'"
          :rules="[{ required: true, message: $t('请选择渠道') }]"
          class="register"
          required
          prop="channelCode"
        >
          <el-select v-model="addManualOperation.form.channelCode" name="addManualOperation_form_channelCode" style="width:270px;">
            <el-option
              v-for="item in channels"
              :label="item.channelName"
              :key="item.channelCode"
              :value="item.channelCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('理由')+':'"
          :rules="[{ required: true, message: $t('请选择理由') }]"
          class="register"
          required
          prop="opeReason"
        >
          <el-select
            v-model="addManualOperation.form.opeReason"
            name="addManualOperation_form_opeReason"
            style="width:270px;"
            @change="selectOpeReasonChange(addManualOperation.form.opeReason)"
          >
            <el-option
              v-for="item in opeReasonList"
              :label="item.name"
              :key="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="isRemarkShow">
          <el-input
            v-model="addManualOperation.form.remark"
            name="addManualOperation_form_remark"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button name="cancelForm" size="small" @click="cancelForm">{{ $t('cancel') }}</el-button>
        <ody-button
          :code="type === 2 ? 'GrowthManualOperationAddSubmit' : 'ManualOperationAddSubmit'"
          name="submitForm"
          size="small"
          type="primary"
          @click="submitForm"
        >{{ $t('submission_of_audit') }}</ody-button>
      </div>
    </ody-dialog>
    <UserModal
      :visible.sync="showUserModal"
      :form-data.sync="formData"
      :collect.sync="collect"
      @ok="handleOk"
    />
  </span>
</template>

<script>
import UserModal from '@/components/userModal'
export default {
  components: {
    UserModal
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: null
    },
    ok: {
      type: Function,
      default: function() {
        return null
      }
    },
    userId: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      isRemarkShow: false,
      showUserModal: false,
      channels: [],
      opeReasonList: [],
      growthType: [],
      addManualOperation: {
        showDialog: false,
        form: {
          opeObj: null,
          changeAmount: null,
          channelCode: null,
          opeReason: null,
          opeObjs: [],
          growthType: this.type === 2 ? '10' : '8',
          remark: null
        }
      }
    }
  },
  async mounted() {
    this.queryCode()
    this.queryChannelMap()
  },
  methods: {
    onShowUserModal() {
      this.showUserModal = true
    },
    queryChannelMap() {
      // 获取渠道
      this.$crm.$api.points.queryChannelMap({}).then(resp => {
        this.channels = resp.data
      })
    },
    queryCode() {
      const reasonKey =
        this.type === 2 ? 'GROWTH_JOB_REASON' : 'POINT_JOB_REASON'
      this.growthType =
        this.type === 2
          ? [
            { name: this.$t('发放'), code: '10' },
            { name: this.$t('扣减'), code: '11' }
          ]
          : [
            { name: this.$t('发放'), code: '8' },
            { name: this.$t('扣减'), code: '9' }
          ]
      const categorys = {
        categories: [reasonKey]
      }
      this.$crm.$api.userService.listMulti(categorys).then(resp => {
        this.opeReasonList = resp.data[reasonKey]
      })
    },
    handleOk(itemList) {
      var showUserIds = ''
      itemList.forEach(item => {
        showUserIds += item.userId + ','
      })
      if (showUserIds) {
        showUserIds = showUserIds.substring(showUserIds, showUserIds.length - 1)
      }
      this.addManualOperation.form.opeObj = showUserIds
      this.addManualOperation.form.opeObjs = itemList
    },
    selectOpeReasonChange(opeReason) {
      this.isRemarkShow = opeReason === '4'
    },
    onAddManualOperationShow() {
      this.addManualOperation.showDialog = true
    },
    cancelForm() {
      const vue = this
      vue.isRemarkShow = false
      vue.addManualOperation = {
        showDialog: false,
        form: {
          opeObj: null,
          changeAmount: null,
          channelCode: null,
          opeReason: null,
          opeObjs: [],
          growthType: this.type === 2 ? '10' : '8',
          remark: null
        }
      }
    },
    initDialog() {
      if (this.$refs['addManualOperationForm']) {
        this.$refs['addManualOperationForm'].resetFields()
      }
      this.isRemarkShow = false
      this.addManualOperation.form = {
        opeObj: null,
        changeAmount: null,
        channelCode: null,
        opeReason: null,
        opeObjs: [],
        growthType: this.type === 2 ? '10' : '8',
        remark: null
      }
    },
    submitForm() {
      if (
        !this.addManualOperation.form.growthType ||
        this.addManualOperation.form.growthType === ''
      ) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择数量类型')
        })
        return
      }

      this.$refs.addManualOperationForm.validate(valid => {
        if (valid) {
          const param = {
            uniqueIdentification: this.$portal.getUuid(),
            changeAmount: this.addManualOperation.form.changeAmount,
            processType: this.addManualOperation.form.growthType,
            processDetail: {
              channelCode: this.addManualOperation.form.channelCode,
              opeReason: this.addManualOperation.form.opeReason
            },
            entityIdStr: this.userId
              ? this.userId
              : this.addManualOperation.form.opeObj
          }
          const op = this.$crm.$api.crmService.addAccount(param)
          op.then(res => {
            this.$message({
              type: 'success',
              message: this.$t('操作成功')
            })
            this.cancelForm()
            if (this.ok) {
              this.ok()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <div class="cp-task-pick-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('抽样')"
      width="600px"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-form
        ref="form"
        :model="innerNodeInfo"
        :rules="rules"
        :disabled="getIsDisabled"
        label-width="100px"
      >
        <el-form-item :label="$t('节点名称')" prop="nodeName">
          <el-input v-model="innerNodeInfo.nodeName" name="innerNodeInfo_nodeName" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item :label="$t('抽样设置')" prop="pickType">
          <el-radio-group v-model="innerNodeInfo.pickType" name="innerNodeInfo_pickType">
            <el-radio label="count">{{ $t('固定人数') }}</el-radio>
            <el-radio label="percent">{{ $t('百分比') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="innerNodeInfo.pickType === 'count'" prop="count" class="short-input">
          <ody-input-number v-model="innerNodeInfo.pickCount" :min="1" :max="999999" name="innerNodeInfo_pickCount">
            <template slot="append">{{ $t('人') }}</template>
          </ody-input-number>
        </el-form-item>
        <el-form-item
          v-if="innerNodeInfo.pickType === 'percent'"
          prop="percent"
          class="short-input"
        >
          <ody-input-number v-model="innerNodeInfo.pickPercent" :min="0" :max="100" name="innerNodeInfo_pickPercent">
            <template slot="append">%</template>
          </ody-input-number>
        </el-form-item>
        <el-form-item :label="$t('节点备注')" prop="nodeRemark">
          <el-input
            v-model="innerNodeInfo.nodeRemark"
            name="innerNodeInfo_nodeRemark"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
        <ody-button
          name="CrmTaskListSavePick_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSavePick"
          @click="handleSubmit"
        >{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import CrmTaskAnalysisList from '@/components/task-analysis-list'

export default {
  components: {
    CrmTaskAnalysisList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    nodeInfo: {
      type: Object,
      default: () => {}
    },
    taskId: {
      type: String,
      default: null
    },
    taskStatus: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      defaultNodeInfo: {
        nodeName: null, // 节点名称
        pickType: 'count', // 抽样设置 固定人数：count  百分比：percent
        pickCount: null, // 人数
        pickPercent: null, // 百分比
        nodeRemark: null // 节点备注
      },
      innerNodeInfo: {},
      rules: {
        nodeName: [
          {
            required: true,
            message: this.$t('请输入节点名称'),
            trigger: 'blur'
          }
        ],
        pickType: [
          {
            required: true,
            message: this.$t('请选择抽样设置'),
            trigger: 'blur'
          }
        ],
        pickCount: [
          {
            required: true,
            message: this.$t('请输入固定人数'),
            trigger: 'blur'
          }
        ],
        pickPercent: [
          {
            required: true,
            message: this.$t('请输入百分比人数'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getIsDisabled() {
      // const map = {
      //   3: 'isDoing',
      //   4: 'isEnded',
      //   5: 'isClosed',
      //   0: 'isWaitSumbit',
      //   1: 'isWaitAudit',
      //   2: 'isAuditFail'
      // }

      return !['isWaitSumbit', 'isAuditFail'].includes(this.taskStatus)
    }
  },
  methods: {
    handleOpen() {
      this.innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.defaultNodeInfo)),
        ...this.nodeInfo
      }
    },
    async handleSubmit() {
      const [err] = await this.formValidate('form')
      if (err) {
        return false
      }
      const { ...params } = this.innerNodeInfo

      this.$emit('ok', params)
      this.handleClose()
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-pick-modal {
  .short-input {
    width: 300px;
  }
}
</style>

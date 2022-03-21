<template>
  <div class="cp-task-union-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('合并')"
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
          name="CrmTaskListSaveUnion_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveUnion"
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
</style>

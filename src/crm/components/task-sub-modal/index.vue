<template>
  <div class="cp-task-sub-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('排除')"
      width="600px"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-form
        ref="form"
        :model="innerNodeInfo"
        :rules="rules"
        :disabled="getIsDisabled"
        label-width="120px"
        class="inner-form"
      >
        <el-form-item :label="$t('节点名称')" prop="nodeName">
          <el-input v-model="innerNodeInfo.nodeName" name="innerNodeInfo_nodeName" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item :label="$t('排除')" prop="subId">
          <template v-if="innerNodeInfo.subList && innerNodeInfo.subList.length > 1">
            <div>
              {{ $t('从') }}
              <el-button type="text">{{ showGroupNameList }}</el-button>
              {{ $t('中') }} {{ $t('排除') }}
            </div>
            <el-select v-model="innerNodeInfo.subId" :placeholder="$t('请选择')" name="innerNodeInfo_subId">
              <el-option
                v-for="item in innerNodeInfo.subList"
                :key="item.pageNodeId"
                :label="item.nodeName"
                :value="item.pageNodeId"
              />
            </el-select>
          </template>
          <template v-else>
            <el-alert :closable="false" :title="$t('请选择2个以上的分组')" type="error" />
          </template>
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
          name="CrmTaskListSaveSub_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveSub"
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
        subId: null, // 排除的分组Id
        subList: [], // 分组列表
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
        subId: [
          { required: true, message: this.$t('请选择分组'), trigger: 'blur' }
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
    },
    showGroupNameList() {
      return this.innerNodeInfo.subList.map(x => x.nodeName).join('、')
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
.cp-task-sub-modal {
  .inner-form {
    // width: 480px;
  }
}
</style>

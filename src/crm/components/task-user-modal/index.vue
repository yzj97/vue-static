<template>
  <div class="cp-task-user-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('分组')"
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
        <el-form-item :label="$t('选择分组分类')" prop="userClassifyId">
          <crm-user-classify-select
            v-model="innerNodeInfo.userClassifyId"
            :placeholder="$t('请选择分组分类')"
            name="innerNodeInfo_userClassifyId"
            @change="handleUserClassifyChange"
          />
        </el-form-item>
        <el-form-item :label="$t('选择分组')" prop="userGroupId">
          <crm-user-group-select
            ref="userGroup"
            :disabled="!innerNodeInfo.userClassifyId"
            v-model="innerNodeInfo.userGroupId"
            :selected.sync="userGroup"
            :placeholder="$t('请选择分组')"
            name="innerNodeInfo_userGroupId"
            @change="handleUserGroupChange"
          />
          <template v-if="innerNodeInfo.userGroupId">
            {{ $t('会员人数：') }}
            {{ innerNodeInfo.memberNum }}
            {{ $t('人') }}
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
          name="CrmTaskListSaveGroup_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveGroup"
          @click="handleSubmit"
        >{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import CrmGroupFilter from '@/components/group-filter'
import CrmUserClassifySelect from '@/components/user-classify-select'
import CrmUserGroupSelect from '@/components/user-group-select'

export default {
  components: {
    CrmGroupFilter,
    CrmUserClassifySelect,
    CrmUserGroupSelect
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
        memberNum: null, // 会员数
        nodeName: null, // 节点名称
        userClassifyId: null, // 分组分类
        userGroupId: null, // 分组
        nodeRemark: null // 节点备注
      },
      innerNodeInfo: {},
      userGroup: {},
      userGroupList: [],
      rules: {
        nodeName: [
          {
            required: true,
            message: this.$t('请输入节点名称'),
            trigger: 'change'
          }
        ],
        userClassifyId: [
          {
            required: true,
            message: this.$t('请选择分组分类'),
            trigger: 'change'
          }
        ],
        userGroupId: [
          { required: true, message: this.$t('请选择分组'), trigger: 'change' }
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
    async handleOpen() {
      this.innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.defaultNodeInfo)),
        ...this.nodeInfo
      }

      if (
        this.innerNodeInfo.userClassifyId !== null &&
        this.innerNodeInfo.userClassifyId !== undefined
      ) {
        this.$nextTick(() => {
          this.$refs.userGroup.loadByUserClassifyId(
            this.innerNodeInfo.userClassifyId
          )
        })
      }
    },
    handleUserGroupChange() {
      const { userGroup } = this

      if (userGroup && userGroup.groupName) {
        this.innerNodeInfo.nodeName = userGroup.groupName
        this.innerNodeInfo.memberNum = userGroup.memberNum
      }
    },
    async handleUserClassifyChange(userClassifyId) {
      this.innerNodeInfo.userGroupId = null

      this.$refs.userGroup.loadByUserClassifyId(userClassifyId)
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
      // this.formReset('form')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

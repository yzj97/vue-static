<template>
  <div class="cp-task-filter-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('筛选')"
      width="1200px"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-form
        ref="form"
        :model="innerNodeInfo"
        :rules="rules"
        :disabled="getIsDisabled"
        label-width="100px"
        class="inner-form"
      >
        <el-form-item :label="$t('节点名称:')" prop="nodeName">
          <el-input v-model="innerNodeInfo.nodeName" name="innerNodeInfo_nodeName" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item v-if="innerNodeInfo.mustGroup" :label="$t('选择分组:')" prop="filterGroupId">
          <!-- {{ innerNodeInfo.filterGroupList }} -->
          <template v-if="innerNodeInfo.filterGroupList && innerNodeInfo.filterGroupList.length">
            <el-select
              v-model="innerNodeInfo.filterGroupId"
              :clearable="false"
              :placeholder="$t('请选择')"
              name="innerNodeInfo_filterGroupId"
              @change="handleUserGroupChange"
            >
              <el-option
                v-for="item in innerNodeInfo.filterGroupList"
                :key="item.pageNodeId"
                :label="item.nodeName"
                :value="item.pageNodeId"
              />
            </el-select>
          </template>
          <template v-else>
            <el-alert :closable="false" :title="$t('没有找到分组数据')" type="error" />
          </template>
        </el-form-item>
        <el-form-item v-if="innerNodeInfo.mustStatus" :label="$t('选择状态:')" prop="filterSendStatus">
          <template
            v-if="innerNodeInfo.filterSendStatusList && innerNodeInfo.filterSendStatusList.length"
          >
            <el-select
              v-model="innerNodeInfo.filterSendStatus"
              :clearable="false"
              :placeholder="$t('请选择')"
              name="innerNodeInfo_filterSendStatus"
              @change="handleSendStatusChange"
            >
              <el-option
                v-for="item in innerNodeInfo.filterSendStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template v-else>
            <el-alert :closable="false" :title="$t('没有找到状态数据')" type="error" />
          </template>
        </el-form-item>
        <el-form-item :label="$t('筛选条件:')" />
      </el-form>
      <crm-group-condition
        ref="groupCondition"
        v-model="innerNodeInfo.conditionValue"
        name="innerNodeInfo_conditionValue"
        size="small"
      />
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
        <ody-button
          name="CrmTaskListSaveFileter_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveFileter"
          @click="handleSubmit"
        >{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import CrmTaskAnalysisList from '@/components/task-analysis-list'
import CrmGroupCondition from '@/components/group-condition'

export default {
  components: {
    CrmTaskAnalysisList,
    CrmGroupCondition
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
        mustGroup: null, // 必须分组
        filterGroupList: [
          // 分组列表
          // {
          //   nodeName: 'xxx',
          //   pageNodeId: 'xxx'
          // }
        ],
        filterGroupId: null, // 分组Id
        mustStatus: null, // 必须选择状态
        filterSendStatusList: [
          // 状态列表
          // {
          //   value: -1,
          //   label: this.$t('全部')
          // },
          // {
          //   value: 1,
          //   label: this.$t('发放成功')
          // },
          // {
          //   value: 0,
          //   label: this.$t('发放失败')
          // }
        ],
        filterSendStatus: null, // 选中的状态
        conditionValue: {
          // 条件
          action: 'must', // 子的length >1 显示线条 + 文字, 其他不显示
          children: [
            {
              action: 'must', // 子的length == 1 && parentChidren.length > 1 显示 线条， 子的length > 1 显示线条 + 文字
              children: [
                {
                  action: 'must', // 子的length == 1 显示线条， >1 显示 线条 + 文字
                  children: []
                }
              ]
            }
          ]
        }
      },
      innerNodeInfo: {},
      methods: [
        {
          value: '1',
          label: this.$t('并且')
        },
        {
          value: '2',
          label: this.$t('或者')
        }
      ],
      rules: {
        nodeName: [
          {
            required: true,
            message: this.$t('请输入节点名称'),
            trigger: 'blur'
          }
        ],
        filterGroupId: [
          { required: true, message: this.$t('请选择分组'), trigger: 'blur' }
        ],
        filterSendStatus: [
          { required: true, message: this.$t('请选择状态'), trigger: 'blur' }
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
    conditionFormValidate() {
      return new Promise(resolve => {
        this.$refs.groupCondition.$refs.conditionForm.validate(valid => {
          if (valid) {
            resolve([null, valid])
          } else {
            resolve([true])
          }
        })
      })
    },
    handleSendStatusChange(val) {
      const { label } = this.innerNodeInfo.filterSendStatusList.find(
        x => x.value === val
      )

      this.innerNodeInfo.nodeName = this.$t('筛选-') + label
    },
    handleUserGroupChange(val) {
      const { nodeName } = this.innerNodeInfo.filterGroupList.find(
        x => x.pageNodeId === val
      )

      this.innerNodeInfo.nodeName = this.$t('筛选-') + nodeName
    },
    handleOpen() {
      const innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.defaultNodeInfo)),
        ...this.nodeInfo
      }

      if (
        innerNodeInfo.mustGroup &&
        (innerNodeInfo.filterGroupId === null ||
          innerNodeInfo.filterGroupId === undefined) &&
        innerNodeInfo.filterGroupList &&
        innerNodeInfo.filterGroupList.length
      ) {
        const [{ filterGroupId }] = innerNodeInfo.filterGroupList
        innerNodeInfo.filterGroupId = filterGroupId
        this.$nextTick(() => {
          this.handleUserGroupChange(filterGroupId)
        })
      }

      if (
        innerNodeInfo.mustStatus &&
        (innerNodeInfo.filterSendStatus === null ||
          innerNodeInfo.filterSendStatus === undefined) &&
        innerNodeInfo.filterSendStatusList &&
        innerNodeInfo.filterSendStatusList.length
      ) {
        const [{ value }] = innerNodeInfo.filterSendStatusList
        innerNodeInfo.filterSendStatus = value
        this.$nextTick(() => {
          this.handleSendStatusChange(value)
        })
      }

      this.innerNodeInfo = innerNodeInfo

      this.$nextTick(() => {
        this.$refs.groupCondition.init()
      })
    },
    async handleSubmit() {
      const [err] = await this.formValidate('form')
      const [innerError] = await this.conditionFormValidate()

      if (err || innerError) {
        return
      }

      const { ...params } = this.innerNodeInfo

      // if (params.group) {
      //   params.isCheckOk = true
      // } else {
      //   params.isCheckOk = false
      // }
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
.cp-task-filter-modal {
  .inner-form {
    width: 480px;
  }
}
</style>

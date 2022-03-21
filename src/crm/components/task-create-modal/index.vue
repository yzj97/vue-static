<template>
  <div class="cp-task-create-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="title"
      width="600px"
      @close="handleModalClose"
    >
      <el-form
        ref="taskCraeteForm"
        :model="taskCraeteForm"
        :rules="rules"
        :disabled="statusType === 'view'"
        label-width="90px"
      >
        <el-form-item :label="$t('任务名称:')" prop="taskName">
          <el-input
            v-model="taskCraeteForm.taskName"
            name="taskCraeteForm_taskName"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('任务类型:')" prop="taskType">
          <ody-radio2 v-model="taskCraeteForm.taskType" name="taskCraeteForm_taskType" list-key="crmTaskTypeList" />
        </el-form-item>
        <el-form-item :label="$t('执行时间:')" prop="taskRules.timeType">
          <ody-radio2 v-model="taskCraeteForm.taskRules.timeType" name="taskCraeteForm_taskRules_timeType" list-key="crmTimeTypeList" />
        </el-form-item>
        <el-form-item>
          <div class="sub-form">
            <div v-if="taskCraeteForm.taskRules.timeType === 1" key="oneTimeDate">
              <el-form-item :label="$t('执行时间:')" prop="taskRules.oneTimeDate">
                <el-date-picker
                  v-model="taskCraeteForm.taskRules.oneTimeDate"
                  :picker-options="pickerOptions"
                  :placeholder="$t('选择日期时间')"
                  name="taskCraeteForm_taskRules_oneTimeDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"/>
              </el-form-item>
            </div>
            <div v-else-if="taskCraeteForm.taskRules.timeType === 2" key="cycleType">
              <el-form-item :label="$t('时间范围:')" prop="cycleType">
                <div class="sub-form-item">
                  <el-radio v-model="taskCraeteForm.taskRules.cycleType" :label="1" name="taskCraeteForm_taskRules_cycleType">{{ $t('每天') }}</el-radio>
                  <template v-if="taskCraeteForm.taskRules.cycleType === 1">
                    {{ $t('每隔') }}
                    <el-form-item prop="taskRules.cycleEveryDay" class="small-input">
                      <ody-input-number v-model="taskCraeteForm.taskRules.cycleEveryDay" name="taskCraeteForm_taskRules_cycleEveryDay"/>
                    </el-form-item>
                    {{ $t('天') }}
                  </template>
                </div>
                <div class="sub-form-item">
                  <el-radio v-model="taskCraeteForm.taskRules.cycleType" :label="2" name="taskCraeteForm_taskRules_cycleType9">{{ $t('每周') }}</el-radio>
                  <template v-if="taskCraeteForm.taskRules.cycleType === 2">
                    <el-form-item prop="taskRules.cycleEveryWeekDay" class="middle-input">
                      <ody-select2 v-model="taskCraeteForm.taskRules.cycleEveryWeekDay" :clearable="false" name="taskCraeteForm_taskRules_cycleEveryWeekDay" class="middle-input" list-key="weekList" />
                    </el-form-item>
                  </template>
                </div>
                <div class="sub-form-item">
                  <el-radio v-model="taskCraeteForm.taskRules.cycleType" :label="3" name="taskCraeteForm_taskRules_cycleType2">{{ $t('每月') }}</el-radio>
                  <template v-if="taskCraeteForm.taskRules.cycleType === 3">
                    {{ $t('每个月的第') }}
                    <el-form-item prop="taskRules.cycleEveryMonthDay" class="small-input">
                      <ody-input-number v-model="taskCraeteForm.taskRules.cycleEveryMonthDay" name="taskCraeteForm_taskRules_cycleEveryMonthDay" class="small-input"/>
                    </el-form-item>
                    {{ $t('天') }}
                  </template>
                </div>
              </el-form-item>
              <el-form-item :label="$t('执行时间:')">
                <div class="sub-form-item">
                  {{ $t('开始：') }}
                  <el-form-item prop="taskRules.cycleStartTime" class="middle-input">
                    <el-date-picker
                      v-model="taskCraeteForm.taskRules.cycleStartTime"
                      :picker-options="pickerOptions"
                      :placeholder="$t('选择日期时间')"
                      name="taskCraeteForm_taskRules_cycleStartTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      class="middle-input"
                    />
                  </el-form-item>
                </div>
                <div class="sub-form-item">
                  <div class="sub-form-item-label">
                    {{ $t('结束：') }}
                  </div>
                  <div class="sub-form-item-item">
                    <div class="sub-form-item">
                      <el-radio v-model="taskCraeteForm.taskRules.cycleEndType" :label="1" name="taskCraeteForm_taskRules_cycleEndType">{{ $t('无结束时间') }}</el-radio>
                    </div>
                    <div class="sub-form-item">
                      <el-radio v-model="taskCraeteForm.taskRules.cycleEndType" :label="2" name="taskCraeteForm_taskRules_cycleEndType5">{{ $t('执行次数') }}</el-radio>
                      <template v-if="taskCraeteForm.taskRules.cycleEndType === 2">
                        {{ $t('执行') }}
                        <el-form-item prop="taskRules.cycleEndTimes" class="small-input">
                          <ody-input-number v-model="taskCraeteForm.taskRules.cycleEndTimes" name="taskCraeteForm_taskRules_cycleEndTimes" class="small-input"/>
                        </el-form-item>
                        {{ $t('次结束') }}
                      </template>
                    </div>
                    <div class="sub-form-item">
                      <el-radio v-model="taskCraeteForm.taskRules.cycleEndType" :label="3" name="taskCraeteForm_taskRules_cycleEndType8">{{ $t('结束时间') }}</el-radio>
                      <template v-if="taskCraeteForm.taskRules.cycleEndType === 3">
                        <el-form-item prop="taskRules.cycleEndTime" class="middle-input">
                          <el-date-picker
                            v-model="taskCraeteForm.taskRules.cycleEndTime"
                            :picker-options="pickerOptions"
                            :placeholder="$t('选择日期时间')"
                            name="taskCraeteForm_taskRules_cycleEndTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            class="middle-input"
                          />
                        </el-form-item>
                      </template>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('任务备注:')" prop="taskNote">
          <el-input
            v-model="taskCraeteForm.taskNote"
            name="taskCraeteForm_taskNote"
            type="textarea"
            maxlength="120"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <template v-if="statusType === 'view'">
          <el-button name="handleModalClose" size="small" type="primary" @click="handleModalClose">{{ $t('确定') }}</el-button>
        </template>
        <template v-else>
          <el-button name="handleModalClose2" size="small" @click="handleModalClose">{{ $t('取消') }}</el-button>
          <ody-button name="mktTask_add_handleSubmit" code="mktTask_add" size="small" type="primary" @click="handleSubmit">{{ $t('确定') }}</ody-button>
        </template>

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
    statusType: {
      type: String,
      default: 'add' // edit, view
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      taskCraeteForm: {
        taskName: null, // 任务名称
        taskType: 1, // 任务类型:
        taskNote: null, // 任务备注
        taskRules: {
          timeType: 1, // 执行时间
          oneTimeDate: null, // 定时一次性执行时间
          cycleType: 1, // 周期类型：1 按天 2 按周 3按月
          cycleEveryDay: '', // 按天每几天
          cycleEveryWeekDay: '', // 按周每周几
          cycleEveryMonthDay: null, // 按周每月第几天
          cycleStartTime: null, // 执行范围开始时间
          cycleEndType: 1, // 执行范围结束类型：1无结束时间 2执行几次结束 3结束时间
          cycleEndTime: null, // 执行范围结束时间
          cycleEndTimes: null // 执行几次结束
        }
      },
      rules: {
        taskName: [
          { required: true, message: this.$t('请输入任务名称'), trigger: 'change' }
        ],
        taskType: [
          { required: true, message: this.$t('请选择任务类型'), trigger: 'change' }
        ],
        'taskRules.timeType': [
          { required: true, message: this.$t('请选择执行时间'), trigger: 'change' }
        ],
        'taskRules.oneTimeDate': [
          { required: true, message: this.$t('请输入执行时间'), trigger: 'change' }
        ],
        'taskRules.cycleEveryDay': [
          { required: true, message: this.$t('请输入每隔第几天'), trigger: 'change' }
        ],
        'taskRules.cycleEveryMonthDay': [
          { required: true, message: this.$t('请输入每月第几天'), trigger: 'change' }
        ],
        'taskRules.cycleStartTime': [
          { required: true, message: this.$t('请输入执行范围开始时间'), trigger: 'change' }
        ],
        'taskRules.cycleEndTimes': [
          { required: true, message: this.$t('请输入执行次数'), trigger: 'change' }
        ],
        'taskRules.cycleEndTime': [
          { required: true, message: this.$t('请输入执行范围结束时间'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    title() {
      const map = {
        add: this.$t('新增任务'),
        edit: this.$t('编辑任务'),
        view: this.$t('查看任务')
      }
      return map[this.statusType]
    }
  },
  async mounted() {
    const { statusType, form: { taskRules, ...taskCraeteForm }} = this

    if (['edit', 'view'].includes(statusType)) {
      taskCraeteForm.taskRules = JSON.parse(taskRules)
      this.taskCraeteForm = taskCraeteForm
    }
  },
  methods: {
    async handleSubmit() {
      const [err] = await this.formValidate('taskCraeteForm')
      if (this.taskCraeteForm.taskRules && this.taskCraeteForm.taskRules.cycleEveryDay && this.taskCraeteForm.taskRules.cycleEveryDay === 0) {
        this.$message({
          message: this.$t('间隔天数不能为0'),
          type: 'success'
        })
        return
      }
      if (err) {
        return false
      }
      const { taskRules, ...params } = this.taskCraeteForm

      params.taskRules = JSON.stringify(taskRules)

      try {
        if (this.statusType === 'add') {
          await this.$crm.$api.mktTask.add(params)
          this.$message({
            message: this.$t('新增任务成功'),
            type: 'success'
          })
        } else if (this.statusType === 'edit') {
          await this.$crm.$api.mktTask.update(params)
          this.$message({
            message: this.$t('编辑任务成功'),
            type: 'success'
          })
        }
        this.$emit('ok')
        this.handleModalClose()
      } catch (ex) {
        console.error(ex)
      }

      // this.
    },
    handleModalClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-create-modal {
  .sub-form {
    margin-left: -20px;
  }
  .small-input {
    width: 60px;
    display: inline-block;
  }
  .sub-form-item {
    margin-bottom: 16px;
    white-space: nowrap;
  }
  .middle-input {
    display: inline-block;
    width: 200px;
  }

  .sub-form-item-label {
    float: left;
    vertical-align: top;
    margin-right: 5px;
  }
  .sub-form-item-item {
    float: left;
    margin-right: -20px;
  }
}
</style>

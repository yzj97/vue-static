<template>
  <div class="pg-promotion-spike-timeSchedule">
    <el-form ref="dynamicValidateForm" :model="timeScheduleList">
      <el-form-item
        v-for="(item, index) in timeScheduleList"
        :key="index"
        class="activity-schedule"
      >
        <el-time-select
          v-model="item.startTime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '23:00'
          }"
          :placeholder="$t('起始时间')"
          @change="scheduleChange"
        />
        <el-time-select
          v-model="item.endTime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '23:00',
            minTime: startTime
          }"
          :placeholder="$t('结束时间')"
          @change="scheduleChange"
        />
        <div class="outline-btn" style="display:inline-block;">
          <i
            v-show="timeScheduleList.length > 1"
            name="deleteSetting"
            class="el-icon-remove-outline"
            @click="deleteSetting(index)"
          />
          <i name="add" class="el-icon-circle-plus-outline" @click="add" />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    // 2-单品x件优惠
    type: {
      type: Object,
      default: () => {}
    },
    promotionMethod: {
      type: Object,
      default: () => {}
    },
    activityScheduleList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      showDelete: false,
      singlePromotion: {
        startTime: '',
        endTime: ''
      },
      timeScheduleList: []
    }
  },
  watch: {},
  async mounted() {
    setTimeout(() => {
      if (this.activityScheduleList.length > 0) {
        setTimeout(() => {
          this.timeScheduleList = this.activityScheduleList
        }, 1000)
      } else {
        this.timeScheduleList = [{ startTime: '', endTime: '' }]
      }
    }, 1000)
  },
  methods: {
    async validateForm() {
      const [validError] = await this.formValidate('dynamicValidateForm')
      return validError
    },
    async scheduleChange(val) {
      if (this.timeScheduleList.length >= 1) {
        // const [startHour] = lastItem.endTime.split(':')
        // const sHour = parseInt(startHour)
        this.timeScheduleList.map(item => {
          if (item.endTime && item.startTime > item.endTime) {
            const temp = item.startTime
            item.startTime = item.endTime
            item.endTime = temp
            console.log(item)
          }
          this.timeScheduleList.startTime = item.startTime
          this.timeScheduleList.endTime = item.endTime
        })
        this.$emit('timeScheduleList', this.timeScheduleList)
      }
    },
    add() {
      const lastItem = this.timeScheduleList[this.timeScheduleList.length - 1]
      let startTime = ''
      let endTime = ''

      if (lastItem && lastItem.endTime) {
        startTime = lastItem.endTime
        const [startHour] = lastItem.endTime.split(':')
        const sHour = parseInt(startHour)
        const endHour = sHour + 1
        const endHourStr = (endHour + '').padStart(2, '0')
        endTime = endHourStr + ':00'
        if (endHour >= 24) {
          // startTime = '00:00'
          // endTime = '01:00'
          this.$message({ type: 'info', message: this.$t('时间段设置不能超过24点') })
          return
        }
        if (sHour > 0 && sHour > endHour) {
          this.$message({ type: 'info', message: this.$t('开始时间不能大于结束时间') })
          return
        }
        this.timeScheduleList.push({
          startTime,
          endTime
        })
        this.showDelete = true
      } else {
        this.$message.error('请填写完整最后一个时段后再新增时段')
      }
    },
    deleteSetting(index) {
      if (this.timeScheduleList.length > 1) {
        this.$confirm(
          '此操作会将该时间段内的选品一并删除，确定要删除该时间段吗？',
          '系统提示',
          {
            confirmButtonText: this.$t('确认'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }
        )
          .then(() => {
            this.timeScheduleList.splice(index, 1)
            this.$message({
              type: 'success',
              message: this.$t('删除成功!')
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('已取消删除')
            })
            this.showDelete = false
          })
      }
    },
    async queryPromotionActivityDetail() {
      if (this.singlePromotion.id === '') {
        return
      }

      const {
        data = {},
        data: { fromDate = '', endDate = '' },
        code
      } = await this.promotionAPI.getPromotionDetailUrl(this.singlePromotion)

      if (code === '0') {
        this.singlePromotion = data
        if (data.activityScheduleList) {
          this.singlePromotion.activityScheduleList = data.activityScheduleList
        }

        this.$set(this.singlePromotion, 'createTime', [fromDate, endDate])
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pg-promotion-spike-timeSchedule {
  .activity-schedule {
    padding-bottom: 10px;
  }
  .outline-btn {
    i {
      font-size: 18px;
    }
  }
}
</style>

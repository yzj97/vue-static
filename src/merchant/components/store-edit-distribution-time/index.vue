<template>
  <div class>
    <merchant-title>{{ $t('配送时间') }}</merchant-title>
    <el-form
      ref="distributionTime"
      :model="distributionTime"
      :rules="rules"
      :disabled="isView"
      label-width="200px"
    >
      <el-form-item
        v-for="(businessDay, index) in distributionTime.businessDays"
        :key="index"
        :label="$t('星期' + (index + 1))"
      >
        <el-radio-group v-model="businessDay.type" name="businessDay_type">
          <el-radio :label="1">{{ $t('自定义时间') }}</el-radio>
          <el-radio :label="3">{{ $t('歇业') }}</el-radio>
        </el-radio-group>
        <div v-if="businessDay.type=== 1">
          <div
            v-for="(value, index) in businessDay.storeCalendarItemsPOS"
            :key="index"
            style="margin: 10px 0;"
          >
            <el-time-picker
              v-model="value.timer"
              :range-separator="$t('至')"
              :start-placeholder="$t('开始时间')"
              :end-placeholder="$t('结束时间')"
              :placeholder="$t('选择时间范围')"
              name="value_timer"
              is-range
              format="HH:mm"
              value-format="HH:mm"
            />
            <el-button
              v-if="index === 0"
              name="handleAddTime"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              class="width-auto"
              circle
              @click="handleAddTime(businessDay.storeCalendarItemsPOS)"
            />
            <el-button
              v-if="index !== 0"
              name="handleRemoveTime"
              size="mini"
              type="danger"
              icon="el-icon-minus"
              class="width-auto"
              circle
              @click="handleRemoveTime(businessDay.storeCalendarItemsPOS, index)"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <ody-button
          name="MerchantStoreListDistributionTime_handleSubmit"
          type="primary"
          code="MerchantStoreListDistributionTime"
          @click="handleSubmit"
        >{{ $t('保存') }}</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MerchantTitle from '@/components/title'

export default {
  components: {
    MerchantTitle
  },
  data() {
    const { status } = this.$route.params
    let isView = +status === 2
    let isEdit = +status === 1

    if (isEdit) {
      if (!this.$portal.hasPermission('MerchantStoreListEdit')) {
        isEdit = false
        isView = true
      }
    }

    return {
      isView,
      begin: '08:00',
      end: '18:00',
      distributionTime: {
        isInitData: 1,
        businessDays: []
      }
    }
  },
  async mounted() {
    this.distributionTime.businessDays = await this.queryStoreDistributionTimeInfo()
  },
  methods: {
    async queryStoreDistributionTimeInfo() {
      const { orgId } = this.$route.params

      const {
        data = []
      } = await this.$merchant.$api.storeService.queryStoreDistributionTimeInfo(
        {
          orgId,
          timeType: 2
        }
      )

      if (data && data.length) {
        this.distributionTime.isInitData = 0

        // beginDate 和 endDate 转换成timer
        data.forEach(dataItem => {
          const storeCalendarItemsPOS = []
          dataItem.storeCalendarItemsPOS.forEach(storeCalendarItem => {
            const { beginDate, endDate, ...other } = storeCalendarItem

            storeCalendarItemsPOS.push({
              timer: [beginDate || this.begin, endDate || this.end],
              ...other
            })
          })

          dataItem.storeCalendarItemsPOS = storeCalendarItemsPOS
        })

        return data
      }

      this.distributionTime.isInitData = 1
      return this.getInitData()
    },
    getInitData() {
      const { orgId } = this.$route.params

      return [
        {
          id: null,
          orgId: orgId,
          timeType: 2, // 日期类型：1/营业时间  2:/配送时间
          type: 1, // 日历类型【1自定义】【2全天】【3歇业】
          week: 1,
          isInitData: true,
          storeCalendarItemsPOS: [
            {
              id: null,
              timer: [this.begin, this.end],
              storeCalendarId: null
            }
          ]
        },
        {
          id: null,
          orgId: orgId,
          timeType: 2, // 日期类型：1/营业时间  2:/配送时间
          type: 1, // 日历类型【1自定义】【2全天】【3歇业】
          week: 2,
          isInitData: true,
          storeCalendarItemsPOS: [
            {
              id: null,
              timer: [this.begin, this.end],
              storeCalendarId: null
            }
          ]
        },
        {
          id: null,
          orgId: orgId,
          timeType: 2, // 日期类型：1/营业时间  2:/配送时间
          type: 1, // 日历类型【1自定义】【2全天】【3歇业】
          week: 3,
          isInitData: true,
          storeCalendarItemsPOS: [
            {
              id: null,
              timer: [this.begin, this.end],
              storeCalendarId: null
            }
          ]
        },
        {
          id: null,
          orgId: orgId,
          timeType: 2, // 日期类型：1/营业时间  2:/配送时间
          type: 1, // 日历类型【1自定义】【2全天】【3歇业】
          week: 4,
          isInitData: true,
          storeCalendarItemsPOS: [
            {
              id: null,
              timer: [this.begin, this.end],
              storeCalendarId: null
            }
          ]
        },
        {
          id: null,
          orgId: orgId,
          timeType: 2, // 日期类型：1/营业时间  2:/配送时间
          type: 1, // 日历类型【1自定义】【2全天】【3歇业】
          week: 5,
          isInitData: true,
          storeCalendarItemsPOS: [
            {
              id: null,
              timer: [this.begin, this.end],
              storeCalendarId: null
            }
          ]
        },
        {
          id: null,
          orgId: orgId,
          timeType: 2, // 日期类型：1/营业时间  2:/配送时间
          type: 1, // 日历类型【1自定义】【2全天】【3歇业】
          week: 6,
          isInitData: true,
          storeCalendarItemsPOS: [
            {
              id: null,
              timer: [this.begin, this.end],
              storeCalendarId: null
            }
          ]
        },
        {
          id: null,
          orgId: orgId,
          timeType: 2, // 日期类型：1/营业时间  2:/配送时间
          type: 1, // 日历类型【1自定义】【2全天】【3歇业】
          week: 7,
          isInitData: true,
          storeCalendarItemsPOS: [
            {
              id: null,
              timer: [this.begin, this.end],
              storeCalendarId: null
            }
          ]
        }
      ]
    },
    handleAddTime(arr) {
      if (arr.length < 5) {
        arr.push({
          id: null,
          timer: [this.begin, this.end],
          storeCalendarId: null
        })
      } else {
        this.$message({
          type: 'error',
          message: this.$t('不能超过5个时间段')
        })
      }
    },
    handleRemoveTime(arr, index) {
      arr.splice(index, 1)
    },
    getErrorWeekList() {
      const customBusinessDays = this.distributionTime.businessDays.filter(
        x => x.type === 1
      )
      const rtv = []

      customBusinessDays.forEach(businessDay => {
        const { week } = businessDay
        let hasError = false
        businessDay.storeCalendarItemsPOS.forEach(
          (storeCalendarItem, storeCalendarItemIndex) => {
            const {
              timer: [beginDate, endDate]
            } = storeCalendarItem

            businessDay.storeCalendarItemsPOS
              .filter((x, index) => index !== storeCalendarItemIndex)
              .forEach(otherStoreCalendarItem => {
                const {
                  timer: [otherBeginDate, otherEndDate]
                } = otherStoreCalendarItem

                if (hasError) {
                  return
                }

                if (otherBeginDate < beginDate && beginDate <= otherEndDate) {
                  hasError = true
                  return false
                }

                if (otherBeginDate < endDate && endDate <= otherEndDate) {
                  hasError = true
                  return false
                }
              })
          }
        )
        if (hasError) {
          rtv.push(week)
        }
      })
      return rtv
    },
    async handleSubmit() {
      const { orgId } = this.$route.params
      const { ...params } = this.distributionTime
      const customBusinessDays = params.businessDays.filter(x => x.type === 1)
      const errorWeekList = this.getErrorWeekList()

      if (errorWeekList && errorWeekList.length) {
        this.$message({
          type: 'error',
          message: `星期${errorWeekList.join('、')}配置的时间范围重复`
        })
        return false
      }

      params.orgId = orgId
      params.timeType = 2

      customBusinessDays.forEach(businessDay => {
        const storeCalendarItemsPOS = []

        // timer 转换成 beginDate 和 endDate
        businessDay.storeCalendarItemsPOS.forEach(storeCalendarItem => {
          const {
            timer: [beginDate, endDate]
          } = storeCalendarItem
          storeCalendarItemsPOS.push({
            beginDate,
            endDate,
            ...storeCalendarItem
          })
        })
        businessDay.storeCalendarItemsPOS = storeCalendarItemsPOS
      })

      await this.$merchant.$api.storeService.updateStoreDistributionTime(params)
      this.$message({
        type: 'success',
        message: this.$t('保存成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

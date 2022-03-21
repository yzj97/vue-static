<template>
  <ody-box :title="$t('创建报名活动')" class="cp-registration-management-view">
    <div>
      <div slot="content">
        <el-form
          ref="applyActivityDetail"
          :model="applyActivityDetail"
          :rules="rules"
          label-width="240px"
          class="form"
          style="width: 960px;"
        >
          <el-form-item :label="$t('报名活动名称:')" prop="activityTitle">
            <el-input
              v-model="applyActivityDetail.activityTitle"
              name="applyActivityDetail_activityTitle"
            />
          </el-form-item>
          <el-form-item :label="$t('关联活动类型:')" prop="id">
            <span>{{ applyActivityDetail.promotionType | keyVal(getApplyActivityType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('关联活动ID:')" prop="refThemeId">
            <span>{{ applyActivityDetail.refThemeId }}</span>
          </el-form-item>
          <el-form-item :label="$t('关联活动时间:')">
            <span>{{ applyActivityDetail.fromDate }}-{{ applyActivityDetail.endDate }}</span>
          </el-form-item>
          <el-form-item :label="$t('报名时间:')" prop="time">
            <el-date-picker
              v-model="applyActivityDetail.time"
              name="applyActivityDetail_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
            />
          </el-form-item>
          <!-- 1单一促销商家不是必填项 -->
          <el-form-item :label="$t('报名商品商家范围:')" :prop="applyActivityDetail.promotionType != 1 ? 'merchantList' : null">
            <el-tag
              v-for="(tag, index) in applyActivityDetail.merchantList"
              :key="index"
              type="default"
              closable
              style="margin: 0 5px 5px 0;"
              @close="handleTagClose(index)"
            >{{ tag.merchantName }}</el-tag>
            <!-- <el-button size="small" type="primary">+新增商家</el-button> -->
            <ody-merchant-choose
              :selected.sync="applyActivityDetail.merchantList"
              :multiple="true"
            />
          </el-form-item>
          <el-form-item :label="$t('活动描述:')" prop="queryStatus">
            <el-input
              :rows="4"
              v-model="applyActivityDetail.description"
              name="applyActivityDetail_description"
              type="textarea"
            />
          </el-form-item>
          <el-form-item>
            <ody-button
              name="handleAddApplyActivity"
              type="primary"
              code="button018"
              @click="handleAddApplyActivity"
            >{{ $t('创建报名') }}</ody-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </ody-box>
</template>
<script>
import constants from '@/utils/constants'
export default {
  name: 'PromotionRegistrationRule',
  data() {
    return {
      id: '',
      applyActivityDetail: {
        activityTitle: '', // 报名活动名称
        promotionType: undefined, // 关联活动类型
        refThemeId: '', // 关联活动ID
        startTime: undefined, // 关联活动时间-开始时间
        endTime: undefined, // 关联活动时间-结束时间
        time: [], // 报名时间
        merchantList: [], // 报名商品商家范围
        description: '' // 活动描述
      },
      rules: {
        activityTitle: [
          {
            required: true,
            message: this.$t('请输入报名活动名称'),
            trigger: 'blur'
          }
        ],
        time: [
          {
            required: true,
            message: this.$t('请输入报名时间'),
            trigger: 'blur'
          }
        ],
        merchantList: [
          {
            type: 'array',
            required: true,
            message: this.$t('请选择报名商品商家范围'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getApplyActivityType() {
      return constants.applyActivityTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  async mounted() {
    // :refType/:refThemeId/:promotionType
    const { refType, refThemeId, promotionType } = this.$route.params

    this.refType = refType
    this.refThemeId = refThemeId
    this.promotionType = promotionType
    await this.getPromotionDetailUrl()
  },
  methods: {
    handleTagClose(index) {
      this.applyActivityDetail.merchantList.splice(index, 1)
    },
    async handleAddApplyActivity() {
      try {
        const {
          time: [startTime, endTime],
          merchantList = [],
          ...params
        } = this.applyActivityDetail
        params.startTime = this.$moment(startTime).toISOString()
        params.endTime = this.$moment(endTime).toISOString()

        if (merchantList.length === 0 && this.applyActivityDetail.promotionType !== 1) {
          this.$message.error('请选择商家')
          return false
        }
        // params.merchantIdList = merchantList.map(x => x.merchantId)
        params.merchantList = merchantList.map(item => {
          return {
            limitRef: item.merchantId,
            refDescription: item.merchantName,
            extendRef: item.merchantCode
          }
        })

        if (params.id) delete params['id']

        await this.$promotion.$api.promotion.addApplyActivity(params)
        this.$portal.delActiveViewAndRefresh()
      } catch (ex) {
        console.error(ex)
      }
    },
    async getPromotionDetailUrl() {
      const {
        data
      } = await this.$promotion.$api.promotion.getPromotionDetailUrl({
        id: this.refThemeId
      })

      data.refThemeId = this.refThemeId
      data.refType = this.refType
      data.promotionType = this.promotionType
      data.activityTitle = data.promTitle
      data.description = '' // 备注需要重新输入新的
      const now = new Date()

      data.time = [now, new Date(data.endDate)]
      this.applyActivityDetail = data
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

<template>
  <ody-box :title="$t('创建报名活动')" class="cp-registration-management-view">
    <div>
      <div slot="content">
        <el-form
          ref="queryContent"
          :model="queryContent"
          label-width="240px"
          class="form"
          style="width: 960px;"
        >
          <el-form-item :label="$t('报名活动名称:')" prop="activityTitle">
            <el-input
              v-model="applyActivityDetail.activityTitle"
              :disabled="true"
              name="applyActivityDetail_activityTitle"
            />
          </el-form-item>
          <el-form-item :label="$t('关联活动类型:')" prop="id">
            <span>{{ applyActivityDetail.promotionType | keyVal(getApplyActivityType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('关联活动ID:')" prop="refThemeId">
            <span>{{ applyActivityDetail.refThemeId }}</span>
          </el-form-item>
          <el-form-item :label="$t('关联活动时间:')" prop="startTime">
            <span>{{ applyActivityDetail.startTime | parseTime }}-{{ applyActivityDetail.endTime | parseTime }}</span>
          </el-form-item>
          <el-form-item :label="$t('报名时间:')" prop="time">
            <el-date-picker
              v-model="promotionDetailUrl.time"
              :disabled="true"
              name="promotionDetailUrl_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
            />
          </el-form-item>
          <el-form-item :label="$t('报名商品商家范围:')">
            <!-- <el-button v-for="(m,index) in applyActivityDetail.merchantList" :key="index" size="small" type="default">{{ m.refDescription }}</el-button> -->
            <!-- <el-button size="small" type="primary" disabled>+新增商家</el-button> -->

            <el-tag
              v-for="(tag, index) in applyActivityDetail.merchantList"
              :key="index"
              type="default"
              style="margin: 0 5px 5px 0;"
              disabled
              @close="handleTagClose(index)"
            >{{ tag.refDescription }}</el-tag>
            <ody-button name="button005" size="small" type="primary" code="button005" disabled>+新增商家</ody-button>
            <!-- <ody-merchant-choose
              :selected.sync="applyActivityDetail.merchantList"
              :multiple="true"
              disabled
            />-->
          </el-form-item>
          <el-form-item :label="$t('活动描述:')" prop="queryStatus">
            <el-input
              :rows="4"
              v-model="applyActivityDetail.description"
              :disabled="true"
              name="applyActivityDetail_description"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </ody-box>
</template>
<script>
import constants from '@/utils/constants'
export default {
  name: 'PromotionRegistrationDetail',
  data() {
    return {
      id: '',
      applyActivityDetail: {
        activityTitle: '',
        promotionType: undefined,
        refThemeId: '',
        description: '',
        startTime: undefined,
        endTime: undefined,
        merchantList: [],
        time: []
      },
      promotionDetailUrl: {}
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
    const { id } = this.$route.params

    this.id = id

    await this.queryApplyActivityDetail()
    await this.getPromotionDetailUrl()
  },
  methods: {
    handleReset() {
      this.formReset('queryContent')
    },
    async getPromotionDetailUrl() {
      const {
        data: { fromDate, endDate, ...promotionDetailUrl }
      } = await this.$promotion.$api.promotion.getPromotionDetailUrl({
        id: this.applyActivityDetail.refThemeId
      })

      promotionDetailUrl.time = [new Date(fromDate), new Date(endDate)]

      this.promotionDetailUrl = promotionDetailUrl
    },
    async queryApplyActivityDetail() {
      const {
        data: applyActivityDetail
      } = await this.$promotion.$api.promotion.queryApplyActivityDetail(this.id)

      this.applyActivityDetail = applyActivityDetail
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

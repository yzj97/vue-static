<template>
  <section>
    <div>
      <registration-set-product
        v-if="steps===2"
        :multiple="true"
        :params="productParams"
        :disabled="+viewFlag === 1"
        choose-key="code"
        @cancel="clearParam"
        @ok="addSelectedMP"
      />
    </div>
    <div v-if="steps > 0">
      <ody-fixed>
        <!-- <ody-button
          v-if="steps > 0"
          name="handleComplete"
          type="primary"
          size="small"
          code="ui"
          @click="handleCancel"
        >{{ $t('取消') }}</ody-button> -->
        <ody-button
          v-if="steps > 0"
          name="handleBack"
          type="default"
          size="small"
          code="RegistrationFirstPageLast"
          @click="handlePrev"
        >{{ $t('上一步') }}</ody-button>
        <ody-button
          v-if="steps===1"
          name="handleNext"
          type="primary"
          size="small"
          code="RegistrationFirstPageNext"
          @click="nextStep"
        >{{ $t('下一步') }}</ody-button>
      </ody-fixed>
    </div>
  </section>
</template>
<script>
import util from '@/utils/util'
import RegistrationSetStore from '@/components/registration-set-store'
import RegistrationSetProduct from '@/components/registration-set-product'
export default {
  components: {
    RegistrationSetStore,
    RegistrationSetProduct
  },
  data() {
    const { id, refThemeId, viewFlag, refType, merchantId } = this.$route.params

    return {
      id,
      // 选择参与的活动的id
      refThemeId,
      viewFlag,
      // 选择参与的活动的refType
      refType,
      merchantId,
      steps: 2,
      selectedMerchantStoreList: {},
      storeList: [],
      registrationVisible: true,
      // 获取的报名信息
      getInfoList: [],
      // 保存参加活动的入参
      saveActivityAttendRecordRequest: {
        activityAttendId: '',
        merchantId: ''
      },
      // 弹窗中可选的商家列表
      optionalMerchantList: [],
      // 控制进入报名按钮是否显示
      clickFlag: true,
      dialogVisible: false,
      isNeedSetParams: '',
      storeVisible: false,
      storeParams: {
        merchantId: '',
        activityAttendId: '',
        refThemeId: '',
        refType: '',
        viewFlag: 0
      },
      productParams: {
        id,
        merchantId,
        refThemeId,
        refType,
        viewFlag
      }
    }
  },
  computed: {
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {
    this.getLoadPageConfigCommonOscUrl()
  },
  methods: {
    buttonDisabled(e) {
      const now = new Date()
      return (e.endTime < now || e.startTime > now || !this.clickFlag)
    },
    handleHideDialog() {
      this.dialogVisible = false
    },
    handlePrev() {
      this.$portal.delActiveView()
    },
    nextStep() {
      if (util.isEmpty(this.storeList)) {
        this.$message({
          type: 'warning',
          message: this.$t('未选择任何店铺！')
        })
        return
      }
      this.steps = 2
    },
    async getLoadPageConfigCommonOscUrl() {
      const { data } = await this.promotionAPI.getLoadPageConfigCommonOscUrl(
        'APPLY_ACTIVITY_PAGE'
      )
      this.isNeedSetParams = data.isNeedSetParams
    }
  }
}
</script>

<style scoped lang="scss">
* {
  font-size: 12px;
}
.registration {
  .registration_box {
    width: 440px;
    height: 240px;
    border: 1px solid #ddd;
    float: left;
    margin: 10px;
    .registration_text {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #f0f3f4;
    }
    .registration_content {
      width: 100%;
      height: 200px;
      background-color: #ffffff;
      position: relative;
      .content {
        position: relative;
        img {
          width: 100px;
          height: 120px;
          margin-top: 20px;
          margin-left: 20px;
          border: 1px solid yellow;
        }
        .text {
          position: absolute;
          top: 20px;
          left: 38%;
          img {
            width: 22px;
            height: 62px;
            position: absolute;
            right: -18px;
            top: -50px;
          }
          .text_2 {
            margin-top: 20px;
          }
          .text_3 {
            mrtop: 20px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
</style>

<template>
  <section>
    <div>
      <div v-show="steps===0" class="registration">
        <div v-for="(item,index) in getInfoList" :key="index" class="registration_box">
          <div class="registration_text">{{ item.activityTitle }}</div>
          <div class="registration_content">
            <div class="content">
              <img src="./images/p1single.png" alt >
              <div class="text">
                <img src="./images/time.png" alt >
                <div class="text_1">{{ item.refThemeName }}</div>
                <div class="text_2">
                  <i class="el-icon-time"/>
                  {{ item.startTime | parseTime }} - {{ item.endTime | parseTime }}
                </div>
                <div class="text_3">
                  <i class="el-icon-user-solid"/>
                  {{ item.id }}
                </div>
                <ody-button
                  :disabled="buttonDisabled(item)"
                  name="showEnrollSelectMerchantModal"
                  type="primary"
                  size="mini"
                  code="RegistrationFirstPageEnter"
                  @click="showEnrollSelectMerchantModal(item.id, item.refThemeId, item.refType, item.refThemeName, item.refThemeStartTime, item.refThemeEndTime)"
                >{{ $t('进入报名') }}</ody-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ody-dialog
      :visible.sync="dialogVisible"
      :title="$t('添加参与商家')"
      width="600px"
    >
      <ody-form ref="form" label-width="100px" class="form">
        <div>
          <ody-form-item :label="$t('参与商家')">
            <el-select v-model="saveActivityAttendRecordRequest.merchantId" name="saveActivityAttendRecordRequest_merchantId">
              <el-option
                v-for="item in optionalMerchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-form-item>
        </div>
        <br>
        <div slot="footer" style="padding-left: 150px">
          <ody-button name="ui_handleHideDialog" size="small" code="ui" @click="handleHideDialog">{{ $t('取消') }}</ody-button>
          <ody-button name="RegistrationAddMerchantSubmit_merchantApplyActivity" type="primary" size="small" code="RegistrationAddMerchantSubmit" @click="merchantApplyActivity">{{ $t('确认') }}</ody-button>
        </div>
      </ody-form>
    </ody-dialog>
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
    return {
      steps: 0,
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
      // 选择参与的活动的id
      refThemeId: '',
      // 选择参与的活动的refType
      refType: '',
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
        id: '',
        merchantId: '',
        refThemeId: '',
        refType: '',
        viewFlag: ''
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
    this.getRegistrationList()
  },
  methods: {
    async getRegistrationList() {
      const { data, code } = await this.promotionAPI.getRegistrationList({})
      if (code === '0') {
        this.getInfoList = data
      }
    },
    buttonDisabled(e) {
      const now = new Date()
      return (e.endTime < now || e.startTime > now || !this.clickFlag)
    },
    handleHideDialog() {
      this.dialogVisible = false
    },
    handleCancel() {
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
    },
    async merchantApplyActivity() {
      if (this.saveActivityAttendRecordRequest.merchantId === '') {
        this.$message({
          message: this.$t('请选择参与商家'),
          type: 'warn'
        })
        return
      }
      this.dialogVisible = false
      const { code } = await this.promotionAPI.saveActivityAttendRecord(this.saveActivityAttendRecordRequest)
      if (code === '0' && this.isNeedSetParams === '1') {
        this.storeParams.merchantId = this.saveActivityAttendRecordRequest.merchantId
        this.storeParams.activityAttendId = this.saveActivityAttendRecordRequest.activityAttendId
        this.storeParams.refThemeId = this.refThemeId
        this.storeParams.viewFlag = 0
        this.productParams.merchantId = this.saveActivityAttendRecordRequest.merchantId
        this.productParams.id = this.saveActivityAttendRecordRequest.activityAttendId
        this.productParams.refThemeId = this.refThemeId
        this.productParams.viewFlag = 0
        this.$router.push({
          name: 'PromotionSupplierEnrollMerchantCtrl',
          params: {
            id: this.saveActivityAttendRecordRequest.activityAttendId,
            refThemeId: this.refThemeId,
            viewFlag: 0,
            refType: this.refType,
            merchantId: this.saveActivityAttendRecordRequest.merchantId
          }
        })
        // this.storeVisible = true
      }
    },
    // 弹出选择商家弹出框
    showEnrollSelectMerchantModal(id, refThemeId, refType, refThemeName, refThemeStartTime, refThemeEndTime) {
      this.optionalMerchantList = []
      this.saveActivityAttendRecordRequest.merchantId = ''
      this.saveActivityAttendRecordRequest.activityAttendId = id
      this.refThemeId = refThemeId
      this.refType = refType
      this.refThemeName = refThemeName
      this.refThemeStartTime = refThemeStartTime
      this.refThemeEndTime = refThemeEndTime
      this.getInfoList.forEach(data => {
        if (data.id === this.saveActivityAttendRecordRequest.activityAttendId) {
          if (data.mktUseRuleList != null) {
            data.mktUseRuleList.forEach(item => {
              const optionalMerchant = {}
              optionalMerchant.merchantId = item.limitRef
              optionalMerchant.merchantName = item.limitRefName
              this.optionalMerchantList.push(optionalMerchant)
            })
            this.dialogVisible = true
          }
        }
      })
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
            margin-top: 20px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
</style>

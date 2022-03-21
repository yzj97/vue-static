<template>
  <ody-dialog :visible="visible" :before-close="handleClose" :title="$t('edit')" width="700px" @open="init">
    <el-form ref="couponThemeSimpleEdit" :model="form" :rules="rules" label-width="130px" class="form">
      <el-form-item :label="$t('优惠券名称')" class="coupon-limit" prop="themeTitle">
        <el-input
          v-model="form.themeTitle"
          :placeholder="$t('中文')"
          name="form_themeTitle"
          type="text"
          maxlength="10"
          show-word-limit/>
      </el-form-item>
      <el-form-item :label="$t('优惠券名称(英文)')" class="coupon-limit" prop="themeTitleLan2">
        <el-input
          v-model="form.themeTitleLan2"
          :placeholder="$t('英文')"
          name="form_themeTitleLan2"
          type="text"
          maxlength="30"
          show-word-limit/>
      </el-form-item>
      <el-form-item :label="$t('使用说明(中文)')" prop="themeDesc">
        <promotion-activity-description-input-chinese :rule-desc.sync="form.themeDesc" :maxlength="100"/>
      </el-form-item>
      <el-form-item :label="$t('使用说明(英文)')" prop="themeDescLan2">
        <promotion-activity-description-input-english :rule-desc-lan.sync="form.themeDescLan2" :maxlength="100"/>
      </el-form-item>
      <el-form-item
        v-if="form.couponGiveRule === 12"
        :label="$t('分享标题')"
        class="coupon-limit"
        prop="shareTitle">
        <el-input
          :placeholder="$t('随机面额券默认为拼手气,第{X}个领取的人得大红包；限输入30个字')"
          v-model="form.shareTitle"
          name="form_shareTitle"
          maxlength="30"/>
      </el-form-item>
      <el-form-item
        v-if="form.couponGiveRule === 12"
        :label="$t('分享描述')"
        class="coupon-limit"
        prop="shareDesc">
        <el-input
          :placeholder="$t('默认为优惠券名称，限输入50个字')"
          v-model="form.shareDesc"
          name="form_shareDesc"
          maxlength="50"/>
      </el-form-item>
      <el-form-item
        v-if="form.couponGiveRule === 12"
        :label="$t('分享图片')"
        class="coupon-limit"
        prop="shareImgUrl">
        <ody-upload-image v-model="form.shareImgUrl" name="form_shareImgUrl"/>
        <span v-if="form.couponGiveRule === 12" style="display:block">建议尺寸100*100，仅限JPG、PNG格式，小于3M；</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="ui" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
      <el-button name="ui" size="small" type="primary" @click="handleOk">{{ $t('ok') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
import PromotionActivityDescriptionInputChinese from '@/components/promotion-activity-description-input-chinese'
import PromotionActivityDescriptionInputEnglish from '@/components/promotion-activity-description-input-english'

export default {
  name: 'SimpleEdit',
  components: {
    PromotionActivityDescriptionInputChinese,
    PromotionActivityDescriptionInputEnglish
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    promotionId: {
      type: Number | String,
      default: false
    }
  },
  data() {
    return {
      form: {
        themeTitle: null,
        themeTitleLan2: null,
        themeDesc: null,
        themeDescLan2: null,
        shareTitle: null,
        shareDesc: null,
        shareImgUrl: null,
        couponGiveRule: null
      },
      rules: {
        themeTitle: [{ required: true, message: '请输入优惠券名称', trigger: 'change' }],
        themeTitleLan2: [{ required: true, message: '请输入优惠券名称(英文)', trigger: 'change' }],
        themeDesc: [{ required: true, message: '使用说明(中文)', trigger: 'change' }],
        themeDescLan2: [{ required: true, message: '使用说明(英文)', trigger: 'change' }]
      }
    }
  },
  methods: {
    async init() {
      const { data } = await this.$promotion.$api.promotion.queryCouponDetailById({ id: this.promotionId })
      this.form = data
    },
    handleOk() {
      this.$refs.couponThemeSimpleEdit.validate(valid => {
        if (valid) {
          this.$promotion.$api.promotion.simpleUpdateCouponById(this.form).then(resp => {
            this.$emit('ok')
            this.handleClose()
          })
        }
      })
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="cp-restrictions-time-scope">
    <ody-radio2
      key="provideCouponObj"
      v-model="provideCouponObj.timeScope"
      :selected.sync="selected"
      :clearable="!(selected && selected.disabled)"
      name="provideCouponObj_timeScope"
      list-key="sendUserPhoneList"
      @change="handleGiftRuleChange">
      <span slot="1" class="gift-limit-box">
        <el-form-item
          prop="phoneNumbers"
          class="gift-limit-multy">
          <el-input
            v-show="+provideCouponObj.timeScope === 1"
            v-model="provideCouponObj.phoneNumbers"
            :disabled="+provideCouponObj.timeScope !== 1"
            name="provideCouponObj_phoneNumbers"
            class="gift-limit-multy"
            @input="numbersPhone"/>
          <span v-show="+provideCouponObj.timeScope === 1" class="phoneColor"/>
          <span v-show="+provideCouponObj.timeScope === 1" style="color: red;">
            多个手机号时用分号(;)分隔
          </span>
        </el-form-item>
      </span>

      <span slot="2" class="gift-limit-box">
        <el-form-item
          :rules="{ required: +provideCouponObj.timeScope === 2, message: $t('请选择文件'), trigger: 'blur' }"
          prop="fileName"
          class="gift-limit-multy">
          <el-upload
            v-show="+provideCouponObj.timeScope === 2"
            ref="upload"
            :action="uploadUrl"
            :before-upload="checkFile"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :show-file-list="false"
            :auto-upload="false"
            name="fileData"
            accept=".xlsx,.csv"
            multiple="false">
            <el-button slot="trigger" size="small">{{ $t('选择文件') }}</el-button>
            <el-button name="getCSVTemplate" size="small" @click="getCSVTemplate">{{ $t('下载CSV模板') }}</el-button>
          </el-upload>
        </el-form-item>
        <p v-show="+provideCouponObj.timeScope === 2">{{ provideCouponObj.fileName }}</p>
      </span>
    </ody-radio2>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    memberRestrictionObj: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      provideCouponObj: {
        phoneNumbers: '',
        timeScope: 1,
        fileName: ''
      }
    }
  },
  watch: {
    'provideCouponObj.phoneNumbers': function(val) {
      if (val) {
        this.provideCouponObj.phoneNumbers = val
        this.$emit('provideCouponObj', this.provideCouponObj)
      }
    },
    'provideCouponObj.fileName': function(val) {
      if (val) {
        this.provideCouponObj.fileName = val
        this.$emit('provideCouponObj', this.provideCouponObj)
        console.log('this.provideCouponObj', this.provideCouponObj)
      }
    }

  },
  async mounted() {
    this.promotionAPI = this.$promotion.$api.promotion
    await this.remote()
  },
  methods: {
    handleRemove(file, fileList) {
      this.provideCouponObj.fileName = ''
    },
    handlePreview(file) {
      this.provideCouponObj.fileName = file.name
    },
    getCSVTemplate() {
      this.$portal.downloadFileByGet('/api/back-promotion-web/couponActivityRead/downloadCSVTemplate.action', {
        params: ''
      })
    },
    async remote() {
      if (this.provideCouponObj.fileName !== '') {
        this.$emit('provideCouponObj', this.provideCouponObj)
      }
    },
    async getPublicCodeSelect() {
      const { data } = await this.$promotion.$api.promotion.getPublicCodeSelect({
        category: 'ORDER_SOURCE'
      })

      return data
    }
    // handleGiftRuleChange(val) {
    //   if (val === 1) {
    //     this.provideCouponObj.fileName = null
    //   }
    //   if (val === 2) {
    //     this.provideCouponObj.phoneNumbers = null
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
  .cp-restrictions-time-scope{
    /deep/ {
      .el-radio {
        display: block;
        margin-bottom: 15px;
      }
    }
    .gift-limit-box {

      /deep/{
        .el-input-group__append {
          width: 128px;
        }
      }
    }
    .gift-limit-multy{
      font-size: 14px;
      width: 180px;
      display: inline-block;
      line-height: 32px;
    }
    .phoneColor {
      color: red;
    }
    .btn-block {
      display: block;
      margin-bottom: 10px
    }
  }
</style>

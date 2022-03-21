<template>
  <div class="pg-free-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑拼团活动') : $t('创建拼团活动')">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置拼团规则')" />
          <el-step :title="$t('设置参与商品')" />
        </el-steps>

        <promotion-group-step1
          v-if="steps === 0"
          ref="promotionGroupStep1"
          :promotion-id="promotionId"
          :prom-type="promotionType"
        />
        <promotion-participation-goods
          v-if="steps === 1"
          ref="promotionSetProduct"
          :promotion-id="promotionId"
          :prom-type="promotionType"
        />
      </div>

      <promotion-created-success
        v-if="steps > 1"
        :prom-type="promotionType"
        :promotion-id="promotionId"
      />
    </ody-box>
    <ody-fixed v-if="steps <= 1">
      <ody-button
        v-if="steps !==0 && steps <= 1"
        name="handleBack"
        type="default"
        code="button014"
        @click="handleBack"
      >{{ $t('上一步') }}</ody-button>
      <ody-button
        v-if="steps >=0 && steps < 1"
        :disabled="submiting"
        name="handleNext"
        type="primary"
        code="button015"
        @click="handleNext"
      >{{ $t('下一步') }}</ody-button>
      <ody-button
        v-if="steps === 1"
        :disabled="submiting"
        name="handleComplete"
        type="primary"
        code="button016"
        @click="handleComplete"
      >{{ $t('完成') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>
import PromotionGroupStep1 from '@/components/promotion-group-step1'
import PromotionParticipationGoods from '@/components/promotion-participation-goods'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  components: {
    PromotionGroupStep1,
    PromotionParticipationGoods,
    PromotionCreatedSuccess
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      submiting: false,
      steps: 0,
      promotionType: '2000',
      promotionAPI: null,
      promotionId: ''
    }
  },
  created() {
    this.promotionId = this.$route.params.promotionId || ''
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {},
  methods: {
    handleCom() {
      console.log('freePromoton', this.promotionGroup)
    },
    handleBack() {
      this.steps = --this.steps
    },
    handleComplete() {
      this.submiting = true
      this.promotionAPI.checkGrouponValue(this.promotionId).then(res => {
        this.steps = ++this.steps
      })
      this.submiting = false
    },
    saveAttendImages() {
      // 保存活动图片
      const paramsUrlList = this.$refs.promotionGroupStep1.getParamsUrlList()
      console.log('paramsUrlList', paramsUrlList)
      paramsUrlList.map((item, index) => {
        item.refTheme = this.promotionId
        if (index === 0) {
          item.isMainPic = 1
        }
      })
      this.promotionAPI.saveAttendImages({
        refType: 3,
        refTheme: this.promotionId,
        imageViews: paramsUrlList
      })
    },
    handleNext() {
      const vue = this
      vue.submiting = true
      if (this.$refs.promotionGroupStep1) {
        this.$refs.promotionGroupStep1.$refs.promotionGroup.validate((valid, object) => {
          if (valid) {
            const {
              createTime: [effStartDate, effEndDate],
              id,
              ...params
            } = vue.$refs.promotionGroupStep1.promotionGroup
            params.effStartDate = effStartDate
            params.effEndDate = effEndDate
            params.id = id
            if (this.promotionId === '') {
              this.promotionAPI.addPatchGrouponThemeUrl(params).then(res => {
                if (res && res.code === '0') {
                  this.promotionId = res.data
                  this.steps = ++this.steps
                  this.saveAttendImages()
                  vue.submiting = false
                }
              })
            } else {
              this.promotionAPI.savePatchGrouponTheme(params).then(res => {
                if (res && res.code === '0') {
                  this.steps = ++this.steps
                  this.saveAttendImages()
                  vue.submiting = false
                }
              })
            }
          } else {
            this.scrollToView(this, object)
            vue.submiting = false
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.$refs.promotionSetProduct) {
        if (this.$refs.promotionSetProduct.groupTable.data.length) {
          this.steps = ++this.steps
          vue.submiting = false
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('查询活动无商品')
          })
          vue.submiting = false
        }
      } else {
        vue.submiting = false
        this.steps = ++this.steps
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pg-single-promotion {
  .single-promotion-content {
    width: 800px;
  }
}
</style>


<template>
  <div class="cms-pc-multipic-images">
    <span class="multipic-tip">{{ $t('图片素材 建议宽度1200，类型png，jpg') }}</span>
    <ody-upload-image
      v-model="value.src"
      :on-success="setImgWidthHeight(value)"
      :pic-type="['png', 'jpg']"
      :pic-size="2048"
      :show-tip="true"
      name="image_src"
    />
    <cms-link-url v-model="value.link" :page-model="pageModel" :page-type="pageType" :plat-form="platForm" name="multipic_link"/>
  </div>
</template>

<script>
import CmsLinkUrl from '@/components/cms-link-url'
import getImgWidthHeight from '@/utils/getImgWidthHeight'
export default {
  components: {
    CmsLinkUrl
  },
  props: {
    value: {
      type: Object,
      default: () => ({ src: '', link: {}})
    },
    pageModel: {
      type: Object,
      default: () => ({ model: {}})
    },
    pageType: {
      type: String,
      default: ''
    },
    platForm: { // 平台 1:PC ,2:H5
      type: Number,
      default: 1
    }
  },
  mounted() {
    if (!this.value.src && !this.value.link) {
      this.value = { src: '', link: {}, oriWidth: 0, oriHeight: 0 }
    }
  },
  methods: {
    setImgWidthHeight(item) {
      if (item.src) {
        getImgWidthHeight(item.src).then(res => {
          item.oriWidth = res.width
          item.oriHeight = res.height
        })
      }
      this.$emit('input', item)
    }
  }
}
</script>

<style lang="less" scoped>
.cms-pc-multipic-images{
  .multipic-tip{
    font-size: 0.14rem;
    color:#ef5351;
  }
}
</style>

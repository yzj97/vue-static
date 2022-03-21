<template>
  <div v-if="platForm === 1 && formData.model.titleType === 1" class="cms-title-more-wrapper">
    <cms-link-url v-model="value" :page-model="pageModel" :page-type="pageType" :plat-form="platForm" name="item_link"/>
  </div>
</template>

<script>

import CmsLinkUrl from '@/components/cms-link-url'
export default {
  components: {
    CmsLinkUrl
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    formData: {
      type: Object,
      default: () => ({ model: { titleType: 0 }})
    },

    platForm: { // 平台 1:PC ,2:H5
      type: Number,
      default: 1
    },
    pageModel: {
      type: Object,
      default: () => {}
    },
    pageType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      titleType: 0 // 标题类型
    }
  },
  watch: {
    'formDta.model.titleType': {
      handler(val) {
        this.titleType = val
      }, deep: true
    },
    value: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>

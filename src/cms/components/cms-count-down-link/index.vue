<template>
  <div class="cms-count-down">
    <cms-link-url v-model="value" :showtip="false" :page-model="pageModel" :page-type="pageType" name="value" />
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
      type: String,
      default: ''
    },
    pageModel: {
      type: Object,
      default: () => ({ model: {}})
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>

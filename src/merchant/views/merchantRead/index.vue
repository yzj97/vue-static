<template>
  <div>
    <merchant-detail :id="orgId" :only-read="onlyRead"/>
  </div>
</template>
<script>
import MerchantDetail from '@/components/merchantDetail'
export default {
  name: 'MerchantRead',
  components: {
    MerchantDetail
  },
  data() {
    return {
      onlyRead: true
    }
  },
  computed: {
    orgId() {
      return this.$route.params.orgId
    }
  }
}
</script>

<template>
  <div>
    <merchant-detail :id="orgId" :org-code="orgCode" :org-name="orgName" :only-read="onlyRead"/>
  </div>
</template>
<script>
import MerchantDetail from '@/components/merchantDetail'
export default {
  name: 'MerchantEdit',
  components: {
    MerchantDetail
  },
  data() {
    return {
      onlyRead: false
    }
  },
  computed: {
    orgId() {
      return this.$route.params.orgId
    },
    orgCode() {
      return this.$route.params.orgCode
    },
    orgName() {
      return this.$route.params.orgName
    }
  }
}
</script>

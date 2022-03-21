<template>
  <div>
    <live-detail :detail.sync="edit" :edit="true" :view="true"/>
  </div>
</template>

<script>
import LiveDetail from '@/components/live-detail'
export default {
  name: 'LiveListDetail',
  components: {
    LiveDetail
  },
  data() {
    return {
      detail: {
        title: null,
        coverImg: null,
        channelCode: null,
        type: '0',
        storeId: null,
        userId: null,
        nickname: null,
        expectStartTime: null,
        pasterImg: null,
        shareImg: null,
        shareContent: null
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
    }
  }
}
</script>

<style scoped>

</style>

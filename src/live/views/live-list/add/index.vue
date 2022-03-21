<template>
  <div>
    <live-detail :detail.sync="detail" :edit="false" :view="false" />
  </div>
</template>

<script>
import LiveDetail from '@/components/live-detail'
export default {
  name: 'LiveListAdd',
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
  }
}
</script>

<style scoped>

</style>

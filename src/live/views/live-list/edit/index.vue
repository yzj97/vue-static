<template>
  <div>
    <live-detail :detail.sync="edit" :edit="true" :view="false" />
  </div>
</template>

<script>
import LiveDetail from '@/components/live-detail'
export default {
  name: 'LiveListEdit',
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
    init() {
    }
  }
}
</script>

<style scoped>

</style>

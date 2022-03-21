<template>
  <div>
    <detail :receive-detail="receiveDetail" :receive-code="receiveCode" :button-keys="buttonKeys" @onSuccess="init"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Detail from '@/components/receiveTask/detail'

export default {
  name: 'ReceiveTaskDetail',
  components: {
    Detail
  },
  data() {
    return {
      receiveDetail: {},
      receiveCode: null,
      buttonKeys: [],
      tempRoute: {}
    }
  },
  computed: {
    ...mapGetters([
      'language'
    ])
  },
  watch: {
    language() {
      this.setTagsViewTitle()
    }
  },
  created() {
    this.init()
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    async  init() {
      const self = this
      self.receiveCode = this.$route.params.receiveCode
      // this.buttonKeys = ['cancel', 'edit', 'copy', 'confirm', 'audit']
      await this.$pms.$api.receiveTask.getByReceiveCode({ receiveCode: self.receiveCode }).then(res => {
        self.receiveDetail = res.data
        if (self.receiveDetail.receiveStatus === 1) {
          self.buttonKeys = ['收货', '取消']
        } else if (self.receiveDetail.receiveStatus === 2) {
          self.buttonKeys = ['收货']
        } else {
          self.buttonKeys = []
        }
      })
    },
    setTagsViewTitle() {
      const title = this.$t('收货任务详情')
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.receiveCode}` })
      this.$store.dispatch('updateVisitedView', route)
    }
  }
}
</script>

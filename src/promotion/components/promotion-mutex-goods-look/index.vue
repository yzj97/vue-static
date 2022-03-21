<template>
  <div>
    <ody-choose
      :visible.sync="visible"
      :search-config="searchConfig"
      :search-value="searchValue"
      :request-url="requestUrl"
      :columns="columns"
      :highlight-current-row="false"
      :search-format="searchFormat"
      :title="$t('互斥提示')"
      @close="handleClose"
      @submit="handleSubmit"
    >
      <template slot="endTime" slot-scope="scope">
        <div>
          {{ scope.row.startTime | parseTime }} ~ {{ scope.row.endTime | parseTime }}
        </div>
      </template>
      <template slot="channelCodes" slot-scope="scope">
        {{ scope.row.channelCodes | getChannelName(channelMap) }}
      </template>
      <template slot="storeIds" slot-scope="scope">
        {{ scope.row.storeIds | getStorelName(storeMap) }}
      </template>
    </ody-choose>
  </div>
</template>

<script>
export default {
  filters: {
    getChannelName(channelCodes, channelMap) {
      if (channelCodes) {
        return channelCodes.map((item) => {
          return channelMap[item].channelName
        }).join('、')
      }

      return ''
    },
    getStorelName(storeIds, storeMap) {
      if (storeIds) {
        return storeIds.map((item) => {
          return storeMap[item].storeName
        }).join('、')
      }

      return ''
    }

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    referralCode: {
      type: String,
      default: ''
    },
    scopeId: {
      type: String | Number,
      default: ''
    },
    promType: {
      type: String | Number,
      default: ''
    }
  },
  data() {
    return {
      storeMap: {},
      channelMap: {},
      requestUrl: '/back-promotion-web/promotionChannelRead/queryMutexPromotionList.do',
      searchConfig: [],
      searchValue: {},
      columns: [
        {
          label: this.$t('互斥活动ID'),
          prop: 'promotionId',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('互斥活动名称'),
          show: true,
          minWidth: 160,
          prop: 'promTitle'
        },
        {
          label: this.$t('互斥活动时间'),
          slot: 'endTime',
          minWidth: 120, show: true
        },
        {
          label: this.$t('互斥渠道'),
          slot: 'channelCodes',
          minWidth: 120, show: true
        },
        {
          label: this.$t('互斥店铺'),
          slot: 'storeIds',
          minWidth: 120, show: true
        }
      ]
    }
  },
  mounted() {
    this.getChannelMap()
    this.queryPlatformAuthStorePage()
  },
  methods: {
    searchFormat(params) {
      return {
        obj: { ...params, scopeId: this.scopeId,
          promType: this.promType }
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSubmit() {
      this.handleClose()
    },
    async getChannelMap() {
      const { data } = await this.$api.channel.queryChannelMap({})

      this.channelMap = data
    },
    async queryPlatformAuthStorePage() {
      const res = await this.$promotion.$api.promotion.queryPlatformAuthStorePage({
        currentPage: 1,
        itemsPerPage: 99999
      })
      var storeObj = res.data.listObj.reduce((obj, item) => {
        obj[item.storeId] = item
        return obj
      }, {})
      this.storeMap = storeObj
    }
  }
}
</script>

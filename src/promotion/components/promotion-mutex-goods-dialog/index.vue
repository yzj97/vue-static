<template>
  <ody-dialog
    :visible.sync="visibleMutex"
    :title="$t('互斥提示')"
    width="960px">
    <div class="marb10">以下商品正在参与同类型的促销活动，本次审核将不通过，其他商品通过审核！</div>
    <ody-table
      :data="tableData"
      :can-filter="false"
      :columns="columns"
      name="tableData726">
      <template slot="endTime" slot-scope="scope">
        <div>
          {{ scope.row.startTime | parseTime }} ~ {{ scope.row.endTime | parseTime }}
        </div>
      </template>
      <template slot="channelCode" slot-scope="scope">
        {{ channelMap[scope.row.channelCode].channelName }}
      </template>
    </ody-table>
    <span slot="footer">
      <el-button name="handlerConfirm" size="small" type="primary" @click="handlerConfirm">{{ $t('继续通过') }}</el-button>
      <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {

  props: {
    visibleMutex: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      channelMap: {},
      columns: [
        {
          label: this.$t('互斥商品名称'),
          prop: 'name',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('互斥商品编号'),
          show: true,
          minWidth: 150,
          prop: 'code'
        },
        {
          label: this.$t('报名活动id'),
          show: true,
          minWidth: 100,
          prop: 'activityAttendId'
        },
        {
          label: this.$t('报名活动名称'),
          show: true,
          minWidth: 110,
          prop: 'attendTitle'
        },
        {
          label: this.$t('促销活动id'),
          show: true,
          minWidth: 150,
          prop: 'promotionId'
        },
        {
          label: this.$t('促销活动名称'),
          show: true,
          minWidth: 110,
          prop: 'promTitle'
        },
        {
          label: this.$t('促销活动时间'),
          slot: 'endTime',
          minWidth: 300, show: true
        },
        {
          label: this.$t('互斥渠道'),
          slot: 'channelCode',
          minWidth: 150, show: true
        }

      ]
    }
  },
  mounted() {
    this.getChannelMap()
  },
  methods: {
    handleClose() {
      this.$emit('update:visibleMutex', false)
    },
    handlerConfirm() {
      this.$emit('success')
      this.handleClose()
    },
    async getChannelMap() {
      const { data } = await this.$api.channel.queryChannelMap({})
      this.channelMap = data
    }
  }
}
</script>
<style lang="less" scope>
  .marb10 {
    margin-bottom: 10px;
  }
</style>

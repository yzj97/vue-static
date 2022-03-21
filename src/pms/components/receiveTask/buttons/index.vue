<template>
  <div class="button-box" style="padding-left: 10px;">
    <el-row >
      <span style="padding-left: 50px" class="detail">{{ $t('状态') }}</span>
    </el-row>
    <br>
    <el-row>
      <span style="size: 20px; padding-left: 40px;font-weight: bold">{{ getStatus() }}</span>
    </el-row>

    <el-row style="margin-top: 20px;">
      <span v-if="isShowButton('收货')" class="but">
        <ody-button name="receiveTask_name" code="ReceiveTask_receive" size="mini" type="primary" @click="handleReceive">{{ $t('收货') }}</ody-button>
      </span>
      <span v-if="isShowButton('取消')" class="but">
        <ody-button name="cancelReceiveTask_name" code="ReceiveTask_delete" size="mini" @click="cancelReceiveTask">{{ $t('取消') }}</ody-button>
      </span>
    </el-row>
    <!-- 收货任务模态框 -->
    <ReceiveModal
      ref="receiveModal"
      :visible.sync="showReceiveModal"
      :receive-detail.sync="receiveDetail"
      :receive-code.sync = "receiveCode"
      :receive-type.sync="receiveType"
      @ok="saveProduct" />
  </div>
</template>

<script>
import ReceiveModal from '@/components/receiveTask/receiveModal'
export default {
  components: {
    ReceiveModal
  },
  props: {
    buttonKeys: {
      type: Object,
      default: function() {
        return []
      }
    },
    receiveDetail: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      status: null,
      receiveCode: '',
      receiveType: 2,
      receiveStatusMap: {},
      showReceiveModal: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { data } = await this.$pms.$api.receiveTask.listMultiCode({
        categories: ['RECEIVE_TASK_STATUS']
      })
      this.receiveStatusMap = data.RECEIVE_TASK_STATUS.reduce((m, i) => { m[i.code] = i.name; return m }, {})
    },
    getStatus() {
      return this.receiveStatusMap[this.receiveDetail.receiveStatus + '' ]
    },
    isShowButton(key) {
      return this.buttonKeys.indexOf(key) >= 0
    },
    async cancelReceiveTask() {
      const res = await this.$confirm('确认取消收货任务吗?', '提示', {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })

      if (!res) {
        return
      }
      const ids = [this.receiveDetail.id]
      const result = await this.$pms.$api.receiveTask.batchCancel(ids)
      if (result && result.code === '0') {
        this.$message({
          type: 'success',
          message: this.$t('取消成功')
        })
        this.onSuccess()
      }
    },
    async onSuccess() {
      await this.$pms.$api.receiveTask.getByReceiveCode({ receiveCode: this.receiveDetail.receiveCode }).then(res => {
        this.receiveDetail.receiveStatus = res.data.receiveStatus
        this.init()
      })
      this.$emit('onSuccess')
    },
    handleReceive() {
      this.showReceiveModal = true
      this.receiveCode = this.receiveDetail.receiveCode
    }
  }
}
</script>

<style scoped>
  .detail {
    font-size: 14px;
    font-weight:400;
    color:rgba(153,171,180,1);
  }
  .but{
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 4px;
  }
</style>

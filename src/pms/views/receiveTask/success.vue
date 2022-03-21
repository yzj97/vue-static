<template>
  <div>
    <section class="pg-success" style="text-align:center; padding-top: 200px">
      <el-row>
        <el-button style="width:80px !important; height:80px !important; margin: 0px auto" type="success" circle >
          <i class="el-icon-check" style="font-size:60px;" />
        </el-button>
      </el-row>
      <el-row>
        <br>
        <h2>{{ $t('提交成功') }}</h2>
        <br>
        <span>{{ $t('收货任务单:') + message }}</span>
        <i v-clipboard:copy="message" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
        <br>
        <br>
      </el-row>
      <el-row>
        <ody-button
          name="continueAddReceiveTask"
          code="ui"
          size="small"
          type="primary"
          @click="addReceiveTask"
        >{{ $t('继续新增收货任务') }}</ody-button>
        <ody-button name="backReceiveTaskList" code="ui" size="small" @click="receiveTaskList">
          {{ $t('返回列表') }}
        </ody-button>
      </el-row>
    </section>
  </div>
</template>
<script>

export default {
  name: 'AddReceiveTaskSuccess',
  data() {
    return {
      message: null,
      menuName: 'ReceiveTaskAdd',
      receiveTaskListMenuName: 'ReceiveTaskList'
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    init() {
      if (this.$route.params.menuName) {
        this.menuName = this.$route.params.menuName
        this.$portal.delViewByName(this.menuName)
      }
      this.message = this.$route.params.message
    },
    addReceiveTask() {
      this.$router.push({
        name: this.menuName,
        params: {
          menuName: this.$route.name
        }
      })
      this.$portal.delViewByName('AddReceiveTaskSuccess')
    },
    receiveTaskList() {
      this.$router.push({
        name: this.receiveTaskListMenuName,
        params: {
          menuName: this.$route.name
        }
      })
      this.$portal.delViewByName('AddReceiveTaskSuccess')
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

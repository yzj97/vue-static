<template>
  <div>
    <ody-dialog :visible="visible" :before-close="handleClose" :title="$t('新增渠道')" @open="init">
      <el-table
        :data="list"
        name="list973"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column :label="$t('渠道编码')" prop="channelCode"/>
        <el-table-column :label="$t('渠道名称')" prop="channelName"/>
        <el-table-column :label="$t('渠道类型')" prop="channelTypeName"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('关闭') }}</el-button>
        <ody-button id="saveAddChannel" :disabled="checked.length === 0" name="MerchantManageChannelSave_handleOk" code="MerchantManageChannelSave" type="primary" @click="handleOk">{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      checked: [],
      list: []
    }
  },
  methods: {
    init() {
      const self = this
      self.list = []
      self.$merchant.$api.channelService.queryChannelMap().then(res => {
        const hadChannelMap = {}
        for (var i = 0; i < self.channels.length; i++) {
          hadChannelMap[self.channels[i].channelCode] = 1
        }
        for (const key in res.data) {
          if (!hadChannelMap[key]) {
            self.list.push(res.data[key])
          }
        }
      })
    },
    handleSelectionChange(val) {
      const self = this
      self.checked = val
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.checked = []
    },
    handleOk() {
      const vue = this
      vue.$emit('update:visible', !vue.visible)
      const selectChannels = []
      vue.checked.forEach((item, index) => {
        selectChannels.push(item.channelCode)
      })
      vue.$emit('ok', selectChannels)
      vue.checked = []
    }
  }
}
</script>

<style scoped>

</style>

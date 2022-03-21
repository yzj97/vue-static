<template>
  <div>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          v-if="!onlyRead"
          id="merchantManageChannelAdd"
          name="MerchantManageChannelAdd_addChannel"
          code="MerchantManageChannelAdd"
          size="mini"
          type="primary"
          @click="addChannel"
        >{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :data="channels" :columns="channelTable.columns" name="channels887">
          <template slot="status" slot-scope="scope">
            <div>
              <el-switch
                :disabled="!$portal.hasPermission('MerchantManageChannelEnable')"
                :value="scope.row.status"
                :active-text="scope.row.status === '1' ? $t('启用') : $t('禁用')"
                active-value="1"
                @change="updateChannelStatus($event, scope.row)"
              />
            </div>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <addMerchantChannelDialog
      :visible.sync="addChannelVisible"
      :channels.sync="channels"
      @ok="saveMerchantChannel"
    />
  </div>
</template>

<script>
import addMerchantChannelDialog from '@/components/addMerchantChannelDialog'

export default {
  components: {
    addMerchantChannelDialog
  },
  props: {
    orgId: {
      type: Number,
      default: null
    },
    onlyRead: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // const self = this
    return {
      addChannelVisible: false,
      channels: [],
      channelTable: {
        columns: [
          {
            show: true,
            slot: 'status',
            label: '操作',
            align: 'center',
            width: '120'
            // render: function(h, params) {
            //   const changeStatus = self.updateChannelStatus
            //   const onlyRead = self.onlyRead
            //   const hasPermission = !self.$portal.hasPermission(
            //     'MerchantManageChannelEnable'
            //   )
            //   console.log(hasPermission)
            //   return (
            //     <div
            //       on-click={e => changeStatus(params.row)}
            //       disabled={hasPermission}
            //     >
            //       <el-switch
            //         value={params.row.status}
            //         disabled={onlyRead}
            //         :active-text="$t('启用')"
            //         active-value="1"
            //       ></el-switch>
            //     </div>
            //   )
            // }
          },
          {
            show: true,
            prop: 'channelCode',
            label: '渠道编码',
            align: 'center'
          },
          {
            show: true,
            prop: 'channelName',
            label: '渠道名称',
            align: 'center'
          },
          {
            show: true,
            prop: 'channelClassify',
            label: '渠道类型',
            align: 'center'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.queryChannel()
    },
    queryChannel() {
      const vue = this
      vue.$merchant.$api.channelService.queryChannelMap().then(codeRes => {
        if (codeRes && codeRes.code === '0') {
          const codeMap = codeRes.data
          vue.$merchant.$api.merchantService
            .queryMerchantOrgChannelByOrgId(vue.orgId)
            .then(res => {
              if (res && res.code === '0' && res.data && res.data.listObj) {
                res.data.listObj.forEach((item, index) => {
                  item.channelClassify =
                    codeMap[item.channelCode].channelTypeName
                })
              }
              vue.channels = res.data.listObj
            })
        }
      })
    },
    addChannel() {
      this.addChannelVisible = true
    },
    saveMerchantChannel(selectChannels) {
      const vue = this
      if (selectChannels) {
        const params = {}
        params.orgId = vue.orgId
        params.channelCodes = selectChannels
        params.status = 1

        vue.$merchant.$api.merchantService
          .batchAddMerchantOrgChannel(params)
          .then(res => {
            if (res && res.code === '0') {
              vue.queryChannel()
              vue.$message.success('保存成功')
            }
          })
      }
    },
    updateChannelStatus(e, item) {
      if (!this.onlyRead) {
        const vue = this
        const params = { id: item.id, status: '0' }
        if (item.status === '0') {
          params.status = '1'
        }
        vue.$merchant.$api.merchantService
          .updateMerchantOrgChannelStatusById(params)
          .then(res => {
            vue.queryChannel()
            vue.$message.success('更新成功')
          })
      }
    }
  }
}
</script>

<style scoped>
</style>

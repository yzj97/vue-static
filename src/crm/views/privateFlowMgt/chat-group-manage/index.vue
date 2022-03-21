
<template>
  <div class="box">
    <div v-if="socketCloseFlag" name="init" class="re-link" @click="init()">聊天断开,点击重连</div>
    <div class="chat-group-manage">
      <div class="device-list">
        <chat-device-list :list="deviceList" :choose-index.sync="chooseDeviceIndex" @refresh="init"/>
      </div>
      <div class="chat-list">
        <chat-user-list :list="userList" :choose-index.sync="chooseUserIndex"/>
      </div>
      <div class="chat-row">
        <div class="chat-row-head">
          <div v-if="$portal.hasPermission('ChatGroupManage_newFriend')" name="openNewFriend" class="flex-item new-friend" @click="openNewFriend"/>
          <div v-if="$portal.hasPermission('ChatGroupManage_newGroup')" name="addGroup" class="flex-item add-group" @click="addGroup"/>
          <div v-if="$portal.hasPermission('ChatGroupManage_moment')" name="openFriendCircle" class="flex-item friend-circle" @click="openFriendCircle"/>
        </div>
        <div class="chat-row-bottom">
          <div class="chat-content">
            <chat-content
              :send-content="sendContent"
              :socket-data="socketData"
              :wechat-account-id="wechatAccountId"
              :wechat-id="wechatId"
              :user-info="userList[chooseUserIndex] || {}"
              @setContent="setContent"
            />
          </div>
          <div class="other-content">
            <chat-other-content :user-info="userList[chooseUserIndex] || {}" @setContent="setContent"/>
          </div>
        </div>
      </div>

    </div>

    <chat-new-friend-dialog v-if="dialogNewFriendVisible" :wechat-account-id="wechatAccountId" :visible.sync="dialogNewFriendVisible"/>
    <chat-friend-circle v-if="dialogFriendCircleVisible" :wechat-id="wechatId" :wechat-account-id="wechatAccountId" :visible.sync="dialogFriendCircleVisible"/>
  </div>

</template>

<script>
import ChatDeviceList from '@/components/chat-device-list'
import ChatUserList from '@/components/chat-user-list'
import ChatContent from '@/components/chat-content'
import ChatOtherContent from '@/components/chat-other-content'
import ChatNewFriendDialog from '@/components/chat-new-friend-dialog'
import ChatFriendCircle from '@/components/chat-friend-circle'
import UserConfig from 'src/config'

export default {
  name: 'CrmChatGroupManage',
  components: {
    ChatDeviceList,
    ChatUserList,
    ChatContent,
    ChatOtherContent,
    ChatNewFriendDialog,
    ChatFriendCircle
  },
  data() {
    return {
      wechatApi: this.$crm.$api.wechat,
      deviceList: [],
      userList: [],
      dialogNewFriendVisible: false,
      dialogFriendCircleVisible: false,
      chooseDeviceIndex: 0,
      chooseUserIndex: 0,
      wechatAccountId: '',
      socketIo: null,
      wechatId: '',
      socketData: {},
      sendContent: '',
      linkNum: 1,
      socketCloseFlag: false
    }
  },
  watch: {
    async chooseDeviceIndex(val) {
      this.wechatAccountId = this.deviceList[val].wechatAccountId
      this.wechatId = this.deviceList[val].wechatId
      await this.queryLastChatInfo(this.deviceList[val].wechatId)
      // 修改选中的用户并查询用户列表
      this.chooseUserIndex = 0
      // 通知socket当下的聊天用户
      if (this.userList.length > 0) {
        this.sendWebSocket()
      }
    },
    chooseUserIndex(val) {
      // 监听选中的用户 建立新的socket通信
      this.sendWebSocket()
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    async init() {
      await this.getDeviceList()
      this.initWebSocket()
      this.chooseDeviceIndex = 0
      if (this.deviceList.length > 0) {
        this.wechatAccountId = this.deviceList[0].wechatAccountId
        this.wechatId = this.deviceList[0].wechatId
        await this.queryLastChatInfo(this.deviceList[0].wechatId)
        // 通知socket当下的聊天用户
        if (this.userList.length > 0) {
          this.sendWebSocket()
        }
      }
    },
    setContent(data) {
      this.sendContent = data
    },
    initWebSocket() {
      const host = window.$ody.isDev ? UserConfig.BASE_API.split('//')[1] : location.host
      const protcol = location.protocol === 'http:' ? 'ws' : 'wss'
      this.socketIo = new WebSocket(`${protcol}://${host}/crm-web/socketServer`)
      this.socketIo.onopen = () => {
        this.linkNum = 1
        this.socketCloseFlag = false
        console.log('ws onopen')
      }
      this.socketIo.onclose = async() => {
        if (this.linkNum < 4) {
          this.linkNum++
          await this.init()
        } else {
          this.socketCloseFlag = true
        }
      }
      this.socketIo.onmessage = (e) => {
        var data = JSON.parse(e.data).data
        console.log(JSON.parse(e.data).data)
        if ((this.userList[this.chooseUserIndex].chatroomId &&
        this.userList[this.chooseUserIndex].chatroomId === data.chatroomId) ||
        this.userList[this.chooseUserIndex].wechatId === data.friendWechatId) {
          this.socketData = JSON.parse(e.data).data
        }
      }
    },
    sendWebSocket() {
      const userInfo = this.userList[this.chooseUserIndex]
      var message = {}
      if (userInfo.chatroomId) {
        message = { type: 'NewChatroomMessage', data: { chatroomId: userInfo.chatroomId, wechatId: this.wechatId }}
      } else {
        message = { type: 'NewFriendMessage', data: { friendWechatId: userInfo.wechatId, wechatId: this.wechatId }}
      }
      this.socketIo.send(JSON.stringify(message))
    },
    openNewFriend() {
      this.dialogNewFriendVisible = true
    },
    openFriendCircle() {
      this.dialogFriendCircleVisible = true
    },
    addGroup() {
      if (this.wechatAccountId === '') {
        this.$message('请先选择设备')
        return
      }
      this.$router.push({ name: 'CrmCreateGroup' })
    },
    async getDeviceList() {
      const res = await this.wechatApi.listAuthDevice({})
      this.deviceList = res.data
    },
    async queryLastChatInfo(wechatId) {
      const res = await this.wechatApi.queryLastChatInfo({ wechatId, itemsPerPage: 9999 })
      this.userList = res.data
    }
  }

}
</script>
<style lang="scss" scoped>
.re-link {
  font-size: 12px;
  color:#f56c6c;
  text-align: center;
  height: 26px;
  line-height: 26px;
  background: #fef0f0;
  cursor: pointer;
}
.el-image-viewer__btn {
  color: #111;
}

.chat-group-manage {
  display: flex;
  display: -webkit-flex;
  border: 1px solid #eeeeee;
  height: 650px;
  .device-list {
    width: 160px;
  }
  .chat-list {
    width: 220px;
  }
  .chat-row {
    flex: 1;
    .chat-row-head {
      height: 48px;
      background: #fff;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .flex-item{
        margin-right: 16px;
        font-size: 12px;
        color: #666;
        cursor: pointer;
      }
      .new-friend {
        background: url('./img/newFriend.png') no-repeat center center;
        width: 24px;
        height: 24px;
        background-size: 100%;
      }
      .add-group {
        background: url('./img/addGroup.png') no-repeat center center;
        width: 24px;
        height: 24px;
        background-size: 100%;
      }
       .friend-circle {
        background: url('./img/friendCircle.png') no-repeat center center;
        width: 24px;
        height: 24px;
        background-size: 100%;
      }
    }
    .chat-row-bottom {
      display: flex;
    }
  }
  .chat-content {
    flex: 1;
    -webkit-flex: 1;
  }

}
</style>

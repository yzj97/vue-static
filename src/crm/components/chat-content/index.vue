<template>
  <div class="chat-content-main">
    <div class="header">
      <div class="title">
        {{ userInfo.chatroomId ? userInfo.groupName : (userInfo.remark ? userInfo.remark : userInfo.nickname) }}
      </div>
      <!-- <div class="right-flex">
        <div v-permission="'ChatGroupManage_newFriend'" name="openNewFriend" class="flex-item" @click="openNewFriend">{{$t('新朋友')}}</div>
        <div v-permission="'ChatGroupManage_newGroup'" name="addGroup" class="flex-item" @click="addGroup">{{$t('新建群')}}</div>
        <div v-permission="'ChatGroupManage_moment'" name="openFriendCircle" class="flex-item" @click="openFriendCircle">{{$t('朋友圈')}}</div>
      </div> -->
    </div>
    <div class="content-main">
      <el-scrollbar ref="scrollbar" wrap-class="menu1-wrap2" style="height:380px">
        <div v-for="(item,index) in list" :key="index" :class="{'all-right':item.isSend}">
          <div v-if="index === 0 || (item.createTimestamp - list[index - 1].createTimestamp > maxGape) || $portal.parseTime(list[index - 1].createTimestamp, '{y}-{m}-{d}') !== $portal.parseTime(item.createTimestamp, '{y}-{m}-{d}')" class="center">
            <div style="color:#AAAAAA">{{ parseTime(item) }}</div>
          </div>
          <div v-if="centerMsgType.indexOf(item.msgType) === -1">
            <div v-if="!item.isSend && !item.recalled" class="left" >
              <div class="img">
                <el-image
                  :src="item.senderAvatar"
                  :preview-src-list="[item.senderAvatar]"
                  fit="fill"
                  style="width: 32px; height: 32px; border-radius: 50%"/>
              </div>
              <div class="content">
                <div class="time">{{ parseTime(item) }} </div>
                <div class="name">
                  {{ item.senderNickname }}
                </div>
                <div v-if="item.msgType===1" class="content-txt">
                  {{ item.content }}
                </div>
                <div v-else-if="item.msgType===3" class="content-img">
                  <el-image
                    :src="item.content"
                    :preview-src-list="[item.content]"
                    fit="fill"
                    style="width: 200px; border-radius:4px"/>
                </div>
                <div v-else-if="item.msgType===49" class="content-link">
                  <div class="content-txt" >
                    <el-link v-if="parseJSON(item.content).url" :href="parseJSON(item.content).url" style="font-size:12px" type="primary" target="_blank">{{ parseJSON(item.content).title }}</el-link>
                    <el-link v-else>{{ parseJSON(item.content).title ? parseJSON(item.content).title : '不支持的消息类型' }}</el-link>
                  </div>
                </div>
                <div v-else-if="item.msgType === 43" class="content-video">
                  <video :id="'upvideo' + index" :src="item.content" muted autoplay class="upload-video-value" />
                  <div class="upload-video-mask">
                    <i name="onPlay" class="el-icon-video-play" @click="onPlay(item, 'upvideo' + index)" />
                  </div>
                  <!-- <video id="video" :src="content" width="220px" preload="auto" controls="controls" webkit-playsinline="true"/> -->
                </div>
                <div v-else-if="item.msgType === 34" class="content-audio">
                  <audio v-if="item.content && JSON.parse(item.content).url" :src="JSON.parse(item.content).url" controls="controls"/>
                </div>
                <div v-else-if="item.msgType === 90001" class="content-txt">
                  <div v-if="item.content && JSON.parse(item.content).atId === 'announcement@all'" class="">
                    <div>@所有人</div>
                    <div v-for="(item, index) in JSON.parse(item.content).text.split('n')" :key="index">
                      {{ item }}
                    </div>
                  </div>
                  <div v-else-if="item.content && JSON.parse(item.content).atId !== 'announcement@all'" class="content-txt">
                    <div>{{ JSON.parse(item.content).text }}</div>
                  </div>
                </div>
                <div v-else-if="item.msgType === 436207665" class="content-hongbao">
                  <div class="content-split">
                    <div class="content-title">{{ JSON.parse(item.content).sendertitle }}</div>
                    <div class="content-sub">{{ '微信红包，请在手机端查看' }}</div>
                  </div>
                </div>
                <div v-else-if="item.msgType === 419430449" class="content-zhuanzhang">
                  <div class="content-split">
                    <div class="content-title">{{ JSON.parse(item.content).title + JSON.parse(item.content).feedesc }}</div>
                    <div class="content-sub">{{ '微信转账，请在手机端查看' }}</div>
                  </div>
                </div>
                <div v-else-if="item.msgType===47" class="content-img">
                  <el-image
                    :src="item.content.replace( item.senderWechatId + ':', '')"
                    :preview-src-list="[item.content.replace( item.senderWechatId + ':', '')]"
                    fit="fill"
                    style="width: 150px; border-radius:4px"/>
                </div>
                <div v-else class="content-link">
                  <div class="content-txt">
                    <el-link style="font-size:12px" type="primary" target="_blank">{{ $t('暂不支持的消息类型') }}</el-link>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.isSend && !item.recalled" class="right">
              <div class="content">
                <div class="time">{{ parseTime(item) }}</div>
                <div v-if="item.msgType===1" class="content-txt">
                  {{ item.content }}
                </div>
                <div v-else-if="item.msgType===3" class="content-img">
                  <el-image
                    :src="item.content"
                    :preview-src-list="[item.content]"
                    fit="fill"
                    style="width: 200px; border-radius:4px"/>
                </div>
                <div v-else-if="item.msgType===49" class="content-link">
                  <div class="content-txt" >
                    <el-link v-if="parseJSON(item.content).url" :href="parseJSON(item.content).url" style="font-size:12px" type="primary" target="_blank">{{ parseJSON(item.content).title }}</el-link>
                    <el-link v-else>{{ parseJSON(item.content).title ? parseJSON(item.content).title : '不支持的消息类型' }}</el-link>
                  </div>
                </div>
                <div v-else-if="item.msgType === 43" class="content-video">
                  <video :id="'upvideo' + index" :src="item.content" muted autoplay class="upload-video-value" />
                  <div class="upload-video-mask">
                    <i name="onPlay9" class="el-icon-video-play" @click="onPlay(item, 'upvideo' + index)" />
                  </div>
                  <!-- <video id="video" :src="content" width="220px" preload="auto" controls="controls" webkit-playsinline="true"/> -->
                </div>
                <div v-else-if="item.msgType === 34" class="content-audio">
                  <audio v-if="item.content && JSON.parse(item.content).url" :src="JSON.parse(item.content).url" controls="controls"/>
                </div>
                <div v-else-if="item.msgType === 90001" class="content-txt">
                  <div v-if="item.content && JSON.parse(item.content).atId === 'announcement@all'" class="">
                    <div>@所有人</div>
                    <div v-for="(item, index) in JSON.parse(item.content).text.split('n')" :key="index">
                      {{ item }}
                    </div>
                  </div>
                  <div v-else-if="item.content && JSON.parse(item.content).atId !== 'announcement@all'" class="content-txt">
                    <div>{{ JSON.parse(item.content).text }}</div>
                  </div>
                </div>
                <div v-else-if="item.msgType === 436207665" class="content-hongbao">
                  <div class="content-split">
                    <div class="content-title">{{ JSON.parse(item.content).sendertitle }}</div>
                    <div class="content-sub">{{ '微信红包，请在手机端查看' }}</div>
                  </div>
                </div>
                <div v-else-if="item.msgType === 419430449" class="content-zhuanzhang">
                  <div class="content-split">
                    <div class="content-title">{{ JSON.parse(item.content).title + JSON.parse(item.content).feedesc }}</div>
                    <div class="content-sub">{{ '微信转账，请在手机端查看' }}</div>
                  </div>
                </div>
                <div v-else-if="item.msgType===47" class="content-img">
                  <el-image
                    :src="item.content.replace( item.senderWechatId + ':', '')"
                    :preview-src-list="[item.content.replace( item.senderWechatId + ':', '')]"
                    fit="fill"
                    style="width: 150px; border-radius:4px"/>
                </div>
                <div v-else class="content-link">
                  <div class="content-txt">
                    <el-link style="font-size:12px" type="primary" target="_blank">{{ $t('暂不支持的消息类型') }}</el-link>
                  </div>
                </div>
              </div>
              <div class="img" style="margin-right: 16px">
                <el-image
                  :src="item.senderAvatar"
                  :preview-src-list="[item.senderAvatar]"
                  fit="fill"
                  style="width: 32px; height: 32px; border-radius: 50%"/>
              </div>
            </div>
          </div>
          <div v-else-if="item.msgType === 10000" class="center">
            <div class="content">
              <div class="content-txt">{{ item.content }}</div>
            </div>
          </div>
          <div v-else-if="item.msgType === 570425393" class="center">
            <div class="content">
              <div class="content-txt">{{ JSON.parse(item.content.replace(item.chatroomId + ':', '')).content }}</div>
            </div>
          </div>
          <div v-else class="center content-link">
            <div class="content-txt">
              <el-link style="font-size:12px" type="primary" target="_blank">{{ $t('暂不支持的消息类型') }}</el-link>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="content-input">
      <div v-if="$portal.hasPermission('ChatGroupManage_sendPicture')" class="top-btn">
        <el-upload
          :show-file-list="false"
          :http-request="httpRequest"
          :before-upload="beforeAvatarUpload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <div class="wen"/>
        </el-upload>
      </div>
      <div v-if="imgList.length > 0" class="img-list">
        <div v-for="(item,index) in imgList" :key="item" class="img-item">
          <i name="delImg" class="el-icon-circle-close icon-del" @click="delImg(index)"/>
          <el-image
            :src="item"
            :preview-src-list="[imgList]"
            fit="fill"
            style="width: 45px; height: 45px"/>
        </div>
      </div>
      <el-input
        :rows="imgList.length > 0 ? 3: 5"
        :autofocus="true"
        v-model.trim="textarea"
        :placeholder="$t('请输入内容')"
        class="text"
        type="textarea"
        @keyup.enter.native="sendMessage"/>
    </div>
    <div class="bottom-btn">
      <ody-button name="ChatGroupManage_sendMessage_sendMessage" code="ChatGroupManage_sendMessage" size="small" class="send-btn" round @click="sendMessage">{{ $t('发送') }}</ody-button>
    </div>
    <ody-dialog :visible.sync="videoVisible" :title="$t('视频')" @handleClose="handleClose">
      <div class="video-dialog">
        <video :src="selectedItem.content" class="dialog-video-size" controls="controls" />
      </div>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    sendContent: {
      type: String,
      default: ''
    },
    wechatAccountId: {
      type: String,
      default: ''
    },
    wechatId: {
      type: String,
      default: ''
    },
    userInfo: {
      type: Object,
      default: () => {}
    },
    socketData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      maxPicture: 7,
      maxGape: 2 * 3600 * 1000, // 2个小时消息间隔，显示消息的发送时间
      centerMsgType: [10000, 570425393], // 需要在中间显示的消息类型
      imgList: [],
      wechatApi: this.$crm.$api.wechat,
      textarea: '',
      list: [],
      flag: true,
      isMore: false,
      oldHeight: 0,
      videoVisible: false,
      selectedItem: {}
    }
  },
  watch: {
    sendContent: {
      handler(val) {
        if (val === '') return
        this.textarea = this.textarea + ' ' + val
        this.$emit('setContent', '')
      }
    },
    userInfo: {
      handler(val) {
        this.list = []
        this.isMore = false
        this.oldHeight = 0
        this.queryMessage()
      },
      deep: true,
      immediate: true
    },
    socketData: {
      handler(val) {
        if (!val.messageId) {
          return
        }
        const index = this.list.findIndex(item => item.messageId === val.messageId)
        // 撤回消息
        if (val.recalled) {
          this.$set(this.list, index, val)
        }
        if (index === -1) {
          this.list = [...this.list, ...[val]]
          this.scrollToBottom()
        }
      },
      deep: true
    }
  },
  mounted() {
    window.addEventListener('DOMMouseScroll', this.wheel, false)
    window.onmousewheel = this.wheel
  },
  destroyed() {
    window.removeEventListener('DOMMouseScroll', this.wheel, true)
  },
  methods: {
    parseJSON(content) {
      try {
        return JSON.parse(content)
      } catch (e) {
        return {}
      }
    },
    checkImgSize() {
      if (this.imgList.length >= this.maxPicture) {
        this.$message.error('超出最大图片数量')
        return false
      }
      return true
    },
    parseTime(item) {
      const date = new Date()
      const today = this.$portal.parseTime(date, '{y}-{m}-{d}')
      const month = this.$portal.parseTime(date, '{y}-{m}')
      const year = this.$portal.parseTime(date, '{y}')

      const itemToday = this.$portal.parseTime(item.createTimestamp, '{y}-{m}-{d}')
      const itemMonth = this.$portal.parseTime(item.createTimestamp, '{y}-{m}')
      const itemYear = this.$portal.parseTime(item.createTimestamp, '{y}')
      if (today === itemToday) {
        return this.$portal.parseTime(item.createTimestamp, '{h}:{i}')
      } else if (month === itemMonth || year === itemYear) {
        return this.$portal.parseTime(item.createTimestamp, '{m}-{d} {h}:{i}')
      }
      return this.$portal.parseTime(item.createTimestamp, '{y}-{m}-{d} {h}:{i}')
    },
    onPlay(item, id) {
      // const video = this.$refs.video
      this.selectedItem = item
      const video = document.getElementById(id)
      this.handleClose()
      video.play()
    },
    handleClose() {
      this.videoVisible = !this.videoVisible
    },
    delImg(index) {
      this.imgList.splice(index, 1)
    },
    httpRequest(obj, file, fileList) {
      if (!this.checkImgSize()) {
        return
      }
      const params = new FormData()

      params.append('Filedata', obj.file)

      this.$portal.post('/cms/file/uploadFile.do', params).then(result => {
        if (result && result.code === '0') {
          this.imgList.push(result.data)
        }
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/bmp')
      const isLt2M = file.size / 1024 / 1024 < 5
      if (file.name.length >= 50) {
        this.$message.error('上传图片文件名过长!')
        return false
      }
      if (!isJPG) {
        this.$message.error('上传图片格式不正确!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    sendMessageApi(params) {
      this.wechatApi.sendMessage(params).then(res => {
        const index = this.list.findIndex(item => item.messageId === res.data.messageId)
        if (index === -1) {
          this.list.push(res.data)
        }
        this.scrollToBottom()
      })
    },
    sendMessageImg(item) {
      const params = {
        msgType: 3,
        wechatId: this.userInfo.chatroomId ? this.userInfo.wechatId : this.userInfo.ownerWechatId,
        wechatChatroomId: this.userInfo.wechatChatroomId,
        content: item,
        wechatFriendId: this.userInfo.chatroomId ? null : this.userInfo.wechatAccountId
      }
      this.sendMessageApi(params)
    },
    sendMessage() {
      if (!this.$portal.hasPermission('ChatGroupManage_sendMessage')) {
        return
      }

      if (this.imgList.length > 0) {
        this.imgList.map(item => {
          this.sendMessageImg(item)
        })
        this.imgList = []
      }
      if (this.textarea === '') return
      const params = {
        msgType: 1,
        wechatId: this.userInfo.chatroomId ? this.userInfo.wechatId : this.userInfo.ownerWechatId,
        wechatChatroomId: this.userInfo.wechatChatroomId,
        content: this.textarea,
        wechatFriendId: this.userInfo.chatroomId ? null : this.userInfo.wechatAccountId
      }
      this.textarea = ''
      this.sendMessageApi(params)
    },
    scrollToBottom() {
      // 恢复滚动条原来的高度
      setTimeout(() => {
        var newHeight = this.$refs['scrollbar'].wrap.lastChild.offsetHeight
        this.$refs['scrollbar'].wrap.scrollTop = newHeight
        this.flag = true
      }, 200)
    },
    scrollToBar() {
      // 恢复滚动条原来的高度
      setTimeout(() => {
        var newHeight = this.$refs['scrollbar'].wrap.lastChild.offsetHeight
        this.$refs['scrollbar'].wrap.scrollTop = (newHeight - this.oldHeight)
        this.flag = true
      }, 200)
    },
    queryMessage(messageId) {
      if (!this.userInfo.wechatId || this.isMore) return
      const params = {
        preMessageId: messageId || null,
        currentPage: 1,
        itemsPerPage: 10,
        wechatId: this.userInfo.chatroomId ? this.userInfo.wechatId : this.userInfo.ownerWechatId,
        friendWechatId: this.userInfo.chatroomId ? null : this.userInfo.wechatId,
        chatroomId: this.userInfo.chatroomId
      }
      if (messageId) {
        this.oldHeight = this.$refs['scrollbar'].wrap.lastChild.offsetHeight
      }
      this.wechatApi.queryMessage(params).then(res => {
        if (res.total === 0) {
          this.isMore = true
          return
        }
        this.list = [...res.data, ...this.list]
        if (messageId) {
          this.scrollToBar()
        } else {
          this.scrollToBottom()
        }
      })
    },
    addGroup() {
      if (this.wechatAccountId === '') {
        this.$message('请先选择设备')
        return
      }
      this.$router.push({ name: 'CrmCreateGroup' })
    },
    openNewFriend() {
      if (this.wechatAccountId === '') {
        this.$message('请先选择设备')
        return
      }
      this.$emit('openNewFriend')
    },
    openFriendCircle() {
      if (this.wechatAccountId === '') {
        this.$message('请先选择设备')
        return
      }
      this.$emit('openFriendCircle')
    },
    listenScrollbar() {
      // console.log(this.$refs['scrollbar'].wrap.scrollTop)
      const scrollTop = this.$refs['scrollbar'].wrap.scrollTop

      if (scrollTop < 20 && this.flag) {
        this.flag = false
        this.queryMessage(this.list[0].messageId)
      }
    },
    wheel(event) {
      var delta = 0
      if (!event) event = window.event
      if (event.wheelDelta) { // IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
        delta = event.wheelDelta / 120
        if (window.opera) delta = -delta// 因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
      } else if (event.detail) { // FF浏览器使用的是detail,其值为“正负3”
        delta = -event.detail / 3
      }
      if (delta > 0) {
        this.listenScrollbar()
      }
    }

  }
}
</script>

<style lang="less" scoped>
/deep/.el-textarea__inner {
    background: #ffffff;
    resize: none;
    border: none;
    outline: none;
    padding: 0;
}
.img-list {
  display: flex;
  .img-item {
    margin-right: 10px;
    position: relative;
    .icon-del{
      position: absolute;
      z-index: 999;
      top: -6px;
      right: -4px;
      color: #409eff;
      cursor: pointer;
    }
  }

}
.left {
  width: 360px;
  display: flex;
  margin: 18px 0;
  .img {
    margin-right: 10px;
  }
  .content{
    position: relative;
    .name{
      color: #999;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .content-txt {
      background: #ffffff;
      border-radius: 6px;
      padding: 8px;
      color: #333;
      font-size: 12px;
      line-height: 16px;
      word-break: break-word;
    }
    .time {
      display: none;
    }
  }
  .content:hover {
    .time {
      width: 200px;
      position: absolute;
      left: 0px;
      top:  -15px;
      display: block;
      color: #AAAAAA;
    }
  }
}
.all-right {
  text-align: -webkit-right;
}
.right {
  width: 360px;
  display: flex;
  margin: 14px 0;
  justify-content: flex-end;
  .content {
    position: relative;
    .content-txt {
      background: #ffffff;
      border-radius: 6px;
      padding: 8px;
      color: #333;
      font-size: 12px;
      line-height: 16px;
      text-align: left;
      word-break: break-word;
    }
    .time {
      display: none;
    }
  }
  .content:hover {
    .time {
      width: 200px;
      position: absolute;
      top:  -15px;
      right: 0px;
      display: block;
      color: #AAAAAA;
    }
  }
  .img{
    margin-left: 10px;
  }
}
.center {
  width: 100%;
  display: flex;
  margin: 14px 0;
  justify-content: center;
  .content {
    .content-txt {
      background: #eeeeee;
      border-radius: 6px;
      padding: 8px;
      color: #333;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      word-break: break-word;
    }
  }
  .img{
    margin-left: 10px;
  }
}
.content-hongbao {
  .content-split {
    background: #FFFFFF;
    .content-title {
      padding: 15px 30px;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 20px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      background-color: #F25643;
    }
    .content-sub {
      padding: 5px 10px;
      font-size: 8px;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
}
.content-zhuanzhang {
  .content-split {
    background: #FFFFFF;
    .content-title {
      padding: 15px 30px;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 20px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      background-color: #FA9C3E;
    }
    .content-sub {
      padding: 5px 10px;
      font-size: 8px;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
}
.chat-content-main {
  height: 100%;
  background: #F8F8F8;
  border-right: 1px solid #eeeeee;
  border-left: 1px solid #eeeeee;
  display: flex;
  flex-direction: column;
  .header {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    .title{
      font-weight: 600;
      padding-left: 16px;
      font-size: 14px;
    }
    .right-flex {
      display: flex;
      .flex-item{
        margin-right: 16px;
        font-size: 12px;
        color: #666;
        cursor: pointer;
      }
    }
  }
  .content-main {
    flex: 1;
    padding: 0 0 0 16px;
    font-size: 12px;
    height: 380px;

  }
  .content-input {
    border-top: 1px solid #eeeeee;
    height: 172px;
    padding: 6px 16px 20px 16px;
    background: #ffffff;
    .text {
      font-size: 12px;
      color: #333;
    }

  }
  .top-btn {
    .wen {
      width: 24px;
      height: 24px;
      background: url('./img/wen.png') no-repeat center center;
      background-size: 100%;
    }
  }
  .bottom-btn {
    position: relative;
     .send-btn {
      position: absolute;
      right: 16px;
      bottom: 10px;
      font-size: 12px;
    }

  }
  .content-video {
    position: relative;
  }
  .upload-video-value {
    width: 150px;
    height: 150px;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    margin: 0 8px 8px 0;
    object-fit: fill;
  }
  .upload-video-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 150px;
    height: 150px;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    border-radius: 6px;
    line-height: 150px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
  }
  .upload-video-mask:hover {
    opacity: 1;
  }
  .upload-video-mask i {
    padding: 0 5px;
  }
  .dialog-video-size {
    width: 100%;
    object-fit: fill;
  }
}
</style>

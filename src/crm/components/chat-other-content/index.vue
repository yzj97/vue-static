<template>
  <div >
    <div class="chat-btn">
      <div v-if="isShow" name="hideContent" class="btn-right" @click="hideContent"/>
      <div v-if="!isShow" name="hideContent5" class="btn-left" @click="hideContent"/>
    </div>
    <div v-if="isShow" class="chat-other-content">
      <div class="header">
        <div class="tabs">
          <div v-if="userInfo.chatroomId" :class="{active: active === 1}" name="changeTabs" class="tabs-item" @click="changeTabs(1)">{{ $t('信息') }}</div>
          <div :class="{active: active === 2}" name="changeTabs1" class="tabs-item" @click="changeTabs(2)">{{ $t('商品') }}</div>
          <div :class="{active: active === 3}" name="changeTabs5" class="tabs-item" @click="changeTabs(3)">{{ $t('话术') }}</div>
        </div>
      </div>
      <div class="main">
        <div v-if="active === 1" class="message main-item">
          <chat-other-content-message :user-info="userInfo"/>
        </div>
        <div v-if="active === 2" class="goods main-item">
          <chat-other-content-goods @setContent="setContent"/>
        </div>
        <div v-if="active === 3" class="speech main-item">
          <chat-other-content-speech @setContent="setContent"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import ChatOtherContentMessage from '@/components/chat-other-content-message'
import ChatOtherContentGoods from '@/components/chat-other-content-goods'
import ChatOtherContentSpeech from '@/components/chat-other-content-speech'
export default {
  components: {
    ChatOtherContentMessage,
    ChatOtherContentGoods,
    ChatOtherContentSpeech
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      active: 1,
      isShow: true
    }
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val.chatroomId) {
          this.active = 1
        } else {
          this.active = 2
        }
      }
    }
  },
  methods: {
    hideContent() {
      this.isShow = !this.isShow
    },
    setContent(data) {
      this.$emit('setContent', data)
    },
    changeTabs(index) {
      this.active = index
    }
  }
}
</script>

<style lang="less" scoped>
.chat-btn {
  position: relative;
  .btn-right {
    position: absolute;
    width: 12px;
    height: 20px;
    background: url('./img/right.png') no-repeat center center;
    background-size: 100%;
    top: 14px;
    z-index: 99;
    cursor: pointer;
  }
  .btn-left {
    position: absolute;
    width: 12px;
    height: 20px;
    background: url('./img/left.png') no-repeat center center;
    background-size: 100%;
    top: 14px;
    left: -12px;
    z-index: 99;
    cursor: pointer;
  }
}
.chat-other-content {
  width: 200px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  height: 100%;
  .header {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #eeeeee;

    .tabs {
      display: flex;
      .tabs-item {
        flex: 1;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
      }
      .active {
        color: #1890FF;
        position: relative;
        &::after {
          content: '';
          height: 2px;
          position: absolute;
          bottom: 0;
          left: 14px;
          right: 14px;
          background: #1890FF;
        }
      }
    }
  }
  .main {
    flex: 1;
    .main-item {
      height: 100%;
    }
  }
}

</style>

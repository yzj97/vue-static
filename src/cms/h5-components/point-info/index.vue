<template>
  <div v-if="showIt" class="point-info-page">
    <div class="point-info">
      <div class="left">
        <img :src="baseConfig.userInfo && baseConfig.userInfo.headPicUrl" alt="">
        <div class="user-info">
          <div class="user-name">Hi,{{ baseConfig.userInfo && baseConfig.userInfo.nickname }}</div>
          <div class="user-member">{{ baseConfig.levelName }}</div>
        </div>
      </div>
      <div name="goPointPage" class="right" @click="goPointPage">
        <span class="point-label">{{ $t('积分余额') }}:</span>
        <span class="point">{{ baseConfig.accountPoint }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    operation: {
      type: Object,
      default: () => {}
    },
    baseConfig: {
      type: Object,
      default: () => {}
    },
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {

    }
  },
  computed: {
    showIt() {
      if (this.baseConfig.isEdit) {
        return true
      } else {
        if (this.baseConfig.isLogin) {
          return true
        } else {
          return false
        }
      }
    }
  },
  mounted() {
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    goPointPage() {
      if (!this.baseConfig.isEdit) {
        location.href = '/my/integral.html'
      }
    }
  }

}
</script>

<style lang="less" scoped>
.point-info-page {
  box-sizing: border-box;
  padding: 0 .08rem;
  .point-info {
    height: .45rem;
    border-radius: .45rem;
    background: #F8F8F8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      margin-left: 0.05rem;
      img {
        width: .36rem;
        height: .36rem;
        display: block;
        border-radius: 50%;

      }
      .user-info {
        margin-left: 0.09rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .user-name {
          font-size: .12rem;
          color: #222222;
          width: 2rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .user-member {
          color: #222222;
          font-size: .12rem;
          transform: scale(0.83);
          margin-left: -.1rem;
          width: 1rem;
        }
      }
    }
    .right {
      margin-right: .18rem;
      .point-label {
        font-size: .12rem;
        color: #999999;
      }
      .point {
        color: #222222;
        font-size: .14rem;
        font-weight: 700;
      }
    }
  }
}
</style>

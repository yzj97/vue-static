<template>
  <div>
    <div
      ref="header"
      :style="headerStyle"
      :class="{'pos-ab': baseConfig.isEdit, 'pos-fixed': !baseConfig.isEdit,'pos-overflow':model.manner===1}"
      class="header"
    >
      <!-- {{ model }} -->
      <div v-if="model.manner===1" ref="manner" class="manner-a">
        <div class="top">
          <div
            v-if="model.btnShow.displayLocation"
            name="chooseLocation"
            class="location"
            @click="chooseLocation"
          >
            <img v-if="model.locationIcon" :src="model.locationIcon" class="location-icon" >
            <div :style="locationName" class="location-name">{{ baseConfig.locationCity || '上海' }}</div>
            <img v-if="model.downIcon" :src="model.downIcon" class="location-choose" >
          </div>
          <div v-if="model.btnShow.displayNews" name="goMessage" class="message" @click="goMessage">
            <img v-if="model.newsIcon" :src="model.newsIcon" class="news-icon" >
            <span
              v-if="baseConfig.messageCount > 0"
              class="message-count"
            >{{ baseConfig.messageCount }}</span>
          </div>
        </div>
        <div :style="searchStyle" name="goSearch" class="search" @click="goSearch">
          <img v-if="model.searchIcon" :src="model.searchIcon" class="search-icon" >
          <div>{{ model.searchTxt }}</div>
        </div>
      </div>
      <div v-else ref="manner" class="manner-b">
        <div class="manner-b-inner">
          <div
            v-if="model.btnShow.displayLocation"
            name="chooseLocation0"
            class="location"
            @click="baseConfig.isO2O?changeMask():chooseLocation()"
          >
            <img
              v-if="model.locationIcon"
              :src="model.locationIcon"
              :style="{'marginRight':baseConfig.isO2O?'0.18rem':'0.01rem'}"
              class="location-icon"
            >
            <div
              v-if="baseConfig.isB2C"
              :style="locationName"
              class="location-name"
            >{{ baseConfig.locationCity || '上海' }}</div>
            <img
              v-if="model.downIcon && baseConfig.isB2C"
              :src="model.downIcon"
              class="location-choose"
            >
          </div>
          <div :style="searchStyle" name="goSearch0" class="search" @click="goSearch">
            <img v-if="model.searchIcon" :src="model.searchIcon" class="search-icon" >
            <div>{{ model.searchTxt }}</div>
          </div>
          <div
            v-if="model.btnShow.displayNews"
            name="goMessage1"
            class="message"
            @click="goMessage"
          >
            <img v-if="model.newsIcon" :src="model.newsIcon" class="news-icon" >
            <span
              v-if="baseConfig.messageCount > 0"
              class="message-count"
            >{{ baseConfig.messageCount }}</span>
          </div>
          <div v-if="isFixedShow && baseConfig.isO2O" class="manner-b-fixed">
            <div name="chooseLocation" class="contant-name" @click="chooseLocation">
              <div class="name-text">{{ baseConfig.locationCity || '上海' }}</div>
              <img src="../../img/next.png" class="next-icon" >
            </div>
            <img name="isFixedShow" src="../../img/close.png" class="closeImg" @click="isFixedShow = false" >
          </div>
        </div>
      </div>
    </div>
    <div ref="editStyle" />
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'

export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    operation: {
      // 传入对于商品 优惠券 的基础操作 比如 请求商品 加入购物车 跳转到详情页面
      type: Object,
      default: () => {}
    },
    baseConfig: {
      // 传入对于商品 优惠券 组件的基础config
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
      isFixedShow: true
    }
  },
  computed: {
    locationName() {
      if (this.model.style === 1) {
        return {
          color: '#333333'
        }
      } else {
        return {
          color: '#ffffff'
        }
      }
    },
    searchStyle() {
      if (this.model.style === 1) {
        return {
          background: '#FAFAFA'
        }
      } else {
        return {
          background: '#ffffff'
        }
      }
    },
    headerStyle() {
      const background = this.model.background
      var style = {}
      if (background.style === 1) {
        if (background.color) {
          style.background = background.color
        }
      } else if (background.style === 2) {
        if (background.startColor && background.endColor) {
          style.background = `linear-gradient(${background.startColor}, ${background.endColor})`
        }
      }
      if (this.model.manner === 1) {
        style.height = '0.9rem'
      } else if (this.model.manner === 2) {
        style.height = '0.5rem'
      }
      return style
    }
  },
  watch: {
    model: {
      handler(val) {
        this.countHeight()
      },
      deep: true,
      immediate: true
    },
    'model.manner': {
      handler(val) {
        this.getHeaderHeight()
      },
      deep: true
    }
  },
  mounted() {
    eventBus.$on('CmsChangeBgColor', this.changeBgColorOn)
    this.$nextTick(() => {
      // 确保通信是已经渲染
      this.getHeaderHeight()
    })
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(
        this.$el,
        this.itemData.id,
        this.baseConfig.pageId
      )
    }
  },
  beforeDestroy() {
    eventBus.$off('CmsChangeBgColor', this.changeBgColorOn)
  },
  methods: {
    changeBgColorOn(res) {
      const background = this.model.background
      if (
        (background.style === 1 && background.color) ||
        (background.style === 2 && background.startColor && background.endColor)
      ) {
        return
      }
      this.$nextTick(() => {
        if (this.$refs['manner']) {
          if (this.model.manner === 1) {
            this.$refs['manner'].style.height = 0.9 + res.height / 100 + 'rem'
          } else if (this.model.manner === 2) {
            this.$refs['manner'].style.height = 0.5 + res.height / 100 + 'rem'
          }
          this.$refs['manner'].style.background = res.background
        }
      })
    },
    getHeaderHeight() {
      // 对轮播图的通信
      let height
      if (this.model.manner === 1) {
        height = 90
      } else if (this.model.manner === 2) {
        height = 50
      }
      eventBus.$emit('CmsHeaderHeight', height)
    },
    countHeight() {
      this.$nextTick(() => {
        this.$refs['editStyle'].style.height =
          this.$refs['header'].offsetHeight + 'px'
      })
    },
    goSearch() {
      if (!this.baseConfig.isEdit && this.operation.goSearch) {
        // location.href = '/search.html'
        this.operation.goSearch()
      }
    },
    goMessage() {
      if (!this.baseConfig.isEdit) {
        location.href = '/message/message-center.html'
      }
    },
    chooseLocation() {
      if (this.operation.chooseLocation) {
        this.operation.chooseLocation()
      }
    },
    changeMask() {
      var isFixedShow = this.isFixedShow
      this.isFixedShow = !isFixedShow
    }
  }
}
</script>

<style lang="scss" scoped>
.pos-fixed {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
  // overflow: hidden;
}

.pos-overflow {
  overflow: hidden;
}

.pos-ab {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 99;
  // overflow: hidden;
}

.manner-a {
  // height: 2.2rem;
  padding: 0.1px 0.12rem;

  .top {
    overflow: hidden;
    margin: 0.1rem 0;

    .location {
      display: flex;
      float: left;
      justify-content: space-between;
      align-items: center;

      .location-icon {
        width: 0.2rem;
        height: 0.2rem;
      }

      .location-name {
        font-size: 0.16rem;
        max-width: 1.35rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .location-choose {
        width: 0.2rem;
        height: 0.2rem;
      }
    }

    .message {
      float: right;

      // position: relative;
      .news-icon {
        width: 0.22rem;
        height: 0.22rem;
      }

      .message-count {
        position: absolute;
        color: #ffffff;
        background: #ff2300;
        border-radius: 50%;
        z-index: 99;
        padding: 0 0.06rem;
        min-width: 0.07rem;
        height: 0.16rem;
        line-height: 0.16rem;
        top: 0.06rem;
        right: 0.04rem;
      }
    }
  }

  .search {
    margin-bottom: 0.12rem;
    width: 100%;
    height: 0.32rem;
    color: #959595;
    border-radius: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .search-icon {
      height: 0.2rem;
      width: 0.2rem;
      margin-right: 0.08rem;
    }
  }
}

.manner-b {
  height: 0.5rem !important; //这个是为了让定位的下来款展示出来
  padding: 0.1px 0.12rem;

  .manner-b-inner {
    height: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .location {
      display: flex;
      align-items: center;

      .location-icon {
        width: 0.2rem;
        height: 0.2rem;
      }

      .location-name {
        font-size: 0.16rem;
        max-width: 0.5rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .location-choose {
        width: 0.2rem;
        height: 0.2rem;
      }
    }

    .search {
      flex: 1;
      height: 0.32rem;
      color: #959595;
      border-radius: 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .search-icon {
        height: 0.2rem;
        width: 0.2rem;
        margin-right: 0.08rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .news-icon {
        margin-left: 0.04rem;
        width: 0.22rem;
        height: 0.22rem;
      }

      .message-count {
        position: absolute;
        color: #ffffff;
        background: #ff2300;
        border-radius: 50%;
        z-index: 99;
        padding: 0 0.06rem;
        min-width: 0.07rem;
        height: 0.16rem;
        line-height: 0.16rem;
        top: 0.08rem;
        right: 0.04rem;
      }
    }

    .manner-b-fixed {
      position: absolute;
      width: 100%;
      top: 0.4rem;
      left: 0.13rem;
      width: 3.5rem;
      height: 0.46rem;
      background: url("../../img/header-fixed.png") no-repeat center center;
      background-size: 100%;
      padding-left: 0.16rem;
      padding-right: 0.15rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      border-radius: 0.08rem 0.04rem 0.04rem 0.04rem;
      padding-top: 0.06rem;

      .contant-name {
        display: flex;
        align-items: center;
        cursor: default;

        .next-icon {
          width: 0.2rem;
          height: 0.2rem;
        }

        .name-text {
          max-width: 1.8rem;
          font-size: 0.16rem;
          color: #ffffff;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      .closeImg {
        width: 0.18rem;
        height: 0.18rem;
      }
    }
  }
}
</style>

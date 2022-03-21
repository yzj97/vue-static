<template>
  <div class="cp-cms-video">
    <div class="contentStyle">
      <div class="app-decorator-wapper">
        <div class="index-video-v1">
          <div v-if="!model.src" class="video">
            <video
              v-show="showVideo"
              id="video"
              :src="model.videoInfo?model.videoInfo.url:''"
              preload="auto"
              controls
              style="object-fit:fill;display:none;"
              @canplay="getVideo"
            />
            <img v-show="showImg" :src="model.videoInfo.imagsrc" >
            <i v-show="!showVideo" name="videoPlay" class="play" @click="videoPlay"/>
          </div>
          <div v-else class="video">
            <video
              v-show="showVideo"
              id="video"
              :src="model.videoInfo?model.videoInfo.url:''"
              preload="auto"
              controls
              style="object-fit:fill;display:none;"
              @canplay="getVideo"
            />
            <img v-show="showImg" :src="model.src" alt>
            <i v-show="!showVideo" name="videoPlay0" class="play" @click="videoPlay"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => ({ videoInfo: {}})
    },
    itemData: {
      type: Object,
      default: () => {}
    },
    baseConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      video: null,
      showImg: true,
      showVideo: false
    }
  },
  mounted: function() {
    this.getVideo()
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    // 获取video对象
    getVideo: function() {
      this.video = document.getElementById('video')
    },

    videoPlay: function() {
      if (this.video.paused) {
        this.video.play()
        this.showVideo = true
        this.showImg = false
      } else {
        this.video.pause()
        this.showVideo = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-video {
  position: relative;
  z-index: 1;
  .contentStyle {
    padding: 0.12rem;
    position: relative;
  }
  .index-video-v1 .video {
    position: relative;
    min-height: 0.7rem;
    video {
      width: 100%;
      vertical-align: baseline;
      box-sizing: border-box;
    }
    img {
      width: 100%;
      vertical-align: middle;
      border: 0;
    }
    .play {
      background-image: url(http://cdn.oudianyun.com/h5_static/play.png?v=1583826858753);
      background-size: cover;
      display: block;
      width: 0.66rem;
      height: 0.66rem;
      z-index: 50;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -0.32rem;
      margin-top: -0.32rem;
      font-size: normal;
    }
  }
}
</style>

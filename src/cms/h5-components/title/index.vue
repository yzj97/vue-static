<template>
  <div class="cp-cms-title">
    <div
      :style="contentStyle"
      class="content">
      <div v-if="model.titleType === 2 && model.titlePosition === 'left' " class="type2-left">
        <div v-if="model.leftUrl" class="img-left">
          <img :src="model.leftUrl" :style="imgStyle">
        </div>
        <div>{{ model.titleName }}</div>
      </div>
      <div v-else-if="model.titleType === 2 && model.titlePosition === 'center' " class="type2-center">
        <div v-if="model.leftUrl" class="img-left">
          <img :src="model.leftUrl" :style="imgStyle">
        </div>
        <div>{{ model.titleName }}</div>
        <div v-if="model.rightUrl" class="img-right">
          <img :src="model.rightUrl" :style="imgStyle">
        </div>
      </div>
      <div v-else-if="model.titleType === 2 && model.titlePosition === 'right' " class="type2-right">
        <div>{{ model.titleName }}</div>
        <div v-if="model.rightUrl" class="img-right">
          <img :src="model.rightUrl" :style="imgStyle">
        </div>
      </div>
      <div v-else-if="model.titleType === 3 && model.titlePosition === 'left'" class="type3-left">
        <div class="title-name">{{ model.titleName }}</div>
        <div :style="splitStyle" class="line"/>
      </div>
      <div v-else-if="model.titleType === 3 && model.titlePosition === 'center'" class="type3-center">
        <div :style="splitStyle" class="line-left line"/>
        <div class="title-name">{{ model.titleName }}</div>
        <div :style="splitStyle" class="line-right line"/>
      </div>
      <div v-else-if="model.titleType === 3 && model.titlePosition === 'right'" class="type3-right">
        <div :style="splitStyle" class="line"/>
        <div class="title-name">{{ model.titleName }}</div>
      </div>
      <div v-else-if="model.titleType === 4 && model.titlePosition === 'left'" class="type4-left">
        <div>{{ model.titleName }}</div>
        <div :style="splitStyle" class="line"/>
      </div>
      <div v-else-if="model.titleType === 4 && model.titlePosition === 'right'" class="type4-right">
        <div>{{ model.titleName }}</div>
        <div :style="splitStyle" class="line"/>
      </div>
      <div v-else>
        <div>{{ model.titleName }}</div>
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
    itemData: {
      type: Object,
      default: () => {}
    },
    baseConfig: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    imgStyle() {
      return {
        height: (this.model.fontSize / 100) + 'rem'
      }
    },
    contentStyle() {
      return {
        fontSize: (this.model.fontSize / 100) + 'rem',
        color: this.model.color,
        textAlign: this.model.titlePosition,
        background: this.model.titleBgColor
      }
    },
    splitStyle() {
      return {
        background: this.model.splitColor
      }
    }
  },
  mounted() {
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-title {
  position: relative;
  z-index: 1;
  .content {
    padding: .12rem;
    position: relative;
  }
  .type2-left {
    display: flex;
    align-items: center;
    .img-left {
      margin-right: 0.08rem;
      img {
        display: block;
      }
    }
  }
  .type2-center {
    display: flex;
    align-items: center;
    justify-content: center;
    .img-left {
      margin-right: 0.08rem;
      img {
        display: block;
      }
    }
    .img-right {
      margin-left: 0.08rem;
      img {
        display: block;
      }
    }
  }
  .type2-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .img-right {
      margin-left: 0.08rem;
      img {
        display: block;
      }
    }
  }
  .type4-right {
    padding-right: 0.07rem;
    .line {
      position: absolute;
      width: 0.03rem;
      border-radius: 0.02rem;
      right: 0.12rem;
      bottom: 0.12rem;
      top: 0.12rem;
    }
  }
  .type4-left {
    padding-left: 0.07rem;
    .line {
      position: absolute;
      width: 0.03rem;
      border-radius: 0.02rem;
      left: 0.12rem;
      bottom: 0.12rem;
      top: 0.12rem;
    }
  }
  .type3 {
    display: flex;
    align-items: center;
    .line {
      flex: 1;
      height: 1px;
    }
  }
  .type3-left {
    @extend .type3;
    .title-name {
      margin-right: 0.08rem;
    }
  }
  .type3-center {
    @extend .type3;
    .title-name {
      margin: 0 0.08rem;
    }
  }
  .type3-right {
    @extend .type3;
    .title-name {
      margin-left: 0.08rem;
    }
  }
}
</style>


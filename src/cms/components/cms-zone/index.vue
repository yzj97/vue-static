<template>
  <li
    v-drag-item
    :style="{
      top: zoneTop,
      left: zoneLeft,
      width: zoneWidth,
      height: zoneHeight
    }"
  >
    <ul
      v-change-size
      :class="{
        'hz-z-hidden': tooSmall,
        'hz-m-hoverbox': !hideZone
      }"
      class="hz-m-box"
    >
      <li :title="`热区${index + 1}`" class="hz-u-index">{{ index + 1 }}</li>
      <li
        v-show="!hideZone"
        :title="$t('删除该热区')"
        class="hz-u-close hz-icon hz-icon-trash"
        @click.stop="delItem(index)"
      >
        <i class="el-icon-delete"/>
      </li>
      <li class="hz-u-square hz-u-square-tl" data-pointer="dealTL" />
      <li class="hz-u-square hz-u-square-tc" data-pointer="dealTC" />
      <li class="hz-u-square hz-u-square-tr" data-pointer="dealTR" />
      <li class="hz-u-square hz-u-square-cl" data-pointer="dealCL" />
      <li class="hz-u-square hz-u-square-cr" data-pointer="dealCR" />
      <li class="hz-u-square hz-u-square-bl" data-pointer="dealBL" />
      <li class="hz-u-square hz-u-square-bc" data-pointer="dealBC" />
      <li class="hz-u-square hz-u-square-br" data-pointer="dealBR" />
    </ul>
  </li>
</template>

<script>
import changeSize from './directives/changeSize.js'
import dragItem from './directives/dragItem.js'

export default {
  name: 'Zone',
  directives: {
    changeSize,
    dragItem
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    setting: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      zoneTop: '',
      zoneLeft: '',
      zoneWidth: '',
      zoneHeight: '',
      hideZone: false,
      tooSmall: false
    }
  },
  watch: {
    setting: {
      handler: function(val) {
        this.setZoneInfo(val)
      },
      deep: true
    }
  },
  mounted() {
    this.setZoneInfo(this.setting)
  },
  methods: {
    setZoneInfo(val) {
      this.zoneTop = this.getZoneStyle(val.top)
      this.zoneLeft = this.getZoneStyle(val.left)
      this.zoneWidth = this.getZoneStyle(val.width)
      this.zoneHeight = this.getZoneStyle(val.height)
      this.tooSmall = val.width < 0.01 && val.height < 0.01
    },
    handleHideZone(isHide = true) {
      if (this.hideZone === isHide) {
        return
      }

      this.hideZone = isHide
    },
    changeInfo(info = {}) {
      const { index } = this
      this.$emit('changeInfo', {
        info,
        index
      })
    },
    delItem(index) {
      this.$emit('delItem', index)
    },
    getZoneStyle(val) {
      return `${(val || 0) * 100}%`
    }
  }
}
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.hz-m-box {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 0.06rem rgb(48, 76, 201);
  background-color: rgba(20, 119, 233, 0.4);
  font-size: 0.12rem;
  cursor: pointer;
  color: #fff;
  opacity: 0.8;
  .hz-u-index {
    top: 0;
    left: 0;
    width: 0.14rem;
    height: 0.14rem;
    line-height: 0.14rem;
    background-color: #000;
  }
  .hz-u-close {
    top: 0;
    right: 0;
  }
  .hz-u-img {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: 100%;
    user-select: none;
  }
  .hz-icon {
    width: 0.14rem;
    height: 0.14rem;
    line-height: 0.14rem;
    font-size: 0.14rem;
    text-align: center;
  }
  .hz-icon:hover {
    background-color: #e31414;
    opacity: 0.8;
  }
  .hz-u-square-tl {
    top: -0.04rem;
    left: -0.04rem;
    cursor: nw-resize;
  }

  .hz-small-icon {
    border: 0;
    border-radius: 0;
  }
  .hz-u-square {
    width: 0.08rem;
    height: 0.08rem;
    opacity: 0.8;
  }
  .hz-u-square-tc {
    top: -0.04rem;
    left: 50%;
    transform: translateX(-50%);
    cursor: n-resize;
  }
  .hz-u-square-tr {
    top: -0.04rem;
    right: -0.04rem;
    cursor: ne-resize;
  }
  .hz-u-square-cl {
    top: 50%;
    left: -0.04rem;
    transform: translateY(-50%);
    cursor: w-resize;
  }
  .hz-u-square-cr {
    top: 50%;
    right: -0.04rem;
    transform: translateY(-50%);
    cursor: w-resize;
  }
  .hz-u-square-bl {
    bottom: -0.04rem;
    left: -0.04rem;
    cursor: sw-resize;
  }
  .hz-u-square-bc {
    bottom: -0.04rem;
    left: 50%;
    transform: translateX(-50%);
    cursor: s-resize;
  }
  .hz-u-square-br {
    bottom: -0.04rem;
    right: -0.04rem;
    cursor: se-resize;
  }
}
.hz-u-square:after {
  content: "";
  position: absolute;
  top: 0.02rem;
  left: 0.02rem;
  width: 0.04rem;
  height: 0.04rem;
  border-radius: 0.04rem;
  background-color: #fff;
}
.hz-m-box > li {
  position: absolute;
  text-align: center;
  user-select: none;
  list-style: none;
}
.hz-m-box.hz-m-hoverbox .hz-icon:hover {
  background-color: #373950;
}
</style>

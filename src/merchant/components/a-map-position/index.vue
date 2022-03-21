<!--
  描述：拖放地图组件，默认尺寸是 500 * 300

  接收属性参数：
    lat: 纬度
    lng: 经度

  自定义事件：
    drag: 拖放完成事件

  示例：
    <mapDrag @drag="dragMap" lat="22.574405" lng="114.095388"></mapDrag>
-->
<template>
  <div class="m-map">
    <div class="search">
      <el-input
        id="a-map-position-input"
        v-model="searchKey"
        :disabled="disabled"
        :placeholder="$t('请输入关键字')"
        name="searchKey"
        style="width: 500px;"
      />
      <el-button
        :disabled="disabled"
        name="handleSearch"
        size="small"
        type="primary"
        @click="handleSearch"
      >
        {{ $t('搜索位置') }}
      </el-button>
      <span v-if="value && value.length" style="maring-left: 20px;">
        <ody-tip-star :content="$t('经度')"/>
        {{ value[0] }}
        <ody-star />
        <ody-tip-star :content="$t('纬度')"/>
        {{ value[1] }}
      </span>
    </div>
    <div id="a-map-position-container" class="map">{{ $t('地图加载中') }} ...</div>
  </div>
</template>

<script>
import $ from 'jquery'
export const MapKey = '4c52f0b46630bbb7909823d725b1bb60'

// 地图限定城市

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchKey: '',
      dragStatus: false,
      AMapUI: null,
      AMap: null,
      marker: null,
      map: null,
      poiPicker: null
    }
  },
  watch: {
  },
  async created() {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI) {
      this.initMap()
      // 未载入高德地图API，则先载入API再初始化
    } else {
      await this.$portal.remoteLoad(window.location.protocol + '//' + `webapi.amap.com/maps?v=1.4.6&key=${MapKey}`)
      await this.$portal.remoteLoad(window.location.protocol + '//' + 'webapi.amap.com/ui/1.0/main.js')
      this.initMap()
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      if (this.searchKey) {
        this.poiPicker.searchByKeyword(this.searchKey)
      }
    },
    createMap(callback) {
      const mapConfig = {
        resizeEnable: true,
        zoom: 16,
        center: [116.39, 39.9]
      }
      if (this.value && this.value.length) {
        mapConfig.center = this.value
      } else {
        this.value = [116.39, 39.9]
        this.$emit('input', mapConfig.center)
      }

      // 创建地图
      this.map = new this.AMap.Map('a-map-position-container', mapConfig)

      if (!this.disabled) {
        this.map.on('click', (e) => {
          this.value = [e.lnglat.getLng(), e.lnglat.getLat()]
          this.marker.setPosition(this.value)
          this.$emit('input', this.value)
        })
      }

      this.map.on('complete', () => {
        this.map.setFitView()
        if (callback) {
          callback(this.map)
        }
      })
    },
    createMarker() {
      this.marker = new this.AMap.Marker({
        position: this.value
      })
      this.marker.setMap(this.map)
      this.map.setCenter(this.marker.getPosition())
    },
    createToolbar() {
      this.AMap.plugin(['AMap.ToolBar'], () => {
        this.map.addControl(
          new this.AMap.ToolBar({
            position: 'RB'
          })
        )
      })
    },
    createPositionPicker(PositionPicker) {
      const positionPicker = new PositionPicker({
        mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
        map: this.map // 依赖地图对象
      })
      // 拖拽完成发送自定义 drag 事件
      positionPicker.on('success', positionResult => {
        // 过滤掉初始化地图后的第一次默认拖放
        if (!this.dragStatus) {
          this.dragStatus = true
        } else {
          this.$emit('drag', positionResult)
        }
      })
      // 启动拖放
      positionPicker.start()
    },
    createPoiPikcer() {
      // 设置DomLibrary，jQuery或者Zepto
      this.AMapUI.setDomLibrary($)

      // 加载PoiPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      this.AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
        this.poiPicker = new PoiPicker({
          input: 'a-map-position-input' // 输入框id
        })
        // 监听poi选中信息
        this.poiPicker.on('poiPicked', ({ item }) => {
          if (item && item.location) {
            this.map.setZoom(25)
            this.map.setCenter(item.location)
            const lng = item.location.lng
            const lat = item.location.lat
            this.searchKey = item.name

            this.value = [lng, lat]
            this.marker.setPosition(this.value)
            this.$emit('input', this.value)
          }

          // 用户选中的poi点信息
        })
      })
    },
    // 实例化地图
    initMap() {
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      this.AMapUI = window.AMapUI
      this.AMap = window.AMap
      this.AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
        this.createMap(() => {
          this.createPoiPikcer()
          this.createMarker()
          this.map.setFitView()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.m-map {
  min-width: 500px;
  height: 500px;
  position: relative;
  .search {
    margin-bottom: 20px;
    position: absolute;
    top: 10px;
    z-index: 2;
  }
  .map {
    position: relative;
    top: 60px;
    width: 100%;
    height: 440px;
  }
  .result {
    max-height: 300px;
    overflow: auto;
    width: 500px;
  }
}
</style>

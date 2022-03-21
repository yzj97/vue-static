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
        id="a-map-range-input"
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
    </div>
    <el-button
      :disabled="disabled"
      name="handleRemoveAllOverlay"
      size="mini"
      type="text"
      class="clear-all"
      @click="handleRemoveAllOverlay">{{ $t('全部清空') }}</el-button>
    <div id="a-map-range-container" class="map">{{ $t('地图加载中') }} ...</div>
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
    mapCenter: {
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
      placeSearch: null,
      overlays: [],
      id: 0,
      centerMarker: null,
      circleMarker: null,
      circleLine: null,
      circleLineText: null,
      circle: null
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
        center: [116.403322, 39.900255]
      }

      if (this.mapCenter && this.mapCenter.length) {
        mapConfig.center = this.mapCenter
      } else {
        this.mapCenter = mapConfig.center
      }
      // 创建地图
      this.map = new this.AMap.Map('a-map-range-container', mapConfig)
      this.map.on('complete', () => {
        this.map.setFitView()
        if (callback) {
          callback(this.map)
        }
      })
    },
    createPointsXYArray(points) {
      var polygonArr = [] // 构建多边形经纬度坐标数组
      for (var i = 0; i < points.length; i++) {
        var obj = points[i]
        polygonArr.push({ y: obj.lng, x: obj.lat })
      }
      return polygonArr
    },
    createLines(points) {
      var lines = []
      if (points.length > 1) {
        for (var i = 1; i < points.length; i++) {
          if (i > points.length - 1) {
            break
          }
          var pointA = points[i - 1]// 第一个点
          var pointB = points[i]// 第二个点
          var line = {
            pointA: pointA,
            pointB: pointB
          }
          lines.push(line)
        }
      }

      return lines
    },

    determinant(v1, v2, v3, v4) { // 行列式
      return (v1 * v4 - v2 * v3)
    },

    intersect(aa, bb, cc, dd) {
      var delta = this.determinant(bb.x - aa.x, cc.x - dd.x, bb.y - aa.y, cc.y - dd.y)
      if (delta <= (1e-6) && delta >= -(1e-6)) { // delta=0，表示两线段重合或平行
        return false
      }
      var namenda = this.determinant(cc.x - aa.x, cc.x - dd.x, cc.y - aa.y, cc.y - dd.y) / delta
      if (namenda >= 1 || namenda <= 0) {
        return false
      }
      var miu = this.determinant(bb.x - aa.x, cc.x - aa.x, bb.y - aa.y, cc.y - aa.y) / delta
      if (miu > 1 || miu < 0) {
        return false
      }
      return true
    },

    intersectLine(baseLine, compareLines) {
      var isInersect = false
      for (var i = 0; i < compareLines.length; i++) {
        var compareLine = compareLines[i]
        var result = this.intersect(baseLine.pointA, baseLine.pointB, compareLine.pointA, compareLine.pointB)
        if (result) {
          isInersect = true
          break
        }
      }
      return isInersect
    },
    /**
     * 判断数组点阵是否有相交或者重叠的直线
     * return true:存在 false:不存在
     */
    intersectCoverage(points) {
      // 少于3个点不进行比较。（因为3个点一下不能形成图形）
      if (points.length < 3) {
        return false
      }
      var r = false
      // 从第3个点开始循环.最后一个点就是第一个点
      for (var i = 2; i < points.length; i++) {
        var pointC = points[i]
        var lastIndex = i + 1
        if (points.length - lastIndex === 0) {
          lastIndex = 0
        }
        var pointD = points[lastIndex]
        // 基准的线段
        var baseLine = {
          pointA: pointC,
          pointB: pointD
        }
        var baseBeforePoints = points.slice(0, i)// 基准线之前的所有点
        var compareLines = this.createLines(baseBeforePoints)// 基准线之前所有的线段
        // 比较基准线和前面所有的线是否有相交或者重叠
        var result = this.intersectLine(baseLine, compareLines)
        if (result) {
          r = true
          break
        }
      }
      return r
    },
    createCoveragePolygon(id, points) {
      var pointsCount = points.length
      var polygonArr = []// 构建多边形经纬度坐标数组
      for (var i = 0; i < pointsCount; i++) {
        var obj = points[i]
        polygonArr.push(new this.AMap.LngLat(obj.lng, obj.lat))
      }
      var polygon = new this.AMap.Polygon({
        id: id,
        map: this.map,
        path: polygonArr,
        fillColor: '#f5deb3',
        fillOpacity: 0.35
      })

      return polygon
    },
    createPolygonId() {
      return this.id++
    },
    createMouseTool() {
      this.AMap.plugin(['AMap.MouseTool'], () => {
        var mouseTool = new this.AMap.MouseTool(this.map)
        mouseTool.on('draw', (e) => {
          if (this.overlays.length >= 3) {
            this.$message({
              type: 'error',
              message: this.$t('范围不能超过3个')
            })
            this.map.remove(e.obj)
            return
          }
          // console.log(overlays)
          // 不能操作3个
          var pointXYArray = this.createPointsXYArray(e.obj.getPath())
          // 判断图形是否不规则 （相交或者重叠）
          if (this.intersectCoverage(pointXYArray)) {
            this.$message({
              type: 'error',
              message: this.$t('范围图形不能有相交或者重叠的部分')
            })
            this.map.remove(e.obj)
            return
          }
          this.map.remove(e.obj)

          const line = e.obj.getPath()
          const poi = JSON.stringify(line.map(x => {
            return {
              lng: x.lng,
              lat: x.lat
            }
          }))

          this.createOverlay({
            id: null,
            maxX: null,
            maxY: null,
            minX: null,
            minY: null,
            name: null,
            storeCoverageId: null,
            poi
          })
        })

        mouseTool.polygon({
          fillColor: '#00b0ff',
          strokeColor: '#80d8ff'
          // 同Polygon的Option设置
        })
      })
    },
    createOverlay(poiObj, callback) {
      var polygon = this.createCoveragePolygon(poiObj.id, JSON.parse(poiObj.poi))

      // debugger
      // this.map.add(polygon)
      // this.map.setFitView([polygon])
      var _id = this.createPolygonId()

      this.createPolyEditor(polygon, (polyEditor) => {
        if (!this.disabled) {
          polyEditor.open()
        }

        var contextMenu = this.createContextMenu(_id)
        var obj = {
          _id,
          _polygon: polygon,
          _polyEditor: polyEditor,
          _contextMenu: contextMenu,
          ...poiObj
        }

        polygon.on('rightclick', (e) => {
          contextMenu.open(this.map, e.lnglat)
        })

        this.overlays.push(obj)
        this.emitToParent()

        if (callback) {
          callback(obj)
        }
      })
    },
    emitToParent() {
      this.$emit('input', this.overlays.map(x => {
        return Object.keys(x).reduce((rtv, key) => {
          if (!/^_/.test(key)) {
            rtv[key] = x[key]
          }
          return rtv
        }, {})
      }))
    },
    createPolyEditor(polygon, callback) {
      this.AMap.plugin(['AMap.PolyEditor'], () => {
        var polyEditor = new this.AMap.PolyEditor(this.map, polygon)
        // 调整范围重新计算经纬度
        polyEditor.on('adjust', (event) => {
          const pois = event.target.Nh.path.map(o => { return { lng: o.lng, lat: o.lat } })
          const index = this.overlays.findIndex(x => x.id === event.target.Nh.id)
          this.overlays[index].poi = JSON.stringify(pois)
          this.emitToParent()
        })
        callback(polyEditor)
      })
    },
    createContextMenu(id) {
      // 创建右键菜单
      var contextMenu = new this.AMap.ContextMenu()

      // 右键删除
      contextMenu.addItem('删除', () => {
        this.removeOverlayById(id, true)
      })

      return contextMenu
    },
    handleRemoveAllOverlay() {
      this.overlays.map(x => x._id).forEach(this.removeOverlayById)
      this.emitToParent()
      this.$emit('clearAll')
    },
    removeOverlayById(id, needEmit) {
      const index = this.overlays.findIndex(x => x._id === id)
      const { _polyEditor, _polygon, _contextMenu } = this.overlays[index]

      if (_polyEditor) {
        _polyEditor.close()
      }

      if (_polygon) {
        this.map.remove(_polygon)
      }

      if (_contextMenu) {
        this.map.remove(_contextMenu)
      }

      this.overlays.splice(index, 1)

      if (needEmit) {
        this.emitToParent()
      }
    },
    createPoiPikcer() {
      // 设置DomLibrary，jQuery或者Zepto
      this.AMapUI.setDomLibrary($)

      // 加载PoiPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      this.AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
        this.poiPicker = new PoiPicker({
          input: 'a-map-range-input' // 输入框id
        })
        // 监听poi选中信息
        this.poiPicker.on('poiPicked', ({ item }) => {
          if (item && item.location) {
            this.map.setZoom(25)
            this.map.setCenter(item.location)
            this.searchKey = item.name
          }

          // 用户选中的poi点信息
        })
      })
    },
    createCenterMarker() {
      this.centerMarker = new this.AMap.Marker({
        position: this.mapCenter,
        draggable: false,
        map: this.map
      })
      // 设置点标记的动画效果，此处为弹跳效果
      this.centerMarker.setAnimation('AMAP_ANIMATION_BOUNCE')
    },
    createCircleMarker() {
      const lng = this.mapCenter[0]
      const lat = this.mapCenter[1]
      this.circleMarker = new this.AMap.Marker({
        position: [lng + 0.04, lat],
        draggable: true,
        map: this.map
      })
      this.circleMarker.on('dragging', this.computeDis)
      this.createCircle(4000)
      const t = [this.mapCenter[0] + 0.001, this.mapCenter[1] + 0.001]
      // 获取距离最近的点
      var closestPositionOnLine = this.AMap.GeometryUtil.closestOnLine(t, this.circle.getPath())
      this.circleMarker.setPosition(closestPositionOnLine)
      this.createCircleLine()
      this.circleLineText = this.createCircleLineText(4 + 'km')
      this.computeDis()
    },
    createCircleLine() {
      this.circleLine = new this.AMap.Polyline({
        strokeColor: '#80d8ff',
        isOutline: true,
        strokeWeight: 1, // 线粗细度
        outlineColor: 'white'
      })
      this.circleLine.setMap(this.map)
    },
    createCircleLineText(labelText) {
      const text = new this.AMap.Text({
        text: labelText || '',
        style: { 'background-color': '#29b6f6',
          'border-color': '#e1f5fe',
          'font-size': '12px' }
      })
      text.setMap(this.map)
      return text
    },
    createCircle(distance) {
      const op = {
        center: this.mapCenter,
        radius: distance,
        strokeColor: '#F33', // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 1, // 线粗细度
        fillColor: '#ee2200', // 填充颜色
        fillOpacity: 0.1 // 填充透明度
      }
      if (this.circle) {
        this.circle.setOptions(op)
      } else {
        this.circle = new this.AMap.Circle(op)
        this.circle.setMap(this.map)
      }
    },
    createCircleWithDistance(distanceList) {
      const op = {
        strokeStyle: 'dashed',
        center: this.mapCenter,
        strokeColor: '#F33', // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 1, // 线粗细度
        fillColor: '#ee2200', // 填充颜色
        fillOpacity: 0 // 填充透明度
      }
      if (distanceList) {
        for (let i = 0; i < distanceList.length; i++) {
          op.radius = distanceList[i]
          const c = new this.AMap.Circle(Object.assign({}, op))
          c.setMap(this.map)

          const t = [this.mapCenter[0] + 0.001, this.mapCenter[1]]
          // 获取距离最近的点
          var closestPositionOnLine = this.AMap.GeometryUtil.closestOnLine(t, c.getPath())
          const text = this.createCircleLineText((op.radius / 1000) + 'km')
          text.setPosition(closestPositionOnLine)
        }
      }
    },
    computeDis() {
      var p1 = this.centerMarker.getPosition()
      var p2 = this.circleMarker.getPosition()
      var textPos = p1.divideBy(2).add(p2.divideBy(2))
      var distance = Math.round(p1.distance(p2))
      var path = [p1, p2]
      this.circleLine.setPath(path)
      this.circleLineText.setText((Number((distance / 1000))).toFixed(2) + 'km')
      this.circleLineText.setPosition(textPos)
      this.createCircle(distance)
      // this.map.setFitView()
    },
    // 实例化地图
    initMap() {
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      this.AMapUI = window.AMapUI
      this.AMap = window.AMap
      this.AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
        this.createMap(() => {
          this.createPoiPikcer()
          if (!this.disabled) {
            this.createMouseTool()
          }
          this.createCenterMarker()
          this.createCircleMarker()
          // 画固定范围的圈
          this.createCircleWithDistance([3000, 5000])
          if (this.value.length) {
            let loadLen = 0
            this.value.forEach(x => {
              this.createOverlay(x, ({ polygon }) => {
                loadLen++
                if (loadLen === this.value.length) {
                  this.map.setFitView()
                }
              })
            })
          }
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
    margin-top: 10px;
  }
  .clear-all {
    position: absolute;
    top: 10px;
    right: 0;
  }
}
</style>

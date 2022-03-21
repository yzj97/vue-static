<template>
  <div
    ref="content"
    class="hz-m-wrap"
  >
    <img :src="image" class="hz-u-img" alt="cover">
    <ul
      v-addItem
      class="hz-m-area"
    >
      <zone
        v-for="(zone, index) in zones"
        :key="index"
        :index="index"
        :setting="zone"
        class="hz-m-item"
        @delItem="removeItem($event)"
        @changeInfo="changeInfo($event)"
      />
    </ul>
  </div>
</template>

<script>
import Zone from '@/components/cms-zone'
import addItem from './directives/addItem.js'

export default {
  directives: {
    addItem
  },
  components: {
    Zone
  },
  props: {
    image: {
      type: String,
      required: true
    },
    zonesInit: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      zones: []
    }
  },
  watch: {
    'image': {
      handler(val) {
        this.zones = []
      }
    }
  },
  mounted() {
    this.zones = this.zonesInit.concat()
  },
  methods: {
    changeInfo(res) {
      const { info, index } = res
      this.changeItem(info, index)
    },
    addItem(setting) {
      this.zones.push(setting)
      this.hasChange()
      this.$emit('add', setting)
    },
    eraseItem(index = this.zones.length - 1) {
      this.removeItem(index)
      this.$emit('erase', index)
    },
    isOverRange() {
      const { max, zones } = this
      return max && zones.length > max
    },
    overRange() {
      const index = this.zones.length - 1
      this.removeItem(index)
      this.$emit('overRange', index)
    },
    removeItem(index = this.zones.length - 1) {
      this.zones.splice(index, 1)
      this.hasChange()
      this.$emit('remove', index)
    },
    changeItem(info, index = this.zones.length - 1) {
      Object.assign(this.zones[index], info)
      this.hasChange()
    },
    hasChange() {
      this.$emit('change', this.zones)
    }
  }
}
</script>

<style lang="scss" scoped>
.hz-m-wrap {
position: relative;
margin-bottom: 10px;
img{
  width: 100%;
  display: block;
}
.hz-m-area {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  cursor: crosshair;
}
.hz-m-item {
  position: absolute;
  display: block;
}
 .hz-m-box.hz-z-hidden > li {
  display: none;
}
.hz-m-box.hz-m-hoverbox:hover {
  box-shadow: 0 0 0 0.02rem #373950;
}
.hz-m-box.hz-m-hoverbox .hz-icon:hover {
  background-color: #373950;
}
.hz-m-box .hz-icon {
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 20px;
  text-align: center;
}
.hz-m-box .hz-icon:hover {
  background-color: #e31414;
  opacity: 0.8;
}
.hz-m-box .hz-m-copy {
  display: inline-block;
}
}

/* reset */
.hz-m-modal, .hz-m-wrap {
  font-size: 12px;
  /* 清除内外边距 */
  /* 重置列表元素 */
  /* 重置文本格式元素 */
  /* 初始化 input */
}
.hz-m-modal ul, .hz-m-wrap ul, .hz-m-modal ol, .hz-m-wrap ol, .hz-m-modal li, .hz-m-wrap li {
  margin: 0;
  padding: 0;
}
.hz-m-modal ul, .hz-m-wrap ul, .hz-m-modal ol, .hz-m-wrap ol {
  list-style: none;
}
.hz-m-modal a, .hz-m-wrap a {
  text-decoration: none;
}
.hz-m-modal a:hover, .hz-m-wrap a:hover {
  text-decoration: underline;
}
.hz-m-modal p, .hz-m-wrap p {
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
}
.hz-m-modal input[type="checkbox"], .hz-m-wrap input[type="checkbox"] {
  cursor: pointer;
}
/* basic */
/* modal 样式 */
.hz-m-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: cross-slide-y pinch-zoom double-tap-zoom;
  text-align: center;
  overflow: hidden;
}
.hz-m-modal:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
.hz-m-modal .hz-modal_dialog {
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  border-radius: 3px;
}
.hz-m-modal .hz-modal_title {
  margin: 0;
}
.hz-m-modal .hz-modal_close {
  float: right;
  margin: -6px -4px 0 0;
}
@media (max-width: 767px) {
  .hz-m-modal .hz-modal_dialog {
    width: auto;
  }
}
html.z-modal, html.z-modal body {
  overflow: hidden;
}
.hz-m-modal {
  background: rgba(0, 0, 0, 0.6);
}
.hz-m-modal .hz-modal_dialog {
  width: 450px;
  background: #fff;
  -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.125);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.125);
}
.hz-m-modal .hz-modal_hd {
  padding: 15px;
  border-bottom: 1px solid #f4f4f4;
}
.hz-m-modal .hz-modal_title {
  font-size: 18px;
}
.hz-m-modal .hz-modal_close {
  margin: -15px -15px 0 0;
  padding: 6px;
  color: #bbb;
  cursor: pointer;
}
.hz-m-modal .hz-modal_close:hover {
  color: #888;
}
.hz-m-modal .hz-modal_close .hz-u-icon-close {
  font-size: 18px;
  transition: transform 500ms ease-in-out;
  transform: rotate(0deg);
  width: 18px;
  text-align: center;
}
.hz-m-modal .hz-modal_close:hover .hz-u-icon-close {
  transform: rotate(270deg);
}
.hz-m-modal .hz-modal_bd {
  padding: 15px 15px 0 15px;
  min-height: 10px;
}
.hz-m-modal .hz-modal_ft {
  padding: 15px;
  text-align: center;
  border-top: 1px solid #f4f4f4;
}
.hz-m-modal .hz-modal_ft .hz-u-btn {
  margin: 0 10px;
}
@media (max-width: 767px) {
  .hz-m-modal .hz-modal_dialog {
    margin: 10px;
  }
}
/* 基本按钮样式 btn */
.hz-u-btn {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  border: none;
  overflow: visible;
  font: inherit;
  text-transform: none;
  text-decoration: none;
  cursor: pointer;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  background: none;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  font-size: 12px;
}
.hz-u-btn:hover, .hz-u-btn:focus {
  outline: none;
  text-decoration: none;
}
.hz-u-btn:disabled {
  cursor: not-allowed;
}
.hz-u-btn-block {
  display: block;
  width: 100%;
}
.hz-u-btn {
  padding: 0 16px;
  height: 28px;
  line-height: 26px;
  background: #f4f4f4;
  color: #444;
  border: 1px solid #ddd;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
.hz-u-btn:hover, .hz-u-btn:focus {
  background: #e5e5e5;
  border: 1px solid #adadad;
}
.hz-u-btn:active {
  background: #e5e5e5;
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}
.hz-u-btn:disabled {
  background: #fff;
  border: 1px solid #ccc;
  filter: alpha(opacity=65);
  opacity: 0.65;
  -webkit-box-shadow: none;
  box-shadow: none;
}
/* 按钮类型 */
.hz-u-btn-primary {
  background: #67739b;
  color: #fff;
  border: 1px solid #67739b;
}
.hz-u-btn-primary:hover, .hz-u-btn-primary:focus {
  background: #31384b;
  color: #fff;
  border: 1px solid #31384b;
}
.hz-u-btn-primary:active {
  background: #367fa9;
  color: #fff;
  border: 1px solid #367fa9;
}
.hz-u-btn-primary:disabled {
  background: #444;
  color: #fff;
  border: 1px solid #444;
}
/* input */
.hz-u-input {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  border: 0;
  padding: 0;
  border-radius: 0;
  font: inherit;
  color: inherit;
  vertical-align: middle;
}
.hz-u-input {
  position: relative;
  z-index: 0;
  padding: 5px 6px;
  border: 1px solid #d2d6de;
  color: #555;
  background: #fff;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
.hz-u-input::-webkit-input-placeholder {
  color: #bbb;
  filter: alpha(opacity=100);
  opacity: 1;
}
.hz-u-input::-moz-placeholder {
  color: #bbb;
  filter: alpha(opacity=100);
  opacity: 1;
}
.hz-u-input:-moz-placeholder {
  color: #bbb;
  filter: alpha(opacity=100);
  opacity: 1;
}
.hz-u-input:-ms-placeholder {
  color: #bbb;
  filter: alpha(opacity=100);
  opacity: 1;
}
.hz-u-input:focus {
  outline: 0;
  background: #fff;
  color: #555;
  border: 1px solid #3c8dbc;
}
.hz-u-input:disabled {
  cursor: not-allowed;
  background: #eee;
  color: #999;
  border: 1px solid #d2d6de;
}
.hz-u-input {
  width: 280px;
  height: 34px;
}
.hz-u-input.hz-u-input-success {
  color: #00a65a;
  border-color: #00a65a;
}
.hz-u-input.hz-u-input-warning {
  color: #f39c12;
  border-color: #f39c12;
}
.hz-u-input.hz-u-input-error {
  color: #dd4b39;
  border-color: #dd4b39;
}
.hz-u-input.hz-u-input-blank {
  border-color: transparent;
  border-style: dashed;
  background: none;
}
.hz-u-input.hz-u-input-blank:focus {
  border-color: #ddd;
}
/* formItem */
.hz-u-formitem {
  display: inline-block;
  *zoom: 1;
  margin-bottom: 1em;
}
.hz-u-formitem:before, .hz-u-formitem:after {
  display: table;
  content: "";
  line-height: 0;
}
.hz-u-formitem:after {
  clear: both;
}
.hz-u-formitem .hz-formitem_tt {
  display: block;
  float: left;
  text-align: right;
}
.hz-u-formitem .hz-formitem_ct {
  display: block;
}
.hz-u-formitem .hz-formitem_rqr {
  line-height: 28px;
  color: #dd4b39;
}
.hz-u-formitem .hz-formitem_tt {
  line-height: 34px;
  width: 100px;
}
.hz-u-formitem .hz-formitem_ct {
  line-height: 34px;
  margin-left: 108px;
}
/* icon */
.hz-u-icon {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* label */
.hz-u-label {
  display: inline-block;
  cursor: pointer;
}
/* margin */
.hz-f-ml0 {
  margin-bottom: 0;
}
/* replicator */
.hz-u-copy input[data-for-copy] {
  transform: translateZ(0);
  position: fixed;
  bottom: 0;
  right: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  z-index: -999;
  color: transparent;
  background-color: transparent;
  border: none;
  outline: none;
}
@font-face {
  font-family: 'iconfont';
  /* project id 525460 */
  src: url('//at.alicdn.com/t/font_525460_d0ysfwzacahsemi.eot');
  src: url('//at.alicdn.com/t/font_525460_d0ysfwzacahsemi.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_525460_d0ysfwzacahsemi.woff') format('woff'), url('//at.alicdn.com/t/font_525460_d0ysfwzacahsemi.ttf') format('truetype'), url('//at.alicdn.com/t/font_525460_d0ysfwzacahsemi.svg#iconfont') format('svg');
}
.hz-icon {
  font-family: "iconfont" !important;
  font-size: 20px;
  font-style: normal;
  text-align: center;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.hz-icon-trash:before {
  content: "\e605";
}
</style>

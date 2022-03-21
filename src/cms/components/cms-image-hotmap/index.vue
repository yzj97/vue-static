<template>
  <div v-show="image" class="cp-hotmap">
    <!-- 操作区域 -->
    <cms-hotzone
      :image="image"
      :zones-init="zones"
      @add="handleAdd"
      @remove="handleRemove"
      @change="handleChange"
    />
    <div v-for="(zone,index) in zones" :key="index" class="hotmap-link-url">
      <span>{{ $t('热区') }},{{ index+1 }},:</span>
      <cms-link-url v-model="zone.link" :page-model="pageModel" :page-type="pageType" :plat-form="platForm" name="zone_link" />
    </div>
  </div>
</template>

<script>
import CmsHotzone from '@/components/cms-hotzone/index.vue'
import cmsLinkUrl from '@/components/cms-link-url'
export default {
  name: 'Index',
  components: {
    CmsHotzone,
    cmsLinkUrl
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    },
    pageModel: {
      type: Object,
      default: () => ({ model: {}})
    },
    pageType: {
      type: String,
      default: ''
    },
    platForm: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      zones: [
        // {
        //   width: 0.2827,
        //   height: 0.4374,
        //   left: 0.1153,
        //   top: 0.238,
        //   link: {}
        // }
      ]
    }
  },
  watch: {
    'formData.model.src': {
      handler(val) {
        if (!val) {
          this.zones = []
        }
        this.image = val
      },
      deep: true,
      immediate: true
    },
    'zones': {
      handler(val) {
        this.formData.model.data = val
      },
      deep: true
    },
    'formData.model.data': {
      handler(val) {
        this.zones = val
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    handleAdd(zone) {
      zone.link = this.zones.length ? '' : zone.link
      this.zones.push(zone)
    },
    handleRemove(index) {
      this.zones.splice(index, 1)
    },
    handleChange() {
    },
    getZoneStyle(val) {
      return `${(val || 0) * 100}%`
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  margin:0;
  padding:0;
}
.cp-hotmap {
  position: relative;
  width: 3.75rem;
  height: auto;
  margin-bottom: 0.15rem;
}
.wrap {
  position: relative;
}

.wrap img {
  width: 100%;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.wrap .zone {
  position: absolute;
  cursor: pointer;

  border: 1px dashed #eeeeee;
}

input {
  width: 100%;
  box-sizing: border-box;
  margin-top: 20px;
  padding: 10px;

  background: #fff;
  border: 1px solid #ccc;
  outline: none;

  color: #555;

  transition: all 0.30s ease-in-out;
}
.hotmap-link-url {
  display: flex;
  align-items: baseline;
  margin-bottom: 0.2rem;
  span{
    margin-right: 0.12rem;
    font-size: 0.12rem;
  }
}

input:focus {
  box-shadow: 0 0 5px #43D1AF;
  border: 1px solid #43D1AF;
}
</style>

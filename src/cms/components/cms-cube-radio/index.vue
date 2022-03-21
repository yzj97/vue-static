<template>
  <div class="cp-page-cube">
    <div class="cube-cotent-type">
      <div v-for="(item,index) in configData" :key="index" class="item-cube">
        <img :src="item.imgBg" :class="{'active':index === value}" :form-data="item.cdata" alt="" @click="checkCube(item.layout)">
      </div>
    </div>
    <cms-cube-choose-url :cube-list="formData.model.cdata" :page-model="pageModel"/>
  </div>

</template>
<script>
import configData from './config.js'
import cmsCubeChooseUrl from '@/components/cms-cube-choose-url'
export default {
  components: {
    cmsCubeChooseUrl
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    formData: {
      type: Object,
      default: () => {}
    },
    pageModel: {
      type: Object,
      default: () => ({ model: {}})
    }

  },
  data() {
    return {
      configData: JSON.parse(JSON.stringify(configData))
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
        const index = this.configData.findIndex(item => item.layout === val)
        this.formData.model.cdata = this.configData[index].cdata
      }
    }
  },
  methods: {
    checkCube(index) {
      this.value = index
    }
  }
}
</script>
<style lang="scss" scoped>
.cp-page-cube {
  position: relative;
  width: 4rem;
  height: auto;
  .cube-cotent-type{
    margin-bottom: 0.15rem;
    display: flex;
    flex-wrap: wrap;
    // max-width: 400px;
  }
  .item-cube{
    width: 1rem;
    img{
      width: 0.78rem;
      height: 0.52rem;
      border:none;
    }
    .active{
      border: 0.01rem solid #1890FF;
    }
  }
}
el-radio {
  display: block;
  width: 1.2rem;
  margin: 0 0.12rem;
  display: flex;
  position: relative;
  align-items: center;
}
</style>

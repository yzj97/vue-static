<template>
  <div class="cp-page-cube">
    <el-tabs v-model="activeName" name="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :label="$t('显示设置')" name="first" class="cube-show-set">
        <div
          v-for="(item,index) in configData"
          :key="index"
          :class="{'active':index === value}"
          class="item-cube"
        >
          <img :src="item.imgBg" :form-data="item.cdata" name="checkCube" alt @click="checkCube(item.layout)" >
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('内容设置')" name="second">
        <div class="cube-active">
          <img :src="configData[value].imgBg" >
        </div>
        <cms-pc-cube-set :cube-list="formData.model.cdata" :page-model="pageModel" :page-type="pageType" :plat-form="platForm"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import configData from './config.js'
import cmsPcCubeSet from '@/components/cms-pc-cube-set'
export default {
  components: {
    cmsPcCubeSet
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
      default: () => {}
    },
    pageType: {
      type: String,
      default: '1'
    },
    platForm: { // 平台 1:PC ,2:H5
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      configData: JSON.parse(JSON.stringify(configData)),
      activeName: 'first'
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
    handleClick(tab, event) {
    },
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
  .cube-show-set {
    margin-bottom: 0.15rem;
    display: flex;
    flex-wrap: wrap;
    // max-width: 400px;
  }
  .item-cube {
    width: 149px;
    height: 103px;
    border: 1px solid #ddd;
    margin-right: 50px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      border: none;
      float: left;
    }
  }
  .item-cube.active {
    border: 0.01rem solid #0046aa;
  }
  .cube-active {
    width: 149px;
    height: 103px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 0.01rem solid #0046aa;
    margin:10px 0;
  }
}
</style>

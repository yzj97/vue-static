<template>
  <div class="slider-background-wrapper">
    <div :style="backStyle" class="slider-background"/>
    <div class="slider-background-radio">
      <span class="tip">{{ $t('背景颜色') }}</span>
      <el-radio-group v-model="colorStyle" name="colorStyle" class="radio-group-wrapper" >
        <div v-for="(radio,index) in backgroundColorList" :key="index" class="radio-item">
          <el-radio :label="radio.label" >{{ radio.name }}</el-radio>
          <el-color-picker v-model="value" name="value"/>
          <el-color-picker v-if="index === 1" v-model="endcolor" name="endcolor" class="picker-wrapper" @change="handdleActiveChange"/>
        </div>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '#1890FF'
    },
    endcolor: {
      type: String,
      default: ''
    },
    colorStyle: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      backgroundColorList: [
        { label: 1, name: this.$t('单色'), color: '' },
        { label: 2, name: this.$t('渐变色'), color: '' }
      ]
    }
  },
  computed: {
    backStyle() {
      return {
        background: this.colorStyle === 1 ? this.value : 'linear-gradient(' + this.value + ',' + this.endcolor + ')'
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    },
    colorStyle: {
      handler(val) {
        this.handdleChange(val)
      },
      deep: true
    },
    endColor: {
      handler(val) {
        this.$emit('update:endcolor', val)
      },
      deep: true
    }
  },
  methods: {
    handdleChange(val) {
      this.$emit('update:colorStyle', val)
      if (val === 1) {
        this.endColor = ''
      }
    },
    handdleActiveChange(val) {
      this.$emit('update:endcolor', val)
    }
  }
}
</script>

<style lang="scss" scoped>

.slider-background{
  min-width: 2.78rem;
  min-height: 1.48rem;
  border-radius:0px 0px 0.3rem 0.3rem;
  margin: 0.2rem 0;
}
.slider-background-radio{
  display: flex;

  .radio-group-wrapper{
    display: flex;
    flex-direction: column;
    .radio-item{
      display: flex;
      align-items: center;
      height: 0.36rem;
      line-height: 0.36rem;
      margin:0 0 0.1rem 0.1rem;
      .el-radio{
        line-height: 0.36rem;
        min-width: 1rem;
      }
      .el-color-picker{
        margin-top: 0 !important;
      }
    }
  }
  .tip{
    margin-left: -0.6rem;
  }
  .picker-wrapper{
    margin-left:0.1rem
  }
}
</style>

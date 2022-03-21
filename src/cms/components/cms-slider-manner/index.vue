<template>
  <div class="cms-channel-choose-template">
    <el-radio-group v-model="value" name="value">
      <el-radio v-for="(item,index) in styleModel" :key="index" :label="item.label">{{ item.name }}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      styleModel: [{ label: 1, name: this.$t('风格一') }, { label: 2, name: this.$t('风格二') }]
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {

  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
.cms-bulletin-icon {
  display: flex;
}
.countdown-wrapper{
  padding: 0 0.13rem;
  min-height: 0.4rem;
  line-height: 0.4rem;
  border: 1px solid #eee;
}
.content-wrapper{
  color: #333;
  font-size: 0.07rem;
}
.down-wrapper{
  min-width: 0.202rem;
  min-height: 0.22rem;
  text-align: center;
  line-height: 0.22rem;
  background-color: #F23030;
  border-radius: 0.02rem;
  color: #fff;
  margin-right: 0.06rem;
  padding: 0 0.015rem;
}
</style>

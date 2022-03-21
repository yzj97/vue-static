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
      styleModel: [{ label: 1, name: this.$t('样式一') }, { label: 2, name: this.$t('样式二') }]
    }
  },
  computed: {
    barStyle() {
      return {

      }
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
</style>

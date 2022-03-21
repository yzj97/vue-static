<template>
  <div class="cms-count-down-use">
    <el-date-picker
      v-model="value"
      :default-time="['12:00:00']"
      :end-placeholder="$t('结束时间')"
      :start-placeholder="$t('开始时间')"
      name="value"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="timestamp"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {

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
.cms-count-down-use {
  display: flex;
}

</style>

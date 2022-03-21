<template>
  <div class="cp-list-switch">
    <ul>
      <li v-for="(item, index) in value" :key="index">
        <ody-left-right>
          <div slot="left">
            {{ item[labelKey] }}
          </div>
          <div slot="right">
            <i
              :disabled="index === 0"
              :class="[{disabled: index === 0}]"
              class="el-icon-top"
              @click="handleClick(index, 'up')"
            />
            <i
              :disabled="index === value.length - 1"
              :class="[{disabled: index === value.length - 1}]"
              class="el-icon-bottom"
              @click="handleClick(index, 'down')"
            />
            <!-- 上下 -->
          </div>
        </ody-left-right>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick(index, dir) {
      const arr = this.value
      if (dir === 'up') {
        [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]]
      } else if (dir === 'down') {
        [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      }

      this.$emit('input', arr)
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-list-switch {
  background:rgba(255,255,255,1);
  border-radius:2px;
  border:1px solid rgba(206,212,218,1);
  padding: 10px 0;
  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    padding: 0 10px;
    &:hover {
      background-color: var(--themeColor10);
      .el-icon-top, .el-icon-bottom {
        visibility: visible;
      }
    }
  }
  .el-icon-top, .el-icon-bottom {
    display: inline-block;
    visibility: hidden;
    &.disabled {
      color: #cccbcb !important;
    }
    &:hover {
      color: var(--themeColor);
    }
  }
}
</style>

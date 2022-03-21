<template>
  <div class="cp-member-levels-checkbox">
    <div v-for="item in list" :key="item.memberType" class="levels-content">
      <el-tag type="info" class="levels-tag">{{ item.memberTypeName }}</el-tag>
      <ody-checkbox2
        v-if="item.memberLevelList.length > 0"
        ref="ody-checkbox2"
        :value="item.value"
        :selected.sync="item.frontSelected"
        :clearable="!(selected && selected.disabled)"
        :multiple="false"
        v-bind="$attrs"
        :label-key="labelKey"
        :value-key="valueKey"
        :item-disabled="itemDisabled"
        :list="item.memberLevelList"
        :is-show-all="isShowAll"
        :checked-all="checkedAll"
        @change="handleChange"
      >
        <template slot-scope="scope">
          <slot :item="scope.item" />
        </template>
      </ody-checkbox2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'levelCode'
    },
    labelKey: {
      type: String,
      default: 'levelName'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: Number,
      default: 0
    },
    isShowAll: {
      type: Boolean,
      default: false
    },
    checkedAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      innnerValue: []
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.list.forEach(x => {
          x.value = val
        })
      },
      deep: true
    }
  },
  async created() {
    var {
      data = []
    } = await this.$promotion.$api.promotion.queryMemberTypeList({})
    data = data.filter(x => {
      if (x.memberLevelList && x.memberLevelList.length > 0) {
        return x
      }
    })
    this.list = data.map(x => {
      x.value = this.value || []
      return x
    })
  },
  mounted() {},
  methods: {
    handleChange(newValue) {
      this.$emit('input', newValue)
      this.list.forEach(x => {
        const isChecked = x.memberLevelList.some(x => newValue.includes(x.levelCode))
        this.$emit('change', x.memberType, isChecked)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-member-levels-checkbox {
  .levels-content {
    display: flex;

    .levels-tag {
      margin-right: 10px;
    }
  }
}
</style>

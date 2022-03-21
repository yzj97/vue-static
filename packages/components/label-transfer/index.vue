<template>
  <div class="cp-label-transfer">
    <ody-button
      :disabled="disabled"
      code="ui"
      size="small"
      type="default"
      @click="visible = true"
    >
      {{ label }}
    </ody-button>
    <template v-if="showCheckedCount">
      已选 <span class="selected"> {{ innerValue.length }} </span> 个
    </template>
    <ody-dialog
      :visible.sync="visible"
      :append-to-body="true"
      title="编辑标签"
      width="960px"
      @before-close="handleModalClose"
      @open="handleOpen"
    >
      <ody-tree-transfer
        v-loading="loading"
        ref="treeTransfer"
        :data="labelList"
        :checked.sync="innerSelected"
        style="margin-left: 60px;"
        label-key="labelName"
        source-label="待选择标签"
        target-label="已选择标签"
        children-key="labelList"
        parent-key="groupId"
      />
      <span slot="footer">
        <ody-button code="ui" size="small" @click="handleModalClose">取消</ody-button>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">确定</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showCheckedCount: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: '+ 添加标签'
    }
  },
  data() {
    return {
      loading: true,
      visible: false,
      labelList: [
      ],
      innerValue: [],
      innerSelected: []
    }
  },
  computed: {
    valueMap() {
      return this.value.reduce((rtv, item) => {
        rtv[item] = true
        return rtv
      }, {})
    }
  },
  mounted() {
    this.handleChecked()
  },
  methods: {
    handleChecked() {
      const { length: valueLength } = this.value
      const { length: selectedLength } = this.selected

      if (valueLength > 0 && selectedLength === 0) {
        this.innerValue = this.value

        if (this.$refs.treeTransfer) {
          this.$nextTick(() => {
            this.$refs.treeTransfer.handleSourceToTargetByCheckedKeys(this.value, true)
          })
        }
      } else if (selectedLength > 0 && valueLength === 0) {
        this.innerSelected = this.selected

        if (this.$refs.treeTransfer) {
          this.$nextTick(() => {
            const innerValue = this.$refs.treeTransfer.getTargetLastKeys()
            this.innerValue = innerValue
            this.$emit('input', innerValue)
          })
        } else {
          const lastIdList = this.$portal.getTreeLastItem(this.selected, 'children')
            .map(x => x.id)

          this.innerValue = [... new Set(lastIdList)]
        }
      } else {
        this.innerSelected = this.selected
        this.innerValue = this.value
      }
    },
    async handleOpen() {
      this.loading = true
      const { data: labelList } = await this.$api.labelFactory.queryArtificialLabelList({
        labelRelevanceObject: 1
      })
      const newLabelList = labelList.filter(x => x.labelList)

      newLabelList.forEach((item, index) => {
        item.id = item.labelClassifyId
        item.groupId = '0'
        item.labelName = item.labelClassifyName

        item.labelList.forEach(x => {
          x.groupId = '$parent_' + x.id
          x.id = x.labelId
        })
      })

      this.labelList = newLabelList
      this.loading = false

      this.handleChecked()
      this.$emit('open')
    },
    handleModalClose() {
      this.visible = false
      this.$emit('cancel')
    },
    handleSubmit() {
      const innerValue = this.$refs.treeTransfer.getTargetLastKeys()
      this.$emit('update:selected', this.innerSelected)
      this.innerValue = innerValue
      this.$emit('input', innerValue)
      this.visible = false
      this.$emit('ok', this.innerSelected)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-label-transfer {
  display: inline-block;
  .selected {
    color: red;
  }
}
</style>

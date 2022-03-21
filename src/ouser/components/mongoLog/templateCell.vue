<template>
  <div>
    <el-popover
      v-if="row && ((popProp && row[popProp]) || (!popProp && prop && row[prop]))"
      :width="width"
      placement="top-start"
      trigger="hover">
      <div v-if="scroll" style="max-height: 300px; overflow-y: scroll;">
        <pre>{{ row[popProp ? popProp : prop] }}</pre>
      </div>
      <span v-else>{{ row[popProp ? popProp : prop] }}</span>
      <i v-clipboard:copy="copyData" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
      <div slot="reference" :style="`width: ${200 + 'px'}`" >{{ row[prop] }}</div>
    </el-popover>
    <span v-else>{{ row[prop] }}</span>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    prop: {
      type: String,
      default: null
    },
    popProp: {
      type: String,
      default: null
    },
    scroll: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '200'
    }
  },
  data() {
    return {

    }
  },
  computed: {
    copyData() {
      const cellData = this.row[this.popProp ? this.popProp : this.prop]
      if (typeof cellData === 'string') {
        return cellData
      }
      return JSON.stringify(cellData)
    }
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    }
  }
}

</script>

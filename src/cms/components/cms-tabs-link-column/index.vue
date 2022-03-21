<template>
  <div class="cms-choose-coupon-set">
    <ody-choose
      v-if="visible"
      :search-config="searchConfig"
      :search-value="searchValue"
      :request-url="requestUrl"
      :columns="columns"
      :search-format="changeParam"
      :selectable-out="selectable"
      :multiple="true"
      :title="$t('选择页面栏目')"
      request-page-type="page"
      @close="handleClose"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    excludeId: {
      type: String,
      default: ''
    },
    pageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      requestUrl: '/cms-web/cmsModule/listPage',
      searchConfig: [
        {
          label: this.$t('栏目ID'),
          prop: 'id',
          type: 'input'
        },
        {
          label: this.$t('栏目名称'),
          prop: 'name',
          type: 'input'
        }

      ],
      searchValue: {
        name: '',
        id: '',
        pageId: this.pageId,
        excludeId: this.excludeId,
        renderType: 0,
        excludeCodeList: ['header', 'tabs']
      },
      columns: [
        {
          label: this.$t('栏目ID'),
          prop: 'id',
          show: true
        },
        {
          label: this.$t('栏目名称'),
          prop: 'name',
          show: true
        }
      ]
    }
  },
  methods: {
    selectable(row, index) {
      return !row.exist
    },
    // 栏目接口的入参
    changeParam(val) {
      const obj = {
        filters: val
      }
      return obj
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSubmit(val) {
      if (val.length === 0) {
        return
      }
      const arr = val.map(item => item.id)
      const params = {
        idList: arr,
        renderType: 1
      }
      await this.$cms.$api.cmsEdit.updateByIdList(params)
      this.$emit('update:visible', false)
      this.$emit('ok', val, val.length)
      // this.$emit('getModule', val)
    }
  }

}
</script>

<style lang="scss" scoped>

</style>

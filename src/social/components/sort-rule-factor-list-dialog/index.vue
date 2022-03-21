<template>
  <ody-dialog
    :title="$t('添加因子')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="960px">
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :data="comment.list"
          :columns="columns"
          :loading="loading"
          :multiple="multiple"
          :checked.sync="checked"
          :can-filter="false"
          name="comment_list822"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="comment.list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />

      </div>
    </ody-list-table-area>
    <span slot="footer">
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('关闭') }}</el-button>
      <el-button name="handleAddFactor" size="small" type="primary" @click="handleAddFactor">{{ $t('确定') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checked: [],
      loading: false,
      multiple: true,
      columns: [
        {
          show: true,
          prop: 'rankCode',
          label: this.$t('排序因子编号'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'rankName',
          label: this.$t('排序因子名称'),
          align: 'center',
          minWidth: 120
        }
      ],
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  watch: {
    'visible': {
      handler() {
        if (this.visible) {
          this.page.total = this.comment.total
          this.checked = []
        }
      }
    }
  },
  mounted() {
    this.indexApi = this.$social.$api.indexApi
  },
  methods: {
    query() {
      const param = {
        pageNum: this.page.current,
        pageSize: this.page.size
      }
      this.loading = true
      try {
        this.indexApi.getOrderingRuleList(param).then(res => {
          if (res.code === '0' && res.data.dataList.length > 0) {
            this.data = res.data.dataList
          }
        })
      } finally {
        this.loading = false
      }
    },
    handlePageSizeChange() {
      this.init()
    },
    handlePageCurrentChange() {
      this.init()
    },
    handleBack() {
      this.page = {
        size: 10,
        current: 1,
        total: 0
      }
      this.$emit('update:visible', !this.visible)
    },
    handleAddFactor() {
      this.$emit('ok', this.checked)
      this.$emit('update:visible', !this.visible)
    }
  }
}
</script>

<style scoped>

</style>

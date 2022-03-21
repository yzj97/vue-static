<template>
  <div>
    <el-form :rules="formRules" label-width="100px" class="form">
      <ody-search-item :label="$t('限购总数')" prop="limit">
        <ody-input-number v-model="limit" :empty-tip="false" name="limit"/>
      </ody-search-item>
      <el-button type="primary" size="small">{{ $t('保存') }}</el-button>
    </el-form>
    <ody-table
      :selectable="checkedSelectable"
      :columns="columns"
      :data="tableData"
      :checked.sync="checked"
      :multiple="true"
      :can-filter="false"
      name="tableData071"
    >
      <template slot="limitCount" slot-scope="scope">
        <ody-input-number
          v-model="scope.row.limitCount"
          :empty-tip="false"
          name="scope_row_limitCount"
        />
      </template>

    </ody-table>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      limit: '',
      checked: [],
      columns: [
        {
          label: this.$t('类目'),
          prop: 'categoryName',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('商品名称'),
          prop: 'mpName',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('商品编码'),
          prop: 'mpCode',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('商品价格'),
          prop: 'price',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('店铺名称'),
          prop: 'storeName',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('个人限购总数'),
          slot: 'limitCount',
          show: true,
          minWidth: 120
        }
      ]
    }
  },
  watch: {
    list: {
      handler(newValue) {
        this.tableData = newValue
      },
      immediate: true,
      deep: true
    }
  },
  formRules: {}
}
</script>

<template>
  <div>
    <ody-dialog :visible="visible" :before-close="handleClose" :title="$t('选择商品')" width="65%">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form">
            <ody-search-item :label="$t('商品编码')" prop="code">
              <el-input v-model="queryParam.code" name="queryParam_code" />
            </ody-search-item>
            <ody-search-item :label="$t('商品名称')" prop="chineseName">
              <el-input v-model="queryParam.chineseName" name="queryParam_chineseName" />
            </ody-search-item>
            <ody-search-item :label="$t('货号')" prop="artNo">
              <el-input v-model="queryParam.artNo" name="queryParam_artNo" />
            </ody-search-item>
            <ody-search-item :label="$t('主条码')" prop="barCode">
              <el-input v-model="queryParam.barCode" name="queryParam_barCode" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
          <el-button name="query" size="small" type="primary" @click="query">{{ $t('查询') }}</el-button>
        </div>
      </ody-list-search-area>
      <el-table
        ref="multipleTable"
        :data="list"
        name="list235"
        tooltip-effect="dark"
        @select-all="selectAll"
        @select="selectRow"
      >
        <el-table-column :selectable="canSelect" type="selection" width="55" />
        <el-table-column :label="$t('商品编码')" prop="code" />
        <el-table-column :label="$t('商品名称')" prop="chineseName" />
        <el-table-column :label="$t('规格属性')">
          <template slot-scope="scope">
            <span v-for="(p, index) in scope.row.attList" :key="index">{{ p }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('货号')" prop="artNo" />
        <el-table-column :label="$t('主条码')" prop="barCode" />
        <el-table-column :label="$t('计量单位')" prop="mainUnitName" />
      </el-table>
      <el-row :style="`margin-top: 10px`" type="flex" justify="end">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="query"
        />
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
          <el-button name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('确定') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    ids: {
      type: Array,
      default: () => {
        return []
      }
    },
    warehouseId: {
      type: Number,
      default: null
    },
    // 仓库类型，true 有实体仓，false 无实体仓
    warehouseTypeView: {
      type: Boolean,
      default: null
    },
    merchantId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      list: [],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      queryParam: {
        warehouseId: this.warehouseId,
        warehouseTypeView: this.warehouseTypeView,
        merchantId: this.merchantId
      }
    }
  },
  mounted() {
    this.mpApi = this.$product.$api.mpApi
    this.query()
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const mpList = this.list.filter(item => {
        return item.checked
      })
      this.$emit('ok', mpList)
      this.$emit('update:visible', !this.visible)
    },
    query() {
      var param = Object.assign({}, this.queryParam, this.page)
      this.mpApi.listMerchantProductByPageOnModal(param).then(res => {
        this.list = res.data.listObj
        this.page.total = res.data.total
      })
    },
    canSelect(row, index) {
      return this.ids.indexOf(row.id) === -1
    },
    selectRow(selection, row) {
      row.checked = !row.checked
    },
    selectAll(selection) {
      if (selection.length === 0) {
        // 取消全选
        this.list.map(item => {
          item.checked = false
        })
      } else {
        // 全选
        selection.map(item => {
          item.checked = true
        })
      }
    },
    reset() {
      this.queryParam = {
        warehouseId: this.warehouseId,
        merchantId: this.merchantId
      }
    },
    sizeChange(val) {
      this.page.itemsPerPage = val
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('选择商品')"
      :modal-append-to-body="false"
      width="60%">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form">
            <ody-search-item :label="$t('商品名称')" prop="chineseName">
              <el-input v-model="queryParam.chineseName" name="queryParam_chineseName"/>
            </ody-search-item>
            <ody-search-item :label="$t('商品条码')" prop="barCode">
              <el-input v-model="queryParam.barCode" name="queryParam_barCode"/>
            </ody-search-item>
            <ody-search-item :label="$t('商品编码')" prop="code">
              <el-input v-model="queryParam.code" name="queryParam_code"/>
            </ody-search-item>
            <ody-search-item :label="$t('商品品牌')" prop="brandName">
              <el-input v-model="queryParam.brandName" name="queryParam_brandName" @focus="openBrandModal"/>
            </ody-search-item>
            <!-- 品牌模态框组件 --->
            <brand-modal-component v-if="brandVisible" :visible.sync="brandVisible" @ok="closeBrandModal"/>
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
        name="list337"
        tooltip-effect="dark"
        @select-all="selectAll"
        @select="selectRow">
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          :label="$t('商品名称')"
          prop="chineseName"/>
        <el-table-column
          :label="$t('商品编码')"
          prop="code"/>
        <el-table-column
          :label="$t('商品条码')"
          prop="barCode"/>
        <el-table-column
          :label="$t('商品类目')"
          prop="categoryFullNamePath"/>
        <el-table-column
          :label="$t('商品品牌')"
          prop="brandName"/>
      </el-table>
      <el-row :style="`margin-top: 10px`" type="flex" justify="end">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="query"/>
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
    param: {
      type: Object,
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
      queryParam: { merchantId: this.param.merchantId },
      brandVisible: false,
      categoryTreeData: [],
      loading: false,
      limitCount: 10,
      categoryNameList: [],
      groupIndex: null
    }
  },
  mounted() {
    this.mpApi = this.$product.$api.mpApi
    this.loading = true
    this.queryParam = { mpIds: this.param.mpIds, merchantId: this.param.merchantId }
    this.limitCount = this.param.limitCount
    this.groupIndex = this.param.index
    this.queryBackedRootCategory()
    this.query()
    this.loading = false
  },
  methods: {
    // 后台类目树
    queryBackedRootCategory() {
      this.mpApi.listBackCategory().then(
        res => {
          var arr = res.data
          this.categoryTreeData = toTree(arr)
        }
      )
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const mpList = this.list.filter(item => {
        return item.checked
      })
      if (mpList.length > this.limitCount) {
        this.$message({
          showClose: true,
          message: this.$t('最多添加10个商品'),
          type: 'error'
        })
        return
      }
      const resultData = { index: this.groupIndex, list: [] }
      for (const mp of mpList) {
        resultData.list.push({ subMpId: mp.id, chineseName: mp.chineseName, salePriceWithTax: mp.salePriceWithTax })
      }

      this.$emit('ok', resultData)
      this.$emit('update:visible', !this.visible)
    },
    query() {
      var param = Object.assign({}, this.queryParam, this.page)
      this.mpApi.listMerchantProductForAddMpCombineByPage(param).then(
        res => {
          this.list = res.data.listObj
          this.page.total = res.data.total
        }
      )
    },
    selectRow(selection, row) {
      row.checked = !row.checked
    },
    selectAll(selection) {
      if (selection.length === 0) { // 取消全选
        this.list.map(item => {
          item.checked = false
        })
      } else { // 全选
        selection.map(item => {
          item.checked = true
        })
      }
    },
    reset() {
      this.queryParam = { mpIds: this.param.mpIds, merchantId: this.param.merchantId }
    },
    sizeChange(val) {
      this.page.itemsPerPage = val
      this.query()
    },
    openBrandModal() { // 打开品牌模态框
      this.brandVisible = !this.brandVisible
    },
    closeBrandModal(selectVal) { // 关闭品牌模态框
      this.queryParam = Object.assign({}, this.queryParam, selectVal)
    }
  }
}
function toTree(data) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item.parentId]
    item.label = item.name
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}
</script>

<style lang="scss" scoped>

</style>

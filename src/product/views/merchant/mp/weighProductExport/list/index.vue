<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="$t('商家')" label-width="100px" prop="merchantId">
            <ody-merchant-select
              v-model="queryParam.merchantId"
              :item-disabled="checkItem"
              :placeholder="$t('全部')"
              name="queryParam_merchantId"
              value-key="merchantId"
              @change="changeMerchant"
            />
          </ody-search-item>
          <ody-search-item :label="$t('店铺')" prop="storeId">
            <el-select
              :disabled="!queryParam.merchantId"
              v-model="queryParam.storeId"
              :placeholder="$t('全部')"
              name="queryParam_storeId"
            >
              <el-option
                v-for="item in storeList"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId"
              />
            </el-select>
            <!-- <ody-store-select
              :disabled="!queryParam.merchantId"
              :key="queryParam.merchantId"
              v-model="queryParam.storeId"
              :placeholder="$t('全部')"
              :item-filter="itemFilter"
              name="queryParam_storeId"
              value-key="storeId"
            /> -->
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')" prop="chineseName">
            <el-input v-model="queryParam.chineseName" name="queryParam_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')" prop="code">
            <el-input v-model="queryParam.code" name="queryParam_code" />
          </ody-search-item>
          <ody-search-item :label="$t('PLU码')" prop="barCode">
            <el-input v-model="queryParam.barCode" name="queryParam_barCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品类目')" prop="categoryIds">
            <ody-tree-select
              v-model="queryParam.categoryIds"
              :multiple="true"
              :disable-branch-nodes="true"
              :load-options="loadOptions"
              :options="options"
              :placeholder="$t('全部')"
              :append-to-body="true"
              :z-index="3000"
              name="queryParam_categoryIds"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品品牌')" prop="brandId">
            <el-select v-model="queryParam.brandId" :placeholder="$t('全部')" name="queryParam_brandId">
              <el-option
                v-for="(item,index) in brandList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          name="WeighProductExportPageQuery_query"
          size="small"
          type="primary"
          code="WeighProductExportPageQuery"
          @click="query"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="WeighProductExportList_doExport"
          size="small"
          type="primary"
          code="WeighProductExportList"
          @click="doExport"
        >{{ $t('导出') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :can-filter="false" :columns="columns" :data="tableList" name="tableList640" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page="page.current"
          :list="tableList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="page.size"
          :total="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="page.handleSizeChange"
          @current-change="page.handleCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :title="$t('导出文件选择')"
      width="600px"
      @close="close"
    >
      <el-row>
        <el-col :span="24">
          {{ $t('选择电子秤') }}:
          <el-radio v-model="queryParam.scaleType" :label="1" name="queryParam_scaleType">{{ $t('大华电子秤') }}</el-radio>
        </el-col>
      </el-row>
      <br >
      <el-row>
        <el-col :span="24">
          {{ $t('选择导出格式') }}:
          <el-radio v-model="queryParam.exportType" :label="2" name="queryParam_exportType">Excel</el-radio>
          <el-radio v-model="queryParam.exportType" :label="1" name="queryParam_exportType2">{{ $t('文本') }}（txt）</el-radio>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button name="close" size="small" @click="close">{{ $t('取消') }}</el-button>
        <el-button name="exportHandler" size="small" type="primary" @click="exportHandler">{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>
<script>
import mpApi from '@/api/mpApi.js'

export default {
  name: 'WeighProductExport',
  data() {
    const vue = this
    return {
      visible: false,
      storeMap: [],
      queryParam: getDefaultQueryParam(),
      brandList: [],
      allData: [],
      options: null,
      storeList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
        handleSizeChange(val) {
          vue.page.size = val
          vue.query()
        },
        handleCurrentChange(val) {
          vue.page.current = val
          vue.query()
        }
      },
      tableList: [],
      columns: [
        {
          show: true,
          label: this.$t('商品名称'),
          prop: 'chineseName',
          minWidth: 200
        },
        { show: true, label: this.$t('商品编码'), prop: 'code', minWidth: 150 },
        { show: true, label: this.$t('PLU码'), prop: 'barCode', minWidth: 120 },
        {
          show: true,
          label: this.$t('单价'),
          prop: 'salePriceWithTax',
          minWidth: 100
        },
        {
          show: true,
          label: this.$t('商品类目'),
          prop: 'categoryName',
          minWidth: 200
        },
        {
          show: true,
          label: this.$t('商品品牌'),
          prop: 'brandName',
          minWidth: 100
        }
      ]
    }
  },
  async mounted() {
    this.brandList.push(...(await this.loadBrandList(1)))
  },
  methods: {
    // itemFilter(row, index) {
    //   if (this.queryParam.merchantId) {
    //     if (row.merchantId === this.queryParam.merchantId && row.channelCodes === '120001') {
    //       return true
    //     } else {
    //       return false
    //     }
    //   } else {
    //     return true
    //   }
    // },
    async loadBrandList(currPage) {
      const brandList = await this.$product.$api.mpApi.listBrand({
        currentPage: currPage,
        itemsPerPage: 100
      })
      if (brandList.code !== '0' || brandList.data.listObj.length < 100) {
        return brandList.code === '0' ? brandList.data.listObj : []
      }
      const nextPage = await this.loadBrandList(currPage + 1)
      brandList.data.listObj.push(...nextPage)
      return brandList.data.listObj
    },
    getStoreList() {
      this.$product.$api.merchantApi
        .queryPlatformAuthStorePage({
          currentPage: 1,
          itemsPerPage: 10000,
          channelCodes: ['120001'],
          merchantId: this.queryParam.merchantId
        })
        .then(res => {
          this.storeList = res.data.listObj
          this.storeList.map(item => {
            this.storeMap[item.storeId] = item
          })
        })
    },
    changeMerchant() {
      this.queryParam.storeId = null
      this.getStoreList()
    },
    async loadOptions({ action, parentNode, callback }) {
      switch (action) {
        case 'LOAD_ROOT_OPTIONS':
          await this.loadRootCategory()
          break
        case 'LOAD_CHILDREN_OPTIONS':
          await this.loadChildrenCategory(parentNode)
          break
        default:
      }
    },
    async loadRootCategory() {
      const result = await this.$product.$api.mpApi.queryBackedRootCategory()
      let datas = result.data
      if (!datas) {
        return
      }
      if (!Array.isArray(datas)) {
        datas = [datas]
      }
      datas.forEach(element => {
        if (element.isLeaves === 2) {
          element.children = null
        }
        element.label = element.name
        this.allData.push(element)
      })
      this.options = datas
    },
    async loadChildrenCategory(parentNode) {
      const result = await this.$product.$api.mpApi.queryCategoryListByParent({
        parentId: parentNode.id
      })
      if (!result.data) {
        return
      }
      let datas = result.data
      if (!Array.isArray(datas)) {
        datas = [datas]
      }
      datas.forEach(element => {
        if (element.isLeaves === 2) {
          element.children = null
        }
        element.label = element.name
        this.allData.push(element)
      })
      this.$set(parentNode, 'children', datas)
    },
    doExport() {
      if (!this.queryParam.merchantId && !this.queryParam.storeId) {
        this.$message(this.$t('请先选择商家和店铺'))
        return
      }
      this.visible = true
    },
    reset() {
      this.queryParam = getDefaultQueryParam()
    },
    close() {
      this.visible = false
    },
    async query() {
      if (!this.queryParam.merchantId && !this.queryParam.storeId) {
        this.$message(this.$t('请先选择商家和店铺'))
        return
      }
      const result = await this.$product.$api.mpApi.listStoreWeighMp({
        ...this.queryParam,
        currentPage: this.page.current,
        itemsPerPage: this.page.size
      })
      this.tableList = result.data.listObj || []
      this.page.total = result.data.total
    },
    async exportHandler() {
      this.$portal.downloadFileByPost(
        'api/' + mpApi.exportStoreWeighMp.url,
        this.queryParam
      )
    }
  }
}

function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      merchantId: null,
      chineseName: null,
      code: null,
      barCode: null,
      brandId: null,
      categoryIds: [],
      storeId: null,
      scaleType: 1, // 大华电子秤
      exportType: 2, // Excel:2, TXT:1
      type: 31 // 称重商品类型
    }
  )
}
</script>

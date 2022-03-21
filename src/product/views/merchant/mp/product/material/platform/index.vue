<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('筛选') + ':'" prop="queryFlag">
            <el-select v-model="queryParam.queryFlag" :placeholder="$t('全部')" name="queryParam_queryFlag" clearable>
              <el-option :label="$t('全部原料')" :value="1" />
              <el-option :label="$t('未分发')" :value="2" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('原料名称') + ':'" prop="chineseName">
            <el-input v-model="queryParam.chineseName" :placeholder="$t('请输入原料名称')" name="queryParam_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('原料编码') + ':'" prop="code">
            <el-input v-model="queryParam.code" :placeholder="$t('请输入原料编码')" name="queryParam_code" />
          </ody-search-item>
          <ody-search-item :label="$t('商品类型') + ':'" prop="type">
            <el-select v-model="queryParam.type" :placeholder="$t('全部')" name="queryParam_type" clearable>
              <el-option v-for="(v,k) in productTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('原料品牌') + ':'" prop="brandName">
            <el-input
              v-model="queryParam.brandName"
              :placeholder="$t('common_choose_please')"
              name="queryParam_brandName"
              readonly="true"
              @click.native="brandVisible = !brandVisible"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          name="MaterialProductListQuery_handleQuery"
          size="small"
          type="primary"
          code="MaterialProductListQuery"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="PlatformMaterialProductBatchExport_batchExport"
          size="small"
          type="primary"
          code="PlatformMaterialProductBatchExport"
          @click="batchExport"
        >{{ $t('批量导出') }}</ody-button>
        <ody-button
          :disabled="table.checked.length == 0"
          name="PlatformMaterialProductBatchDispatch_batchSentDown"
          size="small"
          type="primary"
          code="PlatformMaterialProductBatchDispatch"
          @click="batchSentDown"
        >{{ $t('批量分发') }}</ody-button>
        <ody-button
          name="PlatformMaterialProductViewExportList_viewTask"
          size="small"
          code="PlatformMaterialProductViewExportList"
          @click="viewTask"
        >{{ $t('查看任务') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="table.checked"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          :selectable="checkedSelectable"
          request-url="/back-product-web/back/mp/product/listMaterialProductByPage.do"
          request-page-type="page"
        >
          <template slot="combineLine" slot-scope="scope">
            <div>
              <div class="table-product-name">
                <ody-left-right effect="positionLeft">
                  <div slot="left">
                    <div class="image-container">
                      <el-image
                        :src="scope.row.pictureUrl"
                        :fit="cover"
                        style="width: 100px; height: 100px"
                      >
                        <div
                          slot="error"
                          style="font-size: 30px;display: flex;align-items: center; justify-content: center;width: 100%; height: 100%; background: #f5f7fa; color: #909399;"
                        >
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </div>
                    <div class="name-container">
                      <div class="link-name">
                        <el-link type="primary">
                          <router-link
                            :to="$portal.hasPermission('PlatformMaterialProductViewDetail') ? { name: 'ProductDetailMaterial', query: { id: scope.row.id, isView: true } }:{}"
                          >
                            <el-tooltip placement="top">
                              <template slot="content">
                                <div>{{ scope.row.chineseName }}</div>
                              </template>
                              <div class="name-text">{{ scope.row.chineseName }}</div>
                            </el-tooltip>
                          </router-link>
                        </el-link>
                      </div>
                      <div class="table-product-label">{{ productTypeList[scope.row.type] }}</div>
                    </div>
                  </div>
                  <div slot="right" style="left: 310px;">
                    <span>
                      <el-popover placement="bottom" trigger="click">
                        <div class="popover-container">
                          <div class="popover-input">
                            <el-input v-model="chineseNameVal" name="chineseNameVal" maxlength="60" />
                          </div>
                          <div class="popover-button">
                            <el-button name="canclePopover" size="small" @click="canclePopover()">{{ $t('取消') }}</el-button>
                            <ody-button
                              name="PlatformMaterialProductUpdateName_savaChineseName"
                              size="small"
                              type="primary"
                              code="PlatformMaterialProductUpdateName"
                              @click="savaChineseName(scope.row)"
                            >{{ $t('确认') }}</ody-button>
                          </div>
                        </div>
                        <i
                          slot="reference"
                          name="changeChineseName"
                          class="el-icon-edit el-icon"
                          @click="changeChineseName(scope.row)"
                        />
                      </el-popover>
                    </span>
                  </div>
                </ody-left-right>
              </div>
            </div>
          </template>
          <template slot="combineCode" slot-scope="scope">
            <div class="table-code">
              <div class="table-code-merchant">
                <span class="table-code-merchant-span">{{ $t('编') }}</span>
                <span>{{ scope.row.code }}</span>
              </div>
              <div v-if="scope.row.artNo" class="table-code-goods">
                <span class="table-code-good-span">{{ $t('货') }}</span>
                <span>{{ scope.row.artNo }}</span>
              </div>
            </div>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <download-task :is-data-task="true" :task-type="'materialProductExport'" :visible.sync="downloadTaskVisible" />
    <PlatformProductBatchSentDown
      :visible.sync="platformProductBatchSentDownVisible"
      :ids="ids"
      :sent-type="1"
    />
    <PlatformProductSentView
      :platform-mp-id.sync="platformMpId"
      :visible.sync="materialProductSentVisible"
    />
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'
import PlatformProductSentView from '@/components/platformProductSentView'
import PlatformProductBatchSentDown from '@/components/platformProductBatchSentDown'
import commonConstant from '@/constant/comConstant.js'
import BrandModalComponent from '@/components/brandModal'
export default {
  components: {
    DownloadTask,
    PlatformProductSentView,
    PlatformProductBatchSentDown,
    BrandModalComponent
  },
  data() {
    const self = this
    return {
      brandVisible: false,
      checked: [],
      productTypeList: [],
      brandList: [],
      batchType: 1,
      batchStatusType: 1,
      platformMpId: null,
      downloadTaskVisible: false,
      materialProductSentVisible: false,
      platformProductBatchSentDownVisible: false,
      queryParam: getDefaultQueryParam(),
      loading: false,
      chineseNameVal: '',
      salePriceVal: '',
      list: [],
      editNameForm: {
        id: null,
        chineseName: null
      },
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      table: {
        columns: [
          {
            show: true,
            tooltip: false,
            slot: 'combineLine',
            label: this.$t('原料名称'),
            minWidth: 200
          },
          {
            show: true,
            slot: 'combineCode',
            label: this.$t('原料编码/货号'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            prop: 'brandName',
            label: this.$t('品牌'),
            align: 'left',
            minWidth: 200
          }
        ],
        operates: {
          fixed: 'right',
          width: 140,
          list: [
            {
              label: this.$t('编辑'),
              disabled: false,
              method: (index, row) => {
                self.edit(row)
              },
              code: 'PlatformMaterialProductEdit'
            },
            {
              label: this.$t('复制'),
              disabled: false,
              method: (index, row) => {
                self.copy(row)
              },
              code: 'PlatformMaterialProductCopy'
            },
            {
              label: this.$t('查看分发'),
              disabled: false,
              method: (index, row) => {
                self.viewSentDown(row)
              },
              code: 'PlatformMaterialProductViewSentDown'
            }
          ]
        },
        checked: []
      }
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      this.loading = true
      await this.queryList()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
    this.initCodes()
    // this.initBrand()
  },
  methods: {
    initCodes() {
      const vue = this
      vue.$product.$api.common
        .listMultiCode({
          categorys: ['PRODUCT_TYPE']
        })
        .then(data => {
          if (data.code === '0') {
            vue.productTypeList = data.data.PRODUCT_TYPE
          }
        })
    },
    initBrand() {
      this.$api.brand
        .listBrand({ currentPage: 1, itemsPerPage: 2000 })
        .then(res => {
          this.brandList = res.data.listObj
        })
    },
    closeBrandModal(selectVal) {
      this.queryParam.brandId = selectVal.id
      this.queryParam.brandName = selectVal.name
    },
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
    },
    // 运营原料商品列表查询
    async queryList(obj) {
      this.table.checked = []
      return this.$refs.table.getList(
        this.formHasValue({
          filters: {
            ...this.queryParam
          }
        })
      )
    },
    // 查看
    check(e) {
      this.$router.push({
        path:
          commonConstant.BASE_REQUEST_URL +
          '/merchant/mp/merchantProductManage/edit',
        query: {
          id: e.id,
          check: false
        }
      })
    },
    // 编辑
    edit(row) {
      const name = 'ProductDetailMaterial'
      this.$router.push({
        name: name,
        params: { id: row.id },
        query: { id: row.id }
      })
    },
    // 复制
    copy(row) {
      this.$router.push({
        name: 'ProductDetailMaterial',
        query: { id: row.id, clone: true }
      })
    },
    // 查看分发
    viewSentDown(row) {
      this.platformMpId = row.id
      this.materialProductSentVisible = true
    },
    // 批量分发
    async batchSentDown() {
      const result = await this.mpApi.listPlatformDispatchByUserId()
      if (result && result.code === '0') {
        if (result.data === 0) {
          const ids = []
          if (this.table.checked && this.table.checked.length > 0) {
            for (let i = 0; i < this.table.checked.length; i++) {
              const item = this.table.checked[i]
              ids.push(item.id)
            }
          }
          if (ids.length === 0) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择要下发的商品信息')
            })
            return
          }
          this.ids = ids
          this.platformProductBatchSentDownVisible = true
        } else {
          this.$alert(this.$t('商品分发中....'), this.$t('批量分发'), {})
        }
      }
    },
    // 重置
    reset() {
      this.queryParam = getDefaultQueryParam()
    },
    // 对名称赋值
    changeChineseName(row) {
      console.log(row)
      this.chineseNameVal = row.chineseName
    },
    canclePopover() {
      document.body.click()
    },
    savaChineseName(row) {
      row.chineseName = this.chineseNameVal
      this.editNameForm.id = row.id
      this.editNameForm.chineseName = this.chineseNameVal
      this.$product.$api.mpApi
        .updatePlatformMpNameById(this.editNameForm)
        .then(result => {
          if (result && result.code === '0') {
            this.editNameForm.id = null
            this.editNameForm.chineseName = null
          }
        })
      document.body.click()
    },
    viewTask() {
      this.downloadTaskVisible = true
    },
    // 批量导出
    batchExport() {
      const ids = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          ids.push(item.id)
        }
      }
      const params = this.$portal.deepClone(this.queryParam)
      params.idList = ids
      this.mpApi
        .asyncEvent({
          templateCode: 'materialProductExport',
          jsonTxt: JSON.stringify(params),
          dataTask: true,
          fileName: '运营原料管理导出.xlsx'
        })
        .then(res => {
          this.$confirm(
            this.$t('导出任务创建成功，任务编码：') +
              res.data +
              this.$t('，点击确认跳转到任务列表'),
            this.$t('导出提示'),
            {
              confirmButtonText: this.$t('确认'),
              cancelButtonText: this.$t('取消'),
              type: 'info'
            }
          ).then(() => {
            this.downloadTaskVisible = true
          })
        })
    }
  }
}

function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      queryFlag: '',
      chineseName: '',
      code: '',
      type: '',
      brandId: '',
      dataType: 1
    }
  )
}
</script>

<style lang="scss" scoped>
.table-product-label {
  display: inline-block;
  background: #1890ff;
  font-size: 12px;
  padding: 0 2px;
  color: #ffffff;
}
.image-container {
  float: left;
}
.name-container {
  margin-left: 100px;
  position: relative;
  height: 100px;
  padding: 5px;
}
.link-name {
  word-wrap: break-word;
  width: 200px;
  height: 70px;
  overflow: hidden;
  word-break: break-all;
  white-space: pre-wrap;
}

.name-text {
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.table-code {
  .table-code-merchant-span {
    background: #f56c6c;
    color: white;
    font-size: 12px;
  }
  .table-code-goods-span {
    background: #586348;
    color: #eef5f9;
    font-size: 12px;
  }
  .table-code-good-span {
    background: #ee9900;
    color: #ffffff;
    font-size: 12px;
  }
}
.popover-container {
  .popover-input {
    margin-bottom: 10px;
  }
}
.btn-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-button {
    margin-bottom: 4px;
  }
}
.product-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  width: 100px;
  display: block;
}
</style>

<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="$t('商家') + ':'" label-width="100px" prop="merchantId">
            <ody-merchant-select
              v-model="queryParam.merchantId"
              :item-disabled="checkItem"
              name="queryParam_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称') + ':'" prop="chineseName">
            <el-input v-model="queryParam.chineseName" name="queryParam_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="code">
            <el-input v-model="queryParam.code" name="queryParam_code" />
          </ody-search-item>
          <ody-search-item :label="$t('销售区域') + ':'" prop="saleAreaId">
            <el-select
              v-model="queryParam.saleAreaId"
              :placeholder="$t('common_choose_please')"
              name="queryParam_saleAreaId"
              clearable
              @click.native="checkMerchant"
            >
              <el-option
                v-for="item in saleAreaList"
                :label="item.areaName"
                :key="item.id"
                :value="item.id"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{
          $t("重置")
        }}</el-button>
        <ody-button
          name="SaleAreaManagementProduct_btn_query"
          code="SaleAreaManagementProduct_btn"
          size="small"
          type="primary"
          @click="query"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          :disabled="!checkedList || checkedList.length === 0"
          name="SaleAreaManagementUpdateSalesArea_btn_showAreaDialog"
          code="SaleAreaManagementUpdateSalesArea_btn"
          size="small"
          @click="showAreaDialog()"
        >{{ $t("批量设置") }}</ody-button
        >
      </div>
      <div slot="tabs">
        <el-tabs
          v-model="activeState"
          name="activeState"
          @tab-click="onTabClick"
        >
          <el-tab-pane
            v-for="(tab, index) in tabs"
            :label="tab.label"
            :key="index"
            :name="tab.name"
          />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :loading="loading"
          :checked.sync="checkedList"
          :multiple="true"
          :columns="columns"
          :operates="operates"
          :data="list"
          name="list917"
        >
          <template slot="chineseName" slot-scope="scope">
            <div>
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
                      :to="
                        $portal.hasPermission('SaleAreaManagementViewDetail')
                          ? {
                            name: 'ProductDetail',
                            query: { id: scope.row.id, isView: true }
                          }
                          : {}
                      "
                    >
                      <el-tooltip placement="top">
                        <template slot="content">
                          <div>{{ scope.row.chineseName }}</div>
                        </template>
                        <div>{{ scope.row.chineseName }}</div>
                      </el-tooltip>
                    </router-link>
                  </el-link>
                </div>
                <div class="name-tag">
                  <el-tag
                    v-if="scope.row.typeStr"
                    size="mini"
                    effect="dark"
                    type="danger"
                  >{{ scope.row.typeStr }}</el-tag
                  >
                </div>
              </div>
            </div>
          </template>
          <template slot="saleArea" slot-scope="scope">
            <div class="sale-area">
              <div class="sale-area-name">
                <el-tooltip placement="top">
                  <template slot="content">
                    <div>{{ scope.row.areaName }}</div>
                  </template>
                  <div>{{ scope.row.areaName }}</div>
                </el-tooltip>
              </div>
              <i
                name="showAreaDialog"
                class="el-icon-edit"
                @click="showAreaDialog(scope.row)"
              />
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <div :style="`margin-top: 10px`" type="flex" justify="end">
          <ody-pagination
            :current-page.sync="page.currentPage"
            :list="list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.itemsPerPage"
            :total.sync="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChange"
            @current-change="query"
          />
        </div>
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible="saleAreaDialog.visible"
      :before-close="handleClose"
      :title="$t('设置销售区域')"
      width="40%"
    >
      <el-checkbox
        :indeterminate="saleAreaDialog.isIndeterminate"
        v-model="saleAreaDialog.checkAll"
        name="saleAreaDialog_checkAll"
        @change="handleCheckAllChange"
      >{{ $t("全选") }}</el-checkbox
      >
      <div style="margin: 15px 0;" />
      <el-checkbox-group
        v-model="saleAreaDialog.areaChecked"
        name="saleAreaDialog_areaChecked"
        @change="handleCheckedAreaChange"
      >
        <el-checkbox
          v-for="(item, index) in saleAreaDialog.areaList"
          :label="item.id"
          :key="index"
        >{{ item.areaName }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button name="handleClose" size="small" @click="handleClose">{{
            $t("取消")
          }}</el-button>
          <ody-button
            :loading="updateAreaLoading"
            :disabled="updateAreaLoading"
            name="SaleAreaManagementUpdateSalesArea_btn_handleOk"
            code="SaleAreaManagementUpdateSalesArea_btn"
            size="small"
            type="primary"
            @click="handleOk"
          >{{ $t("确定") }}</ody-button
          >
        </el-row>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'SaleAreaManagement',
  components: {},
  data() {
    const vue = this
    return {
      list: [],
      saleAreaList: [],
      checkedList: [],
      saleAreaMap: {},
      merchantMap: {},
      saleAreaDialog: getDefaultDialogForm(),
      editRow: null,
      loading: false,
      updateAreaLoading: false,
      tabs: [
        {
          label: vue.$t('全部'),
          areaFlag: null
        },
        {
          label: vue.$t('已设置'),
          areaFlag: 1
        },
        {
          label: vue.$t('未设置'),
          areaFlag: 2
        }
      ],
      activeState: '0',
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          label: vue.$t('商品名称'),
          prop: 'chineseName',
          minWidth: 200,
          slot: 'chineseName',
          tooltip: false
        },
        {
          show: true,
          label: vue.$t('商品编码') + '/' + vue.$t('货号'),
          prop: 'code',
          minWidth: 200,
          render: (h, params) => {
            const codeComponent = (
              <div>
                <el-tag size='mini' effect='dark' type='danger'>
                  {vue.$t('编')}
                </el-tag>
                {params.row.code}
              </div>
            )
            let artNoComponent
            if (params.row.artNo) {
              artNoComponent = (
                <div>
                  <el-tag size='mini' effect='dark' type='warning'>
                    {vue.$t('货')}
                  </el-tag>
                  {params.row.artNo}
                </div>
              )
            }
            return (
              <div>
                {codeComponent}
                {artNoComponent}
              </div>
            )
          }
        },
        {
          show: true,
          label: vue.$t('销售区域'),
          prop: 'saleArea',
          minWidth: 200,
          slot: 'saleArea',
          tooltip: false
        },
        {
          show: true,
          label: vue.$t('商家'),
          prop: 'merchantId',
          render: (h, params) => {
            return (
              <div>
                {vue.merchantMap[params.row.merchantId]
                  ? vue.merchantMap[params.row.merchantId].merchantName
                  : ''}
              </div>
            )
          }
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: vue.$t('删除'),
            method: (index, row) => {
              this.deleteArea(row)
            },
            code: 'SaleAreaManagementUpdateSalesArea_btn'
          }
        ]
      },
      queryParam: getDefaultForm()
    }
  },
  watch: {
    'queryParam.merchantId': {
      handler(value, oldValue) {
        if (value !== oldValue) {
          this.changeMerchant()
        }
      }
    }
  },
  async mounted() {
    this.mpApi = this.$product.$api.mpApi
    this.query()
  },
  methods: {
    checkItem(row, index) {
      this.merchantMap[row.merchantId] = row
      return false
    },
    checkMerchant() {
      if (!this.queryParam.merchantId) {
        this.$message.info(this.$t('请选择商家'))
        return
      }
    },
    async query() {
      this.loading = true
      this.checkedList = []
      const index = this.activeState
      this.tabs.forEach((item, i) => {
        if (i.toString() === index) {
          this.queryParam.areaFlag = item.areaFlag
        }
      })

      const param = {}
      for (const k in this.queryParam) {
        if (this.queryParam[k] !== '') {
          param[k] = this.queryParam[k]
        }
      }
      const params = {
        page: this.page.currentPage,
        limit: this.page.itemsPerPage,
        filters: param
      }
      await this.mpApi
        .listProductInfoByPage(params)
        .then(res => {
          this.list = res.data
          this.page.total = res.total
        })
        .finally(() => {
          this.loading = false
        })
      this.queryResultMerchantArea()
    },
    onTabClick() {
      this.query()
    },
    reset() {
      this.queryParam = getDefaultForm()
    },
    sizeChange(val) {
      this.page.itemsPerPage = val
      this.query()
    },
    changeMerchant() {
      // 修改商家，加载销售区域
      this.queryParam.saleAreaId = null
      if (this.queryParam.merchantId) {
        this.queryAreaList(this.queryParam.merchantId).then(data => {
          this.saleAreaList = data || []
        })
      } else {
        this.saleAreaList = []
      }
    },
    async queryAreaList(merchantId) {
      const res = await this.$product.$api.common.querySalesAreaByMerchantId({
        merchantId: merchantId
      })
      return res.data
    },
    async queryResultMerchantArea() {
      const merchantIdList = []
      if (this.list && this.list.length > 0) {
        this.list.forEach(element => {
          if (merchantIdList.indexOf(element.merchantId) < 0) {
            merchantIdList.push(element.merchantId)
          }
        })
      }
      for (var i = 0; i < merchantIdList.length; i++) {
        await this.queryAreaList(merchantIdList[i]).then(data => {
          if (data && data.length > 0) {
            data.forEach(element => {
              this.saleAreaMap[element.id] = element
            })
          }
        })
      }
      this.setAreaName()
    },
    setAreaName() {
      if (this.list && this.list.length > 0) {
        this.list.forEach((item, index) => {
          if (item.merchantProductSaleAreas) {
            this.$set(
              item,
              'areaName',
              item.merchantProductSaleAreas
                .filter(i => this.saleAreaMap[i.saleAreaId])
                .map(i => this.saleAreaMap[i.saleAreaId].areaName)
                .join(',')
            )
          }
        })
      }
    },
    deleteArea(row) {
      this.$confirm(this.$t('是否删除选中的数据？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'info'
      })
        .then(() => {
          this.setArea([row], [])
        })
        .catch(() => {})
    },
    showAreaDialog(row) {
      let merchantId
      let checkedIds = []
      if (row) {
        this.editRow = row
        checkedIds = row.merchantProductSaleAreas
          ? row.merchantProductSaleAreas.map(i => i.saleAreaId)
          : []
        merchantId = this.editRow.merchantId
      } else {
        for (var i = 0; i < this.checkedList.length; i++) {
          const item = this.checkedList[i]
          if (!merchantId) {
            merchantId = item.merchantId
          }
          if (merchantId !== item.merchantId) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择同一商家商品')
            })
            return
          }
        }
      }
      this.queryAreaList(merchantId).then(data => {
        this.saleAreaDialog.areaList = data || []
        const checkedArea = []
        if (checkedIds) {
          this.saleAreaDialog.areaList.forEach((item, index) => {
            if (checkedIds.indexOf(item.id) >= 0) {
              checkedArea.push(item.id)
            }
          })
        }
        this.saleAreaDialog.areaChecked = checkedArea

        this.handleCheckedAreaChange(checkedArea)
      })
      this.saleAreaDialog.visible = true
    },
    handleCheckAllChange(val) {
      this.saleAreaDialog.areaChecked = val
        ? this.saleAreaDialog.areaList.map(i => i.id)
        : []
      this.saleAreaDialog.isIndeterminate = false
    },
    handleCheckedAreaChange(value) {
      const checkedCount = value.length
      this.saleAreaDialog.checkAll =
        checkedCount === this.saleAreaDialog.areaList.length
      this.saleAreaDialog.isIndeterminate =
        checkedCount > 0 && checkedCount < this.saleAreaDialog.areaList.length
    },
    handleClose() {
      this.saleAreaDialog = getDefaultDialogForm()
      this.editRow = null
    },
    handleOk() {
      if (this.saleAreaDialog.areaChecked.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择销售区域')
        })
        return
      }
      this.updateAreaLoading = true
      if (this.editRow) {
        this.setRow(this.editRow, this.saleAreaDialog.areaChecked)
      } else {
        this.batchSetArea(this.saleAreaDialog.areaChecked)
      }
    },
    setRow(row, areaIdList) {
      this.setArea([row], areaIdList)
    },
    batchSetArea(areaIdList) {
      this.setArea(this.checkedList, areaIdList)
    },
    async setArea(productList, areaIdList) {
      await this.$product.$api.mpApi
        .updateMerchantProductSaleArea({
          productList: productList,
          areaIdList: areaIdList
        })
        .finally(res => {
          this.updateAreaLoading = false
        })
      this.handleClose()
      this.query()
    }
  }
}
function getDefaultForm() {
  return Object.assign(
    {},
    {
      chineseName: null,
      code: null,
      saleAreaId: null,
      merchantId: null,
      // status: 2, // 查询审核通过的
      dataType: 2, // 商家商品
      useType: 0, // 成品
      typeOfProducts: [0, 3, 4]
    }
  )
}

function getDefaultDialogForm() {
  return Object.assign(
    {},
    {
      isIndeterminate: false,
      visible: false,
      areaList: [],
      areaChecked: [],
      checkAll: false
    }
  )
}
</script>

<style lang="less" scoped>
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
  width: 220px;
  height: 70px;
  overflow: hidden;
  word-break: break-all;
  white-space: pre-wrap;
}
.name-tag {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
.sale-area {
  display: flex;
  align-items: center;
}
.sale-area-name {
  overflow: hidden;
  max-width: 160px;
  display: inline-block;
}
</style>

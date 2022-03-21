<template>
  <section id="supplier-merchant">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="150px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input
              v-model="merchantName"
              :placeholder="$t('common_choose_please')"
              name="merchantName"
              readonly="true"
              @click.native="showMerchantModal = true"
            />
          </ody-search-item>
          <ody-search-item :label="$t('common_supplier_name') + ':'" prop="orgName">
            <el-input
              v-model="orgName"
              :placeholder="$t('common_choose_please')"
              name="orgName"
              readonly="true"
              @click.native="showSupplierModal = true"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset()">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="OpmsSupplierBind01_select"
          size="small"
          type="primary"
          code="OpmsSupplierBind01"
          @click="select()"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="OpmsSupplierBind02_addSupplier"
          size="small"
          type="primary"
          code="OpmsSupplierBind02"
          @click="addSupplier()"
        >{{ $t('associated_supplier') }}</ody-button>
        <!--        <ody-button
          name="OpmsSupplierBind03_exportSupplier"
          size="small"
          code="OpmsSupplierBind03"
          @click="exportSupplier()"
        >{{ $t('common_export') }}</ody-button>-->
      </div>
      <div slot="table">
        <el-table
          v-loading="loading"
          :data="tableData"
          name="tableData854"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <!--<el-table-column type="selection" width="50"/>-->

          <!--<el-table-column :label="$t('common_merchant_code')" prop="merchantCode" width="240"/>-->
          <el-table-column :label="$t('common_supplier_code')" prop="orgCode" min-width="200" align="center" />
          <el-table-column
            :label="$t('common_supplier_name')"
            prop="orgName"
            show-overflow-tooltip
          />
          <el-table-column
            :label="$t('common_merchant_name')"
            prop="merchantName"
            show-overflow-tooltip
            min-width="124"
            align="center"
          />
          <el-table-column
            :label="$t('common_operationUser')"
            prop="createUsername"
            show-overflow-tooltip
            min-width="124"
            align="center"
          />
          <el-table-column
            :label="$t('common_operationTime')"
            prop="createTime"
            show-overflow-tooltip
            min-width="200"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime | parseTime }}
            </template>
          </el-table-column>
          <!--最后更新人，最后更新时间-->
          <el-table-column :label="$t('common_operation')" align="center" width="124">
            <template slot-scope="scope">
              <ody-button
                name="OpmsSupplierBind04_handleDelete"
                type="text"
                size="small"
                code="OpmsSupplierBind04"
                @click="handleDelete(scope.row)"
              >
                <span style="color:#409eff">{{ $t('common_delete') }}</span>
              </ody-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          class="pageStyle"
          @size-change="page.handleSizeChange"
          @current-change="page.handleCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
    <PlatformSupplierModal :visible.sync="showSupplierModal" @ok="selectSupplier" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import PlatformSupplierModal from './PlatformSupplierModal'

export default {
  name: 'OpmsSupplierBind',
  components: {
    PlatformSupplierModal,
    MerchantSelectModal
  },
  data() {
    const vue = this

    return {
      showMerchantModal: false,
      showSupplierModal: false,
      merchantId: null,
      merchantCode: null,
      merchantName: null,
      parentSupplierId: null,
      page: {
        size: 10,
        current: 1,
        total: 0,
        handleSizeChange() {
          vue.select()
        },
        handleCurrentChange(val) {
          vue.page.current = val
          vue.updataTable()
        }
      },
      orgName: null,
      loading: false,
      addDialogVisible: false,
      selectedData: [],
      tableData: []
    }
  },

  created() {
    this.updataTable()
  },

  methods: {
    selectMerchant(result) {
      if (result) {
        this.merchantCode = result.merchantCode
        this.merchantId = result.merchantId
        this.merchantName = result.merchantName
      }
    },
    selectSupplier(result) {
      if (result) {
        this.parentSupplierId = result.orgId
        this.orgName = result.orgName
      }
    },
    async select() {
      this.page.current = 1
      await this.updataTable()
    },
    reset() {
      this.parentSupplierId = null
      this.orgName = null
      this.merchantName = null
      this.merchantId = null
      this.merchantCode = null
    },

    addSupplier() {
      this.$router.push({ name: 'OpmsAddSupplier' })
    },
    exportSupplier() {
      const data = {
        merchantId: this.merchantId,
        parentSupplierId: this.parentSupplierId,
        currentPage: 1,
        itemsPerPage: 1 << 30,
        orgType: 7,
        isPlatformSupplier: 1
      }

      this.$portal.downloadFileByPost(
        '/api/ouser-web/registerMerchant/exportSupplier.do',
        this.formHasValue(data)
      )
    },

    handleSelectionChange(val) {
      this.selectedData = val
    },
    async handleDelete(row) {
      try {
        await this.$confirm('您确认要删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$ouser.$api.supplier.updateDistributionStatus({
          orgId: row.orgId,
          isDeleted: 1
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.updataTable()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updataTable() {
      this.loading = true
      const data = {
        merchantId: this.merchantId,
        parentSupplierId: this.parentSupplierId,
        currentPage: this.page.current,
        itemsPerPage: this.page.size,
        orgType: 7,
        isPlatformSupplier: 1
      }

      return this.$ouser.$api.supplier
        .queryDistributionByPageInfo(this.formHasValue(data))
        .then(resp => {
          this.page.total = resp.data.total
          this.tableData = resp.data.listObj
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

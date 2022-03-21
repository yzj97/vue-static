<template>
  <div id="supplier-add">
    <el-steps :active="currAddStep" finish-status="success" align-center>
      <el-step :title="$t('receiveOrder_detail_check_chooseSupplier')" />
      <el-step :title="$t('purchase_request_template_check_merchant')" />
      <el-step :title="$t('set_up_success')" />
    </el-steps>

    <div v-show="currAddStep<=0" class="supplier">
      <ody-list-search-area>
        <div slot="content">
          <el-form label-width="150px">
            <ody-search-item :label="$t('common_supplier_code') + ':'" prop="searchOrgCode">
              <el-input v-model="searchOrgCode" name="searchOrgCode" maxlength="50" />
            </ody-search-item>
            <ody-search-item :label="$t('common_supplier_name') + ':'" prop="searchOrgName">
              <el-input v-model="searchOrgName" name="searchOrgName" maxlength="100" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <ody-button
            name="OpmsSupplierBind05_selectSupplier"
            type="primary"
            code="OpmsSupplierBind05"
            @click="selectSupplier"
          >{{ $t('common_search') }}</ody-button>
          <el-button name="reset" @click="reset('supplier')">{{ $t('common_reset') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <el-table v-loading="loadingSupplier" :data="supplierData" name="supplierData953" style="width: 100%">
            <el-table-column :label="$t('common_choose')" width="100">
              <el-radio slot-scope="scope" v-model="selectedSupplier" :label="scope.row" name="selectedSupplier">
                <span />
              </el-radio>
            </el-table-column>
            <el-table-column :label="$t('common_supplier_code')" prop="orgCode" />
            <el-table-column
              :label="$t('common_supplier_name')"
              prop="orgName"
              show-overflow-tooltip
            />
          </el-table>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="supplierPage.current"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="supplierPage.size"
              :total.sync="supplierPage.total"
              layout="total, sizes, prev, pager, next, jumper"
              class="pageStyle"
              @size-change="supplierPage.handleSizeChange"
              @current-change="supplierPage.handleCurrentChange"
            />
          </div>
        </div>
      </ody-list-table-area>
      <div class="footer" style="text-align: center">
        <ody-button
          :disabled="selectedSupplier==null"
          name="OpmsSupplierBind06_nextStep"
          code="OpmsSupplierBind06"
          @click="nextStep('merchant')"
        >{{ $t('common_step_next') }}</ody-button>
        <ody-button name="OpmsSupplierBind07_prevStep" code="OpmsSupplierBind07" @click="prevStep('back')">{{ $t('common_return') }}</ody-button>
      </div>
    </div>

    <div v-show="currAddStep==1" class="merchant">
      <ody-list-search-area>
        <div slot="content">
          <el-form label-width="150px">
            <ody-search-item :label="$t('common_merchant_code') + ':'" prop="merchantCode">
              <el-input v-model="merchantCode" name="merchantCode" />
            </ody-search-item>
            <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
              <el-input v-model="merchantName" name="merchantName" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <ody-button
            name="OpmsSupplierBind08_selectMerchant"
            type="primary"
            code="OpmsSupplierBind08"
            @click="selectMerchant"
          >{{ $t('common_search') }}</ody-button>
          <el-button name="reset0" @click="reset('merchant')">{{ $t('common_reset') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <el-table
            v-loading="loadingMerchant"
            ref="merchantTable"
            :data="merchantData"
            name="merchantData118"
            style="width: 100%"
            @selection-change="merchantSelectionChange"
          >
            <el-table-column type="selection" width="100" />
            <el-table-column :label="$t('common_merchant_code')" prop="merchantCode" />
            <el-table-column
              :label="$t('common_merchant_name')"
              prop="merchantName"
              show-overflow-tooltip
            />
          </el-table>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="merchantPage.current"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="merchantPage.size"
              :total.sync="merchantPage.total"
              class="pageStyle"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="merchantPage.handleSizeChange"
              @current-change="merchantPage.handleCurrentChange"
            />
          </div>
        </div>
      </ody-list-table-area>
      <div class="footer" style="text-align: center">
        <ody-button
          name="OpmsSupplierBind10_prevStep"
          code="OpmsSupplierBind10"
          @click="prevStep('supplier')"
        >{{ $t('common_step_last') }}</ody-button>
        <ody-button
          :disabled="selectedMerchantList.length<=0 || onceSave"
          name="OpmsSupplierBind11_nextStep"
          code="OpmsSupplierBind11"
          @click="nextStep('save')"
        >{{ $t('common_step_next') }}</ody-button>
      </div>
    </div>

    <div v-show="currAddStep>=2" class="success">
      <ody-list-table-area>
        <div slot="table">
          <el-table :data="successData" name="successData760" style="width: 100%">
            <el-table-column type="index" />
            <el-table-column :label="$t('common_supplier_code')" prop="orgCode" />
            <el-table-column
              :label="$t('common_supplier_name')"
              prop="orgName"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('common_merchant_code')" prop="merchantCode" />
            <el-table-column
              :label="$t('common_merchant_name')"
              prop="merchantName"
              show-overflow-tooltip
            />
          </el-table>
        </div>
      </ody-list-table-area>
      <div class="footer" style="text-align: right">
        <ody-button
          name="OpmsSupplierBind12_prevStep"
          code="OpmsSupplierBind12"
          @click="prevStep('again')"
        >{{ $t('add_association_again') }}</ody-button>
        <el-button name="nextStep" @click="nextStep('close')">{{ $t('contract_close') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OpmsAddSupplier',
  data() {
    const vue = this
    return {
      currAddStep: 0,

      searchOrgCode: null,
      searchOrgName: null,
      loadingSupplier: false,
      selectedSupplier: null,
      supplierData: [],
      supplierPage: {
        size: 10,
        current: 1,
        total: 0,
        handleSizeChange(val) {
          vue.supplierPage.size = val
          vue.select('supplier')
        },
        handleCurrentChange(val) {
          vue.supplierPage.current = val
          vue.select('supplier')
        }
      },

      merchantCode: null,
      merchantName: null,
      loadingMerchant: false,
      selectedMerchantList: [],
      merchantData: [],
      merchantPage: {
        size: 10,
        current: 1,
        total: 0,
        handleSizeChange(val) {
          vue.merchantPage.size = val
          vue.select('merchant')
        },
        handleCurrentChange(val) {
          vue.merchantPage.current = val
          vue.select('merchant')
        }
      },

      successData: [],
      onceSave: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    selectSupplier() {
      this.supplierPage.current = 1
      this.select('supplier')
    },
    selectMerchant() {
      this.merchantPage.current = 1
      this.select('merchant')
    },
    select(type) {
      const vue = this
      switch (type) {
        case 'supplier':
          this.loadingSupplier = true
          this.selectedSupplier = null
          var supplierParam = {
            itemsPerPage: this.supplierPage.size,
            currentPage: this.supplierPage.current,
            status: 1, // 查询启用的供应商
            orgType: 7,
            bussinessType: 2, // 查询集采的供应商
            isPlatformSupplier: 0,
            orgName: this.searchOrgName,
            orgCode: this.searchOrgCode
          }

          vue.$opms.$api.supplier
            .queryDistributionByPageInfo(supplierParam)
            .then(resp => {
              this.supplierData = resp.data.listObj
              this.supplierPage.total = resp.data.total
            })
            .finally(() => {
              this.loadingSupplier = false
            })
          break
        case 'merchant':
          this.loadingMerchant = true
          this.selectedMerchantList = []
          var merchantParam = {
            itemsPerPage: this.merchantPage.size,
            currentPage: this.merchantPage.current,
            merchantCode: this.merchantCode,
            merchantName: this.merchantName
          }
          merchantParam.platformSupplierId = this.selectedSupplier.orgId
          vue.$opms.$api.supplier
            .queryNotExistSupplierAuthMerchantPage(merchantParam)
            .then(resp => {
              if (resp && resp.data) {
                const data = resp.data
                this.merchantData = data.listObj
                this.merchantPage.total = data.total
              }
            })
            .finally(() => {
              this.loadingMerchant = false
            })
          break
      }
    },
    reset(type) {
      switch (type) {
        case 'supplier':
          this.searchOrgName = null
          this.searchOrgCode = null
          break
        case 'merchant':
          this.merchantName = null
          this.merchantCode = null
          break
      }
    },
    prevStep(step) {
      switch (step) {
        case 'back':
          this.close()
          break
        case 'supplier':
          this.currAddStep = 0
          break
        case 'merchant':
          this.currAddStep = 1
          break
        case 'again':
          this.init()
          break
      }
    },
    nextStep(step) {
      const data = {}
      switch (step) {
        case 'supplier':
          this.currAddStep = 0
          this.select('supplier')
          break
        case 'merchant':
          this.currAddStep = 1
          this.select('merchant')
          break
        case 'save':
          this.onceSave = true
          this.successData = []
          data.merchantIds = []
          data.parentSupplierId = this.selectedSupplier.orgId
          data.supplierCode = this.selectedSupplier.supplierCode
          data.supplierName = this.selectedSupplier.supplierName
          for (let i = 0; i < this.selectedMerchantList.length; ++i) {
            data.merchantIds[i] = this.selectedMerchantList[i].merchantId
          }
          this.$opms.$api.supplier
            .bindPlatformSupplier(data)
            .then(resp => {
              const success = []
              for (let i = 0; i < resp.data.length; ++i) {
                success[i] = {
                  orgCode: resp.data[i].orgCode,
                  orgName: resp.data[i].orgName,
                  merchantCode: resp.data[i].merchantCode,
                  merchantName: resp.data[i].merchantName
                }
              }
              this.successData = success
              this.currAddStep = 3
            })
            .finally(() => {
              this.onceSave = false
            })
          break
        case 'close':
          this.close()
          break
      }
    },
    merchantSelectionChange(rows) {
      this.selectedMerchantList = rows
    },
    init() {
      this.currAddStep = 0
      this.reset('supplier')
      this.select('supplier')
      this.reset('merchant')
    },
    close() {
      this.currAddStep = 0
      this.reset('supplier')
      this.select('supplier')
      this.reset('merchant')
      try {
        top.Vue.prototype.$portal.delActiveView()
      } catch (e) {
        parent.postMessage(
          {
            action: 'AddSupplier'
          },
          '*'
        )
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.footer {
  width: 100%;
  margin: 10px 0;
}

.pageStyle {
  text-align: right;
  margin-top: 10px;
}

#supplier-add {
  /deep / .el-form-item {
    margin-bottom: 0;
  }
}
</style>

<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('merchant_name')" prop="merchantId">
            <el-select v-model="merchantId" :placeholder="$t('请选择')" name="merchantId">
              <el-option
                v-for="item in merchantNameList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('model_name')" prop="modelCode">
            <el-select v-model="modelCode" :placeholder="$t('common_all')" name="modelCode" @change="dochange">
              <el-option
                v-for="item in modelNameList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="handleSearchSubmit"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <el-button name="add" size="small" type="primary" @click="add">{{ $t('add') }}</el-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="data"
          :columns="columns"
          :operates="operates"
          :multiple="multiple"
          name="data212"
        />
      </div>

      <div slot="page">
        <ody-pagination
          :current-page.sync="queryArgs.page"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="queryArgs.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="dialogVisible"
      :title="formName.ruleCode == null ? $t('add_config') : $t('up_config')"
      :before-close="handleClose"
      width="480px"
    >
      <el-form ref="formName" :model="formName" :rules="rules" label-width="120px" class="form">
        <el-form-item :label="$t('merchant_name')">
          <el-select
            v-model="formName.bussiness"
            :disabled="formName.ruleCode != null"
            :placeholder="$t('请选择')"
            name="formName_bussiness"
          >
            <el-option
              v-for="item in merchantNameList"
              :key="item.merchantId"
              :label="item.merchantName"
              :value="item.merchantId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('model_name')" prop="scType">
          <el-select
            v-model="formName.scType"
            :disabled="formName.ruleCode != null"
            :placeholder="$t('请选择')"
            name="formName_scType"
          >
            <el-option
              v-for="item in scTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('commonisson_node')">
          <el-select v-model="formName.soStatus" :placeholder="$t('请选择')" name="formName_soStatus" disabled>
            <el-option
              v-for="item in soStatusList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('commonisson_frozen')">
          <el-radio-group v-model="formName.frozenType" name="formName_frozenType" @change="changeFrozenVal">
            <el-radio :label="1">{{ $t('yes') }}</el-radio>
            <el-radio :label="2">{{ $t('no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-show="formName.frozenType == 1 ? true : false">
          <el-form-item :label="$t('thaw_way')" prop="byNode">
            <el-radio v-model="formName.byNode" :label="1" name="formName_byNode">{{ $t('unfrozenMethod') }}</el-radio>
          </el-form-item>
          <el-form-item>
            <el-select
              v-show="formName.byNode == null ? false : true"
              v-model="formName.unFreezeMethodVal"
              :placeholder="$t('请选择')"
              name="formName_unFreezeMethodVal"
            >
              <el-option
                v-for="item in unFreezeMethodValList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="$t('commission_retracts_node')">
          <el-select v-model="formName.cacelSoStatus" :placeholder="$t('请选择')" name="formName_cacelSoStatus" disabled>
            <el-option
              v-for="item in cancelSoStatusList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button name="hideDialog" size="small" @click="hideDialog('formName')">取 消</el-button>-->
        <!--          <el-button name="submitForm" size="small" type="primary" @click="submitForm('formName')">确 定</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
      <span slot="footer">
        <div class="line-top" />
        <el-button name="hideDialog8" size="small" @click="hideDialog('formName')">取 消</el-button>
        <el-button name="submitForm9" size="small" type="primary" @click="submitForm('formName')">确 定</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'AgentStoreCommissionNodeManagement',
  data() {
    const self = this
    return {
      loading: true,
      dialogVisible: false,
      merchantNameList: [],
      cancelSoStatusList: [],
      soStatusList: [],
      merchantId: null,
      modelNameList: [],
      unFreezeMethodValList: [],
      modelMap: [],
      scTypeList: [],
      modelCode: null,
      visibleVal: true,
      queryArgs: {
        page: 1,
        limit: 10
      },
      ruleCode: null,
      formName: {
        bussiness: null,
        soStatus: 'AFTER_SALE',
        cacelSoStatus: 'AFTER_SALE',
        unFreezeMethodVal: null,
        scType: null,
        byNode: 1,
        frozenType: 1,
        merchantName: null,
        ruleCode: null,
        merchantCode: null
      },
      rules: {
        scType: [{ required: true, message: this.$t('write_model_name') }],
        unFreezeMethodVal: [
          { required: true, message: this.$t('please_node') }
        ],
        byNode: [{ required: true, message: this.$t('please_frozen_node') }]
      },
      data: [],
      size: 10,
      total: 1,
      columns: [
        {
          show: true,
          prop: 'merchantName',
          label: self.$t('merchant_name'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'scType',
          label: self.$t('model_name'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            return self.modelMap[row.scType]
          }
        }
      ],
      operates: {
        width: 100,
        align: 'center',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.selectedItem = row
              self.edit(row)
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handlePageSizeChange() {
      this.getList()
    },
    handlePageCurrentChange() {
      this.getList()
    },
    changeFrozenVal() {
      if (this.frozenType === 1) {
        this.visibleVal = false
      } else {
        this.visibleVal = true
      }
    },
    initData() {
      this.$agent.$api.agent.getAuthMerchantList({}).then(res => {
        this.merchantNameList = res.data
      })
      this.$agent.$api.agent
        .listByCategorysForOrder({
          categorys: [
            'MODEL_NAME',
            'SO_STATUS',
            'CANCEL_SO_STATUS',
            'UN_FREEZE_METHOD'
          ]
        })
        .then(data => {
          this.modelNameList = data.data.MODEL_NAME
          this.scTypeList = data.data.MODEL_NAME
          this.cancelSoStatusList = data.data.CANCEL_SO_STATUS
          this.soStatusList = data.data.SO_STATUS
          this.unFreezeMethodValList = data.data.UN_FREEZE_METHOD
          this.modelMap = data.data.MODEL_NAME.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
        })
    },
    dochange(event, value) {
      this.modelCode = event
    },
    init() {
      this.initData()
      this.getList()
    },
    async handleSearchSubmit() {
      await this.getList()
    },
    handleSearchReset() {
      this.merchantId = null
      this.modelCode = null
    },
    add() {
      this.dialogVisible = true
      this.formName.bussiness = null
      this.formName.ruleCode = null
      this.formName.soStatus = 'AFTER_SALE'
      this.formName.cacelSoStatus = 'AFTER_SALE'
      this.formName.unFreezeMethodVal = null
      this.formName.scType = null
      this.formName.byNode = 1
      this.formName.frozenType = 1
    },
    hideDialog(formName) {
      this.dialogVisible = false
      this.formName.scType = null
      this.formName.unFreezeMethodVal = null
      this.$refs[formName].resetFields()
    },
    handleClose() {
      this.dialogVisible = false
      this.formName.scType = null
      this.formName.unFreezeMethodVal = null
      this.$refs['formName'].resetFields()
    },
    async getList() {
      const vue = this
      const param = {
        currentPage: this.queryArgs.page,
        itemsPerPage: this.queryArgs.limit,
        merchantId: this.merchantId,
        scType: this.modelCode
      }
      const routingWarehouseRuleList = this.$agent.$api.agent
      this.loading = true
      try {
        const res = await routingWarehouseRuleList.listByPage(param)
        const data = res.data.listObj
        if (data !== null) {
          data.forEach(function(i) {
            vue.merchantNameList.forEach(function(m) {
              if (i.merchantId === m.merchantId) {
                i.merchantCode = m.merchantCode
                i.merchantName = m.merchantName
              }
            })
          })
        }
        this.data = data
        this.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    async edit(row) {
      const vue = this
      await vue.$portal
        .post(
          'agent-web/saleCommissionAction/getByMerchantIdAndType/' +
            row.merchantId +
            '/' +
            row.scType +
            '.do'
        )
        .then(res => {
          console.log(res.data)
          vue.dialogVisible = true
          vue.formName.bussiness = row.merchantId
          vue.formName.merchantName = row.merchantName
          vue.formName.merchantCode = row.merchantCode
          vue.formName.soStatus = res.data.soStatusObj
          vue.formName.cacelSoStatus = res.data.cancelSoStatusObj
          vue.formName.unFreezeMethodVal =
            res.data.unFreezeSoStatusObj === 'DONE' ? 'DONE' : null
          vue.formName.scType = res.data.scTypeObj
          vue.formName.byNode = res.data.unFreezeMethod
          vue.formName.frozenType = res.data.freezeType
          vue.formName.ruleCode = res.data.scRuleCode
          vue.ruleCode = res.data.scRuleCode
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formName.ruleCode != null) {
            this.$agent.$api.agent
              .batchUpdate([
                {
                  merchantId: this.formName.bussiness,
                  ruleCode: this.formName.ruleCode,
                  scType: this.formName.scType,
                  values: [
                    {
                      key: 'SO_STATUS',
                      value: this.formName.soStatus
                    },
                    {
                      key: 'FREEZE_TYPE',
                      value:
                        this.formName.frozenType === 1 ? 'FREEZE' : 'UN_FREEZE'
                    },
                    {
                      key: 'UN_FREEZE_METHOD',
                      value: this.formName.byNode === 1 ? 'BY_NODE' : ''
                    },
                    {
                      key: 'UN_FREEZE_METHOD_VALUE',
                      value: this.formName.unFreezeMethodVal
                    },
                    {
                      key: 'CANCEL_SO_STATUS',
                      value: this.formName.cacelSoStatus
                    }
                  ]
                }
              ])
              .then(data => {
                console.log(data)
                this.$message({
                  message: data.message,
                  type: 'success'
                })
              })
          } else {
            this.$agent.$api.agent
              .createCommisson([
                {
                  merchantCode: this.formName.merchantCode,
                  merchantId: this.formName.bussiness,
                  merchantName: this.formName.merchantName,
                  ruleCode: this.formName.ruleCode,
                  scType: this.formName.scType,
                  values: [
                    {
                      key: 'SO_STATUS',
                      value: this.formName.soStatus
                    },
                    {
                      key: 'FREEZE_TYPE',
                      value:
                        this.formName.frozenType === 1 ? 'FREEZE' : 'UN_FREEZE'
                    },
                    {
                      key: 'UN_FREEZE_METHOD',
                      value: this.formName.byNode === 1 ? 'BY_NONE' : ''
                    },
                    {
                      key: 'UN_FREEZE_METHOD_VALUE',
                      value: this.formName.unFreezeMethodVal
                    },
                    {
                      key: 'CANCEL_SO_STATUS',
                      value: this.formName.cacelSoStatus
                    }
                  ]
                }
              ])
              .then(data => {
                this.handleClose()
                this.$message({
                  message: data.message,
                  type: 'success'
                })
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <section>
    <div>
      <ody-dialog
        :visible="visible"
        :before-close="handleClose"
        :modal-append-to-body="false"
        :title="$t('批量分发')"
        width="50%"
        @open="init"
      >
        <section>
          <el-form
            ref="batchSentForm"
            :model="batchSentForm"
            :rules="rules"
            label-width="120px"
            class="form"
          >
            <ody-title :title="$t('选择 ') + name" />
            <el-form-item label-width="0px" prop="chooseFlag">
              <el-radio-group v-model="batchSentForm.chooseFlag" name="batchSentForm_chooseFlag" @change="changeFlag">
                <el-radio :label="2">{{ $t('选中 ') + name }}</el-radio>
                <el-radio :label="3">{{ $t('自定义 ') + name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="batchSentForm.chooseFlag==3" label-width="0px" prop="codes">
              <el-input
                v-model="batchSentForm.codes"
                :placeholder="$t('每行输入一个 ')+ spuName + $t('，最多输入1000行')"
                name="batchSentForm_codes"
                type="textarea"
              />
            </el-form-item>
          </el-form>
          <ody-title :title="$t('选择商家')" />

          <div slot="content">
            <el-form ref="form" label-width="70px" class="form">
              <el-col :span="6">
                <el-form-item :label="$t('common_merchant_code')">
                  <el-input v-model="searchForm.merchantCode" name="searchForm_merchantCode" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('common_merchant_name')">
                  <el-input v-model="searchForm.merchantName" name="searchForm_merchantName" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('查询') }}</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
              </el-col>
            </el-form>
          </div>
          <ody-list-table-area>
            <div slot="table">
              <ody-table
                ref="table"
                :checked.sync="table.checked"
                :multiple="true"
                :can-filter="false"
                :columns="table.columns"
                request-url="ouser-web/api/merchant/queryPlatformAuthMerchantPage.do"
              />
            </div>
          </ody-list-table-area>
        </section>
        <span slot="footer" class="dialog-footer">
          <el-button name="handleClose" size="small" @click="handleClose">{{ $t('cancel') }}</el-button>
          <ody-button
            :disabled="submiting"
            name="PlatformMerchantProductBatchDispatch_submitForm"
            size="small"
            type="primary"
            code="PlatformMerchantProductBatchDispatch"
            @click="submitForm('batchSentForm')"
          >{{ $t('common_confirm_search') }}</ody-button>
        </span>
      </ody-dialog>
    </div>
    <SentTip :visible.sync="bacthSentTip" :type.sync="source" />
  </section>
</template>

<script>
import SentTip from '@/components/sentTip'
export default {
  components: {
    SentTip
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    ids: {
      type: Array,
      default: null
    },
    sentType: {
      type: Number,
      required: true,
      default: null
    }
  },
  data() {
    return {
      name: this.$t('商品'),
      spuName: this.$t('SPU'),
      bacthSentTip: false,
      source: null,
      submiting: false,
      batchSentForm: {
        chooseFlag: 2,
        codes: null
      },
      submitParams: {
        mpIdList: [],
        merchantIdList: [],
        mpCodeList: []
      },
      searchForm: {
        merchantCode: null,
        merchantName: null
      },
      rules: {
        codes: [
          {
            required: true,
            message: this.$t('请输入自定义商品SPU编码'),
            trigger: 'change'
          }
        ]
      },
      table: {
        columns: [
          {
            show: true,
            prop: 'merchantName',
            label: this.$t('common_merchant_name'),
            align: 'center'
          },
          {
            show: true,
            prop: 'merchantCode',
            label: this.$t('common_merchant_code'),
            align: 'center'
          }
        ],
        checked: []
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['batchSentForm'].resetFields()
      this.submitParams = {
        mpIdList: [],
        merchantIdList: [],
        mpCodeList: []
      }
      this.table.checked = []
      this.searchForm = {
        merchantCode: null,
        merchantName: null
      }
      this.bacthSentTip = false
      this.source = null
    },
    async init() {
      if (!this.ids) {
        this.ids = []
      }
      if (this.sentType && this.sentType === 1) {
        this.name = this.$t('原料')
        this.spuName = this.$t('原料编码')
      }
      this.$nextTick(function() {
        this.query()
      })
    },
    async query() {
      this.table.checked = []
      return this.$refs.table.getList(this.formHasValue(this.searchForm))
    },
    async handleSearchSubmit() {
      await this.query()
    },
    handleSearchReset() {
      this.searchForm = {
        merchantCode: null,
        merchantName: null
      }
    },
    submitForm(batchSentForm) {
      if (this.batchSentForm.chooseFlag === 2 && this.ids.length <= 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择要下发的商品信息')
        })
        return
      }
      if (this.table.checked.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择要下发的商家信息')
        })
        return
      }

      this.submitParams = {
        mpIdList: [],
        merchantIdList: [],
        mpCodeList: []
      }
      let codelList = []
      if (this.batchSentForm.chooseFlag === 3) {
        if (
          !this.batchSentForm.codes ||
          this.batchSentForm.codes.trim().length === 0
        ) {
          this.$message({
            type: 'warning',
            message: this.$t('请选择要下发的商品信息')
          })
          return
        }
        codelList = this.batchSentForm.codes
          .trim()
          .split(/\n/)
          .map(x => x.trim())
        console.info(codelList)
        if (codelList.length > 1000) {
          this.$message({
            type: 'warning',
            message: this.$t('SPU编码数量超过1000个')
          })
          return
        }
      }
      this.submiting = true
      const merchantIds = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          merchantIds.push(item.merchantId)
        }
      }
      this.submitParams.merchantIdList = merchantIds
      if (this.batchSentForm.chooseFlag === 2) {
        this.submitParams.mpIdList = this.ids
      } else {
        this.submitParams.mpCodeList = codelList
      }

      this.$product.$api.mpApi
        .platformMerchantProductDispatch(this.submitParams)
        .then(result => {
          if (result && result.code === '0') {
            this.$emit('update:visible', !this.visible)
            this.$refs['batchSentForm'].resetFields()
            this.$emit('ok', [])
            this.submiting = false
            this.bacthSentTip = true
            this.source = 1
          } else {
            this.submiting = false
          }
        })
        .finally(res => {
          this.submiting = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

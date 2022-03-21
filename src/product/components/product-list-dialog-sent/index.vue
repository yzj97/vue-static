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
        <el-form
          ref="batchSentForm"
          :model="batchSentForm"
          :rules="rules"
          label-width="120px"
          class="form"
        >
          <ody-title :title="$t('common_choose') + name" />
          <el-form-item label-width="0px" prop="chooseFlag">
            <el-radio-group v-model="batchSentForm.chooseFlag" name="batchSentForm_chooseFlag" @change="changeFlag">
              <el-radio :label="2">{{ $t('selected')+ name }}</el-radio>
              <el-radio :label="3">{{ $t('custom')+ name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="batchSentForm.chooseFlag==3" prop="codes">
            <el-input
              v-model="batchSentForm.codes"
              :placeholder="$t('每行输入一个SPU，最多输入1000行')"
              name="batchSentForm_codes"
              type="textarea"
            />
          </el-form-item>
          <ody-title :title="$t('设置上架时间')" />
          <el-form-item label-width="0px" prop="shelfType">
            <el-radio-group v-model="batchSentForm.shelfType" name="batchSentForm_shelfType">
              <el-radio :label="1">{{ $t('立即上架') }}</el-radio>
              <el-radio :label="2">{{ $t('定时上架') }}</el-radio>
              <el-radio :label="3">{{ $t('暂不上架') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="batchSentForm.shelfType===2" :label="$t('上架时间')" prop="shelfTime">
            <el-date-picker
              v-model="batchSentForm.shelfTime"
              :placeholder="$t('选择日期')"
              name="batchSentForm_shelfTime"
              type="date"
            />
          </el-form-item>
          <ody-title :title="$t('选择店铺')" />
          <div>
            <el-col :span="8">
              <el-form-item :label="$t('店铺名称')" label-width="70px">
                <el-input v-model="searchForm.orgName" name="searchForm_orgName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('渠道')" label-width="60px">
                <ody-channel-select
                  ref="channel"
                  v-model="searchForm.channelCode"
                  :placeholder="$t('全部')"
                  name="searchForm_channelCode"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align: center">
              <el-button
                name="handleSearchSubmit"
                size="small"
                type="primary"
                @click="handleSearchSubmit">{{ $t('common_search') }}</el-button>
              <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
            </el-col>
          </div>
          <ody-list-table-area>
            <div slot="table">
              <ody-table
                ref="table"
                :checked.sync="table.checked"
                :multiple="true"
                :can-filter="false"
                :columns="table.columns"
                request-url="ouser-web/storeAction/queryStoreInfoList.do"
              />
            </div>
          </ody-list-table-area>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button name="handleClose" size="small" @click="handleClose">{{ $t('cancel') }}</el-button>
          <ody-button
            :disabled="submiting"
            name="MerchantProductManageBatchDispatch_submitForm"
            size="small"
            type="primary"
            code="MerchantProductManageBatchDispatch"
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
    merchantId: {
      type: Number,
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
      submiting: false,
      bacthSentTip: false,
      source: null,
      batchSentForm: {
        chooseFlag: 2,
        codes: null,
        shelfType: 1,
        shelfTime: null
      },
      submitParams: {
        mpIdList: [],
        merchantIdList: [],
        mpCodeList: [],
        shelfType: null,
        shelfTime: null
      },
      searchForm: {
        orgName: null,
        channelCode: null,
        merchantId: null
      },
      rules: {
        codes: [
          {
            required: true,
            message: this.$t('请输入自定义商品SPU编码'),
            trigger: 'change'
          }
        ],
        shelfTime: [
          {
            required: true,
            message: this.$t('请选择上架时间'),
            trigger: 'change'
          }
        ]
      },
      table: {
        columns: [
          {
            show: true,
            prop: 'orgName',
            label: this.$t('店铺名称'),
            align: 'center'
          },
          {
            show: true,
            prop: 'channelName',
            label: this.$t('渠道'),
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
        storeIdList: [],
        mpCodeList: []
      }
      this.table.checked = []
      this.searchForm = {
        storeName: null,
        channelCode: null,
        merchantId: null
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
      }
      this.searchForm.merchantId = this.merchantId
      this.$nextTick(function() {
        this.query()
      })
    },
    async query() {
      return this.$refs.table.getList(this.formHasValue(this.searchForm))
    },
    async handleSearchSubmit() {
      await this.query()
    },
    handleSearchReset() {
      this.searchForm = {
        orgName: null,
        channelCode: null
      }
      this.searchForm.merchantId = this.merchantId
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
          message: this.$t('请选择要下发的店铺信息')
        })
        return
      }
      this.$refs['batchSentForm'].validate(valid => {
        if (valid) {
          this.submitParams = {
            mpIdList: [],
            storeIdList: [],
            mpCodeList: [],
            shelfType: null,
            shelfTime: null
          }
          let codelList = []
          if (this.batchSentForm.chooseFlag === 3) {
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
          if (this.batchSentForm.shelfType === 2) {
            var dateNow = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
            var shelfTime = this.$portal.parseTime(
              this.batchSentForm.shelfTime,
              '{y}-{m}-{d}'
            )
            if (shelfTime < dateNow) {
              this.$message({
                type: 'warning',
                message: this.$t('定时上架时候不能小于今天')
              })
              return
            }
          }
          this.submiting = true
          const storeIds = []
          if (this.table.checked && this.table.checked.length > 0) {
            for (let i = 0; i < this.table.checked.length; i++) {
              const item = this.table.checked[i]
              storeIds.push(item.id)
            }
          }
          this.submitParams.storeIdList = storeIds
          if (this.batchSentForm.chooseFlag === 2) {
            this.submitParams.mpIdList = this.ids
          } else {
            this.submitParams.mpCodeList = codelList
          }
          this.submitParams.shelfType = this.batchSentForm.shelfType
          this.submitParams.shelfTime = this.batchSentForm.shelfTime
          this.$product.$api.mpApi
            .merchantProductDispatch(this.submitParams)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$refs['batchSentForm'].resetFields()
                this.$emit('ok', [])
                this.submiting = false
                this.bacthSentTip = true
                this.source = 2
              } else {
                this.submiting = false
              }
            })
            .finally(res => {
              this.submiting = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

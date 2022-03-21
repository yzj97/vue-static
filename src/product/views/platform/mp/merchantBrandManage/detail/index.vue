
<template>
  <section class="pg-merchant-brand-list merchant-brand-detail-box">
    <el-form ref="soPackageDetailForm" label-position="right" style="background-color: #fff;" label-width="300px">
      <div v-if="brandDetail.seniorityName!=null" style="padding-top: 20px;padding-left: 20px;">
        <div style="margin-bottom: 10px;font-size: 14px;font-weight: bold">{{ $t('品牌资质详情') }}</div>
        <div class="baoguo-detail" style="border: 1px solid #EEF5F9;padding-top: 20px;padding-bottom: 20px;">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('品牌名称') + ':'">
                {{ brandDetail.brandName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('品牌名称(第二语言)') + ':'">
                <div>
                  {{ brandDetail.nameLan2 }}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('商家名称') + ':'">
                {{ merchant.orgName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('商家编码') + ':'">
                {{ merchant.orgCode }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('申请时间') + ':'">
                {{ $portal.parseTime(brandDetail.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 资质证书信息 -->
      <div style="padding-top: 20px;padding-left: 20px;">
        <div style="margin-bottom: 10px;font-size: 14px;font-weight: bold">{{ $t('资质证书') }} 1</div>
        <div class="baoguo-detail" style="border: 1px solid #EEF5F9;padding-top: 20px;padding-bottom: 20px;">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('证书名称') + ':'">
                {{ brandDetail.seniorityName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('证书有效期') + ':'">
                {{ brandDetail.validityStart }}{{ $t('至') }}{{ brandDetail.validityEnd }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item :label="$t('资质证书图片') + ':'">
              <el-col :span="24">
                <span v-if="brandDetail.seniorityUrl">
                  <ody-upload-image v-model="brandDetail.seniorityUrl" name="brandDetail_seniorityUrl" disabled="true"/>
                </span>
              </el-col>
              <el-col :span="24">
                <span v-if="brandDetail.seniorityUrl2">
                  <ody-upload-image v-model="brandDetail.seniorityUrl2" name="brandDetail_seniorityUrl2" disabled="true"/>
                </span>
              </el-col>
              <el-col>
                <span v-if="brandDetail.seniorityUrl3">
                  <ody-upload-image v-model="brandDetail.seniorityUrl3" name="brandDetail_seniorityUrl3" disabled="true"/>
                </span>
              </el-col>
            </el-form-item>

          </el-row>
        </div>
      </div>
      <div v-if="brandDetail.seniorityName2!=null" style="padding-top: 20px;padding-left: 20px;" >
        <div style="margin-bottom: 10px;font-size: 14px;font-weight: bold">{{ $t('资质证书') }} 2</div>
        <div class="baoguo-detail" style="border: 1px solid #EEF5F9;padding-top: 20px;padding-bottom: 20px;">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('证书名称') + ':'">
                {{ brandDetail.seniorityName2 }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('证书有效期') + ':'">
                {{ brandDetail.validityStart2 }}{{ $t('至') }}{{ brandDetail.validityEnd2 }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item :label="$t('资质证书图片') + ':'">
              <el-col :span="24">
                <span v-if="brandDetail.seniorityUrl4">
                  <ody-upload-image v-model="brandDetail.seniorityUrl4" name="brandDetail_seniorityUrl4" disabled="true"/>
                </span>
              </el-col>
              <el-col :span="24">
                <span v-if="brandDetail.seniorityUrl5">
                  <ody-upload-image v-model="brandDetail.seniorityUrl5" name="brandDetail_seniorityUrl5" disabled="true"/>
                </span>
              </el-col>
              <el-col :span="24">
                <span v-if="brandDetail.seniorityUrl6">
                  <ody-upload-image v-model="brandDetail.seniorityUrl6" name="brandDetail_seniorityUrl6" disabled="true"/>
                </span>
              </el-col>
            </el-form-item>
          </el-row>
        </div>
      </div>
      <div v-if="brandDetail.seniorityName3!=null" style="padding-top: 20px;padding-left: 20px;">
        <div style="margin-bottom: 10px;font-size: 14px;font-weight: bold">{{ $t('资质证书') }} 3</div>
        <div class="baoguo-detail" style="border: 1px solid #EEF5F9;padding-top: 20px;padding-bottom: 20px;">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('证书名称') + ':'">
                {{ brandDetail.seniorityName3 }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('证书有效期') + ':'">
                {{ brandDetail.validityStart3 }}{{ $t('至') }}{{ brandDetail.validityEnd3 }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item :label="$t('资质证书图片') + ':'">
              <el-col :span="24">
                <span v-if="brandDetail.seniorityUrl7">
                  <ody-upload-image v-model="brandDetail.seniorityUrl7" name="brandDetail_seniorityUrl7" disabled="true"/>
                </span>
              </el-col>
              <el-col :span="24">
                <span v-if="brandDetail.seniorityUrl8">
                  <ody-upload-image v-model="brandDetail.seniorityUrl8" name="brandDetail_seniorityUrl8" disabled="true"/>
                </span>
              </el-col>
              <el-col>
                <span v-if="brandDetail.seniorityUrl9">
                  <ody-upload-image v-model="brandDetail.seniorityUrl9" name="brandDetail_seniorityUrl9" disabled="true"/>
                </span>
              </el-col>
            </el-form-item>

          </el-row>
        </div>
      </div>
      <ody-dialog
        :visible.sync="dialogVisible"
        :title="$t('审核')"
        width="600px">
        <el-form ref="dialogData" :model="dialogData" :rules="rules2" label-width="160px" class="form">
          <div v-if="auditType==2">
            <el-form-item> {{ $t('确认审核通过吗') }}?</el-form-item>
          </div>
          <div v-if="auditType==3">
            <el-row class="row_class" style="padding-left: 40px">
              <el-form-item :label="$t('审核结果')">
                {{ $t('审核拒绝') }}!
              </el-form-item>
            </el-row>
            <el-row class="row_class">
              <el-form-item :label="$t('拒绝原因')" prop="remark">
                <el-input
                  v-model="dialogData.remark"
                  type="textarea"
                  placeholder=""
                  maxlength="200"
                  rows="6"/>
              </el-form-item>
            </el-row>
          </div>
        </el-form>
        <span slot="footer">
          <div class="line-top"/>
          <el-button name="hideDialog" size="small" @click="hideDialog">取 消</el-button>
          <ody-button :code="dialogDataCode" name="confirmDialog" size="small" type="primary" @click="confirmDialog('dialogData')">确 定</ody-button>
        </span>
      </ody-dialog>
    </el-form>
    <ody-fixed>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('返回') }}</el-button>
      <ody-button v-if="brandDetail.status==1" name="MerchantBrandAuditReject_openAudit" size="small" code="MerchantBrandAuditReject" @click="openAudit(3,'MerchantBrandAuditReject')">{{ $t('审核拒绝') }}</ody-button>
      <ody-button v-if="brandDetail.status==1" name="MerchantBrandAuditPass_openAudit" size="small" type="primary" code="MerchantBrandAuditPass" @click="openAudit(2,'MerchantBrandAuditPass')">{{ $t('审核通过') }}</ody-button>
    </ody-fixed>
  </section>
</template>

<script>

export default {
  name: 'ProductMerchantBrandListDetail',
  data() {
    return {
      brandDetail: {},
      merchant: {},
      dialogVisible: false,
      auditType: '', // 审核类型，3拒绝，2通过
      dialogData: {
        status: '',
        remark: '',
        ids: []
      },
      dialogDataCode: '',
      rules2: {
        remark: [
          { required: true, message: this.$t('拒绝原因不能为空'), trigger: 'blur' }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    init() {
      const id = this.$route.params.id
      this.initData(id)
    },
    async initData(id) {
      const res = await this.$product.$api.mpApi.getMerchantBrandById({ 'id': id })
      if (res) {
        this.brandDetail = res.data
        const merchantRes = await this.$product.$api.merchantApi.queryMerchantOrgBaseInfoByOrgId(this.brandDetail.merchantId)
        if (merchantRes) {
          this.merchant = merchantRes.data
        }
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    openAudit(type, code) {
      this.auditType = type
      this.dialogData.ids = []
      this.dialogData.remark = ''
      this.dialogData.status = type// 默认审核通过
      this.dialogData.ids.push(this.brandDetail.id)
      this.dialogVisible = true
      this.dialogDataCode = code
    },
    hideDialog() {
      this.dialogVisible = false
    },
    confirmDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var param = Object.assign({}, this.dialogData)
          this.message = this.$t('操作成功')
          return this.$product.$api.mpApi.updateMerchantBrandStatusByIds(param).then(
            res => {
              if (res.code === '0') {
                this.$message({
                  showClose: true,
                  message: this.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.forwardToList()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error'
                })
              }
            }
          )
        }
      })
    },
    forwardToList() {
      /** 跳转到列表页*/
      this.$router.push({ name: 'ProductMerchantBrandManage' })
    },
    returnBack() {
      this.$portal.delActiveView()
    }
  }
}
</script>

<style lang="scss" scoped>
  .merchant-brand-detail-box .baoguo-detail .el-form-item__label{
    font-weight: bold;
    color: #99ABB4;
  }
  .merchant-brand-detail-box .el-form-item.el-form-item--medium{
    margin-bottom: 0px!important;
  }
  .card_header_class {
    font-size: 14px;
    color: #6666;
    margin-bottom: 20px;
  }
  .merchant-brand-detail-box .cp-box{
    box-shadow: none;
  }
</style>

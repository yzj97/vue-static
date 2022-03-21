<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleCancel"
      :title="getAddOrEdit + $t('联系人信息')"
      width="600px"
    >
      <el-form
        ref="addSupplierContact"
        :model="addSupplierContact"
        :rules="rules"
        label-position="right"
        label-width="140px"
      >
        <el-row>
          <el-col span="22" offset="1">
            <el-form-item :label="$t('联系人名称')" prop="name">
              <el-input
                v-model="addSupplierContact.name"
                name="addSupplierContact_name"
                maxlength="100"
              />
            </el-form-item>
            <el-form-item :label="$t('性别')" prop="sex">
              <ody-radio2
                v-model="addSupplierContact.sex"
                name="addSupplierContact_sex"
                list-key="sexList"
              />
            </el-form-item>
            <el-form-item :label="$t('联系人职位名称')" prop="position">
              <el-input
                v-model="addSupplierContact.position"
                name="addSupplierContact_position"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('手机号码')" prop="mobileNo">
              <el-input
                v-model="addSupplierContact.mobileNo"
                name="addSupplierContact_mobileNo"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('固定电话')" prop="telNo">
              <el-input
                v-model="addSupplierContact.telNo"
                name="addSupplierContact_telNo"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('传真')" prop="fax">
              <el-input
                v-model="addSupplierContact.fax"
                name="addSupplierContact_fax"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item :label="$t('QQ')" prop="qq">
              <el-input
                v-model="addSupplierContact.qq"
                name="addSupplierContact_qq"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('微信')" prop="weixin">
              <el-input
                v-model="addSupplierContact.weixin"
                name="addSupplierContact_weixin"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item :label="$t('联系邮箱')" prop="email">
              <el-input
                v-model="addSupplierContact.email"
                name="addSupplierContact_email"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('联系地址')" prop="area">
              <ody-province-city-region-select
                :selected.sync="selectedArea"
                v-model="addSupplierContact.area"
                name="addSupplierContact_area"
                value-key="id"
              />
            </el-form-item>
            <el-form-item :label="$t('详细地址')" prop="detailAddress">
              <el-input
                v-model="addSupplierContact.detailAddress"
                name="addSupplierContact_detailAddress"
                show-word-limit
                maxlength="300"
                type="textarea"
              />
            </el-form-item>
            <el-form-item :label="$t('主要联系人')" prop="isMain">
              <ody-select2
                v-model="addSupplierContact.isMain"
                name="addSupplierContact_isMain"
                list-key="mainList"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleCancel" size="mini" @click="handleCancel">{{ $t('取消') }}</el-button>
        <ody-button
          name="OpmsSupplierList09_handleSubmit"
          size="mini"
          type="primary"
          code="OpmsSupplierList09"
          @click="handleSubmit"
        >{{ $t('确定') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    supplierContact: {
      type: Object,
      default: () => {}
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    orgId: {
      type: String,
      default: ''
    },
    orgName: {
      type: String,
      default: ''
    },
    orgCode: {
      type: String,
      default: ''
    },
    mainContactId: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      selectedArea: [],
      value: [],
      isEdit: this.supplierContact && this.supplierContact.id,
      addSupplierContact: {
        name: '', // 联系人名称
        sex: 1, // 性别
        position: '', // 联系人职位名称
        mobileNo: '', // 手机号码
        telNo: '', // 固定电话
        fax: '', // 传真
        qq: '', // QQ
        weixin: '', // 微信
        email: '', // 联系邮箱
        area: [], // 省市区
        detailAddress: '', // 详细地址
        isMain: 1 // 主要联系人
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('请输入联系人名称'),
            trigger: 'change'
          }
        ],
        mobileNo: [
          {
            required: true,
            message: this.$t('请输入正确的手机号'),
            trigger: 'change',
            pattern: /^1\d{10}$/
          }
        ],
        email: [
          {
            type: 'email',
            message: this.$t('请输入正确联系邮箱'),
            trigger: 'change',
            pattern: /^1\d{10}$/
          }
        ],
        isMain: [
          {
            validator: (rule, value, callback) => {
              if (value != null && value === 1) {
                console.log(this.mainContactId)
                console.log(this.addSupplierContact)
                if (
                  this.isEdit &&
                  this.mainContactId &&
                  this.mainContactId !== this.addSupplierContact.id
                ) {
                  return callback('已存在主要联系人')
                }
                if (!this.isEdit && this.mainContactId) {
                  return callback('已存在主要联系人')
                }
              }
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {
    getAddOrEdit() {
      return this.isEdit ? this.$t('编辑') : this.$t('新增')
    }
  },
  mounted() {
    if (this.isEdit) {
      const {
        provinceCode,
        cityCode,
        regionCode,
        ...params
      } = this.supplierContact

      params.area = [provinceCode, cityCode, regionCode]
      this.addSupplierContact = params
    }
  },
  methods: {
    handleCancel() {
      this.addSupplierContact = {
        name: '', // 联系人名称
        sex: 1, // 性别
        position: '', // 联系人职位名称
        mobileNo: '', // 手机号码
        telNo: '', // 固定电话
        fax: '', // 传真
        qq: '', // QQ
        weixin: '', // 微信
        email: '', // 联系邮箱
        area: [], // 省市区
        detailAddress: '', // 详细地址
        isMain: 1 // 主要联系人
      }
      this.$emit('update:visible', false)
    },
    async handleSubmit() {
      const [err] = await this.formValidate('addSupplierContact')

      if (err) {
        return
      }

      const {
        area: [provinceCode, cityCode, regionCode],
        ...params
      } = this.addSupplierContact
      const { orgCode, orgName, orgId } = this

      params.provinceCode = provinceCode
      params.cityCode = cityCode
      params.regionCode = regionCode
      if (this.selectedArea[0]) {
        params.provinceName = this.selectedArea[0].name
      }
      if (this.selectedArea[1]) {
        params.cityName = this.selectedArea[1].name
      }
      if (this.selectedArea[2]) {
        params.regionName = this.selectedArea[2].name
      }

      params.orgCode = orgCode
      params.orgName = orgName
      params.orgId = orgId
      try {
        /* if (!this.isAdd) {*/
        await this.$ouser.$api.supplier.saveOrUpdateMerchantOrgContact(params)

        this.$message({
          message:
              this.getAddOrEdit + this.$t('联系人信息') + this.$t('成功'),
          type: 'success'
        })
        /* }*/
      } catch (ex) {
        console.log(ex)
      }
      this.addSupplierContact = {
        name: '', // 联系人名称
        sex: 1, // 性别
        position: '', // 联系人职位名称
        mobileNo: '', // 手机号码
        telNo: '', // 固定电话
        fax: '', // 传真
        qq: '', // QQ
        weixin: '', // 微信
        email: '', // 联系邮箱
        area: [], // 省市区
        detailAddress: '', // 详细地址
        isMain: 1 // 主要联系人
      }

      this.$emit('ok', params)
    }
  }
}
</script>

<style scoped>
</style>

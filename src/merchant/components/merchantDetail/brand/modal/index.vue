<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="closeModal"
      :title="$t('商品品牌')"
      width="800px"
      @open="init"
    >
      <el-form
        ref="brandFrom"
        :model="newBrand"
        :rules="rules"
        label-width="130px"
      >
        <el-row>
          <el-col span="20" offset="2">
            <el-form-item :label="$t('品牌名称：')" prop="brandId">
              <el-select
                id="brandId"
                :disabled="onlyRead || !!newBrand.id"
                v-model="newBrand.brandId"
                :placeholder="$t('请选择')"
                name="newBrand_brandId"
                @change="changeBrand"
              >
                <el-option> 全部 </el-option>
                <el-option
                  v-for="one in brandList"
                  :key="one.id"
                  :label="one.name"
                  :value="one.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('品牌名称') + '(' + $t('第二语言') + ')：'"
            >
              <el-input
                v-model="newBrand.nameLan2"
                :disabled="true"
                name="newBrand_nameLan2"
              />
            </el-form-item>
            <el-form-item :label="$t('品牌名称LOGO：')">
              <el-image
                v-if="newBrand.logUrl"
                :src="newBrand.logUrl"
                style="width: 35px; height: 35px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('品牌授权信息')" />
        <el-divider />
        <el-card v-if="display">
          <ody-button
            v-if="!(display2 && display3) && !onlyRead"
            name="MerchantManageApplyBrandAdd_showMore"
            code="MerchantManageApplyBrandAdd"
            size="mini"
            type="primary"
            style="float: right"
            @click="showMore"
          >{{ $t("添加") }}</ody-button
          >
          <el-col span="20" offset="2">
            <el-form-item :label="$t('证书有效期：')" prop="validityTime">
              <el-date-picker
                :disabled="onlyRead"
                v-model="newBrand.validityTime"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                :range-separator="$t('至')"
                :picker-options="pickerOptions"
                name="newBrand_validityTime"
                value-format="yyyy-MM-dd"
                type="daterange"
              />
            </el-form-item>
            <el-form-item :label="$t('资质名称：')" prop="seniorityName">
              <el-input
                id="seniorityName"
                :disabled="onlyRead"
                v-model="newBrand.seniorityName"
                name="newBrand_seniorityName"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('资质图片：')" prop="fileList">
              <ody-upload-image
                :disabled="onlyRead"
                :file-list.sync="newBrand.fileList"
                :multiple="true"
                :limit="3"
              />
            </el-form-item>
          </el-col>
        </el-card>
        <el-card v-if="display2">
          <ody-button
            v-if="!onlyRead"
            name="MerchantManageApplyBrandDisplay2_deleteItem"
            code="MerchantManageApplyBrandDisplay2"
            size="mini"
            icon="el-icon-delete"
            type="primary"
            style="float: right"
            @click="deleteItem(2)"
          />
          <el-col span="20" offset="2">
            <el-form-item :label="$t('证书有效期：')" prop="validityTime2">
              <el-date-picker
                :disabled="onlyRead"
                v-model="newBrand.validityTime2"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                :range-separator="$t('至')"
                :picker-options="pickerOptions"
                name="newBrand_validityTime2"
                value-format="yyyy-MM-dd"
                type="daterange"
              />
            </el-form-item>
            <el-form-item :label="$t('资质名称：')" prop="seniorityName">
              <el-input
                :disabled="onlyRead"
                v-model="newBrand.seniorityName2"
                name="newBrand_seniorityName2"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('资质图片：')" prop="fileList2">
              <ody-upload-image
                :disabled="onlyRead"
                :file-list.sync="newBrand.fileList2"
                :multiple="true"
                :limit="3"
              />
            </el-form-item>
          </el-col>
        </el-card>
        <el-card v-if="display3">
          <ody-button
            v-if="!onlyRead"
            name="MerchantManageApplyBrandDisplay3_deleteItem"
            code="MerchantManageApplyBrandDisplay3"
            size="mini"
            icon="el-icon-delete"
            type="primary"
            style="float: right"
            @click="deleteItem(3)"
          />
          <el-col span="20" offset="2">
            <el-form-item :label="$t('证书有效期：')" prop="validityTime3">
              <el-date-picker
                :disabled="onlyRead"
                v-model="newBrand.validityTime3"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                :range-separator="$t('至')"
                :picker-options="pickerOptions"
                name="newBrand_validityTime3"
                value-format="yyyy-MM-dd"
                type="daterange"
              />
            </el-form-item>
            <el-form-item :label="$t('资质名称：')" prop="seniorityName">
              <el-input
                :disabled="onlyRead"
                v-model="newBrand.seniorityName3"
                name="newBrand_seniorityName3"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item :label="$t('资质图片：')" prop="fileList3">
              <ody-upload-image
                :disabled="onlyRead"
                :file-list.sync="newBrand.fileList3"
                :multiple="true"
                :limit="3"
              />
            </el-form-item>
          </el-col>
        </el-card>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="closeModal" @click="closeModal">{{
          $t("取消")
        }}</el-button>
        <ody-button
          v-if="!onlyRead"
          id="saveBrand"
          :disabled="submiting"
          name="MerchantManageApplyBrandSave_saveBrand"
          code="MerchantManageApplyBrandSave"
          type="primary"
          @click="saveBrand"
        >{{ "保存" }}</ody-button
        >
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
    orgId: {
      type: Number,
      default: null
    },
    brand: {
      type: Object,
      default: null
    }
  },
  data() {
    const self = this
    return {
      submiting: false,
      newBrand: getDefaultBrand(),
      display: false,
      display2: false,
      display3: false,
      brandList: [],
      language: '第二语言',
      pickerOptions: {
        disabledDate(time) {
          return false
          /* return time.getTime() < Date.now()*/
        }
      },
      rules: {
        brandId: [
          { required: true, message: self.$t('required'), trigger: 'change' }
        ],
        validityTime: [
          { required: true, message: self.$t('required'), trigger: 'change' }
        ],
        seniorityName: [
          { required: true, message: self.$t('required'), trigger: 'change' }
          // ],
          // fileList: [
          //   { required: true, message: self.$t('required'), trigger: 'change' }
        ],
        validityTime2: [
          { required: true, message: self.$t('required'), trigger: 'change' }
        ],
        seniorityName2: [
          { required: true, message: self.$t('required'), trigger: 'change' }
          // ],
          // fileList2: [
          //   { required: true, message: self.$t('required'), trigger: 'change' }
        ],
        validityTime3: [
          { required: true, message: self.$t('required'), trigger: 'change' }
        ],
        seniorityName3: [
          { required: true, message: self.$t('required'), trigger: 'change' }
          // ],
          // fileList3: [
          //   { required: true, message: self.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    async init() {
      await this.loadBrandList()
      if (this.brand && this.brand.id) {
        const result =
          await this.$merchant.$api.productService.getMerchantBrandById({
            id: this.brand.id
          })
        if (result.code === '0') {
          this.newBrand = Object.assign(getDefaultBrand(), result.data)
        }
      } else {
        this.newBrand = getDefaultBrand()
      }
      this.newBrand.merchantId = this.orgId
      this.setDisplayBrand()
      this.resetForm()
    },
    async loadBrandList() {
      const result = await this.$merchant.$api.productService.listBrandByParam(
        {}
      )
      if (result.code === '0') {
        this.brandList = result.data
      }
    },
    async changeBrand() {
      if (this.newBrand.brandId) {
        const result =
          await this.$merchant.$api.productService.queryMerchantBrandByMerchantId(
            {
              brandId: this.newBrand.brandId,
              merchantId: this.orgId
            }
          )
        if (result.code === '0') {
          if (result.data) {
            this.$message({
              type: 'warning',
              message: '该品牌已申请'
            })
            this.newBrand.brandId = null
          }
          this.viewBrand()
        }
      }
    },
    async viewBrand() {
      let brandInfo = {}
      if (this.newBrand.brandId) {
        const result =
          await this.$merchant.$api.productService.viewBrandInfoById({
            id: this.newBrand.brandId
          })
        if (result.code === '0') {
          brandInfo = result.data
        }
      }
      this.newBrand.brandName = brandInfo.name
      this.newBrand.nameLan2 = brandInfo.nameLan2
      this.newBrand.logUrl = brandInfo.logUrl
    },
    setDisplayBrand() {
      this.display = true
      this.newBrand.fileList = []
      if (this.newBrand.seniorityUrl) {
        this.newBrand.fileList.push({
          url: this.newBrand.seniorityUrl
        })
      }
      if (this.newBrand.seniorityUrl2) {
        this.newBrand.fileList.push({
          url: this.newBrand.seniorityUrl2
        })
      }
      if (this.newBrand.seniorityUrl3) {
        this.newBrand.fileList.push({
          url: this.newBrand.seniorityUrl3
        })
      }
      if (this.newBrand.validityStart && this.newBrand.validityEnd) {
        this.newBrand.validityTime = [
          this.newBrand.validityStart,
          this.newBrand.validityEnd
        ]
      }
      if (this.newBrand.seniorityName2) {
        this.display2 = true
        this.newBrand.fileList2 = []
        if (this.newBrand.seniorityUrl4) {
          this.newBrand.fileList2.push({
            url: this.newBrand.seniorityUrl4
          })
        }
        if (this.newBrand.seniorityUrl5) {
          this.newBrand.fileList2.push({
            url: this.newBrand.seniorityUrl5
          })
        }
        if (this.newBrand.seniorityUrl6) {
          this.newBrand.fileList2.push({
            url: this.newBrand.seniorityUrl6
          })
        }
        if (this.newBrand.validityStart2 && this.newBrand.validityEnd2) {
          this.newBrand.validityTime2 = [
            this.newBrand.validityStart2,
            this.newBrand.validityEnd2
          ]
        }
      } else {
        this.display2 = false
      }
      if (this.newBrand.seniorityName3) {
        this.display3 = true
        this.newBrand.fileList3 = []
        if (this.newBrand.seniorityUrl7) {
          this.newBrand.fileList3.push({
            url: this.newBrand.seniorityUrl7
          })
        }
        if (this.newBrand.seniorityUrl8) {
          this.newBrand.fileList3.push({
            url: this.newBrand.seniorityUrl8
          })
        }
        if (this.newBrand.seniorityUrl9) {
          this.newBrand.fileList3.push({
            url: this.newBrand.seniorityUrl9
          })
        }
        if (this.newBrand.validityStart3 && this.newBrand.validityEnd3) {
          this.newBrand.validityTime3 = [
            this.newBrand.validityStart3,
            this.newBrand.validityEnd3
          ]
        }
      } else {
        this.display3 = false
      }
    },
    showMore() {
      if (!this.display2) {
        this.display2 = true
      } else if (!this.display3) {
        this.display3 = true
      }
    },
    deleteItem(index) {
      if (index === 2) {
        this.display2 = false
        this.newBrand.fileList2 = []
        this.newBrand.seniorityName2 = null
        this.newBrand.validityTime2 = null
      } else if (index === 3) {
        this.display3 = false
        this.newBrand.fileList3 = []
        this.newBrand.seniorityName3 = null
        this.newBrand.validityTime3 = null
      }
    },
    closeModal() {
      const self = this
      this.brand = null
      self.$emit('update:visible', !self.visible)
      self.resetForm()
    },
    saveBrand() {
      const self = this
      const list = [this.newBrand.seniorityName, this.newBrand.seniorityName2, this.newBrand.seniorityName3].filter((x) => {
        return x
      })
      const newArr = []
      let bool = false // 默认没有重复的,  如果有重复的 变成true
      list.reduce((cur, pro) => {
        if (cur.includes(pro)) {
          bool = true
          return
        }
        newArr.push(pro)
        return cur
      }, newArr)
      if (bool) {
        self.$message({
          message: '资质名称不能重复',
          type: 'wraning'
        })
        return
      }
      this.setNewBrandValue()
      self.submiting = true
      this.$refs['brandFrom'].validate((valid) => {
        if (valid) {
          let promise = this.$merchant.$api.productService.saveMerchantBrand
          if (this.newBrand.id) {
            promise =
              this.$merchant.$api.productService.updateMerchantBrandById
          }
          const toSaveBrand = Object.assign({}, self.newBrand)
          delete toSaveBrand.validityTime
          delete toSaveBrand.validityTime2
          delete toSaveBrand.validityTime3
          delete toSaveBrand.fileList
          delete toSaveBrand.fileList2
          delete toSaveBrand.fileList3
          if (toSaveBrand.validityEnd != null) {
            const today = new Date()
            const todayStr = today.getFullYear() + '-' + self.getDateNumber(today.getMonth() + 1) + '-' + self.getDateNumber(today.getDate())
            console.log('==', toSaveBrand.validityEnd, todayStr)
            if (toSaveBrand.validityEnd < todayStr) {
              self.$message({
                message: '有效期结束时间不能小于当前日期',
                type: 'warning'
              })
              self.submiting = false
              return
            }
          }
          promise(toSaveBrand)
            .then((res) => {
              if (res && res.code === '0') {
                self.$message({
                  message: '保存成功',
                  type: 'success'
                })
                self.$emit('update:visible', !self.visible)
                self.$emit('ok', {})
              }
            })
            .finally((res) => {
              self.submiting = false
            })
        } else {
          self.submiting = false
          return false
        }
      })
    },
    getDateNumber(num) {
      if (num > 9) {
        return num
      }
      return '0' + num
    },
    setNewBrandValue() {
      if (this.newBrand.validityTime) {
        this.newBrand.validityStart = this.newBrand.validityTime[0]
        this.newBrand.validityEnd = this.newBrand.validityTime[1]
      } else {
        this.newBrand.validityStart = null
        this.newBrand.validityEnd = null
      }

      if (this.newBrand.fileList && this.newBrand.fileList.length > 0) {
        this.newBrand.seniorityUrl = this.newBrand.fileList[0].url
        if (this.newBrand.fileList.length > 1) {
          this.newBrand.seniorityUrl2 = this.newBrand.fileList[1].url
        } else {
          this.newBrand.seniorityUrl2 = null
        }
        if (this.newBrand.fileList.length > 2) {
          this.newBrand.seniorityUrl3 = this.newBrand.fileList[2].url
        } else {
          this.newBrand.seniorityUrl3 = null
        }
      } else {
        this.newBrand.seniorityUrl = null
        this.newBrand.seniorityUrl2 = null
        this.newBrand.seniorityUrl3 = null
      }

      if (this.newBrand.validityTime2) {
        this.newBrand.validityStart2 = this.newBrand.validityTime2[0]
        this.newBrand.validityEnd2 = this.newBrand.validityTime2[1]
      } else {
        this.newBrand.validityStart2 = null
        this.newBrand.validityEnd2 = null
      }
      if (this.newBrand.fileList2 && this.newBrand.fileList2.length > 0) {
        this.newBrand.seniorityUrl4 = this.newBrand.fileList2[0].url
        if (this.newBrand.fileList2.length > 1) {
          this.newBrand.seniorityUrl5 = this.newBrand.fileList2[1].url
        } else {
          this.newBrand.seniorityUrl5 = null
        }
        if (this.newBrand.fileList2.length > 2) {
          this.newBrand.seniorityUrl6 = this.newBrand.fileList2[2].url
        } else {
          this.newBrand.seniorityUrl6 = null
        }
      } else {
        this.newBrand.seniorityUrl4 = null
        this.newBrand.seniorityUrl5 = null
        this.newBrand.seniorityUrl6 = null
      }

      if (this.newBrand.validityTime3) {
        this.newBrand.validityStart3 = this.newBrand.validityTime3[0]
        this.newBrand.validityEnd3 = this.newBrand.validityTime3[1]
      } else {
        this.newBrand.validityStart3 = null
        this.newBrand.validityEnd3 = null
      }
      if (this.newBrand.fileList3 && this.newBrand.fileList3.length > 0) {
        this.newBrand.seniorityUrl7 = this.newBrand.fileList3[0].url
        if (this.newBrand.fileList3.length > 1) {
          this.newBrand.seniorityUrl8 = this.newBrand.fileList3[1].url
        } else {
          this.newBrand.seniorityUrl8 = null
        }
        if (this.newBrand.fileList3.length > 2) {
          this.newBrand.seniorityUrl9 = this.newBrand.fileList3[2].url
        } else {
          this.newBrand.seniorityUrl9 = null
        }
      } else {
        this.newBrand.seniorityUrl7 = null
        this.newBrand.seniorityUrl8 = null
        this.newBrand.seniorityUrl9 = null
      }
    },
    resetForm() {
      this.$refs['brandFrom'].resetFields()
    }
  }
}

function getDefaultBrand() {
  return Object.assign(
    {},
    {
      brandId: null,
      nameLan2: null,
      brandName: null,
      logUrl: null,
      merchantId: null,
      seniorityName: null,
      seniorityName2: null,
      seniorityName3: null,
      seniorityUrl: null,
      seniorityUrl2: null,
      seniorityUrl3: null,
      seniorityUrl4: null,
      seniorityUrl5: null,
      seniorityUrl6: null,
      seniorityUrl7: null,
      seniorityUrl8: null,
      seniorityUrl9: null,
      validityEnd: null,
      validityEnd2: null,
      validityEnd3: null,
      validityStart: null,
      validityStart2: null,
      validityStart3: null,
      fileList: [],
      fileList2: [],
      fileList3: [],
      validityTime: null,
      validityTime2: null,
      validityTime3: null,
      status: 1
    }
  )
}
</script>

<style scoped>
</style>

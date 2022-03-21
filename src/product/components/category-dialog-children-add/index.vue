<template>
  <div>
    <ody-dialog
      v-if="visible"
      :visible="visible"
      :before-close="handleClose"
      :title="$t('新增类目')"
      width="600px">
      <el-form ref="ruleForm" :model="params" :rules="rules" label-position="right" label-width="180px">
        <el-form-item :label="$t('类目编码')" prop="categoryCode">
          <el-input v-model="params.categoryCode" name="params_categoryCode" maxlength="60"/>
        </el-form-item>
        <el-form-item :label="$t('第三方编码')" prop="thirdCode">
          <el-input v-model="params.thirdCode" name="params_thirdCode" maxlength="60"/>
        </el-form-item>
        <el-form-item :label="$t('类目名称')" prop="name">
          <el-input v-model="params.name" name="params_name" maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('类目名称（第二语言）')" prop="nameLan2">
          <el-input v-model="params.nameLan2" name="params_nameLan2" maxlength="40"/>
        </el-form-item>
        <el-form-item v-if="categoryType === 1" :label="$t('价格范围')" prop="price">
          <el-row>
            <el-col :span="10">
              <el-input v-model="params.lowPrice" name="params_lowPrice" maxlength="10"/>
            </el-col>
            <el-col :span="1">
              &nbsp;-
            </el-col>
            <el-col :span="10">
              <el-input v-model="params.highPrice" name="params_highPrice" maxlength="10"/>
            </el-col>
          </el-row>

        </el-form-item>
        <el-form-item v-if="categoryType === 1" :label="$t('允许自定义属性')" prop="enableAddAtt">
          <el-radio v-model="params.enableAddAtt" name="params_enableAddAtt" label="1">{{ $t('是') }}</el-radio>
          <el-radio v-model="params.enableAddAtt" name="params_enableAddAtt9" label="0">{{ $t('否') }}</el-radio>
        </el-form-item>
        <el-form-item v-if="categoryType !== 1" :label="$t('状态')" prop="isVisible">
          <el-radio v-model="params.isVisible" name="params_isVisible" label="1">{{ $t('显示') }}</el-radio>
          <el-radio v-model="params.isVisible" name="params_isVisible7" label="0">{{ $t('隐藏') }}</el-radio>
        </el-form-item>
        <el-form-item v-if="categoryType !== 1" :label="$t('图片')" prop="pictureUrl">
          <ody-upload-image :disabled="viewStatus === 2" v-model="params.pictureUrl" :pic-type="picType" :pic-size="4096" :multiple="false" name="params_pictureUrl" @error="error"/>
        </el-form-item>
        <el-form-item v-if="categoryType !== 1" label="" prop="picture">
          <span class="info_class">
            {{ $t('提示：仅支持上传一张，大小不超过4M，支持JPG、JPEG、PNG格式') }}
          </span>
        </el-form-item>

        <el-form-item v-if="dialogContentFlg === 0 " :label="$t('广告图片')" prop="adPictureUrl">
          <ody-upload-image :disabled="viewStatus === 2" v-model="params.adPictureUrl" :pic-type="picType" :pic-size="4096" :multiple="false" @error="error"/>
        </el-form-item>
        <el-form-item v-if="dialogContentFlg === 0" label="" prop="picture">
          <span class="info_class">
            {{ $t('图片大小建议尺寸：530*180') }}
          </span>
          <el-button type="text" class="link_class" @click="setAdLink(index)">设置链接到的页面地址</el-button>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <el-button name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('确认') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import constant from '@/utils/constants'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: ''
    },
    categoryType: {
      type: Number,
      default: 1
    },
    dialogContentFlg: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      picType: ['png', 'jpg', 'jpeg'],
      categoryOptions: constant.categoryOptions,
      params: {
        categoryCode: '',
        thirdCode: '',
        name: '',
        nameLan2: '',
        enableAddAtt: '1',
        lowPrice: '',
        highPrice: '',
        parentId: this.parentId,
        isVisible: '1',
        pictureUrl: '',
        // 广告图片地址
        adPictureUrl: '',
        // 广告图片链接地址
        adPictureLinkUrl: ''
      },
      rules: {
        categoryCode: [
          { required: true, message: this.$t('请输入类目编码'), trigger: 'blur' }
        ],
        name: [
          { required: true, validator: this.validateName, trigger: 'blur' }
        ],
        price: [
          { validator: this.validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.mpApi = this.$product.$api.mpApi
  },
  methods: {
    validateName(rule, value, callback) {
      if (this.params.name === null || this.params.name === '') {
        callback(new Error(this.$t('请输入类目树名称')))
      } else if (this.params.name.indexOf('>') > -1) {
        callback(new Error(this.$t('不能包含') + '>'))
      } else {
        callback()
      }
    },
    validatePass(rule, value, callback) {
      if (this.params.lowPrice !== '' && this.params.highPrice !== '') {
        if (/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(this.params.lowPrice) &&
        /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(this.params.highPrice)) {
          if (+this.params.lowPrice <= +this.params.highPrice) {
            callback()
          } else {
            callback(new Error(this.$t('起始值不能大于结束值')))
          }
        } else {
          callback(new Error(this.$t('价格输入最多包含两位小数的正数')))
        }
      } else if ((!this.params.lowPrice && this.params.highPrice !== '') || (this.params.lowPrice !== '' && !this.params.highPrice)) {
        callback(new Error(this.$t('请填写完整的价格区间')))
      } else {
        callback()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$emit('closeDialog')
    },
    // 为广告图片设置链接
    setAdLink(index) {
      this.$prompt('链接到:', '设置链接地址', {
        inputValue: this.params.adPictureLinkUrl,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.params.adPictureLinkUrl = value
        this.$message({
          type: 'success',
          message: '您设置的链接是: ' + value
        })
      })
    },
    handleOk() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.mpApi
            .newAddCategoryChild(this.params)
            .then(res => {
              this.$emit('update:visible', !this.visible)
              this.$emit('ok')
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .info_class{
    font-size: 12px;
    line-height: 20px;
    display: inline-block;
  }
</style>


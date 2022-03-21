<template>
  <div style="margin-top: 30px">
    <el-row>
      <div
        class="grid-content bg-purple"
        style="float: left;margin-right: 30px;width: 180px;text-align: right"
      >
        <span style="color: red">*</span>
        <span style="font-size: 15px">{{ $t('品牌名称') }}</span>
      </div>
      <div style="float: left;width: 300px;margin-top: -5px">
        <el-input :disabled="viewStatus === 2" v-model="brand.name" name="brand_name" maxlength="20" show-word-limit />
      </div>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="font-size: 15px">{{ $t('品牌名称') }}</span>
          <span>({{ lang }})</span>
        </span>
      </div>
      <div style="float: left;width: 300px;margin-top: -5px">
        <el-input
          :disabled="viewStatus === 2"
          v-model="brand.nameLan2"
          name="brand_nameLan2"
          maxlength="30"
          show-word-limit
        />
      </div>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="font-size: 15px">{{ $t('型号') }}</span>
        </span>
      </div>
      <div
        style="float: left;width: 400px;height: 150px;margin-top: -5px;border:1px solid #CCCCCC;padding: 5px"
      >
        <el-input
          v-for="(value, index) of brand.brandModel"
          :key="index"
          v-model="brand.brandModel[index].modelName"
          :disabled="viewStatus === 2"
          name="brand_brandModel[index]_modelName"
          style="width: 110px;margin-left: 10px;margin-top: 5px"
        >
          <i slot="suffix" name="handleIconClick" class="el-icon-close el-input__icon" @click="handleIconClick(index)" />
        </el-input>
        <el-button
          v-show="brand.brandModel.length < 9"
          :disabled="viewStatus === 2"
          name="addModel"
          size="small"
          type="primary"
          style="margin-left: 10px;margin-top: 5px"
          @click="addModel"
        >{{ $t('添加') }}</el-button>
      </div>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="font-size: 15px">{{ $t('品牌LOGO') }}</span>
        </span>
      </div>
      <div style="float: left;width: 300px;margin-top: -5px">
        <ody-upload-image
          :disabled="viewStatus === 2"
          :file-list.sync="fileList"
          :pic-type="picType"
          :draggable="true"
          :pic-size="4096"
          :multiple="false"
          @error="error"
        />
      </div>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">&nbsp;</div>
      <div style="float: left;margin-top: -5px">
        <span class="info_class">{{ $t('提示：支持上传一张，建议尺寸800*800PX，单张大小不超过4M，支持JPG、JPEG、PNG格式') }}</span>
      </div>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="font-size: 15px">{{ $t('发源国家') }}</span>
        </span>
      </div>
      <div style="float: left;width: 300px;margin-top: -5px">
        <el-input
          :disabled="viewStatus === 2"
          v-model="brand.sourceCountry"
          name="brand_sourceCountry"
          maxlength="20"
          show-word-limit
        />
      </div>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="font-size: 15px">{{ $t('品牌介绍') }}</span>
        </span>
      </div>
      <div style="float: left;width: 400px;margin-top: -5px">
        <el-input
          :disabled="viewStatus === 2"
          v-model="brand.introduce"
          name="brand_introduce"
          type="textarea"
          maxlength="500"
          show-word-limit
        />
      </div>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 30px">
      <el-button
        :disabled="viewStatus === 2"
        :loading="loading"
        name="save"
        type="primary"
        size="small"
        @click="save"
      >{{ $t('保存') }}</el-button>
      <ody-button
        :loading="loading"
        name="Product1004Save_back"
        type="primary"
        size="small"
        code="Product1004Save"
        @click="back"
      >{{ $t('返回') }}</ody-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lang: this.$t('第二语言'),
      brand: {
        name: '',
        nameLan2: '',
        logUrl: '',
        introduce: '',
        sourceCountry: '',
        brandModel: [{ modelName: '' }]
      },
      fileList: [],
      picType: ['png', 'jpg', 'jpeg'],
      viewStatus: null,
      id: null
    }
  },
  watch: {
    fileList: function(newVal, oldVal) {
      if (newVal[0]) {
        this.brand.logUrl = newVal[0].url
      } else {
        this.brand.logUrl = ''
      }
    }
  },
  async mounted() {
    if (this.id) {
      this.query(this.id)
    }
  },
  created() {
    this.viewStatus = this.$route.query.viewStatus
    this.id = this.$route.query.id
    this.mpApi = this.$product.$api.mpApi
    this.handleIconClick(0)
  },
  methods: {
    addModel() {
      this.brand.brandModel.push({ modelName: '' })
    },
    async query(id) {
      return this.mpApi.viewBrandInfoById({ id: id }).then(res => {
        this.brand = res.data
        // if (this.brand.brandModel.length === 0) {
        //   this.brand.brandModel.push({ modelName: '' })
        // }
        if (this.brand.logUrl && this.fileList.length === 0) {
          this.fileList.push({ url: this.brand.logUrl })
        }
      })
    },
    back() {
      this.$portal.delActiveView()
    },
    save() {
      const self = this
      if (this.validate()) {
        if (this.viewStatus === 3) {
          const param = Object.assign({}, this.brand)
          return this.mpApi.updateBrandInfo(param).then(res => {
            this.$message({
              showClose: true,
              message: this.$t('更新成功'),
              type: 'success'
            })
            // this.back()
            self.toList(false)
          })
        } else {
          const param = Object.assign({}, this.brand)
          return this.mpApi.addBrandInfo(param).then(res => {
            this.$confirm(
              this.$t('您已经成功创建品牌，您可以进行以下操作'),
              this.$t('提示'),
              {
                confirmButtonText: this.$t('继续新建'),
                cancelButtonText: this.$t('返回列表'),
                type: 'success'
              }
            )
              .then(() => {
                this.brand = {
                  name: '',
                  nameLan2: '',
                  logUrl: '',
                  introduce: '',
                  sourceCountry: '',
                  brandModel: [{ modelName: '' }]
                }
                this.fileList = []
              })
              .catch(() => {
                self.toList(true)
              })
          })
        }
      }
    },
    toList(isAdd) {
      if (isAdd) {
        this.$portal.delActiveView()
      }
      this.$router.push({ name: 'Product1004', params: { reload: true }})
    },
    validate() {
      if (isStrEmpty(this.brand.name)) {
        this.$message({
          showClose: true,
          message: this.$t('品牌名称不能为空'),
          type: 'error'
        })
        return false
      }
      return true
    },
    handleIconClick(index) {
      if (this.viewStatus === 2 || this.viewStatus === '2') {
        return
      }
      this.brand.brandModel.splice(index, 1)
    },
    error() {
      this.fileList = []
      alert('Wrong case!')
    }
  }
}
function isStrEmpty(str) {
  if (str === undefined) {
    return true
  }
  if (str === null) {
    return true
  }
  return str.replace(/(^\s*)|(\s*$)/g, '').length === 0
}
</script>
<style lang="less" scoped>
.info_class {
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  color: #109fff;
  border-radius: 12px;
  margin-left: 10px;
  cursor: default;
}
</style>

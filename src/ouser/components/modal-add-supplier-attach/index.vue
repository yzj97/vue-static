<template>
  <div>
    <ody-dialog :visible="visible" :before-close="handleCancel" :title="$t('上传附件')" width="600px">
      <el-form
        ref="addSupplierAttach"
        :model="addSupplierAttach"
        :rules="rules"
        label-position="right"
        label-width="140px"
      >
        <el-row>
          <el-col span="22" offset="1">
            <el-form-item :label="$t('选择文件')" prop="fileList">
              <ody-upload-image
                :file-list.sync="addSupplierAttach.fileList"
                :pic-type="['jpg', 'jpeg', 'png']"
                :show-tip="true"
              />
            </el-form-item>
            <el-form-item :label="$t('附件类型')" prop="certificateType">
              <ody-select2 v-model="addSupplierAttach.certificateType" name="addSupplierAttach_certificateType" list-key="attachTypeList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleCancel" size="mini" @click="handleCancel">{{ $t('取消') }}</el-button>
        <ody-button
          name="OpmsSupplierList13_handleSubmit"
          size="mini"
          type="primary"
          code="OpmsSupplierList13"
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
    supplierAttach: {
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
    }
  },
  data() {
    return {
      value: [],
      isEdit: this.supplierAttach && this.supplierAttach.id,
      addSupplierAttach: {
        fileList: [], // 选择文件
        certificateType: '1' // 附件类型
      },
      rules: {}
    }
  },
  computed: {},
  mounted() {
    if (this.isEdit) {
      const { fileUrl, certificateName, ...params } = this.supplierAttach

      params.fileList = fileUrl
        ? [
          {
            url: fileUrl,
            fileName: certificateName
          }
        ]
        : []

      this.addSupplierAttach = params
    }
  },
  methods: {
    handleCancel() {
      this.addSupplierAttach = {
        fileList: [], // 选择文件
        certificateType: '1' // 附件类型
      }
      this.$emit('update:visible', false)
    },
    async handleSubmit() {
      if (
        this.addSupplierAttach.fileList == null ||
        this.addSupplierAttach.fileList.length === 0
      ) {
        this.$message({
          message: this.$t('请上传图片'),
          type: 'error'
        })
        return
      }
      try {
        const [err] = await this.formValidate('addSupplierAttach')
        const {
          fileList: [{ fileName: certificateName, url: fileUrl }],
          ...params
        } = this.addSupplierAttach
        const { orgId } = this
        if (err) {
          return
        }
        params.orgId = orgId
        params.certificateName = certificateName
        params.fileUrl = fileUrl
        if (this.isEdit) {
          await this.$ouser.$api.supplier.updateMerchantOrgCertificateById(
            params
          )
          this.$message({
            message: this.$t('上传附件') + this.$t('成功'),
            type: 'success'
          })
        } else {
          await this.$ouser.$api.supplier.addMerchantOrgCertificate(params)
          this.$message({
            message: this.$t('上传附件') + this.$t('成功'),
            type: 'success'
          })
        }

        this.addSupplierAttach = {
          fileList: [], // 选择文件
          certificateType: '1' // 附件类型
        }

        this.$emit('ok')
      } catch (ex) {
        console.log('ss')
      }
    }
  }
}
</script>

<style scoped>
</style>

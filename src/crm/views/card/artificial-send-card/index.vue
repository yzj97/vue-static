<template>
  <div>
    <div v-show="step === 1">
      <ody-list-table-area>
        <div slot="btn">
          <ody-button
            :disabled="data.length >= 10"
            name="GiftCardSendCardChooseProduct_handleAddProduct"
            size="small"
            type="primary"
            code="GiftCardSendCardChooseProduct"
            @click="handleAddProduct"
          >{{ $t('选择卡') }}</ody-button>
          <ody-button
            :disabled="checked.length === 0"
            name="GiftCardSendCardDeleteProduct_handleBatchDeleteProduct"
            size="small"
            type="primary"
            code="GiftCardSendCardDeleteProduct"
            @click="handleBatchDeleteProduct"
          >{{ $t('批量删除') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :data="data"
            :multiple="true"
            :checked.sync="checked"
            :columns="columns"
            :operates="operates"
            :can-filter="false"
            name="data659"
          />
        </div>
      </ody-list-table-area>
      <ody-fixed>
        <el-button name="handleCancel" size="small" type="primary" @click="handleCancel">{{ $t('取消') }}</el-button>
        <ody-button
          name="GiftCardSendCardNextStep_handleNext"
          size="small"
          type="primary"
          code="GiftCardSendCardNextStep"
          @click="handleNext"
        >{{ $t('下一步') }}</ody-button>
      </ody-fixed>
    </div>
    <div v-show="step === 2">
      <span>{{ $t('批量导入用户') }}</span>
      <el-divider />
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item
          :label="$t('上传文件')"
          :rules="[ { required: true, message: this.$t('请选择文件'), trigger: 'change' }]"
          prop="fileList"
        >
          <el-upload
            ref="file"
            :auto-upload="false"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list.sync="form.fileList"
            accept=".xls, .xlsx"
          >
            <el-button
              slot="trigger"
              size="small"
              type="primary"
            >{{ form.fileList.length === 0 ? $t('选择文件') : $t('重新选择文件') }}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label>
          <el-link name="downloadTemplate" type="primary" @click="downloadTemplate">{{ $t('下载模板') }}</el-link>
        </el-form-item>
      </el-form>
      <ody-fixed>
        <el-button name="handleBack" size="small" type="primary" @click="handleBack">{{ $t('上一步') }}</el-button>
        <ody-button
          name="GiftCardSendCardSave_handleSend"
          size="small"
          type="primary"
          code="GiftCardSendCardSave"
          @click="handleSend"
        >{{ $t('确认发送') }}</ody-button>
      </ody-fixed>
    </div>
    <card-product-modal
      :title="$t('选择卡')"
      :visible.sync="showCardProductModal"
      :checked-mp-ids="checkedMpIds"
      :multiple="true"
      :type="[33, 35]"
      :data-type="2"
      :type-of-product="[0, 2]"
      @ok="handleProductSelect"
    />
  </div>
</template>

<script>
import CardProductModal from '@/components/card-product-modal'
import SendCardUserTemplate from '@/excelFile/sendCardUserTemplate.xlsx'

export default {
  name: 'CrmArtificialSendCard',
  components: {
    CardProductModal,
    SendCardUserTemplate
  },
  data() {
    return {
      checkedMpIds: [],
      showCardProductModal: false,
      step: 1,
      limit: 1,
      data: [],
      checked: [],
      columns: [
        {
          label: this.$t('商品编码'),
          prop: 'cardMpCode',
          show: true,
          align: 'center',
          minWidth: 150
        },
        {
          label: this.$t('商品名称'),
          prop: 'cardMpName',
          show: true,
          align: 'center',
          minWidth: 150
        },
        {
          label: this.$t('商品类型'),
          prop: 'typeStr',
          show: true,
          align: 'center',
          minWidth: 150
        },
        {
          label: this.$t('面值（元）'),
          prop: 'faceValue',
          show: true,
          align: 'center',
          minWidth: 150
        },
        {
          label: this.$t('兑换商品编码'),
          prop: 'giftMpCode',
          show: true,
          align: 'center',
          minWidth: 150
        },
        {
          label: this.$t('兑换商品名称'),
          prop: 'giftMpName',
          show: true,
          align: 'center',
          minWidth: 150
        }
      ],
      operates: {
        width: 120,
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              this.handleDeleteProduct(index, row)
            },
            code: 'GiftCardSendCardDeleteProduct'
          }
        ]
      },
      form: {
        fileList: []
      }
    }
  },
  methods: {
    handleAddProduct() {
      this.showCardProductModal = true
    },
    handleProductSelect(selected) {
      const vue = this
      let productLimit = false
      selected.map(item => {
        if (vue.data.length < 10) {
          if (!vue.checkedMpIds.includes(item.cardMpId)) {
            item.typeStr = item.typeName
            delete item.typeName
            vue.data.push(item)
            vue.checkedMpIds.push(item.cardMpId)
          }
        } else {
          productLimit = true
        }
      })
      if (productLimit) {
        vue.$message.warning(vue.$t('最多支持选择10个商品'))
      }
    },
    handleBatchDeleteProduct() {
      const vue = this
      for (let i = 0; i < vue.checked.length; i++) {
        const index = vue.data.indexOf(vue.checked[i])
        if (index > -1) {
          vue.data.splice(index, 1)
          vue.checkedMpIds.splice(index, 1)
        }
      }
      vue.checked = []
    },
    handleDeleteProduct(index, row) {
      this.data.splice(index, 1)
      this.checkedMpIds.splice(index, 1)
    },
    handleNext() {
      if (this.data && this.data.length > 0) {
        this.step = 2
      } else {
        this.$message.warning(this.$t('请选择卡'))
      }
    },
    handleCancel() {
      this.$portal.delActiveViewAndRefresh()
    },
    handleBack() {
      this.step = 1
    },
    async handleSend() {
      const vue = this
      const valid = vue.$refs.form.validate()
      if (valid) {
        const params = new FormData()
        const productList = vue.$portal.deepClone(vue.data)
        params.append('productList', JSON.stringify(productList))
        params.append('file', vue.form.fileList[0].raw)

        const res = await vue.$crm.$api.giftCard.artificialSendCard(params)
        if (res) {
          vue.$message.success(
            vue.$t('发卡任务已创建，请在卡管理列表点击“查看发卡任务”')
          )
          this.$portal.delActiveViewAndRefresh()
        }
      }
    },
    beforeUpload(file) {
      // 文件上传前检测文件类型
      if (
        !(
          file.name.toLowerCase().lastIndexOf('.xlsx') ===
          file.name.length - 5
        ) &&
        !(file.name.toLowerCase().lastIndexOf('.xls') === file.name.length - 4)
      ) {
        this.$message({
          type: 'info',
          message: this.$t('只允许上传xls, xlsx文件！')
        })
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        this.$message({
          type: 'info',
          message: this.$t('文件最大只能10M')
        })
        return false
      }
      return true
    },
    handleChange(file, fileList) {
      const result = this.beforeUpload(file)
      if (result) {
        if (fileList.length > this.limit) {
          fileList.splice(0, fileList.length - this.limit)
        }
        this.form.fileList = fileList
      } else {
        this.$refs.file.clearFiles()
      }
    },
    handleRemove(file, fileList) {
      this.form.fileList = fileList
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(
        SendCardUserTemplate,
        {},
        this.$t('人工发卡用户导入模板') + '.xlsx'
      )
    }
  }
}
</script>

<style scoped>
</style>

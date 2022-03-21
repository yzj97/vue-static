<template>
  <div>
    <ody-dialog :visible="visible" :before-close="handleClose" :title="$t('新增类目树')" width="600px">
      <el-form
        ref="ruleForm"
        :model="params"
        :rules="rules"
        label-position="right"
        label-width="150px"
      >
        <el-form-item v-if="categoryType === 6" :label="$t('店铺')" prop="storeId">
          <ody-store-select
            v-model="storeCode"
            :selected.sync="selectedStore"
            name="storeCode"
            @change="handleStoreChange"
          />
        </el-form-item>
        <el-form-item v-if="false" :label="$t('类目树类型')" prop="type">
          <el-select v-model="params.type" :disabled="true" :hidden="true" :placeholder="$t('全部')" name="params_type">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('选择添加方式')" prop="isRefer">
          <el-radio v-model="params.isRefer" :label="0" name="params_isRefer">{{ $t('自建类目树') }}</el-radio>
          <el-radio v-model="params.isRefer" :label="1" name="params_isRefer3">{{ $t('引用商家类目树') }}</el-radio>
        </el-form-item>
        <template v-if="params.isRefer === 0">
          <el-form-item :label="$t('类目树编码')" prop="categoryCode">
            <el-input v-model="params.categoryCode" name="params_categoryCode" maxlength="60" />
          </el-form-item>
          <el-form-item :label="$t('第三方系统编码')" prop="thirdCode">
            <el-input v-model="params.thirdCode" name="params_thirdCode" maxlength="60" />
          </el-form-item>
          <el-form-item :label="$t('类目树名称')" prop="name">
            <el-input v-model="params.name" name="params_name" maxlength="20" />
          </el-form-item>
          <el-form-item :label="$t('类目树名称（第二语言）')" prop="nameLan2">
            <el-input v-model="params.nameLan2" name="params_nameLan2" maxlength="20" />
          </el-form-item>
        </template>
        <template v-else-if="params.isRefer === 1">
          <el-form-item :label="$t('引用商家类目树节点')" prop="type">
            <el-select
              v-model="params.categoryId"
              :disabled="!params.storeId"
              :placeholder="$t('请选择')"
              name="params_categoryId"
              @change="handleCategoryChange"
            >
              <el-option
                v-for="item in merchantCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <!-- {{ params.categoryId }} -->
          </el-form-item>
          <el-form-item :label="$t('类目选择')" prop="checkedNodes">
            <ody-category-transfer
              :disabled="!params.categoryId"
              :selected.sync="params.checkedNodes"
              :category-type="4"
              :params="{id: params.categoryId}"
            />
            <!-- <el-input v-model="params.nameLan2" name="params_nameLan28" maxlength="20"/> -->
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button
          name="StoreCategoryListAdd_handleOk"
          size="small"
          type="primary"
          code="StoreCategoryListAdd"
          @click="handleOk"
        >{{ $t('确认') }}</ody-button>
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
    categoryType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      categoryOptions: constant.showCategoryOptions,
      categorySelectVisible: false,
      selectedStore: [],
      merchantCategoryList: [],
      params: {
        storeId: null, // 店铺Id
        type: this.categoryType, // 类目树类型
        categoryCode: null, // 类目树编码
        thirdCode: null, // 第三方系统编码
        name: null, // 类目树名称
        isRefer: null,
        nameLan2: null, // 类目树名称（第二语言）
        categoryId: null, // 引用商家类目树节点
        checkedNodes: [] // 类目选择
      },
      rules: {
        storeId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        isRefer: [
          { required: true, message: '请选择添加方式', trigger: 'change' }
        ],
        categoryCode: [
          { required: true, message: '请输入类目树编码', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入类目树名称', trigger: 'change' }
        ],
        checkedNodes: [
          { required: true, message: '请选择类目', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择引用商家类目树', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.mpApi = this.$product.$api.mpApi
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk() {
      const [err] = await this.formValidate('ruleForm')

      if (err) {
        return false
      }

      const { checkedNodes, ...otherParams } = this.params

      try {
        if (this.params.isRefer === 0) {
          await this.mpApi.addRootCategoryTreeBack(otherParams)
        } else {
          otherParams.checkedNodes = this.$portal.tree2arr(checkedNodes)
          await this.mpApi.addCopyCategory(otherParams)
        }

        this.$emit('update:visible', !this.visible)
        this.$emit('ok')
        this.loading = false
      } catch (ex) {
        console.error(ex)
      }
    },
    getMerchantList() {
      if (this.categoryType === 4 || this.categoryType === 6) {
        this.$product.$api.merchantApi
          .queryPlatformAuthMerchantPage({
            currentPage: 1,
            itemsPerPage: 500
          })
          .then(res => {
            this.merchantList = res.data.listObj
            this.merchantList.map(item => {
              this.merchantMap[item.merchantId] = item
            })
          })
      }
    },
    handleStoreChange() {
      this.params.merchantId = this.selectedStore.merchantId
      this.params.storeId = this.selectedStore.storeId
      this.mpApi
        .listMerchantCategory({
          merchantId: this.params.merchantId,
          type: 4,
          currentPage: 1,
          itemsPerPage: 500
        })
        .then(res => {
          this.merchantCategoryList = res.data.listObj
        })
    },
    getStoreList() {
      if (this.categoryType === 6) {
        this.$product.$api.merchantApi
          .queryPlatformAuthStorePage({
            currentPage: 1,
            itemsPerPage: 500
          })
          .then(res => {
            this.storeList = res.data.listObj
            this.storeList.map(item => {
              this.storeMap[item.storeId] = item
            })
          })
      }
    },
    handleCategoryChange() {
      this.categorySelectVisible = true
      this.merchantCategoryList.map(item => {
        if (item.id === this.params.categoryId) {
          this.params.name = item.name
          this.params.nameLan2 = item.nameLan2
          this.params.categoryCode = item.categoryCode
          this.params.thirdCode = item.thirdCode
          this.params.pictureUrl = item.pictureUrl
        }
      })
    }
  }
}
</script>

<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" :model="edit" :inline="true" class="form">
          <el-form-item :label="$t('商家名称')" :rules="[{required:true, message: $t('商家名称') + $t('不能为空')}]" label-width="100px" required="true" prop="merchantId">
            <ody-merchant-select
              v-model="edit.merchantId"
              :item-disabled="() => {return readonly || update}"
              :selected="{disabled: readonly || update}"
              name="edit_merchantId"
              value-key="merchantId"
              @change="changeMerchantClean"
            />
          </el-form-item>
          <el-form-item
            :label="$t('BOM编码')"
            :rules="[{required:true, message: $t('BOM编码') + $t('不能为空')},{ max: 10, trigger: 'blur', message: $t('BOM编码') + $t('不能超过') + '10' + $t('个字符') }]"
            required="true"
            prop="bomCode"
          >
            <el-input
              v-model="edit.bomCode"
              :disabled="readonly || update"
              name="edit_bomCode"
              @change="onBomCodeChange"
            />
          </el-form-item>
          <el-form-item
            :label="$t('BOM名称')"
            :rules="[{required:true, message: $t('BOM名称') + $t('不能为空')},{ max: 20, trigger: 'blur', message: $t('BOM名称') + $t('不能超过') + '20' + $t('个字符') }]"
            required="true"
            prop="bomName"
          >
            <el-input v-model="edit.bomName" :disabled="readonly || update" name="edit_bomName" />
          </el-form-item>
          <el-form-item
            :label="$t('成品')"
            :rules="[{required:true, message: $t('成品') + $t('不能为空')}]"
            required="true"
            prop="mpName"
          >
            <el-input
              v-model="edit.mpName"
              :disabled="readonly || update"
              :readonly="true"
              name="edit_mpName"
              @focus="openMpChoose"
            />
          </el-form-item>
        </el-form>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <el-button name="openMpItemChoose" type="primary" size="small" @click="openMpItemChoose">{{ $t('添加原料') }}</el-button>
      </div>
      <div slot="table">
        <el-form ref="rowForm" :model="edit" class="form">
          <ody-table
            ref="table"
            :can-filter="false"
            :multiple="false"
            :columns="columns"
            :operates="operates"
            :data="edit.items"
            name="edit_items928"
          >
            <template slot="mpNum" slot-scope="scope">
              <el-form-item
                :prop="'items.' + scope.$index + '.mpNum'"
                :rules="[{required:true, message: $t('数量') + $t('不能为空')},{type: 'number', max: 99999999, min: 1, message: $t('数量') + $t('为数字值')}]"
                required="true"
              >
                <el-input-number
                  :controls="false"
                  :precision="2"
                  :max="99999999"
                  :min="1"
                  v-model.number="scope.row.mpNum"
                  :disabled="readonly"
                  size="small"
                />
              </el-form-item>
            </template>
            <template slot="mpNumslot">
              <ody-tip-star :content="$t('数量')" />
            </template>
            <template slot="unitCode" slot-scope="scope">
              <el-form-item :prop="'items.' + scope.$index + '.unitCode'">
                <el-select
                  v-model="scope.row.unitCode"
                  :disabled="readonly"
                  name="scope_row_unitCode"
                >
                  <el-option
                    v-for="(item,index) in scope.row.unitList"
                    :key="index"
                    :label="item.unitName"
                    :value="item.unitCode"
                  />
                </el-select>
              </el-form-item>
            </template>
            <template slot="wastageRate" slot-scope="scope">
              <el-form-item
                :prop="'items.' + scope.$index + '.wastageRate'"
                :rules="[{required:true, message: $t('耗损率') + $t('不能为空')},{type: 'number', max:100, min:0, message: $t('请输入0-100整数值')}]"
                required="true"
              >
                <el-input-number
                  :controls="false"
                  :precision="0"
                  :max="100"
                  :min="0"
                  v-model.number="scope.row.wastageRate"
                  :disabled="readonly"
                  size="small"
                />
              </el-form-item>
            </template>
          </ody-table>
        </el-form>
      </div>
    </ody-list-table-area>

    <div style="margin-top: 30px">
      <el-row type="flex" justify="center" style="margin-top: 10px">
        <ody-button
          v-show="!readonly"
          :disabled="edit.items.length == 0"
          :loading="loading"
          name="BomManagementSave_save"
          type="primary"
          size="small"
          code="BomManagementSave"
          @click="save"
        >{{ $t('保存') }}</ody-button>
        <el-button
          :loading="loading"
          name="back"
          type="primary"
          size="small"
          @click="back"
        >{{ $t('返回') }}</el-button>
      </el-row>
    </div>
    <merchant-product-modal
      v-if="mpChooseVisible"
      :visible.sync="mpChooseVisible"
      :product-query="$product.$api.mpApi.bom_listBomProductForPage"
      :merchant-id="edit.merchantId"
      :multiple="false"
      :type="[1, 32]"
      :use-type="0"
      :data-type="2"
      :type-of-product="[0, 2]"
      :status="[0, 1, 2]"
      :search-items="['商品名称', '商品编码', '商品条码', '商品类目', '商品品牌']"
      :column-items="['商品名称', '商品编码', '商品条码', '商品类目', '商品品牌']"
      :category-filters="categoryFilters"
      @ok="onMpChoose"
    />

    <merchant-product-modal
      v-if="mpItemChooseVisible"
      :visible.sync="mpItemChooseVisible"
      :product-query="$product.$api.mpApi.bom_listBomItemProductForPage"
      :merchant-id="edit.merchantId"
      :multiple="true"
      :type="[1, 32]"
      :use-type="1"
      :data-type="2"
      :type-of-product="[0, 2]"
      :status="[0, 1, 2]"
      :search-items="['商品名称', '商品编码', '商品条码', '商品品牌']"
      :column-items="['商品名称', '商品编码', '商品条码', '商品品牌']"
      :extra-filters="mpItemFilters"
      @ok="onMpItemChoose"
    />
  </section>
</template>

<script>
import merchantProductModal from '@/components/product-search-modal'
export default {
  name: 'BomManagementDetail',
  components: {
    merchantProductModal
  },
  data() {
    const vue = this
    return {
      loading: false,
      readonly: false,
      update: false,
      merchantIdBack: null, // 备用商家id
      edit: {
        items: []
      },
      columns: [
        {
          show: true,
          label: vue.$t('原料编码'),
          prop: 'merchantProductCode',
          minWidth: 200
        },
        {
          show: true,
          label: vue.$t('原料名称'),
          prop: 'merchantProductName',
          minWidth: 200
        },
        {
          show: true,
          labelSlot: 'mpNumslot',
          slot: 'mpNum',
          minWidth: 200
        },
        {
          show: true,
          label: vue.$t('计量单位'),
          slot: 'unitCode',
          minWidth: 200
        },
        {
          show: true,
          label: vue.$t('耗损率') + '(%)',
          slot: 'wastageRate',
          minWidth: 200
        }
      ],
      operates: {
        width: 150,
        fixed: 'right',
        list: [
          {
            label: vue.$t('删除'),
            method: (index, row) => {
              this.edit.items.splice(index, 1)
              this.mpItemFilters.mpIds.splice(index, 1)
            },
            hidden: () => {
              return this.readonly
            },
            code: 'BomManagementMod'
          }
        ]
      },
      mpChooseVisible: false,
      mpItemChooseVisible: false,
      mpItemFilters: {
        mpIds: [], // 用于排除表格中已选原料
        bomItemIds: [] // 用于编辑时排除原料自身
      },
      categoryFilters: {
        merchantId: null
      }
    }
  },
  watch: {
    'edit.merchantId': function(newVal, oldVal) {
      this.categoryFilters.merchantId = newVal
    }
  },
  async mounted() {
    this.readonly = this.$route.params.readonly
    if (this.$route.params.id) {
      this.update = !this.readonly
      this.loading = true
      const res = await this.$product.$api.mpApi.bom_getById({
        id: this.$route.params.id
      })
      this.loading = false
      this.edit = res.data
      this.edit.items.forEach(element => {
        this.mpItemFilters.bomItemIds.push(element.id)
        this.mpItemFilters.mpIds.push(element.merchantProductId)
      })
    }
  },
  methods: {
    openMpChoose() {
      if (!this.edit.merchantId) {
        this.$message({
          message: this.$t('请选择商家'),
          type: 'error'
        })
        return
      }
      this.mpChooseVisible = true
    },
    openMpItemChoose() {
      if (!this.edit.merchantId) {
        this.$message({
          message: this.$t('请选择商家'),
          type: 'error'
        })
        return
      }
      this.mpItemChooseVisible = true
    },
    onBomCodeChange() {
      this.$product.$api.mpApi
        .bom_existBomCode({ code: this.edit.bomCode })
        .then(res => {
          if (res.data) {
            this.$message({
              message: this.$t('编码已经存在'),
              type: 'error'
            })
            return
          }
        })
    },
    onMpChoose(selected) {
      this.edit.merchantProductId = selected[0].id
      this.$set(this.edit, 'mpName', selected[0].chineseName)
    },
    onMpItemChoose(selected) {
      selected.forEach(mp => {
        this.edit.items.push({
          merchantProductId: mp.id,
          merchantProductCode: mp.code,
          merchantProductName: mp.chineseName,
          unitList: mp.unitList,
          wastageRate: 0
        })
        this.mpItemFilters.mpIds.push(mp.id)
      })
    },
    save() {
      // validate data
      if (this.edit.items.length > 20) {
        this.$message({
          message: this.$t('最多添加20个原料'),
          type: 'error'
        })
        return
      }
      if (
        this.edit.items.every(row => {
          return row.mpNum && row.mpNum <= 0
        })
      ) {
        this.$message({
          message: this.$t('原料数量不能为空'),
          type: 'error'
        })
        return
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.rowForm.validate(valid => {
            if (valid) {
              const api = this.edit.id
                ? this.$product.$api.mpApi.bom_update
                : this.$product.$api.mpApi.bom_add
              api(this.edit).then(res => {
                this.$alert(this.$t('保存成功'), this.$t('系统信息'), {
                  confirmButtonText: this.$t('确定'),
                  callback: action => {
                    this.back()
                  }
                })
              })
            }
          })
        }
      })
    },
    back() {
      this.$portal.delActiveViewAndRefresh()
    },
    changeMerchantClean() {
      if (!this.merchantIdBack || this.merchantIdBack === '') {
        this.merchantIdBack = this.edit.merchantId
        return
      }
      this.$confirm(this.$t('切换商家会清空已选的成品和原料，是否继续?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log('确认重新选择')
        this.edit.merchantProductId = null
        this.$set(this.edit, 'mpName', null)
        this.edit.items = []
        this.mpItemFilters.mpIds = []
        this.merchantIdBack = this.edit.merchantId
      }).catch(() => {
        console.log('已取消')
        this.edit.merchantId = this.merchantIdBack
      })
    }
  }
}
</script>

<!-- 供应商联系人模态框 -->
<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_choose_please')"
      width="60%"
      @open="init" >
      <section>
        <ody-list-table-area>
          <div slot="table">
            <el-table
              :data="list"
              name="list174"
              highlight-current-row
              @current-change="handleRowSelectionChange">
              <el-table-column :label="'供应商编码'" align="center" prop="supplierCode" min-width="150"/>
              <el-table-column :label="'供应商名称'" align="center" prop="supplierName" min-width="120"/>
              <el-table-column :label="'联系人姓名'" align="center" prop="personName" min-width="100"/>
              <el-table-column :label="'性别'" align="center" prop="sex">
                <template slot-scope="scope">
                  <span>{{ scope.row.sex == 1 ? '男' : '女' }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="'联系人职位'" align="center" prop="positionName" />
              <el-table-column :label="'手机号码'" align="center" prop="mobile" min-width="120"/>
              <el-table-column :label="'固定电话'" align="center" prop="fixedTelephone" min-width="100" />
              <el-table-column :label="'传真号码'" align="center" prop="fax" min-width="100" />
              <el-table-column :label="'QQ号'" align="center" prop="qq" min-width="120"/>
              <el-table-column :label="'微信号'" align="center" prop="weixin" min-width="100"/>
              <el-table-column :label="'电子邮箱'" align="center" prop="email" min-width="120"/>
              <el-table-column :label="'联系地址(省）'" align="center" prop="provinceName" />
              <el-table-column :label="'联系地址(市）'" align="center" prop="cityName"/>
              <el-table-column :label="'联系地址(区）'" align="center" prop="regionName"/>
              <el-table-column :label="'详细地址'" align="center" prop="addressDetail" min-width="150"/>
              <el-table-column :label="'主要联系人'" align="center" prop="isDefault">
                <template slot-scope="scope">
                  <span>{{ scope.row.isDefault == 1 ? '是' : '否' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ody-list-table-area>
      </section>
      <!--<span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
      </span>-->
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    supplierCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      currentRow: {}
    }
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    init() {
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleRowSelectionChange(val) {
      if (val) {
        const vue = this
        vue.currentRow = val
        vue.$emit('update:visible', !vue.visible)
        vue.$emit('ok', vue.currentRow)
      }
    }
  }
}
async function loadList(vue) {
  const common = vue.$opms.$api.purchaseOrder
  const result = await common.getSupplierContact({ supplierCode: vue.supplierCode })
  if (result && result.data) {
    vue.list = result.data
  }
}

</script>

<style lang="scss" scoped>
</style>

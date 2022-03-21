<template>
  <section>
    <el-form ref="form" :model="levelTable" :inline="true">
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('rank_condition') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item>
            <el-checkbox :label="$t('购买指定商品')" v-model="data[levelConProductOn]" name="data[levelConProductOn]"/>
            <el-checkbox :label="$t('消费累计金额')" v-model="data[levelConAmountAccumOn]" name="data[levelConAmountAccumOn]"/>
            <el-checkbox :label="$t('推广金额累积')" v-model="data[levelConAmountPopOn]" name="data[levelConAmountPopOn]"/>
            <el-checkbox :label="$t('团队金额累积')" v-model="data[levelConAmountGroupOn]" name="data[levelConAmountGroupOn]"/>
            <el-checkbox :label="$t('inviteAgentCount')" v-model="data[levelConInviteOn]" name="data[levelConInviteOn]"/>
            <el-checkbox
              v-for="(value, key) in data[levelConInviteLevelOn]"
              :key="key"
              v-model="data[levelConInviteLevelOn][key]"
              :label="$t('邀请') + key + $t('级分销员')"
              name="data[levelConInviteLevelOn][key]"
              @change="onlevelConInviteLevelOnChange()"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <ody-table
            v-loading="loading"
            :data="data[levels]"
            :columns="levelColumns"
            :operates="levelOperates"
            :can-filter="false"
            name="data[levels]916">
            <template slot="level" slot-scope="scope">
              {{ '等级' + scope.row.level }}
            </template>
            <template slot="mpIds" slot-scope="scope">
              <el-checkbox v-if="scope.row.level > 1" v-model="scope.row.assignedProductOn" name="scope_row_assignedProductOn"/>
              <el-link v-if="scope.row.level > 1" name="chooseProduct" class="underline" type="info" @click="chooseProduct(scope.row)">{{ $t('Addgoods') }}</el-link>
              <el-link v-if="scope.row.level > 1" name="viewProduct" class="underline" type="info" @click="viewProduct(scope.row)">{{ $t('product_view_product') }}</el-link>
            </template>
            <template slot="amountAccum" slot-scope="scope">
              <el-checkbox v-if="scope.row.level > 1" v-model="scope.row.amountAccumOn" name="scope_row_amountAccumOn"/>
              <ody-input-number v-if="scope.row.level > 1" :controls="false" :decimal="2" :min="0" :max="maxAmount" v-model="scope.row.amountAccum" name="scope_row_amountAccum" size="mini"><template slot="append">{{ $t('元') }}</template></ody-input-number>
            </template>
            <template slot="amountSpread" slot-scope="scope">
              <el-checkbox v-if="scope.row.level > 1" v-model="scope.row.amountSpreadOn" name="scope_row_amountSpreadOn"/>
              <ody-input-number v-if="scope.row.level > 1" :controls="false" :decimal="2" :min="0" :max="maxAmount" v-model="scope.row.amountSpread" name="scope_row_amountSpread" size="mini"><template slot="append">{{ $t('元') }}</template></ody-input-number>
            </template>
            <template slot="amountGroup" slot-scope="scope">
              <el-checkbox v-if="scope.row.level > 1" v-model="scope.row.amountGroupOn" name="scope_row_amountGroupOn"/>
              <ody-input-number v-if="scope.row.level > 1" :controls="false" :decimal="2" :min="0" :max="maxAmount" v-model="scope.row.amountGroup" name="scope_row_amountGroup" size="mini"><template slot="append">{{ $t('元') }}</template></ody-input-number>
            </template>
            <template slot="inviteCount" slot-scope="scope">
              <el-checkbox v-if="scope.row.level > 1" v-model="scope.row.inviteCountOn" name="scope_row_inviteCountOn"/>
              <ody-input-number v-if="scope.row.level > 1" :controls="false" :decimal="0" :min="0" :max="maxAmount" v-model="scope.row.inviteCount" name="scope_row_inviteCount" size="mini"><template slot="append">{{ $t('个') }}</template></ody-input-number>
            </template>
            <template v-for="(value, level, index) in data[levelConInviteLevelOn]" slot-scope="scope" :slot="'inviteCount'+level">
              <el-checkbox v-if="scope.row.level > 1" :key="index" v-model="scope.row.levelItems[index].on" :name="'scope_row_levelItems'+index+'_on'"/>
              <ody-input-number v-if="scope.row.level > 1" :key="index" :controls="false" :decimal="0" :min="0" :max="maxAmount" v-model="scope.row.levelItems[index].value" name="scope_row_levelItems[index]_value" size="mini"><template slot="append">{{ $t('个') }}</template></ody-input-number>
            </template>

          </ody-table>
        </el-col>
      </el-row>
    </el-form>

    <ody-dialog
      :visible.sync="showViewProductModal"
      :title="$t('product_view_product')"
      width="900px">
      <div slot="content">
        <ody-table
          v-loading="viewProductLoading"
          :data="productList"
          :columns="productColumns"
          :operates="productOperates"
          :can-filter="false"
          name="productList011"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button
          name="showViewProductModal"
          size="small"
          type="primary"
          @click="showViewProductModal = false"
        >{{ $t('common.confirm') }}</ody-button>
      </span>
    </ody-dialog>

    <Product-Modal
      :append-to-body="true"
      :visible.sync="showAddProductModal"
      :check-mp-ids="checkedMpIds"
      :list-api="productListApi"
      id-label="mpId"
      name-label="mpName"
      code-label="mpCode"
      @ok="onProductOk"/>
    <LevelCom v-if="comRow" ref="levelCom" :visible.sync="comVisible" :row.sync="comRow" :form-data.sync="data" :switch-list-label="levelConInviteLevelOn"/>
  </section>
</template>

<script>
import ProductModal from '@/components/productModal'
import LevelCom from '../levelCom'
import util from '@/utils/util'

export default {
  name: 'RuleConfig',
  components: {
    ProductModal,
    LevelCom
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    comCalcTypeChanged: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    levels: {
      type: String,
      default: null
    },
    levelConProductOn: {
      type: String,
      default: null
    },
    levelConAmountAccumOn: {
      type: String,
      default: null
    },
    levelConAmountPopOn: {
      type: String,
      default: null
    },
    levelConAmountGroupOn: {
      type: String,
      default: null
    },
    levelConInviteOn: {
      type: String,
      default: null
    },
    levelConInviteLevelOn: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      labelColSpan: 4,
      labelSpan: 2,
      maxAmount: 99999999,
      levelColumns: [
        {
          show: true,
          prop: 'name',
          label: this.$t('等级名称'),
          align: 'left',
          minWidth: '100px'
        },
        {
          show: true,
          slot: 'level',
          label: this.$t('等级类型'),
          align: 'left',
          width: '80px'
        },
        {
          show: () => {
            return this.data[this.levelConProductOn]
          },
          slot: 'mpIds',
          tooltip: false,
          label: this.$t('购买指定商品'),
          align: 'left',
          minWidth: '220px'
        },
        {
          show: () => {
            return this.data[this.levelConAmountAccumOn]
          },
          tooltip: false,
          slot: 'amountAccum',
          label: this.$t('消费金额累积'),
          align: 'left',
          minWidth: '180px'
        },
        {
          show: () => {
            return this.data[this.levelConAmountPopOn]
          },
          tooltip: false,
          slot: 'amountSpread',
          label: this.$t('推广金额累积'),
          align: 'left',
          minWidth: '180px'
        },
        {
          show: () => {
            return this.data[this.levelConAmountGroupOn]
          },
          tooltip: false,
          slot: 'amountGroup',
          label: this.$t('团队金额累积'),
          align: 'left',
          minWidth: '180px'
        },
        {
          show: () => {
            return this.data[this.levelConInviteOn]
          },
          tooltip: false,
          slot: 'inviteCount',
          label: this.$t('inviteAgentCount'),
          align: 'left',
          minWidth: '180px'
        }
      ],
      levelOperates: {
        label: this.$t('等级权限设置'),
        minWidth: '80px',
        fixed: 'right',
        list: [
          {
            label: this.$t('权限设置'),
            disabled: false,
            code: 'AgentRuleConfig302',
            method: (index, row) => {
              if (this.comCalcTypeChanged) {
                this.$message.warning(this.$t('改变分佣方式，请先点击页面下方的[保存]按钮保存数据后再操作'))
              } else {
                if (this.comRow === row) {
                  this.comVisible = true
                  return
                }
                this.comRow = row
                setTimeout(() => {
                  this.comVisible = true
                }, 0)
              }
            }
          }
        ]
      },
      viewProductLoading: false,
      showAddProductModal: false,
      showViewProductModal: false,
      checkedMpIds: [],
      rowProductList: {},
      rowLoadFlag: {},
      rowMpIds: {},
      productListApi: this.$agent.$api.distributionProduct.listDistributionProductPageByParams,
      productList: [],
      productColumns: [
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('product_code'),
          align: 'center',
          minWidth: '160px'
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('product_name'),
          align: 'center',
          width: '330px'
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'center',
          minWidth: '100px'
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('shop_name'),
          align: 'center',
          minWidth: '100px'
        }
      ],
      productOperates: {
        minWidth: '50px',
        fixed: 'right',
        list: [
          {
            label: this.$t('删除'),
            disabled: false,
            code: 'ui',
            method: (index, row) => {
              try {
                util.confirm(this, this.$t('whether_to_delete_the_goods'), () => {
                  this.productList.splice(index, 1)
                  this.currentRow.mpIds.splice(index, 1)
                })
              } catch (e) {
                console.log(e)
              }
            }
          }
        ]
      },
      comVisible: false,
      comRow: null
    }
  },
  mounted() {
    this.ruleApi = this.$agent.$api.rule
    this.init()
  },
  methods: {
    refresh() {
      this.$forceUpdate()
      this.$emit('update:data', this.data)
    },
    init() {
      for (const p in this.data[this.levelConInviteLevelOn]) {
        this.levelColumns.push({
          show: () => {
            return this.data[this.levelConInviteLevelOn][p]
          },
          tooltip: false,
          slot: 'inviteCount' + p,
          label: this.$t('邀请') + p + this.$t('级分销员'),
          align: 'center',
          minWidth: '180px'
        })
      }
    },
    onlevelConInviteLevelOnChange() {
      const val = this.data[this.levelConInviteLevelOn]
      for (const p in this.data[this.levelConInviteLevelOn]) {
        this.$set(this.data[this.levelConInviteLevelOn], p, val[p])
      }
      this.$forceUpdate()
    },
    chooseProduct(row) {
      this.currentRow = row
      this.checkedMpIds = row.mpIds || []
      this.rowMpIds[this.currentRow.level] = row.mpIds || []
      this.showAddProductModal = true
    },
    onProductOk(addList) {
      const productList = this.rowProductList[this.currentRow.level] || []
      const mpIds = this.rowMpIds[this.currentRow.level]
      addList.forEach(item => {
        if (!mpIds.includes(item.mpId)) {
          mpIds.push(item.mpId)
          productList.push(item)
        }
      })
      this.rowProductList[this.currentRow.level] = productList
      this.rowMpIds[this.currentRow.level] = mpIds
      this.$set(this.currentRow, 'mpIds', mpIds)
      this.showAddProductModal = false
    },
    async viewProduct(row) {
      this.currentRow = row
      this.productList = this.rowProductList[this.currentRow.level] || []
      if (row.id && this.productList.length === 0 && !this.rowLoadFlag[this.currentRow.level]) {
        const levelProductList = await this.$agent.$api.rule.product_listLevelProducts({
          customerType: row.customerType,
          levelId: row.id
        })
        this.rowLoadFlag[this.currentRow.level] = true
        this.productList = this.productList.concat(levelProductList.data)
        this.rowProductList[this.currentRow.level] = this.productList
      }
      this.showViewProductModal = true
    },
    validateData() {

    }
  }
}

</script>

<style scoped>
.el-input-group {
  width:60%;
}
</style>

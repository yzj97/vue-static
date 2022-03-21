<template>
  <section>
    <el-card shadow="never">
      <el-row>
        <el-col :span="6">
          <!-- 固定常规商品不显示分组名 -->
          <el-form-item
            v-if="!(combineType === 0 && type === 1)"
            :label="$t('分组名称') + ':'"
            :name="'combineGroupVOS.' + index + '.groupName'"
            :prop="'combineGroupVOS.' + index + '.groupName'"
            :rules="rules['groupName']"
            label-width="90px"
          >
            <el-input
              v-model="combineGroup.groupName"
              name="combineGroup_groupName"
              maxlength="10"
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <div v-if="index !== 0" style="float:right; padding: 3px 0">
            <el-button
              name="removeItem"
              type="primary"
              size="mini"
              icon="el-icon-close"
              @click="removeItem"
            />
          </div>
        </el-col>
      </el-row>
      <div v-if="combineType === 1">
        <!--  可选组合显示设置 -->
        <el-row>
          <!-- 餐饮商品，可选组合，显示是否勾选同一商品 -->
          <el-col :span="combineType === 1 && type === 32 ? 5 : 1">
            <el-form-item :label="$t('选择设置') + ':'" required label-width="90px">
              <el-checkbox
                v-if="combineType === 1 && type === 32"
                v-model="combineGroup.isRepeatSame"
                :true-label="1"
                :false-label="0"
                name="combineGroup_isRepeatSame"
                @change="reCalculateAmount"
              >{{ $t('允许重复选购同一商品') }}</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :label="$t('必选') + ':'"
              :name="'combineGroupVOS.' + index + '.selectNum'"
              :prop="'combineGroupVOS.' + index + '.selectNum'"
              :rules="rules['selectNum']"
              label-width="120px"
            >
              <ody-input-number
                v-model="combineGroup.selectNum"
                :min="1"
                :max="combineGroup.products.length"
                name="combineGroup_selectNum"
                @input="reCalculateAmount"
              >
                <template slot="append">{{ $t('件') }}</template>
              </ody-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <ody-table
        :data="combineGroup.products"
        :columns="columns"
        :operates="operates"
        :can-filter="false"
        :fixed="false"
        name="combineGroup_products183"
      >
        <template slot="subNum" slot-scope="props">
          <!-- // 固定组合可以编辑数量 -->
          <template v-if="combineType === 0">
            <ody-input-number
              :key="'subNum' + props.$index"
              v-model="props.row.subNum"
              :min="1"
              name="props_row_subNum"
              @input="updateSubNum"
            />
          </template>
          <template v-else-if="combineType === 1">{{ props.row.subNum }}</template>
        </template>
        <template slot="numTitle">
          <ody-tip-star :content="$t('数量')" />
        </template>
        <template slot="move" slot-scope="props">
          <el-button-group>
            <el-button
              name="moveUp"
              type="text"
              size="mini"
              icon="el-icon-arrow-up"
              plain
              @click="moveUp(props.row)"
            />
            <el-button
              name="moveDown"
              type="text"
              size="mini"
              icon="el-icon-arrow-down"
              plain
              @click="moveDown(props.row)"
            />
            <el-button
              name="moveTop"
              type="text"
              size="mini"
              icon="el-icon-top"
              plain
              @click="moveTop(props.row)"
            />
            <el-button
              name="moveBottom"
              type="text"
              size="mini"
              icon="el-icon-bottom"
              plain
              @click="moveBottom(props.row)"
            />
          </el-button-group>
        </template>
        <template slot="subAddPrice" slot-scope="props">
          <ody-input-number
            v-model="props.row.subAddPrice"
            :min="0"
            :max="9999999"
            :decimal="2"
            name="props_row_subAddPrice"
          />
        </template>
      </ody-table>
      <el-button v-if="!isView" name="showSkuModal" type="text" size="mini" @click="showSkuModal">
        <i class="el-icon-plus" />
        {{ $t('添加SKU') }}
      </el-button>
      <!-- 餐饮商品的组合可以查询常规和餐饮，常规商品的组合只能查询常规 -->
      <merchant-product-modal
        v-if="modalVisible"
        :visible.sync="modalVisible"
        :merchant-id="merchantId"
        :data-type="dataType"
        :use-type="0"
        :status="2"
        :type="type === 32 ? [1, 32] : type"
        :type-of-products="[0, 2]"
        @ok="closeMpModal"
      />
    </el-card>
  </section>
</template>

<script>
import merchantProductModal from '@/components/product-search-modal'
export default {
  components: { merchantProductModal },
  props: {
    combineGroup: {
      // 分组
      type: Object,
      required: true,
      default: null
    },
    combineGroupList: {
      type: Array,
      required: true,
      default: null
    },
    index: {
      // 分组下标
      type: Number,
      required: true,
      default: () => {
        return 0
      }
    },
    type: {
      // 商品类型
      type: Number,
      required: true,
      default: null
    },
    combineType: {
      // 组合商品类型:0-固定组合;1-可选组合
      type: Number,
      required: true,
      default: null
    },
    merchantId: {
      // 商家id
      type: Number,
      required: true,
      default: null
    },
    dataType: {
      // 商品数据类型:1-运营商品;2-商家商品;3-店铺商品
      type: Number,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vue = this
    return {
      modalVisible: false,
      columns: [
        {
          show: true,
          label: vue.$t('商品名称'),
          prop: 'chineseName',
          minWidth: 120
        },
        {
          show: true,
          label: vue.$t('是否有仓'),
          prop: 'warehouseType',
          minWidth: 80,
          formatter: (row, column) => {
            return row.warehouseType === 1 ? vue.$t('无仓') : vue.$t('有仓')
          }
        },
        {
          show: true,
          label: vue.$t('数量'),
          prop: 'subNum',
          minWidth: 80,
          slot: 'subNum',
          labelSlot: 'numTitle'
        },
        {
          show: true,
          label: vue.$t('零售单价'),
          prop: 'salePriceWithTax',
          minWidth: 80
        },
        {
          show: () => {
            return vue.combineType === 0
          },
          label: vue.$t('零售总价'),
          minWidth: 80,
          formatter: (row, column) => {
            var price = Number(row.salePriceWithTax)
            if (isNaN(price)) {
              price = 0
            }
            return this.$portal.currency(price * row.subNum)
          }
        },
        {
          show: true,
          label: vue.$t('移动'),
          prop: 'move',
          minWidth: 80,
          slot: 'move'
        },
        {
          show: () => {
            return vue.combineType === 1
          },
          label: this.$t('加价'),
          prop: 'subAddPrice',
          minWidth: 80,
          slot: 'subAddPrice'
        }
      ],
      operates: {
        width: 80,
        fixed: 'right',
        list: [
          {
            label: vue.$t('删除'),
            hidden: (row, index) => {
              return this.isView
            },
            method: (index, row) => {
              this.deleteRow(row)
            },
            code: 'ui'
          }
        ]
      },
      rules: {
        groupName: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validateGroupName, trigger: 'change' }
        ],
        selectNum: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validateNum, trigger: 'change' }
        ],
        products: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {},
    validateGroupName(value, rule, callback) {
      const groupNameList = []
      for (var index = 0; index < this.combineGroupList.length; index++) {
        const groupName = this.combineGroupList[index].groupName
        if (index !== this.index && groupName === this.combineGroup.groupName) {
          return callback(new Error(this.$t('存在相同名称的分组')))
        }
        groupNameList.push(groupName)
      }
      return callback()
    },
    validateNum(value, rule, callback) {
      if (this.combineGroup.products.length < this.combineGroup.selectNum) {
        return callback(new Error(this.$t('必选数量不能大于商品数量')))
      } else {
        return callback()
      }
    },
    removeItem() {
      this.$confirm(this.$t('是否删除此分组？'), this.$t('提示'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'info'
      }).then(() => {
        this.$emit('removeGroup', this.index)
      })
    },
    updateSubNum() {
      this.reCalculateAmount()
    },
    removeRow(row) {
      var index = this.combineGroup.products.indexOf(row)
      this.combineGroup.products.splice(index, 1)
      return index
    },
    moveUp(row) {
      var index = this.removeRow(row)
      this.combineGroup.products.splice(Math.max(0, index - 1), 0, row)
    },
    moveDown(row) {
      var index = this.removeRow(row)
      this.combineGroup.products.splice(
        Math.min(this.combineGroup.products.length, index + 1),
        0,
        row
      )
    },
    moveTop(row) {
      this.removeRow(row)
      this.combineGroup.products.splice(0, 0, row)
    },
    moveBottom(row) {
      this.removeRow(row)
      this.combineGroup.products.splice(
        this.combineGroup.products.length,
        0,
        row
      )
    },
    deleteRow(row) {
      this.removeRow(row)
      this.reCalculateAmount()
    },
    reCalculateAmount() {
      this.$emit('calculateAmount')
    },
    validate() {
      if (
        !this.combineGroup.products ||
        this.combineGroup.products.length === 0
      ) {
        this.$message({
          type: 'warning',
          message:
            (this.combineGroup.groupName ? this.combineGroup.groupName : '') +
            this.$t('分组请至少选择一个商品')
        })
        return false
      }
      return true
    },
    calculateAmount() {
      var amount = 0

      if (this.combineType === 0) {
        for (var i = 0; i < this.combineGroup.products.length; i++) {
          var item = this.combineGroup.products[i]
          var price = Number(item.salePriceWithTax)
          if (isNaN(price)) {
            price = 0
          }
          amount += price * item.subNum
        }
      } else {
        const sortedPrice = this.combineGroup.products
          .map(i =>
            isNaN(Number(i.salePriceWithTax)) ? 0 : Number(i.salePriceWithTax)
          )
          .sort((a, b) => a - b)
        let num = this.combineGroup.selectNum
        if (num) {
          if (this.combineGroup.isRepeatSame) {
            if (sortedPrice && sortedPrice.length > 0) {
              amount += sortedPrice[0] * num
            }
          } else {
            let index = 0
            while (num > 0) {
              amount += sortedPrice[index]
              index++
              num--
            }
          }
        }
      }
      return amount
    },
    showSkuModal() {
      // 显示商品模态框,传 typeOfProduct [0, 2], dataType, merchantId, useType : 0, type
      this.modalVisible = true
    },

    closeMpModal(mpList) {
      if (mpList) {
        for (var k = 0; k < mpList.length; k++) {
          var supplierCode
          if (k === 0) {
            supplierCode = mpList[k].supplierCode
            // console.log(supplierCode)
          } else {
            // console.log(supplierCode)
            // console.log(mpList[k].supplierCode)
            if (supplierCode !== mpList[k].supplierCode) {
              this.$message({
                type: 'warn',
                message: this.$t('请选择同一个供应商下面的商品')
              })
              return
            }
          }
        }
        for (var i = 0; i < mpList.length; i++) {
          const success = this.addSku(mpList[i])
          if (!success) {
            return
          }
        }
      }
    },
    addSku(value) {
      if (this.combineGroup.products.length >= 10) {
        this.$message({
          type: 'warn',
          message: this.$t('最多添加10个商品')
        })
        return false
      }
      for (var i = 0; i < this.combineGroupList.length; i++) {
        const group = this.combineGroupList[i]
        var supplierCode
        if (i === 0) {
          supplierCode = value.supplierCode
        }
        for (var j = 0; j < group.products.length; j++) {
          const item = group.products[j]
          if (item.subMpId === value.refId) {
            if (group === this.combineGroup && this.combineType === 0) {
              item.subNum = Number(item.subNum) + 1
              this.updateSubNum()
              return true
            } else {
              this.$message({
                type: 'warn',
                message: this.$t('同一个组合商品下面不允许存在相同的商品')
              })
              return false
            }
          }
          console.log(supplierCode)
          console.log(item.supplierCode)
          if (supplierCode != null && supplierCode !== item.supplierCode) {
            this.$message({
              type: 'warn',
              message: this.$t('请选择同一个供应商下面的商品')
            })
            return false
          }
        }
      }
      this.combineGroup.products.push({
        id: null,
        code: value.code,
        orderNum: null,
        combineGroupId: null,
        subMpId: value.refId,
        subNum: 1,
        salePriceWithTax: value.salePriceWithTax,
        chineseName: value.chineseName,
        subAddPrice: 0,
        supplierId: value.supplierId,
        supplierCode: value.supplierCode,
        supplierName: value.supplierName,
        isInnerSupplier: value.isInnerSupplier,
        warehouseType: value.warehouseType
      })
      this.updateSubNum()
      return true
    },
    toParentSupplier() {
      const supplierObj = {
        supplierId: null,
        supplierCode: null,
        supplierName: null,
        isInnerSupplier: null
      }
      this.combineGroup.products.forEach((item, index) => {
        supplierObj.supplierId = item.supplierId
        supplierObj.supplierCode = item.supplierCode
        supplierObj.supplierName = item.supplierName
        supplierObj.isInnerSupplier = item.isInnerSupplier
      })
      console.log(supplierObj)
      return supplierObj
    },
    preSubmit() {
      this.combineGroup.products.forEach((item, index) => {
        item.orderNum = index + 1
      })
    }
  }
}
</script>

<style scoped>
</style>

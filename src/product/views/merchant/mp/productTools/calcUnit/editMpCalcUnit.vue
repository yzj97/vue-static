<template>
  <ody-dialog
    :visible.sync="visible"
    :append-to-body="true"
    :title="mpName ? $t('编辑辅计量单位') : $t('新增辅计量单位')"
    width="680px"
    @open="init"
    @close="close"
  >
    <el-row v-if="mpName || mainUnit" style="margin-bottom: 16px">
      <el-col :span="12">{{ $t('商品名称') }}：{{ mpName }}</el-col>
      <el-col :span="12">{{ $t('主计量单位') }}：{{ mainUnit }}</el-col>
    </el-row>
    <el-table :data="tableData" name="tableData591" max-height="500px;" style="width: 100%;">
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <ody-tip-star :content="$t('辅计量单位')" style="line-height:23px" />
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.id">{{ scope.row.calculationUnitName }}</span>
          <el-select
            v-else
            v-model="scope.row.calculationUnitCode"
            name="scope_row_calculationUnitCode"
            size="small"
            @change="changeUnit(scope.row.calculationUnitCode, scope.$index)"
          >
            <el-option
              v-for="(item,index) in unitList"
              :key="index"
              :label="item.calculationUnitName"
              :value="item.calculationUnitCode"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <ody-tip-star :content="$t('转换率(辅对主)')" style="line-height:23px" />&nbsp;
          <el-tooltip class="item" placement="right-end">
            <div slot="content">
              {{ $t('说明') }}
              <br >
              {{ $t('举例：比如主计量单位是袋，辅计量单位是克，一袋对应100克，那么转换率填写0.01') }}
            </div>
            <i class="el-icon-warning-outline" style="vertical-align:super" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.rate"
            :precision="4"
            :step="0.0001"
            :max="99999999"
            :min="0.0001"
            :controls="false"
            name="scope_row_rate"
            size="small"
            style="width: 100%"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('操作')" width="90" class="required-class">
        <template slot-scope="scope">
          <el-link name="deleteRow" type="primary" @click="deleteRow(scope.row, scope.$index)">{{ $t('delete') }}</el-link>
        </template>
      </el-table-column>-->
    </el-table>
    <div style="margin-top: 20px">
      <el-button name="add" size="small" @click="add">{{ $t('添加') }}</el-button>
    </div>
    <span slot="footer">
      <el-button name="cancel" size="small" @click="cancel">{{ $t('取消') }}</el-button>
      <ody-button
        :disabled="emptyFlag && tableData.length<=0"
        name="CalcUnitSave_save"
        size="small"
        type="primary"
        code="CalcUnitSave"
        @click="save"
      >{{ $t('确定') }}</ody-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  name: 'EditMpCalcUnit',
  props: {
    visible: { type: Boolean, required: true, default: false },
    mpUnit: { type: Array, required: true, default: () => [] },
    mpName: { type: String, required: false, default: null },
    mainUnit: { type: String, required: false, default: null },
    mainUnitCode: { type: String, required: false, default: null },
    unitList: { type: Array, required: true, default: () => [] }
  },
  data() {
    return {
      tableData: [],
      emptyFlag: false
    }
  },
  methods: {
    changeUnit(unitCode, index) {
      const selected = JSON.parse(
        JSON.stringify(
          this.unitList.filter(it => it.calculationUnitCode === unitCode)[0]
        )
      )
      selected.unitId = selected.id
      selected.id = null
      selected.calculationUnitCode = unitCode
      selected.unitCode = unitCode
      selected.rate = 1
      this.tableData[index] = Object.assign(this.tableData[index], selected)
      this.$forceUpdate()
    },
    deleteRow(row, index) {
      this.tableData.splice(index, 1)
    },
    add() {
      this.tableData.push({
        rate: 1,
        calculationUnitCode: null,
        calculationUnitName: null
      })
    },
    cancel() {
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
      this.$forceUpdate()
    },
    init() {
      this.tableData = []
      const temp = JSON.parse(JSON.stringify(this.mpUnit))
      if (temp.length <= 0) {
        this.emptyFlag = true
      }
      this.tableData.push(...temp)
    },
    save() {
      if (this.tableData.filter(it => it.unitId == null).length > 0) {
        this.$message({
          showClose: true,
          message: this.$t('请选择辅计量单位'),
          type: 'waring'
        })
        return
      }
      if (
        this.tableData.filter(it => it.rate == null || it.rate === '').length >
        0
      ) {
        this.$message({
          showClose: true,
          message: this.$t('转换率不能为空'),
          type: 'waring'
        })
        return
      }
      this.$emit('save', this.tableData)
      // this.cancel()
    }
  }
}
</script>

<style scoped>
</style>

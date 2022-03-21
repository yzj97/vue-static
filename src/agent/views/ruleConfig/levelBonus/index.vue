<template>
  <section class="bonus">
    <div>
      <h4>{{ $t('附加奖励') }}</h4>
      <el-row>
        <el-col :span="labelColSpan">
          {{ $t('阶梯') + ':' }}
        </el-col>
        <el-col :span="2">
          <el-link name="addRow" class="underline" type="info" @click="addRow()">{{ $t('添加阶梯') }}</el-link>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in data[bonusLabel]" :key="index">
        <el-col :offset="labelColSpan">
          {{ $t('推广金额') + $t('满') }}
          <ody-input-number :controls="false" :decimal="2" :min="0" :max="maxAmount" v-model="item.targetValue" name="item_targetValue" size="mini"/>
          {{ $t('元') }}
          {{ ' ' + $t('increase') }}
          <ody-input-number :controls="false" :decimal="calcType === 1 ? 2 : 1" :min="0" :max="calcType === 1 ? maxAmount : 100" v-model="item.addValue" name="item_addValue" size="mini"/>{{ calcType === 1 ? $t('元') : '%' }}

          <el-link v-show="index > 0" name="deleteRow" class="underline" type="info" @click="deleteRow(index)">{{ $t('删除') }}</el-link>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bonusLabel: {
      type: String,
      default: ''
    },
    bonusType: {
      type: Number,
      default: 1
    },
    calcType: {
      type: 'Number',
      default: 1
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      labelColSpan: 2,
      maxAmount: 99999999
    }
  },
  mounted() {
    this.ruleApi = this.$agent.$api.rule
  },
  methods: {
    refresh() {
      this.$forceUpdate()
      this.$emit('update:data', this.data)
    },
    init() {
      try {
        if (!this.data[this.bonusLabel]) {
          this.data[this.bonusLabel] = []
        }
        if (this.data[this.bonusLabel].length === 0) {
          this.addRow()
        } else {
          this.$forceUpdate()
          this.$emit('update:data', this.data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    addRow() {
      try {
        if (this.data[this.bonusLabel].length === 3) {
          this.$message.info(this.$t('附加阶梯最多不超过3级'))
          return
        }
        this.data[this.bonusLabel].push({
          customerType: this.row.customerType,
          level: this.row.level,
          comType: this.data.comType,
          comLevel: this.data.comLevel,
          bonusType: this.bonusType,
          sort: this.data[this.bonusLabel].length,
          targetValue: null,
          addValue: null
        })
        this.$forceUpdate()
        this.$emit('update:data', this.data)
      } catch (e) {
        console.log(e)
      }
    },
    deleteRow(index) {
      try {
        this.data[this.bonusLabel].splice(index, 1)
        this.$forceUpdate()
        this.$emit('update:data', this.data)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="less" scoped>
div .bonus {
  border:1px solid #ccc;
  padding: 5px;
}
</style>

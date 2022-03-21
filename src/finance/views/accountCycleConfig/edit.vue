<template>
  <section>
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="200px" class="form">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('common_merchant_name')" prop="merchantName">
            <el-input v-show="type" v-model="editForm.merchantName" :placeholder="$t('common_choose_please')" :disabled="type==='view'|| type==='edit' ?true:false" name="editForm_merchantName" readonly="true"/>
            <el-input v-show="!type" v-model="editForm.merchantName" :placeholder="$t('common_choose_please')" name="editForm_merchantName7" readonly="true" @click.native="showMerchantSelectModal"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('cycle_current_fiscal_year')" prop="year">
            <el-select v-model="editForm.year" :placeholder="$t('common_choose_please')" :disabled="type==='view'?true:false" name="editForm_year" @change="switchYear">
              <el-option
                v-for="item in yearOptions"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('cycle_type')" prop="cycleType">
            <el-select v-model="editForm.cycleType" :disabled="(type==='edit'?true:false)||(type==='view'?true:false)" :placeholder="$t('common_choose_please')" name="editForm_cycleType">
              <el-option
                v-for="item in cycleTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('cycle_start_date')" prop="startDate">
            <el-date-picker
              v-model="editForm.startDate"
              :disabled="(editForm.cycleType === '1' || (editForm.cycleType === '2' && row != null) || row != null) ? true:false"
              name="editForm_startDate"
              format="yyyy-MM-dd"
              type="date"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('cycle_month_end_date')" prop="endDay">
            <el-select v-model="editForm.endDay" :placeholder="$t('common_choose_please')" :disabled="(editForm.cycleType === '1' ? true:false)||(type==='view'?true:false)" name="editForm_endDay">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item >
            <ody-button :disabled="type==='view'?true:false" name="FinanceAccountCycleConfigGenerate_handleGenerate" code="FinanceAccountCycleConfigGenerate" size="small" type="primary" @click="handleGenerate">{{ $t('common_generate') }}</ody-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="data"
          :columns="columns"
          :operates="operates"
          :checked.sync="checked"
          :can-filter="false"
          name="data455"/>
      </div>
    </ody-list-table-area>
    <div slot="btn" style="text-align: center;margin-top: 1%;">
      <ody-button :disabled="type==='view'?true:false" name="FinanceAccountCycleConfigSave_handleSearchSubmit" code="FinanceAccountCycleConfigSave" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_save') }}</ody-button>
      <el-button :disabled="type==='view'?true:false" name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
      <el-button name="returnBack" size="mini" type="primary" @click="returnBack">{{ $t('common_return') }}</el-button>
    </div>
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'

export default {
  name: 'FinanceAccountCycleConfigEdit',
  components: {
    MerchantSelectModal
  },
  data() {
    return {
      row: null,
      type: null,
      cycleType: null,
      startDate: null,
      checked: [],
      data: [],
      tempList: [],
      showMerchantModal: false,
      editForm: {
        merchantId: null,
        merchantCode: null,
        merchantName: null,
        year: null,
        cycleType: null,
        startDate: null,
        endDay: null
      },
      rules: {
        merchantName: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        year: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        cycleType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'year',
          label: this.$t('cycle_account_year'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'period',
          label: this.$t('cycle_account_period'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'startDate',
          label: this.$t('cycle_start_date'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.startDate) {
              return this.$portal.parseTime(row.startDate, '{y}-{m}-{d}')
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'endDate',
          label: this.$t('cycle_end_date'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.endDate) {
              return this.$portal.parseTime(row.endDate, '{y}-{m}-{d}')
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'quarter',
          label: this.$t('cycle_season'),
          align: 'center',
          minWidth: 200
        }
      ],
      options: [],
      yearOptions: [],
      cycleTypeOptions: [],
      item: {
        label: null,
        value: null
      }
    }
  },
  async mounted() {
    this.row = this.$route.query.row
    this.type = this.$route.query.type
    await this.init(this.row)
  },
  methods: {
    init(row) {
      const date = new Date()
      this.editForm.year = date.getFullYear()
      this.yearOptions.push({
        label: '请选择',
        value: ''
      })
      for (let i = 1; i <= 31; i++) {
        this.item.label = i
        this.item.value = i
        this.options.push(this.item)
        this.item = {}
      }
      this.$finance.$api.common.codeListMulti({ categories: ['ACCOUNTING_PERIOD_TYPE', 'CURRENT_FISCAL_YEAR'] }).then(res => {
        if (res.data) {
          this.cycleTypeOptions = res.data.ACCOUNTING_PERIOD_TYPE
          this.cycleTypeOptions.unshift({
            name: '请选择',
            value: ''
          })
          this.yearOptions = res.data.CURRENT_FISCAL_YEAR.sort((a, b) => Number(a.code) - Number(b.code))
          this.yearOptions.unshift({
            name: '请选择',
            value: ''
          })
        }
      })
      if (row !== null && row !== '') {
        // 初始化搜索框
        this.editForm.merchantName = row.merchantName
        this.editForm.cycleType = row.cycleType + ''
        const params = {
          filters: {
            cycleConfigId: row.id
          }
        }
        this.$finance.$api.accountCycle.accountCycleDetailList(params).then(res => {
          if (res.data && res.data.length > 0) {
            this.editForm.year = res.data[0].year
            this.editForm.startDate = res.data[0].startDate
            this.editForm.endDay = res.data[0].endDay
            this.data = res.data
          }
        })
      }
    },
    selectMerchant(result) {
      if (result) {
        this.editForm.merchantCode = result.merchantCode
        this.editForm.merchantId = result.merchantId
        this.editForm.merchantName = result.merchantName
      }
    },
    showMerchantSelectModal() {
      this.showMerchantModal = true
    },
    handleGenerate() {
      console.log('表单数据：' + JSON.stringify(this.data) + 'editForm:' + JSON.stringify(this.editForm))
      if (this.data.length > 0 && this.data[0].year + '' === this.editForm.year + '') {
        this.$alert(this.$t('invalid_cycle_year_same'), this.$t('prompt'))
        return
      }
      if (this.data.length > 0 && this.data[this.data.length - 1].year + '' === this.editForm.year + '') {
        this.$alert(this.$t('invalid_cycle_year_same'), this.$t('prompt'))
        return
      }
      if (this.editForm.cycleType === '2' && this.editForm.year + '' !== new Date(this.editForm.startDate).getFullYear() + '') {
        this.$alert(this.$t('invalid_cycle_year_compare'), this.$t('prompt'))
        return
      }
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          if (this.editForm.merchantName == null || this.editForm.merchantName === '') {
            this.$alert(this.$t('invalid_cycle_merchant_name'), this.$t('prompt'))
            return
          }
          if (this.editForm.year == null || this.editForm.year === '') {
            this.$alert(this.$t('invalid_cycle_year'), this.$t('prompt'))
            return
          }
          if (this.editForm.cycleType == null || this.editForm.cycleType === '') {
            this.$alert(this.$t('invalid_cycle_cycleType'), this.$t('prompt'))
            return
          }
          if (this.editForm.cycleType === '2' && this.editForm.startDate == null || this.editForm.startDate === '') {
            this.$alert(this.$t('invalid_cycle_startDate'), this.$t('prompt'))
            return
          }
          this.$finance.$api.accountCycle.generateList(this.editForm).then(res => {
            const catArray = this.data.concat(res.data)
            this.data = catArray
          })
        }
      })
    },
    handleSearchReset() {
      if (this.row != null) {
        const params = {
          filters: {
            cycleConfigId: this.row.id
          }
        }
        this.$finance.$api.accountCycle.accountCycleDetailList(params).then(res => {
          if (res.data && res.data.length > 0) {
            this.data = res.data
          } else {
            this.data = []
          }
        })
      } else {
        this.data = []
      }
    },
    handleSearchSubmit() {
      if (this.editForm.merchantName == null || this.editForm.merchantName === '') {
        this.$alert(this.$t('invalid_cycle_merchant_name'), this.$t('prompt'))
        return
      }
      if (this.editForm.year == null || this.editForm.year === '') {
        this.$alert(this.$t('invalid_cycle_year'), this.$t('prompt'))
        return
      }
      if (this.editForm.cycleType == null || this.editForm.cycleType === '') {
        this.$alert(this.$t('invalid_cycle_cycleType'), this.$t('prompt'))
        return
      }
      if (this.editForm.cycleType === '2' && this.editForm.startDate == null || this.editForm.startDate === '') {
        this.$alert(this.$t('invalid_cycle_startDate'), this.$t('prompt'))
        return
      }
      this.editForm.list = this.data
      if (this.row != null) {
        this.editForm.merchantId = this.row.merchantId
        this.editForm.merchantCode = this.row.merchantCode
        this.editForm.merchantName = this.row.merchantName
        this.editForm.id = this.row.id
      }
      // 新增和修改
      const accountCycle = this.$finance.$api.accountCycle
      if (this.row != null) {
        accountCycle.updateAccountCycle(this.editForm).then((result) => {
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_update_success')
            })
            this.$router.push({ name: 'FinanceAccountCycleConfig' })
            this.$portal.delActiveView()
          }
        })
      } else {
        accountCycle.saveAccountCycle(this.editForm).then((result) => {
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_add_success')
            })
            this.$router.push({ name: 'FinanceAccountCycleConfig' })
            this.$portal.delActiveView()
          }
        })
      }
    },
    returnBack() {
      this.$router.push({ name: 'FinanceAccountCycleConfig' })
      this.$portal.delActiveView()
    },
    switchYear(val) {
      if (this.editForm.cycleType === '1') {
        const date = new Date(val, 0, 1)
        this.editForm.startDate = date
      } else {
        if (this.data.length <= 13) {
          const date = new Date(this.data[this.data.length - 1].endDate)
          date.setDate(date.getDate() + 1)
          this.editForm.startDate = date
        } else {
          const maxYear = this.data[0].year
          let idx
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].year !== maxYear) {
              idx = i - 1
              break
            }
          }
          const date = new Date(this.data[idx].endDate)
          date.setDate(date.getDate() + 1)
          this.editForm.startDate = date
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <ody-dialog
    :title="$t('编辑规则设置')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="960px"
    @open="init">
    <el-form ref="sortRuleDetailForm" :model="sortRuleDetailForm">
      <el-form-item :label="$t('排序因子编号')" label-width="120px">
        <el-input v-model="sortRuleDetailForm.rankCode" name="sortRuleDetailForm_rankCode" disabled="true"/>
      </el-form-item>
      <el-form-item :label="$t('排序因子名称')" label-width="120px">
        <el-input v-model="sortRuleDetailForm.rankName" name="sortRuleDetailForm_rankName" disabled="true"/>
      </el-form-item>
      <el-form-item v-if="isTable === 0" :label="$t('分值')" class="is-required" label-width="120px">
        <div v-for="item in sortRuleDetailForm.ruleValueList" :key="item.key" style="padding-bottom: 10px">
          <div style="width: 100px;float: left"><span style="width: 200px">{{ item.name }}</span></div>
          <div>
            <ody-input-number
              v-model="item.score"
              :min="0"
              :max="9999"
              :placeholder="$t('请输入0到9999的正整数')"
              name="item_score"/>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="isTable !== 0" :label="$t('分值')" class="is-required" label-width="120px">
        <ody-list-table-area>
          <div slot="btn">
            <el-button v-if="sortRuleDetailForm.ruleValueList.length <= 4" name="handleAddColumn" type="primary" size="small" @click="handleAddColumn">{{ $t('增加行') }}</el-button>
          </div>
          <div slot="table">
            <el-table
              :data="sortRuleDetailForm.ruleValueList"
              name="sortRuleDetailForm_ruleValueList063"
            >
              <el-table-column v-if="showTime" :label="$t('时间段')" align="center" prop="ext" width="160">
                <template slot-scope="scope" >
                  <el-select v-model="scope.row.ext" :clearable="false" :placeholder="$t('请选择')" name="scope_row_ext" style="width: 100px;float: left;margin-left: 5px">
                    <el-option
                      v-for="item in times"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column v-if="sortRuleDetailForm.rankCode === 'new_product'" :label="$t('首次上架天数自')" align="center" prop="from">
                <template slot-scope="scope" >
                  <ody-input-number v-model="scope.row.from" :min="1" :max="9999" name="scope_row_from" size="mini"/>
                </template>
              </el-table-column>
              <el-table-column v-if="sortRuleDetailForm.rankCode === 'new_product'" :label="$t('首次上架天数至')" align="center" prop="to">
                <template slot-scope="scope" >
                  <ody-input-number v-model="scope.row.to" :min="1" :max="9999" name="scope_row_to" size="mini"/>
                </template>
              </el-table-column>
              <el-table-column v-if="sortRuleDetailForm.rankCode === 'sales'" :label="$t('销量自')" align="center" prop="from">
                <template slot-scope="scope" >
                  <ody-input-number v-model="scope.row.from" :min="1" :max="999999" name="scope_row_from7" size="mini"/>
                </template>
              </el-table-column>
              <el-table-column v-if="sortRuleDetailForm.rankCode === 'sales'" :label="$t('销量至')" align="center" prop="to">
                <template slot-scope="scope" >
                  <ody-input-number v-model="scope.row.to" :min="1" :max="999999" name="scope_row_to1" size="mini"/>
                </template>
              </el-table-column>
              <el-table-column v-if="sortRuleDetailForm.rankCode === 'praise_rate'" :label="$t('好评率自')" align="center" prop="from">
                <template slot-scope="scope" >
                  <ody-input-number v-model="scope.row.from" :min="1" :max="99" name="scope_row_from8" size="mini"/>%
                </template>
              </el-table-column>
              <el-table-column v-if="sortRuleDetailForm.rankCode === 'praise_rate'" :label="$t('好评率至')" align="center" prop="to">
                <template slot-scope="scope" >
                  <ody-input-number v-model="scope.row.to" :min="1" :max="100" name="scope_row_to2" size="mini"/>%
                </template>
              </el-table-column>
              <el-table-column :label="$t('分值')" align="center" prop="score">
                <template slot-scope="scope" >
                  <ody-input-number v-model="scope.row.score" :min="0" :max="9999" name="scope_row_score" size="mini"/>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('操作')"
                fixed="right"
                width="100">
                <template slot-scope="scope">
                  <el-button v-if="sortRuleDetailForm.ruleValueList.length > 1" name="handleDelete" size="small" type="text" @click="handleDelete(scope.$index)">{{ $t('删除') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ody-list-table-area>
      </el-form-item>
      <el-form-item :label="$t('备注')" label-width="120px">
        <el-input v-model="sortRuleDetailForm.note" :autosize="{ minRows: 2, maxRows: 4}" name="sortRuleDetailForm_note" type="textarea" maxlength="500" show-word-limit/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('关闭') }}</el-button>
      <el-button name="handleSubmit" size="small" type="primary" @click="handleSubmit">{{ $t('确定') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      times: [],
      isTable: false,
      showTime: false,
      checked: [],
      loading: false,
      sortRuleDetailForm: {
        rankCode: '',
        rankName: '',
        ruleValueList: [],
        note: ''
      }
    }
  },
  methods: {
    init() {
      this.initCode()
      this.sortRuleDetailForm = this.$portal.deepClone(this.comment)
      this.sortRuleDetailForm.ruleValueList.forEach(item => {
        if (item.ext) {
          this.showTime = true
        } else {
          this.showTime = false
        }
      })
      if (this.sortRuleDetailForm.rankCode === 'picture' || this.sortRuleDetailForm.rankCode === 'stock' ||
        this.sortRuleDetailForm.rankCode === 'text_correlation' || this.sortRuleDetailForm.rankCode === 'promotions') {
        this.isTable = 0
      } else {
        this.isTable = 1
      }
    },
    initCode() {
      this.$social.$api.common.listMultiCode({
        categories: [
          'TIME_QUANTUM'
        ]
      }).then(res => {
        this.times = res.data.TIME_QUANTUM
      })
    },
    handleBack() {
      this.$emit('update:visible', !this.visible)
    },
    handleAddColumn() {
      const lastLine = this.sortRuleDetailForm.ruleValueList[this.sortRuleDetailForm.ruleValueList.length - 1]
      const param = {
        key: lastLine.key,
        score: '',
        name: lastLine.name,
        ext: lastLine.ext,
        from: '',
        to: ''
      }
      this.sortRuleDetailForm.ruleValueList.push(param)
    },
    handleSubmit() {
      const result = this.checkTable()
      if (result) {
        this.$emit('ok', this.sortRuleDetailForm)
        this.$emit('update:visible', !this.visible)
      }
    },
    checkTable() {
      if (this.isTable) {
        const list = this.sortRuleDetailForm.ruleValueList
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (!item.score || !item.from || !item.to) {
            this.$message.error(this.$t('第') + (i + 1) + this.$t('行') + this.$t('请输入'))
            return false
          }
          if (item.from >= item.to) {
            this.$message.error(item.name + this.$t('自要小于') + item.name + this.$t('至'))
            return false
          }

          if (this.sortRuleDetailForm.rankCode === 'new_product' || this.sortRuleDetailForm.rankCode === 'sales') {
            if (list.length > (i + 1)) {
              const nextItem = list[i + 1]
              if (nextItem.from <= item.to) {
                this.$message.error(this.$t('下列') + item.name + this.$t('自要大于上列') + item.name + this.$t('至'))
                return false
              }
            }
          } else if (this.sortRuleDetailForm.rankCode === 'praise_rate') {
            if (list.length > (i + 1)) {
              const nextItem = list[i + 1]
              if (nextItem.to >= item.from) {
                this.$message.error(this.$t('下列') + item.name + this.$t('至要小于上列') + item.name + this.$t('自'))
                return false
              }
            }
          }
        }
      }
      return true
    },
    handleDelete(index) {
      this.sortRuleDetailForm.ruleValueList.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>

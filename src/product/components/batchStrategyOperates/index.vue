<template>
  <section>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('批次策略模板') }}</span>
      </div>
      <el-form ref="form" :model="edit" :rules="rules" label-width="150px" class="form">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('商家') + '：'" prop="merchantId">
              <ody-merchant-select ref="merchantId" :disabled="readonly || update" v-model="edit.merchantId" value-key="merchantId" name="merchantId"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('批次策略名称') + '：'" prop="batchStrategyName">
              <el-input
                ref="batchStrategyName"
                v-model="edit.batchStrategyName"
                :disabled="readonly"
                :placeholder="$t('请输入') + ' ' + $t('批次策略名称')"
                name="batchStrategyName"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('备注') + '：'" prop="remark">
              <el-input
                ref="remark"
                v-model="edit.remark"
                :disabled="readonly"
                :rows="2"
                :placeholder="$t('请输入') + ' ' + $t('备注')"
                name="remark"
                type="textarea"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('批次属性') }}</span>
      </div>
      <ody-list-table-area>
        <div slot="btn">
          <ody-button
            v-show="!readonly"
            name="BatchStrategyAttrs_add"
            code="BatchStrategyAttrs_add"
            size="small"
            type="primary"
            @click="addAttrs()"
          >{{ $t('添加属性') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            v-loading="loading"
            :data="edit.batchAttrs"
            :columns="columns"
            :operates="operates"
            name="batchStrategyTable">
            <template slot="required" slot-scope="scope">
              <el-checkbox :disabled="readonly" v-model="scope.row.required"/>
            </template>
          </ody-table>
        </div>
      </ody-list-table-area>
    </el-card>
    <el-card class="box-card">
      <el-row type="flex" justify="center" style="margin-top: 10px">
        <el-button name="back" size="small" @click="back">{{ $t('返回') }}</el-button>
        <ody-button v-loading="saving" v-permission="['BatchStrategy_add', 'BatchStrategy_update']" v-show="!readonly" name="BatchStrategy_save" code="ui" size="small" type="primary" @click="save">{{ $t('保存') }}</ody-button>
      </el-row>
    </el-card>
    <ody-dialog
      :visible.sync="attrsDialog"
      :close-on-click-modal="false"
      :title="$t('批次属性')"
      width="800px">
      <el-tabs v-model="attrs.default" @tab-click="switchTab">
        <el-tab-pane :label="$t('新建属性')" name="0">
          <el-form ref="attrsNewForm" :model="attrs" :rules="attrsRules" label-width="80px">
            <el-form-item :label="$t('属性名称')" prop="name">
              <el-col :span="8">
                <el-input v-model="attrs.name" :placeholder="$t('请输入') + ' ' + $t('属性名称')" maxlength="10" show-word-limit/>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('录入方式')">
              <el-radio-group v-model="attrs.type">
                <el-radio label="1">{{ $t('列表选择') }}</el-radio>
                <el-radio label="2">{{ $t('手工输入') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="attrs.type === '1'" :label="$t('属性值')">
              <el-col :span="8">
                <el-input v-model="attrs.value" :placeholder="$t('请输入') + ' ' + $t('属性值')" maxlength="10" show-word-limit/>
              </el-col>
              <el-col :span="6" style="margin-left: 10px">
                <ody-button code="ui" size="small" type="default" @click="addValue">+ {{ $t('添加') }}</ody-button>
              </el-col>
            </el-form-item>
            <el-form-item v-if="attrs.type === '1'">
              <el-tag v-for="(value, index) in attrs.selectValues" :key="index" size="large" effect="light" closable style="margin-right: 10px" @close="deleteValue(index)">
                {{ value }}
              </el-tag>
            </el-form-item>
            <el-form-item v-if="attrs.type === '2'" :label="$t('格式')">
              <el-radio-group v-model="attrs.subType">
                <el-radio label="1">{{ $t('文本') }}</el-radio>
                <el-radio label="2">{{ $t('数值') }}</el-radio>
                <el-radio label="3">{{ $t('日期') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('备注')">
              <el-input v-model="attrs.remark" :placeholder="$t('请输入') + ' ' + $t('备注')" type="textarea" row="2" maxlength="100" show-word-limit/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('选择默认属性')" name="1">
          <el-form ref="attrsDefaultForm" :model="attrs" :rules="attrsRules" label-width="80px">
            <el-form-item :label="$t('属性名称')" prop="type">
              <el-col :span="6">
                <el-select v-model="attrs.type">
                  <el-option key="3" :label="$t('商品效期')" value="3"/>
                  <el-option key="4" :label="$t('有效期至')" value="4"/>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item v-if="attrs.type === '3'" :label="$t('商品效期')" prop="unit">
              <el-col :span="6">
                <el-input :placeholder="$t('生产日期')" disabled/>
              </el-col>
              <el-col :span="6" style="margin-left: 10px">
                <el-input :placeholder="$t('保质期')" disabled/>
              </el-col>
              <el-col :span="4" style="margin-left: 10px">
                <el-select v-model="attrs.unit">
                  <el-option key="月" :label="$t('月')" value="月"/>
                  <el-option key="天" :label="$t('天')" value="天"/>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item v-if="attrs.type === '4'" :label="$t('有效期至')">
              <el-col :span="6">
                <el-input :placeholder="$t('有效期')" disabled/>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('备注')">
              <el-input v-model="attrs.remark" :placeholder="$t('请输入') + ' ' + $t('备注')" type="textarea" row="2" maxlength="100" show-word-limit/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <ody-button code="ui" size="small" type="default" @click="cancelAttrs">{{ $t('取消') }}</ody-button>
        <ody-button code="ui" size="small" type="primary" @click="saveAttrs">{{ $t('确认') }}</ody-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'BatchStrategyOperates',
  data() {
    return {
      saving: false,
      readonly: false,
      update: false,
      edit: this.initData(),
      rules: {
        merchantId: [
          { required: true, message: this.$t('请选择商家'), trigger: ['blur', 'change'] }
        ],
        batchStrategyName: [
          { required: true, message: this.$t('请输入') + ' ' + this.$t('批次策略名称'), trigger: ['blur', 'change'] }
        ]
      },
      columns: [
        {
          label: this.$t('属性名称'),
          prop: 'name',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('必填'),
          slot: 'required',
          align: 'center',
          show: true,
          minWidth: 60
        },
        {
          label: this.$t('格式'),
          prop: 'inputType',
          align: 'center',
          show: true,
          minWidth: 60,
          formatter: (row, column, cellValue) => {
            if (row.inputType) {
              return this.translate(row.inputType)
            }
          }
        },
        {
          label: this.$t('属性值'),
          prop: 'selectValues',
          align: 'center',
          show: true,
          formatter: (row, column, cellValue) => {
            if (row.selectValues) {
              return row.selectValues.join('；')
            }
          }
        },
        {
          label: this.$t('备注'),
          prop: 'remark',
          align: 'center',
          show: true
        }
      ],
      operates: {
        fixed: 'right',
        width: 120,
        align: 'center',
        list: [
          {
            label: this.$t('编辑'),
            code: 'BatchStrategyAttrs_update',
            hidden: (index, row) => {
              return this.readonly
            },
            method: (index, row) => {
              this.addAttrs(row, index)
            }
          },
          {
            label: this.$t('删除'),
            code: 'BatchStrategyAttrs_delete',
            hidden: (index, row) => {
              return this.readonly
            },
            method: (index, row) => {
              this.$confirm(this.$t('确定要删除这行属性吗'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.edit.batchAttrs.splice(index, 1)
              }).catch(() => {})
            }
          }
        ]
      },
      attrs: this.initAttrs(),
      attrsCopy: null,
      attrsRules: {
        name: [
          { required: true, message: this.$t('请输入属性名称'), trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: this.$t('请选择属性名称'), trigger: ['blur', 'change'] }
        ],
        unit: [
          { required: true, message: this.$t('请选择商品效期单位'), trigger: ['blur', 'change'] }
        ]
      },
      attrsDialog: false,
      attrsUpdateIndex: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.readonly = this.$route.params.operate === 'detail'
      this.update = this.$route.params.operate === 'edit'
      if (this.$route.params.id) {
        this.saving = true
        const res = await this.$product.$api.batchStrategyApi.get({ id: this.$route.params.id })
        this.saving = false
        this.edit = res.data
      } else {
        this.edit = this.initData()
      }
    },
    initData() {
      return {
        merchantId: null,
        batchStrategyName: null,
        remark: null,
        batchAttrs: [],
        id: null
      }
    },
    translate(inputType) {
      if (inputType) {
        const formatSet = {
          'list': this.$t('选择'),
          'text': this.$t('文本'),
          'number': this.$t('数值'),
          'date': this.$t('日期'),
          'mp_date': this.$t('默认'),
          'to_date': this.$t('默认')
        }
        return formatSet[inputType] || ''
      }
    },
    construct() {
      const item = { ...this.attrs }
      const type = item.type
      const subType = item.subType
      let inputType = ''
      if (type === '1') {
        inputType = 'list'
        item.subType = '1'
      } else if (type === '2') {
        if (subType === '1') {
          inputType = 'text'
        } else if (subType === '2') {
          inputType = 'number'
        } else if (subType === '3') {
          inputType = 'date'
        }
        item.selectValues = []
      } else if (type === '3') {
        item.name = '商品效期'
        item.subType = '1'
        item.selectValues = []
        inputType = 'mp_date'
      } else if (type === '4') {
        item.name = '有效期至'
        item.subType = '1'
        item.selectValues = []
        inputType = 'to_date'
      }
      item.inputType = inputType
      delete item.value
      return item
    },
    switchTab(tab) {
      if (tab.index === '0') {
        if (this.attrsCopy && this.attrsCopy.default === '0') {
          this.attrs = { ...this.attrsCopy }
        } else {
          this.attrs = this.initAttrs({ default: '0', type: '1' })
        }
      } else if (tab.index === '1') {
        if (this.attrsCopy && this.attrsCopy.default === '1') {
          this.attrs = { ...this.attrsCopy }
        } else {
          this.attrs = this.initAttrs({ default: '1', type: '3' })
        }
      }
    },
    initAttrs(args) {
      return {
        name: null,
        required: true,
        default: '0',
        type: '1',
        subType: '1',
        inputType: null,
        unit: '月',
        value: null,
        selectValues: [],
        remark: null,
        ...args }
    },
    addAttrs(data, index) {
      if (data) {
        this.attrs = { ...data }
        this.attrsCopy = { ...data }
      } else {
        this.attrs = this.initAttrs()
        this.attrsCopy = null
      }
      this.attrsDialog = true
      this.attrsUpdateIndex = index
    },
    cancelAttrs() {
      this.attrsDialog = false
    },
    saveAttrs() {
      const form = this.attrs.default === '1' ? this.$refs.attrsDefaultForm : this.$refs.attrsNewForm
      debugger
      form.validate((valid) => {
        if (valid) {
          const item = this.construct()
          const findDefaultIndex = this.edit.batchAttrs.findIndex(x => x.default === '1')
          if (findDefaultIndex > -1 && findDefaultIndex !== this.attrsUpdateIndex && item.default === '1') {
            this.$message({
              type: 'warning',
              message: this.$t('商品效期、有效期至在一个批次模板中只能选择一个')
            })
            return
          }
          const findNameIndex = this.edit.batchAttrs.findIndex(x => x.name === item.name)
          if (findNameIndex > -1 && findNameIndex !== this.attrsUpdateIndex) {
            this.$message({
              type: 'warning',
              message: this.$t('同一个批次模板中属性名称不能重复')
            })
            return
          }
          if (Number.isInteger(this.attrsUpdateIndex)) {
            this.edit.batchAttrs.splice(this.attrsUpdateIndex, 1, item)
          } else {
            this.edit.batchAttrs.push(item)
          }
          this.cancelAttrs()
        }
      })
    },
    addValue() {
      if (this.attrs.value) {
        if (this.attrs.selectValues.findIndex(v => v === this.attrs.value) > -1) {
          this.$message({
            type: 'warning',
            message: this.$t('属性值不能重复')
          })
          return
        }
        this.attrs.selectValues.push(this.attrs.value)
        this.attrs.value = null
      }
    },
    deleteValue(index) {
      this.attrs.selectValues.splice(index, 1)
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saving = true
          const args = { ...this.edit }
          args.batchAttrs = JSON.stringify(args.batchAttrs)
          this.$product.$api.batchStrategyApi.saveOrUpdate(args).then((res) => {
            this.saving = false
            if (res && res.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('保存成功')
              })
              this.back()
            } else {
              this.$message({
                type: 'error',
                message: this.$t('保存失败')
              })
            }
          }, (res) => {
            this.saving = false
          })
        }
      })
    },
    back() {
      this.$portal.delActiveViewAndRefresh()
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin-bottom: 8px;
  }
</style>

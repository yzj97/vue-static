<template>
  <section>
    <ody-list-table-area>
      <div slot="btn">
        <AddField :main-fields="mainFields" :rel-table-data="relTableData" :field-table-data.sync="fieldTableData"/>
        <el-button name="reset" size="small" type="primary" @click="reset">重置字段</el-button>
        <el-button name="removeCommonFields" code="ui" size="small" type="primary" @click="removeCommonFields">去掉公共字段</el-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="fieldTableData"
          :columns="tableFormColumns"
          :operates="operates"
          :can-filter="false"
          :drag="true"
          name="fieldTableData465"
          row-key="prop"
        >
          <template slot="relName" slot-scope="scope">
            <el-form-item label-width="0">
              <el-input v-model="scope.row.relName" name="scope_row_relName" />
            </el-form-item>
          </template>
          <template slot="label" slot-scope="scope">
            <el-form-item label-width="0">
              <el-input v-model="scope.row.title" name="scope_row_title" />
            </el-form-item>
          </template>
          <template slot="searchTag" slot-scope="scope">
            <el-form-item label-width="0">
              <el-input v-model="scope.row.tagAttributes" :readonly="true" name="scope_row_tagAttributes" placeholder="查询控件属性" class="input-with-select">
                <el-select slot="prepend" v-model="scope.row.tag" :clearable="true" name="scope_row_tag" @change="onSearchTagChange(scope.row)" @clear="onTagClear(scope.row)">
                  <el-option
                    v-for="item in componentSearchTypeOptions"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code"
                  />
                </el-select>
                <el-button
                  slot="append"
                  name="openAttrEditDialog"
                  size="mini"
                  icon="el-icon-edit"
                  @click="openAttrEditDialog(scope.row, scope.$index)"/>
              </el-input>
            </el-form-item>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <ody-dialog :visible.sync="showAttrEditDialog" :append-to-body="true" :title="fieldTableData[editRowIndex] != null ? fieldTableData[editRowIndex].title : '' + '属性编辑'" width="550px">
      <div>
        <el-button
          name="attrEditItems_push"
          size="mini"
          icon="el-icon-plus"
          @click="attrEditItems.push([])"/>
      </div>
      <el-form ref="attrEditForm" label-width="0px">
        <el-form-item
          v-for="(item, index) in attrEditItems"
          :key="item.key"
        >
          <el-input v-model="attrEditItems[index].value" name="attrEditItems_index__value" class="attr-edit-input">
            <div slot="prepend">
              键:
              <el-input :disabled="attrEditItems[index].disabled" v-model="attrEditItems[index].key" name="attrEditItems_index__key" style="width:80px;padding:0;margin:0"/>
              值:
            </div>
            <el-button
              v-if="!attrEditItems[index].disabled"
              slot="append"
              name="attrEditItems_splice"
              size="mini"
              icon="el-icon-delete"
              @click="attrEditItems.splice(index)"/>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top" />
        <ody-button name="ui_showAttrEditDialog" code="ui" size="small" @click="showAttrEditDialog = false">取 消</ody-button>
        <ody-button name="ui_onAttrEditClose" code="ui" size="small" type="primary" @click="onAttrEditClose">确 定</ody-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
import AddField from './add-field'
export default {
  name: 'FieldList',
  components: { AddField },
  props: {
    loading: { type: Boolean, default: false },
    pool: { type: String, default: 'default' },
    mainFields: { type: Array, default: function() { return [] } },
    relTableData: { type: Array, default: function() { return [] } },
    fieldTableData: { type: Array, default: function() { return [] } }
  },
  data() {
    return {
      dataSource: [
        {
          code: 1,
          label: '字典'
        }
      ],
      showAttrEditDialog: false,
      editTagOption: null,
      editRowIndex: null,
      editRow: null,
      attrEditItems: [],
      componentSearchTypeOptions: [
        {
          code: 'el-input',
          label: 'el-input'
        }, {
          code: 'ody-input-number',
          label: 'ody-input-number'
        }, {
          code: 'ody-date-range-picker',
          label: 'ody-date-range-picker',
          attributes: {
            ':range-separator': "$t(\'至\')",
            type: 'datetimer'
          }
        }, {
          code: 'ody-supplier-select',
          label: 'ody-supplier-select'
        }, {
          code: 'ody-supplier-choose',
          label: 'ody-supplier-choose'
        }, {
          code: 'ody-merchant-select',
          label: 'ody-merchant-select',
          attributes: {
            'value-key': 'merchantId'
          }
        }, {
          code: 'ody-store-select',
          label: 'ody-store-select',
          attributes: {
            'value-key': 'storeId'
          }
        }, {
          code: 'ody-product-merchant-choose',
          label: 'ody-product-merchant-choose',
          attributes: {
            ':multiple': 'false',
            'label-key': 'chineseName',
            'value-key': 'id'
          }
        }, {
          code: 'ody-product-store-choose',
          label: 'ody-product-store-choose',
          attributes: {
            ':multiple': 'false',
            'label-key': 'chineseName',
            'value-key': 'id'
          }
        }, {
          code: 'ody-dict-select',
          label: 'ody-dict-select',
          attributes: {
            ':is-number': false,
            'pool': this.pool,
            category: ''
          },
          beforeAttrEdit: (row, attrs) => {
            if (row.dataSourceKey) {
              attrs.category = row.dataSourceKey
            }
          },
          afterAttrEdit: (row, option) => {
            row.dataSourceType = 'code'
            const attrs = JSON.parse(row.tagAttributes)
            row.dataSourceKey = attrs['category']
          }
        }, {
          code: 'ody-brand-select',
          label: 'ody-brand-select'
        }, {
          code: 'ody-channel-select',
          label: 'ody-channel-select'
        }, {
          code: 'ody-category-tree-select',
          label: 'ody-category-tree-select'
        }, {
          code: 'ody-organization-select',
          label: 'ody-organization-select',
          attributes: {
            'entity-type': 'CUSTOMER'
          }
        }, {
          code: 'ody-member-select',
          label: 'ody-member-select',
          attributes: {
            'label-key': 'nickname',
            'value-key': 'id'
          }
        }, {
          code: 'promotion-type-select',
          label: 'promotion-type-select'
        }, {
          code: 'ody-province-city-region-select',
          label: 'ody-province-city-region-select'
        }
      ],
      tableFormColumns: [
        {
          label: this.$t('模型'),
          prop: 'modelName',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('列名'),
          prop: 'column',
          show: true,
          fixed: true,
          tooltip: false,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('原始字段名'),
          prop: 'name',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('使用字段名'),
          slot: 'relName',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 150
        },
        {
          label: this.$t('显示名'),
          slot: 'label',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 180
        },
        {
          label: this.$t('查询控件'),
          slot: 'searchTag',
          show: true,
          align: 'center',
          minWidth: 500
        }
      ],
      operates: {
        'width': 120,
        'fixed': 'right',
        'list': [
          {
            'label': '同步',
            show: true,
            code: 'ui',
            'disabled': false,
            method: (index, row) => {
              this.$emit('syncFieldInfo', row)
            }
          },
          {
            'label': '删除',
            show: true,
            code: 'ui',
            'disabled': false,
            method: (index, row) => {
              this.fieldTableData.splice(index, 1)
              this.$emit('update:fieldTableData', this.fieldTableData)
            }
          }
        ]
      }
    }
  },
  async mounted() {

  },
  methods: {
    async reset() {
      const confirm = await this.$confirm(
        this.$t('是否重置字段'),
      )
      if (confirm) {
        this.$emit('reset')
      }
    },
    removeCommonFields() {
      this.fieldTableData = this.fieldTableData.filter(item => !item.common)
      this.$emit('update:fieldTableData', this.fieldTableData)
    },
    onSearchTagChange(row) {
      const item = this.componentSearchTypeOptions.find(item => item.code === row.tag)
      if (item) {
        const editAttrs = Object.assign({}, item.attributes)
        if (item.beforeAttrEdit) {
          item.beforeAttrEdit(row, editAttrs)
        }
        row.tagAttributes = JSON.stringify(editAttrs)
      } else {
        row.tagAttributes = null
      }
    },
    onTagClear(row) {
      row.tagAttributes = null
    },
    openAttrEditDialog(row, index) {
      const option = this.componentSearchTypeOptions.find(item => item.code === row.tag)
      if (!option) {
        return
      }
      let tagAttributes = {}
      if (row.tagAttributes) {
        try {
          tagAttributes = JSON.parse(row.tagAttributes)
        } catch (e) {
          console.log(e)
        }
      }
      const editAttrs = Object.assign({}, option.attributes, tagAttributes)
      this.attrEditItems = []
      for (var p in editAttrs) {
        this.attrEditItems.push({ key: p, value: editAttrs[p], disabled: option.attributes.hasOwnProperty(p) })
      }
      this.editRowIndex = index
      this.editRow = row
      this.editTagOption = option
      this.showAttrEditDialog = true
    },
    onAttrEditClose() {
      const attrs = {}
      this.attrEditItems.forEach(item => {
        if (item.key) {
          attrs[item.key] = item.value
        }
      })
      const row = this.fieldTableData[this.editRowIndex]
      if (Object.keys(attrs).length > 0) {
        row.tagAttributes = JSON.stringify(attrs)
        this.$set(this.fieldTableData, this.editRowIndex, row)
        this.editRow.tagAttributes = JSON.stringify(attrs)
        this.$forceUpdate()
      }
      if (this.editTagOption.afterAttrEdit) {
        this.editTagOption.afterAttrEdit(row, this.editTagOption)
      }
      this.showAttrEditDialog = false
    }
  }
}
</script>

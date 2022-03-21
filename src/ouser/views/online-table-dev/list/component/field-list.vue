<template>
  <div>
    <ody-table
      v-loading="loading"
      :data="fieldTableData"
      :columns="tableFormColumns"
      :can-filter="false"
      :drag="true"
      name="fieldTableData452"
      row-key="prop"
    >
      <template slot="label" slot-scope="scope">
        <el-form-item label-width="0">
          <el-input v-model="scope.row.title" name="scope_row_title" />
        </el-form-item>
      </template>
      <template slot="searchShow" slot-scope="scope">
        <el-form-item label-width="0">
          <el-checkbox v-model="scope.row.search.show" name="scope_row_search_show" />
        </el-form-item>
      </template>
      <template slot="tableShow" slot-scope="scope">
        <el-form-item label-width="0">
          <el-checkbox v-model="scope.row.table.show" name="scope_row_table_show" />
        </el-form-item>
      </template>
      <template slot="editShow" slot-scope="scope">
        <el-form-item label-width="0">
          <el-checkbox v-model="scope.row.edit.show" name="scope_row_edit_show" />
        </el-form-item>
      </template>
      <template slot="importable" slot-scope="scope">
        <el-form-item label-width="0">
          <el-checkbox v-model="scope.row.importable" name="scope_row_importable" />
        </el-form-item>

      </template>
      <template slot="exportable" slot-scope="scope">
        <el-form-item label-width="0">
          <el-checkbox v-model="scope.row.exportable" name="scope_row_exportable" />
        </el-form-item>
      </template>
      <template slot="readonly" slot-scope="scope">
        <el-form-item label-width="0">
          <el-checkbox v-model="scope.row.edit.readonly" name="scope_row_edit_readonly" />
        </el-form-item>
      </template>
      <template slot="editRequired" slot-scope="scope">
        <el-form-item label-width="0">
          <el-checkbox v-model="scope.row.edit.required" name="scope_row_edit_required" />
        </el-form-item>
      </template>
      <template slot="searchTag" slot-scope="scope">
        <el-form-item label-width="0">
          <el-input v-model="scope.row.search.tagAttributes" :readonly="true" name="scope_row_search_tagAttributes" placeholder="查询控件属性" class="input-with-select">
            <el-select slot="prepend" v-model="scope.row.search.tag" :clearable="true" name="scope_row_search_tag" @change="onSearchTagChange(scope.row)">
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
              @click="openAttrEditDialog(scope.row, scope.row.search)"/>
          </el-input>
        </el-form-item>
      </template>
      <template slot="editTag" slot-scope="scope">
        <el-form-item label-width="0">
          <el-input v-model="scope.row.edit.tagAttributes" :readonly="true" name="scope_row_edit_tagAttributes" placeholder="编辑控件属性" class="input-with-select">
            <el-select slot="prepend" v-model="scope.row.edit.tag" :clearable="true" name="scope_row_edit_tag" @change="onEditTagChange(scope.row)">
              <el-option
                v-for="item in componentEditTypeOptions"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              />
            </el-select>
            <el-button
              slot="append"
              name="openAttrEditDialog6"
              size="mini"
              icon="el-icon-edit"
              @click="openAttrEditDialog(scope.row, scope.row.edit)"/>
          </el-input>
        </el-form-item>
      </template>
    </ody-table>
    <ody-dialog :visible.sync="showAttrEditDialog" :append-to-body="true" title="属性编辑" width="550px">
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
              v-if="index !== 0 && !attrEditItems[index].disabled"
              slot="append"
              name="attrEditItems_splice"
              size="mini"
              icon="el-icon-delete"
              @click="attrEditItems.splice(index)"/>
          </el-input>
          <div>
            <el-button
              v-if="index === attrEditItems.length - 1"
              name="attrEditItems_push"
              size="mini"
              icon="el-icon-plus"
              @click="attrEditItems.push([])"/>
          </div>

        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top" />
        <ody-button name="ui_showAttrEditDialog" code="ui" size="small" @click="showAttrEditDialog = false">取 消</ody-button>
        <ody-button name="ui_onAttrEditClose" code="ui" size="small" type="primary" @click="onAttrEditClose">确 定</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  name: 'FieldList',
  components: {},
  props: {
    loading: { type: Boolean, default: false },
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
      editRow: null,
      editRowTag: null,
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
            ':default': '7',
            ':range-separator': "$t(\'至\')",
            type: 'datetimer'
          }
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
          code: 'ody-brand-select',
          label: 'ody-brand-select'
        }, {
          code: 'ody-dict-select',
          label: 'ody-dict-select',
          attributes: {
            'pool': 'oms',
            category: ''
          },
          afterAttrEdit: (row, option) => {
            row.dataSourceType = 'code'
            const attrs = JSON.parse(row.search.tagAttributes)
            row.dataSourceKey = attrs['category']
          }
        }, {
          code: 'ody-channel-select',
          label: 'ody-channel-select'
        }, {
          code: 'ody-supplier-choose',
          label: 'ody-supplier-choose'
        }
      ],
      componentEditTypeOptions: [
        {
          code: 'el-input',
          label: 'el-input'
        }, {
          code: 'ody-input-number',
          label: 'ody-input-number'
        }, {
          code: 'el-date-picker',
          label: 'el-date-picker',
          attributes: {
            'value-format': 'yyyy-MM-dd HH:mm'
          }
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
          code: 'ody-brand-select',
          label: 'ody-brand-select'
        }, {
          code: 'ody-dict-select',
          label: 'ody-dict-select',
          attributes: {
            'pool': 'oms',
            category: ''
          },
          afterAttrEdit: (row, option) => {
            row.dataSourceType = 'code'
            const attrs = JSON.parse(row.edit.tagAttributes)
            row.dataSourceKey = attrs['category']
          }
        }, {
          code: 'ody-channel-select',
          label: 'ody-channel-select'
        }, {
          code: 'ody-supplier-choose',
          label: 'ody-supplier-choose'
        }
      ],
      tableFormColumns: [
        {
          label: this.$t('列名'),
          prop: 'column',
          show: true,
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
          prop: 'relName',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('显示名'),
          slot: 'label',
          show: true,
          tooltip: false,
          align: 'center',
          minWidth: 220
        },
        {
          label: this.$t('查询显示'),
          slot: 'searchShow',
          show: true,
          align: 'center',
          minWidth: 80
        },
        {
          label: this.$t('列表显示'),
          slot: 'tableShow',
          show: true,
          align: 'center',
          minWidth: 80
        },
        {
          label: this.$t('编辑显示'),
          slot: 'editShow',
          show: true,
          align: 'center',
          minWidth: 80
        },
        {
          label: this.$t('是否导入'),
          slot: 'importable',
          show: true,
          align: 'center',
          minWidth: 80
        },
        {
          label: this.$t('是否导出'),
          slot: 'exportable',
          show: true,
          align: 'center',
          minWidth: 80
        },
        {
          label: this.$t('是否只读'),
          slot: 'readonly',
          show: true,
          align: 'center',
          minWidth: 80
        },
        {
          label: this.$t('是否必填'),
          slot: 'editRequired',
          show: true,
          align: 'center',
          minWidth: 80
        },
        {
          label: this.$t('查询控件'),
          slot: 'searchTag',
          show: true,
          align: 'center',
          minWidth: 500
        },
        {
          label: this.$t('编辑控件'),
          slot: 'editTag',
          show: true,
          align: 'center',
          minWidth: 500
        }
      ]
    }
  },
  async mounted() {

  },
  methods: {
    onSearchTagChange(row) {
      const item = this.componentSearchTypeOptions.find(item => item.code === row.search.tag)
      row.search.tagAttributes = JSON.stringify(item.attributes)
    },
    openAttrEditDialog(row, tag) {
      const option = this.componentSearchTypeOptions.find(item => item.code === tag.tag)
      if (!option) {
        return
      }
      let tagAttributes = {}
      if (tag.tagAttributes) {
        try {
          tagAttributes = JSON.parse(tag.tagAttributes)
        } catch (e) {
          console.log(e)
        }
      }
      const editAttrs = Object.assign({}, option.attributes, tagAttributes)
      this.attrEditItems = []
      for (var p in editAttrs) {
        this.attrEditItems.push({ key: p, value: editAttrs[p], disabled: option.attributes.hasOwnProperty(p) })
      }
      this.editRow = row
      this.editRowTag = tag
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
      if (Object.keys(attrs).length > 0) {
        this.editRowTag.tagAttributes = JSON.stringify(attrs)
      }
      if (this.editTagOption.afterAttrEdit) {
        this.editTagOption.afterAttrEdit(this.editRow, this.editTagOption)
      }
      this.showAttrEditDialog = false
    },
    onEditTagChange(row) {
      const item = this.componentEditTypeOptions.find(item => item.code === row.edit.tag)
      row.edit.tagAttributes = JSON.stringify(item.attributes)
    }
  }
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('销售属性') }}</span>
      </div>
      <div>
        <el-checkbox v-model="visible" name="visible" style="margin-bottom: 10px" @change="visibleChange">{{ $t('启用多规格') }}</el-checkbox>
        <div v-for="attributeName in attributeSelectList" :key="attributeName.id" style="margin-bottom: 10px">
          <ody-tip-star v-if="attributeName.must === 1" :content="attributeName.attName"/>
          <div v-if="attributeName.must === 0"> {{ attributeName.attName }}</div>
          <el-select v-model="attributeName.selectValueId" :placeholder="$t('请选择')" name="attributeName_selectValueId" clearable @change="attributeSelectorChange(attributeName)">
            <el-option
              v-for="item in attributeName.attValueList"
              :key="item.id"
              :label="item.attValue"
              :value="item.id"/>
          </el-select>
        </div>
        <div v-for="attributeName in attributeCheckBoxList" :key="attributeName.id">
          <ody-tip-star v-if="attributeName.must === 1" :content="attributeName.attName"/>
          <div v-if="attributeName.must === 0"> {{ attributeName.attName }}</div>
          <el-form :inline="true" size="mini">
            <el-form-item v-for="attributeValue in attributeName.attValueList" :key="attributeValue.id">
              <el-checkbox
                v-model="attributeValue.checked"
                :label="attributeValue.attValue"
                name="attributeValue_checked"
                @change="attributeValueChange(attributeName, attributeValue, attributeValue.checked)"/>
            </el-form-item>
            <el-form-item v-if="attributeName.canAdd"><el-input v-model="attributeName.newAttValue" :placeholder="$t('自定义属性值')" name="attributeName_newAttValue" size="small"/></el-form-item>
            <el-form-item v-if="attributeName.canAdd">
              <el-button
                name="addNewAttValue"
                size="mini"
                @click="addNewAttValue(attributeName)">
                {{ $t('添加') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="canAddAttribute === 1">
          <el-button name="openAttributeModal" size="mini" @click="openAttributeModal">{{ $t('添加自定义属性') }}</el-button>
          <selfDefineAttributeComponent v-if="modalVisible" :visible.sync="modalVisible" @ok="closeAttributeModal"/>
        </div>
        <el-row type="flex" justify="end">
          <el-button
            name="batchInsert"
            size="mini"
            @click="batchInsert">{{ $t('批量填充') }}</el-button>
        </el-row>
        <el-table
          :data="tableData"
          :span-method="spanMethod"
          name="tableData372"
          max-height="550"
          border
          style="width: 100%; margin-top: 10px">
          <template v-for="item in attNameList">
            <el-table-column :key="item" align="center" width="200">
              <template slot="header" slot-scope="scope">
                <el-select v-model="item.selectValueId" :placeholder="item.attName" name="item_selectValueId" filterable clearable>
                  <el-option
                    v-for="e in item.attValues"
                    :key="e.attValueId"
                    :label="e.attValue"
                    :value="e.attValueId"/>
                  <el-option v-show="false" :label="item.attName" value="-2"/>
                </el-select>
              </template>
              <template slot-scope="scope">{{ scope.row[item.attNameId].attValue }}</template>
            </el-table-column>
          </template>
          <template v-for="col in tableHead">
            <el-table-column :prop="col.prop" :label="col.label" :key="col" align="center" width="200">
              <template slot="header" slot-scope="scope">
                <el-input v-model="col.defaultValue" :placeholder="col.label" name="col_defaultValue" clearable/>
              </template>
              <template slot-scope="scope"><el-input v-model="scope.row[col.prop]" name="scope_row[col_prop]" clearable/></template>
            </el-table-column>
          </template>
          <el-table-column width="150" align="center">
            <template slot="header" slot-scope="scope">
              <el-popover
                placement="bottom"
                width="180"
                trigger="click">
                <div style="text-align: center">
                  <el-col :span="11"><el-input v-model="defaultBatchData.netWeightStart" name="defaultBatchData_netWeightStart"/></el-col>
                  <el-col :span="2" class="line" style="text-align: center">-</el-col>
                  <el-col :span="11"><el-input v-model="defaultBatchData.netWeight" name="defaultBatchData_netWeight"/></el-col>
                </div>
                <el-button slot="reference" size="small">{{ $t('净重(g)') }}</el-button>
              </el-popover>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row['netWeightStart']" :style="`width: 45%`" name="scope_row['netWeightStart']"/>
              <span>-</span>
              <el-input v-model="scope.row['netWeight']" :style="`width: 45%`" name="scope_row['netWeight']"/>
            </template>
          </el-table-column>
          <el-table-column :prop="mainPictureUrl" align="center" width="135">
            <template slot="header" slot-scope="scope">
              <el-popover
                placement="bottom"
                trigger="click">
                <div style="text-align: center">
                  <el-upload
                    :show-file-list="false"
                    :on-success="(res,file) => {defaultBatchData.mainPictureUrl = res.data.url}"
                    :action="fileUploadUrl"
                    class="avatar-uploader">
                    <img v-if="defaultBatchData.mainPictureUrl" :src="defaultBatchData.mainPictureUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"/>
                  </el-upload>
                </div>
                <el-button slot="reference" size="small">{{ $t('SKU主图') }}</el-button>
              </el-popover>
            </template>
            <template slot-scope="scope">
              <el-upload
                :show-file-list="false"
                :on-success="(res,file) => {scope.row['mainPictureUrl'] = res.data.url}"
                :action="fileUploadUrl"
                :on-remove="handleRemove"
                class="avatar-uploader">
                <img v-if="scope.row['mainPictureUrl']" :src="scope.row['mainPictureUrl']" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column :prop="canSale" width="150" align="center">
            <template slot="header" slot-scope="scope">
              <el-popover
                placement="bottom"
                trigger="click">
                <div style="text-align: center">
                  <el-radio v-model="defaultBatchData.canSale" :label="1" name="defaultBatchData_canSale">{{ $t('是') }}</el-radio>
                  <el-radio v-model="defaultBatchData.canSale" :label="0" name="defaultBatchData_canSale3">{{ $t('否') }}</el-radio>
                </div>
                <el-button slot="reference" size="small">{{ $t('允许销售') }}</el-button>
              </el-popover>
            </template>
            <template slot-scope="scope">
              <el-radio v-model="scope.row['canSale']" :label="1" name="scope_row['canSale']">{{ $t('是') }}</el-radio>
              <el-radio v-model="scope.row['canSale']" :label="0" name="scope_row['canSale']5">{{ $t('否') }}</el-radio>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import selfDefineAttributeComponent from '../selfDefineAttribute'
export default {
  components: {
    selfDefineAttributeComponent
  },
  props: {
    attribute: {
      type: Object,
      default: null
    },
    fileUploadUrl: {
      type: String,
      default: ''
    },
    seriesMp: {
      type: Object,
      default: null
    },
    canAddAttribute: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      list: this.seriesMp.list, // 需要保存+更新的子品列表
      delList: this.seriesMp.delList, // 需要删除的子品列表
      tableData: [], // 表体
      tableHead: [], // 固定表头
      attributeNameList: this.attribute.list, // 存在的类目属性+商品自定义属性
      selfDefineAttList: this.attribute.saveList, // 需要保存的自定义属性
      attributeSelectList: [], // 下拉列表属性
      attributeCheckBoxList: [], // 多选框属性
      attNameList: [], // 系列子品中获得的属性
      defaultBatchData: defaultBatchData,
      visible: true,
      autoAttValueId: -10000,
      autoAttNameId: -50000,
      modalVisible: false
    }
  },
  mounted() {
    this.seriesMp.delMpAttList = []
    this.buildTableData()
    this.buildTableHead()
  },
  methods: {
    // 启用多规格
    visibleChange(newVal, event) {
    },
    // 新增自定义属性值
    addNewAttValue(attributeName) {
      if (attributeName.newAttValue) {
        attributeName.attValueList.push({ id: this.autoAttValueId, attValue: attributeName.newAttValue })
        this.autoAttValueId++
        attributeName.newAttValue = null
      }
    },
    // 下拉列表属性改变
    attributeSelectorChange(attributeName) {
      if (attributeName.selectValueId) { // 选中属性
        const tempAttValue = { id: attributeName.selectValueId }
        for (const value of attributeName.attValueList) {
          if (value.id === attributeName.selectValueId) {
            tempAttValue.attValue = value.attValue
            value.checked = true
          } else {
            value.checked = false
          }
        }
        if (this.list.length === 0) {
          this.list.push({ canSale: 1, mpSeriesAttList: [{ attName: attributeName.attName, attNameId: attributeName.id, attValue: tempAttValue.attValue, attValueId: tempAttValue.id }] })
        } else {
          for (const item of this.list) {
            let flag = false
            for (let i = 0; i < item.mpSeriesAttList.length; i++) {
              if (item.mpSeriesAttList[i].attNameId === attributeName.id) {
                item.mpSeriesAttList[i].attValueId = tempAttValue.id
                item.mpSeriesAttList[i].attValue = tempAttValue.attValue
                flag = true
                break
              }
            }
            if (!flag) {
              item.mpSeriesAttList.push({ attName: attributeName.attName, attNameId: attributeName.id, attValue: tempAttValue.attValue, attValueId: tempAttValue.id })
            }
          }
        }
      } else { // 清除属性
        for (let i = 0; i < this.list.length; i++) {
          const item = this.list[i]
          for (let j = 0; j < item.mpSeriesAttList.length; j++) {
            if (item.mpSeriesAttList[j].attNameId === attributeName.id) {
              this.seriesMp.delMpAttList.push(item.mpSeriesAttList[j])
              item.mpSeriesAttList.splice(j, 1)
              break
            }
          }
          if (item.mpSeriesAttList.length === 0) {
            if (item.id !== null) {
              this.delList.push(item)
            }
            this.list.splice(i, 1)
          }
        }
        for (const value of attributeName.attValueList) {
          value.checked = false
        }
      }
      this.buildTableData()
    },
    // 自定义属性模态框
    openAttributeModal() {
      this.modalVisible = !this.modalVisible
    },
    // 关闭自定义属性模态框
    closeAttributeModal(newAtt) {
      if (newAtt) {
        const attNameId = this.autoAttNameId
        this.autoAttNameId++
        const att = { id: attNameId, attName: newAtt.attName, canAdd: 1, attValueList: [], must: 0 }
        for (const value of newAtt.attValueList) {
          const attValueId = this.autoAttValueId
          this.autoAttValueId++
          att.attValueList.push({ id: attValueId, attValue: value })
        }
        this.attributeNameList.push(att)
        this.selfDefineAttList.push(att)
        this.buildAttributeNameList()
      }
    },
    // 批量填充
    batchInsert() {
      const checkedIds = {}// 选中的属性名对应的属性值集合
      let flag = false
      for (const att of this.attNameList) {
        const list = []
        if (!att.selectValueId || att.selectValueId === '-2') {
          for (const attValue of att.attValues) {
            list.push(attValue.attValueId)
          }
          att.selectValueId = '-2'
        } else if (att.selectValueId) {
          list.push(att.selectValueId)
          att.selectValueId = '-2'
        }
        if (list.length > 0) {
          checkedIds[att.attNameId] = list
          flag = true
        }
      }
      if (!flag) {
        for (const item of this.tableHead) {
          item.defaultValue = null
        }
        this.defaultBatchData = { canSale: 1, mainPictureUrl: '' }
        this.$forceUpdate()
        return
      }
      const batchData = {}
      flag = false
      for (const item of this.tableHead) {
        if (item.defaultValue) {
          batchData[item.prop] = item.defaultValue
          flag = true
        }
      }
      for (const data in this.defaultBatchData) {
        if (this.defaultBatchData[data] || this.defaultBatchData[data] === 0) {
          batchData[data] = this.defaultBatchData[data]
          flag = true
        }
      }
      if (!flag) {
        return
      }
      for (const item of this.list) {
        let count = 0
        for (const att of item.mpSeriesAttList) {
          const checkedValueList = checkedIds[att.attNameId]
          if (checkedValueList && checkedValueList.indexOf(att.attValueId) !== -1) {
            count++
          }
        }
        if (count === item.mpSeriesAttList.length) {
          for (const data in batchData) {
            item[data] = batchData[data]
          }
        }
      }
      for (const item of this.tableHead) {
        item.defaultValue = null
      }
      this.defaultBatchData = { canSale: 1, mainPictureUrl: '' }
      this.$forceUpdate()
    },
    // 组装下拉列表属性和多选框属性
    buildAttributeNameList() {
      this.attributeSelectList = []
      this.attributeCheckBoxList = []
      const existAttValueIds = []
      for (let i = 0; i < this.attNameList.length; i++) {
        for (let j = 0; j < this.attNameList[i].attValues.length; j++) {
          existAttValueIds.push(this.attNameList[i].attValues[j].attValueId)
        }
      }
      for (let i = 0; i < this.attributeNameList.length; i++) {
        for (let j = 0; j < this.attributeNameList[i].attValueList.length; j++) {
          if (existAttValueIds.indexOf(this.attributeNameList[i].attValueList[j].id) !== -1) {
            this.attributeNameList[i].attValueList[j].checked = true
            this.attributeNameList[i].selectValueId = this.attributeNameList[i].attValueList[j].id
          }
        }
        if (this.attributeNameList[i].isSelector) {
          this.attributeSelectList.push(this.attributeNameList[i])
        } else {
          this.attributeCheckBoxList.push(this.attributeNameList[i])
        }
      }
    },
    // 单元格合并
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < this.attNameList.length) {
        const attNameId = this.attNameList[columnIndex].attNameId
        const attValueObj = row[attNameId]
        if (attValueObj.first) {
          return {
            rowspan: attValueObj.size,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 组装表格数据
    buildTableData() {
      // 组装属性到商品上
      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i]
        for (let j = 0; j < item.mpSeriesAttList.length; j++) {
          const att = item.mpSeriesAttList[j]
          item[att.attNameId] = { attValueId: att.attValueId, attValue: att.attValue }
        }
      }
      // 组装表头属性
      const attNameList = []
      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i]
        for (let j = 0; j < item.mpSeriesAttList.length; j++) {
          const att = item.mpSeriesAttList[j]
          let attName = attNameList.find(v => {
            return v.attNameId === att.attNameId
          })
          if (!attName) {
            attName = { attName: att.attName, attValues: [], attNameId: att.attNameId, selectValueId: '-2' }
            attNameList.push(attName)
          }
          let attValue = attName.attValues.find(v => {
            return v.attValueId === att.attValueId
          })
          if (!attValue) {
            attValue = { attValue: att.attValue, attValueId: att.attValueId }
            attName.attValues.push(attValue)
          }
        }
      }
      // 排序属性项，根据属性值的多少排序，属性值少的在前面
      for (let i = 0; i < attNameList.length - 1; i++) {
        for (let j = 0; j < attNameList.length - i - 1; j++) {
          const rightLength = attNameList[j].attValues.length
          const leftLength = attNameList[j + 1].attValues.length
          if (rightLength > leftLength) {
            const temp = attNameList[j]
            attNameList[j] = attNameList[j + 1]
            attNameList[j + 1] = temp
          }
        }
      }
      this.attNameList = attNameList
      // 排序子品列表，按照前面属性项的顺序，将相同属性值的排在一起
      for (let i = 0; i < this.list.length - 1; i++) {
        for (let j = 0; j < this.list.length - i - 1; j++) {
          let conti = true
          let change = false
          for (let k = 0; k < attNameList.length - 1; k++) {
            const att = attNameList[k]
            if (conti) {
              let rightAttValueId = null
              if (this.list[j][att.attNameId] != null) {
                rightAttValueId = this.list[j][att.attNameId].attValueId
              } else {
                conti = false
              }
              let leftAttValueId = null
              if (this.list[j + 1][att.attNameId] != null) {
                leftAttValueId = this.list[j + 1][att.attNameId].attValueId
              } else {
                conti = false
              }
              if (rightAttValueId < leftAttValueId) {
                change = true
                conti = false
              } else if (rightAttValueId > leftAttValueId) {
                conti = false
              }
            }
          }
          if (change) {
            const temp = this.list[j]
            this.list[j] = this.list[j + 1]
            this.list[j + 1] = temp
          }
        }
      }
      const noFirst = {}
      for (let k = 0; k < this.list.length; k++) {
        const mp = this.list[k]
        for (let i = 0; i < attNameList.length; i++) {
          const attName = attNameList[i]
          let key = ''
          for (let j = 0; j < i + 1; j++) {
            if (mp[attNameList[j].attNameId] != null) {
              key = key + mp[attNameList[j].attNameId].attValueId
            }
          }
          if (noFirst[key] === undefined) {
            if (mp[attName.attNameId] != null) {
              mp[attName.attNameId].first = true
            } else {
              mp[attName.attNameId] = {}
              mp[attName.attNameId].first = true
            }

            noFirst[key] = 1
          } else {
            noFirst[key] = noFirst[key] + 1
          }
        }
      }
      for (let k = 0; k < this.list.length; k++) {
        const mp = this.list[k]
        for (let i = 0; i < attNameList.length; i++) {
          const attName = attNameList[i]
          let key = ''
          for (let j = 0; j < i + 1; j++) {
            if (mp[attNameList[j].attNameId] != null) {
              key = key + mp[attNameList[j].attNameId].attValueId
            }
          }
          if (noFirst[key]) {
            if (mp[attName.attNameId] != null) {
              mp[attName.attNameId].size = noFirst[key]
            } else {
              mp[attName.attNameId] = {}
            }

            noFirst[key] = undefined
          }
        }
      }
      this.tableData = this.list
      this.buildAttributeNameList()
    },
    // 表头固定数据
    buildTableHead() {
      this.tableHead = defaultTableHead
    },
    // 多选框属性改变
    attributeValueChange(attName, attValue, checked) {
      if (!checked) {
        let checkedValueCount = 0// 当前改变属性名对应的属性值选中的数量
        let checkedAttCount = 0// 属性名选中数量
        for (const att of this.attributeNameList) {
          let tempCount = 0
          for (const value of att.attValueList) {
            if (value.id !== attValue.attValueId && value.checked) {
              tempCount++
            }
          }
          if (tempCount > 0) {
            checkedAttCount++
          }
          if (att.id === attName.id) {
            checkedValueCount += tempCount
          }
        }
        const newList = []
        for (const item of this.list) {
          let flag = false
          for (let j = 0; j < item.mpSeriesAttList.length; j++) {
            const att = item.mpSeriesAttList[j]
            if (att.attValueId === attValue.id) {
              if (checkedValueCount === 0 && checkedAttCount > 0) { // 删除系列属性，不删除商品
                if (att.mpAttNameId) {
                  this.seriesMp.delMpAttList.push(att)
                }
                item.mpSeriesAttList.splice(j, 1)
              } else { // 删除商品
                flag = true
              }
            }
          }
          if (flag) {
            if (item.id) {
              this.delList.push(item.id)
            }
          } else {
            newList.push(item)
          }
        }
        this.list = newList
        this.seriesMp.list = newList
        this.buildTableData()
      } else {
        if (!this.list || this.list.length === 0) {
          this.list.push({ canSale: 1, mpSeriesAttList: [{ attName: attName.attName, attNameId: attName.id, attValue: attValue.attValue, attValueId: attValue.id }] })
        } else {
          let dim = 1
          for (const att of this.attributeNameList) {
            let count = 0
            for (const value of att.attValueList) {
              if (value.checked) {
                count++
              }
            }
            if (count > 0) {
              dim *= count
            }
          }
          if (dim > this.list.length) { // 新增子品
            const selectAttNameList = []
            this.attributeNameList.forEach(function(nameItem) {
              const attValueIdList = []

              nameItem.attValueList.forEach(function(att) {
                if (att.checked) {
                  attValueIdList.push(att.id)
                }
              })

              if (attValueIdList) {
                const selectAttValueList = []
                selectAttNameList.push(selectAttValueList)
                nameItem.attValueList.forEach(function(valueItem) {
                  if (attValueIdList.indexOf(valueItem.id) >= 0) {
                    selectAttValueList.push({ attName: nameItem.attName, attNameId: nameItem.id, attValueId: valueItem.id, attValue: valueItem.attValue })
                  }
                })
              }
            })
            const result = []
            recursive(selectAttNameList, result, 0, [])
            for (const seriesAtt of result) {
              let flag = false
              for (const mp of this.list) {
                if (this.checkAttSame(seriesAtt, mp.mpSeriesAttList)) {
                  flag = true
                  break
                }
              }
              if (!flag) {
                this.list.push({ canSale: 1, mpSeriesAttList: seriesAtt })
              }
            }
          } else { // 子品新增系列属性
            for (const item of this.list) {
              item.mpSeriesAttList.push({ attName: attName.attName, attNameId: attName.id, attValue: attValue.attValue, attValueId: attValue.id })
            }
          }
        }
        this.buildTableData()
      }
      this.$forceUpdate()
    },
    checkAttSame(seriesAtt, mpSeriesAtt) {
      for (const att of seriesAtt) {
        const index = mpSeriesAtt.findIndex(item => {
          return item.attNameId === att.attNameId && item.attValueId === att.attValueId
        })
        if (index === -1) {
          return false
        }
      }
      return true
    }
  }
}
// 生成笛卡尔积
const recursive = function(dimValue, result, layer, curList) {
  if (layer < dimValue.length - 1) {
    if (dimValue[layer].length === 0) {
      recursive(dimValue, result, layer + 1, curList)
    } else {
      for (let i = 0; i < dimValue[layer].length; i++) {
        const list = curList.slice()
        list.push(dimValue[layer][i])
        recursive(dimValue, result, layer + 1, list)
      }
    }
  } else if (layer === dimValue.length - 1) {
    if (dimValue[layer].length === 0) {
      result.push(curList)
    } else {
      for (let i = 0; i < dimValue[layer].length; i++) {
        const list = curList.slice()
        list.push(dimValue[layer][i])
        result.push(list)
      }
    }
  }
}
const defaultTableHead = [
  { label: 'SKU编码', prop: 'code', defaultValue: undefined },
  { label: 'SKU条形码', prop: 'barCode', defaultValue: undefined },
  { label: '*零售价', prop: 'salePriceWithTax', defaultValue: undefined },
  { label: '划线价', prop: 'marketPrice', defaultValue: undefined },
  { label: '采购价', prop: 'purchasePriceWithTax', defaultValue: undefined }
]
const defaultBatchData = { canSale: 1, mainPictureUrl: '' }
</script>
<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px !important;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
</style>

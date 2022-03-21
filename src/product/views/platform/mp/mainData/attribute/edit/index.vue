<template>
  <div style="margin-top: 30px">
    <el-row>
      <div
        class="grid-content bg-purple"
        style="float: left;margin-right: 30px;width: 180px;text-align: right"
      >
        <span style="color: red">*</span>
        <span style="font-size: 15px">{{ $t('属性类型') }}</span>
      </div>
      <el-radio-group
        v-model="attributeName.attType"
        :disabled="viewStatus === 3 || viewStatus == 2"
        name="attributeName_attType"
      >
        <el-radio :label="1">{{ $t('商品属性') }}</el-radio>
        <el-radio :label="2">{{ $t('销售属性') }}</el-radio>
      </el-radio-group>
      <el-popover placement="top-start" width="400" trigger="hover">
        <div>
          <p style="color: #CC3333">
            <span>{{ $t('商品属性用于定义商品的特有特征(如生产地、新旧程度);') }}</span>
          </p>
          <p style="color: #CC3333">
            <span>{{ $t('销售属性是指影响商家的库存管理的具体规格信息(比如衣服的尺寸、颜色等)。') }}</span>
          </p>
        </div>
        <i slot="reference" class="el-icon-question" />
      </el-popover>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="color: red">*</span>
          <span style="font-size: 15px">{{ $t('属性编码') }}</span>
        </span>
      </div>
      <div style="float: left;width: 300px;margin-top: -5px">
        <el-input
          v-model="attributeName.code"
          :disabled="viewStatus === 3 || viewStatus == 2"
          name="attributeName_code"
          maxlength="20"
        />
      </div>
      <el-popover placement="top-start" width="400" trigger="hover">
        <div>
          <p style="color: #CC3333">
            <span>{{ $t('修改原属性填写的内容，如果已有商品引用该属性，将会同步修改，请谨慎调整。') }}</span>
          </p>
        </div>
        <i slot="reference" class="el-icon-question" />
      </el-popover>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="color: red">*</span>
          <span style="font-size: 15px">{{ $t('属性名称') }}</span>
        </span>
      </div>
      <div style="float: left;width: 300px;margin-top: -5px">
        <el-input v-model="attributeName.name" :disabled="viewStatus == 2" name="attributeName_name" maxlength="20" />
      </div>
      <el-popover placement="top-start" width="400" trigger="hover">
        <div>
          <p style="color: #CC3333">
            <span>{{ $t('修改原属性填写的内容，如果已有商品引用该属性，将会同步修改，请谨慎调整。') }}</span>
          </p>
        </div>
        <i slot="reference" class="el-icon-question" />
      </el-popover>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="font-size: 15px">{{ $t('属性名称') }}</span>
          <span>({{ lang }})</span>
        </span>
      </div>
      <div style="float: left;width: 300px;margin-top: -5px">
        <el-input v-model="attributeName.nameLan2" :disabled="viewStatus == 2" name="attributeName_nameLan2" maxlength="30" />
      </div>
    </el-row>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-right: 30px;width: 180px;text-align: right">
        <span>
          <span style="font-size: 15px">{{ $t('备注') }}</span>
        </span>
      </div>
      <div style="float: left;width: 300px;margin-top: -5px">
        <el-input v-model="attributeName.remark" :disabled="viewStatus == 2" name="attributeName_remark" maxlength="20" />
      </div>
      <el-popover placement="top-start" width="400" trigger="hover">
        <div>
          <p style="color: #CC3333">
            <span>{{ $t('比如两个不同的属性，名称都是尺寸，但是分别用于服装和手机，可以在此填写‘服装’和‘手机’以示区分。') }}</span>
          </p>
        </div>
        <i slot="reference" class="el-icon-question" />
      </el-popover>
    </el-row>
    <el-row v-if="attributeName.attType === 1" style="margin-top: 20px">
      <div
        class="grid-content bg-purple"
        style="float: left;margin-right: 30px;width: 180px;text-align: right"
      >
        <span style="color: red">*</span>
        <span style="font-size: 15px">{{ $t('属性是否必输') }}</span>
      </div>
      <el-radio-group v-model="attributeName.isMust" :disabled="viewStatus == 2" name="attributeName_isMust">
        <el-radio :label="1">{{ $t('是') }}</el-radio>
        <el-radio :label="0">{{ $t('否') }}</el-radio>
      </el-radio-group>
    </el-row>
    <el-row style="margin-top: 20px">
      <div
        class="grid-content bg-purple"
        style="float: left;margin-right: 30px;width: 180px;text-align: right"
      >
        <span style="color: red">*</span>
        <span style="font-size: 15px">{{ $t('属性值录入方式') }}</span>
      </div>
      <el-radio-group
        v-model="attributeName.inputType"
        :disabled="viewStatus === 3 || viewStatus == 2"
        name="attributeName_inputType"
        @change="changeShowType"
      >
        <el-radio :label="1">{{ $t('多选') }}</el-radio>
        <el-radio :label="2">{{ $t('单选') }}</el-radio>
        <el-radio v-if="attributeName.attType === 1" :label="3">{{ $t('手工输入') }}</el-radio>
      </el-radio-group>
    </el-row>
    <el-row v-if="attributeName.inputType !== 3" style="margin-top: 20px">
      <div
        class="grid-content bg-purple"
        style="float: left;margin-right: 30px;width: 180px;text-align: right"
      >
        <span style="color: red">*</span>
        <span style="font-size: 15px">{{ $t('允许商家自定义属性值') }}</span>
      </div>
      <el-radio-group v-model="attributeName.enableAdd" :disabled="viewStatus == 2" name="attributeName_enableAdd">
        <el-radio :label="1">{{ $t('是') }}</el-radio>
        <el-radio :label="0">{{ $t('否') }}</el-radio>
      </el-radio-group>
    </el-row>
    <el-row v-if="attributeName.inputType !== 3" style="margin-top: 20px">
      <div
        class="grid-content bg-purple"
        style="float: left;margin-right: 30px;width: 180px;text-align: right"
      >
        <span style="color: red">*</span>
        <span style="font-size: 15px">{{ $t('属性值') }}</span>
      </div>
      <div style="float: left;width: 800px;margin-top: -10px">
        <div style="border:1px solid #A9A9A9;padding: 20px;backgroundColor: white;">
          <el-table
            :data="attributeName.attributeValuePOS"
            name="attributeName_attributeValuePOS746"
            border
            style="width: 100%; margin-top: 10px"
          >
            <el-table-column>
              <template slot="header" slot-scope="scope">
                <div>
                  <span style="color:red">*</span>
                  {{ $t('属性编码') }}
                </div>
              </template>
              <template slot-scope="scope">
                <el-input :disabled="viewStatus == 2" v-model.trim="scope.row.code" />
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="scope">
                <div>
                  <span style="color:red">*</span>
                  {{ $t('属性值') }}
                </div>
              </template>
              <template slot-scope="scope">
                <el-input
                  :disabled="viewStatus == 2"
                  v-model.trim="scope.row.value"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('属性值(第二语言)')">
              <template slot-scope="scope">
                <el-input
                  :disabled="viewStatus == 2"
                  v-model.trim="scope.row.valueLan2"
                  maxlength="20"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('移动')" align="center">
              <template v-if="$portal.hasPermission('Product1002Move')" slot-scope="scope">
                <!-- 向上 -->
                <i name="upSort" class="el-icon-arrow-up" style="font-size:14px" @click="upSort(scope.$index)" />
                <!-- 向下 -->
                <i
                  name="downSort"
                  class="el-icon-arrow-down"
                  style="font-size:14px"
                  @click="downSort(scope.$index)"
                />
                <!-- 置顶 -->
                <i name="topSort" class="el-icon-caret-top" style="font-size:14px" @click="topSort(scope.$index)" />
                <!-- 置底 -->
                <i
                  name="bottomSort"
                  class="el-icon-caret-bottom"
                  style="font-size:14px"
                  @click="bottomSort(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('编辑')" align="center">
              <template slot-scope="scope">
                <ody-button
                  :disabled="viewStatus == 2"
                  name="Product1002DeleteAttrValue_removeAttributeValue"
                  size="small"
                  code="Product1002DeleteAttrValue"
                  @click="removeAttributeValue(scope.row)"
                >{{ $t('删除') }}</ody-button>
              </template>
            </el-table-column>
          </el-table>
          <ody-button
            :disabled="viewStatus == 2"
            name="Product1002AddAttrValue_addAttributeValue"
            style="margin-top: 10px"
            code="Product1002AddAttrValue"
            @click="addAttributeValue"
          >
            <span style="color: #0000FF">
              <i class="el-icon-plus" />
              {{ $t('添加属性') }}
            </span>
          </ody-button>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 10px">
      <ody-button
        :disabled="viewStatus == 2"
        :loading="loading"
        name="Product1002Save_saveAttribute"
        type="primary"
        size="small"
        code="Product1002Save"
        @click="saveAttribute"
      >{{ $t('保存') }}</ody-button>
      <el-button :loading="loading" name="back" type="primary" size="small" @click="back">{{ $t('返回') }}</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Product1002',
  data() {
    return {
      checked: false,
      decimalPlace: null,
      date: null,
      lang: this.$t('第二语言'),
      attributeName: {
        attType: 1,
        isMust: 0,
        enableAdd: 1,
        inputType: 1,
        addType: 0
      },
      viewStatus: null,
      deleteList: [],
      id: null,
      attValueDataType1: [
        {
          label: this.$t('无限制'),
          value: 0
        },
        {
          label: this.$t('仅数字'),
          value: 1
        },
        {
          label: this.$t('仅日期'),
          value: 2
        }
      ],
      attValueDataType2: [
        {
          label: this.$t('无限制'),
          value: 0
        },
        {
          label: this.$t('仅数字'),
          value: 1
        }
      ],
      dateFormat: [
        {
          label: this.$t('年') + '(YYYY)',
          value: 1
        },
        {
          label: this.$t('月') + '(YYYY-MM)',
          value: 2
        },
        {
          label: this.$t('日') + '(YYYY-MM-DD)',
          value: 3
        }
      ]
    }
  },
  mounted() {
    if (this.viewStatus === 3) {
      this.attributeName.addType = 2
    }
  },
  created() {
    this.viewStatus = this.$route.query.viewStatus
    this.id = this.$route.query.id
    this.mpApi = this.$product.$api.mpApi
    if (this.id) {
      this.query(this.id)
    } else {
      this.addAttributeValue()
    }
  },
  methods: {
    addAttributeValue() {
      if (!this.attributeName.attributeValuePOS) {
        this.attributeName.attributeValuePOS = []
      }
      const attributeValue = { addType: 0 }
      this.attributeName.attributeValuePOS.push(attributeValue)
    },
    removeAttributeValue(e) {
      const index = this.attributeName.attributeValuePOS.indexOf(e)
      this.attributeName.attributeValuePOS.splice(index, 1)
    },
    doDelete() {
      this.$confirm(this.$t('确定删除吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        return this.mpApi
          .deleteAttribute({ attributeVOS: this.deleteList })
          .then(res => {
            res.addType = 2
            this.query(this.id)
            this.$message({
              type: 'success',
              message: this.$t('删除成功')
            })
          })
      })
    },
    query(id) {
      return this.mpApi.viewAttributeInfoById({ id: id }).then(res => {
        this.attributeName = res.data
        if (this.attributeName.isAttValueInterval === 1) {
          this.checked = true
        }
        if (this.attributeName.isAttValueInterval === 0) {
          this.checked = false
        }
        if (this.attributeName.attValueDataType === 1) {
          this.decimalPlace = this.attributeName.attValueDataLayout
        }
        if (this.attributeName.attValueDataType === 2) {
          this.date = this.attributeName.attValueDataLayout
        }
      })
    },
    changeShowType() {
      if (this.attributeName.changeShowType === 2) {
        this.attributeName.attributeValuePOS = []
      }
    },
    back() {
      this.$portal.delActiveView()
      this.$router.push({ name: 'Product1002' })
    },
    upSort(index) {
      if (this.viewStatus === 2 || this.viewStatus === '2') {
        return
      }
      if (index > 0) {
        const tmp = this.attributeName.attributeValuePOS[index - 1]
        this.attributeName.attributeValuePOS.splice(index - 1, 1)
        this.attributeName.attributeValuePOS.splice(index, 0, tmp)
      }
    },
    downSort(index) {
      if (this.viewStatus === 2 || this.viewStatus === '2') {
        return
      }
      if (index < this.attributeName.attributeValuePOS.length - 1) {
        const tmp = this.attributeName.attributeValuePOS[index + 1]
        this.attributeName.attributeValuePOS.splice(index + 1, 1)
        this.attributeName.attributeValuePOS.splice(index, 0, tmp)
      }
    },
    topSort(index) {
      if (this.viewStatus === 2 || this.viewStatus === '2') {
        return
      }
      if (index > 0) {
        const tmp = this.attributeName.attributeValuePOS[index]
        this.attributeName.attributeValuePOS.splice(index, 1)
        this.attributeName.attributeValuePOS.splice(0, 0, tmp)
      }
    },
    bottomSort(index) {
      if (this.viewStatus === 2 || this.viewStatus === '2') {
        return
      }
      if (index < this.attributeName.attributeValuePOS.length - 1) {
        const tmp = this.attributeName.attributeValuePOS[index]
        this.attributeName.attributeValuePOS.splice(index, 1)
        this.attributeName.attributeValuePOS.splice(
          this.attributeName.attributeValuePOS.length,
          0,
          tmp
        )
      }
    },
    changeInterval() {
      if (this.checked) {
        this.attributeName.isAttValueInterval = 1
      } else {
        this.attributeName.isAttValueInterval = 0
      }
    },
    changeAttValueDataType() {
      this.checked = false
      this.attributeName.isAttValueInterval = null
      if (this.attributeName.attValueDataType === 0) {
        this.date = null
        this.decimalPlace = null
      }
      if (this.attributeName.attValueDataType === 1) {
        this.date = null
      }
      if (this.attributeName.attValueDataType === 2) {
        this.decimalPlace = null
      }
    },
    clear() {
      this.checked = false
      this.attributeName.isAttValueInterval = null
      this.attributeName.attValueDataLayout = null
      this.date = null
      this.decimalPlace = null
    },
    saveAttribute() {
      if (this.validate()) {
        var param = Object.assign({}, this.attributeName)
        return this.mpApi.addAttributeInfo(param).then(res => {
          this.viewStatus = 3
          this.$portal.delActiveView()
          if (this.attributeName.addType === 0) {
            this.$message({
              showClose: true,
              message: this.$t('新增成功'),
              type: 'success'
            })
            this.$router.push({
              path: '/back-product-static/platfrom/mp/mainData/attribute/edit',
              query: { id: res.data, viewStatus: this.viewStatus }
            })
          } else {
            this.$message({
              showClose: true,
              message: this.$t('更新成功'),
              type: 'success'
            })
          }
        })
      }
    },
    validate() {
      if (
        this.attributeName.attType !== 1 &&
        this.attributeName.attType !== 2
      ) {
        this.$message({
          showClose: true,
          message: this.$t('必须选择属性类型'),
          type: 'error'
        })
        return false
      }
      if (isStrEmpty(this.attributeName.code)) {
        this.$message({
          showClose: true,
          message: this.$t('属性编码不能为空'),
          type: 'error'
        })
        return false
      }
      if (isStrEmpty(this.attributeName.name)) {
        this.$message({
          showClose: true,
          message: this.$t('属性名称不能为空'),
          type: 'error'
        })
        return false
      }
      if (this.attributeName.isMust !== 0 && this.attributeName.isMust !== 1) {
        this.$message({
          showClose: true,
          message: this.$t('必须选择属性是否必输'),
          type: 'error'
        })
        return false
      }
      if (
        this.attributeName.inputType !== 3 &&
        this.attributeName.inputType !== 1 &&
        this.attributeName.inputType !== 2
      ) {
        this.$message({
          showClose: true,
          message: this.$t('必须选择属性值设置'),
          type: 'error'
        })
        return false
      }
      if (
        this.attributeName.enableAdd !== 0 &&
        this.attributeName.enableAdd !== 1
      ) {
        this.$message({
          showClose: true,
          message: this.$t('必须选择商家自定义属性值'),
          type: 'error'
        })
        return false
      }
      if (this.attributeName.inputType === 3) {
        this.attributeName.attributeValuePOS = []
      }
      if (
        this.attributeName.inputType === 2 ||
        this.attributeName.inputType === 1
      ) {
        if (this.attributeName.attributeValuePOS.length === 0) {
          this.$message({
            showClose: true,
            message: this.$t('必须添加属性值'),
            type: 'error'
          })
          return false
        }
        var existing = {}
        var existingCode = {}
        var existingValue2 = {}
        for (let i = 0; i < this.attributeName.attributeValuePOS.length; i++) {
          if (isStrEmpty(this.attributeName.attributeValuePOS[i].code)) {
            this.$message({
              showClose: true,
              message: this.$t('属性值编码不能为空'),
              type: 'error'
            })
            return false
          }
          if (isStrEmpty(this.attributeName.attributeValuePOS[i].value)) {
            this.$message({
              showClose: true,
              message: this.$t('属性值不能为空'),
              type: 'error'
            })
            return false
          }
          if (existing[this.attributeName.attributeValuePOS[i].value] === 1) {
            this.$message({
              showClose: true,
              message: this.$t('属性值不能重复'),
              type: 'error'
            })
            return false
          } else {
            existing[this.attributeName.attributeValuePOS[i].value] = 1
          }
          if (
            existingCode[this.attributeName.attributeValuePOS[i].code] === 1
          ) {
            this.$message({
              showClose: true,
              message: this.$t('属性值编码不能重复'),
              type: 'error'
            })
            return false
          } else {
            existingCode[this.attributeName.attributeValuePOS[i].code] = 1
          }
          if (
            existingValue2[
              this.attributeName.attributeValuePOS[i].valueLan2
            ] === 1
          ) {
            this.$message({
              showClose: true,
              message: this.$t('属性值(第二语言)不能重复'),
              type: 'error'
            })
            return false
          } else {
            if (this.attributeName.attributeValuePOS[i].valueLan2) {
              existingValue2[
                this.attributeName.attributeValuePOS[i].valueLan2
              ] = 1
            }
          }
          this.attributeName.attributeValuePOS[i].sortValue = i
        }
        for (let i = 0; i < this.attributeName.attributeValuePOS.length; i++) {
          this.attributeName.attributeValuePOS[i].sortValue = i
        }
      }
      return true
    }
  }
}
function isStrEmpty(str) {
  if (str === undefined) {
    return true
  }
  if (str === null) {
    return true
  }
  return str.replace(/(^\s*)|(\s*$)/g, '').length === 0
}
</script>

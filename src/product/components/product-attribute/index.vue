<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t("商品属性") }}</strong>
      </div>
      <div class="spec">
        <div
          v-for="(attribute, index) in mp.attributeEditVOS"
          :key="index"
          class="spec-item"
        >
          <el-form-item
            v-if="attribute.inputType === 1"
            :prop="'attributeEditVOS.' + index + '.checkbox'"
            :name="'attributeEditVOS.' + index + '.checkbox'"
            :key="index"
            :rules="[
              {
                type: 'array',
                required: attribute.required,
                message: $t('必填项不能为空'),
                trigger: 'change',
              },
            ]"
            :label="attribute.attName + ':'"
            label-width="80px"
          >
            <div class="spec-checkbox">
              <div
                v-if="!attribute.attId"
                name="removeSpecItem"
                class="del-item"
                @click="removeSpecItem(index)"
              >
                <i class="el-icon-close" />
              </div>
              <el-row>
                <el-checkbox-group
                  v-model="attribute.checkbox"
                  name="attribute_checkbox"
                  @change="changeSelect(attribute, attribute.checkbox)"
                >
                  <!-- <el-col
                    v-for="(item, itemIndex) in attribute.items"
                    :key="itemIndex"
                    :span="item.isAdded === 1 ? 6 : 4"
                  > -->
                  <div class="box-box">
                    <div v-for="(item, itemIndex) in attribute.items" :key="itemIndex" class="box-big">
                      <div class="box">
                        <el-checkbox
                          :label="item.code"
                          :disabled="item.readonly"
                          :title="item.value"
                          class="ellipsis"
                        >{{ item.value }}</el-checkbox
                        >
                        <el-popover
                          placement="bottom"
                          trigger="click"
                          @hide="changeValue != ''"
                        >
                          <el-row :gutter="10">
                            <el-col
                              :span="14"
                            ><el-input
                              v-model="changeValue"
                              name="changeValue"
                            /></el-col>
                            <el-col
                              :span="2"
                            ><el-button
                              name="confirmChangeValue"
                              type="primary"
                              size="small"
                              @click="confirmChangeValue(attribute, item)"
                            >{{ $t("确定") }}</el-button
                            ></el-col
                            >
                          </el-row>
                          <i
                            v-show="
                              (item.isAdded === 1 && !isView) ||
                                item.readonly === undefined
                            "
                            slot="reference"
                            class="el-icon-edit el-icon"
                          />
                        </el-popover>

                        <i
                          v-show="
                            (item.isAdded === 1 && !isView) ||
                              item.readonly === undefined
                          "
                          name="delCustomValue"
                          class="el-icon-delete el-icon"
                          @click="delCustomValue(attribute.items, itemIndex)"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- </el-col> -->
                </el-checkbox-group>
              </el-row>
              <div
                v-if="attribute.enableAdd === 1 && attribute.inputType === 1"
                class="add-attr"
              >
                <div class="add-attr-input">
                  <el-input
                    v-model="attribute.addAttValue"
                    :validate-event="false"
                    :placeholder="$t('请输入') + attribute.attName"
                    name="attribute_addAttValue"
                  />
                </div>
                <el-button
                  name="addCustomAttValue"
                  size="small"
                  @click="addCustomAttValue(attribute)"
                >+{{ $t("添加") }}</el-button
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="attribute.inputType === 2"
            :prop="'attributeEditVOS.' + index + '.select'"
            :name="'attributeEditVOS.' + index + '.select'"
            :key="index"
            :rules="[
              {
                required: attribute.required,
                message: $t('必填项不能为空'),
                trigger: 'change',
              },
            ]"
            :label="attribute.attName + ':'"
            label-width="80px"
          >
            <div class="spec-checkbox">
              <el-select
                v-model="attribute.select"
                :filterable="true"
                :allow-create="attribute.enableAdd === 1"
                :placeholder="$t('请选择')"
                name="attribute_select"
                default-first-option
                @change="changeSelect(attribute, attribute.select)"
              >
                <el-option
                  v-for="key in attribute.items"
                  :key="key.value"
                  :label="key.value"
                  :value="key.code"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item
            v-if="attribute.inputType === 3"
            :prop="'attributeEditVOS.' + index + '.value'"
            :name="'attributeEditVOS.' + index + '.value'"
            :rules="[
              {
                required: attribute.required,
                message: $t('必填项不能为空'),
                trigger: 'blur',
              },
            ]"
            :label="attribute.attName + ':'"
            label-width="80px"
          >
            <div class="spec-checkbox">
              <el-input
                v-model="attribute.value"
                name="attribute_value"
                style="width: 100px"
              />
            </div>
          </el-form-item>
        </div>
      </div>
      <el-col v-if="!isView">
        <div v-if="mp.enableAddAtt === 1" class="btn-custom">
          <span
            name="openAttributeModal"
            class="add-custom-btn"
            @click="openAttributeModal"
          >+ {{ $t("添加自定义属性") }}</span
          >
          <selfDefineAttributeComponent
            v-if="modalVisible"
            :visible.sync="modalVisible"
            @ok="closeAttributeModal"
          />
        </div>
      </el-col>
    </el-card>
  </section>
</template>

<script>
import selfDefineAttributeComponent from '@/components/selfDefineAttribute'
export default {
  components: {
    selfDefineAttributeComponent
  },
  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    mp: {
      type: Object,
      required: true,
      default: null
    },
    mpId: {
      type: String,
      default: ''
    },
    createMp: {
      type: Object,
      required: true,
      default: null
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      changeValue: '', // 修改要改变的自定义的value
      valueKey: 'code',
      labelKey: 'value',
      selectValue: {},
      selected: {
        type: Object,
        default: () => {}
      },
      aaa: [],
      value1: [],
      addAttValue: '',
      modalVisible: false
      // mpAttributeList: this.mp.attributeEditVOS
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.$route.query.id) {
        this.queryCategoryAttribute()
      } else {
        this.mp.attributeEditVOS = this.dealInputType(this.mp.attributeEditVOS)
      }
    },
    normalizer(node) {
      return {
        id: node.code,
        label: node.value
      }
    },
    // 根据类目id查询类目属性列表
    async queryCategoryAttribute() {
      const { data } = await this.$product.$api.mpApi.queryCategoryAttribute({
        categoryId: this.mp.productInfoVO.categoryId,
        attType: 1
      })
      this.mp.attributeEditVOS = this.dealInputType(data)
    },
    // 定义属性模态框
    openAttributeModal() {
      this.modalVisible = !this.modalVisible
    },
    addCustomAttValue(item) {
      if (!item.addAttValue) {
        return this.$message(this.$t('请输入') + `${item.attName}`)
      }
      var flag = false
      item.items.map((key) => {
        if (key.value === item.addAttValue) {
          flag = true
        }
      })
      if (flag) {
        var message =
          `${item.attName}` + this.$t('下已经存在') + `${item.addAttValue}`
        return this.$message(message)
      }
      const element = {
        value: item.addAttValue,
        checked: true,
        isAdded: 1,
        code: 'C' + this.$portal.getUuid()
      }
      item.items.push(element)
      item.checkbox = item.checkbox ? item.checkbox : []
      item.checkbox.push(element.code)
      item.addAttValue = ''
    },
    removeSpecItem(index) {
      this.mp.attributeEditVOS.splice(index, 1)
    },
    delCustomValue(item, index) {
      item.splice(index, 1)
    },
    confirmChangeValue(pro, item) {
      if (this.changeValue === '') {
        return false
      }
      var flag = false
      pro.items.map((item) => {
        if (item.value === this.changeValue) {
          flag = true
        }
      })
      if (flag) {
        return this.$message(`${pro.attName}下已经存在${this.changeValue}`)
      }
      item.value = this.changeValue
      this.changeValue = ''
      document.body.click()
    },
    // 关闭自定义属性模态框
    closeAttributeModal(newAtt) {
      if (newAtt) {
        const att = {
          attName: newAtt.attName,
          attType: 1,
          inputType: 1,
          items: [],
          isAdded: 0,
          enableAdd: 1
        }
        if (newAtt.attValueList.length > 0) {
          newAtt.attValueList.map((item) => {
            att.items.push({
              checked: false,
              isAdded: 1,
              code: 'C' + this.$portal.getUuid(),
              value: item,
              addAttValue: ''
            })
          })
        } else {
          att.items.push({
            checked: false,
            isAdded: 1,
            code: 'C' + this.$portal.getUuid(),
            value: newAtt.attValue,
            addAttValue: ''
          })
        }
        this.mp.attributeEditVOS.push(att)
        this.dealInputType(this.mp.attributeEditVOS)
      }
    },
    dealInputType(val) {
      val.map((item) => {
        if (item.inputType === 2) {
          const selectItem = item.items.find((x) => x.checked)
          this.$set(item, 'select', selectItem && selectItem.code)
        } else if (item.inputType === 1) {
          this.$set(
            item,
            'checkbox',
            item.items.filter((x) => x.checked).map((x) => x.code)
          )
        }
      })
      return val
    },
    changeSelect(attribute, val) {
      attribute.items.forEach((x) => {
        x.checked = Array.isArray(val) ? val.includes(x.code) : x.code === val
      })
    },
    preSubmit() {}
  }
}
</script>
<style lang="scss" scoped>
// .ellipsis {
//   /deep/ .el-checkbox__label {
//     text-overflow: ellipsis;
//     overflow: hidden;
//     white-space: nowrap;
//     max-width: 180px;
//     vertical-align: middle;
//   }
// }
/deep/ .el-checkbox-group {
  font-size: 14px;
}
/deep/ .el-table__header-wrapper {
  .cell {
    height: 38px;
  }
}
.midden-button {
  padding: 20px !important;
  margin: 20px;
  background: rgba(255, 255, 255, 1) !important;
  border: 1px dashed rgba(24, 144, 255, 1);
  color: rgba(24, 144, 255, 1) !important;
  font-size: 15px;
  height: 30px !important;
  text-align: center;
}
.el-icon {
  cursor: pointer;
  &:hover {
    color: var(--themeColor);
  }
}
.spec-item {
  display: flex;
  margin: 20px 0 0 0;
  .spec-checkbox {
    position: relative;
    margin: 0 0 0 5px;
    padding: 0 0 0 10px;
    width: 800px;
    min-height: 50px;
    line-height: 50px;
    background: rgba(248, 249, 250, 1);
    border: 1px solid rgba(238, 245, 249, 1);
    .el-select {
      width: 200px;
    }
    .del-item {
      position: absolute;
      z-index: 99;
      top: -6px;
      right: 10px;
      cursor: pointer;
      &:hover {
        color: var(--themeColor);
      }
    }
  }
}
.add-attr {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .add-attr-input {
    margin: 0 10px 0 0;
    width: 200px;
  }
}
.btn-custom {
  margin: 20px 0 20px 141px;
  .add-custom-btn {
    display: inline-block;
    width: 130px;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    color: var(--themeColor90);
    border: 1px dashed var(--themeColor90);
    &:hover {
      color: var(--themeColor);
      border: 1px dashed var(--themeColor);
    }
  }
}
.box-box{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  .box-big{
    margin-right: 10px;
  }
  .box{
    display: flex;
    align-items: center;
    max-width: 750px;
    /deep/ .el-checkbox {
      white-space: unset !important;
      width: 100%;
    }
    /deep/ .el-checkbox__label{
      white-space: unset !important;
      max-width: 95%;
    }
    i{
      margin-left: 10px;
    }
  }
}
</style>

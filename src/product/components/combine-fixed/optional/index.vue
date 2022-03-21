<template>
  <div class="combine-fixed">
    <div class>
      <ody-tip-star :content="$t('分组名称：')" class="cf-search-label" />
      <!-- <span class="cf-search-name" >{{ itemInfo.name }}</span> -->
      <el-input v-model="groupName" :placeholder="$t('请输入分组名称')" name="groupName" class="grouName" />
    </div>
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <ody-tip-star :content="$t('选择设置：  ')" />
      <el-checkbox v-model="checkSet" name="checkSet">{{ $t('允许重复选购同一商品') }}</el-checkbox>
      <div class="mustSelect">
        <ody-tip-star :content="$t('必选：')" />
        <ody-input-number v-model="positiveInteger" name="positiveInteger" />件
      </div>
    </el-form>
    <ody-table
      :data="itemInfo.tableList"
      :columns="columnsTable"
      :can-filter="false"
      :key="key"
      :index="itemIndex"
      :operates="operates"
      name="itemInfo_tableList341"
    >
      <template slot="num" slot-scope="scope">
        <el-input v-model="scope.row.num" name="scope_row_num" class="table-class-input" />
      </template>
      <template slot="addPrice" slot-scope="scope">
        <el-input v-model="scope.row.addPrice" name="scope_row_addPrice" />
      </template>
      <template slot="move" slot-scope="scope">
        <!-- 上移 -->
        <i name="down" class="el-icon-bottom el-icon" @click="down(scope.$index)" />
        <!-- 下移 -->
        <i name="up" class="el-icon-top el-icon" @click="up(scope.$index)" />
        <!-- 置顶 -->
        <i name="upTop" class="el-icon-upload2 el-icon" @click="upTop(scope.$index)" />
        <!-- 沉底 -->
        <i name="downBottom" class="el-icon-download el-icon" @click="downBottom(scope.$index)" />
      </template>
    </ody-table>
    <div class="cf-add-sku">
      <el-button
        ref="test111"
        name="visible"
        size="mini"
        type="text"
        icon="el-icon-plus"
        class="is-readonly"
        @click="visible=true"
      >添加SKU</el-button>
      <ody-choose
        v-if="visible"
        :checked="checked"
        :search-config="searchConfig"
        :request-url="requestUrl"
        :columns="columns"
        :search-value="searchValue"
        :multiple="true"
        :title="$t('商品列表')"
        choose-key="userId"
        @close="handleClose"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemInfo: {
      type: Object,
      require: true,
      default: () => {}
    },
    itemIndex: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      key: 1,
      groupName: '', // 分组名称
      positiveInteger: '', // 必须数量
      checkSet: false,
      checked: [],
      visible: false,
      requestUrl: '/ouser-web/member/queryMemberList.do',
      searchConfig: [
        {
          label: '商品名称',
          prop: 'userId',
          type: 'input'
        },
        {
          label: '商品编码',
          prop: 'productCode',
          type: 'input'
        },
        {
          label: '商品条码',
          prop: 'productTm',
          type: 'input'
        },
        {
          label: '商品类目',
          prop: 'productCategory',
          type: 'input'
        },
        {
          label: '商品品牌',
          prop: 'productProd',
          type: 'input'
        }
      ],
      searchValue: {
        // value中的字段和后台请求的字段以及config中的字段要对应 时间除外
        userId: '',
        isAvailable: ''
      },
      columnsTable: [
        {
          label: '商品名称',
          prop: 'productName',
          show: true,
          minwidth: 180
        },
        {
          slot: 'num',
          label: '数量',
          prop: 'num',
          show: true,
          minwidth: 180
        },
        {
          label: '零售单价',
          prop: 'price',
          show: true,
          minwidth: 180
        },
        {
          slot: 'addPrice',
          label: '加价',
          prop: 'addPrice',
          show: true,
          minwidth: 180
        },
        {
          label: '移动',
          prop: 'move',
          show: true,
          slot: 'move',
          minwidth: 180
        }
      ],
      columns: [
        {
          label: '商品名称',
          prop: 'userId',
          show: true
        },
        {
          label: '商品编码',
          prop: 'productCode',
          show: true
        },
        {
          label: '商品条码',
          prop: 'productTm',
          show: true
        },
        {
          label: '商品类目',
          prop: 'productCategory',
          show: true
        },
        {
          label: '商品品牌',
          prop: 'productProd',
          show: true
        }
      ],
      operates: {
        width: 150,
        fixed: 'right',
        list: [
          {
            label: '删除',
            disabled: false,
            method: (index, row) => {
              this.deleteRole(index, row)
            }
          }
        ]
      }
    }
  },

  mounted() {
    // console.log(this.itemInfo)
    // console.log(this.$refs['test111'], 11111111)
  },
  methods: {
    // 删除一条数据
    delFixed(itemInfo, index) {
      console.log(itemInfo, index)
    },
    handleClose() {
      this.visible = false
    },
    handleSubmit(val) {
      this.checked = val
      this.visible = false
      if (val.length > 0) {
        this.$emit('addSku', val, this.itemIndex)
      }
    },
    // 删除
    deleteRole(index, row) {
      this.$emit('delRow', index, row)
    },
    normalizer(node) {
      return {
        id: node.b,
        label: node.b
      }
    },
    // 下移
    down(index) {
      var arrs = this.itemInfo.tableList
      var length = arrs.length - 1
      if (length === index) return false
      ;[arrs[index], arrs[index + 1]] = [arrs[index + 1], arrs[index]]
      this.$set(this.itemInfo.tableList, arrs)
      this.key += 1
    },

    // 上移
    up(index) {
      var arrs = this.itemInfo.tableList
      if (index === '0') return false
      ;[arrs[index], arrs[index - 1]] = [arrs[index - 1], arrs[index]]
      this.$set(this.itemInfo.tableList, arrs)
      this.key += 1
    },
    // 沉底
    downBottom(index) {
      var arrs = this.itemInfo.tableList
      var length = arrs.length - 1
      if (length === index) return false
      ;[arrs[index], arrs[length]] = [arrs[length], arrs[index]]
      this.$set(this.itemInfo.tableList, arrs)
      this.key += 1
    },

    // 置顶
    upTop(index) {
      var arrs = this.itemInfo.tableList
      if (index === '0') return false
      ;[arrs[index], arrs[0]] = [arrs[0], arrs[index]]
      this.$set(this.itemInfo.tableList, arrs)
      this.key += 1
    }
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       alert('submit')
    //     } else {
    //       console.log('error submit!')
    //       return false
    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
.combine-fixed {
  display: block;
  clear: both;
  /* width:740px; */
  border: 1px solid rgba(206, 212, 218, 1);
  background: #fff;
  margin: 0 auto;
  padding: 20px;
  margin-top: 20px;
}
.cf-search-label {
  font-size: 14px;
  color: #455a64;
  text-align: right;
  margin-right: 10px;
}
.cf-search-name {
  display: inline-block;
  font-size: 14px;
  color: #697a82;
  height: 32px;
  border: 1px solid #ced4da;
  line-height: 32px;
  width: 300px;
  padding-left: 8px;
  margin-left: 6px;
  margin-top: 20px;
}
.cf-add-sku {
  font-size: 12px;
  color: #1890ff;
  text-align: left;
  margin-top: 15px;
}
.demo-ruleForm {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.mustSelect {
  margin-left: 60px;
}
.el-input--medium {
  width: 100px;
}
.el-input_inner {
  width: 100px;
  margin: 0px 5px;
}
.grouName {
  width: 200px;
}
/deep/.table-class-input {
  .el-input__inner {
    width: 100px !important;
    margin: auto;
  }
}
/deep/.el_table_9_column_49 {
  text-align: center;
}
.cf-add-sku {
  .is-readonly {
    /deep/ {
      .el-input__inner {
        // background: #eef5f9;
        background: rgba(24, 144, 255, 1) !important;
      }
    }
  }
  .el-button--text {
    color: rgba(24, 144, 255, 1) !important;
    min-width: 50px !important;
  }
}
</style>

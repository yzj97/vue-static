<template>
  <div class="combine-fixed">
    <div class="">
      <ody-tip-star :content="$t('分组名称:')" class="cf-search-label"/>
      <el-input v-model="innerGroupName" :placeholder="$t('请输入分组名称')" name="innerGroupName" class="grouName"/>
    </div>
    <ody-table
      :data="itemInfo.tableList"
      :columns="columnsTable"
      :can-filter="false"
      :index="itemIndex"
      :operates="operates"
      :key="key"
      name="itemInfo_tableList848"
      class="combine-fixed-num"
    >
      <template slot="num" slot-scope="scope">
        <el-input v-model="scope.row.num" name="scope_row_num" />
      </template>
      <template slot="move" slot-scope="scope">
        <!-- {{ scope.$index }} -->
        <!-- 下移 -->
        <i name="down" class="el-icon-bottom el-icon" @click="down(scope.$index)" />
        <!-- 上移移 -->
        <i name="up" class="el-icon-top el-icon" @click="up(scope.$index)" />
        <!-- 置顶 -->
        <i name="upTop" class="el-icon-upload2 el-icon" @click="upTop(scope.$index)" />
        <!-- 沉底 -->
        <i name="downBottom" class="el-icon-download el-icon" @click="downBottom(scope.$index)" />
      </template>
    </ody-table>
    <div class="cf-add-sku">
      <el-button ref="test111" name="visible" size="mini" type="text" icon="el-icon-plus" class="is-readonly" @click="visible=true" >添加SKU</el-button>
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
    },
    groupName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      key: 1,
      innerGroupName: '', // 分组名称
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
        }, {
          label: '零售总价',
          prop: 'totalPrice',
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
        list: [{
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
  watch: {
    groupName: {
      handler(val) {
        this.innerGroupName = val
        console.log(val)
      },
      // deep: true
      immediate: true
    }
  },

  mounted() {
    // console.log(this.itemInfo)
    // console.log(this.$refs['test111'], 11111111)
  },
  methods: {
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

    // 下移
    down(index) {
      var arrs = this.itemInfo.tableList
      var length = arrs.length - 1
      if (length === index) return false;
      [arrs[index], arrs[index + 1]] = [arrs[index + 1], arrs[index]]
      this.$set(this.itemInfo.tableList, arrs)
      this.key += 1
    },

    // 上移
    up(index) {
      var arrs = this.itemInfo.tableList
      if (index === '0') return false;
      [arrs[index], arrs[index - 1]] = [arrs[index - 1], arrs[index]]
      this.$set(this.itemInfo.tableList, arrs)
      this.key += 1
    },
    // 沉底
    downBottom(index) {
      var arrs = this.itemInfo.tableList
      var length = arrs.length - 1
      if (length === index) return false;
      [arrs[index], arrs[length]] = [arrs[length], arrs[index]]
      this.$set(this.itemInfo.tableList, arrs)
      this.key += 1
    },

    // 置顶
    upTop(index) {
      var arrs = this.itemInfo.tableList
      if (index === '0') return false;
      [arrs[index], arrs[0]] = [arrs[0], arrs[index]]
      this.$set(this.itemInfo.tableList, arrs)
      this.key += 1
    }

  }
}
</script>
<style lang="scss" scoped>
  .combine-fixed{
    display:block;
    clear:both;
    /* width:740px; */
    border:1px solid rgba(206,212,218,1);
    background:#fff;
    margin:0 auto;
    padding:20px;
    margin-top:20px;
  }
  .cf-search-label{
    font-size:14px;
    color:#455A64;
    text-align:right;
    margin-right:10px;
  }
  .cf-search-name{
    display:inline-block;
    font-size:14px;
    color:#697A82;
    height:32px;
    border:1px solid #CED4DA;
    line-height:32px;
    width:300px;
    padding-left:8px;
    margin-left:6px;
    margin-top:20px;
  }
  .cf-add-sku{
    font-size:12px;
    color:#1890FF;
    text-align:left;
    margin-top:15px;
  }
  /deep/.combine-fixed-num{
    .el-input--medium.el-input .el-input__inner{
       width: 100px !important;
    }
  }
  .grouName{
    width:200px;
  }
  .cf-add-sku {
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #eef5f9;
      }
    }
  }
  .el-button--text {
    color: rgba(24, 144, 255, 1) !important;
    min-width: 50px !important;
  }
}
</style>

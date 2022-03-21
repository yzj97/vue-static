<template>
  <span>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('关联后台类目')"
      width="90%"
    >
      <div class="content link-page">
        <div class="link-page__left" style="width: 50%">
          <div class="front-cate" style="width: 45%">
            <div class="cate-name">
              {{ categoryType === 2 ? $t("前台类目") : $t("店铺类目") }}
            </div>
            <el-input
              v-model="filterTextFront"
              :placeholder="$t('输入关键字进行过滤')"
              name="filterTextFront"
              class="input"
              @input="searchChange"
            />

            <el-tree
              ref="treeFront"
              :data="frontData"
              :props="defaultProps"
              :filter-node-method="filterNodeFront"
              name="frontData194"
              highlight-current
              node-key="id"
              default-expand-all
              class="filter-tree"
              @node-click="handleNodeClick"
            >
              <template slot-scope="{ node, data }">
                <el-tooltip
                  :content="data.name"
                  class="item"
                  effect="dark"
                  placement="top-start"
                >
                  <span>{{ data.name }}</span>
                </el-tooltip>
              </template>
            </el-tree>
          </div>
          <div class="behide-cate" style="width: 45%">
            <div class="cate-name">{{ $t("后台类目") }}</div>
            <el-input
              v-model="filterTextBehide"
              :placeholder="$t('输入关键字进行过滤')"
              name="filterTextBehide"
              class="input"
            />
            <!-- :filter-node-method="filterNodeBehide" -->
            <el-tree
              ref="treeBehide"
              :data="behideDataCopy"
              :props="defaultProps"
              name="behideData256"
              show-checkbox
              node-key="id"
              default-expand-all
              class="filter-tree"
            >
              <template slot-scope="{ node, data }">
                <el-tooltip
                  :content="data.name"
                  class="item"
                  effect="dark"
                  placement="top-start"
                >
                  <span>{{ data.name }}</span>
                </el-tooltip>
              </template>
            </el-tree>
          </div>
        </div>
        <div class="link-page__right">
          <div class="table-box">
            <el-button
              name="getLink"
              size="mini"
              type="primary"
              @click="getLink"
            >{{ $t("关联") }}</el-button
            >
            <el-row>
              <el-col :span="19">
                <div class="table-title">{{ $t("关联的后台类目列表") }}</div>
              </el-col>
              <el-col :span="4">
                <el-button
                  name="handleBatchDetele"
                  size="small"
                  @click="handleBatchDetele"
                >{{ $t("批量解除关联") }}</el-button
                >
              </el-col>
            </el-row>
            <ody-table
              :checked.sync="tableChecked"
              :multiple="true"
              :data="tableList"
              :columns="columns"
              :can-filter="false"
              :operates="operates"
              name="tableList713"
            >
              <template
                slot="rightTreeNodeName"
                slot-scope="{ row: { rightTreeNodeName } }"
              >
                <el-tooltip
                  :content="rightTreeNodeName"
                  class="item"
                  effect="dark"
                  placement="top-start"
                >
                  <span>{{ rightTreeNodeName }}</span>
                </el-tooltip>
              </template>
            </ody-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{
          $t("取消")
        }}</el-button>
        <el-button
          name="handleOk"
          size="small"
          type="primary"
          @click="handleOk"
        >{{ $t("确认") }}</el-button
        >
      </span>
    </ody-dialog>
  </span>
</template>

<script>
import { isEqual } from 'lodash'
import { getSearchList } from './utils'
const frontData = []
let behideData = []
// const isGetNodeBehidecheckedList = [] // 选择搜索的所有内容
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: String,
      default: ''
    },
    maxSortValue: {
      type: Number,
      default: 0
    },
    categoryType: {
      type: Number,
      default: 2
    },
    merchantId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      frontDataChose: {},
      filterTextFront: '',
      filterTextBehide: '',
      frontData: frontData,
      behideDataCopy: [],
      isGetNodeBehide: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableList: [],
      tableChecked: [],
      columns: [
        {
          label: this.$t('前台类目名称'),
          prop: 'leftTreeNodeName',
          show: this.categoryType === 2,
          minWidth: 80
        },
        {
          label: this.$t('店铺类目名称'),
          prop: 'leftTreeNodeName',
          show: this.categoryType === 6,
          minWidth: 80
        },
        {
          label: this.$t('后台类目名称'),
          slot: 'rightTreeNodeName',
          prop: 'rightTreeNodeName',
          show: true,
          minWidth: 80
        }
      ],
      operates: {
        width: 80,
        fixed: 'right',
        list: [
          {
            label: this.$t('解除关联'),
            method: (index, row) => {
              this.tableList.splice(index, 1)
            }
          }
        ]
      }
    }
  },
  watch: {
    /*    filterTextFront(val) {
      this.$refs.treeFront.filter(val)
    },*/
    filterTextBehide(val) {
      debugger
      // this.$refs.treeBehide.filter(val)
      const newData = JSON.parse(JSON.stringify(behideData))
      const list = getSearchList(newData, val)
      this.behideDataCopy = list
      // this.$refs.treeBehide.setCheckedKeys(
      //   getCheckList(this.behideDataCopy),
      //   true
      // )

      this.$forceUpdate()
    }
  },
  mounted() {
    this.mpApi = this.$product.$api.mpApi
    this.queryTree()
    if (this.categoryType === 2) {
      this.queryBackTree({})
    } else {
      this.queryBackTree({ merchantId: this.merchantId })
    }
  },
  methods: {
    searchChange() {
      this.queryTree()
    },
    queryTree() {
      this.mpApi.listCategoryTree({ id: this.categoryId, name: this.filterTextFront }).then((res) => {
        if (res.data === null) {
          this.frontData = []
        } else {
          this.frontData = new Array(res.data)
        }
      })
    },
    queryBackTree(query) {
      this.mpApi.listBackCategoryTree(query).then((res) => {
        // this.behideData = new Array(res.data)
        behideData = new Array(res.data)
        this.behideDataCopy = new Array(res.data)
      })
    },
    handleNodeClick(data) {
      this.frontDataChose = data
    },
    resetChecked() {
      this.$refs.treeBehide.setCheckedKeys([])
    },
    getLink() {
      const behideDataChose = this.$refs.treeBehide.getCheckedNodes(
        false,
        true
      )
      if (
        Object.keys(this.frontDataChose).length === 0 ||
        (this.frontDataChose.children &&
          this.frontDataChose.children.length > 0)
      ) {
        this.$message({
          showClose: true,
          message: this.$t('前台类目不是叶子节点'),
          type: 'error'
        })
        return false
      }
      var arr = []
      behideDataChose.map((item) => {
        if (item.children && item.children.length > 0) {
          return
        } else {
          arr.push({
            leftTreeNodeName: this.frontDataChose[this.defaultProps.label],
            leftTreeNodeId: this.frontDataChose.id,
            rightTreeNodeName: item[this.defaultProps.label],
            rightTreeNodeId: item.id,
            sortValue: this.maxSortValue++
          })
        }
      })
      var duplicateArr = [...this.tableList, ...arr]
      for (let i = 0; i < duplicateArr.length; i++) {
        for (let j = i + 1; j < duplicateArr.length; j++) {
          if (
            duplicateArr[i].leftTreeNodeId === duplicateArr[j].leftTreeNodeId &&
            duplicateArr[i].rightTreeNodeId === duplicateArr[j].rightTreeNodeId
          ) {
            duplicateArr.splice(j, 1)
            j--
          }
        }
      }
      this.tableList = JSON.parse(JSON.stringify(duplicateArr))
      this.resetChecked()
    },
    filterNodeFront(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // filterNodeBehide(value, data) {
    //   if (!value) return true
    //   // if (data.name.indexOf(value) !== -1 && (!data.children || !data.children.length > 0)) {
    //   //   const ids = data.fullIdPath.split('>')[data.fullIdPath.split('>').length - 1]
    //   //   isGetNodeBehidecheckedList.push(ids)
    //   //   this.$refs.treeBehide.setCheckedKeys(isGetNodeBehidecheckedList, true)
    //   // }
    //   // return data.name.indexOf(value) !== -1
    // },
    handleBatchDetele() {
      this.tableChecked.map((item) => {
        for (let i = 0; i < this.tableList.length; i++) {
          if (isEqual(item, this.tableList[i])) {
            this.tableList.splice(i, 1)
            break
          }
        }
      })
      this.tableChecked = []
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk() {
      this.loading = true
      if (this.tableList.length === 0) {
        this.$message({
          showClose: true,
          message: this.$t('请选择需要关联的类目和后台类目'),
          type: 'warn'
        })
        return
      }
      try {
        const res = await this.mpApi.aggregationBatchBackGroundNode(
          this.tableList
        )
        if (res.code === '0') {
          this.$emit('update:visible', !this.visible)
          this.$emit('ok')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.link-page {
  min-height: 400px;
  // display:table-row;
  display: flex;
  &__left {
    width: 490px;
  }
  &__right {
    flex: 1;
    // display:table-cell; *display:inline-block; width:2000px; *width:auto;
  }
  .front-cate,
  .behide-cate {
    width: 100%;
    border: 1px solid #f1f1f1;
    float: left;
    .input {
      width: 90%;
      margin: 0 0 6px 8px;
    }
    .cate-name {
      height: 46px;
      line-height: 46px;
      background: rgba(248, 249, 250, 1);
      text-indent: 10px;
      margin: 0 0 10px 0;
    }
  }
  .table-box {
    .table-title {
      line-height: 40px;
    }
  }
}
</style>


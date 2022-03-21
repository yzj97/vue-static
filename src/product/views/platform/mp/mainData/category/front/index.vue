<template>
  <div class="front">
    <div class="front-left">
      <el-row>
        <el-col :span="5">{{ $t('类目树ID') }}:</el-col>
        <el-col :span="12">{{ categoryId }}</el-col>
      </el-row>
      <categoryTreeEdit
        :category-id="categoryId"
        :is-edit="!isView"
        @getData="getData"
        @toBatch="toBatch"
      />
    </div>
    <div class="front-right">
      <div class="category-detail">
        <h4>{{ $t('类目详情') }}</h4>
        <el-col :span="8">{{ $t('类目编码') }}：{{ detailInfo.categoryCode }}</el-col>
        <el-col :span="8">{{ $t('第三方编码') }}：{{ detailInfo.thirdCode }}</el-col>
        <el-row>
          <el-col :span="8">{{ $t('类目名称') }}：{{ detailInfo.name }}</el-col>
        </el-row>
        <el-row class="margin10">
          <el-col :span="8">{{ $t('类目名称') }}({{ lang }})：{{ detailInfo.nameLan2 }}</el-col>
          <el-col :span="8">{{ $t('状态') }}：{{ visibleMap[detailInfo.isVisible] }}</el-col>
          <el-col :span="8">
            {{ $t('图片') }}：
            <el-image :src="detailInfo.pictureUrl" fit="fill" style="width: 80px; height: 80px" >
              <div slot="error" class="image-slot"/>
            </el-image>
          </el-col>
        </el-row>
      </div>
      <ody-list-table-area v-if="detailInfo.isLeaves === 1">
        <div slot="tabs">
          <el-tabs v-model="activeName" name="activeName" @tab-click="handleTabsClick">
            <el-tab-pane v-if="detailInfo.isLeaves === 1" :label="$t('关联后台类目')" name="1" />
            <el-tab-pane v-if="detailInfo.isLeaves === 1" :label="$t('关联商品')" name="2" />
          </el-tabs>
        </div>
        <div v-if="activeName === '1' && !isView" slot="btn-bottom">
          <ody-button
            name="ProductCategoryListAssociationBackCategory_linkVisible"
            size="small"
            type="primary"
            code="ProductCategoryListAssociationBackCategory"
            @click="linkVisible=true"
          >{{ $t('关联后台类目') }}</ody-button>
          <ody-button
            name="ProductCategoryListUnassociateBackCategory_deleteRelations"
            size="small"
            type="primary"
            code="ProductCategoryListUnassociateBackCategory"
            @click="deleteRelations"
          >{{ $t('批量解除关联') }}</ody-button>
          <el-button-group>
            <ody-button
              name="ProductCategoryListAttributeImport_toMappingBatch"
              size="small"
              code="ProductCategoryListAttributeImport"
              @click="toMappingBatch"
            >{{ $t('批量导入') }}</ody-button>
            <ody-button
              name="ProductCategoryListViewTask_taskVisible"
              size="small"
              code="ProductCategoryListViewTask"
              @click="taskVisible=true"
            >{{ $t('查看任务') }}</ody-button>
          </el-button-group>
        </div>
        <div v-if="activeName === '1'" slot="table" :style="{pointerEvents: isView?'none':'auto'}">
          <ody-table
            :data="tableData"
            :columns="columns"
            :operates="operates"
            :can-filter="false"
            :checked.sync="selectedRelations"
            :multiple="true"
            name="tableData521"
          >
            <template slot="rightTreeNodeName" slot-scope="{ row: { rightTreeNodeName } }">
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
          <div slot="page">
            <ody-pagination
              :current-page.sync="page.currentPage"
              :list="tableData"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.itemsPerPage"
              :total.sync="page.total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handlePageSizeChange"
              @current-change="handlePageCurrentChange"
            />
          </div>
        </div>
        <div v-if="activeName === '2'" slot="table">
          <product-link-list :category-id="detailInfo.id" :data-type="2" :is-edit="!isView" />
        </div>
      </ody-list-table-area>
      <catagory-link-dialog
        v-if="linkVisible"
        :visible.sync="linkVisible"
        :category-id="categoryId"
        :max-sort-value="maxSortValue"
        @ok="linkCategory"
      />
      <importTask :import-type="importType" :is-data-task="true" :visible.sync="taskVisible" task-type="categoryMapping" />
    </div>
  </div>
</template>
<script>
import catagoryLinkDialog from '@/components/catagory-link-dialog'
import categoryTreeEdit from '@/components/category-tree-edit'
import importTask from '@/components/downloadTask/ImportTask.vue'
import productLinkList from '@/components/product-link-list'
export default {
  components: {
    categoryTreeEdit,
    catagoryLinkDialog,
    importTask,
    productLinkList
  },
  data() {
    return {
      AttrVisible: false,
      linkVisible: false,
      taskVisible: false,
      selectedRelations: [],
      visibleMap: { 0: this.$t('停用'), 1: this.$t('启用') },
      categoryId: this.$route.query.id,
      isView: this.$route.query.isView,
      importType: 8,
      lang: this.$t('第二语言'),
      detailInfo: {},
      activeName: '0',
      maxSortValue: 0,
      tableData: [],
      page: {
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
      },
      columns: [
        {
          label: this.$t('前台类目名称'),
          prop: 'leftTreeNodeName',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('后台类目名称'),
          prop: 'rightTreeNodeName',
          slot: 'rightTreeNodeName',
          align: 'center',
          show: true,
          minWidth: 160
        }
      ],
      operates: {
        align: 'center',
        width: 150,
        fixed: 'right',
        list: [
          {
            label: this.$t('解除关联'),
            method: (index, row) => {
              this.deleteRelation(row)
            },
            code: 'ProductCategoryListUnassociateBackCategory'
          }
        ]
      }
    }
  },
  mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      this.isView =
        typeof this.$route.query.isView === 'boolean'
          ? this.$route.query.isView
          : this.$route.query.isView !== 'false'
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async handleTabsClick() {
      console.log(this.activeName)
      if (this.activeName === '1') {
        this.loading = true
        try {
          const res = await this.mpApi.listQueryAggregationNode({
            leftTreeNodeId: this.detailInfo.id,
            currentPage: this.page.currentPage,
            itemsPerPage: this.page.itemsPerPage
          })
          this.tableData = res.data.listObj
          this.page.total = res.data.total
          this.tableData.map(item => {
            if (item.sortValue >= this.maxSortValue) {
              this.maxSortValue = item.sortValue + 1
            }
          })
        } finally {
          this.loading = false
        }
      }
    },
    cancel() {
      this.AttrVisible = false
    },
    getData(data) {
      this.detailInfo = data
      if (data.isLeaves === 1) {
        this.activeName = '1'
      } else {
        this.activeName = '0'
      }
      this.handleTabsClick()
    },
    ok() {
      this.AttrVisible = false
      console.log(this.selected)
    },
    linkCategory(data) {
      console.log(data)
      this.handleTabsClick()
    },
    async deleteRelation(data) {
      if (this.isView) {
        this.$message({
          showClose: true,
          message: this.$t('查看时不能操作解除关系'),
          type: 'success'
        })
        return
      }
      this.loading = true
      try {
        var request = {}
        request['leftTreeNodeId'] = this.detailInfo.id
        var rightTreeNodeIds = []
        rightTreeNodeIds.push(data.rightTreeNodeId)
        request['rightTreeNodeIds'] = rightTreeNodeIds
        const res = await this.mpApi.batchDeleteAggreationNode(request)
        if (res.code === '0') {
          this.$message({
            showClose: true,
            message: this.$t('删除成功'),
            type: 'success'
          })
          this.handleTabsClick()
        }
      } finally {
        this.loading = false
      }
    },
    async deleteRelations() {
      if (this.isView) {
        this.$message({
          showClose: true,
          message: this.$t('查看时不能操作解除关系'),
          type: 'success'
        })
        return
      }
      console.log(this.selectedRelations)
      if (this.selectedRelations.length === 0) {
        this.$message({
          showClose: true,
          message: this.$t('请选择要解除的关联关系'),
          type: 'success'
        })
        return
      }
      this.loading = true
      try {
        var request = {}
        request['leftTreeNodeId'] = this.detailInfo.id
        var rightTreeNodeIds = []
        this.selectedRelations.map(item => {
          rightTreeNodeIds.push(item.rightTreeNodeId)
        })
        request['rightTreeNodeIds'] = rightTreeNodeIds
        const res = await this.mpApi.batchDeleteAggreationNode(request)
        if (res.code === '0') {
          this.$message({
            showClose: true,
            message: this.$t('删除成功'),
            type: 'success'
          })
          this.handleTabsClick()
          this.selectedRelations = []
        }
      } finally {
        this.loading = false
      }
    },
    toMappingBatch() {
      this.$router.push({ name: 'ProductFrontCategoryMappingBatch' })
    },
    getTask(param) {
      const data = {
        currentPage: param.limitStart / param.limitCount + 1,
        itemsPerPage: param.limitCount,
        importType: this.importType // 前后台类目映射导入
      }
      return this.$product.$api.mpApi.listImportTaskByPage(data)
    },
    handlePageSizeChange() {
      this.handleTabsClick()
    },
    handlePageCurrentChange() {
      this.handleTabsClick()
    },
    toBatch(importType, taskType, categoryId) {
      this.$router.push({
        name: 'ProductCategoryBatch',
        query: { importType: importType, taskType: taskType, treeId: categoryId }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.front {
  display: flex;
  height: 700px;
  overflow-y: auto;
  .front-left {
    min-height: 700px;
    width: 400px;
    background: #ffffff;
    padding: 20px;
    overflow: auto;
  }
  .front-right {
    flex: 1;
    background: #ffffff;
    padding: 20px;
    min-height: 700px;
    margin-left: 1px;
    overflow-y: auto;
    .margin10 {
      margin: 10px 0 20px 0;
    }
    .category-detail {
      border-bottom: 1px solid #f1f1f1;

    }
  }
}
</style>

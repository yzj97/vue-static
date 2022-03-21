<template>
  <div class="behide">
    <div class="behide-left">
      <el-row>
        <el-col :span="5">{{ $t("类目树ID") }}:</el-col>
        <el-col :span="12">{{ categoryId }}</el-col>
      </el-row>
      <categoryTreeEdit
        :category-id="categoryId"
        :is-edit="!isView"
        @getData="getData"
        @toBatch="toBatch"
      />
    </div>
    <div class="behide-right">
      <div class="category-detail">
        <h4>{{ $t("类目详情") }}</h4>
        <el-row>
          <el-col
            :span="12"
          >{{ $t("类目编码") }}：{{ detailInfo.categoryCode }}</el-col
          >
          <el-col
            :span="12"
          >{{ $t("第三方编码") }}：{{ detailInfo.code }}</el-col
          >
          <el-col
            :span="12"
          >{{ $t("类目名称") }}：{{ detailInfo.name }}</el-col
          >
          <el-col
            :span="12"
          >{{ $t("类目名称") }}({{ lang }})：{{ detailInfo.nameLan2 }}</el-col
          >
          <el-col
            :span="12"
          >{{ $t("商品价格范围") }}：{{ detailInfo.lowPrice }}-{{
            detailInfo.highPrice
          }}</el-col
          >
          <el-col
            :span="12"
          >{{ $t("允许自定义属性") }}：{{
            yesNoMap[detailInfo.enableAddAtt]
          }}</el-col
          >
        </el-row>
      </div>
      <ody-list-table-area :hidden="detailInfo.isLeaves !== 1">
        <div slot="tabs">
          <el-tabs
            v-model="attType"
            name="attType"
            @tab-click="handleTabsClick"
          >
            <el-tab-pane :label="$t('商品属性')" name="1" />
            <el-tab-pane :label="$t('销售属性')" name="2" />
          </el-tabs>
        </div>
        <div slot="btn-bottom">
          <ody-button
            v-if="!isView"
            name="ProductCategoryListAttributeAdd_AttrVisible"
            size="small"
            type="primary"
            code="ProductCategoryListAttributeAdd"
            @click="AttrVisible = true"
          >{{ $t("新增属性项") }}</ody-button
          >
        </div>
        <div slot="table" :style="{ pointerEvents: isView ? 'none' : 'auto' }">
          <ody-table
            :data="tableData"
            :columns="columns"
            :operates="operates"
            :can-filter="false"
            name="tableData031"
          >
            <template slot="guide" slot-scope="scope">
              <el-switch
                v-model="scope.row.type"
                :active-value="4"
                :inactive-value="1"
                name="scope_row_type"
                @change="handleExpandChange"
              />
            </template>
            <template
              v-if="$portal.hasPermission('ProductCategoryListAttributeMove')"
              slot="move"
              slot-scope="scope"
            >
              <!-- 向上 -->
              <i
                v-if="scope.row.sortValue > 1"
                name="upSort"
                class="el-icon-arrow-up"
                style="font-size: 14px"
                @click="upSort(scope.$index)"
              />
              <!-- 向下 -->
              <i
                v-if="scope.row.sortValue != maxSortValue - 1"
                name="downSort"
                class="el-icon-arrow-down"
                style="font-size: 14px"
                @click="downSort(scope.$index)"
              />
              <!-- 置顶 -->
              <i
                v-if="scope.row.sortValue > 1"
                name="topSort"
                class="el-icon-caret-top"
                style="font-size: 14px"
                @click="topSort(scope.$index)"
              />
              <!-- 置底 -->
              <i
                v-if="scope.row.sortValue != maxSortValue - 1"
                name="bottomSort"
                class="el-icon-caret-bottom"
                style="font-size: 14px"
                @click="bottomSort(scope.$index)"
              />
            </template>
          </ody-table>
        </div>
      </ody-list-table-area>
      <category-attar-dialog
        v-if="AttrVisible"
        :visible="AttrVisible"
        :selected.sync="selected"
        :multiple="true"
        :att-type="attType"
        :disabled-id-list="currentAttrIdList"
        choose-key="id"
        @cancel="cancel"
        @ok="ok"
      />
    </div>
  </div>
</template>
<script>
import categoryTreeEdit from '@/components/category-tree-edit'
import categoryAttarDialog from '@/components/category-attar-dialog'
import mpConstant from '@/constant/mpConstant.js'
export default {
  components: {
    categoryTreeEdit,
    categoryAttarDialog
  },
  data() {
    return {
      AttrVisible: false,
      selected: [],
      maxSortValue: 0,
      typeMap: mpConstant.ATTRIBUTE_INPUT_TYPE,
      yesNoMap: mpConstant.YES_NO,
      categoryId: this.$route.query.id,
      isView: this.$route.query.isView,
      detailInfo: {},
      lang: this.$t('第二语言'),
      attType: '1',
      tableData: [],
      currentAttrIdList: [],
      columns: [
        {
          label: this.$t('属性项名称'),
          prop: 'name',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('属性值'),
          prop: 'attributeValuesStr',
          align: 'center',
          show: true,
          minWidth: 160
        },
        {
          label: this.$t('属性值说明'),
          prop: 'inputType',
          align: 'center',
          minWidth: 200,
          show: true,
          formatter: (row) => {
            return this.typeMap[row.inputType]
          }
        },
        {
          label: this.$t('导购'),
          prop: 'type',
          align: 'center',
          slot: 'guide',
          minWidth: 120,
          show: true
        },
        {
          label: this.$t('移动'),
          align: 'center',
          slot: 'move',
          minWidth: 120,
          show: true
        }
      ],
      operates: {
        align: 'center',
        width: 150,
        fixed: 'right',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              this.$confirm(
                this.$t('contract_isConfirmDelete'),
                this.$t('提示'),
                {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                }
              )
                .then(() => {
                  this.deleteAttribute(index, row)
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: this.$t('已取消')
                  })
                })
            },
            code: 'ProductCategoryListAttributeDelete'
          }
        ]
      }
    }
  },
  async mounted() {
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
      this.loading = true
      try {
        const res = await this.mpApi.listCategoryAttributes({
          categoryId: this.detailInfo.id,
          attType: this.attType
        })
        this.tableData = res.data
        this.maxSortValue = this.tableData.length + 1
        this.currentAttrIdList = []
        this.tableData.map((item) => {
          this.currentAttrIdList.push(item.attNameId)
        })
      } finally {
        this.loading = false
      }
    },
    cancel() {
      this.AttrVisible = false
    },
    async ok() {
      this.AttrVisible = false
      this.selected.map((item) => {
        item.categoryId = this.detailInfo.id
        item.attNameId = item.id
        item.id = null
        item.type = 1
        item.sortValue = this.maxSortValue++
      })
      if (this.selected.length > 0) {
        const res = await this.mpApi.addCategoryAttributes(this.selected)
        if (res.code === '0') {
          this.handleTabsClick()
        }
        this.selected = []
      }
    },
    getData(data) {
      this.detailInfo = data
      this.handleTabsClick()
    },
    async handleExpandChange() {
      if (this.tableData.length > 0) {
        const res = await this.mpApi.updateCategoryAttributes(this.tableData)
        if (res.code === '0') {
          this.handleTabsClick()
        }
      }
    },
    async deleteAttribute(index, data) {
      const res = await this.mpApi.deleteCategoryAttribute(data)
      if (res.code === '0') {
        this.tableData.splice(index, 1)
        this.updateAttrs()
      }
    },
    async updateAttrs() {
      let index = 1
      if (this.tableData.length > 0) {
        this.tableData.map((item) => {
          item.sortValue = index++
        })
      }
      this.maxSortValue = index
      if (this.tableData.length > 0) {
        const res = await this.mpApi.updateCategoryAttributes(this.tableData)
        if (res.code === '0') {
          this.handleTabsClick()
        }
      }
    },
    downSort(index) {
      var tmp = this.tableData[index + 1]
      this.$set(this.tableData, index + 1, this.tableData[index])
      this.$set(this.tableData, index, tmp)
      this.updateAttrs()
    },
    upSort(index) {
      var tmp = this.tableData[index - 1]
      this.$set(this.tableData, index - 1, this.tableData[index])
      this.$set(this.tableData, index, tmp)
      this.updateAttrs()
    },
    topSort(index) {
      var tmp = this.tableData[index]
      for (let i = index; i >= 0; i--) {
        this.$set(this.tableData, i, this.tableData[i - 1])
      }
      this.$set(this.tableData, 0, tmp)
      this.updateAttrs()
    },
    bottomSort(index) {
      var tmp = this.tableData[index]
      for (let i = index; i < this.tableData.length - 1; i++) {
        this.$set(this.tableData, i, this.tableData[i + 1])
      }
      this.$set(this.tableData, this.tableData.length - 1, tmp)
      this.updateAttrs()
    },
    toBatch(importType, taskType, categoryId) {
      if (this.$portal.hasPermission('ProductCategoryListAttributeImport')) {
        this.$router.push({
          name: 'ProductCategoryBatch',
          query: {
            importType: importType,
            taskType: taskType,
            treeId: categoryId
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.behide {
  display: flex;
  width: 100%;
  height: 700px;
  .behide-left {
    min-height: 700px;
    width: 400px;
    background: #ffffff;
    padding: 20px;
    overflow: auto;
  }
  .behide-right {
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
/deep/ .el-tabs__active-bar {
  min-width: 56px !important;
}
</style>

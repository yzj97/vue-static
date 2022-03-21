<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('属性名称') + ':'" prop="name">
            <el-input v-model="queryParam.name" name="queryParam_name" />
          </ody-search-item>
          <ody-search-item :label="$t('属性类型') + ':'" prop="attType">
            <el-select v-model="queryParam.attType" :placeholder="$t('common_all')" name="queryParam_attType" clearable>
              <el-option
                v-for="item in type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{
          $t("重置")
        }}</el-button>
        <ody-button
          name="Product1002Query_handleQuery"
          size="small"
          type="primary"
          code="Product1002Query"
          @click="handleQuery"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom" align="left" style="margin-bottom:10px">
        <!-- <router-link
          :to="{ path: '/back-product-static/platfrom/mp/mainData/attribute/edit', query: {viewStatus: 1}}"
        >
          <ody-button name="Product1002Add" size="small" type="primary" code="Product1002Add">{{ $t('新增') }}</ody-button>
        </router-link> -->
        <ody-button
          name="Product1002Add_openAdd"
          size="small"
          type="primary"
          code="Product1002Add"
          @click="openAdd"
        >{{ $t("新增") }}</ody-button
        >
        <ody-button
          name="Product1002Delete_batchDel"
          size="small"
          code="Product1002Delete"
          @click="batchDel"
        >{{ $t("批量删除") }}</ody-button
        >
        <ody-button
          name="Product1002Import_toBatch"
          size="small"
          code="Product1002Import"
          @click="toBatch"
        >{{ $t("批量导入") }}</ody-button
        >
        <ody-button
          name="Product1002ViewTask_taskVisible"
          size="small"
          code="Product1002ViewTask"
          @click="taskVisible = true"
        >{{ $t("查看任务") }}</ody-button
        >
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          :can-filter="true"
          name="list179"
          @custom-sort-change="hanleCustomSortChange"
          @selection-change="handleSelectionChange"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="change"
          @current-change="queryList"
        />
      </div>
    </ody-list-table-area>
    <importTask
      :import-type="2"
      :is-data-task="true"
      :visible.sync="taskVisible"
      task-type="attributeImport"
    />
  </section>
</template>

<script>
import importTask from '@/components/downloadTask/ImportTask.vue'
import mpConstant from '@/constant/mpConstant.js'
export default {
  name: 'Product1002',
  components: { importTask },
  data() {
    return {
      taskVisible: false,
      loading: false,
      checked: [],
      delList: [],
      typeMap: mpConstant.ATTRIBUTE_NAME_TYPE,
      type: [
        {
          label: this.$t('商品属性'),
          value: 1
        },
        {
          label: this.$t('销售属性'),
          value: 2
        }
      ],
      list: [],
      queryParam: {
        level: 0
      },
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      columns: [
        {
          show: true,
          prop: 'name',
          label: this.$t('属性名称'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return (
              <div on-click={e => this.queryAttrInfo(params.row)}>
                <span style='white-space: nowrap;color: dodgerblue;'>
                  {params.row.name}
                </span>
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'nameLan2',
          label: this.$t('属性名称(第二语言)'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'attributeValuesStr',
          label: this.$t('属性值'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'attributeValueLan2Str',
          label: this.$t('属性值(第二语言)'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'attType',
          label: this.$t('属性类型'),
          align: 'center',
          minWidth: 200,
          formatter: row => {
            return this.typeMap[row.attType]
          }
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('编辑'),
            disabled: false,
            method: (index, row) => {
              this.handleEdit(index, row)
            },
            code: 'Product1002Edit'
          },
          {
            label: this.$t('删除'),
            disabled: false,
            method: (index, row) => {
              this.handleDel(index, row)
            },
            code: 'Product1002Delete'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
    },
    reset() {
      this.queryParam = {
        level: 0
      }
    },
    change(val) {
      this.page.itemsPerPage = val
      this.queryList()
    },
    async queryList(obj = {}) {
      const param = Object.assign({}, this.queryParam, this.page, obj)

      this.loading = true
      try {
        const res = await this.mpApi.queryAttributeByPage(param)
        this.list = res.data.listObj
        this.page.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    batchDel() {
      this.delList = []
      if (this.checked.length !== 0) {
        for (var item of this.checked) {
          this.delList.push(item)
        }
        this.doDelete()
      } else {
        this.$message({
          showClose: true,
          message: this.$t('未选中删除项')
        })
      }
    },
    doDelete() {
      this.$confirm(this.$t('确定删除吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        return this.mpApi.deleteAttribute(this.delList).then(res => {
          this.queryList()
          this.$message({
            type: 'success',
            message: this.$t('删除成功')
          })
        })
      })
    },
    handleDel(index, row) {
      this.delList = []
      this.delList.push(row)
      this.doDelete()
    },
    openAdd() {
      this.$router.push({
        path: '/back-product-static/platfrom/mp/mainData/attribute/edit',
        query: { viewStatus: 1 }
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/back-product-static/platfrom/mp/mainData/attribute/edit',
        query: { id: row.id, viewStatus: 3 }
      })
    },
    queryAttrInfo(row) {
      if (this.$portal.hasPermission('Product1002ViewDetail')) {
        this.$router.push({
          path: '/back-product-static/platfrom/mp/mainData/attribute/edit',
          query: { id: row.id, viewStatus: 2 }
        })
      }
    },
    toBatch() {
      this.$router.push({ name: 'ProductAttributeBatch' })
    }
  }
}
</script>

<style lang="scss" scoped></style>

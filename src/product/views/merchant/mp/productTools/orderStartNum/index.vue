<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <ody-merchant-select v-model="search.merchantId" name="search_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')+':'" prop="mpName">
            <el-input v-model="search.mpName" name="search_mpName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')+':'" prop="mpCode">
            <el-input v-model="search.mpCode" name="search_mpCode" />
          </ody-search-item>
          <ody-search-item :label="$t('起订量')+':'" prop="startNum">
            <ody-number-range v-model="search.startNum" name="search_startNum" range="[0, 9999999)" />
          </ody-search-item>
          <ody-search-item :label="$t('订货倍数')+':'" prop="multipleNum">
            <ody-number-range v-model="search.multipleNum" name="search_multipleNum" range="[0, 9999999)" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{
          $t("reset")
        }}</el-button>
        <ody-button
          name="OrderStartNumPageQuery_handleSelect"
          size="small"
          type="primary"
          code="OrderStartNumPageQuery"
          @click="handleSelect"
        >{{ $t("query") }}</ody-button
        >
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          :disabled="selected.length <= 0"
          name="OrderStartNumBatchSet_add"
          size="small"
          type="primary"
          code="OrderStartNumBatchSet"
          @click="add"
        >{{ $t("批量设置") }}</ody-button
        >
        <ody-button
          name="OrderStartNumImport_toBatch"
          size="small"
          code="OrderStartNumImport"
          @click="toBatch"
        >{{ $t("批量导入") }}</ody-button
        >
        <ody-button
          name="OrderStartNumViewTask_taskVisible"
          size="small"
          code="OrderStartNumViewTask"
          @click="taskVisible = true"
        >{{ $t("View_the_task") }}</ody-button
        >
      </div>
      <div slot="tabs">
        <el-tabs
          v-model="activeState"
          :size="'small'"
          name="activeState"
          @tab-click="tabChange"
        >
          <el-tab-pane :name="0" :label="$t('全部')" />
          <el-tab-pane :name="'1'" :label="$t('已设置')" />
          <el-tab-pane :name="'2'" :label="$t('未设置')" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="selected"
          :multiple="true"
          :columns="columns"
          :operates="operates"
          :data="tableList"
          name="tableList383"
        >
          <template slot="mpName" slot-scope="scope">
            <div>
              <div class="image-container">
                <el-image
                  :src="scope.row.pictureUrl || '/api/favicon.ico'"
                  :fit="'fill'"
                  style="width: 100px; height: 100px"
                />
              </div>
              <div class="name-container">
                <div class="link-name">
                  <el-link
                    v-if="$portal.hasPermission('OrderStartNumViewDetail')"
                    type="primary"
                  >
                    <router-link
                      :to="
                        $portal.hasPermission('OrderStartNumViewDetail')
                          ? {
                            name: 'ProductDetail',
                            query: {
                              id: scope.row.merchantProductId,
                              isView: true
                            }
                          }
                          : {}
                      "
                    >
                      <div>{{ scope.row.mpName }}</div>
                    </router-link>
                  </el-link>
                </div>
                <div class="name-tag">
                  <el-tag
                    v-if="scope.row.typeName"
                    size="mini"
                    effect="dark"
                    type="success"
                  >{{ scope.row.typeName }}</el-tag
                  >
                </div>
              </div>
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page="page.current"
          :list="tableList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="page.size"
          :total="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="page.handleSizeChange"
          @current-change="page.handleCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <importTask
      :import-type="10"
      :is-data-task="true"
      :visible.sync="taskVisible"
      task-type="mpPurchaseControl"
    />
    <ody-dialog
      :visible.sync="editVisible"
      :append-to-body="true"
      :title="$t('设置起订量')"
      width="680px"
      @open="init"
      @close="close"
    >
      <div style="height:45px">
        <el-form
          ref="ruleForm"
          :model="formData"
          :rules="rules"
          label-width="100px"
          class="form"
          style="font-size:0px"
        >
          <!--不要去除font-size，解决el-form-item换行问题-->
          <el-form-item
            :label="$t('起订量') + ':'"
            :title="$t('起订量')"
            prop="orderStartNum"
            style="width:50%;display:inline-block"
          >
            <ody-input-number
              v-model="formData.orderStartNum"
              :min="1"
              :max="999999999"
              :controls="false"
              name="formData_orderStartNum"
              size="small"
            />
            <el-tooltip class="item" effect="light" placement="bottom-start">
              <i class="el-icon-info" />
              <div slot="content">
                {{ $t("说明") }}:
                <br >
                {{ $t("设置起订量之后，顾客购买该商品的数量不得小于起订量。") }}
                <br >
                {{
                  $t("示例：起订量为设置为3，加入购物车后的数量自动变更为3。")
                }}
                <br >
                {{
                  $t(
                    "如果增加购买数量，购物车显示商品数量按1递增（4,5,6...）。"
                  )
                }}
                <br >
              </div>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            :label="$t('订货倍数') + ':'"
            :title="$t('订货倍数')"
            style="width:50%;display:inline-block"
          >
            <ody-input-number
              v-model="formData.orderMultipleNum"
              :min="1"
              :max="999999999"
              :controls="false"
              name="formData_orderMultipleNum"
              size="small"
            />
            <el-tooltip class="item" effect="light" placement="bottom-end">
              <i class="el-icon-info" />
              <div slot="content">
                {{ $t("说明") }}:
                <br >
                {{
                  $t(
                    "设置订货倍数之后，顾客购买该商品的数量必须是订货倍数的整数倍。"
                  )
                }}
                <br >
                {{
                  $t(
                    "示例1：订货倍数设置为3，则加车后的数量自动变更为3；如果增加购买数量，"
                  )
                }}
                <br >
                {{ $t("购物车显示商品数量按3递增（6,9,12...）。") }}
                <br >
                {{
                  $t(
                    "示例2：起订量设置为4，订货倍数设置为3，则加车后的数量自动变更为6；"
                  )
                }}
                <br >
                {{
                  $t("如果增加购买数量，购物车显示商品数量按3递增（9,12...）。")
                }}
                <br >
              </div>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          name="cancelEdit"
          size="small"
          @click="cancelEdit('ruleForm')"
        >{{ $t("取消") }}</el-button
        >
        <el-button
          name="saveEdit"
          size="small"
          type="primary"
          @click="saveEdit('ruleForm')"
        >{{ $t("确定") }}</el-button
        >
      </span>
    </ody-dialog>
  </section>
</template>

<script>
import importTask from '@/components/downloadTask/ImportTask.vue'

export default {
  name: 'OrderStartNum',
  components: { importTask },
  data() {
    const vue = this
    return {
      activeState: '0',
      editVisible: false,
      search: {
        mpName: null,
        mpCode: null,
        startNum: [],
        multipleNum: []
      },
      formData: {
        orderStartNum: 1,
        orderMultipleNum: 1
      },
      rules: {
        orderStartNum: [
          { required: true, message: '请输入起订量', trigger: 'blur' }
        ]
      },
      taskVisible: false,
      loading: false,
      tableList: [],
      selected: [],
      columns: [
        {
          show: true,
          label: vue.$t('商品名称'),
          prop: 'mpName',
          align: 'left',
          minWidth: 300,
          slot: 'mpName'
        },
        {
          show: true,
          label: vue.$t('商品编码') + '/' + vue.$t('货号'),
          prop: 'mpCode',
          minWidth: 200,
          render: (h, params) => {
            const codeComponent = (
              <div>
                <el-tag size='mini' effect='dark' type='success'>
                  {vue.$t('商')}
                </el-tag>
                {params.row.mpCode}
              </div>
            )
            let artNoComponent
            if (params.row.artNo) {
              artNoComponent = (
                <div>
                  <el-tag size='mini' effect='dark' type='success'>
                    {vue.$t('货')}
                  </el-tag>
                  {params.row.artNo}
                </div>
              )
            }
            return (
              <div>
                {codeComponent}
                {artNoComponent}
              </div>
            )
          }
        },
        {
          show: true,
          label: vue.$t('商家'),
          prop: 'merchantName',
          minWidth: 200
        },
        {
          show: true,
          label: vue.$t('起订量'),
          prop: 'orderStartNum'
        },
        {
          show: true,
          label: vue.$t('订货倍数'),
          prop: 'orderMultipleNum'
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: vue.$t('edit'),
            hidden: function(index, row) {
              return row.id == null
            },
            method: (index, row) => {
              this.editRowFun(row, index)
            },
            code: 'OrderStartNumEdit'
          },
          {
            label: vue.$t('清除'),
            hidden: function(index, row) {
              return row.id == null
            },
            method: (index, row) => {
              this.$confirm(this.$t('确认清除吗?'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              })
                .then(() => {
                  this.deleteRow(row, index)
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: this.$t('已取消')
                  })
                })
            },
            code: 'OrderStartNumDelete'
          }
        ]
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
        handleSizeChange(val) {
          vue.page.size = val
          vue.updateList()
        },
        handleCurrentChange(val) {
          vue.page.current = val
          vue.updateList()
        }
      },
      editRow: null
    }
  },
  async mounted() {
    this.updateList()
  },
  methods: {
    toBatch() {
      this.$router.push({ name: 'OrderStartNumBatch' })
    },
    handleReset() {
      this.search = {
        mpName: null,
        mpCode: null,
        startNum: [],
        multipleNum: []
      }
    },
    handleSelect() {
      this.page.current = 1
      this.updateList()
    },
    tabChange() {
      this.page.current = 1
      this.updateList()
    },
    async updateList() {
      const result = await this.$product.$api.mpApi.orderStartNumList({
        ...this.search,
        orderStartNumMin: this.search.startNum[0],
        orderStartNumMax: this.search.startNum[1],
        orderMultipleNumMin: this.search.multipleNum[0],
        orderMultipleNumMax: this.search.multipleNum[1],
        currentPage: this.page.current,
        itemsPerPage: this.page.size,
        tabType: this.activeState
      })
      if (result.code === '0') {
        this.tableList = result.data.listObj
        this.page.total = result.data.total
      }
    },
    async editRowFun(row, index) {
      this.formData = {
        orderStartNum: row.orderStartNum,
        orderMultipleNum: row.orderMultipleNum
      }
      this.editVisible = true
      this.editRow = row
    },
    async deleteRow(row, index) {
      try {
        row.isdelete = 1
        var res = await this.$product.$api.mpApi.orderStartNumUpdate(row)
        if (res && res.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
        }
      } finally {
        this.updateList()
      }
    },
    handleSelectionChange(val) {
      this.selected = val
    },
    add() {
      this.editVisible = true
    },
    init() {},
    close() {
      this.formData.orderStartNum = 1
      this.formData.orderMultipleNum = 1
      this.editRow = null
      this.editVisible = false
    },
    cancelEdit(formName) {
      this.$refs[formName].resetFields()
      this.close()
    },
    async saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.save()
        }
      })
    },
    async save() {
      if (this.editRow) {
        return this.edit()
      }
      const rows = this.selected
      rows.forEach(it => {
        it.orderStartNum = this.formData.orderStartNum
        it.orderMultipleNum = this.formData.orderMultipleNum
      })
      try {
        const result = await this.$product.$api.mpApi.orderStartNumSave(rows)
        this.$message({
          showClose: true,
          message: this.$t(result.code === '0' ? '新增成功' : '新增失败'),
          type: result.code === '0' ? 'success' : 'fail'
        })
      } catch (e) {
        this.$message({
          showClose: true,
          message: this.$t('新增失败'),
          type: 'fail'
        })
      } finally {
        this.close()
        this.updateList()
      }
    },
    async edit() {
      const row = {
        orderStartNum: this.formData.orderStartNum,
        orderMultipleNum: this.formData.orderMultipleNum,
        id: this.editRow.id
      }
      try {
        const result = await this.$product.$api.mpApi.orderStartNumUpdate(row)
        this.$message({
          showClose: true,
          message: this.$t(result.code === '0' ? '修改成功' : '修改失败'),
          type: result.code === '0' ? 'success' : 'fail'
        })
      } catch (e) {
        this.$message({
          showClose: true,
          message: this.$t('修改失败'),
          type: 'fail'
        })
      } finally {
        this.close()
        this.updateList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ {
  .el-form-item__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.image-container {
  float: left;
}
.name-container {
  margin-left: 100px;
  position: relative;
  height: 100px;
  padding: 5px;
}
.name-tag {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
.link-name {
  word-wrap: break-word;
  width: 220px;
  height: 70px;
  overflow: hidden;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>

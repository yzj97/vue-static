<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('商家') + ':'" label-width="100px" prop="merchantId">
            <ody-merchant-select
              v-model="search.merchantId"
              :item-disabled="checkItem"
              name="search_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')+':'" prop="mpName">
            <el-input v-model="search.mpName" name="search_mpName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')+':'" prop="mpCode">
            <el-input v-model="search.mpCode" name="search_mpCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品类型')+':'" prop="type">
            <el-select v-model="search.type" name="search_type">
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('辅计量单位')+':'" :title="$t('辅计量单位')" prop="unitCode">
            <el-select v-model="search.unitCode" :popper-append-to-body="false" name="search_unitCode" @change="selectUnit">
              <el-option
                v-for="(item, index) in unitList"
                :key="index"
                :label="
                  locale === 'zh_CN'
                    ? item.calculationUnitName
                    : item.calculationUnitNameLan2
                "
                :value="item.calculationUnitCode"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{
          $t("reset")
        }}</el-button>
        <ody-button
          name="CalcUnitPageQuery_handleSelect"
          size="small"
          type="primary"
          code="CalcUnitPageQuery"
          @click="handleSelect"
        >{{ $t("query") }}</ody-button
        >
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          :disabled="selected.length <= 0"
          name="CalcUnitAdd_addNew"
          size="small"
          type="primary"
          code="CalcUnitAdd"
          @click="addNew"
        >{{ $t("新增") }}</ody-button
        >
        <ody-button
          name="CalcUnitImport_toBatch"
          size="small"
          code="CalcUnitImport"
          @click="toBatch"
        >{{ $t("批量导入") }}</ody-button
        >
        <ody-button
          name="CalcUnitViewTask_taskVisible"
          size="small"
          code="CalcUnitViewTask"
          @click="taskVisible = true"
        >{{ $t("查看任务") }}</ody-button
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
          name="tableList711"
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
                  <el-link type="primary">
                    <router-link
                      :to="
                        $portal.hasPermission('CalcUnitViewDetail')
                          ? {
                            name: 'ProductDetail',
                            query: { id: scope.row.id, isView: true }
                          }
                          : {}
                      "
                    >
                      <el-tooltip placement="top">
                        <template slot="content">
                          <div>{{ scope.row.mpName }}</div>
                        </template>
                        <div>{{ scope.row.mpName }}</div>
                      </el-tooltip>
                    </router-link>
                  </el-link>
                </div>
                <div class="name-tag">
                  <el-tag
                    v-if="scope.row.typeStr"
                    size="mini"
                    effect="dark"
                    type="success"
                  >{{ scope.row.typeStr }}</el-tag
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
      :import-type="3"
      :is-data-task="true"
      :visible.sync="taskVisible"
      task-type="mpCalcUnitImport"
    />
    <unit-edit :dialog-visible.sync="dialogVisible" />
    <edit-mp-calc-unit
      :visible.sync="visible"
      :mp-name="mpName"
      :main-unit="mainUnit"
      :main-unit-code="mainUnitCode"
      :mp-unit="editMpUnitList"
      :unit-list="unitList2"
      @save="saveUnit"
    />
  </section>
</template>

<script>
import importTask from '@/components/downloadTask/ImportTask.vue'
import EditMpCalcUnit from './editMpCalcUnit'

export default {
  name: 'CalcUnit',
  components: { importTask, EditMpCalcUnit },
  data() {
    const vue = this
    return {
      locale: this.$portal.getLocale(),
      activeState: '0',
      mpId: null,
      mpName: null,
      mainUnit: null,
      mainUnitCode: null,
      visible: false,
      addModel: false,
      editMpUnitList: [],
      merchantMap: {},
      search: {
        mpName: null,
        mpCode: null,
        type: null,
        unitCode: null,
        unitId: null,
        merchantId: null
      },
      unitList: [],
      unitList2: [],
      typeList: [
        { code: 1, name: vue.$t('内贸商品') },
        { code: 32, name: vue.$t('餐饮商品') },
        { code: 31, name: vue.$t('称重商品') }
      ],
      taskVisible: false,
      loading: false,
      tableList: [],
      selected: [],
      columns: [
        {
          show: true,
          label: vue.$t('商品名称'),
          prop: 'mpName',
          minWidth: 200,
          tooltip: false,
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
          prop: 'merchantId',
          render: (h, params) => {
            return (
              <div>
                {vue.merchantMap[params.row.merchantId]
                  ? vue.merchantMap[params.row.merchantId].merchantName
                  : ''}
              </div>
            )
          }
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: vue.$t('edit'),
            method: (index, row) => {
              this.editRow(row, index)
            },
            code: 'CalcUnitEdit'
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
      }
    }
  },
  // watch: {
  //   'search.merchantId': {
  //     handler(value, oldValue) {
  //       if (value !== oldValue) {
  //         this.changeMerchant()
  //       }
  //     }
  //   }
  // },
  async mounted() {
    this.updateList()
    const result = await this.$product.$api.mpApi.calculationList()
    if (result.code === '0') {
      this.unitList.push(...result.data)
      this.unitList2.push(...result.data)
    }
  },
  methods: {
    checkItem(row, index) {
      this.merchantMap[row.merchantId] = row
      return false
    },
    selectUnit(unitCode) {
      if (unitCode) {
        this.search.unitId = this.unitList.find(
          unit => unit.calculationUnitCode === unitCode
        ).id
      } else {
        this.search.unitId = null
        this.search.unitCode = null
      }
    },
    toBatch() {
      this.$router.push({ name: 'CalcUnitBatch' })
    },
    handleReset() {
      this.search = {
        mpName: null,
        mpCode: null,
        type: null,
        unitCode: null,
        unitId: null,
        merchantId: null
      }
    },
    handleSelectionChange(val) {
      this.selected = val
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
      const result = await this.$product.$api.mpApi.mpCalcUnitList({
        ...this.search,
        currentPage: this.page.current,
        itemsPerPage: this.page.size,
        tabType: this.activeState,
        typeOfProducts: [0, 2, 4]
      })
      if (result.code === '0') {
        this.tableList = result.data.listObj
        this.page.total = result.data.total
      }
    },
    addNew() {
      this.addModel = true
      this.mpName = null
      this.mpId = null
      this.mainUnit = null
      this.mainUnitCode = null
      this.editMpUnitList = []
      this.visible = true
    },
    async editRow(row, index) {
      this.addModel = false
      const result = await this.$product.$api.mpApi.listMpCalcUnitByMpIds({
        mpIds: [row.id]
      })
      this.editMpUnitList = result.data
        .map(it => {
          it.calculationUnitCode = it.unitCode
          it.calculationUnitName = it.measurementUnit
          it.rate = it.conversionRate
          if (it.isStandard === 1) {
            this.mainUnitCode = it.unitCode
            this.mainUnit = it.measurementUnit
          }
          return it
        })
        .filter(it => it.isStandard !== 1)
      this.mpName = row.mpName
      this.mpId = row.id
      this.visible = true
    },
    async saveUnit(unitList) {
      let ids
      if (this.addModel) {
        if (unitList.length <= 0) {
          this.$message({
            showClose: true,
            message: this.$t('请新增计量单位'),
            type: 'warning'
          })
          return
        }
        ids = this.selected.map(it => it.id)
      } else {
        ids = [this.mpId]
      }
      const existUnit = []
      let repeat = false
      const data = unitList.map(it => {
        it.id = it.id
        it.mpId = this.mpId
        it.unitId = it.unitId
        it.unitCode = it.calculationUnitCode
        it.isStandard = 0
        it.conversionRate = it.rate
        if (existUnit.indexOf(it.unitId) >= 0) {
          repeat = true
        }
        existUnit.push(it.unitId)
        return it
      })

      if (repeat) {
        this.$message({
          showClose: true,
          message: this.$t('计量单位不能重复'),
          type: 'warning'
        })
        return
      }
      try {
        const result = await this.$product.$api.mpApi.saveOrUpdate({
          unitList: data,
          mpIds: ids
        })
        this.$message({
          showClose: true,
          message: this.$t(result.code === '0' ? '保存成功' : result.message),
          type: result.code === '0' ? 'success' : 'error'
        })
        this.visible = false
        this.updateList()
      } catch (e) {
        this.$message({
          showClose: true,
          message: e.message,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  /deep/ {
    .el-form-item__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
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

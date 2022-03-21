<template>
  <section>
    <el-card class="box-card">
      <el-row style="margin-top: 8px" type="flex">
        <el-col :span="5">
          <div style="text-align: center">
            <div style="color: #666">{{ $t('状态') }}</div>
            <div style="margin-top: 18px;margin-bottom: 15px;font-size: 1.2em">{{ formatterEnum(inventoryStatusList, inventoryPlan.inventoryStatus) }}</div>
            <div v-if="!isEdit">
              <ody-button v-show="inventoryPlan.inventoryStatus === 1" code="ImInventoryPlanToDo" size="mini" type="primary" @click="goEdit(inventoryPlan.id, true)">{{ $t('盘点') }}</ody-button>
              <ody-button v-show="inventoryPlan.inventoryStatus === 0 || inventoryPlan.inventoryStatus === 1" :disabled="!canOperate" name="cancel" size="mini" code="ImInventoryPlanCancel" @click="cancel">{{ $t('取消') }}</ody-button>
            </div>
          </div>
        </el-col>
        <el-col :span="19" style="border-left: 1px solid #EEF5F9;padding-left: 30px;">
          <div>
            <span style="font-weight: bold;font-size: 1.1em">{{ $t('盘点单号') }}: {{ inventoryPlan.inventoryCode }}</span>
            &nbsp;
            <i v-clipboard:copy="inventoryPlan.inventoryCode" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
          </div>
          <el-row style="margin-top: 15px">
            <el-col :span="6" class="row_col">
              <div>
                <span>{{ $t('商家') }}：</span>
                <span>{{ inventoryPlan.merchantName }}</span>
              </div>
              <div>
                <span>{{ $t('创建人') }}：</span>
                <span>{{ inventoryPlan.createUsername }}</span>
              </div>
            </el-col>
            <el-col :span="6" class="row_col">
              <div>
                <span>{{ $t('仓库') }}：</span>
                <span>{{ inventoryPlan.warehouseName }}</span>
              </div>
              <div>
                <span>{{ $t('创建时间') }}：</span>
                <span>{{ inventoryPlan.createTime ? $portal.parseTime(inventoryPlan.createTime, '{y}-{m}-{d} {h}:{i}:{s}') : '' }}</span>
              </div>
            </el-col>
            <el-col :span="6" class="row_col">
              <div>
                <span>{{ $t('盘点类型') }}：</span>
                <span>{{ formatterEnum(inventoryTypeList, inventoryPlan.inventoryType) }}</span>
              </div>
              <div>
                <span>{{ $t('备注') }}：</span>
                <span>{{ inventoryPlan.remark }}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('盘点商品') }}</span>
      </div>
      <ody-list-table-area>
        <div slot="tabs">
          <div style="width: 100%;min-height: 36px;">
            <el-input v-model="filterText" :placeholder="$t('请输入商品编码/名称/条码/SPU编码/货号')" clearable maxlength="20" class="filter_text"/>
          </div>
          <el-tabs v-model="activeState" name="activeState">
            <el-tab-pane v-for="tab in getTabs" :key="tab.name" :name="tab.name">
              <span slot="label">{{ tab.heading }} <span>({{ tab.count }})</span></span>
            </el-tab-pane>
          </el-tabs>
          <div v-if="isEdit && inventoryPlan.inventoryType === 0" slot="btn mgB12">
            <el-button :disabled="!canOperate" name="addProduct" type="primary" size="small" @click="doAddProduct">{{ $t('添加商品') }}</el-button>
            <el-button :disabled="!canOperate" name="fastInput" size="small" @click="toFastInput">{{ $t('快速录入') }}</el-button>
            <el-button :disabled="!canOperate" name="batchDelete" size="small" @click="batchDelete">{{ $t('批量删除') }}</el-button>
          </div>
          <div v-if="(isEdit && inventoryPlan.inventoryType === 1) || !isEdit" slot="btn mgB12">
            <!--<el-button type="primary" size="small" @click="alert(1)">{{ $t('导入盘点结果') }}</el-button>-->
            <ody-batch-export-button
              :get-export-data="exportModel.getExportData"
              :export-api="exportModel.exportApi"
              :async="exportModel.async"
              :pool="exportModel.pool"
              :task-type="exportModel.taskType"
              name="exportData"
              code="ImInventoryPlanExport"
              size="small">{{ $t('导出') }}</ody-batch-export-button>
            <ody-export-task-button
              :task-type="exportModel.taskType"
              :pool="exportModel.pool"
              name="seeExportTask"
              code="ImInventoryPlanSeeTask"
              size="small">{{ $t('查看任务') }}</ody-export-task-button>
          </div>
        </div>
        <!-- 查看详情 -->
        <div v-if="!isEdit" slot="table">
          <ody-table
            :data="filterItemList"
            :columns="columns"
            :border="false"
            :can-filter="false">
            <template slot="inventoryStockNum" slot-scope="scope">
              <div v-if="scope.row.batchStrategyId != null" class="batch_but_div">
                <!--<div class="batch_jiao" />
                <div class="batch_div_span">{{ scope.row.inventoryStockNum }}</div>
                <div class="batch_div_img">
                  <img :src="require('@/img/batch_but_img.png')" class="batch_but_img" @click="batchInventory(scope.row)">
                </div>-->
                <ody-product-batch-inventory-drawer :product="scope.row" @ok="changeInventoryStockNum(scope.row)" />
              </div>
              <div v-else>
                <span>{{ scope.row.inventoryStockNum }}</span>
              </div>
            </template>
            <template slot="remark" slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </ody-table>
        </div>
        <!-- 日常 -->
        <div v-else-if="inventoryPlan.inventoryType === 0" slot="table">
          <ody-table
            v-loading="!canOperate"
            :data="filterItemList"
            :columns="columns"
            :operates="operates"
            :multiple="true"
            :checked.sync="checked"
            :can-filter="false">
            <template slot="inventoryStockNum" slot-scope="scope">
              <div v-if="scope.row.batchStrategyId != null" class="batch_but_div">
                <ody-product-batch-inventory-drawer :product="scope.row" @ok="changeInventoryStockNum(scope.row)"/>
              </div>
              <div v-else>
                <ody-input-number v-model="scope.row.inventoryStockNum" :empty-tip="false" :min="0" :max="999999.99" :decimal="2" style="text-align: center;" @change="changeInventoryStockNum(scope.row)"/>
                <!--<el-input-number v-model="scope.row.inventoryStockNum" :min="0" @change="changeInventoryStockNum(scope.row)" />-->
              </div>
            </template>
            <template slot="remark" slot-scope="scope">
              <el-input v-model="scope.row.remark" />
            </template>
          </ody-table>
        </div>
        <!-- 任务 -->
        <div v-else-if="inventoryPlan.inventoryType === 1" slot="table">
          <ody-table
            v-loading="!canOperate"
            :data="filterItemList"
            :columns="columns"
            :can-filter="false">
            <template slot="inventoryStockNum" slot-scope="scope">
              <div v-if="scope.row.batchStrategyId != null" class="batch_but_div">
                <ody-product-batch-inventory-drawer :product="scope.row" @ok="changeInventoryStockNum(scope.row)"/>
              </div>
              <div v-else>
                <ody-input-number v-model="scope.row.inventoryStockNum" :empty-tip="false" min="0" style="text-align: center;" @change="changeInventoryStockNum(scope.row)" />
              </div>
            </template>
            <template slot="remark" slot-scope="scope">
              <el-input v-model="scope.row.remark" />
            </template>
          </ody-table>
        </div>
      </ody-list-table-area>
      <div style="margin-top: 10px;border-top: 1px solid #ccc;padding-top: 15px">
        <div>
          <span>{{ $t('合计') }}：</span>
          <span style="float: right;margin-right: 30px">{{ $t('盘盈数量') }}：{{ winCount }}</span>
          <span style="float: right;margin-right: 30px">{{ $t('商品个数') }}：{{ mpTotalCount }}</span>
        </div>
        <div style="margin-top: 10px;padding-bottom: 10px">
          <span style="float: right;margin-right: 30px">{{ $t('盘亏数量') }}：{{ losCount }}</span>
        </div>
      </div>
    </el-card>
    <el-card v-if="isEdit" class="box-card">
      <div style="text-align: center">
        <ody-button v-show="inventoryPlan.inventoryStatus === 0" :disabled="!canOperate" name="submit" type="primary" size="small" code="ImInventoryPlanSubmit" @click="submit">{{ $t('提交盘点') }}</ody-button>
        <ody-button v-show="inventoryPlan.inventoryStatus === 1" :disabled="!canOperate" name="done" type="primary" size="small" code="ImInventoryPlanDone" @click="done">{{ $t('完成盘点') }}</ody-button>
        <ody-button :disabled="!canOperate" name="save" type="primary" size="small" code="ImInventoryPlanSave" @click="save">{{ $t('保存草稿') }}</ody-button>
        <ody-button v-show="inventoryPlan.inventoryStatus === 0" :disabled="!canOperate" name="cancel" size="small" code="ImInventoryPlanCancel" @click="cancel">{{ $t('取消') }}</ody-button>
        <ody-button :disabled="!canOperate" name="back" size="small" code="ui" @click="back(true)">{{ $t('返回') }}</ody-button>
      </div>
    </el-card>
    <!-- 添加商品弹框 -->
    <ody-dialog :visible.sync="showProductModal" :title="$t('添加盘点商品')" width="60%">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="mpForm">
            <ody-search-item :label="$t('商品名称') + ':'">
              <el-input v-model="mpObj.merchantProductName" name="mpObj_merchantProductName" />
            </ody-search-item>
            <ody-search-item :label="$t('商品编码') + ':'">
              <el-input v-model="mpObj.merchantProductCode" name="mpObj_merchantProductCode" />
            </ody-search-item>
            <ody-search-item :label="$t('商品条码') + ':'">
              <el-input v-model="mpObj.merchantProductBarcode" name="mpObj_merchantProductBarcode" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button size="small" type="primary" @click="queryImInventoryMPList">{{ $t('查询') }}</el-button>
          <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <el-table
            ref="mpMultipleTable"
            :data="addMpList"
            tooltip-effect="dark"
            @select-all="mpSelectAll"
            @select="mpSelectRow">
            <el-table-column :selectable="canSelect" type="selection" width="55" />
            <el-table-column :label="$t('商品名称')" prop="merchantProductName" align="center" />
            <el-table-column :label="$t('商品编码')" prop="merchantProductCode" align="center" />
            <el-table-column :label="$t('商品条码')" prop="merchantProductBarcode" align="center" />
          </el-table>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="mpObj.currentPage"
              :list="filterItemList"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="mpObj.itemsPerPage"
              :total.sync="mpObj.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="mpChange"
              @current-change="queryImInventoryMPList"
            />
          </div>
        </div>
      </ody-list-table-area>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button size="small" @click="showProductModal = false">{{ $t('取消') }}</el-button>
          <el-button size="small" type="primary" @click="confirmAddProduct">{{ $t('确认') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
    <!-- 快速录入弹框 -->
    <ody-dialog :visible.sync="fastInput.showFastInput" :title="$t('快速录入')" width="60%">
      <div>
        <el-radio-group v-model="fastInput.type">
          <el-radio :label="1">{{ $t('商品编码') }}</el-radio>
          <el-radio :label="2">{{ $t('条码') }}</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 10px">
        <el-input v-model="fastInput.context" :rows="10" name="context" type="textarea" maxlength="500"/>
        <p>{{ $t('请在下面文本框中输入') }}{{ fastInput.type === 2 ? $t('条码') : $t('商品编码') }},{{ $t('每行一个') }}{{ fastInput.type === 2 ? $t('条码') : $t('商品编码') }}，{{ $t('最多500行') }}。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button size="small" @click="fastInput.context = '';fastInput.showFastInput = false">{{ $t('取消') }}</el-button>
          <el-button size="small" type="primary" @click="doFastInput">{{ $t('确认') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'ImInventoryPlanEdit',
  data() {
    return {
      batchPlanShow: false,
      product: {
        batchStrategyId: null,
        productCode: null,
        productCname: null,
        productUnit: null,
        warehouseId: null,
        drawerVisible: false,
        inventoryCode: null,
        merchantProductId: null,
        inventoryStockNum: null
      },
      id: null,
      isEdit: false,
      canOperate: true,
      filterText: '',
      activeState: '0',
      fastInput: {
        type: 1, // 1 商品编码，2 条码
        context: '',
        showFastInput: false
      },
      merchantList: [],
      merchantNameMap: {},
      itemList: [],
      checked: [],
      showProductModal: false,
      mpObj: {
        merchantId: null,
        warehouseId: null,
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
      },
      addMpList: [],
      inventoryPlan: {},
      inventoryTypeList: [
        { label: this.$t('日常盘点'), value: 0 },
        { label: this.$t('任务盘点'), value: 1 }
      ],
      inventoryStatusList: [
        { label: this.$t('待提交'), value: 0 },
        { label: this.$t('盘点中'), value: 1 },
        { label: this.$t('已完成'), value: 2 },
        { label: this.$t('关闭'), value: 3 }
      ],
      exportModel: {
        exportApi: ['back-product-web', 'back/stock/imInventoryPlan', 'exportData.do'],
        pool: 'product',
        taskType: 'imInventoryPlanDetailExport',
        async: true,
        getExportData: () => {
          return { inventoryCode: this.inventoryPlan.inventoryCode }
        }
      },
      columns: [
        {
          label: '商品编码',
          prop: 'productCode',
          align: 'center',
          show: true,
          minWidth: 150
        },
        {
          label: '商品名称',
          prop: 'productCname',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: '条码',
          prop: 'productBarCode',
          align: 'center',
          show: true,
          minWidth: 150
        },
        {
          label: 'SPU编码',
          prop: 'productSpuCode',
          align: 'center',
          show: true,
          minWidth: 150
        },
        {
          label: '货号',
          prop: 'productArtNo',
          align: 'center',
          show: true,
          minWidth: 100
        },
        {
          label: '规格属性',
          prop: 'productAttribute',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: '计量单位',
          prop: 'productUnit',
          align: 'center',
          show: true,
          minWidth: 80
        },
        {
          label: '库存数量',
          prop: 'stockNum',
          align: 'center',
          show: true,
          minWidth: 100
        },
        {
          label: '实盘数量',
          prop: 'inventoryStockNum',
          slot: 'inventoryStockNum',
          align: 'center',
          show: true,
          minWidth: this.isEdit ? 160 : 100
        },
        {
          label: '盈亏数量',
          prop: 'differStockNum',
          align: 'center',
          show: true,
          minWidth: 100,
          render: (h, params) => {
            if (params.row.differStockNum === 0) {
              return (<span>0</span>)
            }
            const flag = params.row.differStockNum > 0
            const key = flag ? '#008000' : '#FF0000'
            const value = flag ? '+' + params.row.differStockNum : params.row.differStockNum
            return (<span style={'color:' + key}>{value}</span>)
          }
        },
        {
          label: '备注',
          prop: 'remark',
          slot: 'remark',
          align: 'center',
          show: true
        }
      ],
      operates: {
        width: 100,
        fixed: 'right',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              this.doDelete([row])
            },
            code: 'ui'
          }
        ]
      }
    }
  },
  computed: {
    mpTotalCount: function() {
      return this.itemList.length
    },
    _mpCount: function() { // 未盘
      return this.itemList.filter(item => item.inventoryStockNum == null || item.differStockNum == null).length
    },
    mpCount_1: function() { // 盘亏
      return this.itemList.filter(item => item.inventoryStockNum != null && item.inventoryStockNum !== '' && item.inventoryStockNum < item.stockNum).length
    },
    mpCount0: function() { // 盘平
      return this.itemList.filter(item => item.inventoryStockNum != null && parseInt(item.inventoryStockNum) === item.stockNum).length
    },
    mpCount1: function() { // 盘盈
      return this.itemList.filter(item => item.inventoryStockNum > item.stockNum).length
    },
    winCount: function() {
      let win = 0
      this.itemList.forEach(item => {
        if (item.differStockNum != null && item.differStockNum > 0) {
          win += item.differStockNum
        }
      })
      return win
    },
    losCount: function() {
      let los = 0
      this.itemList.forEach(item => {
        if (item.differStockNum != null && item.differStockNum < 0) {
          los += item.differStockNum
        }
      })
      return los
    },
    filterItemList: function() {
      const list = this.itemList.filter(item => {
        this.$set(item, 'warehouseId', this.inventoryPlan.warehouseId)
        this.$set(item, 'isEdit', this.isEdit)
        if (!this.filterText) return true
        const filter = item.productCode + '|' + item.productCname + '|' + item.productBarCode + '|' + item.productSpuCode + '|' + item.productArtNo
        return filter.indexOf(this.filterText) !== -1
      })
      // activeState => 0 全部 1 盘平 2 盘盈 3 盘亏 4 未盘
      if (this.activeState === '1') {
        return list.filter(item => item.inventoryStockNum != null && parseInt(item.inventoryStockNum) === item.stockNum)
      } else if (this.activeState === '2') {
        return list.filter(item => item.inventoryStockNum > item.stockNum)
      } else if (this.activeState === '3') {
        return list.filter(item => item.inventoryStockNum != null && item.inventoryStockNum !== '' && item.inventoryStockNum < item.stockNum)
      } else if (this.activeState === '4') {
        return list.filter(item => item.inventoryStockNum == null || item.differStockNum == null)
      } else {
        return list
      }
    },
    getTabs() {
      return [
        { name: '0', heading: this.$t('全部'), count: this.mpTotalCount },
        { name: '1', heading: this.$t('盘平'), count: this.mpCount0 },
        { name: '2', heading: this.$t('盘盈'), count: this.mpCount1 },
        { name: '3', heading: this.$t('盘亏'), count: this.mpCount_1 },
        { name: '4', heading: this.$t('未盘'), count: this._mpCount }
      ]
    }
  },
  async mounted() {
    try {
      this.id = this.$route.params.id ? parseInt(this.$route.params.id) : null
      this.isEdit = this.$route.params.isEdit + '' === 'true'
      this.stockApi = this.$product.$api.stockApi
      this.merchantApi = this.$product.$api.merchantApi
      this.authApi = this.$product.$api.authApi
      await this.init()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async init() {
      await this.queryMerchantList()
      await this.getById(this.id)
    },
    async getById(id) {
      this.canOperate = true
      // 根据ID查询详情
      const res = await this.stockApi.queryInventoryPlanById({ id: id })
      this.inventoryPlan = res.data
      // 查询商品数据
      this.stockApi.queryInventoryPlanDetailList({ inventoryCode: this.inventoryPlan.inventoryCode }).then((res) => {
        this.itemList = res.data
        this.checked = []
      })
    },
    async save() {
      const vue = this
      if (this.inventoryPlan.inventoryType === 1 && !(this.itemList && this.itemList.length > 0)) {
        this.$message(this.$t('商品不能为空'))
        return false
      }
      // 新增/保存盘点单
      this.$confirm(this.$t('保存草稿后需要提交盘点后才能开始盘点，确认保存草稿吗') + '?', this.$t('提示')).then(() => {
        vue.update(() => {
          vue.$message.success(vue.$t('保存成功'))
          vue.getById(vue.inventoryPlan.id)
        }, true)
      })
    },
    submit() {
      const vue = this
      this.$confirm(this.$t('提交盘点后开始直接开始盘点,确认提交开始盘点吗') + '?', this.$t('提示')).then(() => {
        vue.update(() => {
          // 提交盘点
          vue.stockApi.submitInventoryPlan({ id: vue.inventoryPlan.id }).then((res) => {
            if (res) {
              vue.$message.success(vue.$t('提交成功'))
              vue.getById(vue.inventoryPlan.id)
            }
          })
        }, true)
      })
    },
    done() {
      const vue = this
      if (this.itemList.some(item => item.inventoryStockNum == null)) {
        this.$message(this.$t('必须全部录入实盘数量的盘点单才可以完成盘点'))
        return
      }
      this.$confirm('完成盘点后，系统将自动调整盘点库存差异，是否确认提交？', this.$t('提示')).then(() => {
        vue.update(async() => {
          // 完成盘点
          vue.stockApi.doneInventoryPlan({ id: vue.inventoryPlan.id }).then((res) => {
            if (res) {
              vue.$message.success(vue.$t('操作成功'))
              vue.back()
            }
          })
        }, false)
      })
    },
    cancel() {
      const vue = this
      this.$confirm(this.$t('取消会导致录入页面信息丢失,确认取消盘点单吗') + '?', this.$t('提示')).then(() => {
        // 取消盘点
        vue.stockApi.cancelInventoryPlan(JSON.stringify([vue.inventoryPlan.id])).then((res) => {
          if (res) {
            vue.$message.success(vue.$t('取消成功'))
            vue.back()
          }
        })
      })
    },
    goEdit(id, isEdit) {
      this.$router.push({
        name: isEdit ? 'ImInventoryPlanEdit' : 'ImInventoryPlanView',
        params: { id: id, isEdit: isEdit === true }
      })
    },
    async update(fun, boo) {
      try {
        this.canOperate = false
        this.itemList.filter(x => x.mpBatchVOS != null).map(x => x.mpBatchVOS).forEach(o => o.filter(x => x.batchAttrs).forEach(s => { s.batchAttrs = JSON.stringify(s.batchAttrs) }))
        const res = await this.stockApi.saveOrUpdateInventoryPlan({
          ...this.inventoryPlan,
          itemList: this.itemList
        })
        if (res && res.data) {
          fun()
        }
      } finally {
        this.canOperate = boo
      }
    },
    async doFastInput() {
      // 快速录入
      if (!this.fastInput.context) {
        this.$message(this.$t('数据不能为空'))
        return
      }
      const fastInputText = this.fastInput.context.replace(/\n/g, '|').replace(/\s+/g, '').replace(/\|+/g, '|')
      if (fastInputText === '' || fastInputText === '|') {
        this.$message(this.$t('数据不能为空'))
        return
      }
      const codes = fastInputText.split('|')
      const params = {
        currentPage: 1,
        itemsPerPage: 500,
        merchantId: this.inventoryPlan.merchantId,
        warehouseId: this.inventoryPlan.warehouseId
      }
      if (this.fastInput.type === 1) {
        // 商品编码
        params.merchantProductCodeList = codes
      } else if (this.fastInput.type === 2) {
        // 条码
        params.merchantProductBarcodeList = codes
      } else {
        this.$message('this.fastInput.type error => ' + this.fastInput.type)
        return
      }
      const res = await this.stockApi.listInventoryMerchantProductPage(params)
      if (res && res.data && res.data.listObj) {
        const count = this.addProductList(res.data.listObj)
        this.$alert('本次录入：' + codes.length + '条<br>成功录入：' + count + '条', this.$t('提示'), { confirmButtonText: this.$t('确定'), dangerouslyUseHTMLString: true })
      } else {
        this.$message.error('录入失败')
      }
      this.fastInput.context = ''
      this.fastInput.showFastInput = false
    },
    doAddProduct() {
      this.showProductModal = true
      this.queryImInventoryMPList()
    },
    toFastInput() {
      this.fastInput.showFastInput = true
    },
    back(tip) {
      const vue = this
      if (tip) {
        this.$confirm(this.$t('返回会导致录入的页面信息丢失,确认返回') + '？', this.$t('提示')).then(() => {
          vue.$portal.delActiveViewAndRefresh()
          setTimeout(function() {
            vue.$router.push({ name: 'ImInventoryPlan' })
          }, 500)
        })
      } else {
        vue.$portal.delActiveViewAndRefresh()
        setTimeout(function() {
          vue.$router.push({ name: 'ImInventoryPlan' })
        }, 500)
      }
    },
    formatterEnum(list, value) {
      list = list.filter(item => item.value === value)
      return list && list.length > 0 ? list[0].label : ''
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    changeInventoryStockNum(row) {
      if (row.inventoryStockNum == null || row.inventoryStockNum === '') {
        row.differStockNum = null
        row.inventoryStockNum = null
      } else if (!isNaN(row.inventoryStockNum) && row.inventoryStockNum >= 0) {
        row.differStockNum = row.inventoryStockNum - row.stockNum
      }
    },
    doDelete(list) {
      const vue = this
      this.$confirm(this.$t('确认删除选择的数据吗') + '?', this.$t('提示')).then(() => {
        for (const obj of list) {
          vue.itemList = vue.arrDelete(vue.itemList, obj, ['id', 'merchantProductId'])
          vue.checked = vue.arrDelete(vue.checked, obj, ['id', 'merchantProductId'])
        }
      })
    },
    batchDelete() {
      const isChecked = this.checked && this.checked.length
      if (!isChecked) {
        this.$message(this.$t('请勾选数据'))
        return
      }
      this.doDelete(this.checked)
    },
    arrDelete(list, obj, keys) {
      const newList = []
      for (const o of list) {
        if (o === obj) {
          continue
        }
        let del = false
        for (const k of keys) {
          if (o[k] && o[k] === obj[k]) {
            del = true
            break
          }
        }
        if (!del) {
          newList.push(o)
        }
      }
      return newList
    },
    async queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = []
          this.merchantNameMap = {}
          const merchantIds = []
          for (const obj of res.data.listObj) {
            if (merchantIds.indexOf(obj.merchantId) === -1) {
              merchantIds.push(obj.merchantId)
              this.merchantList.push({
                merchantId: obj.merchantId,
                merchantCode: obj.merchantCode,
                merchantName: obj.merchantName
              })
              this.merchantNameMap[obj.merchantId] = obj.merchantName
            }
          }
        })
    },
    mpSelectRow(selection, row) {
      row.checked = !row.checked
    },
    mpSelectAll(selection) {
      if (selection.length === 0) {
        this.addMpList.map(item => {
          item.checked = false
        })
      } else {
        selection.map(item => {
          item.checked = true
        })
      }
    },
    canSelect(row) {
      return !row.selected
    },
    reset() {
      this.mpObj.merchantProductName = null
      this.mpObj.merchantProductCode = null
      this.mpObj.merchantProductBarcode = null
    },
    mpChange(val) {
      this.mpObj.itemsPerPage = val
      this.queryImInventoryMPList()
    },
    confirmAddProduct() {
      const products = this.addMpList.filter(item => item.checked)
      const flag = this.addProductList(products)
      if (flag === false) {
        return
      }
      this.showProductModal = false
    },
    addProductList(products) {
      let count = 0
      const merchantProductIds = {}
      this.itemList.forEach(item => { merchantProductIds[item.merchantProductId] = true })
      for (const obj of products) {
        if (merchantProductIds[obj.merchantProductId]) {
          continue
        }
        if (obj.inPlan === 1) {
          this.$message.warning(this.$t('商品') + obj.merchantProductCode + this.$t('存在盘点中的盘点单不能添加'))
          return false
        }
        count++
        this.itemList.push({
          stockNum: obj.stockNum,
          merchantProductId: obj.merchantProductId,
          productCode: obj.merchantProductCode,
          productCname: obj.merchantProductName,
          productBarCode: obj.merchantProductBarcode,
          productUnit: obj.measurementUnit,
          productSpuCode: obj.spuCode,
          productArtNo: obj.artNo,
          productAttribute: obj.extInfoStr,
          batchStrategyId: obj.batchStrategyId,
          // debug
          // batchStrategyId: 1,
          differStockNum: null,
          pictureUrl: obj.pictureUrl,
          inventoryCode: this.inventoryPlan.inventoryCode,
          warehouseId: this.inventoryPlan.warehouseId
        })
      }
      return count
    },
    async queryImInventoryMPList() {
      if (!this.mpObj.merchantProductName) {
        delete this.mpObj.merchantProductName
      }
      if (!this.mpObj.merchantProductCode) {
        delete this.mpObj.merchantProductCode
      }
      if (!this.mpObj.merchantProductBarcode) {
        delete this.mpObj.merchantProductBarcode
      }
      this.mpObj.merchantId = this.inventoryPlan.merchantId
      this.mpObj.warehouseId = this.inventoryPlan.warehouseId
      this.stockApi.listInventoryMerchantProductPage(this.mpObj).then(res => {
        this.addMpList = res.data.listObj
        this.mpObj.total = res.data.total
        if (this.itemList && this.itemList.length > 0) {
          const productSelectedMap = {}
          for (const obj of this.itemList) {
            productSelectedMap[obj.merchantProductId] = true
          }
          for (const obj of this.addMpList) {
            if (productSelectedMap[obj.merchantProductId]) {
              obj.selected = true
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin-bottom: 8px;
  }
  .inventory_tabs .el-tabs__active-bar {
    display: none;
  }
  .filter_text {
    width: 330px;
    float: right;
  }
  .row_col {
    margin-left: 10px;
    margin-bottom: 5px;
  }
  .row_col div {
    margin-top: 15px;
  }
  .span_status {
    margin-left: 10px;
    border-radius: 3px;
    padding: 5px 5px;
    font-size: 12px;
    vertical-align: middle;
    text-align: center;
    cursor: default;
  }
  /** start----- 批次 icon 样式 -----start */
  .batch_but_div {
    text-align: center;
  }
  .batch_div_span {
    margin-left: 25%;
    margin-top: -25px;
    display: inline-block;
    vertical-align: middle;
  }
  .batch_div_img {
    float: right;
    margin-right: 0px;
    margin-top: -20px;
    display: inline-block;
    vertical-align: middle;
  }
  .batch_jiao {
    position: relative;
    height: 0px;
    width: 0px;
    border-top: 24px solid red;
    border-right: 24px solid transparent;
  }
  .batch_jiao:after{
    content: '批';
    position: absolute;
    top: -26px;
    left: 0px;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 11px;
    color: #FFFFFF;
    white-space: nowrap;
  }
  .batch_but_img {
    border-width: 0px;
    left: 0px;
    top: 0px;
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
  /** end----- 批次 icon 样式 -----end */
</style>

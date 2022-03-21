<template>
  <div>
    <!-- <ody-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :title="$t('order_create_match_variable')"
      size="md"
    @open="init">-->
    <ody-dialog-full-right
      :visible.sync="dialogVisible"
      :title="$t('order_create_match_variable')"
      :close-tip="true"
      width="1000"
      @open="init"
      @close="handleClose"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="form" label-width="180px">
            <el-form-item :label="$t('order_variable_name')" required="true">
              <el-select
                v-model="ruleInfo.variableId"
                :placeholder="$t('please_choose')"
                :clearable="false"
                :popper-append-to-body="false"
                name="ruleInfo_variableId"
                @change="selectOneVariable(ruleInfo.variableId)"
              >
                <el-option
                  v-for="item in variables"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('order_operator')" required="true">
              <el-select
                v-model="ruleInfo.operator"
                :placeholder="$t('please_choose')"
                :clearable="false"
                :popper-append-to-body="false"
                name="ruleInfo_operator"
                @change="changeVariable"
              >
                <el-option
                  v-for="item in operators"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('order_variable_value')" required="true">
              <el-select
                v-show="
                  displayStyle === 'selectIQ' || displayStyle === 'select'
                "
                v-model="oneValue"
                :placeholder="$t('please_choose')"
                :clearable="false"
                :popper-append-to-body="false"
                name="oneValue"
                filterable
                @change="changeVariable"
              >
                <el-option
                  v-for="item in resources"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
              <el-select
                v-show="displayStyle == 'selectSysSource'"
                v-model="oneValue"
                :placeholder="$t('please_choose')"
                :clearable="false"
                :popper-append-to-body="false"
                name="oneValue1"
                filterable
                @change="changeVariable"
              >
                <el-option
                  v-for="item in resources"
                  :key="item.channelCode"
                  :label="item.channelName"
                  :value="item.channelCode"
                />
              </el-select>
              <el-input
                v-show="displayStyle == 'text'"
                v-model="oneValue"
                :placeholder="$t('order_input_and_enter')"
                name="oneValue13"
                @keyup.enter.native="enterEvent"
              />
              <el-input
                v-show="displayStyle == 'number'"
                v-model="oneValue"
                :placeholder="$t('order_input_and_enter')"
                name="oneValue7"
                @keyup.enter.native="enterEvent"
              />
              <el-button
                v-show="displayStyle == 'product'"
                name="showProduct"
                type="primary"
                @click="showProduct"
              >
                {{ $t("please_choose") }}
                <i class="el-icon-circle-plus" />
              </el-button>
              <el-button
                v-show="displayStyle == 'brand'"
                name="showBrand"
                type="primary"
                @click="showBrand"
              >
                {{ $t("please_choose") }}
                <i class="el-icon-circle-plus" />
              </el-button>

              <el-transfer
                v-show="displayStyle == 'category'"
                v-model="categoryValue"
                :data="categoryData"
                :titles="[]"
                :button-texts="['', '']"
                name="categoryValue"
                filterable
                @change="categoryChange"
              />
              <el-time-picker
                v-show="displayStyle == 'timeArea'"
                v-model="oneValue"
                name="oneValue15"
                is-range
                range-separator="-"
                value-format="HH:mm"
                format="HH:mm"
                @change="changeTimeArea"
              />
              <span v-show="displayStyle == 'none'">{{ $t("是") }}</span>
            </el-form-item>
            <el-form-item
              v-show="displayStyle != 'none'"
              :label="$t('common_detail')"
            >
              <span>{{ variableTags.length }} {{ $t("order_one") }}</span>
              <el-button
                name="cleanVariable"
                size="small"
                @click="cleanVariable"
              >{{ $t("common_clear") }}</el-button
              >
            </el-form-item>
            <el-form-item v-show="displayStyle != 'none'" label=" ">
              <el-tag
                v-for="tag in variableTags"
                :key="tag"
                :disable-transitions="false"
                closable
                @close="handleCloseLa(tag)"
              >{{ tag }}</el-tag
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button
          name="saveRuleVariable"
          type="primary"
          @click="saveRuleVariable()"
        >{{ $t("common_confirm_search") }}</el-button
        >
        <el-button name="handleClose" @click="handleClose">{{
          $t("common_close")
        }}</el-button>
      </div>
      <!-- </ody-dialog> -->
    </ody-dialog-full-right>
    <!--商品弹窗-->
    <ody-dialog
      :visible.sync="productVisible"
      :before-close="closeProduct"
      :title="$t('so_invoice_product')"
      width="80%"
    >
      <div>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <ody-search-item
                :label="$t('do_merchant_name')"
                prop="merchantId"
              >
                <el-select
                  v-model="productSearch.merchantId"
                  :placeholder="$t('common_all')"
                  :popper-append-to-body="false"
                  popper-class="select-class"
                  name="productSearch_merchantId"
                >
                  <el-option
                    v-for="item in merchantList"
                    :key="item.merchantId"
                    :label="item.merchantName"
                    :value="item.merchantId"
                  />
                </el-select>
              </ody-search-item>
              <ody-search-item :label="$t('do_product_code')" prop="code">
                <el-input
                  v-model="productSearch.code"
                  name="productSearch_code"
                  maxlength="25"
                />
              </ody-search-item>
              <ody-search-item
                :label="$t('do_product_name')"
                prop="chineseName"
              >
                <el-input
                  v-model="productSearch.chineseName"
                  name="productSearch_chineseName"
                  maxlength="25"
                />
              </ody-search-item>
              <ody-search-item
                :label="$t('product_brand_name')"
                prop="brandName"
              >
                <el-input
                  v-model="productSearch.brandName"
                  name="productSearch_brandName"
                  maxlength="25"
                />
              </ody-search-item>
            </el-form>
            <el-form ref="form" label-width="100px" class="form" />
          </div>
          <div slot="btn">
            <el-button
              name="productListSearch"
              size="small"
              type="primary"
              @click="productListSearch"
            >{{ $t("common_select") }}</el-button
            >
            <el-button name="resetProduct" size="small" @click="resetProduct">{{
              $t("common_reset")
            }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              v-loading="loading"
              :data="productData"
              :columns="productColumns"
              :operates="operates"
              :multiple="true"
              :checked.sync="productChecked"
              :can-filter="false"
              max-height="300"
              name="productData223"
            />
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="productCurrent"
                :list="productData"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="productSize"
                :total.sync="productTotal"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="productList"
                @current-change="productList"
              />
            </div>
          </div>
        </ody-list-table-area>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="closeProduct" size="small" @click="closeProduct">{{
          $t("cancel")
        }}</el-button>
        <el-button
          name="saveProduct"
          size="small"
          type="primary"
          @click="saveProduct"
        >{{ $t("ok") }}</el-button
        >
      </span>
    </ody-dialog>
    <!--品牌弹窗-->
    <ody-dialog
      :visible.sync="brandVisible"
      :before-close="closeBrand"
      :title="$t('goods_goods_good_brand')"
      width="60%"
    >
      <div>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <ody-search-item :label="$t('product_brand_name')" prop="name">
                <el-input
                  v-model="brandSearch.name"
                  name="brandSearch_name"
                  maxlength="25"
                />
              </ody-search-item>
            </el-form>
            <el-form ref="form" label-width="100px" class="form" />
          </div>
          <div slot="btn">
            <el-button
              name="brandListSeart"
              size="small"
              type="primary"
              @click="brandListSeart"
            >{{ $t("common_select") }}</el-button
            >
            <el-button name="resetBrand" size="small" @click="resetBrand">{{
              $t("common_reset")
            }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              v-loading="loading"
              :data="brandData"
              :columns="brandColumns"
              :operates="operates"
              :multiple="true"
              :checked.sync="brandChecked"
              :can-filter="false"
              name="brandData192"
            >
              <template slot="logUrl" slot-scope="{ row: { logUrl }}">
                <img v-if="logUrl && logUrl !== ''" :src="logUrl" style="width: 20px; height: 20px" alt="">
              </template>
            </ody-table>
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="brandCurrent"
                :list="brandData"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="brandSize"
                :total.sync="brandTotal"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="brandList"
                @current-change="brandList"
              />
            </div>
          </div>
        </ody-list-table-area>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="closeBrand" size="small" @click="closeBrand">{{
          $t("cancel")
        }}</el-button>
        <el-button
          name="saveBrand"
          size="small"
          type="primary"
          @click="saveBrand"
        >{{ $t("ok") }}</el-button
        >
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: function() {
        return []
      }
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    merchantList: {
      type: Array,
      default: function() {
        return []
      }
    },
    ruleType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      productVisible: false,
      productSearch: getDefaultSearchForm(),
      productChecked: [],
      productUrl: '',
      productData: [],
      productSize: 10,
      productTotal: 1,
      productCurrent: 1,

      categoryVisible: false,
      categoryData: [],
      categoryValue: [],
      categoryMap: {},

      brandSearch: getDefaultSearchForm(),
      brandVisible: false,
      brandData: [],
      brandChecked: [],
      brandSize: 10,
      brandTotal: 1,
      brandCurrent: 1,
      brandUrl: '',

      variableTags: [],
      variableTagsVal: [],
      inputVisible: false,
      inputValue: '',
      ruleInfo: {},
      variables: [],
      operators: [],
      displayStyle: null,
      resources: [],
      oneValue: null,
      productColumns: [
        {
          show: true,
          prop: 'chineseName',
          label: this.$t('order_ports_product_name'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('invoiceInqurity_productCode'),
          align: 'center',
          minWidth: '200'
        },
        {
          show: true,
          prop: 'artNo',
          label: this.$t('do_art_no'),
          align: 'center',
          minWidth: '160'
        },
        {
          show: true,
          prop: 'brandName',
          label: this.$t('goods_goods_good_brand'),
          align: 'center',
          minWidth: '160'
        },
        {
          show: true,
          prop: 'saleAttribute',
          label: this.$t('manual_order_product_attr'),
          align: 'center',
          minWidth: '160'
        },
        {
          show: true,
          prop: 'mainUnitName',
          label: this.$t('do_unit'),
          align: 'center',
          minWidth: '160'
        }
      ],
      brandColumns: [
        {
          show: true,
          prop: 'id',
          label: 'Id',
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('product_brand_name'),
          align: 'center',
          minWidth: '200'
        },
        {
          show: true,
          prop: 'nameLan2',
          label: this.$t('product_brand_nameEn'),
          align: 'center',
          minWidth: '160'
        },
        {
          show: true,
          prop: 'alias',
          label: this.$t('product_brand_alias'),
          align: 'center',
          minWidth: '160'
        },
        {
          show: true,
          prop: 'logUrl',
          slot: 'logUrl',
          label: this.$t('product_brand_logo'),
          align: 'center',
          minWidth: '160'
          // render: (h, params) => {
          //   if (params.row.logUrl || params.row.logUrl !== '') {
          //     return <img width='20' height='20' src={params.row.logUrl} />
          //   } else {
          //     return <span></span>
          //   }
          // }
        }
      ] // 需要展示的列
    }
  },
  methods: {
    parseJSON(str) {
      try {
        return JSON.parse(str)
      } catch (ex) {
        try {
          return new Function('return ' + str)()
        } catch (ex) {
          console.log('parseJson - error', ex)
        }
      }
    },
    changeTimeArea(area) {
      this.oneValue = this.oneValue[0] + '-' + this.oneValue[1]
      // 判断时间是否有重叠
      for (var i = 0; i < this.variableTagsVal.length; i++) {
        var timeArr = this.variableTagsVal[i].split('-')
        if (area[0] < timeArr[1] && area[1] > timeArr[0]) {
          this.$message({
            type: 'error',
            message: this.$t('order_match_variable_overlap')
          })
          return
        }
      }
      this.pushOneValue(this.displayStyle, null, null)
    },
    handleClose() {
      this.$emit('closeDialog', !this.dialogVisible)
      // 清理
      this.cleanInfo()
      return true
    },
    cleanInfo() {
      this.ruleInfo = {}
      this.cleanVariable()
      this.oneValue = ''
      this.displayStyle = ''
    },
    async listByRuleType() {
      await this.$oms.$api.ruleVariable
        .ruleVariableListByRuleType({ ruleType: this.ruleType })
        .then((data) => {
          if (data.code === '0') {
            this.variables = data.data
            this.variablesMap = data.data.reduce((m, i) => {
              m[i.id] = i
              return m
            }, {})
          }
        })
    },
    async init() {
      await this.listByRuleType()
      // 清理
      this.cleanInfo()
      if (this.row.variableId) {
        await this.selectOneVariable(this.row.variableId)
        this.$set(this.ruleInfo, 'variableId', this.row.variableId)
        this.$set(this.ruleInfo, 'operator', this.row.operator)
        this.displayStyle = this.variablesMap[this.row.variableId].displayStyle
        this.variableTags = this.row.variableValueDesc
          .replace(/[\"\[\]]/g, '')
          .split(',')
        this.variableTagsVal = this.row.variableValue
          .replace(/[\"\[\]]/g, '')
          .split(',')
        this.$set(this.ruleInfo, 'index', this.row.index)
      }
    },
    async showCategory() {
      this.categoryVisible = true
    },
    async closeCategory() {
      this.categoryVisible = false
    },
    async categoryChange(value, direction, movedKeys) {
      if (direction === 'left') {
        for (var i = 0; i < movedKeys.length; i++) {
          const index = this.variableTagsVal.indexOf('' + movedKeys[i] + '')
          if (index >= 0) {
            this.variableTags.splice(index, 1)
            this.variableTagsVal.splice(index, 1)
          }
        }
      }

      for (var j = 0; j < this.categoryValue.length; j++) {
        this.pushOneValue(
          'category',
          this.categoryValue[j],
          this.categoryMap[this.categoryValue[j]]
        )
      }
    },
    cleanVariable() {
      this.variableTags = []
      this.variableTagsVal = []
      if (this.displayStyle === 'category') {
        this.categoryValue = []
      }
    },
    handleCloseLa(tag) {
      const index = this.variableTags.indexOf(tag)
      const val = this.variableTagsVal[index]
      if (index >= 0) {
        this.variableTags.splice(index, 1)
        this.variableTagsVal.splice(index, 1)
      }

      if (this.displayStyle === 'category') {
        const ind = this.categoryValue.indexOf(Number(val))
        this.categoryValue.splice(ind, 1)
      }
    },
    async showBrand() {
      this.brandVisible = true
      var vue = this
      this.loading = true
      vue.$portal
        .post(vue.brandUrl, { currentPage: 1, itemsPerPage: this.brandSize })
        .then((res) => {
          vue.loading = false
          if (res.code === '0') {
            vue.brandData = res.data.listObj
            vue.brandTotal = res.data.total
          }
        })
    },
    async saveBrand() {
      for (var i = 0; i < this.brandChecked.length; i++) {
        this.pushOneValue(
          'brand',
          this.brandChecked[i]['id'],
          this.brandChecked[i]['name']
        )
      }
      this.brandVisible = false
    },
    async brandList() {
      var vue = this
      var param = vue.brandSearch
      param.currentPage = vue.brandCurrent
      param.itemsPerPage = vue.brandSize
      this.loading = true
      vue.$portal.post(vue.brandUrl, param).then((res) => {
        vue.loading = false
        if (res.code === '0') {
          vue.brandData = res.data.listObj
          vue.brandTotal = res.data.total
        }
      })
    },
    brandListSeart() {
      this.brandCurrent = 1
      this.brandList()
    },
    async resetBrand() {
      this.brandSearch = getDefaultSearchForm()
    },
    async closeBrand() {
      this.brandVisible = false
      this.brandSearch = getDefaultSearchForm()
    },
    async showProduct() {
      this.productVisible = true
      var vue = this
      this.loading = true
      vue.$portal
        .post(vue.productUrl, {
          currentPage: 1,
          itemsPerPage: this.productSize,
          dataType: 2
        })
        .then((res) => {
          vue.loading = false
          if (res.code === '0') {
            vue.productData = res.data.listObj
            vue.productTotal = res.data.total
          }
        })
    },
    async saveProduct() {
      for (var i = 0; i < this.productChecked.length; i++) {
        this.pushOneValue(
          'product',
          this.productChecked[i]['mpId'],
          this.productChecked[i]['chineseName']
        )
      }
      this.productVisible = false
    },
    async productList() {
      var vue = this
      var param = vue.productSearch
      param.currentPage = vue.productCurrent
      param.itemsPerPage = vue.productSize
      param.dataType = 2
      if (
        param.merchantId &&
        param.merchantId !== null &&
        param.merchantId !== ''
      ) {
        var merchantIds = []
        merchantIds.push(param.merchantId)
        param.merchantIds = merchantIds
      } else {
        param.merchantIds = []
      }
      this.loading = true
      vue.$portal.post(vue.productUrl, param).then((res) => {
        vue.loading = false
        if (res.code === '0') {
          vue.productData = res.data.listObj
          vue.productTotal = res.data.total
        }
      })
    },
    productListSearch() {
      this.productCurrent = 1
      this.productList()
    },
    async resetProduct() {
      this.productSearch = getDefaultSearchForm()
    },
    async closeProduct() {
      this.productVisible = false
      this.productSearch = getDefaultSearchForm()
    },
    async selectOneVariable(f) {
      this.operators = this.variablesMap[f].operator.split(',')
      this.displayStyle = this.variablesMap[f].displayStyle

      if (this.displayStyle === 'timeArea') {
        this.oneValue = '00:00 - 23:59'
      } else {
        this.oneValue = null
      }
      this.$set(this.ruleInfo, 'variableName', this.variablesMap[f].name)
      this.$delete(this.ruleInfo, 'operator')
      this.variableTags = []
      this.variableTagsVal = []
      if (this.displayStyle === 'product') {
        this.productUrl = this.variablesMap[f].resourceUrl
        return
      }
      if (this.displayStyle === 'category') {
        await this.getCategorySource(this.variablesMap[f].resourceUrl)
        return
      }
      if (this.displayStyle === 'brand') {
        this.brandUrl = this.variablesMap[f].resourceUrl
        return
      }

      await this.getSources(this.variablesMap[f].resourceUrl)
    },
    async getCategorySource(url) {
      var urls = url.split('&')
      var vue = this
      var urlAndParamRoot = urls[0].split('?')
      vue.$portal
        .post(urlAndParamRoot[0], this.parseJSON(urlAndParamRoot[1]))
        .then((res) => {
          if (res.code === '0') {
            vue.$portal
              .post(urls[1], { parentId: res.data[0].id })
              .then((res) => {
                if (res.code === '0') {
                  vue.categoryData = []
                  // variableTagsVal
                  vue.categoryValue = []
                  for (var j = 0; j < vue.variableTagsVal.length; j++) {
                    var id = Number(vue.variableTagsVal[j])
                    vue.categoryValue.push(id)
                  }

                  for (var i = 0; i < res.data.length; i++) {
                    vue.categoryData.push({
                      label: res.data[i].name,
                      index: res.data[i].id,
                      key: res.data[i].id
                    })
                  }
                  vue.categoryMap = res.data.reduce((m, i) => {
                    m[i.id] = i.name
                    return m
                  }, {})
                }
              })
          }
        })
    },
    getSources(resourceUrl) {
      if (!resourceUrl) {
        return
      }
      // url规则解析
      var mappingArray = resourceUrl.split('&')
      var urlArray = mappingArray[0].split('?')
      var requestBody = {}
      if (urlArray.length > 1) {
        requestBody = this.parseJSON(urlArray[1])
      }
      var vue = this
      vue.$portal.get(urlArray[0], requestBody).then((res) => {
        if (res.code === '0') {
          vue.resources = res.data
          if (vue.displayStyle === 'selectSysSource') {
            var arr = []
            for (var k in vue.resources) {
              arr.push(vue.resources[k])
            }
            vue.resources = arr
            vue.resourcesMap = arr.reduce((m, i) => {
              m[i.channelCode] = i.channelName
              return m
            }, {})
          } else {
            vue.resourcesMap = vue.resources.reduce((m, i) => {
              m[i.code] = i.name
              return m
            }, {})
          }
          if (mappingArray.length > 1) {
            var mappingJson = this.parseJSON(mappingArray[1])
            for (var key in mappingJson) {
              vue.resources.forEach(function(item) {
                item[mappingJson[key]] = item[key]
              })
            }
          }
        }
      })
    },
    changeVariable() {
      this.pushOneValue(this.displayStyle, null, null)
    },
    pushOneValue(displayStyle, theValue, theValueText) {
      if (theValue !== null) {
        this.oneValue = theValue
      }

      if (displayStyle !== 'none' && this.oneValue === null) {
        return
      }

      // 检测重复值
      if (
        displayStyle !== 'none' &&
        this.variableTagsVal.indexOf(this.oneValue.toString()) >= 0
      ) {
        // 重复不添加
        return
      }

      if (
        displayStyle === 'brand' ||
        displayStyle === 'selectIQ' ||
        displayStyle === 'select' ||
        displayStyle === 'selectSysSource' ||
        displayStyle === 'product' ||
        displayStyle === 'category'
      ) {
        var text = ''
        if (theValueText !== null) {
          text = theValueText
        } else {
          text = this.resourcesMap[this.oneValue]
        }
        this.variableTags.push(text)
        this.variableTagsVal.push(this.oneValue.toString())
        return
      }
      if (displayStyle === 'number') {
        this.cleanVariable()
        this.variableTags.push(this.oneValue)
        this.variableTagsVal.push(this.oneValue)
        this.oneValue = null
        return
      }

      this.variableTags.push(this.oneValue)
      this.variableTagsVal.push(this.oneValue)
      this.oneValue = null
    },
    enterEvent() {
      if (this.oneValue === '') {
        this.$message({
          type: 'error',
          message: this.$t('rules_must_not_empty')
        })
        return
      }
      if (this.displayStyle === 'number') {
        if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(this.oneValue)) {
          this.$message({
            type: 'error',
            message: this.$t('order_pattern_number_invalid')
          })
          this.oneValue = null
          return
        }
        this.pushOneValue(this.displayStyle, null, null)
        return
      } else if (this.displayStyle === 'text') {
        this.pushOneValue(this.displayStyle, null, null)
        return
      }
    },
    saveRuleVariable() {
      // 判断是否重复
      var v = this
      var repeat = false

      // 判断
      if (this.variableTagsVal.length <= 0) {
        v.$message({
          type: 'error',
          message: v.$t('order_match_variable_value_required')
        })
        return
      }
      if (
        !this.ruleInfo.operator ||
        this.ruleInfo.operator === '' ||
        this.ruleInfo.operator === null
      ) {
        v.$message({
          type: 'error',
          message: v.$t('order_match_variable_value_required')
        })
        return
      }

      if (this.$route.query.id != null && this.ruleInfo.index != null) {
        var item = this.data[this.ruleInfo.index]
        item.operator = this.ruleInfo.operator
        item.variableId = this.ruleInfo.variableId
        item.variableName = this.ruleInfo.variableName
        item.variableValue = JSON.stringify(this.variableTagsVal)
        item.variableValueDesc = JSON.stringify(this.variableTags)
        this.data.splice(this.ruleInfo.index, 1, item)
      } else {
        if (this.data != null) {
          const currVariableOper =
            this.ruleInfo.variableId + '_' + this.ruleInfo.operator
          this.data.forEach(function(item) {
            const itemVariableOper = item.variableId + '_' + item.operator
            if (itemVariableOper === currVariableOper && item !== v.row) {
              // 重复
              v.$message({
                type: 'error',
                message: v.$t('order_match_variable_repeat')
              })
              repeat = true
              return
            }
          })
        } else {
          this.data = []
        }

        if (repeat) {
          // 重复回退
          return
        }
        let editRow = {
          operator: this.ruleInfo.operator,
          variableId: this.ruleInfo.variableId,
          variableName: this.ruleInfo.variableName,
          variableValue:
            this.variableTagsVal[0] !== null
              ? JSON.stringify(this.variableTagsVal)
              : '[]',
          variableValueDesc:
            this.variableTags[0] !== null
              ? JSON.stringify(this.variableTags)
              : '[]'
        }

        if (v.row && v.row.variableId) {
          this.data.splice(this.data.indexOf(v.row), 1)
          editRow = Object.assign(v.row, editRow)
        }
        if (editRow.variableId) {
          this.data.push(editRow)
        }
      }
      this.$emit('updateRuleData', this.data)
      this.handleClose()
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.el-input{
  position: relative;
}
/deep/ .select-class{
  min-width: 200px !important;
  position: absolute !important;
  left: 0 !important;
  top:32px !important;
  right: 0 !important;
  /deep/ .el-select-dropdown {
    max-height: 320px !important;
  }
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.dialog-inner {
  left: 30% !important;
}
/deep/ .cp-search-item {
  overflow: unset !important;
}
/deep/ .cp-list-search-area .box{
  overflow: unset;
}
/deep/ .cp-list-search-area .inner{
  overflow: unset;
}
/deep/ .el-select-dropdown__wrap {
  max-height: 320px !important;
}
/deep/ .el-scrollbar {
  max-height: 320px !important;
}
/deep/ .el-popper {
  max-height: 320px !important;
}
/deep/ .el-select-dropdown {
  max-height: 320px !important;
}
// /deep/ .el-transfer {
//   display: flex !important;
// }
// /deep/ .is-with-texts {
//   min-width: 30px !important;
//   display: inline-block;
// }
// /deep/ .el-button + .el-button {
//   margin-left: 0 !important;
// }
</style>

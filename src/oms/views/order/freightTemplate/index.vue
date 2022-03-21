<template>
  <section>
    <ody-list-search-area :multi-change-height="multiChangeHeight">
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('shipping_template_name') + ':'" prop="name">
            <el-input v-model="queryContent.name" name="queryContent_name" />
          </ody-search-item>
          <ody-search-item :label="$t('default_template') + ':'" prop="isDft">
            <el-select v-model="queryContent.isDft" name="queryContent_isDft">
              <el-option :label="$t('全部')" :key="''" :value="''" />
              <el-option
                v-for="obj in codes.IS_DEFS"
                :label="obj.name"
                :key="obj.code"
                :value="obj.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('is_it_free_from_mail') + ':'" prop="type">
            <el-select v-model="queryContent.type" name="queryContent_type">
              <el-option :label="$t('全部')" :key="''" :value="''" />
              <el-option
                v-for="obj in codes.FREIGHT_TYPE"
                :label="obj.name"
                :key="obj.code"
                :value="obj.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('billing_method') + ':'" prop="chargeWay">
            <el-select v-model="queryContent.chargeWay" name="queryContent_chargeWay">
              <el-option :label="$t('全部')" :key="''" :value="''" />
              <el-option
                v-for="obj in codes.CHARGE_WAYS"
                :label="obj.name"
                :key="obj.code"
                :value="obj.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('sales_merchant') + ':'" prop="merchantId">
            <el-select v-model="queryContent.merchantId" :popper-append-to-body="false" name="queryContent_merchantId">
              <el-option :label="$t('全部')" :key="''" :value="''" />
              <el-option
                v-for="obj in merchantList"
                :label="obj.merchantName"
                :key="obj.merchantId"
                :value="obj.merchantId"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button
          name="OmsFreightTemplateList_Reset_handleReset"
          code="OmsFreightTemplateList_Reset"
          size="small"
          @click="handleReset"
        >{{ $t('reset') }}</ody-button>
        <ody-button
          name="OmsFreightTemplateList_Query_query"
          code="OmsFreightTemplateList_Query"
          size="small"
          type="primary"
          @click="query"
        >{{ $t('Query') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="OmsFreightTemplateList_Add_goAdd"
          code="OmsFreightTemplateList_Add"
          size="mini"
          type="primary"
          @click="goAdd"
        >{{ $t('add_a_new_template') }}</ody-button>
      </div>
      <div v-loading="loading" slot="table">
        <div v-for="e in freightTemplateList" :key="e.id" class="context-div">
          <div class="header-class" style="width: 100%">
            <span>
              {{ e.name }}&nbsp;&nbsp;&nbsp;
              <em
                v-show="isExitFreeShipping(e.freightTemplateItemVOS)"
                style="color: #2394e5;font-style: normal!important"
              >
                {{ $t('存在包邮模板') }}&nbsp;
                <!--存在包邮模版-->
              </em>
            </span>
            <span>{{ $t('merchant') }}：{{ merchantMap[e.merchantId] }}</span>
            <span>&nbsp;&nbsp;{{ $t('最后编辑时间') }}：{{ e.updateTime == null ? e.createTime : e.updateTime }}</span>
            <span class="but">
              <ody-button
                name="OmsFreightTemplateList_Edit_edit"
                code="OmsFreightTemplateList_Edit"
                size="mini"
                type="primary"
                @click="edit(e.id)"
              >
                {{ $t('common_update') }}
                <!--修改-->
              </ody-button>
              <ody-button
                v-show="showConfPage(e.isDft)"
                name="OmsFreightTemplateList_Default_setDefaultFreight"
                code="OmsFreightTemplateList_Default"
                size="mini"
                @click="setDefaultFreight(e.id)"
              >
                {{ $t('set_as_default') }}
                <!--设为默认-->
              </ody-button>
              <ody-button
                v-show="showConfPage(e.isDft)"
                name="OmsFreightTemplateList_Deleted_deleteFreightTemplate"
                code="OmsFreightTemplateList_Deleted"
                size="mini"
                @click="deleteFreightTemplate(e.id)"
              >
                {{ $t('common.delete') }}
                <!--删除-->
              </ody-button>
            </span>
          </div>
          <div style="width:100%;">
            <table class="table-class" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
                <tr v-if="e.templateType == TEMPLATE_TYPE_BAISC">
                  <th>
                    {{ $t('distribution_mode') }}
                    <!--配送方式-->
                  </th>
                  <th>
                    {{ $t('distribution_area') }}
                    <!--配送区域-->
                  </th>
                  <th>{{ getDeliveryTemplateItemDesc(e.chargeWay, 1) }}</th>
                  <th>{{ getDeliveryTemplateItemDesc(e.chargeWay, 2) }}</th>
                  <th>{{ getDeliveryTemplateItemDesc(e.chargeWay, 3) }}</th>
                  <th>{{ getDeliveryTemplateItemDesc(e.chargeWay, 4) }}</th>
                </tr>
                <tr v-if="e.templateType == TEMPLATE_TYPE_O2O">
                  <th>
                    {{ $t('distribution_mode') }}
                    <!--配送方式-->
                  </th>
                  <th>{{ $t('是否有附加计费规则') }}</th>
                  <th>{{ $t('the_first_fee') }}({{ $t('labelYuan') }})</th>
                  <th>{{ $t('首距') }}(KM)</th>
                  <th>{{ $t('续距') }}(KM)</th>
                  <th>{{ $t('续费') }}({{ $t('labelYuan') }})</th>
                </tr>
              </thead>
              <tbody>
                <!--包邮模版不显示-->
                <tr
                  v-for="f in e.freightTemplateItemVOS"
                  v-show="e.templateType == TEMPLATE_TYPE_BAISC"
                  :key="f.id"
                >
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.distributionName }}</td>
                  <td v-show="isShow(f.isAvailable) && isFreeShipping(f.type)">
                    <div>
                      <div>{{ f.regionNames }}</div>
                    </div>
                  </td>
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.freightTemplateDistributeRuleVO.underUnit }}</td>
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.freightTemplateDistributeRuleVO.underUnitCost }}</td>
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.freightTemplateDistributeRuleVO.perUnit }}</td>
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.freightTemplateDistributeRuleVO.perUnitCost }}</td>
                </tr>
                <tr
                  v-for="f in e.freightTemplateItemVOS"
                  v-show="e.templateType == TEMPLATE_TYPE_O2O"
                  :key="f.id"
                >
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.distributionName }}</td>
                  <td
                    v-if="f.freightTemplateDistributeRuleVO.onWeight == 1"
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ $t('common_yes') }}</td>
                  <td
                    v-if="f.freightTemplateDistributeRuleVO.onWeight != 1"
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ $t('common_no') }}</td>
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.freightTemplateDistributeRuleVO.defaultPrice }}</td>
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.freightTemplateDistributeRuleVO.defaultDistance }}</td>
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.freightTemplateDistributeRuleVO.addDistance }}</td>
                  <td
                    v-show="isShow(f.isAvailable) && isFreeShipping(f.type)"
                  >{{ f.freightTemplateDistributeRuleVO.addDisPrice }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>
<script>
var vm = null
const queryContent = {
  name: '',
  isDft: '',
  type: '',
  chargeWay: '',
  merchantId: ''
}
const UNDER_UNIT = 1
const UNDER_UNIT_COST = 2
const PER_UNIT = 3
const PER_UNIT_COST = 4
export default {
  name: 'OmsFreightTemplateList',
  data() {
    return {
      queryContent: {
        ...queryContent
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      codes: {},
      loading: false,
      merchantMap: {},
      soBaseInfoConfigVO: {},
      merchantList: [],
      freightTemplateList: [],
      TEMPLATE_TYPE_BAISC: 0, // 基础模板
      TEMPLATE_TYPE_O2O: 1, // O2O模板
      CHARGE_WAYS_BASIC_NUM: '10', // 按件数
      CHARGE_WAYS_BASIC_WEIGHT: '11', // 按重量
      CHARGE_WAYS_BASIC_VOLUME: '12', // 按体积
      CHARGE_WAYS_O2O_FIX: '200', // 配送区域固定设置配送运费(O2O)
      CHARGE_WAYS_O2O_LADDER: '201', // 按距离阶梯设置配送运费(O2O)
      deliveryTemplateItemText: [
        {
          chargeWay: 10,
          underUnit: {
            th: this.$t('number_of_items') + '(' + this.$t('piece') + ')',
            td: ''
          },
          underUnitCost: {
            th: this.$t('the_first_fee') + '(' + this.$t('labelYuan') + ')',
            td: ''
          },
          perUnit: {
            th: this.$t('number_of_options') + '(' + this.$t('piece') + ')',
            td: ''
          },
          perUnitCost: {
            th: this.$t('续费') + '(' + this.$t('labelYuan') + ')',
            td: ''
          },
          desc:
            this.$t('within1') +
            '[input]' +
            this.$t('piece') +
            this.$t('within2') +
            ',[input]' +
            this.$t('labelYuan') +
            ',' +
            this.$t('每增加') +
            '[input]' +
            this.$t('piece') +
            ',' +
            this.$t('增加运费') +
            '[input]' +
            this.$t('labelYuan')
        },
        {
          chargeWay: 11,
          underUnit: { th: this.$t('the_first_heavy') + '(g)', td: '' },
          underUnitCost: {
            th: this.$t('the_first_fee') + '(' + this.$t('labelYuan') + ')',
            td: ''
          },
          perUnit: { th: this.$t('continued_heavy') + '(g)', td: '' },
          perUnitCost: {
            th: this.$t('续费') + '(' + this.$t('labelYuan') + ')',
            td: ''
          },
          desc:
            this.$t('within1') +
            '[input]g' +
            this.$t('within2') +
            ',[input]' +
            this.$t('labelYuan') +
            ',' +
            this.$t('每增加') +
            '[input]g,' +
            this.$t('增加运费') +
            '[input]' +
            this.$t('labelYuan')
        },
        {
          chargeWay: 12,
          underUnit: { th: this.$t('first_volume') + '(cm³)', td: '' },
          underUnitCost: {
            th: this.$t('the_first_fee') + '(' + this.$t('labelYuan') + ')',
            td: ''
          },
          perUnit: { th: this.$t('continuous_volume') + '(cm³)', td: '' },
          perUnitCost: {
            th: this.$t('续费') + '(' + this.$t('labelYuan') + ')',
            td: ''
          },
          desc:
            this.$t('within1') +
            '[input]cm³' +
            this.$t('within2') +
            ',[input]' +
            this.$t('labelYuan') +
            ',' +
            this.$t('每增加') +
            '[input]cm³,' +
            this.$t('增加运费') +
            '[input]' +
            this.$t('labelYuan')
        },
        {
          // 目前好像没有13
          chargeWay: 13,
          underUnit: { th: this.$t('订单金额（元）'), td: '<' },
          underUnitCost: { th: this.$t('首费(元)'), td: '' },
          perUnit: { th: this.$t('订单金额（元）'), td: '≧' },
          perUnitCost: { th: this.$t('续费(元)'), td: '' },
          desc: this.$t(
            '订单金额小于[input]元内，收取运费[input]元； 订单金额满[input]元， 运费[input]元'
          )
        }
      ]
    }
  },
  watch: {},
  mounted() {
    vm = this
    this.init()
  },
  activated() {
    this.queryFreightTemplateList()
  },
  methods: {
    async init() {
      this.initCodes()
      this.queryMerchantList()
      await this.queryFreightTemplateList()
    },
    initCodes() {
      this.$oms.$api.common
        .listByCategorysForOrder({
          categorys: ['CHARGE_WAYS', 'IS_DEFS', 'FREIGHT_TYPE']
        })
        .then(data => {
          vm.codes = data.data
        })
    },
    queryMerchantList() {
      this.merchantMap = {}
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          this.merchantList = data.data.listObj
          this.merchantMap = data.data.listObj.reduce((m, i) => {
            m[i.merchantId] = i.merchantName
            return m
          }, {})
        })
    },
    // 查询运费模版列表数据
    async queryFreightTemplateList() {
      var query = {
        page: this.page.current,
        limit: this.page.size,
        filters: { ...this.queryContent }
      }
      if (query.filters.isDft === '') {
        delete query.filters.isDft
      }
      if (query.filters.type === '') {
        delete query.filters.type
      }
      if (query.filters.chargeWay === '') {
        delete query.filters.chargeWay
      }
      if (query.filters.merchantId === '') {
        delete query.filters.merchantId
      }
      this.loading = true
      return this.$oms.$api.freightTemplate
        .freightTemplateListPage(query)
        .then(result => {
          if (result.code === '0') {
            vm.freightTemplateList = result.data
            vm.page.total = result.total
          } else {
            vm.$message(result.message)
          }
          vm.loading = false
        })
        .catch(res => {
          vm.loading = false
        })
    },
    async query() {
      await this.queryFreightTemplateList()
    },
    // 设为默认
    setDefaultFreight(id) {
      this.$oms.$api.freightTemplate
        .freightTemplateSetDefault({ freightTemplateId: id })
        .then(result => {
          if (result.code === '0') {
            vm.queryFreightTemplateList()
            vm.$message({
              message: this.$t('set_up_success'),
              type: 'success'
            })
          } else {
            vm.$message(result.message)
          }
        })
    },
    // 删除
    deleteFreightTemplate(id) {
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$oms.$api.freightTemplate
          .freightTemplateDelete({ freightTemplateId: id })
          .then(result => {
            if (result.code === '0') {
              vm.queryFreightTemplateList()
            } else {
              vm.$message(result.message)
            }
          })
      })
    },
    // 设为默认 删除 是否显示控制
    showConfPage(ele) {
      var flag = false
      if (!ele) {
        flag = true
      }
      return flag
    },
    // 页面数据是否显示
    isShow(ele) {
      var flag = false
      if (ele) {
        flag = true
      }
      return flag
    },
    // 包邮运费模版不显示
    isFreeShipping(val) {
      if (val === 2) {
        return false
      }
      return true
    },
    // 获取运送方式描述
    getDeliveryTemplateItemDesc(cw, pos) {
      // var describe = null
      var desc = {}
      if (
        cw !== null &&
        cw !== undefined &&
        pos !== null &&
        pos !== undefined
      ) {
        for (var i in vm.deliveryTemplateItemText) {
          if (cw === vm.deliveryTemplateItemText[i].chargeWay) {
            var deliveryTemplateItemTexts = vm.deliveryTemplateItemText[i]
            if (
              deliveryTemplateItemTexts !== null &&
              deliveryTemplateItemTexts !== undefined
            ) {
              if (pos === PER_UNIT) {
                desc = deliveryTemplateItemTexts.perUnit.th
                return desc
              } else if (pos === PER_UNIT_COST) {
                desc = deliveryTemplateItemTexts.perUnitCost.th
                return desc
              } else if (pos === UNDER_UNIT) {
                desc = deliveryTemplateItemTexts.underUnit.th
                return desc
              } else if (pos === UNDER_UNIT_COST) {
                desc = deliveryTemplateItemTexts.underUnitCost.th
                return desc
              }
            }
          }
        }
      }
      return ''
    },
    // 是否存在包邮运费模版标识
    isExitFreeShipping(val) {
      if (val === '' || val === undefined || val === null || val.length === 0) {
        return false
      }
      for (var i = 0; i < val.length; i++) {
        var freightTemplateItem = val[i]
        if (freightTemplateItem['type'] === 2) {
          return true
        }
      }
      return false
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.queryFreightTemplateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.queryFreightTemplateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    goAdd() {
      this.$router.push({
        name: 'OmsFreightTemplateModify',
        params: { freightTemplateId: null }
      })
    },
    edit(id) {
      this.$router.push({
        name: 'OmsFreightTemplateModify',
        params: { freightTemplateId: id }
      })
    },
    handleReset() {
      this.queryContent = { ...queryContent }
      this.page.current = 1
    }
  }
}
</script>
<style lang="scss" scoped>
.context-div {
  width: 100%;
  min-width: 800px;
  margin-top: 15px;
  font-size: 0.92em;
  border-right: 1px solid #edf1f2;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.context-div button {
  border-radius: 12px;
}
.header-class {
  width: 100%;
  background-color: #f6f8f8;
  border: 1px solid #edf1f2;
  padding: 10px 15px;
}
.header-class span {
  display: inline-block;
}
.header-class .but {
  float: right;
  margin-top: -5px;
}
.table-class {
  border: 1px solid #edf1f2;
}
.table-class th,
.table-class td {
  padding: 8px 10px;
  border-left: 1px solid #eaeff0;
  border-bottom: 1px solid #eaeff0;
}
</style>

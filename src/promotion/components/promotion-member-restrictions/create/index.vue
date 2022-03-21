<template>
  <div class="pg-member-restrictions">
    <ody-box :title="$t('创建限购规则')">
      <div v-if="steps <= 0">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置促销规则')" />
          <el-step :title="$t('完成创建')" />
        </el-steps>
        <el-form
          v-if="steps === 0"
          ref="promotionActivityDetail"
          :model="promotionActivityDetail"
          :rules="rules"
          label-width="100px"
          class="form"
        >
          <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
            <promotion-restrictions-channel-arr-checkbox
              v-model="promotionActivityDetail.channelCodes"
              :is-show-all="true"
              :checked-all="true"
              name="promotionActivityDetail_channelCodes"
            />
          </el-form-item>
          <el-form-item :label="$t('限购对象')" required>
            <el-radio
              v-model="tradeLimitTarget"
              name="tradeLimitTarget"
              label="1"
            >{{ $t('按会员类型设置') }}</el-radio>
          </el-form-item>
          <el-form-item prop="memTypeList" name="memTypeList" required>
            <promotion-member-types-checkbox
              v-model="promotionActivityDetail.memTypeList"
              :selected.sync="memberTypesSelected"
              :checked-all="promotionId === ''"
              name="promotionActivityDetail_memTypeList"
            />
          </el-form-item>

          <el-form-item :label="$t('时间范围')" prop="timeScope" name="timeScope">
            <el-form-item>
              <el-radio
                v-model="promotionActivityDetail.timeScope"
                :label="3"
                name="promotionActivityDetail_timeScope"
              >
                无期限，规则开始时间
                <el-form-item
                  v-if="promotionActivityDetail.timeScope === 3"
                  prop="startDate4NoLimit"
                  name="startDate4NoLimit"
                  class="dib"
                >
                  <el-date-picker
                    v-model="promotionActivityDetail.startDate4NoLimit"
                    :placeholder="$t('选择日期')"
                    name="promotionActivityDetail_startDate4NoLimit"
                    type="datetime"
                  />
                </el-form-item>
              </el-radio>
            </el-form-item>
            <el-form-item>
              <el-radio
                v-model="promotionActivityDetail.timeScope"
                :label="2"
                name="promotionActivityDetail_timeScope0"
              >
                按周期
                <template v-if="promotionActivityDetail.timeScope === 2">
                  ,每
                  <el-form-item prop="period" name="period" class="dib">
                    <ody-input-number
                      v-model="promotionActivityDetail.period"
                      name="promotionActivityDetail_period"
                    />
                  </el-form-item>
                  <el-form-item prop="unit" name="unit" class="dib">
                    <ody-select2
                      v-model="promotionActivityDetail.unit"
                      :placeholder="$t('请选择周期')"
                      name="promotionActivityDetail_unit"
                      list-key="unitTypeMap"
                    />
                  </el-form-item>
                </template>
              </el-radio>
            </el-form-item>
            <el-form-item>
              <el-radio
                v-model="promotionActivityDetail.timeScope"
                :label="1"
                name="promotionActivityDetail_timeScope4"
              >
                自定义期限
                <template v-if="promotionActivityDetail.timeScope === 1">
                  <el-form-item prop="date4Customize" name="date4Customize" class="dib">
                    <el-date-picker
                      v-model="promotionActivityDetail.date4Customize"
                      :start-placeholder="$t('开始日期')"
                      :end-placeholder="$t('结束日期')"
                      name="promotionActivityDetail_date4Customize"
                      type="datetimerange"
                      range-separator="-"
                    />
                  </el-form-item>
                </template>
              </el-radio>
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <template slot="label">
              <ody-tip-star :content="$t('限购条件')" />
            </template>
            <el-form-item style="margin-bottom: 16px;">
              <el-checkbox
                v-model="promotionActivityDetail.totalAmountLimitChecked"
                :label="$t('购买总额限制')"
                name="promotionActivityDetail_totalAmountLimitChecked"
              />
              <template v-if="promotionActivityDetail.totalAmountLimitChecked">
                <el-form-item prop="totalAmountLimit" name="totalAmountLimit" class="dib">
                  <ody-input-number
                    v-model="promotionActivityDetail.totalAmountLimit"
                    :min="0.01"
                    :max="9999999"
                    :empty-tip="false"
                    :decimal="2"
                    name="promotionActivityDetail_totalAmountLimit"
                  >
                    <template slot="append">{{ $t('元') }}</template>
                  </ody-input-number>
                </el-form-item>
              </template>
            </el-form-item>
            <el-form-item style="margin-bottom: 16px;">
              <el-checkbox
                v-model="promotionActivityDetail.orderCountLimitChecked"
                :label="$t('下单数量限制')"
                name="promotionActivityDetail_orderCountLimitChecked"
              />
              <template v-if="promotionActivityDetail.orderCountLimitChecked">
                <el-form-item prop="orderCountLimit" name="orderCountLimit" class="dib">
                  <ody-input-number
                    v-model="promotionActivityDetail.orderCountLimit"
                    :min="1"
                    :empty-tip="false"
                    name="promotionActivityDetail_orderCountLimit"
                  >
                    <template slot="append">{{ $t('单') }}</template>
                  </ody-input-number>
                </el-form-item>
              </template>
            </el-form-item>
            <el-form-item style="margin-bottom: 16px;">
              <el-checkbox
                v-model="promotionActivityDetail.canShowProductLimit"
                :label="$t('购买商品数量限制')"
                name="promotionActivityDetail_canShowProductLimit"
              />
              <template v-if="promotionActivityDetail.canShowProductLimit">
                <el-row>
                  <el-col :span="3">
                    <span>商品范围:</span>
                  </el-col>
                  <el-col :span="10">
                    <div>
                      <el-radio
                        v-model="promotionActivityDetail.productScope"
                        :label="1"
                        name="promotionActivityDetail_productScope"
                      >
                        所有商品
                        <template v-if="promotionActivityDetail.productScope === 1">
                          ，每sku最多买
                          <el-form-item prop="countLimit4Skus" name="countLimit4Skus" class="dib">
                            <ody-input-number
                              v-model="promotionActivityDetail.countLimit4Skus"
                              :min="1"
                              :empty-tip="false"
                              name="promotionActivityDetail_countLimit4Skus"
                            >
                              <template slot="append">{{ $t('件') }}</template>
                            </ody-input-number>
                          </el-form-item>
                        </template>
                      </el-radio>
                    </div>
                    <div>
                      <el-radio
                        v-model="promotionActivityDetail.productScope"
                        :label="2"
                        name="promotionActivityDetail_productScope9"
                      >
                        部分单品
                        <template v-if="promotionActivityDetail.productScope === 2">
                          <el-form-item prop="countLimit4Partials" name="countLimit4Partials" class="dib">
                            <el-button
                              name="goodsVisible"
                              type="primary"
                              size="small"
                              @click="goodsVisible = true"
                            >{{ $t('添加商品') }}</el-button>
                          </el-form-item>
                        </template>
                      </el-radio>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-form-item>
            <div
              v-if="promotionActivityDetail.canShowProductLimit && promotionActivityDetail.productScope === 2 && promotionActivityDetail.countLimit4Partials && promotionActivityDetail.countLimit4Partials.length"
            >
              <el-form
                ref="batchForm"
                :inline="true"
                :rules="batchFormRules"
                :model="batchForm"
                class="demo-form-inline"
              >
                <el-form-item :label="$t('限购总数')">
                  <ody-input-number v-model="batchForm.limitCount" name="batchForm_limitCount" />
                </el-form-item>
                <el-form-item>
                  <el-button
                    name="handleBatchSave"
                    type="primary"
                    size="small"
                    @click="handleBatchSave"
                  >{{ $t('保存') }}</el-button>
                </el-form-item>
              </el-form>
              <ody-table
                :data="promotionActivityDetail.countLimit4Partials"
                :columns="columns"
                :checked.sync="checked"
                :multiple="true"
                :can-filter="false"
                name="promotionActivityDetail_countLimit4Partials170"
              >
                <template slot="limitCount" slot-scope="scope">
                  <ody-input-number v-model="scope.row.limitCount" />
                </template>
              </ody-table>
            </div>
          </el-form-item>
          <el-form-item :label="$t('备注')" prop="description" name="description">
            <el-input
              :rows="4"
              v-model="promotionActivityDetail.description"
              name="promotionActivityDetail_description"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>
      <promotion-created-success
        v-if="steps > 0"
        :get-list="false"
        :prom-type="promotionActivityDetail.promotionType"
        :promotion-id="promotionId"
      />
    </ody-box>
    <ody-fixed>
      <ody-button
        v-show="steps === 0"
        name="handleComplete"
        type="primary"
        code="button009"
        @click="handleComplete('promotionActivityDetail')"
      >{{ $t('完成') }}</ody-button>
      <!-- <el-button v-show="steps > 0" name="backEvent" type="primary" @click="backEvent">{{ $t('返回') }}</el-button> -->
    </ody-fixed>
    <promotion-goods-dialog-choose
      v-if="goodsVisible"
      :visible.sync="goodsVisible"
      :multiple="true"
      :prom-type="10000"
      :params="{
        merchantType: '',
        promType: 10000,
        promotionId: promotionId,
        channelSelecteds: ['110001','110002','110003'],
        searchType: 1,
        sellType: 1,
        storeIds: [],
        categoryType: '1',
        brandType: '1',
        brandIds: [],
        categoryIds: []
      }"
      choose-key="mpId"
      @ok="ok"
    />
  </div>
</template>

<script>
import LotterySetSuccess from '@/components/lottery-set-success'
import PromotionRestrictionsChannelArrCheckbox from '@/components/promotion-restrictions-channel-arr-checkbox'
import PromotionMemberTypesCheckbox from '@/components/promotion-member-types-checkbox'
import promotionActivityDetail from '@/components/promotion-restrictions-time-scope-radio'
import PromotionPurchaseRestrictionsSet from '@/components/promotion-purchase-restrictions-set'
import PromotionCreatedSuccess from '@/components/promotion-created-success'
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'

export default {
  name: 'PromMemberRestrictionsEdit',
  components: {
    LotterySetSuccess,
    PromotionRestrictionsChannelArrCheckbox,
    PromotionMemberTypesCheckbox,
    promotionActivityDetail,
    PromotionPurchaseRestrictionsSet,
    PromotionCreatedSuccess,
    PromotionGoodsDialogChoose
  },
  props: {},
  data() {
    return {
      batchFormRules: {
        limitCount: [
          {
            required: true,
            message: this.$t('请输入限购总数'),
            trigger: 'blur'
          }
        ]
      },
      batchForm: {
        limitCount: null // 限购总数
      },
      checked: [],
      columns: [
        {
          label: this.$t('类目'),
          prop: 'categoryName',
          show: true,
          minWidth: 150
        },
        {
          label: this.$t('商品名称'),
          prop: 'mpName',
          show: true,
          minWidth: 150
        },
        {
          label: this.$t('商品编码'),
          prop: 'mpCode',
          show: true,
          minWidth: 150
        },
        {
          label: this.$t('商品价格'),
          prop: 'price',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('店铺名称'),
          prop: 'storeName',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('个人限购总数'),
          slot: 'limitCount',
          show: true,
          minWidth: 120
        }
      ],
      goodsVisible: false,
      getDeatilFlag: false,
      steps: 0,
      memberTypesSelected: [],
      timeScopeSelected: [],
      type: '',
      id: '',
      tradeLimitTarget: '1', // 按会员类型设置
      promotionId: '',
      promotionActivityDetail: {
        id: this.promotionId,
        channelCodes: [], // 活动渠道
        memTypeList: [], // 会员类型
        merchantType: 1,
        promotionType: 10000,
        startDate: undefined,
        timeScope: 3, // 时间范围， 3，2，1
        startDate4NoLimit: null, // 无期限-开始日期
        period: undefined, // 按周期-多少
        unit: null, // 按周期-每-单位
        date4Customize: [], // 自定义期限-【开始时间，结束时间】
        startDate4Customize: undefined, // 自定义期限-开始时间
        endDate4Customize: undefined, // 自定义期限-结束时间
        totalAmountLimitChecked: false,
        totalAmountLimit: undefined, // 购买总限制额度
        orderCountLimitChecked: false,
        orderCountLimit: undefined, // 下单总限制额度
        productScope: 1, // 商品 1 全部 2部分
        countLimit4Skus: undefined, // 购买商品数量限制-每个sku最多够买多少
        countLimit4Partials: [] // 购买商品数量限制-部分商品 { 'currentPage': 0, 'itemsPerPage': 0, 'mpId': 1912160005418172, 'mpIds': null, 'mpName': '4472300', 'mpCode': '4472300', 'mpCodes': null, 'mpBarcode': null, 'seriesId': 1912160005418172, 'seriesCode': null, 'seriesName': null, 'productIds': null, 'productId': -1, 'pCode': null, 'pName': null, 'productBarcode': null, 'merchantId': 1912030007461745, 'merchantName': this.$t('ody商家'), 'merchantCode': null, 'promType': null, 'promotionId': null, 'searchType': 1, 'brandIds': null, 'brandName': null, 'categoryIds': null, 'categoryId': 1912040007454115, 'categoryName': this.$t('饼干'), 'stock': null, 'price': 0, 'sortType': null, 'salesVolume': 0, 'volume4sale': 0, 'categoryType': null, 'brandType': null, 'sellType': null, 'typeOfProduct': 0, 'merchantType': null, 'productType': null, 'storeIds': null, 'storeId': 1912040005285683, 'activityAttendRecordIds': [], 'giftNum': null, 'giftType': null, 'totalLimit': null, 'thirdCode': null, 'minPrice': null, 'maxPrice': null, 'markChoosed': false, 'orderStartNum': null, 'orderMultiple': null, 'businessType': null, 'measurementUnit': this.$t('千克'), 'channelCodes': null, 'channelCode': '110001', 'mpFlag': null, 'channelSelecteds': null, 'selectedMerchantIds': null, 'barcodeId': null, 'barcode': '4472300', 'barcodes': null, 'categoryNodeName': null, 'mpStandard': null, 'merchantIds': null, 'barcodeIds': null, 'mpPrice': null, 'purchasePrice': null, 'supplierId': null, 'supplierCode': null, 'supplierName': null, 'scopeType': null, 'mpParentId': null, 'import': false, 'storeName': this.$t('odyBBC商城'), 'saveShopMp': false, 'attend': false, 'combineType': false, 'addAll': false, 'startItem': 0, 'limitCount': '' }
      },
      rules: {
        channelCodes: [
          {
            required: true,
            message: this.$t('请选择活动渠道'),
            trigger: ['change', 'blur']
          }
        ],
        memTypeList: [
          {
            required: true,
            message: this.$t('请选择会员类型'),
            trigger: ['change', 'blur']
          }
        ],
        startDate4NoLimit: [
          {
            required: true,
            message: this.$t('请输入规则开始时间'),
            trigger: 'blur'
          }
        ],
        timeScope: [
          {
            required: true,
            message: this.$t('请选择时间范围'),
            trigger: 'blur'
          }
        ],
        period: [
          { required: true, message: this.$t('请输入周期'), trigger: 'blur' }
        ],
        unit: [
          { required: true, message: this.$t('请选择单位'), trigger: 'blur' }
        ],
        date4Customize: [
          {
            required: true,
            message: this.$t('请输入自定义期限'),
            trigger: 'blur'
          }
        ],
        totalAmountLimit: [
          {
            required: true,
            message: this.$t('请输入购买总限制额度'),
            trigger: 'blur'
          }
        ],
        orderCountLimit: [
          {
            required: true,
            message: this.$t('请输入下单数量限制'),
            trigger: 'blur'
          }
        ],
        countLimit4Skus: [
          {
            required: true,
            message: this.$t('请输入每个sku最多够买'),
            trigger: 'blur'
          }
        ],
        countLimit4Partials: [
          {
            type: 'array',
            required: true,
            message: this.$t('请选择部分商品'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  created() {
    this.promotionId = this.$route.params.promotionId
    console.log(this.$route.params, 999)
    this.status = this.$route.params.status
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.type = this.$route.params.type
    this.promotionId = this.$route.params.promotionId
    this.getLoadPageConfigCommonOscUrl()
    if (this.promotionId) {
      this.isEdit = true
    } else {
      this.isEdit = false
      this.constructBackTree()
    }
    try {
      await this.query()
    } catch (e) {
      console.log(e)
    } finally {
      this.getDeatilFlag = true
    }
  },
  methods: {
    async handleBatchSave() {
      const [validError] = await this.formValidate('batchForm')

      if (validError) {
        return false
      }

      if (!(this.checked && this.checked.length)) {
        this.$message.error('请选择商品')
        return false
      }

      this.checked.forEach(item => {
        item.limitCount = this.batchForm.limitCount
      })
      // this.batchForm.limitCount = []
    },
    ok(res) {
      const oldMpIdMap = this.promotionActivityDetail.countLimit4Partials.reduce(
        (rtv, item) => {
          rtv[item.mpId] = true
          return rtv
        },
        {}
      )
      res.map(item => {
        if (!oldMpIdMap[item.mpId]) {
          item.limitCount = ''
          this.promotionActivityDetail.countLimit4Partials.push(item)
        }
      })
    },
    async query() {
      if (this.promotionId !== '' && this.promotionId !== undefined) {
        const params = this.promotionId
        const res = await this.promotionAPI.editRestrictions(params)
        if (res && res.code === '0' && res.data) {
          const promotionActivityDetail = res.data
          promotionActivityDetail.totalAmountLimitChecked =
            promotionActivityDetail.totalAmountLimit > 0
          promotionActivityDetail.orderCountLimitChecked =
            promotionActivityDetail.orderCountLimit > 0
          if (
            promotionActivityDetail.countLimit4Partials &&
            promotionActivityDetail.countLimit4Partials.length
          ) {
            promotionActivityDetail.productScope = 2
            promotionActivityDetail.canShowProductLimit = true
            const mpIds = promotionActivityDetail.countLimit4Partials.map(
              x => x.mpId
            )
            const mpIdLimitCountMap = promotionActivityDetail.countLimit4Partials.reduce(
              (rtv, item) => {
                rtv[item.mpId] = item.limitCount
                return rtv
              },
              {}
            )
            const {
              data: { listObj: countLimit4Partials = [] }
            } = await this.promotionAPI.queryOmnichannelProductList({
              obj: {
                brandType: 1,
                categoryType: 1,
                promType: 10000,
                sellType: 1,
                merchantType: 1,
                mpIds,
                promotionId: this.promotionId
              },
              currentPage: 1,
              itemsPerPage: mpIds.length || 10
            })

            // console.log(countLimit4Partials)

            // console.log(promotionActivityDetail, promotionActivityDetail.limitCount)

            promotionActivityDetail.countLimit4Partials = countLimit4Partials.map(
              x => {
                return {
                  ...x,
                  limitCount: mpIdLimitCountMap[x.mpId]
                }
              }
            )
          } else if (promotionActivityDetail.countLimit4Skus > 0) {
            promotionActivityDetail.productScope = 1
            promotionActivityDetail.canShowProductLimit = true
          }
          const timeScopeMap = {
            time_nolimit: 3,
            time_period: 2,
            time_range: 1
          }

          promotionActivityDetail.timeScope =
            timeScopeMap[promotionActivityDetail.timeScope]

          if (promotionActivityDetail.timeScope === 3) {
            promotionActivityDetail.startDate4NoLimit =
              promotionActivityDetail.startDate
          } else if (promotionActivityDetail.timeScope === 1) {
            promotionActivityDetail.date4Customize = [
              new Date(promotionActivityDetail.startDate),
              new Date(promotionActivityDetail.endDate)
            ]
          }
          promotionActivityDetail.unit = promotionActivityDetail.unit || null

          this.promotionActivityDetail = promotionActivityDetail
        }
      }
    },
    constructBackTree() {
      this.promotionAPI.constructBackTree({}).then(res => {
        if (res && res.code === '0' && res.data) {
          this.promotionId = res.data.id
        }
      })
    },
    getPromotionActivityScope(val) {
      this.promotionActivityDetail.countLimit4Skus = val.countLimit4Skus
    },
    getLoadPageConfigCommonOscUrl() {
      this.promotionAPI
        .getLoadPageConfigCommonOscUrl('PAGE_CONFIG_NOT_SAME')
        .then(res => {
          if (res && res.code === '0') {
            console.log()
          }
        })
    },
    // 完成
    handleComplete(formName) {
      if (this.$refs.promotionActivityDetail) {
        var canSave = true
        // this.$refs.promotionActivityDetail.$refs.promotionPurchaseRestrictionsSet.validate((valid) => {
        //   if (valid) {
        //     canSave = true
        //     this.$refs.promotionActivityDetail.$refs.promotionPurchaseRestrictionsSet.updatedParentData()
        //   }
        // })
        this.$refs.promotionActivityDetail.validate(valid => {
          if (valid && canSave) {
            const {
              date4Customize,
              totalAmountLimitChecked,
              orderCountLimitChecked,
              canShowProductLimit,
              countLimit4Partials,
              ...params
            } = this.promotionActivityDetail
            console.log(this.promotionActivityDetail, 222)
            if (!totalAmountLimitChecked && !orderCountLimitChecked && !canShowProductLimit) {
              this.$message({
                type: 'error',
                message: this.$t('请选择限购条件')
              })
              return false
            }
            if (!totalAmountLimitChecked) {
              params.totalAmountLimit = ''
            }
            if (!orderCountLimitChecked) {
              params.orderCountLimit = ''
            }
            if (!canShowProductLimit) {
              params.countLimit4Skus = ''
            }
            if (canShowProductLimit) {
              if (params.productScope === 2) {
                const hasError = countLimit4Partials.some(x => !x.limitCount)

                if (hasError) {
                  this.$message({
                    type: 'error',
                    message: this.$t('限购数量不能为空')
                  })
                  return false
                }

                params.countLimit4Partials = countLimit4Partials.map(x => {
                  return {
                    mpId: x.mpId,
                    limitCount: x.limitCount
                  }
                })
                params.countLimit4Skus = null
              } else if (params.productScope === 1) {
                params.countLimit4Partials = []
              }
            }
            if (params.timeScope === 3) {
              params.startDate = new Date(params.startDate4NoLimit) * 1
            }
            if (params.timeScope === 1) {
              const [startDate4Customize, endDate4Customize] =
                date4Customize || []
              params.startDate = new Date(startDate4Customize) * 1
              params.endDate = new Date(endDate4Customize) * 1
            }
            params.countLimit4Partials = params.countLimit4Partials || []
            params.promotionType = 10000
            params.unit = params.unit || 0

            if (this.isEdit) {
              console.log(params, 111)
              // console.log('old-angular', {
              //   'id': 2004260000000095,
              //   'name': 'defaultName',
              //   'description': '2222',
              //   'timeScope': 3,
              //   'status': 0,
              //   'startDate': 1587872675000,
              //   'endDate': null,
              //   'period': null,
              //   'unit': 0,
              //   'totalAmountLimit': '12',
              //   'orderCountLimit': '21',
              //   'countLimit4Skus': null,
              //   'memTypeList': ['1'],
              //   'createUserid': null,
              //   'createUsername': null,
              //   'countLimit4Partials': [],
              //   'channelCodes': ['110001', '110002', '110003'],
              //   'promotionType': 10000
              // })
              // console.log('new-vue', params)
              // debugger
              this.promotionAPI.updateRstriction(params).then(res => {
                if (res.code === '0' && res.data) {
                  this.promotionId = res.data
                  this.steps = ++this.steps
                }
              })
            } else {
              this.promotionAPI.createRestrictions(params).then(res => {
                if (res.code === '0' && res.data) {
                  this.promotionId = res.data
                  this.steps = ++this.steps
                }
              })
            }
          } else {
            return false
          }
        })
      } else {
        this.steps = ++this.steps
      }
    },
    backEvent() {
      this.$router.push({
        name: 'PromMemberRestrictions'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dib {
  display: inline-block;
  vertical-align: middle;
}
.form {
  margin-top: 20px;
}
.no-edit {
  pointer-events: none;
}
.purchase-restrictions {
  width: 100px;
  margin-left: -100px;
  font-weight: 700;
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 13px;
  color: #666;
  line-height: 32px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>

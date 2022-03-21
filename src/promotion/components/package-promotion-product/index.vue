<template>
  <div class="bg-promotion-single-set-product">
    <div class="activity-merchant">
      <div>
        <ody-title :title="$t('套餐优惠设置')"/>
      </div>

    </div>
    <div class="product-group">
      <ody-title :title="$t('主商品组')"/>
      <ody-space :space="4">
        <div class="base-info">
          <div class="header">{{ $t('优惠门槛') }}</div>
          <div class="item">{{ $t('任意 1商品') }} </div>
        </div>
        <div class="base-info">
          <div class="header">{{ $t('操作') }}</div>
          <div class="item">
            <el-button name="addGoods" type="text" @click="addGoods(promotionMainRuleId, 0)">{{ $t('添加商品') }}</el-button>
            <el-button name="viewAddGoods" type="text" @click="viewAddGoods(promotionMainRuleId, 0)">{{ $t('查看商品详情') }}</el-button>
          </div>
        </div>
      </ody-space>
    </div>
    <div class="product-group">
      <ody-title :title="$t('搭配商品组')"/>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :data="giftTable.data"
            :columns="giftTable.columns"
            :operates="giftTable.operates"
            :can-filter="false"
            name="giftTable_data357"
          >
            <template slot="promotionId" slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
            <template slot="type" slot-scope="scope">
              搭配商品组
            </template>
            <template slot="conditionValue" slot-scope="scope">
              <div class="condition-value">
                {{ $t('满') }}
                <ody-input-number v-model="scope.row.conditionValue" :min="1" :max="9999999" :empty-tip="false" name="scope_row_conditionValue"/>
                {{ $t('种商品') }}
              </div>
            </template>
          </ody-table>
        </div>
        <div slot="btn">
          <el-button :disabled=" giftTable.data.length >= 5 " name="addGiftLevel" size="small" type="primary" @click="addGiftLevel">{{ $t('新增分组') }}</el-button>
        </div>
      </ody-list-table-area>

    </div>

    <promotion-goods-dialog-choose
      v-if="goodsVisible"
      :visible.sync="goodsVisible"
      :multiple="true"
      :params="searchParams"
      :prom-type="promType"
      choose-key="mpId"
      @ok="handleGoodsDialogChooseOk"
    />
    <promotion-goods-detail-dialog-choose
      v-if="goodsDetailVisible"
      :visible.sync="goodsDetailVisible"
      :multiple="true"
      :content-type="contentType"
      :promotion-id="promotionId"
      :promotion-rule-id="promotionRuleId"
      choose-key="mpId"
      @ok="ok"
    />
  </div>
</template>

<script>
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'
import PromotionGoodsDetailDialogChoose from '@/components/promotion-goods-detail-dialog-choose'

export default {
  components: {
    PromotionGoodsDialogChoose,
    PromotionGoodsDetailDialogChoose
  },
  props: {
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchParams: {
        merchantType: '',
        promType: this.promType,
        promotionId: this.promotionId,
        searchType: 1,
        sellType: 1,
        storeIds: [],
        categoryType: '1',
        brandType: '1'
      },
      goodsVisible: false,
      goodsDetailVisible: false,

      promotionAPI: null,
      contentType: '',
      merchantType: '',

      level: '',
      promotionMainRuleId: '',
      promotionRuleId: '',
      promotionActivityDetail: {},
      giftTable: {
        columns: [
          {
            label: this.$t('分组编号'),
            slot: 'promotionId',
            show: true
          },
          {
            label: this.$t('优惠门槛'),
            slot: 'conditionValue',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('商品组类型'),
            slot: 'type',
            show: true
          }
        ],
        operates: {
          width: 280,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              hidden: () => {
                return this.giftTable.data.length === 1
              },
              method: (index, row) => {
                this.delPromotionRule(row)
              },
              code: 'button024'
            },
            {
              label: this.$t('添加商品'),
              method: (index, row) => {
                this.addGoods(row.promotionRuleId)
              },
              code: 'button025'
            },
            {
              label: this.$t('查看商品详情'),
              method: (index, row) => {
                this.viewAddGoods(row.promotionRuleId)
              },
              code: 'button020'
            }
          ]
        },
        data: []
      }
    }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPromotionActivityDetail()
    await this.queryGiftLevelList()
  },
  methods: {
    async delPromotionRule(row) {
      await this.promotionAPI.delGiftLevel({
        promotionId: row.promotionId,
        promotionRuleId: row.promotionRuleId
      })
      await this.queryGiftLevelList()
    },
    async addGiftLevel() {
      const params = {
        promotionId: this.promotionId,
        conditionType: this.conditionType,
        contentType: this.contentType,
        giftType: 3
      }

      const { code } = await this.promotionAPI.addGiftLevel(params)
      if (code === '0') {
        var sourceList = this.giftTable.data
        await this.queryGiftLevelList()
        // 把之前设置的值赋值回去
        for (var sourceIndex = 0; sourceIndex < sourceList.length; sourceIndex++) {
          var sourceItem = sourceList[sourceIndex]

          for (var targetIndex = 0; targetIndex < this.giftTable.data.length; targetIndex++) {
            var targetItem = this.giftTable.data[targetIndex]

            if (sourceItem.promotionRuleId === targetItem.promotionRuleId) {
              targetItem.conditionValue = sourceItem.conditionValue
            }
          }
        }
        // console.log(sourceList)
        // console.log(this.giftTable.data)
      }
    },
    addGoods(promotionRuleId, level = 1) {
      this.level = level
      this.promotionRuleId = promotionRuleId
      this.goodsVisible = true
    },
    viewAddGoods(promotionRuleId, level = 1) {
      this.level = level
      this.promotionRuleId = promotionRuleId
      this.goodsDetailVisible = true
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }

      const { data = {}, code } = await this.promotionAPI.getPromotionDetailUrl(params)

      if (code === '0') {
        console.log(data, 777)
        this.promotionActivityDetail = data
        this.contentType = data.promotionMethod
        this.conditionType = data.conditionType
        this.merchantType = data.merchantType
        this.searchParams.merchantType = data.merchantType
        this.searchParams.promType = data.frontPormotionType
      }
    },
    async queryGiftLevelList() {
      var sourceMap = this.$portal.deepClone(this.giftTable.data).reduce((prev, item) => {
        prev[item.promotionRuleId] = item
        return prev
      }, {})

      const { data, code } = await this.promotionAPI.queryGiftLevelList({ promotionId: this.promotionId })
      if (code === '0') {
        this.giftTableList = data || []
        this.giftTableList.map(item => {
          // 主的活动id
          if (item.level === 0) {
            item.conditionValue = 1
            this.promotionMainRuleId = item.promotionRuleId
          }
        })
        // 搭配商品组
        this.giftTable.data = this.giftTableList.filter(item => item.level === 1)

        // 把之前设置的值赋值回去
        this.giftTable.data.forEach(x => {
          const obj = sourceMap[x.promotionRuleId]
          const val = obj.conditionValue

          if (val !== undefined && val !== null) {
            x.conditionValue = val
          }
        })
      }
    },
    async handleGoodsDialogChooseOk(val) {
      const querySelectionProductList = val.map(data => {
        return {
          activityId: this.promotionId,
          id: data.mpId,
          mpCode: data.mpCode,
          mpName: data.mpName,
          merchantId: data.merchantId,
          merchantName: data.merchantName,
          productId: data.productId,
          contentType: this.contentType,
          isAvailable: 1,
          typeOfProduct: data.typeOfProduct,
          promotionType: 15,
          preSellStartTime: this.promotionActivityDetail.preSellStartTime,
          preSellEndTime: this.promotionActivityDetail.preSellEndTime,
          deliveryTimeString: this.promotionActivityDetail.deliveryTimeString,
          scopeType: this.promotionActivityDetail.scopeType,
          barCode: data.barCode
        }
      })

      const params = {
        isCommonPrice: true,
        level: this.level,
        promotionRuleId: this.promotionRuleId,
        querySelectionProductList
      }
      await this.promotionAPI.saveSelectionProduct(params)
    },
    async isCanSave() {
    // 验证商品
      const params = {
        promotionMethod: 20,
        isCommonPrice: true,
        id: this.promotionId,
        rules: this.giftTableList
      }
      const res = await this.promotionAPI.promotionPriceCheck(params)
      if (res.data.flag === false) {
        this.$message({
          type: 'warning',
          message: res.data.errorMessage
        })
        return false
      }

      // 验证是否选赠品
      this.giftTableList.map(item => {
        if (item.conditionValue) {
          item.conditionValue = +item.conditionValue
        }
      })
      const search = {
        promotionType: 15,
        promotionId: this.promotionId,
        rules: this.giftTableList
      }
      const result = await this.promotionAPI.updateGiftLevels(search)
      if (+result.code === 0) {
        return true
      } else {
        return false
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.bg-promotion-single-set-product {
  padding: 20px 10px 10px 10px;

  .activity-merchant {
    margin-bottom: 20px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .search-wrap {
      display: flex;

      .batch-delete {
        margin-left: 10px;
      }

      /deep/ .el-input-group__prepend {
        width: 120px;
        background-color: #fff;
      }

      /deep/ .el-input-group__append {
        padding: 0;
        background-color: #fff;

        /deep/ .el-button--default:hover,
        .el-button--default:focus {
          background: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
      }
    }
  }
  .product-group {
    padding: 10px 0;
    .base-info {
    font-size: 14px;
    .item {
      margin-top: 10px;
      a {
        color: #0066CC;
      }
    }
    .condition-value {
      width: 30px;
    }
  }
  }

}
</style>

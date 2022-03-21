<template>
  <div class="analysis-analysisTempModel">
    <ody-dialog :visible.sync="showTemplate" :title="title" width="640px" @close="templateClose">
      <!-- 首弹展示 -->
      <div v-if="!innerObj.showDetail">
        <el-form :inline="true" label-position="left" class="demo-form-inline">
          <el-form-item
            :label="$t('节点名称:')"
            class="displayblock form-item-label"
            style="margin-bottom: -3px !important;"
          >
            <span class="analy-span">{{ innerObj.anayName }}</span>
          </el-form-item>
          <!-- 通用分析模板 -->
          <el-form-item v-if="innerObj.roi" :label="$t('内容投入产出比（ROI）:')" class="form-item-label">
            <span>--</span>
          </el-form-item>
          <el-form-item :label="$t('触达方式:')" class="form-item-label">
            <span v-if="innerObj.roi">--</span>
            <span v-else>{{ $t('短信模板') }}</span>
          </el-form-item>
          <el-form-item :label="$t('营短信成本:')" class="form-item-label">
            <span>--</span>
          </el-form-item>
          <el-form-item
            v-if="innerObj.roi"
            :label="$t('覆盖会员数:')"
            class="displayblock form-item-label"
          >
            <span>--</span>
          </el-form-item>
          <!-- 尾款支付模板 -->
          <el-form-item v-if="innerObj.payEnd" :label="$t('覆盖会员数:')" class="form-item-label">
            <span>--</span>
          </el-form-item>
          <!-- 成长值模板 -->
          <el-form-item v-if="innerObj.growth" :label="$t('覆盖会员数:')" class="form-item-label">
            <span>--</span>
          </el-form-item>
        </el-form>
        <div class="analysis-el-button">
          <el-button
            name="innerObj_showDetail"
            type="primary"
            size="small"
            @click="innerObj.showDetail = true"
          >{{ $t('查看明细') }}</el-button>
          <el-button plain size="small">{{ $t('导出订单') }}</el-button>
        </div>
        <div>
          <img :src="innerObj.images" alt >
        </div>
      </div>
      <!-- 查看明细 -->
      <div v-if="innerObj.showDetail" class="innerObj-showDetail">
        <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in innerObj.anayTabList"
            :key="item"
            :label="item.label"
            :name="index"
          >
            <img :src="item.imageUrl" alt >
          </el-tab-pane>
        </el-tabs>
        <el-link
          :underline="false"
          name="innerObj_showDetail4"
          type="primary"
          class="innerObj-showDetail-el-link"
          @click="innerObj.showDetail = false"
        >{{ $t('返回') }}</el-link>
      </div>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
    showTemplate: {
      type: Boolean,
      default: false
    },
    tempCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 0,
      title: '',
      common: {
        anayName: '--',
        showDetail: false,
        roi: true,
        images: require('./images/common.png'),
        anayTabList: [
          {
            label: this.$t('会员明细'),
            imageUrl: require('./images/common-vip-detail.png')
          },
          {
            label: this.$t('商品明细'),
            imageUrl: require('./images/common-product-detail.png')
          },
          {
            label: this.$t('会员属性分析'),
            imageUrl: require('./images/common-vip-spec.png')
          },
          {
            label: this.$t('售后明细分析'),
            imageUrl: require('./images/common-aftersale.png')
          }
        ]
      },
      payEndMoney: {
        anayName: this.$t('催付尾款'),
        showDetail: false,
        payEnd: true,
        images: require('./images/pay-end-money.png'),
        anayTabList: [
          {
            label: this.$t('会员明细'),
            imageUrl: require('./images/pay-end-money-vip-detail.png')
          },
          {
            label: this.$t('商品明细'),
            imageUrl: require('./images/pay-end-money-product-detail.png')
          },
          {
            label: this.$t('会员属性分析'),
            imageUrl: require('./images/pay-end-money-vip-spec.png')
          },
          {
            label: this.$t('售后明细分析'),
            imageUrl: require('./images/pay-end-money-altersale.png')
          }
        ]
      },
      growth: {
        anayName: this.$t('成长值发放'),
        showDetail: false,
        growth: true,
        images: require('./images/growth.png'),
        anayTabList: [
          {
            label: this.$t('会员明细'),
            imageUrl: require('./images/growth-detail.png')
          }
        ]
      },
      innerObj: {}
    }
  },
  watch: {
    tempCode(newVal) {
      this.init(newVal)
    }
  },
  mounted() {
    // this.init(this.tempCode)
  },
  methods: {
    init(tempCode) {
      if (tempCode === 'common') {
        this.title = this.$t('通用分析模板')
        this.innerObj = this.common
        this.activeName = 0
      }
      if (tempCode === 'payEndMoney') {
        this.title = this.$t('支付尾款模板')
        this.innerObj = this.payEndMoney
        this.activeName = 0
      }
      if (tempCode === 'growth') {
        this.title = this.$t('成长值模板')
        this.innerObj = this.growth
        this.activeName = 0
      }
    },
    templateClose() {
      this.$emit('templateClose')
    }
  }
}
</script>
<style lang="less" scoped>
.analy-span {
  font-size: 14px;
  font-weight: 500;
  color: rgba(239, 83, 81, 1);
}
.analysis-el-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.mar20 {
  margin-top: 20px;
}
.displayblock {
  display: block !important;
}
img {
  width: 560px;
}
.innerObj-showDetail {
  position: relative;
  .innerObj-showDetail-el-link {
    position: absolute;
    right: 0px;
    top: 3%;
  }
}
.el-form-item.el-form-item--medium {
  margin-bottom: -10px !important;
  margin-right: 50px !important;
  font-weight: 400 !important;
  color: rgba(105, 122, 130, 1) !important;
}
/deep/.form-item-label .el-form-item__label {
  font-weight: 400;
  color: rgba(105, 122, 130, 1);
}
</style>

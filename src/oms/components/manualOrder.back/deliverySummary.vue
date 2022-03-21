<template>
  <section class="pg-deliverySummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('dispatch_plan') }}</span> <!-- 发运计划 -->
      </div>
      <el-row>
        <el-col v-if="!forDistributor" :span="8">
          <el-form-item :label="$t('do_logistics_time')" :rules="rules.deliveryDate" prop="deliveryDate" > <!-- 预计发货日期 -->
            <el-date-picker
              v-model="formData.deliveryDate"
              :placeholder="$t('please_choose')"
              name="formData_deliveryDate"
              type="date" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('do_delivery_method')" :rules="rules.orderDeliveryId" prop="orderDeliveryId"> <!-- 配送方式 -->
            <el-select v-model="formData.orderDeliveryId" name="formData_orderDeliveryId">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in orderDeliveryList" :label="item.value" :key="item.key" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>
<script>

export default {
  props: {
    collect: {
      type: Object,
      default: null
    },
    formData: {
      type: Object,
      default: null
    },
    forDistributor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      orderDeliveryList: [],
      rules: {
        deliveryDate: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderDeliveryId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async _initOrderDeliveryList() { // 初始化配送方式
      const queryParam = {
        filters: {
          isAvailable: 1
        }
      }
      const res = await this.$oms.$api.distributionModeItem.distributionModeItemList(queryParam)
      if (res.code === '0') {
        res.data.forEach(item => {
          this.orderDeliveryList.push({
            key: item['shippingCode'],
            value: item['distributionMode']
          })
        })
      }
    },
    init() {
      this._initOrderDeliveryList()
    }
  }
}

</script>

<style lang="scss" scoped>

</style>

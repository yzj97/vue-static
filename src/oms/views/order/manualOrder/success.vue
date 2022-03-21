<!--
 * @Author: your name
 * @Date: 2021-08-10 19:14:59
 * @LastEditTime: 2021-08-19 16:45:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-static/src/oms/views/order/manualOrder/success.vue
-->
<template>
  <div>
    <section class="pg-success" style="text-align: center; padding-top: 200px">
      <el-row>
        <el-button
          style="
            width: 80px !important;
            height: 120px !important;
            margin: 0px auto;
            margin-bottom: 20px;
          "
          type="success"
          circle
        >
          <i class="el-icon-check" style="font-size: 60px" />
        </el-button>
      </el-row>
      <el-row>
        <h2 class="el-row">{{ $t("create_order_success") }}</h2>
        <span>{{ message }}</span>
      </el-row>
      <el-row>
        <el-button type="primary" @click="createOrder">
          {{
            $t("manul_order_continue")
          }}
          <!-- <el-link name="createOrder" type="primary" @click="createOrder">{{
            $t("manul_order_continue")
          }}</el-link> -->
        </el-button>
        <el-button type="primary" @click="orderList">
          {{
            $t("manul_order_back_to_list")
          }}
          <!-- <el-link name="orderList" type="primary" @click="orderList">{{
            $t("manul_order_back_to_list")
          }}</el-link> -->
        </el-button>
      </el-row>
    </section>
  </div>
</template>
<script>
export default {
  name: 'OmsManualOrderSuccess',
  data() {
    return {
      message: null,
      menuName: 'OmsManualOrder',
      orderListMenuName: 'OmsOrderList'
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
    init() {
      if (this.$route.params.menuName) {
        this.menuName = this.$route.params.menuName
        this.$portal.delViewByName(this.menuName)
      }
      this.message = this.$route.params.message
    },
    createOrder() {
      this.$portal.delActiveView()
      // 防止当前页面已关闭还未跳转到人工下单页面
      setTimeout(() => {
        this.$router.push({
          name: this.menuName,
          params: {
            menuName: this.$route.name
          }
        })
      }, 200)
    },
    orderList() {
      this.$portal.delActiveView()
      // 防止当前页面已关闭还未跳转到订单列表
      setTimeout(() => {
        this.$router.push({
          name: this.orderListMenuName,
          params: {
            menuName: this.$route.name
          }
        })
      }, 200)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row{
  margin-bottom: 20px;
}
</style>

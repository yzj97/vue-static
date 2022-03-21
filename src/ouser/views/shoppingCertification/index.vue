<template>
  <div>
    <ody-box>
      <el-form :rules="rules" :model="obj">
        <el-form-item :label="'购物认证状态'" prop="canEdit">
          <el-radio v-model="obj.value" :label="'1'">开启</el-radio>
          <el-radio v-model="obj.value" :label="'0'">关闭</el-radio>
          <span>关闭后平台所有用户购物不需要员工认证即可下单购买</span>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <ody-button code="ui" type="primary" @click="save">确 定</ody-button>
      </span>
    </ody-box>
  </div>
</template>
<script>

export default {
  name: 'ShoppingCertification',
  data() {
    return {
      obj: {
        value: '1'
      },
      rules: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.getListPageInfoPage()
    },
    async getListPageInfoPage() {
      const params = {
        'currentPage': 1, 'itemsPerPage': 10, 'key': 'api.checkout.auth'
      }
      const { code, data: { listObj }} = await this.$ouser.$api.adminService.listPageInfoPage(params)
      if (+code === 0) {
        this.obj = listObj[0]
      }
    },
    async save() {
      const { code } = await this.$ouser.$api.adminService.updatePageInfo(this.obj)
      if (+code === 0) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }
    }
  }
}
</script>
<style scoped>
.dialog-footer{
  padding-left: 200px;
}
</style>

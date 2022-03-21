<template>
  <div class="advanced">
    <ody-box class="flag-wrap">
      <ody-flag :offset="[36, 36]" position="top-right" class="advanced__flag">
        待确认收款
      </ody-flag>
      <el-form label-suffix=":">
        <ody-grid :space="4">
          <el-form-item label="审批人" >
            <el-button type="text" size="small">
              24359043983643
            </el-button>
          </el-form-item>
          <el-form-item label="创建时间">
            2020-11-26    11:12:51
          </el-form-item>
          <el-form-item label="结算币种">
            CNY
          </el-form-item>
        </ody-grid>
      </el-form>
    </ody-box>
    <ody-box title="付款明细">
      <el-form label-suffix=":">
        <ody-grid :space="4">
          <el-form-item label="应付金额（CNY）" >
            2337.23
            <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="bottom-start">
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="实付金额（CNY）">
            2137.23
          </el-form-item>
          <el-form-item label="未付金额（CNY）">
            300.00
          </el-form-item>
        </ody-grid>
      </el-form>
    </ody-box>
    <ody-box>
      <ody-space space="1:3">
        <center-box>
          <div slot="title">已付款</div>
          <div slot="text">
            商家已经完成付款 <br >
            付款方式：线上支付-银行转账
          </div>
          <ody-left-right>
            <el-button slot="left" size="mini">作废</el-button>
            <el-button slot="right" type="primary" size="mini">编辑</el-button>
          </ody-left-right>
        </center-box>
        <div>
          <ody-title title="商家信息"/>
          <el-form label-suffix=":">
            <el-form-item label="商家名称" >
              XX商家
            </el-form-item>
            <el-form-item label="联系人姓名" >
              XX商家
            </el-form-item>
            <el-form-item label="联系人电话" >
              XX商家
            </el-form-item>
            <el-form-item label="商家地址" >
              XX商家
            </el-form-item>
            <ody-line />
            <ody-grid :space="2">
              <el-form-item label="本次付款金额" >
                1000
              </el-form-item>
              <el-form-item label="转账流水" >
                54341243325324
              </el-form-item>
              <el-form-item label="本次付款金额" >
                1000
              </el-form-item>
              <el-form-item label="转账流水" >
                54341243325324
              </el-form-item>
              <el-form-item label="本次付款金额" >
                1000
              </el-form-item>
              <el-form-item label="转账流水" >
                54341243325324
              </el-form-item>
              <el-form-item label="本次付款金额" >
                1000
              </el-form-item>
              <el-form-item label="转账流水" >
                54341243325324
              </el-form-item>
            </ody-grid>
          </el-form>
        </div>
      </ody-space>
    </ody-box>
    <ody-box>
      <ody-space space="1:3">
        <center-box class="center-box">
          <div slot="title">待收款</div>
          <div slot="text">商家已经打款，等到供应商确认收款</div>
        </center-box>
        <div>
          <ody-title title="供应商信息"/>
          <el-form label-suffix=":">
            <ody-grid :space="3">
              <el-form-item label="供应商名称" >
                XX供应商
              </el-form-item>
              <el-form-item label="供应商名称" >
                XX供应商
              </el-form-item>
              <el-form-item label="供应商名称" >
                XX供应商
              </el-form-item>
              <el-form-item label="供应商名称" >
                XX供应商
              </el-form-item>
              <el-form-item label="供应商名称" >
                XX供应商
              </el-form-item>
              <el-form-item label="供应商名称" >
                XX供应商
              </el-form-item>
              <el-form-item label="供应商名称" >
                XX供应商
              </el-form-item>
            </ody-grid>
          </el-form>
        </div>
      </ody-space>
    </ody-box>
  </div>
</template>

<script>
import CenterBox from './components/center-box.vue'

export default {
  components: { CenterBox },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
</style>

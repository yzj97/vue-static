<template>
  <section>
    <el-card :shadow="'never'" class="box-card agent-item">
      <h3>{{ $t('Essentialinformation') }}</h3>
      <el-row>
        <el-col :span="6">{{ $t('agentCode') }}：{{ agent.code }}</el-col>
        <el-col :span="6">
          {{ $t('common_state') }}：{{ agent.isEnabled === 0 ? $t('common_disable') : $t('common_enable') }}
        </el-col>
        <el-col :span="8">{{ $t('agentTime') }}：{{ agent.agentTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</el-col>
      </el-row>

      <div v-if="agent.primaryAgentMobile">
        <h3>{{ $t('prevAgentInfo') }}</h3>
        <el-row>
          <el-col :span="6">{{ $t('bindAgent') }}：{{ agent.primaryAgentMobile }}</el-col>
          <el-col :span="6">{{ $t('bindType') }}：{{ agent.inviteType === 0 ? $t('buyProduct') : $t('register') }}
          </el-col>
          <el-col :span="6">{{ $t('bindTime') }}：{{ agent.bindTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</el-col>
        </el-row>
      </div>
      <h3>{{ $t('customerQuantity') }}</h3>
      <el-row>
        <el-col :span="6">{{ $t('customer.level.I') }}{{ $t('count') }}：{{ customer.customerCount }}</el-col>
        <el-col :span="6">{{ $t('customer.level.II') }}{{ $t('count') }}：{{ customer.secondaryCustomerCount }}</el-col>
        <el-col :span="6">{{ $t('inviteAgentCount') }}：{{ customer.totalInviteCount }}</el-col>
      </el-row>
      <div v-if="commission.isCommission">
        <h3>{{ $t('agentCashAccount') }}</h3>
        <el-row>
          <el-col :span="6">{{ $t('freezenAmount') }}：{{ commission.freezenAmount | currency }}</el-col>
          <el-col :span="6">{{ $t('balanceAmount') }}：{{ commission.balanceAmount | currency }}</el-col>
          <el-col :span="6">{{ $t('cashingOutAmount') }}：{{ commission.cashingOutAmount | currency }}</el-col>
          <el-col :span="6">{{ $t('cashedAmount') }}：{{ commission.cashedAmount | currency }}&nbsp;&nbsp;
            <el-link name="showCommission" type="primary" @click="showCommission">{{ $t('showAgentCashedRecord') }}
            </el-link>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div style="text-align: center">
      <ody-button name="cancel" @click="cancel">{{ $t('go_back') }}</ody-button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AgentDetails',
  data() {
    return {
      agent: {
        code: null,
        isEnabled: null,
        agentTime: null,
        primaryAgentMobile: null,
        inviteType: null,
        bindTime: null,
        userMobile: null
      },
      customer: {
        customerCount: 0,
        secondaryCustomerCount: 0,
        totalInviteCount: 0
      },
      commission: {
        freezenAmount: 0,
        balanceAmount: 0,
        cashedAmount: 0,
        cashingOutAmount: 0,
        isCommission: false
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const userId = this.$route.params.userId
      Promise.all([
        this.$agent.$api.agent.getByUserId({ userId }),
        this.$agent.$api.agent.countCustomerAndInvite([userId]),
        this.$agent.$api.commission.getCommissionAccount({ entityId: userId })]).then(([agent, customer, commission]) => {
        this.agent = agent.data
        this.customer = customer.data[0]

        if (!commission.data.isCommission) {
          this.$message.error('未查询到佣金账户信息！')
        }

        this.commission = {
          freezenAmount: commission.data.freezenAmount || 0,
          balanceAmount: (commission.data.balanceAmount) || 0,
          cashedAmount: commission.data.cashedOutAmount || 0,
          cashingOutAmount: commission.data.cashingOutAmount || 0,
          isCommission: commission.data.isCommission
        }
      })
    },
    showCommission() {
      parent.postMessage({
        action: 'addViewByName',
        name: 'OuserUserAccountFlow',
        params: { mobile: this.agent.userMobile, type: '3_0_1' }
      }, '*')
    },
    cancel() {
      this.$portal.delActiveView()
    }
  }
}
</script>

<style scoped>
  .agent-item {
    margin-bottom: 20px;
  }
</style>

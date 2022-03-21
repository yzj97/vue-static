<template>
  <section class="distributor-edit">
    <el-tabs v-model="activeName" name="activeName" class="distributor-edit-tabs">
      <!-- 基本信息 -->
      <el-tab-pane :label="$t('基本信息')" name="first">
        <el-card class="basic">
          <div slot="header" class="title">
            <span>{{ $t('基本信息') }}</span>
          </div>
          <!-- 基本信息-组件 -->
          <distributor-basic ref="distributorBasic" :is-edit="isEdit" :edit-id="editId" :distribution-obj="distributionObj" :org-type="orgType" />
        </el-card>
      </el-tab-pane>

      <!-- 财务信息 -->
      <el-tab-pane v-if="editId !== -1" :label="$t('财务信息')" name="second">
        <el-card class="basic">
          <div slot="header" class="title">
            <span>{{ $t('财务信息') }}</span>
          </div>
          <!-- 财务信息-组件 -->
          <distributor-finance ref="distributorFinance" :is-edit="isEdit" :edit-id="editId" :org-type="orgType" :account-obj="accountObj" :qualification-obj="qualificationObj"/>
        </el-card>
      </el-tab-pane>

      <!-- 地址信息 -->
      <el-tab-pane :label="$t('地址信息')" name="third">
        <!-- <el-card> -->
        <!-- 地址信息-组件 -->
        <distributor-address ref="distributorAddress" :is-edit="isEdit" :edit-id="editId" :org-type="orgType"/>
        <!-- </el-card> -->
      </el-tab-pane>
    </el-tabs>
    <ody-fixed v-if="isEdit">
      <!-- 基本信息 保存 -->
      <ody-button v-if="activeName === 'first' " name="MerchantCustomerManageBtnSave_firstSave" code="MerchantCustomerManageBtnSave" class="filter-item" type="primary" @click="firstSave">{{ $t('保存') }}</ody-button>

      <!-- 财务信息 保存 -->
      <ody-button v-if="activeName === 'second' " name="MerchantCustomerManageBtnSave_secondSave" code="MerchantCustomerManageBtnSave" class="filter-item" type="primary" @click="secondSave">{{ $t('保存') }}</ody-button>

    </ody-fixed>
  </section>
</template>

<style lang="less">
  @import "./edit.less";
</style>

<script>
import editJs from './edit'
export default editJs
</script>

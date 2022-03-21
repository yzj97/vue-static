<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('客户编号:')" prop="orgCode">
              <el-input v-model="searchForm.orgCode" :placeholder="$t('请输入经销商编号')" name="searchForm_orgCode"/>
            </ody-search-item>
            <ody-search-item :label="$t('客户名称:')" prop="orgName">
              <el-input v-model="searchForm.orgName" :placeholder="$t('请输入经销商名称')" name="searchForm_orgName"/>
            </ody-search-item>
            <ody-search-item :label="$t('客户类型:')" prop="orgType">
              <el-select v-model="searchForm.orgType" :placeholder="$t('全部')" name="searchForm_orgType">
                <el-option
                  v-for="item in orgTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('客户状态:')" prop="status">
              <el-select v-model="searchForm.status" :placeholder="$t('全部')" name="searchForm_status">
                <el-option
                  v-for="item in isAvailable"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('登录账号:')" prop="loginUser">
              <el-input v-model="searchForm.loginUser" :placeholder="$t('请输入登录账号')" name="searchForm_loginUser"/>
            </ody-search-item>
            <ody-search-item :label="$t('联系人手机:')" prop="contactMobileNo">
              <el-input v-model="searchForm.contactMobileNo" :placeholder="$t('请输入联系人手机')" name="searchForm_contactMobileNo"/>
            </ody-search-item>
            <ody-search-item :label="$t('所属商家:')" prop="merchantId">
              <el-select v-model="searchForm.merchantId" :placeholder="$t('全部')" name="searchForm_merchantId">
                <el-option
                  v-for="item in merchantIdList"
                  :key="item.merchantId"
                  :label="item.merchantName"
                  :value="item.merchantId"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('注册时间:')" prop="registerDates">
              <ody-date-range-picker
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                v-model="searchForm.registerDates"
                name="searchForm_registerDates"
                type="datetimer"
              />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button name="MerchantCustomerManageBtnList_search" code="MerchantCustomerManageBtnList" size="small" type="primary" @click="search">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn">
          <ody-button name="MerchantCustomerManageBtnAdd_hasAdd" code="MerchantCustomerManageBtnAdd" size="mini" type="primary" @click="hasAdd">{{ $t('新增客户') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list011"/>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="search"
            @current-change="query"/>

        </div>
      </ody-list-table-area>
    </section>
  </div>
</template>
<script>
import listJs from './list'
export default listJs
</script>

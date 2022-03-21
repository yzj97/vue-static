<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('申请编号') + ':'" prop="code">
            <el-input v-model="queryParam.code" name="queryParam_code" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
          </ody-search-item>
          <ody-search-item :label="$t('手机号') + ':'" prop="userMobile">
            <el-input :maxlength="11" v-model="queryParam.userMobile" name="queryParam_userMobile" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
          </ody-search-item>
          <ody-search-item :label="$t('邀请人手机号') + ':'" prop="primaryAgentMobile">
            <el-input :maxlength="11" v-model="queryParam.primaryAgentMobile" name="queryParam_primaryAgentMobile" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
          </ody-search-item>
          <ody-search-item :label="$t('审核状态') + ':'" prop="auditStatus">
            <el-select v-model="queryParam.auditStatus" :placeholder="$t('全部')" name="queryParam_auditStatus" clearable>
              <el-option
                v-for="item in auditStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('申请时间') + ':'" prop="auditApplyTime">
            <ody-date-range-picker
              v-model="queryParam.auditApplyTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="queryParam_auditApplyTime"
              type="datetimer"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button name="AgentAuditList01_handleQuery" code="AgentAuditList01" size="small" type="primary" @click="handleQuery">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="agentBatchAudit_batchAudit" code="agentBatchAudit" size="small" type="primary" @click="batchAudit()">{{ $t('批量审核') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :can-filter="false"
          :checked.sync="checked"
          :multiple="true"
          :columns="columns"
          :operates="operates"
          :selectable="checkedSelectable"
          name="list117"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="change"
          @current-change="queryList"/>
      </div>
    </ody-list-table-area>

    <ody-dialog
      :visible.sync="visible"
      :title="$t('审核')"
      width="30%"
      @open="openDialog">
      <section>
        <div style="text-align: center">
          <el-radio-group v-model="auditStatus" name="auditStatus">
            <el-radio label="2">{{ $t('审核通过') }}</el-radio>
            <el-radio label="1">{{ $t('审核拒绝') }}</el-radio>
          </el-radio-group>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <ody-button name="agentAudit_doAudit" code="agentAudit" size="small" type="primary" @click="doAudit">{{ $t('保存') }}</ody-button>
        <el-button name="visible" size="small" @click="visible = false">{{ $t('取消') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
import listJs from './list'
export default listJs
</script>


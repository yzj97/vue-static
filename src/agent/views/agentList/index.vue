<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('agentCode') + ':'" prop="code">
            <el-input v-model="searchForm.code" :placeholder="$t('enterAgentCode')" name="searchForm_code" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
          </ody-search-item>
          <ody-search-item :label="$t('cell_phone_number') + ':'" prop="userMobile">
            <el-input v-model="searchForm.userMobile" :placeholder="$t('please_enter_the_cell_phone_number')" name="searchForm_userMobile" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
          </ody-search-item>
          <ody-search-item :label="$t('primaryAgentMobile') + ':'" prop="primaryAgentMobile">
            <el-input v-model="searchForm.primaryAgentMobile" :placeholder="$t('please_enter_the_cell_phone_number')" name="searchForm_primaryAgentMobile" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
          </ody-search-item>
          <ody-search-item :label="$t('agentLevel') + ':'" prop="level">
            <el-select v-model="searchForm.level" :placeholder="$t('All')" name="searchForm_level">
              <el-option
                v-for="(k,v, index) in levelAgentList"
                :key="index"
                :label="k"
                :value="v"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('agentTime') + ':'" prop="agentTimes">
            <ody-date-range-picker
              v-model="searchForm.agentTimes"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_agentTimes"
              type="datetimer"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="agentQuery_initForm" code="agentQuery" size="small" @click="initForm">{{ $t('reset') }}</ody-button>
        <ody-button name="agentQuery_query" code="agentQuery" size="small" type="primary" @click="query">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="agentBatchAdd_userSelectModal" code="agentBatchAdd" size="small" type="primary" @click="userSelectModal">{{ $t('addAgent') }}</ody-button>
        <!--<ody-button name="agentDownloadTemp_download" code="agentDownloadTemp" size="small" type="primary" @click="download">{{ $t('download_template') }}</ody-button>
        <ody-button
          :disabled="!canUpload"
          name="agentImport_batchImport"
          size="small"
          code="agentImport"
          type="primary"
          @click="batchImport">{{ $t('agentImport') }}</ody-button>
        <ody-button name="agentExport_exportExcel" code="agentExport" size="small" type="primary" @click="exportExcel">{{ $t('agentExport') }}</ody-button>-->
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          style="margin-left:16px"
          name="agentExport_exportData"
          code="agentExport"
          size="small"
        >{{ $t('common_export') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="agent"
          task-type="agentExport"
          style="margin-left:16px"
          name="agentExport_seeExportTask"
          code="agentExport"
          size="small"
        >{{ $t('seeTask') }}</ody-export-task-button>
        <!--import-->
        <ody-batch-import-button
          :import-api="importModel.importApi"
          :import-label="importModel.importLabel"
          :download-local-file="importModel.downloadLocalFile"
          :async="importModel.async"
          :pool="importModel.pool"
          :task-type="importModel.taskType"
          style="margin-left:16px"
          name="agentImport_batchDelete_button"
          code="agentImport"
          size="small"
        >{{ $t('batch_import') }}</ody-batch-import-button>
        <ody-import-task-button
          pool="agent"
          task-type="agentImport"
          style="margin-left:16px"
          name="agentImport_batchDelete_task"
          code="agentImport"
          size="small"
        >{{ $t('seeImportTask') }}</ody-import-task-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="listTable.list"
          :columns="listTable.columns"
          :operates="listTable.operates"
          :checked.sync="listTable.checkedList"
          :data-key="listTable.dataKey"
          :multiple="false"
          name="listTable_list920">
          <template slot="userSum" slot-scope="scope">
            <el-link name="showUser" type="primary" @click="showUser(scope.row.userId)">{{ scope.row.userSum }}</el-link>
          </template>
          <template slot="agentSum" slot-scope="scope">
            <el-link name="showAgent" type="primary" @click="showAgent(scope.row.userId)">{{ scope.row.agentSum }}</el-link>
          </template>
        </ody-table>
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
          @size-change="query"
          @current-change="query"/>
      </div>
    </ody-list-table-area>
    <UserModal :visible.sync="showModal" @ok="selectUser"/>
    <Customer :visible.sync="showCustomer" :user-id="currUser" :customer-type="customerType"/>
    <ody-dialog :visible.sync="importVisible" :title="$t('agentImport')" @close="handleClose">
      <el-form ref="fileUploadForm" :model="fileUploadForm" :inline="true" :rules="rules">
        <el-form-item
          :label="$t('common_fileUpload')"
          :rules="[{ required: true, message: $t('common_please_selectFile') }]"
          class="register"
          required
          prop="fileName">
          <el-input v-model="fileUploadForm.fileName" name="fileUploadForm_fileName" type="text" disabled="true" />
          <el-upload
            :auto-upload="false"
            :before-upload="checkFile"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :file-list.sync="fileList"
            accept=".xlsx"
            name="file"
            multiple="false">
            <el-button slot="trigger" name="agentImport" size="small" code="agentImport">{{ $t('choose_file') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button name="agentImport_handleClose" size="small" code="agentImport" @click="handleClose">{{ $t('common_cancel') }}</ody-button>
        <ody-button
          name="agentImport_submitForm"
          size="small"
          type="primary"
          code="agentImport"
          @click="submitForm('fileUploadForm')">{{ $t('commission_save') }}</ody-button>
      </span>
    </ody-dialog>
    <ody-dialog
      :visible.sync="disableDialogVisible"
      width="600px">
      <ul v-if="disableType == 0">
        <li>客户下单后订单，分销员不再分佣；</li>
        <li>客户成为分销员，分销员不获得邀请佣金；</li>
        <li>被禁用期间，通过连接、二维码等途径新增的客户，不属于分销客户；</li>
        <li>被禁用前的客户关系保持不变，解冻后恢复正常；</li>
        <li>被禁用期前的冻结佣金依然可以变为提现金；</li>
      </ul>
      <span slot="footer">
        <ody-button name="ui_disableDialogVisible" code="ui" size="small" @click="disableDialogVisible=false">取 消</ody-button>
        <ody-button name="ui_handleClick" code="ui" size="small" type="primary" @click="handleClick">{{ disableType == 0 ? $t('common_disable') : $t('common_enable') }}</ody-button>
      </span>
    </ody-dialog>
  </section>
</template>
<script>
import listJs from './list'
export default listJs
</script>

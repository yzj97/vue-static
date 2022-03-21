<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('模板ID:')" prop="templateId">
            <el-input v-model="search.templateId" name="search_templateId"/>
          </ody-search-item>
          <ody-search-item :label="$t('标题:')" prop="title">
            <el-input v-model="search.title" name="search_title"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="ui_handleReset" code="ui" size="small" @click="handleReset">{{ $t('重置') }}</ody-button>
        <ody-button name="ui" code="ui" size="small" type="primary" @click.prevent="handleSubmit">
          {{ $t('查询') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/crm-web/api/wechat/listPrivateTemplatePage"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="dialog.show"
      :title="$t('查看详情')"
      width="960px">
      <div style="height: 500px">
        <el-col :span="10">
          <el-input
            v-model="dialog.obj.example"
            :disabled="true"
            :autosize="true"
            name="dialog_obj_example"
            style="width: 300px"
            type="textarea"/>
          <div class="detail-area">
            <div
              style="font-size: 14px;font-weight:400; color:#99ABB4;  ">{{ $t('详情') }}</div>
            <i class="el-icon-arrow-right"/>
          </div>
          <div style="text-align: center;margin-top: 50px;">
            <span style="font-size: 14px;font-weight:400; color:#99ABB4;  ">{{ $t('内容示例') }}</span>
          </div>
        </el-col>
        <el-col :span="14">
          <el-form ref="form" :model="dialog.obj" label-width="120px" label-position="right">
            <el-form-item :label="$t('模板ID')">
              <span>{{ dialog.obj.template_id }}</span>
            </el-form-item>
            <el-form-item >
              <span style="font-size: 14px;font-weight:400; color:#99ABB4;  ">{{ $t('开发者调用模板消息接口时需要提供模板ID') }}</span>
            </el-form-item>
            <el-form-item :label="$t('标题')">
              <span>{{ dialog.obj.title }}</span>
            </el-form-item>
            <el-form-item :label="$t('行业')">
              <span>{{ dialog.obj.primary_industry +'-'+dialog.obj.deputy_industry }}</span>
            </el-form-item>
            <el-form-item :label="$t('详细内容')">
              <el-input
                v-model="dialog.obj.content"
                :disabled="true"
                :autosize="true"
                name="dialog_obj_content"
                style="width: 300px"
                type="textarea"/>
            </el-form-item>
            <el-form-item>
              <span style="font-size: 14px;font-weight:400; color:#99ABB4;  ">{{ $t('wechatTemplateDataMsg') }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
      <span slot="footer">
        <ody-button name="ui_initDialog" code="ui" size="small" type="primary" @click="initDialog">{{ $t('返回') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: {

      },
      search: {
        templateId: null,
        title: null
      },
      table: {
        columns: [
          {
            label: this.$t('模板ID'),
            prop: 'template_id',
            show: true
          },
          {
            label: this.$t('标题'),
            show: true,
            prop: 'title'
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('查看详情'),
              method: (index, row) => {
                this.openDialog(row)
              },
              code: 'ui'
            }
          ]
        }
      }
    }
  },
  async mounted() {
    await this.initDialog()
    await this.query()
  },
  methods: {
    openDialog(row) {
      this.initDialog()
      this.dialog.show = true
      this.dialog.obj = row
    },
    initDialog() {
      this.dialog = {
        show: false,
        obj: {}
      }
    },
    handleReset() {
      this.formReset('search')
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    query() {
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(this.search))
    }
  }
}
</script>
<style lang="less" scoped>
.detail-area {
  width: 300px;
  height: 42px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: none;
  border: 1px solid #f1f1f1;
}
</style>

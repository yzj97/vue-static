<template>
  <div>
    <el-card>
      <el-table
        :data="list"
        name="list799">
        <el-table-column :label="$t('描述')" prop="desc" align="center"/>
        <el-table-column label="url" prop="url" align="center"/>
        <el-table-column :label="$t('操作')" width="150" align="center">
          <template slot-scope="scope">
            <el-button name="redirect" type="primary" size="mini" @click="redirect(scope.row)">{{ $t('跳转') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <ody-dialog
      :visible.sync="dialog.show"
      :before-close="closeDialog"
      :title="$t('替换变量')"
      width="600px"
      @close="closeDialog">
      <el-form label-position="left" label-width="100px">
        <el-form-item v-for="(i,index) in dialog.list" :label="i.key+':'" :key="i.key" required="true">
          <el-input v-model="dialog.list[index].value" name="dialog_list[index]_value"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button name="commitDialog" type="primary" size="small" @click="commitDialog()">{{ $t('跳转') }}</el-button>
        <el-button name="closeDialog" size="small" @click="closeDialog()">{{ $t('取消') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>
<script>
import util from '@/utils/util'
export default {
  data() {
    return {
      list: [
        { desc: '通过swagger收集起来的api列表', url: 'http://doc.odianyun.local/', param: [] },
        { desc: '查看oms flow执行情况', url: '/oms-web/public/flow/chart?flow={{flow}}&flowCode={{flowCode}}', param: [{ key: 'flow', value: null }, { key: 'flowCode', value: null }] },
        { desc: '清除domain缓存', url: 'http://{{domain}}/ouser-web/admin/refreshDomainCache.do', param: [{ key: 'domain', value: null }] },
        { desc: '查询domainInfo缓存', url: 'http://{{domain}}/ouser-web/admin/getDomainInfo?domainInfoKey={{targetDomain}}', param: [{ key: 'domain', value: null }, { key: 'targetDomain', value: null }] },
        { desc: '清理字典、各种配置项缓存', url: '/{{pool}}/public/cache/clearMemory', param: [{ key: 'pool', value: null }] },
        { desc: '查看当前登陆的员工缓存内容(EmployeeContainer的内容)', url: '/ouser-web/api/session/getSession.do?key={{key}}', param: [{ key: 'key', value: null }] },
        { desc: '清除当前登陆的员工缓存内容(EmployeeContainer的内容)', url: '/ouser-web/admin/clearEmployeeContaierCache', param: [] },
        { desc: '支付网关配置路径', url: '/opay-web/manage/index.html#/paymentChannelManageList', param: [] },
        { desc: '清微信账户缓存', url: 'http://{{h5Domain}}/api/weixin/clearWeixinAccountCache', param: [{ key: 'h5Domain', value: null }] },
        { desc: '清所有domain缓存', url: '/ouser-web/admin/clearAllDomainCache', param: [] },
        { desc: '清消息模板缓存', url: 'http://{{h5Domain}}/api/weixin/refreshSmsCache', param: [{ key: 'h5Domain', value: null }] },
        { desc: '调整日志级别为DEBUG', url: '/{{pool}}/public/logger/show?level=DEBUG', param: [{ key: 'pool', value: null }] },
        { desc: '查看本地日志', url: '/{{pool}}/public/logger/view', param: [{ key: 'pool', value: null }] },
        { desc: '查看接口调用日志', url: '/odts-web/public/golog/invoke', param: [] }
      ],
      dialog: util.copy(dialog)
    }
  },
  methods: {
    redirect(row) {
      this.dialog = util.copy(dialog)
      if (row.param && row.param.length > 0) {
        this.dialog.show = true
        this.dialog.list = row.param
        this.dialog.url = row.url
      } else {
        this.redirectUrl(row.url)
      }
    },
    commitDialog() {
      for (let i = 0; i < this.dialog.list.length; i++) {
        const one = this.dialog.list[i]
        if ((!one.value || one.value === '')) {
          if (one.required) {
            this.$message({
              message: one.key + '不能为空',
              type: 'error'
            })
            return
          }
          this.dialog.url = this.dialog.url.replace('{{' + one.key + '}}', '')
        } else {
          this.dialog.url = this.dialog.url.replace('{{' + one.key + '}}', one.value)
        }
      }
      this.redirectUrl(this.dialog.url)
      this.closeDialog()
    },
    redirectUrl(url) {
      if (url.charAt(0) === '/') {
        window.open('http://' + window.location.host + url)
      } else {
        window.open(url, '_blank')
      }
    },
    closeDialog() {
      this.dialog = util.copy(dialog)
    }
  }
}
const dialog = {
  show: false,
  url: null,
  list: [],
  form: {}
}
</script>

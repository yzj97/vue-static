<template>
  <div>
    <el-col :span="10">
      <el-tabs v-model="platformId" name="platformId" @tab-click="queryRoot">
        <el-tab-pane
          v-for="i in platforms"
          :key="i.platformId"
          :name="i.platformId"
          :label="i.platformName"
        />
      </el-tabs>
      <el-input
        v-model="filterText"
        :placeholder="$t('输入名称，code，parentCode进行搜索')"
        name="filterText"/>
      <el-tree
        ref="tree"
        :data="data"
        :props="defaultProps"
        :filter-node-method="filterNode"
        name="data598"
        node-key="id"
        @node-click="handleNodeClick">
        <span slot-scope="{ node, data }" class="custom-tree-node" style="width: 100%">
          <span style="font-size: 14px">
            <span :style="data.color">{{ data.typeStr+'：' }}</span>
            <span>{{ data.name }}</span>&nbsp;&nbsp;
            <span>code：{{ data.code }}</span>
          </span>
        </span>
      </el-tree>
    </el-col>
    <el-col v-if="selectNode.node.code" :span="13" :offset="1">
      <el-row>
        <el-col :span="6">
          <el-tabs v-model="selectNode.type" name="selectNode_type" @tab-click="changeType">
            <el-tab-pane :label="$t('按钮')" name="2"/>
            <el-tab-pane :label="$t('资源')" name="3"/>
          </el-tabs>
        </el-col>
        <el-col :span="18">
          <el-button name="showDialog" style="margin-top: 8px" type="success" size="mini" @click="showDialog">{{ $t('生成脚本') }}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          :data="selectNode.data"
          name="selectNode_data730"
          style="width: 100%">
          <el-table-column
            :label="$t('名称')"
            prop="name"/>
          <el-table-column
            :label="$t('编码')"
            prop="code"/>
          <el-table-column
            prop="domain"
            label="domain"/>
          <el-table-column
            :label="$t('地址')"
            prop="path"
            width="350"/>
        </el-table>
      </el-row>
    </el-col>
    <ody-dialog
      :visible.sync="selectNode.show"
      :title="$t('生成脚本')">
      <el-form ref="form" :model="selectNode.newObj" :rules="rules" label-position="right" label-width="80px">
        <el-form-item :label="$t('父菜单code：')">
          <el-input v-model="selectNode.node.code" name="selectNode_node_code" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('类型：')" prop="type">
          <el-select v-model="selectNode.newObj.type" :placeholder="$t('请选择')" name="selectNode_newObj_type" @change="createCode">
            <el-option :label="$t('菜单')" value="1"/>
            <el-option :label="$t('按钮')" value="2"/>
            <el-option :label="$t('资源')" value="3"/>
            <el-option :label="$t('VUE新菜单')" value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item label="code：" prop="code">
          <el-input v-model="selectNode.newObj.code" name="selectNode_newObj_code"/>
        </el-form-item>
        <el-form-item :label="$t('名称：')" prop="name">
          <el-input v-model="selectNode.newObj.name" name="selectNode_newObj_name"/>
        </el-form-item>
        <el-form-item label="domain：" prop="domain">
          <el-input v-model="selectNode.newObj.domain" name="selectNode_newObj_domain"/>
        </el-form-item>
        <el-form-item :label="$t('地址：')" prop="path">
          <el-input v-model="selectNode.newObj.path" name="selectNode_newObj_path"/>
        </el-form-item>
        <el-form-item label="SQL：">
          <el-input
            v-model="selectNode.newObj.sql"
            name="selectNode_newObj_sql"
            disabled="true"
            type="textarea"
            rows="5"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="dialogCancel" @click="dialogCancel">取 消</el-button>
        <el-button name="createSQL" type="primary" @click="createSQL">生成SQL</el-button>
        <i
          v-clipboard:copy="selectNode.newObj.sql"
          v-clipboard:success="clipboardSuccess"
          class="el-icon-document-copy"/>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  data() {
    return {
      filterText: '',
      data: [],
      platforms: [],
      platformId: '1',
      selectNode: {
        node: {},
        type: '2',
        buttons: [],
        resources: [],
        data: [],
        show: false,
        newObj: { code: '', type: '3', domain: '', path: '', sql: '', name: '' }
      },
      rules: {
        code: [
          { required: true, message: '请输入编码', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        domain: [
          { required: true, message: '请输入domain', trigger: 'change' }
        ],
        path: [
          { required: true, message: '请输入path', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const self = this
      self.platforms = [
        { platformId: '1', platformName: '运营平台' },
        { platformId: '2', platformName: '商家平台' },
        { platformId: '4', platformName: '经销商平台' },
        { platformId: '5', platformName: '导购员平台' },
        { platformId: '6', platformName: '供应商平台' },
        { platformId: '7', platformName: 'POS平台' }
      ]
      await this.queryRoot()
    },
    handleNodeClick(data) {
      this.selectNode = {
        node: {},
        type: '2',
        buttons: [],
        resources: [],
        data: [],
        show: false,
        newObj: { code: '', type: '3', domain: '', path: '', sql: '', name: '' }
      }
      this.selectNode.node = data
      const self = this
      this.$ouser.$api.functionService.allFunctionsByParentCode({
        platformId: this.platformId,
        parentCode: data.code,
        typeList: [3, 2]
      }).then(res => {
        const menus = []
        res.data.forEach(i => {
          if (i.type === 1 || i.type === 4 || i.type === 0) {
            menus.push(i)
          } else if (i.type === 2) {
            self.selectNode.buttons.push(i)
          } else if (i.type === 3) {
            self.selectNode.resources.push(i)
          }
        })
        self.changeType()
      })
    },
    queryRoot() {
      const self = this
      this.$ouser.$api.functionService.allFunctions({
        platformId: this.platformId,
        typeList: [1, 4, 0]
      }).then(res => {
        self.processFunction(res.data)
        res.data.forEach(i => {
          let hasParent = false
          res.data.forEach(p => {
            if (p.code === i.parentCode) {
              hasParent = true
            }
          })
          if (!hasParent) {
            i.parentCode = '0'
          }
        })
        self.data = util.arr2tree(res.data, 'code', 'parentCode', 'name')
      })
    },
    processFunction(arr) {
      arr.forEach(i => {
        if (i.type === 1 || i.type === 0) {
          i.typeStr = '菜单'
          i.color = 'color: #409EFF'
        } else if (i.type === 4) {
          i.typeStr = 'VUE新菜单'
          i.color = 'color: #67C23A'
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1 || data.code.indexOf(value) !== -1 || data.parentCode.indexOf(value) !== -1
    },
    changeType() {
      if (this.selectNode.type === '2') {
        this.selectNode.data = this.selectNode.buttons
      } else if (this.selectNode.type === '3') {
        this.selectNode.data = this.selectNode.resources
      }
    },
    showDialog() {
      this.selectNode.show = true
      this.createCode()
    },
    dialogCancel() {
      this.selectNode.show = false
    },
    createSQL() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.selectNode.newObj.sql = 'INSERT INTO `ouser`.`u_function`(`id`, `code`, `parent_code`,  `type`, `domain`, `path`, `name`, `level`, `is_available`, `is_deleted`, `version_no`,  `create_time`, `update_time`,  `company_id`, `platform_id`) VALUES (installer.seq_nextval(\'seq_no\'),\'' + this.selectNode.newObj.code + '\',\'' + this.selectNode.node.code + '\',\'' + this.selectNode.newObj.type + '\',\'' + this.selectNode.newObj.domain + '\',\'' + this.selectNode.newObj.path + '\',\'' + this.selectNode.newObj.name + '\',\'' + (parseInt(this.selectNode.node.level) + 1) + '\',1, 0, 0, now(), now(), @companyId,\'' + this.platformId + '\');'
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    createCode() {
      const self = this
      this.$ouser.$api.functionService.createCode({
        parentCode: this.selectNode.node.code,
        type: this.selectNode.newObj.type
      }).then(res => {
        self.selectNode.newObj.code = res.data
      })
    }
  }
}

</script>

<style scoped>

</style>

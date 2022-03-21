<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-container>
          <el-header>
            <h4>{{ $t('角色信息:') }}</h4>
          </el-header>
          <el-main>
            <el-form
              ref="roleEdit"
              :label-position="left"
              :rules="rules"
              :model="roleInfo"
              label-width="90px"
            >
              <el-form-item :label="$t('角色名称:')" prop="name">
                <el-input v-model="roleInfo.name" name="roleInfo_name" />
              </el-form-item>
              <el-form-item :label="$t('所属商家:')" prop="entityId">
                <ody-merchant-select
                  :disabled="roleInfo.id"
                  v-model="roleInfo.entityId"
                  name="roleInfo_entityId"
                  value-key="merchantId"
                />
              </el-form-item>
              <el-form-item :label="$t('所属平台:')">
                <el-select
                  v-model="roleInfo.platformId"
                  :disabled="roleInfo.id"
                  :placeholder="$t('请选择')"
                  name="roleInfo_platformId"
                  @change="changePlatform"
                >
                  <el-option
                    v-for="item in platformList"
                    :key="item.platformId"
                    :label="item.platformName"
                    :value="item.platformId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('角色描述:')">
                <el-input v-model="roleInfo.desc" :row="4" name="roleInfo_desc" type="textarea" maxlength="100" />
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-col>
      <el-col :span="8">
        <el-container>
          <el-header>
            <h4>{{ $t('菜单') }}</h4>
          </el-header>
          <el-main>
            <div style="height: 450px; overflow: auto;">
              <el-tree
                ref="tree"
                :data="treeData"
                :filter-node-method="filterNode"
                :default-checked-keys="checkedTreeData"
                name="treeData963"
                node-key="functionId"
                class="filter-tree"
                default-expand-all
                show-checkbox
                @node-click="nodeClick"
                @check-change="nodeCheck"
              />
            </div>
          </el-main>
        </el-container>
      </el-col>
      <el-col v-if="selectNode.obj.id" :span="8">
        <el-container>
          <el-header>
            <h4>{{ $t('按钮') }}</h4>
          </el-header>
          <el-main>
            <div style="height: 430px; overflow: auto;">
              <el-tree
                ref="selectTree"
                :data="selectNode.treeData"
                :default-checked-keys="selectNode.checkedTreeData"
                name="selectNode_treeData503"
                node-key="functionId"
                class="filter-tree"
                default-expand-all
                show-checkbox
                @check-change="selectNodeCheck"
              />
            </div>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="12" :offset="6">
        <ody-button :disabled="submiting" name="ui_commit" code="ui" type="primary" @click="commit">{{ $t('保存') }}</ody-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import util from '@/utils/util'
import Cookies from 'js-cookie'

export default {
  name: 'OuserRoleEdit',
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: this.$t('请输入角色名称'),
            trigger: 'change'
          },
          {
            min: 1,
            max: 20,
            message: this.$t('长度在 1 到 20 个字符'),
            trigger: 'change'
          }
        ],
        entityId: [
          {
            required: true,
            message: this.$t('请选择所属商家'),
            trigger: 'change'
          }
        ]
      },
      submiting: false,
      roleInfo: {},
      treeData: [],
      checkedTreeData: [],
      platformList: [],
      buttons: [],
      selectNode: { obj: {}, buttons: [], treeData: [], checkedTreeData: [] }
    }
  },
  watch: {
    $route: function(to, from) {
      // 执行数据更新查询
      this.init(this.$route.params.roleId)
    }
  },
  mounted() {
    this.init(this.$route.params.roleId)
  },
  methods: {
    async init(id) {
      this.roleInfo = { id: id }
      this.treeData = []
      this.checkedTreeData = []
      this.platformList = []
      this.buttons = []
      this.selectNode = {
        obj: {},
        buttons: [],
        treeData: [],
        checkedTreeData: []
      }
      const self = this
      const roleService = this.$ouser.$api.roleService
      const platformService = this.$ouser.$api.platformService
      await platformService.queryPlatformList({}).then(res => {
        if (Cookies.get('platformId') === '1') {
          self.platformList = res.data
        } else if (Cookies.get('platformId') === '2') {
          res.data.forEach(item => {
            if (item.platformId !== 1) {
              self.platformList.push(item)
            }
          })
        } else {
          res.data.forEach(item => {
            if (item.platformId === Number(Cookies.get('platformId'))) {
              self.platformList.push(item)
            }
          })
        }
      })
      if (this.roleInfo.id === '0') {
        this.roleInfo = { platformId: this.platformList[0].platformId }
      } else {
        await roleService.getRoleById({ id: this.roleInfo.id }).then(res => {
          self.roleInfo = res.data
        })
      }
      await this.getAllRoleFunctionByPlatformAndRoleId()
    },
    getAllRoleFunctionByPlatformAndRoleId() {
      const self = this
      const roleService = this.$ouser.$api.roleService
      roleService
        .getAllRoleFunctionByPlatformAndRoleId({
          roleId: this.roleInfo.id,
          platformId: this.roleInfo.platformId
        })
        .then(res => {
          const menu = res.data.menu
          const menuParentMap = menu.reduce((rtv, item) => {
            rtv[item.pId] = true
            return rtv
          }, {})
          self.checkedTreeData = []
          menu.forEach(m => {
            if (!menuParentMap[m.id] && m.checked === true) {
              self.checkedTreeData.push(m.functionId)
            }
          })
          const buttons = res.data.button
          buttons.forEach(b => {
            b.parentId = b.pId
            b.pId = '0'
          })
          self.buttons = buttons
          self.treeData = util.arr2tree(res.data.menu, 'id', 'pId', 'name')
          this.initSelectNode()
        })
    },
    changePlatform() {
      this.getAllRoleFunctionByPlatformAndRoleId()
    },
    initSelectNode() {
      this.selectNode = {
        obj: {},
        buttons: [],
        treeData: [],
        checkedTreeData: []
      }
    },
    selectNodeCheck(data, checked) {
      this.buttons.forEach(b => {
        if (b.id === data.id) {
          b.checked = checked
        }
      })
    },
    nodeCheck(data, checked) {
      this.buttons.forEach(b => {
        if (b.parentId === data.id) {
          b.checked = checked
        }
      })
      if (this.selectNode.obj.id === data.id) {
        this.nodeClick(data)
      }
      // if (data.children) {
      //   data.children.forEach(c => {
      //     this.$refs.tree.setChecked(c, checked, true)
      //   })
      // }
    },
    nodeClick(data, node) {
      this.initSelectNode()
      this.selectNode.obj = data
      const self = this
      const button = []
      this.selectNode.checkedTreeData = []
      this.buttons.forEach(b => {
        if (b.parentId === this.selectNode.obj.id) {
          // 业务中台的按钮：实时概况，订单，财务 默认不勾选，TODO: 3.0.0 需要修改菜单的首页根据接口来返回
          if (b.checked === true) {
            self.selectNode.checkedTreeData.push(b.functionId)
          }
          button.push(b)
        }
      })
      self.selectNode.treeData = util.arr2tree(button, 'id', 'pId', 'name')
    },
    async commit() {
      const self = this
      this.submiting = true
      const [err] = await this.formValidate('roleEdit')
      if (err) {
        self.submiting = false
        return false
      }
      const checkedChildrenMenuKeys = this.$refs.tree.getCheckedKeys(false)
      const checkedHalfMenuKeys = this.$refs.tree.getHalfCheckedKeys()
      const checkedMenuKeys = [...checkedChildrenMenuKeys, ...checkedHalfMenuKeys]

      console.log('checkedMenu', checkedMenuKeys)
      const checkedButtonKeys = []
      this.buttons.forEach(b => {
        if (b.checked === true) {
          checkedButtonKeys.push(b.functionId)
        }
      })
      console.log('checkedMenuAndButton', checkedButtonKeys)
      this.roleInfo.functionIds = checkedButtonKeys.concat(checkedMenuKeys)
      const roleService = this.$ouser.$api.roleService
      if (this.roleInfo.id) {
        roleService
          .updateRoleAndFunction(this.roleInfo)
          .then(res => {
            self.$message({
              message: this.$t('保存成功'),
              type: 'success'
            })
            // self.init(this.roleInfo.id)
            this.$portal.delActiveViewAndRefresh('OuserRoleManage')
          })
          .finally(() => {
            self.submiting = false
          })
      } else {
        roleService
          .saveRole(this.roleInfo)
          .then(res => {
            self.$message({
              message: this.$t('保存成功'),
              type: 'success'
            })
            this.$portal.delActiveViewAndRefresh('OuserRoleManage')
          })
          .finally(() => {
            self.submiting = false
          })
      }
    }
  }
}
</script>


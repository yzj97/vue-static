<template>
  <div>
    <el-row>
      <ody-tree-transfer :disabled="canEdit === false" :data="roles" :checked.sync="ownRoles" name="roles007" />
    </el-row>
  </div>
</template>

<script>
import util from '@/utils/util'
export default {
  props: {
    canEdit: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: null
    },
    operaDepartmentId: {
      type: Number,
      default: null
    },
    departmentId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      roles: [],
      ownRoles: [],
      ownRolesOld: [],
      platforms: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const self = this
      try {
        await this.$ouser.$api.platformService.queryPlatformList().then(res => {
          self.platforms = res.data
        })
        // 运营员工 查平台 运营平台
        await this.queryRoleToOperate({ departmentId: this.departmentId })
        await this.queryRoleToOperate({
          departmentId: this.departmentId,
          userId: this.userId,
          operaDepartmentId: this.operaDepartmentId
        })
      } catch (e) {
        console.log(e)
      }
    },
    queryRoleToOperate(param) {
      const roleService = this.$ouser.$api.roleService
      const self = this
      roleService.queryRoleToOperate(param).then(res => {
        const roleList = res.data
        const platformIds = {}
        roleList.forEach(i => {
          i.pId = i.platformId * -1
          platformIds[i.pId] = true
        })
        for (const one in platformIds) {
          this.platforms.forEach(p => {
            if (p.platformId === one * -1) {
              roleList.push({
                name: p.platformName,
                id: p.platformId * -1,
                pId: 0,
                disabled: true
              })
            }
          })
        }
        if (param.userId || param.operaDepartmentId) {
          self.ownRoles = util.arr2tree(roleList, 'id', 'pId', 'name')
          self.ownRolesOld = roleList
        } else {
          self.roles = util.arr2tree(roleList, 'id', 'pId', 'name')
        }
      })
    },
    updateRole() {
      if (!this.canEdit) {
        return
      }
      const roleService = this.$ouser.$api.roleService
      const self = this
      const param = { userId: this.userId, operaDepartmentId: this.operaDepartmentId, roleList: [], delRoleList: [] }
      const checkedRoleList = []
      this.ownRoles.forEach(o => {
        tree2arr(o, checkedRoleList)
      })

      checkedRoleList.forEach(o => {
        let has = false
        self.ownRolesOld.forEach(i => {
          if (i.id === o.id) {
            has = true
          }
        })
        if (!has) {
          param.roleList.push(o)
        }
      })

      this.ownRolesOld.forEach(o => {
        let deleted = true
        checkedRoleList.forEach(i => {
          if (o.id === i.id) {
            deleted = false
          }
        })
        if (deleted) {
          param.delRoleList.push(o.id)
        }
      })

      roleService.batchUpdateUserRole(param)
    }
  }
}
const tree2arr = function(tree, arr) {
  if (tree.children) {
    tree.children.forEach(c => {
      tree2arr(c, arr)
    })
  }
  if (tree.id >= 0) {
    arr.push(tree.id)
  }
}
</script>

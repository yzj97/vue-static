<template>
  <div>
    <el-row>
      <ody-tree-transfer :disabled="canEdit === false" :data="orgs" :checked.sync="ownOrgs" name="roles007"/>
    </el-row>
  </div>
</template>

<script>
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
    departmentId: {
      type: Number,
      default: 0
    },
    entityType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      orgs: [],
      ownOrgs: [],
      ownOrgsOld: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      try {
        await this.$ouser.$api.departmentService.listEntityById({
          id: this.departmentId,
          entityType: this.entityType
        }).then(res => {
          const data = res.data
          data.forEach(i => {
            i.id = i.entityId
            i.label = i.entityName
          })
          this.orgs = data
          if (!this.canEdit) {
            this.ownOrgs = data
          }
        })
        if (this.canEdit) {
          await this.$ouser.$api.departmentService.listEntityById({
            id: this.departmentId,
            entityType: this.entityType,
            userId: this.userId
          }).then(res => {
            const data = res.data
            data.forEach(i => {
              i.id = i.entityId
              i.label = i.entityName
            })
            this.ownOrgs = data
            this.ownOrgsOld = this.$portal.deepClone(data)
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    updateRole() {
      if (!this.canEdit) {
        return
      }

      const param = { newList: [], delList: [], userId: this.userId, entityType: this.entityType }

      this.ownOrgs.forEach(o => {
        let has = false
        this.ownOrgsOld.forEach(i => {
          if (i.id === o.id) {
            has = true
          }
        })
        if (!has) {
          param.newList.push(o.id)
        }
      })

      this.ownOrgsOld.forEach(o => {
        let deleted = true
        this.ownOrgs.forEach(i => {
          if (o.id === i.id) {
            deleted = false
          }
        })
        if (deleted) {
          param.delList.push(o.id)
        }
      })

      this.$ouser.$api.userService.batchUpdateUserAuth(param).then(res => {
        this.init()
      })
    }
  }
}
</script>

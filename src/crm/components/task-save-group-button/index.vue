<template>
  <div class="cp-task-save-group-button">
    <template v-if="taskStatus === 'isEnded'">
      <ody-button
        :disabled="isSaved"
        name="userGroup_saveMkt_handleSaveUserGroup"
        size="small"
        type="primary"
        code="userGroup_saveMkt"
        @click="handleSaveUserGroup"
      >
        {{ $t('保存分组') }}
      </ody-button>
    </template>
    <crm-group-static-modal
      :visible.sync="modal.groupStatic.visible"
      :task-id="taskId"
      :page-node-id="pageNodeId"
      :params="saveParams"
      @ok="handleGroupStaticOk"
    />
  </div>
</template>

<script>
import CrmGroupStaticModal from '@/components/group-static-modal'

export default {
  components: {
    CrmGroupStaticModal
  },
  props: {
    taskStatus: {
      type: String,
      default: null
    },
    taskId: {
      type: String,
      default: null
    },
    pageNodeId: {
      type: String,
      default: null
    },
    saveParams: {
      type: Object,
      default: () => {}
    },
    searchParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      modal: {
        groupStatic: {
          visible: false
        }
      },
      isSaved: true
    }
  },
  watch: {
    searchParams: {
      async handler() {
        await this.loadIsSaved()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async loadIsSaved() {
      const { taskId: mktId, pageNodeId: mktPageNodeId, searchParams } = this
      const { data: data } = await this.$crm.$api.userGroupMktRelation.list({
        filters: {
          mktId,
          mktPageNodeId,
          ...searchParams
        }
      })

      this.isSaved = data && data.length > 0
    },
    async handleSaveUserGroup() {
      this.modal.groupStatic.visible = true
    },
    async handleGroupStaticOk() {
      await this.loadIsSaved()
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-save-group-button {
  display: inline-block;
  margin-right: 10px;
}
</style>

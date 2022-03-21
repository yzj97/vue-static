<template>
  <div class="cp-import-task-button">
    <ody-button
      v-bind="$attrs"
      :code="code"
      v-on="$listeners"
      @click="openTask()"
    >
      <slot />
    </ody-button>
    <ody-import-task
      :append-to-body="true"
      :visible.sync="importTaskDialogVisible"
      :title="title"
      :pool="pool"
      :task-type="taskType"
      :task-id.sync="taskId"
      :is-data-task="isDataTask"
      :filter-data-auth="filterDataAuth"
      :search="search"
      :handle-filter-data="handleFilterData"
      @close="handleClose"
    />
  </div>
</template>

<script>

export default {
  props: {
    title: { type: String, default: null, required: false },
    pool: { type: String, default: null, required: false },
    code: { type: String, default: 'ui', required: false },
    taskType: { type: String, default: null, required: false },
    taskId: { type: Number, required: false, default: null },
    isDataTask: { type: Boolean, required: false, default: true },
    filterDataAuth: { type: Boolean, required: false, default: false },
    search: { type: Function, required: false, default: null }, // 接受入参{taskType:"",limitStart:0,limitCount:10},返回Promise
    handleFilterData: { type: Function, required: false, default: null }
  },
  data() {
    return {
      importTaskDialogVisible: false
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    handleClose() {
      this.importTaskDialogVisible = false
    },
    openTask(taskId) {
      this.taskId = taskId
      this.importTaskDialogVisible = true
    }
  }
}
</script>
<style lang="scss">
.cp-import-task-button {
  &__content {
    text-align: center;
    &__btn {
      display: inline-block;
      margin: 0 5px;
    }
  }
  &__down-parsed{
    color: #1890FF !important;
  }
}
</style>
<style lang="less" scoped>
  .cp-import-task-button {
    display: inline-block;
    .download-btn {
      width: 50%;
    }
  }
</style>

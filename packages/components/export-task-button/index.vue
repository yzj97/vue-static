<template>
  <div class="cp-export-task-button">
    <ody-button
      v-bind="$attrs"
      :code="code"
      v-on="$listeners"
      @click="openTask"
    >
      <slot />
    </ody-button>
    <ody-export-task
      :append-to-body="true"
      :visible.sync="exportTaskDialogVisible"
      :title="title"
      :pool="pool"
      :task-type="taskType"
      :task-id="taskId"
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
      exportTaskDialogVisible: false
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    handleClose() {
      this.exportTaskDialogVisible = false
    },
    openTask() {
      this.exportTaskDialogVisible = true
    }
  }
}
</script>
<style lang="scss">
.cp-export-task-button {
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
  .cp-export-task-button {
    display: inline-block;
    .download-btn {
      width: 50%;
    }
  }
</style>

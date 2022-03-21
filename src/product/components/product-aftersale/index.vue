<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t('售后服务') }}</strong>
      </div>
      <el-form-item>
        <el-tabs v-model="activeName" name="activeName" type="card">
          <el-tab-pane :label="$t('中文')" name="first">
            <ody-tinymce :height="300" v-model="mp.afterSalePO.content" :limit="10000" name="mp_afterSalePO_content" />
          </el-tab-pane>
          <el-tab-pane :label="$t('第二语言')" name="second">
            <ody-tinymce :height="300" v-model="mp.afterSalePO.contentLan2" :limit="10000" name="mp_afterSalePO_contentLan2" />
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-card>
  </section>
</template>

<script>
export default {
  components: {

  },
  props: {
    mp: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    }
  }
}

</script>
<style scoped>
</style>

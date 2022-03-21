<template>
  <div class="cp-edit-page">
    <div class="title-name">
      底部设置
      <div name="closeFrom" class="close" @click="closeFrom">
        <i class="el-icon-close"/>
      </div>
    </div>
    <el-form
      ref="editPageForm"
      :model="formData.model"
      :rules="formData.rules"
      class="form"
      label-width="60px">
      <el-form-item
        v-for="(field, fieldIndex) in formData.fields"
        :label="field.label"
        :key="fieldIndex"
        :prop="field.prop">
        <component
          :is="field.tag"
          v-bind="field"
          :form-data="formData"
          v-model="formData.model[field.prop]"
          :page-id="pageId"
          :page-type="pageType"
          :plat-form="platForm"
          :page-model="pageModel"
          name="formData_model[field_prop]">
          <component
            v-for="(fieldChildren, fieldChildrenIndex) in field.children"
            :is="fieldChildren.tag"
            v-bind="fieldChildren"
            :key="fieldChildrenIndex">
            {{ fieldChildren.html ? fieldChildren.html : fieldChildren.label }}
          </component>
        </component>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CmsFooterList from '@/components/cms-footer-list'
export default {
  components: {
    CmsFooterList
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    pageId: {
      type: String,
      default: ''
    },
    pageModel: {
      type: Object,
      default: () => {}
    },
    pageType: {
      type: Number,
      default: 1
    },
    platForm: {
      type: Number,
      default: 1
    }
  },
  methods: {
    closeFrom() {
      this.$emit('changeEditPageStatus')
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-edit-page {
  min-width: 480px;
}
.form {
  padding: 20px 10px 0 0;
}
.title-name {
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  font-size: 14px;
  color: #333333;
  font-weight: 450;
  letter-spacing: 0;
  background: #f8f9fa;
  position: relative;
  .close {
    position: absolute;
    right: 10px;
    top: 0px;
    cursor: pointer;
  }
}
</style>

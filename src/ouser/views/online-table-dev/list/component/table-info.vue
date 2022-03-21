<template>
  <div class="form-item-list">
    <el-row>
      <el-col :span="8">
        <el-form-item
          :rules="[{required:true,message:'父菜单编码不能为空'}]"
          label="父菜单编码"
          prop="parentMenuCode"
          class="form-item"
        >
          <el-input v-model="tableForm.parentMenuCode" name="tableForm_parentMenuCode" placeholder="请输入父菜单编码，用于Function父权限码" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :rules="[{required:true,message:'菜单名不能为空'}]"
          label="菜单名"
          prop="menuName"
          class="form-item"
        >
          <el-input v-model="tableForm.menuName" name="tableForm_menuName" placeholder="请输入菜单名，用于菜单显示" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :rules="[{required:true,message:'菜单编码不能为空'}]"
          label="菜单编码"
          prop="menuCode"
          class="form-item"
        >
          <el-input v-model="tableForm.menuCode" name="tableForm_menuCode" placeholder="请输入菜单编码，用于Function权限码及静态路由" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item
          :rules="[{required:true,message:'Vue静态Pool名不能为空'}]"
          label="Vue静态Pool名"
          prop="poolName"
          class="form-item"
        >
          <el-input v-model="tableForm.poolName" name="tableForm_poolName" placeholder="请输入Pool名，与Vue静态pool名一致，如oms" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :rules="[{required:true,message:'配置Pool名不能为空'}]"
          label="配置Pool名"
          prop="configPool"
          class="form-item"
        >
          <el-input v-model="tableForm.configPool" name="tableForm_configPool" placeholder="请输入配置Pool名，用于导入导出，如oms" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :rules="[{required:true,message:'上下文路径不能为空'}]"
          label="War上下文路径"
          prop="contextPath"
          class="form-item"
        >
          <el-input v-model="tableForm.contextPath" name="tableForm_contextPath" placeholder="请输入War上下文路径，如oms-web" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item
          :rules="[{required:true,message:'包名前缀不能为空'}]"
          label="包名前缀"
          prop="basePackage"
          class="form-item"
        >
          <el-input v-model="tableForm.basePackage" name="tableForm_basePackage" placeholder="请输入包名前缀，一般以com.odianyun开头" />
        </el-form-item>
      </el-col>
      <el-col v-show="false" :span="8">
        <el-form-item label="表单风格" prop="editFormStyle" class="form-item">
          <el-select v-model="tableForm.editFormStyle" :disabled="true" :clearable="false" name="tableForm_editFormStyle" placeholder="请选择">
            <el-option
              v-for="item in formStyleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TableInfo',
  components: {},
  props: {
    editNew: { type: Boolean, default: false },
    tableForm: { type: Object, default: function() { return {} } }
  },
  data() {
    return {
      formStyleOptions: [
        {
          value: 1,
          label: '风格一'
        },
        {
          value: 2,
          label: '风格二'
        },
        {
          value: 3,
          label: '风格三'
        }
      ]
    }
  },
  async mounted() {

  },
  methods: {

  }
}
</script>

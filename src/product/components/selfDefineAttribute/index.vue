<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('自定义属性')"
      width="600px">
      <el-form ref="attribute" :model="attribute" :rules="rules" label-position="right" label-width="120px">
        <el-form-item :label="$t('属性名称') + ':'" prop="attName">
          <el-input v-model.trim="attribute.attName"/>
        </el-form-item>
        <el-form-item :label="$t('属性值') + ':'" prop="attValue">
          <el-row>
            <el-col :span="16"><el-input v-model.trim="attribute.attValue"/></el-col>
            <el-col :span="4" :offset="1">
              <span name="addTag" class="add-tag" @click="addTag">{{ '+' + $t('添加') }}</span>
            </el-col>
          </el-row>

        </el-form-item>
        <el-form-item prop="attValueList"/>
      </el-form>
      <div class="tagDiv">
        <el-tag
          v-for="tag in attribute.attValueList"
          :key="tag"
          :type="tag.type"
          closable
          style="margin-right: 10px; margin-top: 5px"
          @close="removeTag(tag)">
          {{ tag }}
        </el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <el-button name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('确认') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkAttName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('请输入属性名称')))
      } else {
        callback()
      }
    }
    var checkAttValue = (rule, value, callback) => {
      if (!value && this.attribute.attValueList.length === 0) {
        return callback(new Error(this.$t('请输入属性值')))
      } else {
        callback()
      }
    }
    var checkAttValueList = (rule, value, callback) => {
      if (value.indexOf(this.attribute.attValue) !== -1) {
        return callback(new Error(this.$t('已存在相同的属性值')))
      } else {
        callback()
      }
    }
    return {
      attribute: {
        attName: '',
        attValue: '',
        attValueList: []
      },
      rules: {
        attName: [
          { required: true, validator: checkAttName, trigger: 'blur' }
        ],
        attValue: [
          { required: true, validator: checkAttValue, trigger: 'blur' }
        ],
        attValueList: [
          { required: true, validator: checkAttValueList, trigger: 'blur' }
        ]
      },
      emitFlag: false
    }
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      this.$refs['attribute'].validate((valid) => {
        if (valid && !this.emitFlag) {
          this.emitFlag = true
          this.$emit('ok', this.attribute)
          this.$emit('update:visible', !this.visible)
        }
      })
    },
    addTag() {
      this.$refs['attribute'].validateField('attValueList', (error) => {
        if (!error && this.attribute.attValue) {
          this.attribute.attValueList.push(this.attribute.attValue)
          this.attribute.attValue = null
        }
      })
    },
    removeTag(tag) {
      for (let i = 0; i < this.attribute.attValueList.length; i++) {
        if (tag === this.attribute.attValueList[i]) {
          this.attribute.attValueList.splice(i, 1)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-tag {
  color: var(--themeColor);
  cursor: pointer;
}
</style>

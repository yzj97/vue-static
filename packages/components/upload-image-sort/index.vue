<template>
  <div
    ref="upload"
    :style="{ display: draggable ? 'flex' : 'inline-block', paddingBottom: draggable ? '30px' : '0px'}"
    class="cp-upload-image"
  >
    <!-- 不能设置limit不然一个图片就不能上传 -->
    <ody-draggable
      v-if="innerFileList.length > 0 && typeof(innerFileList) === 'object' && draggable"
      :list="innerFileList"
      style="display: inline-block"
    >
      <div
        v-for="(item, index) in innerFileList"
        :key="index"
        class="draggable-item"
        @mouseenter="setItemFlag(item)"
        @mouseleave="item.showDialogDraggable = false"
      >
        <img :src="item.url" alt >
        <div v-show="index === 0 && showMianMark" class="main-lable"/>
        <div v-show="item.showDialogDraggable" class="draggable-item-dialog">
          <i class="el-icon-zoom-in el-icon" @click="onPreview(item)"/>
          <i v-if="!disabled" class="el-icon-delete el-icon" @click="removeUrl(item)"/>
          <i v-if="!disabled" class="el-icon-refresh el-icon" @click="refreshUrl(item)"/>
        </div>
      </div>
    </ody-draggable>
    <el-upload
      ref="elUpload"
      :http-request="httpRequest"
      :multiple="multiple"
      :file-list="innerFileList"
      :disabled="disabled"
      :list-type="elListType"
      :show-file-list="getShowFileList"
      :before-upload="beforeUpload"
      :class="{disabled: disabled}"
      action="string"
    >
      <i v-if="!label && listType === 'picture'" ref="trigger" slot="trigger" class="el-icon-plus" />
      <label v-if="label && listType === 'picture'" :class="{'disabled-label': disabled}">{{ label }}</label>
      <ody-button
        v-else-if="listType === 'button'"
        :loading="loading"
        code="ui"
        size="small"
        type="primary"
      >
        <template v-if="fileList && fileList[0] && fileList[0].url">
          {{ $t('components.uploadImage_reclick_upload') }}
        </template>
        <template v-else>
          {{ $t('components.uploadImage_click_upload') }}
        </template>
      </ody-button>
      <div v-if="showTip && !draggable" slot="tip" class="el-upload__tip">
        {{ $t('components.uploadImage_tip') }}：{{ $t('components.uploadImage_single_file_max') }}{{ getPicSize }},
        {{ $t('components.uploadImage_support') }}{{ getPicType }}
        <span v-if="limit > 1">
          , {{ $t('components.uploadImage_max_upload') }}{{ limit }}{{ $t('components.file') }}
        </span>
      </div>
      <div slot="file" slot-scope="{file}">
        <img
          :src="file.url"
          class="el-upload-list__item-thumbnail"
          alt=""
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="onPreview(file)"
          >
            <i class="el-icon-zoom-in"/>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="removeUrl(file)"
          >
            <i class="el-icon-delete"/>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="refreshUrl(file)"
          >
            <i class="el-icon-refresh-right"/>
          </span>
        </span>
      </div>
    </el-upload>
    <div v-if="showTip && draggable" class="el-upload_inner__tip">
      {{ $t('components.uploadImage_tip') }}：{{ $t('components.uploadImage_single_file_max') }}{{ getPicSize }},
      {{ $t('components.uploadImage_support') }}{{ getPicType }}
      <span v-if="limit > 1">
        , {{ $t('components.uploadImage_max_upload') }}{{ limit }}{{ $t('components.file') }}
      </span>
    </div>
    <el-dialog :visible.sync="dialogVisible" :modal="isHaveMask" :append-to-body="true">
      <img :src="dialogImageUrl" width="100%" alt >
    </el-dialog>
  </div>
</template>
<script>
import changeCase from 'packages/utils/change-case'
import $ from 'jquery'

export default {
  props: {
    value: [String, Array],
    disabled: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    showMianMark: {
      type: Boolean,
      default: true
    },
    showTip: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String,
      default: 'picture' // list-type	文件列表的类型	string	button/picture
    },
    limit: {
      type: Number,
      default: 1
    },
    multiple: {
      type: Boolean,
      default() {
        return true
      }
    },
    fileList: {
      type: Array,
      default: () => []
    },
    picType: {
      type: Array,
      default: () => ['png', 'jpg', 'bmp', 'gif', 'ico']
    },
    picSize: {
      type: Number,
      default: 500
    },
    url: {
      type: String,
      default: '/ouser-web/media/fileUploadToKsy'
    },
    params: {
      type: Object,
      default: () => {
        return {
          file: 'Filedata'
        }
      }
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadIndex: -1, // 代表append
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      isHaveMask: true, // 是否有遮罩
      innerFileList: [],
      index: 0
    }
  },
  computed: {
    getPicType() {
      return this.picType
        .reduce((rtv, item) => {
          if (item === 'jpg') {
            rtv = [...rtv, 'jpg', 'jpeg']
          } else {
            rtv = [...rtv, item]
          }
          return rtv
        }, [])
        .map(x => x.toUpperCase())
        .join(',')
    },
    getPicSize() {
      if (this.picSize > 1024) {
        return this.picSize / 1024 + 'MB'
      }
      return this.picSize + 'KB'
    },
    getLimit() {
      if (this.listType === 'button') {
        return 2
      }
      if (this.limit === 1) {
        return 2
      }
      return this.limit
    },
    getShowFileList() {
      return this.listType !== 'button'
    },
    elListType() {
      return {
        button: 'text',
        picture: 'picture-card'
      }[this.listType]
    }
  },
  watch: {
    value(newVal) {
      // 拖拽的时候 避免死循环
      if (this.draggable) {
        if (newVal.length === this.innerFileList.length) {
          return
        }
      }
      if (
        newVal === undefined ||
        newVal === null ||
        newVal === '' ||
        newVal.length === 0
      ) {
        this.innerFileList = []
      } else {
        this.innerFileList =
          this.limit === 1
            ? [{ url: this.value }]
            : this.value.map(x => {
              return {
                url: x
              }
            })
      }
    },
    innerFileList(newVal) {
      const $add = $(this.$refs.upload).find('.el-upload--picture-card')
      if (this.limit < newVal.length) {
        this.innerFileList.length = this.limit
      }
      this.$emit('update:fileList', newVal)
      // 拖拽的时候去触发v-model
      if (this.draggable) {
        var arr = []
        newVal.map(item => {
          arr.push(item.url)
        })
        this.$emit('input', arr)
      }
      if (newVal.length === this.limit) {
        $add.hide()
      } else {
        $add.show()
      }
    },
    fileList: {
      handler(newVal) {
        this.innerFileList = newVal || []
      },
      deep: true
    }
  },
  mounted() {
    if (this.draggable) {
      this.$refs.elUpload.$children[0].$el.style.display = 'none'
    }
    this.$nextTick(() => {
      if ($('.v-modal-enter') && $('.v-modal-enter').length) {
        this.isHaveMask = false
      }

      if (this.value && !(this.fileList && this.fileList.length)) {
        this.innerFileList =
          this.limit === 1
            ? [
              {
                url: this.value
              }
            ]
            : this.value.map(x => {
              return {
                url: x
              }
            })
      } else if (this.fileList) {
        this.innerFileList = this.fileList
      }
    })
  },
  methods: {
    setItemFlag(item) {
      this.$set(item, 'showDialogDraggable', true)
    },
    // elementUI mixins - emitter 中拷贝的
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    onChange(fileList = []) {
      let val
      this.innerFileList = fileList.sort(function(a, b) { return a.index - b.index })
      if (this.listType === 'picture' && this.limit !== 1) {
        val = fileList.map(x => x.url)
      } else {
        val = (fileList[0] && fileList[0].url) || ''
      }
      this.$emit('input', val)
      this.$emit('change')
      this.dispatch('ElFormItem', 'el.form.change', fileList)
    },
    onRemove(file, fileList) {
      if (this.disabled) {
        return false
      }
      this.onChange(fileList)
    },
    onPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    removeUrl(file) {
      const index = this.innerFileList.findIndex(x => x.uid === file.uid)
      this.innerFileList.splice(index, 1)
      this.onChange(this.innerFileList)
    },
    refreshUrl(file) {
      this.uploadIndex = this.innerFileList.findIndex(x => x.uid === file.uid)
      this.$refs.trigger.click()
    },
    beforeUpload(file) {
      const checkType = {
        isPng: file.type === 'image/png',
        isJpg: file.type === 'image/jpg' || file.type === 'image/jpeg',
        isGif: file.type === 'image/gif',
        isBmp: file.type === 'image/bmp',
        isIco: file.type === 'image/x-icon'
      }

      const isLimitKb = file.size / 1024 < this.picSize

      const isType = this.picType.some(key => {
        return checkType[changeCase('is-' + key)]
      })

      if (!isType) {
        this.$message.error(`上传图片只能是 ${this.picType.join(',')} 格式!`)
        return isType
      }

      if (!isLimitKb) {
        this.$message.error(`上传图片大小不能超过 ${this.picSize}kb!`)
        return isLimitKb
      }

      return isType && isLimitKb
    },
    httpRequest(obj, file, fileList) {
      const params = new FormData()
      Object.keys(this.params).forEach(key => {
        if (key === 'file') {
          params.append(this.params[key], obj.file)
          params.append('index', this.index++)
        } else {
          params.append(key, this.params[key])
        }
      })
      this.loading = true
      this.$portal.post(this.url, params).then(result => {
        this.loading = false
        let newFileList = [...this.innerFileList]
        const currentFile = {
          url: result.data,
          fileName: obj.file.name,
          fileSize: obj.file.size,
          fileType: obj.file.type
        }
        // 兼容url第二种处理模式
        if (result.data && result.data.url) {
          currentFile.url = result.data.url
          currentFile.index = result.data.index
        }

        if (this.listType === 'picture' && this.limit !== 1) {
          if (this.uploadIndex === -1) {
            newFileList.push(currentFile)
          } else {
            newFileList[this.uploadIndex] = currentFile
          }
        } else {
          // picture limit = 1 or button
          newFileList = [currentFile]
        }

        this.uploadIndex = -1

        this.onChange(newFileList)
        this.$message({
          message: this.$t('components.tinymce_success'),
          type: 'success'
        })
        this.$emit('success', currentFile)
      }).catch(ex => {
        this.loading = false
        this.$emit('error')
        this.$message.error('图片上传失败,请重试')
        // 回滚操作
        const newFileList = [...this.innerFileList]
        this.onChange(newFileList)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.disabled-label{
  color: #333;
  cursor: not-allowed;
}
.main-lable {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: url('./img/mainPic.png') top right no-repeat;
  background-size: 100%;
}
.cp-upload-image {
  position: relative;
  /deep/ {
    .disabled {
      .el-upload {
        background-color: #bbb;
        cursor: not-allowed;
        border: none;
      }
    }
    .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    .el-upload-list__item {
      width: 100px;
      height: 100px;
    }
  }
  .el-upload_inner__tip {
    position: absolute;
    bottom: 0;
    font-size: 12px;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions span+span {
    margin-left: 10px;
  }
}
.draggable-item {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid #c0ccda;
  margin: 0 8px 8px 0;
  border-radius: 6px;
  img {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
  .draggable-item-dialog {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    display: flex;
    color: #ffffff;
    font-size: 20px;
    align-items: center;
    justify-content: space-evenly;
    .el-icon {
      cursor: pointer;
    }
  }
}
</style>

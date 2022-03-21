<template>
  <div class>
    <div class="upload-video-con">
      <span ref="upload">
        <el-upload
          ref="Elupload"
          :disabled="disabled"
          :url="url"
          :http-request="httpRequest"
          :on-preview="onPreview"
          :multiple="multiple"
          :list-type="listType"
          :before-upload="beforeUpload"
          :on-remove="onRemove"
          :class="{disabled: disabled}"
          :show-file-list="false"
          class="upload-video"
          action="string"
        >
          <label :class="{'disabled-label': disabled}">{{ $t('添加视频') }}</label>
        </el-upload>
        <div v-if="showVideo" class="posi-ab">
          <video id="upvideo" :src="value.url" muted autoplay class="upload-video-value" />
          <div class="upload-video-mask">
            <i class="el-icon-video-play" @click="onPlay()" />
            <i class="el-icon-delete" @click="onRemove(files)" />
          </div>
        </div>
      </span>
    </div>
    <div v-if="showTip" slot="tip" class="el-upload__tip">提示:支持MP4、AVI格式，不超过50M</div>
    <ody-dialog :visible.sync="visible" :title="$t('视频')" @handleClose="handleClose">
      <div class="video-dialog">
        <video :src="value.url" class="dialog-video-size" controls="controls" />
      </div>
    </ody-dialog>
  </div>
</template>
<script>
import changeCase from 'packages/utils/change-case'
import $ from 'jquery'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: { type: Object, default: () => {} },
    videoSize: {
      // 视频大小(M)
      type: Number,
      default: 50
    },
    url: {
      type: String,
      default: '/back-product-web/back/mp/media/uploadMedia.do'
    },
    params: {
      type: Object,
      default: () => {
        return {
          file: 'file'
        }
      }
    },
    limit: {
      type: Number,
      default: 1
    },
    videoType: {
      type: Array,
      default: () => ['mp4', 'avi']
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    showTip: {
      type: Boolean,
      default: false
    },
    files: {
      type: Array,
      default: () => []
    },
    imagsrc: {
      type: String,
      default: ''
    },
    nameLimit: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      loading: false,
      limitCount: 1,
      multiple: false,
      showVideo: false,
      visible: false
    }
  },
  computed: {
    getValue() {
      return this.value
    }
  },
  watch: {
    value: {
      handler() {
        this.innerFileList()
      },
      deep: true
    }
  },
  mounted() {
    if (this.value) {
      this.innerFileList()
    }
  },
  methods: {
    onChange(file) {
      const isString = (file && file instanceof String) || (file.url && file.url instanceof String)
      if (isString && ((file && file.split(':')[0] === 'bold') || (file.url && file.url.split('?')[0] === 'bold'))) {
        return false
      }
      this.value = file
      this.$emit('input', file)
      this.$emit('change')
      this.dispatch('ElFormItem', 'el.form.change', file)
      this.innerFileList()
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
    innerFileList() {
      const $add = $(this.$refs.upload).find('.upload-video')
      if (this.value.url && this.value.url !== '') {
        $add.hide()
        this.showVideo = true
      } else {
        $add.show()
        this.showVideo = false
      }
    },
    onRemove(file) {
      if (file.url) {
        this.onChange(file)
        return false
      }
      this.clearData()
      this.$emit('input', this.value)
      this.innerFileList()
    },
    clearData() {
      this.value = ''
      this.$refs.Elupload.clearFiles()
    },
    onPlay() {
      // const video = this.$refs.video
      const video = document.getElementById('upvideo')
      this.handleClose()
      video.play()
    },
    handleClose() {
      this.visible = !this.visible
    },
    onPreview() {},
    // 上传之前效验格式
    beforeUpload(file) {
      const checkType = {
        isMp4: file.type === 'video/mp4',
        isAvi: file.type === 'video/avi'
      }
      const isLtM = file.size / 1024 / 1024 < this.videoSize

      const isType = this.videoType.some(key => {
        return checkType[changeCase('is-' + key)]
      })

      const nameOverLength = file.name.length > this.nameLimit

      if (!isType) {
        this.$refs.Elupload.clearFiles()
        this.$message.error(`上传视频只能是 ${this.videoType.join(',')} 格式!`)
      }

      if (!isLtM) {
        this.$refs.Elupload.clearFiles()
        this.$message.error(`上传视频大小不能超过 ${this.videoSize}M!`)
      }

      if (nameOverLength) {
        this.$refs.Elupload.clearFiles()
        this.$message.error(`上传视频文件名长度不能超过 ${this.nameLimit}!`)
      }
      // const $add = $(this.$refs.upload).find('.upload-video')
      // $add.hide()
      return isType && isLtM
    },
    httpRequest(obj, file, fileList) {
      const params = new FormData()
      Object.keys(this.params).forEach(key => {
        if (key === 'file') {
          params.append(this.params[key], obj.file)
        } else {
          params.append(key, this.params[key])
        }
      })

      this.loading = true
      this.$portal.post(this.url, params).then(result => {
        this.loading = false
        if (result && result.code === '0') {
          const currentFile = {
            url: result.data.url,
            fileName: obj.file.name,
            fileSize: obj.file.size,
            fileType: obj.file.type
          }
          this.$message({
            message: '视频上传成功',
            type: 'success'
          })
          this.onChange(currentFile)
          this.findvideocover(currentFile)
          this.$emit('success', currentFile)
        } else {
          this.$emit('error')
          this.$message.error('视频上传失败,请重试')
        }
      })
    },
    // 截取视频第一帧为封面
    findvideocover(file) {
      this.$nextTick(() => {
        const video = document.getElementById('upvideo')
        const source = document.createElement('source')
        source.src = file.url
        source.type = file.fileType
        video.crossOrigin = 'Anonymous'
        video.appendChild(source)
        video.addEventListener('loadeddata', () => {
          var canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          var ratio = this.getPixelRatio(context)
          var videoH = video.videoHeight
          var videoW = video.videoWidth
          canvas.width = videoW * ratio // 画布宽度
          canvas.height = videoH * ratio // 画布高度
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          // canvas.width = '130'
          // canvas.height = '100'
          // canvas
          //   .getContext('2d')
          //   .drawImage(video, 0, 0, canvas.width, canvas.width)
          const imgsrc = canvas.toDataURL('image/png', 1.0) // base64封面地址
          this.imagsrc = imgsrc
          this.uploadBase64(file.fileName, imgsrc)
        })
      })
    },
    getPixelRatio(context) {
      var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1
      return (window.devicePixelRatio || 1) / backingStore
    },
    // 上传base64图片
    uploadBase64(fileName, fileStr) {
      const url = '/cms-web/file/uploadFileBase64.do'
      const newFileName = fileName.split('.')[0] + '.jpeg'
      const params = {
        fileName: newFileName,
        fileStr: fileStr
      }
      this.$portal.post(url, params).then(result => {
        if (result && result.code === '0') {
          this.imagsrc = result.data
          const file = this.value
          // file.imagsrc = this.imagsrc
          this.$set(file, 'imagsrc', this.imagsrc)
          this.$emit('input', file)
        } else {
          this.$emit('error')
        }
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
/deep/.el-dialog__body {
  background: #000;
}
.video-dialog {
  width: 100%;
  height: 100%;
}
.dialog-video-size {
  width: 100%;
  object-fit: fill;
}
.upload-video-con {
  display: flex;
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
}
.upload-video {
  padding: 0 30px 30px 0;
}
.el-upload__tip {
  margin-top: 20px;
  margin-left: 100px;
}
.el-upload--picture-card i {
  font-size: 12px;
}
.posi-ab {
  position: relative;
}
.upload-video-value {
  width: 100px;
  height: 100px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  margin: 0 8px 8px 0;
  object-fit: fill;
}
.upload-video-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  border-radius: 6px;
  line-height: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
.upload-video-mask:hover {
  opacity: 1;
}
.upload-video-mask i {
  padding: 0 5px;
}
</style>

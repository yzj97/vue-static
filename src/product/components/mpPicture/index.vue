<template>
  <div>
    <ul class="el-upload-list el-upload-list--picture-card">
      <ody-draggable
        :list="list"
        :group="{ src: 'people', pull: 'clone', put: false }"
        :clone="cloneDog"
        class="dragArea list-group"
        style="float: left"
        @change="log">
        <div v-for="(element, index) in list" :key="element.uid" :tabindex="index" style="float: left">
          <li class="el-upload-list__item is-success">
            <img :src="element.url" class="el-upload-list__item-thumbnail">
            <a class="el-upload-list__item-name">
              <i class="el-icon-document"/>
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-check"/>
            </label>
            <i class="el-icon-close"/>
            <i class="el-icon-close-tip">press delete to remove</i>
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview">
                <i name="openPictureDiglog" class="el-icon-zoom-in" @click="openPictureDiglog(element)"/>
              </span>
              <span name="remove" class="el-upload-list__item-delete" @click="remove(element)">
                <i class="el-icon-delete"/>
              </span>
            </span>
          </li>
        </div>
        <el-upload
          v-show="showUpload"
          :on-preview="handlePictureCardPreview"
          :on-success="handleSuccess"
          :show-file-list="false"
          :action="picAction"
          list-type="picture-card">
          <i class="el-icon-plus"/>
        </el-upload>
      </ody-draggable>
    </ul>
    <ody-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%">
    </ody-dialog>
  </div>
</template>
<script>
// import UserConfig from '@/config/index.json'
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    //  const picHost = window.$ody.isDev ? UserConfig.BASE_API : ''
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      showUpload: true,
      picAction: `/api/back-product-web/back/mp/media/uploadMedia.do`
    }
  },
  watch: {
    'list': function(newVal, oldVal) {
      if (this.list.length >= 10) {
        this.showUpload = false
      } else {
        this.showUpload = true
      }
    }
  },
  methods: {
    log: function(evt) {
      window.console.log(evt)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess(response, file, fileList) {
      this.list.push(file)
    },
    openPictureDiglog(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    remove(element) {
      this.list.splice(this.list.findIndex(v => v.uid === element.uid), 1)
    }
  }
}
</script>

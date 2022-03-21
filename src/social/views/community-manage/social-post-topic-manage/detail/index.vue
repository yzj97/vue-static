<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('基本信息') }}</span>
      </div>
      <el-form ref="form" :rules="rules" :model="post" label-width="100px" class="form">
        <el-row>
          <el-col :span="20">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('话题名称') + ':'" required>
                  <el-input v-model="postTopic.topicName" name="post_topic_title" maxlength="20" show-word-limit>
                    <template slot="prepend">#</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item :label="$t('话题图片') + ':'">
                <el-row>
                  <el-col :span="20">
                    <ody-upload-image v-model="postTopic.imageUrl" :pic-type="['png', 'jpg','jpeg']" :pic-size="4096" :show-tip="false" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-row>
                  <div>{{ $t('提示') }}：</div>
                  <div>{{ $t('话题图片上传须知') }}</div>
                </el-row>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item :label="$t('话题规则') + ':'">
                <el-row>
                  <el-col :span="20">
                    <!--<ody-upload-image :limit="5" v-model="postTopicRuleDTOList" :pic-type="['png', 'jpg']" :pic-size="4096" :show-tip="false" />-->
                    <ody-upload-image-sort
                      :file-list.sync="postTopic.postTopicRuleVOList"
                      :limit="5"
                      :draggable="true"
                      :pic-type="['png', 'jpg','jpeg']"
                      :pic-size="4096"
                      :show-tip="false"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-row>
                  <div>{{ $t('提示') }}：</div>
                  <div>{{ $t('支持上传最多5张，建议尺寸700*1150PX，单张大小不超过4M，支持JPG、JPEG、PNG格式') }}</div>
                </el-row>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <ody-fixed>
      <ody-button :loading="loading" name="SocialPostTopicSave_handleSave" code="PostTopic_add" type="primary" size="small" @click="handleSave">{{ $t('保存') }}</ody-button>
      <el-button :loading="loading" name="handleBack" size="small" @click="handleBack">{{ $t('返回') }}</el-button>
    </ody-fixed>
  </div>
</template>

<script>
export default {
  name: 'SocialPostTopicDetailManage',
  data() {
    return {
      id: '',
      postPictureList: '',
      postTopic: {
      },
      postTopicRuleDTOList: []
    }
  },
  mounted() {
    this.id = this.$route.query.id
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      this.handleSearchQuery()
    },
    handleSearchQuery() {
      this.query()
    },
    query() {
      if (this.id) {
        this.loading = true
        try {
          this.$social.$api.postTopicApi.getById({ id: this.id }).then(res => {
            if (res.code === '0') {
              this.postTopic = res.data
            }
          })
        } finally {
          this.loading = false
        }
      }
    },
    handleSave() {
      if (!this.postTopic.topicName || this.postTopic.topicName === '') {
        this.$message({
          message: this.$t('请填写话题名称'),
          type: 'warning'
        })
        return
      }
      // if (!this.postTopic.imageUrl || this.postTopic.imageUrl === '') {
      //   this.$message({
      //     message: this.$t('请上传图片'),
      //     type: 'warning'
      //   })
      //   return
      // }

      this.$confirm(this.$t('是否保存') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const param = {
          topicName: this.postTopic.topicName,
          imageUrl: this.postTopic.imageUrl,
          postTopicRuleDTOList: this.postTopic.postTopicRuleVOList
        }
        let postApi = null
        if (this.id) {
          postApi = this.$social.$api.postTopicApi.update
          param.id = this.id
        } else {
          postApi = this.$social.$api.postTopicApi.add
        }
        postApi(param).then(res => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('编辑成功') + '!'
            })
            this.$portal.delActiveViewAndRefresh('SocialPostTopicManage')
          }
        })
      })
    },
    handleBack() {
      this.$portal.delActiveViewAndRefresh('SocialPostTopicManage')
    }
  }
}

</script>
<style scoped>
</style>

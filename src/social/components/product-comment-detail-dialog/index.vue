<template>
  <ody-dialog
    :title="$t('查看')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="960px"
    @open="init">
    <el-form ref="form" :model="comment" label-width="80px">
      <el-row class="line">
        <el-tooltip class="item" effect="dark" placement="top">
          <i class="el-icon-question" />
          <div slot="content">
            {{ $t('若开启仅评论人可见后，在前台商城不会对于会员所查看到的评价数量产生影响,') }}
            <br >
            {{ $t('对于其他会员所查看到当前的评价内容做调整,') }}
            <br >
            {{ $t('调整展示字段为【该用户暂无评价】。') }}
            <br >
          </div>
        </el-tooltip>
        <span>{{ $t('评论仅评论人可见') }}</span>
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="comment.isCommentatorSee"
          :disabled="comment.parentId !== 0"
          name="scope_row_canSale"
          @change="changeIsCommentatorSee()"
        />
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('评论时间')">
            {{ comment.createTimeStr }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品编码')">
            {{ comment.mpCode }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('评论人')">
            {{ comment.userUsername }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品类目')">
            {{ comment.categoryName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('订单编号')">
            {{ comment.orderCode }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('商品名称')">
            {{ comment.mpName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('置顶状态')">
            {{ comment.topflagstr }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('回复状态')">
            {{ comment.hasReplyStr }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('审核状态')">
            {{ comment.checkFlagstr }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('审核人')">
            {{ comment.auditorNamestr }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('审核时间')">
            {{ comment.auditTimeStr }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('来源')">
            {{ comment.platformIdstr }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('商品评分')">
        {{ comment.rate }}
      </el-form-item>
      <el-form-item :label="$t('渠道来源')">
        {{ comment.channelName }}
      </el-form-item>
      <el-form-item :label="$t('内容')">
        {{ comment.content }}
      </el-form-item>
      <el-form-item :label="$t('图片')">
        <el-image
          v-for="url in comment.picList"
          :key="url"
          :src="url"
          style="width: 250px;height:220px"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button name="handleBack" size="small" type="primary" @click="handleBack">{{ $t('返回') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    id: {
      type: Object,
      default: null
    },
    channelMap: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      comment: {
        createTimeStr: '',
        mpCode: '',
        userUsername: '',
        categoryName: '',
        orderCode: '',
        mpName: '',
        topflagstr: '',
        hasReplyStr: '',
        checkFlagstr: '',
        auditorNamestr: '',
        auditTimeStr: '',
        platformIdstr: '',
        rateStr: '',
        channelName: '',
        content: '',
        isCommentatorSee: '',
        picList: []
      }
    }
  },
  methods: {
    init() {
      const vue = this
      vue.$social.$api.socialApi.getMPCommentInfo({ commentId: vue.id }).then(res => {
        vue.comment = res.data
        const channel = vue.channelMap[vue.comment.channelCode]
        vue.comment.channelName = channel ? channel.channelName : ''
        vue.comment.createTimeStr = vue.$portal.parseTime(vue.comment.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
        if (vue.comment.auditTime) {
          vue.comment.auditTimeStr = vue.$portal.parseTime(vue.comment.auditTime, '{y}-{m}-{d} {h}:{i}:{s}')
        }
      })
    },
    handleBack() {
      this.$emit('update:visible', !this.visible)
    },
    // 设置是否仅评论人可见
    changeIsCommentatorSee() {
      const vue = this
      const ids = []
      const mpIds = []
      ids.push(vue.comment.id)
      mpIds.push(vue.comment.mpId)
      vue.$social.$api.socialApi
        .setIsCommentatorSee({ ids: ids, mpIds: mpIds, isCommentatorSee: vue.comment.isCommentatorSee })
        .then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
    }
  }
}
</script>

<style scoped>
.line{
  padding-bottom: 10px;
  border-bottom: 1px solid #9eafb8;
  margin-bottom: 10px;
}
</style>

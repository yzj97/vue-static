<template>
  <ody-dialog
    :visible.sync="innerVisible"
    :title="$t('朋友圈')"
    width="960px"
    append-to-body
  >
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item >
          <el-input v-model="content" :placeholder="$t('搜索朋友圈')" name="content"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="isOwner" :placeholder="$t('全部')" name="isOwner">
            <el-option :value="1" :label="$t('自己')"/>
            <el-option :value="0" :label="$t('好友')"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button name="onSubmit" type="primary" size="small" @click="onSubmit">{{ $t('查询') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <div v-infinite-scroll="load" ref="scrollbar" :infinite-scroll-distance="100" infinite-scroll-disabled="disabled" class="scroll">
        <div v-for="item in list" :key="item.id" class="items">
          <div class="top">
            <div class="img">
              <el-image
                :src="item.avatar"
                :preview-src-list="[item.avatar]"
                fit="fill"
                style="width: 32px; height: 32px; border-radius: 50%"/>
            </div>
            <div class="title">
              <div class="name">{{ item.nickname }}</div>
              <div class="content">
                {{ item.momentEntity.content }}
              </div>
            </div>
          </div>
          <div v-if="item.type === 1" class="img-list" >
            <el-image
              v-for="itm in item.momentEntity.urls"
              :key="itm"
              :src="itm"
              :preview-src-list="item.momentEntity.urls"
              fit="fill"
              style="width: 100px; height: 100px; margin-right:10px"/>
          </div>
          <div v-if="item.type === 15" class="img-list">
            <video id="video" :src="item.momentEntity.urls[0]" width="220px" preload="auto" controls="controls" webkit-playsinline="true"/>
          </div>
          <div v-if="item.type === 3" class="img-list">
            <el-link :href="item.momentEntity.urls[0]" style="font-size:12px" type="primary" target="_blank" >{{ $t('这是一个外网连接') }}</el-link>
          </div>
          <div class="bottom">
            <div class="time">{{ item.createTimeStr }}</div>
            <div class="right">
              <span name="goLike" class="like" @click="goLike(item)"/>
              <el-popover
                :title="$t('评论')"
                placement="left"
                width="300"
                trigger="click"
              >
                <div class="popover-content">
                  <div class="input">
                    <el-input
                      :rows="2"
                      v-model="textarea"
                      :placeholder="$t('请输入评论内容')"
                      name="textarea"
                      type="textarea"/>
                  </div>
                  <div class="input-btn">
                    <el-button name="goComment" type="primary" size="small" @click="goComment(item)">{{ $t('确定') }}</el-button>
                  </div>
                </div>
                <span slot="reference" class="info"/>
              </el-popover>
            </div>
          </div>
          <div v-if="item.likeList && item.likeList.length > 0" class="like-list">
            <span class="good"/>
            <span v-for="(row, index) in item.likeList" :key="row.wechatId" class="people-name">{{ row.nickName }} <span v-if="index !== item.likeList.length-1">,</span></span>
          </div>
          <div v-if="item.commentList && item.commentList.length > 0" class="comment-list">
            <div v-for="row in item.commentList" :key="row.id" class="comment-list-item">
              <span class="nick-name">{{ row.nickName }}：</span>
              <span class="content-title">{{ row.content }}</span>
            </div>
            <span/>
          </div>
        </div>
      </div>
    </div>

    <span slot="footer">
      <div class="line-top"/>
      <el-button name="hideDialog" size="small" @click="hideDialog">取 消</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    wechatAccountId: {
      type: String,
      default: ''
    },
    wechatId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      textarea: '',
      innerVisible: this.visible,
      content: '',
      isOwner: '',
      list: [],
      currentPage: 1,
      wechatApi: this.$crm.$api.wechat,
      isEnd: false,
      loading: false
    }
  },
  computed: {
    disabled() {
      return this.loading || this.isEnd
    }
  },
  watch: {
    visible() {
      this.innerVisible = this.visible
    },
    innerVisible(val) {
      this.$emit('update:visible', val)
    }

  },
  methods: {
    load() {
      this.loading = true
      this.getList()
    },
    onSubmit() {
      this.currentPage = 1
      this.isEnd = false
      this.loading = false
      this.list = []
      this.getList()
    },
    hideDialog() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    },
    goLike(item) {
      const params = {
        momentInteractType: 1,
        wechatId: this.wechatId,
        snsId: item.snsId
      }
      this.wechatApi.interact(params).then(res => {
        if (res.data.wechatId) {
          item.likeList.push(res.data)
        }
      })
    },
    goComment(item) {
      if (this.textarea === '') {
        return
      }
      const params = {
        momentInteractType: 2,
        wechatId: this.wechatId,
        snsId: item.snsId,
        content: this.textarea
      }
      this.wechatApi.interact(params).then(res => {
        item.commentList.push(res.data)
        this.textarea = ''
        document.body.click()
      })
    },
    getList() {
      const params = {
        pageSize: 20,
        pageNo: this.currentPage,
        wechatAccountId: this.wechatAccountId,
        content: this.content,
        isOwner: this.isOwner
      }
      this.wechatApi.listPage(params).then(res => {
        const newArrList = []
        res.data.map(item => {
          const index = this.list.findIndex(row => row.snsId === item.snsId)
          if (index === -1) {
            newArrList.push(item)
          }
        })
        this.list = [...this.list, ...newArrList]
        this.currentPage += 1
        this.loading = false
        if (this.list.length >= res.total) {
          this.isEnd = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .input-btn {
    margin-top: 6px;
    text-align: right;
  }
  .list {
    height: 460px;
    .scroll {
      height: 100%;
      overflow: auto;
    }
    .items {
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 16px;
      .top {
        display: flex;
        .img {
          margin-right: 10px;
        }
        .title {
          .name {
            color: #333;
            font-size: 12px;
            margin-bottom: 6px;
          }
          .content{
            color: #666;
            font-size: 12px;
            line-height: 16px;
          }
        }
      }
      .img-list {
        margin-top: 12px;
        padding-left: 42px;

      }
      .like-list {
        padding-left: 40px;
        margin: 0 0 12px 0;
        .good {
          display: inline-block;
          height: 14px;
          width: 14px;
          background: url('./img/like.png') no-repeat center center;
          background-size: 100%;
          margin-right: 4px;
        }
        .people-name {
          color: #409eff;
          display: inline-block;
          font-size: 12px;
          vertical-align: text-top;
          margin-right: 4px;
        }

      }
      .comment-list {
        padding-left: 40px;
        margin: 0 0 12px 0;
        .comment-list-item {
          margin-bottom: 4px;
          font-size: 12px;
          .nick-name {
             color: #409eff;
          }
        }
      }
      .bottom {
        margin: 16px 12px;
        padding-left: 32px;

        .time {
          color: #666;
          font-size: 12px;
        }
        .right {
          display: flex;
          float: right;
          margin-top: -15px;
          .like {
            height: 20px;
            width: 20px;
            background: url('./img/like.png') no-repeat center center;
            background-size: 100%;
            margin-right: 20px;
          }
          .info {
            display: inline-block;
            height: 20px;
            width: 20px;
            background: url('./img/info.png') no-repeat center center;
            background-size: 100%;
          }
        }
      }

    }
  }

</style>

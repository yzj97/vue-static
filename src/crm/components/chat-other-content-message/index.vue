<template>
  <div class="chat-other-content-message">
    <div class="chat-header">
      <div class="title">
        群名称
      </div>
      <div class="group-name">
        {{ userInfo.groupName }}
      </div>
    </div>
    <div class="chat-notice">
      <div class="title">
        群公告
      </div>
      <div class="notice-content">
        <el-popover
          :content="userInfo.groupNotice || '暂无群公告'"
          placement="left"
          width="200"
          trigger="hover">
          <span slot="reference">{{ userInfo.groupNotice || '暂无群公告' }}</span>
        </el-popover>
      </div>
    </div>
    <div class="chat-member">
      <div class="search">
        <div class="title">
          群成员
        </div>
        <el-input
          v-model="nickname"
          :placeholder="$t('搜索群成员')"
          name="nickname"
          class="input"
          prefix-icon="el-icon-search"
          @keyup.enter.native="search"/>
      </div>
      <div class="user-list">
        <div v-infinite-scroll="load" :infinite-scroll-distance="100" infinite-scroll-disabled="disabled" class="scroll">
          <div v-for="item in list" :key="item.id" class="list-item">
            <div class="item">
              <div class="img">
                <el-image
                  :src="item.avatar"
                  fit="fill"
                  style="width: 32px; height: 32px; border-radius: 50%"/>
              </div>
              <div class="name">
                {{ item.nickname }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      wechatApi: this.$crm.$api.wechat,
      nickname: '',
      currentIndex: 1,
      isEnd: false,
      list: [],
      loading: false
    }
  },
  computed: {
    disabled() {
      return this.loading || this.isEnd
    }
  },
  watch: {
    userInfo: {
      handler(val) {
        this.currentIndex = 1
        this.list = []
        this.getList()
      }
    }
  },
  methods: {
    load() {
      this.loading = true
      this.getList()
    },
    search() {
      this.currentIndex = 1
      this.list = []
      this.getList()
    },
    getList() {
      const params = {
        limit: 20,
        page: this.currentIndex,
        filters: {
          nickname: this.nickname,
          wechatGroupId: this.userInfo.id
        }
      }
      this.wechatApi.wechatGroupMember(params).then(res => {
        this.list = [...this.list, ...res.data]
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
.chat-other-content-message {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 16px;
  font-size: 12px;
  .title {
    color: #999;
    height: 32px;
    line-height: 32px;
  }
  .chat-header {
    .group-name {
      height: 32px;
      line-height: 32px;
      font-weight: 600;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .chat-notice {
    margin: 10px 0;
    .notice-content {
      height: 72px;
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-line-clamp:3;
      line-height: 24px;
      -webkit-box-orient:vertical;
    }
  }
  .chat-member {
    flex: 1;
    .input {
      font-size: 12px;
    }
    .user-list {
      height: 278px;
      .scroll {
        height: 100%;
        overflow: auto;
        .list-item {
          .item {
            display: flex;
            margin: 8px 0;
            .img {
              margin-right: 4px;
            }
            .name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #333;
              font-size: 12px;
              line-height: 32px;
            }
          }
        }
      }

    }
  }
}
</style>

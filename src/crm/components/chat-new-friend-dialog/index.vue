<template>
  <ody-dialog
    :visible.sync="innerVisible"
    :title="$t('新朋友')"
    width="960px"
    append-to-body
  >
    <div class="items">
      <div v-infinite-scroll="load" :infinite-scroll-distance="100" infinite-scroll-disabled="disabled" class="scroll">
        <div v-for="item in list" :key="item.id" class="list-item">
          <div class="left">
            <span class="top">头像:</span>
            <el-image
              :src="item.avatar"
              fit="fill"
              style="width: 100px; height: 100px"/>
          </div>
          <div class="center">
            <div class="name center-li">
              <span class="label">名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</span>
              <span class="value">{{ item.alias }}</span>
            </div>
            <div class="status center-li">
              <span class="label">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</span>
              <span class="value">{{ item.status === 1 ? '未添加' : '已添加' }}</span>
            </div>
            <div class="info center-li">
              <span class="label">验证信息：</span>
              <span class="value">{{ item.greeting }}</span>
            </div>
          </div>
          <div class="right">
            <el-button v-if="item.status === 1" name="confirm" type="primary" size="small" @click="confirm(item)">{{ $t('同意') }}</el-button>
            <el-button v-else :disabled="true" size="small">{{ $t('已添加') }}</el-button>
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
    }
  },
  data() {
    return {
      innerVisible: this.visible,
      currentPage: 1,
      wechatApi: this.$crm.$api.wechat,
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
    visible() {
      this.innerVisible = this.visible
    },
    innerVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    confirm(item) {
      const params = {
        wechatAccountId: item.wechatAccountId,
        id: item.id
      }
      this.wechatApi.acceptFriend(params).then(res => {
        item.status = 2
      })
    },
    load() {
      this.loading = true
      this.getList()
    },
    hideDialog() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    },
    getList() {
      const params = {
        page: this.currentPage,
        limit: 10,
        filters: {
          ownerWechatAccountId: this.wechatAccountId
        }
      }
      this.wechatApi.wechatNewFriend(params).then(res => {
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
  .items{
    height: 500px;
    .scroll {
      height: 100%;
      overflow: auto;
    }
    .list-item {
      display: flex;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 20px;
      .left {
        margin-right: 100px;
        .top {
          font-size: 14px;
          vertical-align: top;
          margin-right: 4px;
        }
      }
      .center{
        width: 500px;
        font-size: 14px;
        .center-li {
          line-height: 32px;
        }
        .label {
          color: #666;
        }
        .value {
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .right {
        margin-left: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

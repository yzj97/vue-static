<template>
  <div class="chat-goods">
    <div class="chat-member">
      <div class="search">
        <div class="title">{{ $t('商品列表') }}</div>
        <el-input
          v-model="chineseName"
          :placeholder="$t('请输入商品名称')"
          name="chineseName"
          class="input"
          prefix-icon="el-icon-search"
          @keyup.enter.native="listStoreMpByName"
        />
      </div>
      <div v-if="chineseName === ''" class="user-list">
        <div
          v-infinite-scroll="load"
          :infinite-scroll-distance="100"
          infinite-scroll-disabled="disabled"
          class="scroll"
        >
          <div
            v-for="item in goodsList"
            :key="item.mpId"
            name="clickTopGoods"
            class="list-item"
            @click="clickTopGoods(item.mpId,item.channelCode)"
          >
            <div class="img">
              <img :src="item.mpUrl" >
            </div>
            <div class="item-content">
              <div class="goods-name">{{ item.mpName }}</div>
              <div class="goods-price">￥{{ item.mpPrice }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="user-list">
        <el-scrollbar style="height:100%">
          <div
            v-for="item in goodsList"
            :key="item.mpId"
            name="clickGoods"
            class="list-item"
            @click="clickGoods(item.productDeatailUrl)"
          >
            <div class="img">
              <img :src="item.mainPictureUrl" >
            </div>
            <div class="item-content">
              <div class="goods-name">{{ item.chineseName }}</div>
              <div class="goods-price">￥{{ item.salePriceWithTax }}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chineseName: '',
      currentPage: 1,
      wechatApi: this.$crm.$api.wechat,
      isEnd: false,
      loading: false,
      goodsList: [],
      urlHost: '',
      domainList: []
    }
  },
  computed: {
    disabled() {
      return this.loading || this.isEnd
    }
  },
  watch: {
    chineseName(val) {
      if (val === '') {
        this.currentPage = 1
        this.mpSalesRankingList()
      } else {
        this.goodsList = []
      }
    }
  },
  created() {
    this.getProductDetailUrl()
  },
  methods: {
    getProductDetailUrl() {
      this.wechatApi.queryAllChannelSchema().then(res => {
        this.domainList = res.data
      })
    },
    clickTopGoods(mpId, channelCode) {
      this.domainList.forEach(item => {
        if (item.businessChannelCode === channelCode && item.lable === 'h5') {
          const data = item.accessDomainUrl + '/detail.html?itemId=' + mpId
          console.log(data)
          this.$emit('setContent', data)
        }
      })
    },
    clickGoods(data) {
      this.$emit('setContent', data)
    },
    mpSalesRankingList() {
      if (this.currentPage === 1) {
        this.goodsList = []
      }
      const params = {
        startDt: this.$portal.parseTime(
          new Date() - 3600 * 24 * 1 * 1000,
          '{y}-{m}-{d}'
        ),
        endDt: this.$portal.parseTime(
          new Date() - 3600 * 24 * 1 * 1000,
          '{y}-{m}-{d}'
        ),
        // startDt: '2020-04-27',
        // endDt: '2020-04-27',
        itemPerPage: 10,
        currentPage: this.currentPage,
        sortType: 'sales_mp_num_desc'
      }
      this.wechatApi.mpSalesRankingList(params).then(res => {
        this.goodsList = [...this.goodsList, ...res.data.data]
        this.currentPage += 1
        this.loading = false
        if (this.goodsList.length >= res.data.totalCount) {
          this.isEnd = true
        }
      })
    },
    listStoreMpByName() {
      if (this.chineseName === '') {
        return
      }
      const params = {
        chineseName: this.chineseName
      }
      this.wechatApi.listStoreMpByName(params).then(res => {
        this.goodsList = res.data
      })
    },
    load() {
      this.loading = true
      this.mpSalesRankingList()
    }
  }
}
</script>

<style lang="less" scoped>
.chat-goods {
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
  .chat-member {
    flex: 1;
    .input {
      font-size: 12px;
    }
    .user-list {
      height: 466px;
      .scroll {
        height: 100%;
        overflow: auto;
      }
      .list-item {
        margin-top: 16px;
        display: flex;
        .img {
          margin-right: 8px;
          img {
            width: 60px;
            height: 60px;
            display: block;
          }
        }
        .item-content {
          flex: 1;
          .goods-name {
            height: 26px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            color: #666;
            font-size: 12px;
          }
          .goods-price {
            color: #333;
            font-weight: bold;
            font-size: 12px;
            margin-top: 16px;
          }
        }
      }
    }
  }
}
</style>

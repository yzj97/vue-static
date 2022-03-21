<template>
  <div class="pc-cms-goods">
    <div v-if="listObj.length > 0" :class="[{'col5' : model.col === 5}, {'col4' : model.col === 4}, {'col3' : model.col === 3}, {'col2' : model.col === 2}]" class="goods-list">
      <div v-for="pro in listObj" :key="pro.mpId" name="goDetail" class="goods-item">
        <div class="goods-img">
          <img :src="pro.customPic ? pro.customPic : pro.picUrl " class="img" width="100%">
        </div>
        <div class="goods-info">
          <div v-if="model.col !== 2" class="goods-price">{{ $t('暂无价格') }}</div>
          <div class="mp-name">
            {{ pro.customName ? pro.customName : pro.mpName }}
          </div>
          <div v-if="model.col === 2" class="goods-cart">
            <span class="price">{{ $t('暂无价格') }}</span>
            <span class="cart">{{ $t('立即抢购') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="listObj.length === 0 && baseConfig.isEdit" :class="[{'col5' : model.col === 5}, {'col4' : model.col === 4}, {'col3' : model.col === 3}, {'col2' : model.col === 2}]" class="goods-list">
      <div v-for="item in model.col" :key="item" class="goods-item">
        <div class="goods-img">
          <img :src="require('@/img/goods-default.png')" class="img" width="100%">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    itemData: {
      type: Object,
      default: () => {}
    },
    operation: { // 传入对于商品 优惠券 的基础操作 比如 请求商品 加入购物车 跳转到详情页面
      type: Object,
      default: () => {}
    },
    baseConfig: { // 传入对于商品 优惠券 组件的基础config
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      listObj: [],
      isBusy: false,
      pageNo: 1,
      totalPage: 1,
      pageSize: 10,
      chooseCateIndex: 0,
      categoryId: '',
      navCategoryList: [],
      scrollerNav: null
    }
  },
  watch: {
    'model.dataChange': {
      handler(val) {
        this.pageNo = 1
        this.query()
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handler, true)
    this.query()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handler, true)
  },
  methods: {
    handler() {
      const offset = 100
      if (this.isBusy) {
        return
      }
      const boundRectObj = this.$el.getBoundingClientRect()
      var windowH
      if (this.baseConfig.isEdit) {
        windowH = 700
      } else {
        windowH = window.innerHeight
      }
      if (boundRectObj.bottom >= (0 - offset) && boundRectObj.bottom <= windowH + offset) {
        if (this.pageNo < this.totalPage) {
          this.isBusy = true
          this.pageNo += 1
          this.query()
        }
      }
    },
    query() {
      if (this.operation.getGoodsList && this.itemData.id) {
        const params = {
          moduleId: this.itemData.id,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        this.operation.getGoodsList(params).then(res => {
          if (res.data.listObj && res.data.listObj.length === 0 || !res.data.listObj) {
            this.listObj = []
            return
          }
          this.totalPage = res.data.totalPage
          const originData = res.data.listObj
          if (this.pageNo === 1) {
            this.listObj = originData
          } else {
            this.listObj = [...this.listObj, ...originData]
          }
          this.isBusy = false
        })
      }
    }

  }
}
</script>

<style lang="scss" scoped>

.pc-cms-goods {
  .col5 {
    .goods-item {
      width: 20%;
      flex-direction: column;
      .goods-img {
        width: 100%;
        height: 184px;
      }
    }
  }
  .col4 {
    .goods-item {
      width: 25%;
      flex-direction: column;
      .goods-img {
        width: 100%;
        height: 235px;
      }
    }
  }
  .col3 {
    .goods-item {
      width: 33%;
      flex-direction: column;
      .goods-img {
        width: 100%;
        height: 317px;
      }
    }
  }
  .col2 {
    .goods-item {
      width: 50%;
      .goods-img {
        width: 220px;
        height: 220px;
        margin-right: 10px;
      }
    }
  }
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    .goods-item {
      padding: 0.1rem;
      display: flex;
      margin-bottom: .03rem;
      box-sizing: border-box;
      .goods-img {
        display: block;
        .img {
          width: 100%;
          height: 100%;
          border-radius: 0.06rem;
          display: block;
        }
      }
      .goods-info {
        flex: 1;
        margin-top: .03rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .mp-name{
          width: 100%;
          font-size: 0.16rem;
          color: #333333;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-weight: bold;
        }
        .goods-price {
          color: #f23030;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 10px;
          font-size: 20px;
        }
        .goods-cart {
          display: flex;
          .cart {
            display: inline-block;
            width: 120px;
            background-color: #f23030;
            height: 50px;
            color: #fff;
            line-height: 50px;
            text-align: center;
            color: #ffffff;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 20px;
          }
          .price {
            display: inline-block;
            width: 120px;
            border: 1px solid #f23030;
            height: 50px;
            color: #fff;
            line-height: 50px;
            text-align: center;
            color: #f23030;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 20px;
          }
        }
      }
    }

  }
}
</style>


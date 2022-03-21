<template>
  <el-card>
    <div class="button-group-div">
      <h3 >{{ $t('商品（单规格、多规格）') }} </h3>
      <span name="toNext" class="big-button" @click="toNext()">
        <div>
          <i class="el-icon-plus" />
          <span>{{ $t('单个创建商品') }}</span>
        </div>
      </span>
      <span name="toBatch" class="big-button" @click="toBatch()">
        <div>
          <i class="el-icon-document" />
          <span>{{ $t('批量创建商品') }}</span>
        </div>
      </span>
      <span v-if="visible" name="toBatchModify" class="big-button" @click="toBatchModify()">
        <div>
          <i class="el-icon-edit-outline" />
          <span>{{ $t('批量修改商品') }}</span>
        </div>
      </span>
    </div>
    <div class="button-group-div">
      <h3 >{{ $t('组合商品') }} </h3>
      <span name="toNextCombine" class="big-button" @click="toNextCombine()">
        <div>
          <i class="el-icon-plus" />
          <span>{{ $t('单个创建组合商品') }}</span>
        </div>
      </span>
      <span v-if="visible" name="toBatchCombine" class="big-button" @click="toBatchCombine()">
        <div>
          <i class="el-icon-document" />
          <span>{{ $t('批量创建组合商品') }}</span>
        </div>
      </span>
      <span v-if="visible" name="toBatchModifyCombine" class="big-button" @click="toBatchModifyCombine()">
        <div>
          <i class="el-icon-edit-outline" />
          <span>{{ $t('批量修改组合商品') }}</span>
        </div>
      </span>
    </div>
    <div class="button-group-div">
      <h3 >{{ $t('原料') }} </h3>
      <span name="toNextUseType" class="big-button" @click="toNextUseType()">
        <div>
          <i class="el-icon-plus" />
          <span>{{ $t('单个创建原料') }}</span>
        </div>
      </span>
      <span name="toNextBatchUseType" class="big-button" @click="toNextBatchUseType()">
        <div>
          <i class="el-icon-document" />
          <span>{{ $t('批量创建原料') }}</span>
        </div>
      </span>
      <span v-if="visible" name="toBatchModifyUseType" class="big-button" @click="toBatchModifyUseType()">
        <div>
          <i class="el-icon-edit-outline" />
          <span>{{ $t('批量修改原料') }}</span>
        </div>
      </span>
    </div>
    <div class="button-group-div">
      <h3 >{{ $t('图片') }} </h3>
      <span name="toImportPicture" class="big-button" @click="toImportPicture()">
        <div>
          <i class="el-icon-picture-outline" />
          <span>{{ $t('导入图片') }}</span>
        </div>
      </span>
    </div>
  </el-card>

</template>

<script>

export default {
  components: {
  },
  props: {
    createMp: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      visible: false
    }
  },
  mounted(d) {
  },
  methods: {
    next() {
      this.$emit('next')
    },
    info() {
      this.$alert(this.$t('暂未实现'))
    },
    toNext() { // 创建商品
      this.createMp.productVO.typeOfProduct = 0
      this.createMp.productInfoVO.useType = 0
      this.createMp.displayView = 1
      this.next()
    },
    toBatch() { // 批量创建商品
      this.$router.push({
        name: 'ProductMaterialBatchProduct',
        query: {
          dataType: this.createMp.dataType
        }
      })
    },
    toBatchModify() { // 批量修改商品
      this.info()
    },
    toNextCombine() { // 创建组合品
      this.createMp.productVO.typeOfProduct = 4
      this.createMp.productInfoVO.combineType = 0
      this.createMp.productInfoVO.useType = 0
      this.createMp.displayView = 1
      this.next()
    },
    toBatchCombine() { // 批量创建组合商品
      this.info()
    },
    toBatchModifyCombine() { // 批量修改组合商品
      this.info()
    },
    toNextUseType() { // 创建原料
      this.createMp.productVO.typeOfProduct = 0
      this.createMp.productInfoVO.useType = 1
      this.createMp.displayView = 1
      this.next()
    },
    toNextBatchUseType() { // 批量创建原料
      this.$router.push({
        name: 'ProductMaterialBatch',
        query: {
          dataType: this.createMp.dataType
        }
      })
    },
    toBatchModifyUseType() { // 批量修改原料
      this.info()
    },
    toImportPicture() { // 导入图片
      this.$router.push({
        name: 'ProductImgBatch',
        query: {
          dataType: this.createMp.dataType
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/
  .big-button{
    padding: 20px;
    margin: 0 10px;
    border: 2px solid #E5E5E5;
    display: inline-block;
    cursor: pointer;
    div {
      display: flex;
      align-items: center;
      i {
        display: inline-block;
        font-size: 48px;
        color: #D6D6D6;
      }
      span {
        display: inline-block;
        margin-left: 15px;
        font-size: 1.4em;
      }
    }
  }
  .big-button:hover {
    border: 2px solid #1890FF;
    i {
      color: #1890FF;
    }
  }
  .button-group-div {
    margin: 0 0 40px 20px;
  }
</style>

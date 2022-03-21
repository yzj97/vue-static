<template>
  <div class="combine-select-category">
    <div slot="category" class="category">
      <div class="search">
        <input v-model="categoryName" :placeholder="$t('请输入名称/拼音首字母')" name="categoryName" @keyup.enter.native="categorySearch(level)">
        <i class="el-icon-search"/>
      </div>
      <div class="category-list">
        <p v-for=" (item,index) in list" :key="item.id" name="extendLevel" @click="extendLevel(index,item.id,level,item.toggleappend,item.color,item)">
          <span :class="{'active':item.color}">{{ item.label }}</span>
          <i v-if="item.toggleappend" class="el-icon-arrow-right"/>
        </p>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    level: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isAction: false,
      categoryName: '',
      searchValue: {
        categoryId: '',
        test1: ''
      }
    }
  },
  watch: {
    categoryName(val) {
      console.log(val)
    }
  },
  methods: {
    handleChange(val) {
      this.value1 = val
    },
    extendLevel(index, id, level, toggleappend, color, item) {
      // index是每个类目下数组的下标，level是类目的下标
      // console.log(color, level, index, item)
      this.isAction = true
      this.$emit('filterCategory', index, id, level + 1, color)
    },
    categorySearch(level) {
      this.$emit('cutCategory', level + 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  .combine-select-category{
    width:240px;
    float:left;
  }
  .category{
    width:230px;
    padding:10px 5px;
    margin:5px;
    color:#455A64 !important;
    font-size:12px !important;
  }
  .category-list{
    height:212px;
    overflow:auto;
  }
  .category-list p{
    display:flex;
    justify-content: space-between;
  }
  /*定义了滚动条滑块的样式*/
  ::-webkit-scrollbar-thumb{
    border-radius:10px;
    box-shadow:inset 0 0 0px rgba(240,240,240,.5);
    background-color:rgba(240,240,240,1)
  }
  /*定义了轨道的样式*/
  ::-webkit-scrollbar-track{
    -webkit-box-shadow:inset 0 0 0px rgba(240,240,240,.5);
    border-radius:10px;
    background-color:#CED4DA;
  }
  ::-webkit-scrollbar{
    width:3px;
    height:6px;
    background-color:rgba(240,240,240,1);
  }
  .search{
    width:220px;
    height:27px;
    border-radius:2px;
    margin-bottom:10px;
    display:flex;
    justify-content: space-between;
    align-items:center;
  }
  /*修改placeholder的样式*/
  ::-webkit-input-placeholder{
    color:#C0CCDA;
    font-size:12px;
  }
  ::-moz-placeholder{
    color:#C0CCDA;
    font-size:12px;
  }
  :-ms-input-placeholder{
    color:#C0CCDA;
    font-size:12px;
  }
  :-moz-placeholder{
    color:#C0CCDA;
    font-size:12px;
  }
  input{
    background:none;
    outline:none;
    border:none;
  }
  input{
    height:27px;
    padding-left:8px;
  }
  .active{
    color:#1B91FD;
  }
</style>

<template>
  <div class="cp-commodity-brand">
    <!-- <ody-combine-brand-select
      :visible.sync="brand.visible"
    /> -->
    <category
      v-for="(item, index) in categoryList"
      :key="index"
      :list="item"
      :level="index"
      @filterCategory="filterCategory"
      @cutCategory="cutCategory"
  /></div>
</template>
<script>
import category from '@/components/combine-select-category'
export default {
  components: { category },
  data() {
    return {
      brand: {
        visible: true
      },
      categoryList: [], // 分类数组
      dataList: [
        [
          {
            id: 1,
            label: '美妆',
            name: 'mz',
            color: false,
            toggleappend: true,
            children: [
              {
                id: 11,
                label: '粉底液',
                name: 'fdy',
                color: false,
                toggleappend: true,
                children: [
                  {
                    id: 111,
                    label: 'MAC',
                    color: false,
                    name: 'mac',
                    toggleappend: false
                  },
                  {
                    id: 111,
                    label: 'MAC',
                    color: false,
                    name: 'mac',
                    toggleappend: false
                  },
                  {
                    id: 111,
                    label: 'MAC',
                    color: false,
                    name: 'mac',
                    toggleappend: false
                  },
                  {
                    id: 111,
                    label: 'MAC',
                    color: false,
                    name: 'mac',
                    toggleappend: false
                  },
                  {
                    id: 111,
                    label: 'MAC',
                    color: false,
                    name: 'mac',
                    toggleappend: false
                  },
                  {
                    id: 112,
                    label: '兰蔻',
                    color: false,
                    name: 'lk',
                    toggleappend: false
                  },
                  {
                    id: 113,
                    label: '阿玛尼',
                    color: false,
                    name: 'amn',
                    toggleappend: false
                  }
                ]
              },
              {
                id: 12,
                color: false,
                label: '口红',
                name: 'kh',
                toggleappend: false
              },
              {
                id: 13,
                label: 'SKII神仙水',
                color: false,
                name: 'sk2',
                toggleappend: false
              }
            ]
          },
          {
            id: 2,
            label: '家电',
            color: false,
            toggleappend: true,
            name: 'jd',
            children: [
              {
                id: 21,
                label: '空调',
                color: false,
                name: 'kt',
                toggleappend: false
              },
              {
                id: 22,
                label: '洗衣机',
                color: false,
                name: 'xyj',
                toggleappend: false
              },
              {
                id: 23,
                label: '冰箱',
                color: false,
                name: 'bx',
                toggleappend: false
              }
            ]
          },
          {
            id: 3,
            label: '食品/保健品',
            color: false,
            toggleappend: false
          }
        ]
      ]
    }
  },
  mounted() {
    this.loading = false
    this.categoryList = this.dataList
    // this.categoryList = this.options[0]
    // console.log('等大康', this.options[0])
  },
  methods: {
    // 公共的去掉类目的方法
    publicCutLM(level) {
      var length = this.categoryList.length
      if (length > level) {
        this.step = length - level
        for (var k = 0; k < this.step; k++) {
          this.categoryList.pop()
        }
      }
      return this.categoryList
    },
    // 搜索分类时只展示当前类目和父级类目
    cutCategory(level) {
      this.categoryList = this.publicCutLM(level)
    },

    // 封装当前被选中的数据变颜色

    // 过滤新建商品分组
    filterCategory(index, id, level) {
      this.addLevel = []
      var length = this.categoryList.length
      if (length > level) {
        this.step = length - level
        for (var k = 0; k < this.step; k++) {
          this.categoryList.pop()
        }
      }
      this.categoryList[level - 1].forEach((element, dex) => {
        if (index === dex && element.id === id && element.children) {
          this.addLevel = element.children
          this.categoryList.push(this.addLevel)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.cp-commodity-brand{
    height:100%;
    width:100%;
    background-color:#fff;
    box-shadow:0 0 6px 0 rgba(154,170,180,0.2);
    border-radius:4px;
}
</style>

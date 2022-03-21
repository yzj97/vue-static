<template>
  <section class="section">
    <el-row style="display: flex; align-items: center; text-align:center;">
      <el-col :span="1">
        <el-button v-if="start > 0" name="preview" size="large" type="primary" icon="el-icon-caret-left" class="move-button" circle @click="preview" />
      </el-col>
      <el-col :span="22">
        <div v-for="(item, index) in categoryCardList" :key="index" >
          <el-col v-show="index >= start && lastShowIndex >= index" :span="7">
            <card ref="card" :category.sync="item" @checkedCategory="checkedCategory" @clearAutoSelected="clearAutoSelected" />
          </el-col>
        </div>
      </el-col>
      <el-col :span="1">
        <el-button v-if="categoryCardList.length - 1 > lastShowIndex" name="next" size="large" type="primary" icon="el-icon-caret-right" class="move-button" circle @click="next" />
      </el-col>
    </el-row>
  </section>
</template>

<script>
import card from './card'
export default {
  components: {
    card
  },
  props: {
    rootCategory: {
      type: Object,
      required: true,
      default: null
    },
    categoryMap: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      start: 0,
      cardLimit: 3,
      checked: null,
      categoryCardList: [],
      fullIdPath: null,
      nextCardId: null
    }
  },
  computed: {
    lastShowIndex() {
      return this.start + this.cardLimit - 1
    }
  },
  watch: {
    categoryMap: {
      handler(value, oldValue) {
        if (this.checked) {
          this.validateData(value[this.checked.id])
        } else if (this.nextCardId) {
          this.validateData(value[this.nextCardId])
        }
      },
      deep: true
    },
    rootCategory: {
      handler(value, oldValue) {
        this.validateData(value)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    },
    clearCard() {
      this.fullIdPath = null
      if (this.categoryCardList.length > 0) {
        this.categoryCardList.splice(0, this.categoryCardList.length)
        this.moveCard()
      }
    },
    preview() {
      this.start = this.start > 0 ? this.start - 1 : 0
    },
    next() {
      if (this.categoryCardList.length - this.cardLimit >= 0) {
        this.start = this.start + 1
      }
    },
    validateData(category) {
      if (category && category.id) {
        const cardIds = this.categoryCardList.map(i => i.id)
        if (cardIds.indexOf(category.id) < 0 && category.children) {
          this.createCard(category)
        }
      }
    },
    createCard(category) {
      this.$set(category, 'checkedId', null)
      if (this.fullIdPath) {
        const idArr = this.fullIdPath.split('>')
        const index = idArr.indexOf(category.id.toString())
        // 设置选中项
        if (index >= 0) {
          const nextIndex = index + 1
          if (nextIndex < idArr.length) {
            const checkedId = idArr[nextIndex]
            this.nextCardId = checkedId
            this.$set(category, 'checkedId', checkedId)
          }
        }
      }
      this.categoryCardList.push(category)
      this.moveCard()
    },
    removeCard(index) {
      this.categoryCardList.splice(index + 1, this.categoryCardList.length - index - 1)
    },
    moveCard() {
      this.end = this.categoryCardList.length
      this.start = this.end - this.cardLimit < 0 ? 0 : this.end - this.cardLimit
    },
    checkedCategory(parent, category, auto) {
      this.checked = category
      if (!auto) {
        this.fullIdPath = null
      }
      this.removeCard(this.categoryCardList.indexOf(parent))
      if (category.isLeaves === 1) {
        this.moveCard()
      }
      this.$emit('checkedCategory', category)
    },
    autoCreateCard(fullIdPath) {
      if (!fullIdPath) {
        return
      }
      this.fullIdPath = fullIdPath
      this.removeCard(-1)
      this.createCard(this.rootCategory)
    },
    clearAutoSelected() {
      this.fullIdPath = null
    }
  }
}

</script>
<style lang="less" scoped>

/deep/
.move-button {
  font-size: 20px;
  padding: 0px !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
}
</style>

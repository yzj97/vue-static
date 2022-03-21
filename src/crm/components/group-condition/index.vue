<template>
  <section
    :class="[`cp-group-condition-${size}`]"
    class="cp-group-condition"
  >
    <div id="group-condition-condition" class="right">
      <section
        v-for="(userGroupScreen, userGroupScreenIndex) in userGroupScreenItem"
        :key="userGroupScreenIndex"
        class="right-item"
      >
        <div class="title">
          {{ userGroupScreen.titleName }}
        </div>
        <ody-draggable
          :list="userGroupScreen.condition"
          :group="{ name: 'condition', pull: 'clone', put: false }"
          :clone="cloneCondition"
          class="drag-area"
        >
          <div
            v-for="(conditionItem, conditionIndex) in userGroupScreen.condition"
            :key="conditionIndex"
            class="list-condition-item"
          >
            {{ conditionItem.keyName }}
          </div>
        </ody-draggable>
      </section>
    </div>
    <div v-loading="loading" class="left">
      <div class="filter">
        <crm-group-filter v-if="!loading" :condition-value="value" :level="1"/>
      </div>
      <div class="show-area-wrap">
        <el-form v-if="value && Object.keys(value).length" ref="conditionForm" :inline="true" :model="value" class="condition">
          <div v-if="showP1Line(value)" class="action">
            <span
              v-if="showP1Text(value)"
              name="handleChangeAction"
              class="action-text"
              @click="handleChangeAction(value)"
            >
              <crm-must-should-button :action="value.action"/>
            </span>
          </div>
          <div v-for="(p2, p2Index) in value.children" :key="p2Index" class="condition">
            <div v-if="showP2Line(value, p2)" class="action">
              <span
                v-if="showP2Text(value, p2)"
                name="handleChangeAction9"
                class="action-text"
                @click="handleChangeAction(p2)"
              >
                <crm-must-should-button :action="p2.action"/>
              </span>
            </div>
            <div
              v-for="(p3, p3Index) in p2.children"
              id="group-condition-show-area"
              :key="p3Index"
              class="condition show-area"
            >
              <div
                v-if="showCloseBox(value.children, p2Index, p3Index)"
                name="handleCloseBox"
                class="close"
                @click="handleCloseBox(value.children, p2Index, p3Index)"
              >
                <i class="el-icon-close"/>
              </div>
              <div id="show-area-condition" class="show-area-condition">
                <div v-if="showP3line(p3)" id="show-area-condition-action" class="action">
                  <span
                    v-if="showP3Text(p3)"
                    key="actionText"
                    name="handleChangeAction8"
                    class="action-text"
                    @click="handleChangeAction(p3)"
                  >
                    <crm-must-should-button :action="p3.action"/>
                  </span>
                </div>
                <ody-draggable
                  :list="p3.children"
                  group="condition"
                  @change="log"
                >
                  <ody-center v-if="showP3IsNoDate(p3)" class="no-data">
                    + {{ $t('请将右侧条件拖拽至此处') }}
                  </ody-center>
                  <div
                    v-for="(p4, p4Index) in p3.children"
                    v-else
                    :key="p4Index"
                    class="list-group-item"
                  >
                    <crm-member-group-edit-item
                      :p2-index="p2Index"
                      :p3-index="p3Index"
                      :p4-index="p4Index"
                      :key="p4Index"
                      :config="p4"
                      @delete="handleCloseItem(value.children, p2Index, p3Index, p4Index)"
                    />
                  </div>
                </ody-draggable>
              </div>
              <div v-if="!showP3IsNoDate(p3)" id="group-condition-filter-3" class="filter">
                <crm-group-filter v-if="!loading" :condition-value="p3" :level="3" />
              </div>
            </div>
            <ody-left-right v-if="showP2Btn(p2)" class="add-p2">
              <div slot="left">
                <el-button
                  id="group-condition-add-2"
                  name="handleAdd"
                  size="small"
                  @click="handleAdd(p2, '2')"
                >
                  {{ $t('添加') }}
                </el-button>
              </div>
              <div id="group-condition-filter-2" slot="right" class="filter">
                <crm-group-filter v-if="!loading" :condition-value="p2" :level="2"/>
              </div>
            </ody-left-right>
          </div>
          <el-button
            v-if="value.children[0].children.length > 1"
            name="handleAdd4"
            size="small"
            @click="handleAdd(value, '1')"
          >
            {{ $t('添加') }}
          </el-button>
        </el-form>
      </div>
    </div>
    <ody-guide
      ref="guideGroupConditionNoChild"
      :steps="stepsNoCondition"
      guide-key="guideGroupConditionNoChild"
      type="cssDriver"/>
    <ody-guide
      ref="guideGroupConditionOneChild"
      :steps="stepsOneCondition"
      guide-key="guideGroupConditionOneChild"
      type="cssDriver"/>
    <ody-guide
      ref="guideGroupConditionTwoChild"
      :steps="stepsTwoCondition"
      guide-key="guideGroupConditionTwoChild"
      type="cssDriver"/>
  </section>
</template>

<script>
import CrmMemberGroupEditItem from '@/components/member-group-edit-item'
import CrmGroupFilter from '@/components/group-filter'
import CrmMustShouldButton from '@/components/must-should-button'

export default {
  components: {
    CrmMemberGroupEditItem,
    CrmGroupFilter,
    CrmMustShouldButton
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: 'medium' // medium small mini
    }
  },
  data() {
    return {
      stepsNoCondition: [
        {
          element: '#group-condition-condition',
          popover: {
            title: '筛选条件',
            description: '可以从右侧拖入至左侧筛选集内，并且可以添加多个',
            position: 'left'
          }
        },
        {
          element: '#group-condition-show-area',
          popover: {
            title: '筛选集',
            description: '从右侧筛选条件中拖入，并且可添加多个',
            position: 'bottom'
          }
        }
      ],
      stepsOneCondition: [
        {
          element: '#group-condition-filter-3',
          popover: {
            title: '筛选',
            description: '筛选当前筛选集中会员人数',
            position: 'bottom'
          }
        },
        {
          element: '#group-condition-add-2',
          popover: {
            title: '筛选集添加',
            description: '可以添加多个筛选集',
            position: 'bottom'
          }
        }
      ],
      stepsTwoCondition: [
        {
          element: '#show-area-condition-action',
          popover: {
            title: '筛选方式',
            description: '可以点击切换且或关系',
            position: 'right'
          }
        }
      ],
      loading: true,
      mustOrShouldMap: {
        must: this.$t('且'),
        should: this.$t('或')
      },
      userGroupScreenItem: [

      ],
      memberModal: {
        conditionValue: '',
        visible: false
      }
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (this.size === 'medium') {
          this.step()
        }
      },
      deep: true
    }
  },
  async mounted() {
    // await this.init()
  },
  methods: {
    step() {
      const noChildren = this.checkChildrenNumber(this.value)
      const oneChildren = this.checkChildrenNumber(this.value, 1)
      const twoChildren = this.checkChildrenNumber(this.value, 2)

      this.$nextTick(() => {
        if (!this.$refs.guideGroupConditionNoChild.isViewed() && noChildren) {
          this.$refs.guideGroupConditionNoChild.start()
        } else if (!this.$refs.guideGroupConditionOneChild.isViewed() && oneChildren) {
          this.$refs.guideGroupConditionOneChild.start()
        } else if (!this.$refs.guideGroupConditionTwoChild.isViewed() && twoChildren) {
          this.$refs.guideGroupConditionTwoChild.start()
        }
      })
    },
    checkChildrenNumber(newVal, number = 0) {
      if (newVal && newVal.children && newVal.children.length === 1) {
        const p2 = newVal.children[0]

        if (p2.children.length === 1) {
          const p3 = p2.children[0]

          return p3.children.length === number
        }
        return false
      }
      return false
    },
    async init() {
      // console.log('init', new Date() * 1)
      this.loading = true
      this.userGroupScreenItem = await this.getUserGroupScreenItem()
      this.loading = false
      // console.log('inited', new Date() * 1)
      if (this.size === 'medium') {
        this.step()
      }
    },
    cloneCondition(condition) {
      const conditionClone = JSON.parse(JSON.stringify(condition))

      if (!['checkbox', 'all'].includes(conditionClone.type) &&
        (conditionClone.select === null || conditionClone.select === undefined) &&
        conditionClone.condition
      ) {
        conditionClone.select = conditionClone.condition[0]
      }

      return conditionClone
    },
    async getUserGroupScreenItem() {
      const promise = this.$crm.$api.userGroup[this.size === 'medium' ? 'getScreenItem1' : 'getScreenItem2']
      const { data: { userGroupScreenItem } = {}} = await promise()

      return (userGroupScreenItem || []).map(userGroupItem => {
        userGroupItem.condition.forEach(x => {
          x.value = null
          x.select = null
          x.inputSelect = 'date'
          x.selected = []
          x.values = []
          x.list = []
        })

        return userGroupItem
      })
    },
    showP1Line(p1) {
      // 子的长度超过2个，就显示线
      return p1 && p1.children && p1.children.length > 1
    },
    showP1Text(p1) {
      // 子下面有有效的孙子（即孙子的length > 0)
      return p1.children.filter(p2 => p2.children.filter(p3 => p3.children.length > 0).length > 0).length > 1
    },
    showP2Text(p1, p2) {
      return p2.children.filter(p3 => p3.children.length > 0).length > 1
    },
    showP2Line(p1, p2) {
      // 子长度是1，并且父有2个也显示线
      if (p2.children.length === 1) {
        return p1.children.length > 1
      }
      // 子的有2个以上
      return p2.children.length > 1
    },
    showP2Btn(p2) {
      if (p2.children.length === 1) {
        return p2.children[0].children.length > 0
      }
      return true
    },
    showP3IsNoDate(p3) {
      // 没子
      return p3.children.length === 0
    },
    showP3Text(p3) {
      // 子的有2个以上
      return p3.children.length > 1
    },
    showP3line(p3) {
      // 有子
      return p3.children.length > 0
    },
    showCloseBox(p1Chilren, p2Index, p3Index) {
      const p2 = p1Chilren[p2Index]
      const p3 = p2.children[p3Index]

      if (p3.children.length > 0) {
        return true
      }

      if (p3.children.length === 0 && (p2.children.length > 1 || p1Chilren.length > 1)) {
        return true
      }

      return false
    },
    async handleCloseItem(p1Chilren, p2Index, p3Index, p4Index) {
      const res = await this.$confirm(this.$t('确定删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
      if (!res) {
        return false
      }

      const p2 = p1Chilren[p2Index]
      const p3 = p2.children[p3Index]

      p3.children.splice(p4Index, 1)
    },
    async handleCloseBox(p1Chilren, p2Index, p3Index) {
      const res = await this.$confirm(this.$t('确定删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
      if (!res) {
        return false
      }
      const p2 = p1Chilren[p2Index]
      const p3 = p2.children[p3Index]

      if (p2.children.length > 1) { // 子节点 大于2个，直接删除一个节点
        p2.children.splice(p3Index, 1)
      } else if (p1Chilren.length === 1) { // 子节点是1个，并且爷爷节点只是1个，则清空子节点
        p3.children = []
      } else { // 子节点1个，并且爷爷节点多个，则删除父节点
        p1Chilren.splice(p2Index, 1)
      }
    },
    handleChangeAction(node) {
      if (node.action === 'must') {
        node.action = 'should'
      } else {
        node.action = 'must'
      }
    },
    handleAdd(node, type) {
      const childrenModuleMap = {
        2: {
          action: 'must',
          children: [
          ]
        },
        1: {
          action: 'must',
          children: [
            {
              action: 'must',
              children: [
              ]
            }
          ]
        }
      }

      node.children.push(childrenModuleMap[type])
    }
  }
}
</script>
<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>

<style lang="scss" scoped>
.cp-group-condition {
  border: 1px solid rgba(238,245,249,1);
  overflow: hidden;
  margin-bottom: 20px;
  .right {
    float: right;
    border-left: 1px solid rgba(238,245,249,1);
    padding: 0 15px;
    margin-left: -1px;
    width: 300px;
    // padding: 20px;
    // overflow: auto;
    .drag-area {
      overflow: hidden;
    }
    // backgrounpx solid rgba(238,245,249,1);
    .title {
      height:20px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(24,144,255,1);
      line-height:20px;
      margin: 10px 0;
    }
    .list-condition-item {
      height:26px;
      background:rgba(242,242,246,1);
      border-radius:2px;
      float: left;
      line-height: 26px;
      margin-right: 8px;
      margin-bottom: 8px;
      padding: 0 8px;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .left {
    overflow: hidden;
    margin-right: 299px;
    border-right: 1px solid rgba(238,245,249,1);
    // padding: 0 15px;
    .filter {
      height: 46px;
      line-height: 46px;
      position: relative;
      padding: 0 15px;
      border-bottom: 1px solid rgba(238,245,249,1);
    }
    .show-area-wrap {
      padding: 15px;
    }
    .condition {
      position: relative;
      padding-left: 40px;
      margin-bottom: 20px;
      margin-right: 10px;
    }
    .action {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 40px;
      &::before {
        position: absolute;
        content: '';
        top: 0;
        bottom: 0;
        left: 50%;
        width: 2px;
        background-color: #C5E3FF;
        transform: translateX(-50%)
      }
      &-text {
        width:28px;
        text-align: center;
        height:28px;
        line-height: 28px;
        background:rgba(197,227,255,1);
        border-radius:3px;
        color: #1890FF;
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 14px;
        cursor: pointer;
      }
    }
    .show-area {
      border:1px solid rgba(206,212,218,1);
      position: relative;
      padding: 10px 10px 10px 40px;
      &-condition {
        // backgrounpx solid rgba(238,245,249,1);
        position: relative;
        .action {
          left: -40px;
        }
      }
    }
    .close {
      position: absolute;
      top: 0;
      right: -32px;
      width: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 18px;
      height: 32px;
      background:rgba(238,245,249,1);
      &:hover {
        color: var(--themeColor);
      }
    }
    .no-data {
      height:56px;
      color: var(--themeColor);
    }
    .list-group-item {
      position: relative;
      &-item {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
  }

  &-small {
    .show-area-wrap {
      margin-left: -80px;
      margin-right: -20px;
    }
    .close {
      display: none;
    }
    .show-area {
      // border: none !impotant;
      padding-left: 40px;
    }
    .filter {
      display: none;
    }
    .add-p2 {
      display: none;
    }
  }
}
</style>

<template>
  <div class="cp-group-filter">
    {{ $t('当前筛选') }}：
    <template v-if="count !== null">
      <span class="count">{{ count }}</span>
      {{ $t('人') }}
    </template>

    <ody-button
      name="userGroupSearchMemberNum_handleClick"
      code="userGroupSearchMemberNum"
      size="mini"
      @click="handleClick"
    >
      {{ $t('筛选') }}
    </ody-button>

    <ody-button
      v-if="level === 1"
      :disabled="count === null || count === 0"
      name="staticUserGroupListPage_handleMemberList"
      code="staticUserGroupListPage"
      type="primary"
      size="mini"
      @click="handleMemberList">
      {{ $t('查看') }}
    </ody-button>

    <crm-user-group-choose :condition-value="conditionValue" :visible.sync="memberModal.visible"/>
  </div>
</template>

<script>
import CrmUserGroupChoose from '@/components/user-group-choose'

export default {
  components: {
    CrmUserGroupChoose
  },
  props: {
    level: {
      type: Number,
      default: 1
    },
    conditionValue: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      count: null,
      memberModal: {
        visible: false
      }
    }
  },
  computed: {
    getConditionValue() {
      if (this.level === 3) {
        return {
          action: 'must', // 子的length >1 显示线条 + 文字, 其他不显示
          children: [
            {
              action: 'must', // 子的length == 1 && parentChidren.length > 1 显示 线条， 子的length > 1 显示线条 + 文字
              children: [
                {
                  ...this.conditionValue
                }
              ]
            }
          ]
        }
      }

      if (this.level === 2) {
        return {
          action: 'must', // 子的length >1 显示线条 + 文字, 其他不显示
          children: [
            {
              ...this.conditionValue
            }
          ]
        }
      }

      return {
        ...this.conditionValue
      }
    }
  },
  methods: {
    handleMemberList() {
      this.memberModal.visible = true
    },
    async handleClick() {
      this.getConditionValue.children.forEach(p2 => {
        p2.children.forEach(p3 => {
          p3.children.forEach(p4 => {
            if (p4.selected) {
              if (p4.type === 'province-city-region-select') {
                p4.names = p4.selected.filter(x => x).map(x => x.name)
              }
              delete p4.selected
            }
          })
        })
      })
      const { data } = await this.$crm.$api.userGroup.searchMemberNum({
        conditionValue: JSON.stringify(this.getConditionValue)
      })

      this.count = data
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-group-filter {
  display: inline-block;
  font-size: 14px;
  color: rgba(69,90,100,1);
  line-height:20px;
  line-height: 20px;
  .count {
    color:rgba(239,83,81,1);
    font-weight: 500;
  }
}
</style>

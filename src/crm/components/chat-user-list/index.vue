<template>
  <div class="chat-user-list">
    <div class="first-item">
      <el-popover
        placement="bottom"
        width="220"
        trigger="click"
      >
        <el-scrollbar wrap-class="menu1-wrap2" style="height:200px">
          <div
            v-for="(item, index) in searchList"
            :key="index"
            name="chooseUser"
            class="item item-flex"
            @click="chooseUser(item)"
          >
            <el-image
              :src="item.avatar"
              fit="fill"
              style="width: 32px; height: 32px; border-radius: 2px;"/>
            <span class="alias-name">{{ item.chatroomId ? item.groupName : (item.remark ? item.remark : item.nickname) }}</span>
          </div>
        </el-scrollbar>
        <el-input slot="reference" v-model="userName" :placeholder="$t('搜索好友，群组，公众号粉丝')" name="userName" prefix-icon="el-icon-search" style="border-radius: 10px"/>
      </el-popover>
    </div>
    <el-scrollbar wrap-class="menu1-wrap2" style="height:100%">
      <div
        v-for="(item, index) in list"
        :key="index"
        :class="{active: index === innerChooseIndex}"
        name="changeUser"
        class="item item-flex"
        @click="changeUser(index)">
        <el-image
          :src="item.avatar"
          fit="fill"
          style="width: 32px; height: 32px; border-radius: 2px;"/>
        <span class="alias-name">{{ item.chatroomId ? item.groupName : (item.remark ? item.remark : item.nickname) }}</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      default: () => {}
    },
    chooseIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      innerChooseIndex: this.chooseIndex,
      userName: '',
      searchList: []
    }
  },
  watch: {
    list: {
      handler(val) {
        this.searchList = val
      },
      deep: true,
      immediate: true
    },
    chooseIndex(val) {
      this.innerChooseIndex = val
    },
    userName(val) {
      if (val !== '') {
        const newList = []
        this.list.map(item => {
          if ((item.groupName && item.groupName.indexOf(val) > -1) || (item.nickname && (item.nickname.indexOf(val) > -1) || (item.remark && item.remark.indexOf(val) > -1))) {
            newList.push(item)
          }
        })
        this.searchList = newList
      } else {
        this.searchList = this.list
      }
    }
  },

  methods: {
    changeUser(index) {
      this.$emit('update:chooseIndex', index)
    },
    chooseUser(item) {
      const index = this.list.findIndex(row => row.id === item.id)
      this.changeUser(index)
      this.userName = ''
      document.body.click()
    }
  }

}
</script>

<style lang="less" scoped>
/deep/.el-input__inner{
  border-radius: 16px;
  background: #F8F8F8;
  font-size: 12px;
}
.chat-user-list {
  height: 100%;
  position: relative;
  padding-top: 48px;
  background: #ffffff;
  .first-item {
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    height: 48px;
    font-size: 14px;
    border-bottom: 1px solid #eeeeee;
    padding: 8px 10px;
  }
  .active {
    position: relative;
    background: #F4F4F4;
  }
}
.item {
    padding-left: 16px;
    height: 48px;
    line-height: 48px;
    color: #333;
    font-weight: 600;
    font-size: 12px;
    border-bottom: 1px solid #eeeeee;
  }
  .item-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    .alias-name {
      flex: 1;
      margin-left: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>

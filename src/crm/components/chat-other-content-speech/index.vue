<template>
  <div class="chat-speech">
    <div class="status">
      <span :class="{active: status === 1}" name="changeStatus" @click="changeStatus(1)">{{ $t('系统话术') }}</span>
      <span :class="{active: status === 2}" name="changeStatus6" @click="changeStatus(2)">{{ $t('个人话术') }}</span>
    </div>
    <div class="search">
      <el-input
        v-model="title"
        :placeholder="$t('请输入关键字')"
        name="title"
        class="input"
        prefix-icon="el-icon-search"
        @keyup.enter.native="search"/>
    </div>
    <div v-if="status===1" :style="{height: status === 1 ? '426px' : '380px'}" class="list">
      <div v-infinite-scroll="load" :infinite-scroll-distance="100" infinite-scroll-disabled="disabled" class="scroll">
        <div v-for="(val, key) in list" :key="val" class="list-item">
          <div name="val_flag" class="list-item-first" @click="val.flag = !val.flag">
            <i :class="{'el-icon-arrow-right': !val.flag, 'el-icon-arrow-down': val.flag}"/>
            {{ key }}
          </div>
          <div v-if="val.flag">
            <div v-for="item in val.data" :key="item.id" class="list-inner-item" >
              <div class="dot-box">
                <i class="dot"/>
              </div>
              <span name="clickContent" class="list-inner-item-content" @click="clickContent(item.content)">
                {{ item.content }}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-else :style="{height: status === 1 ? '434px' : '380px'}" class="list">
      <div v-infinite-scroll="load" :infinite-scroll-distance="100" infinite-scroll-disabled="disabled" class="scroll">
        <div v-for="item in list" :key="item" class="list-item">
          <div class="list-inner-item">
            <div class="dot-box">
              <i class="dot"/>
            </div>
            <span name="clickContent5" class="list-inner-item-content" @click="clickContent(item.content)">
              <el-popover
                :content="item.content"
                placement="left"
                width="200"
                trigger="hover">
                <span slot="reference">{{ item.title }}</span>
              </el-popover>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="status===2" class="btn">
      <ody-button name="ChatGroupManage_AddTalkSkill_visible" code="ChatGroupManage_AddTalkSkill" size="small" @click="visible = true">{{ $t('新建话术') }}</ody-button>
    </div>
    <ody-dialog
      :visible.sync="visible"
      :title="$t('新建话术')"
      width="500px"
      append-to-body
    >
      <div class="dialog-content">
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item :label="$t('话术标题')" label-width="80px" prop="title">
            <el-input v-model="form.title" name="form_title" maxlength="60"/>
          </el-form-item>
          <el-form-item :label="$t('话术内容')" label-width="80px" prop="content">
            <el-input
              v-model="form.content"
              :rows="4"
              :placeholder="$t('请输入内容')"
              name="form_content"
              type="textarea"
              maxlength="200"
              show-word-limit/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <div class="line-top"/>
        <el-button name="hideDialog" size="small" @click="hideDialog">取 消</el-button>
        <el-button name="addGuideTalkSkill" type="primary" size="small" @click="addGuideTalkSkill">{{ $t('确定') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      status: 1,
      title: '',
      count: 10,
      wechatApi: this.$crm.$api.wechat,
      currentIndex: 1,
      isEnd: false,
      list: [],
      loading: false,
      visible: false,
      form: {
        title: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入话术标题', trigger: ['blur', 'change'] }],
        content: [{ required: true, message: '请输入话术内容', trigger: ['blur', 'change'] }]
      }
    }
  },
  computed: {
    disabled() {
      return this.loading || this.isEnd
    }
  },
  methods: {
    clickContent(content) {
      this.$emit('setContent', content)
    },
    search() {
      this.list = []
      this.currentIndex = 1
      this.getList()
    },
    getList() {
      const params = {
        limit: 99999,
        page: this.currentIndex,
        filters: {
          type: this.status === 1 ? 0 : 1
        }
      }
      if (this.status === 1) {
        params.filters.content = this.title
      } else {
        params.filters.title = this.title
      }

      this.wechatApi.getTalkListPage(params).then(res => {
        this.isEnd = true
        this.loading = false
        if (this.status === 1) {
          this.list = res.data.reduce((result, item) => {
            if (result[item.categoryName]) {
              result[item.categoryName].data = [...result[item.categoryName].data, ...[item]]
            } else {
              result[item.categoryName] = { flag: false, data: [...[item]] }
            }
            return result
          }, {})
        } else {
          this.list = [...this.list, ...res.data]
        }
      })
    },
    hideDialog() {
      this.visible = false
    },
    addGuideTalkSkill() {
      this.$refs['ruleForm'].validate((res) => {
        if (res) {
          const params = {
            type: 1,
            title: this.form.title,
            content: this.form.content
          }
          this.wechatApi.guideTalkSkill(params).then(res => {
            this.hideDialog()
            this.changeStatus(2)
          })
        }
      })
    },
    load() {
      this.loading = true
      this.getList()
    },
    changeStatus(val) {
      this.status = val
      this.currentIndex = 1
      this.list = []
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
  .chat-speech {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 16px;
    font-size: 12px;
    .status {
      margin: 16px 0 16px 14px;
      display: flex;
      span{
        font-size: 12px;
        width: 70px;
        height: 28px;
        line-height: 28px;
        border: 1px solid #e5e5e5;
        text-align: center;
        cursor: pointer;
      }
      span:last-of-type{
        border-left: none;
      }
      .active{
        color: #1890FF;
        border: 1px solid #1890FF !important;
      }
    }
    .search {
      margin-bottom: 14px;
      .input {
        font-size: 12px;
      }
    }
    .btn {

      display: flex;
      justify-content: center;
      margin-top: 12px;
    }
    .list {
      height: 434px;
      .scroll {
        height: 100%;
        overflow: auto;
      }
    }
    .list-item {
      .list-item-first {
        cursor: pointer;
        color: #1890FF;
        margin: 8px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list-inner-item {
        cursor: pointer;
        display: flex;
        .dot-box {
          width: 15px;
          padding-left: 2px;
        }
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #333;
          border-radius: 50%;
        }
        .list-inner-item-content {
            margin-bottom: 6px;
            flex: 1;
            max-height: 26px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
      }
    }
  }
</style>

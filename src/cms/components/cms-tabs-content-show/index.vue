<template>
  <div class="cp-tab-content-show">
    <div class="content">
      <div v-if="formData.model.tabMode == 1" class="one-page">
        <div v-for="(tabs, index) in value" :key="index" class="itemValue">
          <div class="title">
            <span>{{ $t("页签标题") }}：</span>
            <el-input
              v-model="tabs.title"
              :placeholder="tabs.title"
              name="tabs_title"
              style="width:70%;"
              maxlength= "8"
              show-word-limit
            />
            <span
              v-show="index != 0"
              name="deleteItem"
              class="delete"
              @click="deleteItem(index)"
            >{{ $t("删除") }}</span
            >
          </div>
          <cms-link-url
            v-model="tabs.link"
            :page-model="pageModel"
            :page-type="pageType"
            name="tabs_link"
          />
          <div class="defaultChoose">
            <el-form-item :label="$t('选中当前标签:')">
              <el-radio v-model="defaultTab" :label="index" name="defaultTab">{{
                $t("选中")
              }}</el-radio>
            </el-form-item>
          </div>
        </div>
      </div>
      <div v-if="formData.model.tabMode == 2" class="branch-page">
        <div>
          <div class="title">
            <span>{{ $t("交互方式") }}：</span>
            <!-- {{ formData.model.tabInteractive }} -->
            <el-radio-group
              v-model="formData.model.tabInteractive"
              name="formData_model_tabInteractive"
              style="margin-top: 8px;"
            >
              <el-radio :label="1">{{ $t('标签模块') }}</el-radio>
              <el-radio :label="2">{{ $t('锚点定位') }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-for="(items, index) in value" :key="index">
          <div class="title">
            <span>{{ $t("页签标题") }}：</span>
            <el-input
              v-model="items.title"
              :placeholder="items.title"
              name="items_title"
              style="width:70%;"
            />
            <span
              v-show="index != 0"
              name="deleteItem7"
              class="delete"
              @click="deleteItem(index)"
            >{{ $t("删除") }}</span
            >
          </div>
          <div class="column-tabs">
            <div class="column-tabs-link">
              <div class="branch-column">
                <span>关联栏目：</span>
                <el-button
                  name="handleShowDialog"
                  type="text"
                  @click="handleShowDialog(index)"
                >{{ $t("选择关联的栏目 已选") }}{{ items.modules.length
                }}{{ $t("个") }}</el-button
                >
              </div>
              <cms-tabs-link-column
                v-if="chooseTabsVisible"
                :exclude-id="moduleId"
                :page-id="pageId"
                :visible.sync="chooseTabsVisible"
                :form-data="formData"
                :update-module="updateModule"
                @ok="handleTabsLinkColumnOk"
              />
            </div>
            <div class="column-tabs-content">
              <div class="item-branch-column">
                <div
                  v-for="(list, k) in items.modules"
                  :key="k"
                  class="contact-column"
                >
                  <div class="column-name">{{ list.name }}</div>
                  <div class="opration-wrapper">
                    <span v-if="k === 0" class="up-disable" />
                    <span v-else name="up" class="up" @click="up(index, k)" />
                    <span
                      v-if="k === items.modules.length - 1"
                      class="down-disable"
                    />
                    <span
                      v-else
                      name="down"
                      class="down"
                      @click="down(index, k)"
                    />
                    <span
                      name="deleteConcatColumn"
                      class="deleteColumn"
                      @click="deleteConcatColumn(list, k, index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-button name="addItem" plain class="slider-add-btn" @click="addItem">
      {{ $t("添加") }}
      <i class="el-icon-plus" />
    </el-button>
  </div>
</template>
<script>
import cmsLinkUrl from '@/components/cms-link-url'
import cmsTabsLinkColumn from '@/components/cms-tabs-link-column'

export default {
  components: {
    cmsLinkUrl,
    cmsTabsLinkColumn
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    },
    pageId: {
      type: String,
      default: ''
    },
    updateModule: {
      type: Function,
      default: () => {}
    },
    h5Iphone: {
      type: Array,
      default: () => []
    },
    pageModel: {
      type: Object,
      default: () => ({ model: {}})
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultTab: 0,
      currentTab: 0,
      chooseTabsVisible: false,
      moduleId: this.formData.id,
      num: 0,
      chooseIndex: 0
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    },
    'formData.model.tabMode': {
      async handler(val, oldVal) {
        // console.log('formData.model.tabMode', val, oldVal, val === oldVal)
        this.tabMode = val

        // 切换的清除tabs 关联的栏目
        const idList = this.value.reduce((rtv, tab) => {
          const ids = (tab.modules && tab.modules.map(x => x.id)) || []

          rtv = [...rtv, ...ids]

          return rtv
        }, [])

        if (idList && idList.length) {
          const params = {
            idList,
            renderType: 0
          }
          await this.$cms.$api.cmsEdit.updateByIdList(params)
        }

        this.value = [
          {
            id: this.formData.id + '-0',
            title: this.$t('页签标题1'),
            link: {},
            modules: []
          }
        ]
        if (this.formData.id) {
          this.updateModule(this.formData)
        }
      }
    },
    defaultTab: {
      handler(val) {
        // console.log('val', val)
        this.formData.model.defaultTab = val
        this.formData.model.currentTab = val
      },
      deep: true
    },
    num: {
      handler(val) {
        this.num = val
      },
      deep: true
    }
  },

  mounted() {
    if (this.value.length <= 0) {
      if (!this.formData.id) {
        return
      }
      const valueItem = {
        id: this.formData.id + '-0',
        title: this.$t('页签标题1'),
        link: {},
        modules: []
      }
      this.value.push(valueItem)
      this.updateModule(this.formData)
    }
    if (this.formData.model.tabMode === 2) {
      const usedIdMap = this.h5Iphone.list.reduce((rtv, item) => {
        rtv[item.id] = true
        return rtv
      }, {})
      // 过滤下只有外面可用的id才展示

      this.value.forEach(item => {
        if (item.modules && item.modules.length) {
          item.modules = item.modules.filter(x => usedIdMap[x.id])
        }
      })

      // console.log('this.value', this.value)
    }
  },
  methods: {
    addItem() {
      const id = this.value.map(item => {
        const { 1: idIndex } = item.id.split('-')

        return parseInt(idIndex, 10)
      })
      const maxId = Math.max(...id) + 1

      const valueItem = {
        id: this.formData.id + '-' + maxId,
        title: this.$t('页签标题') + (maxId + 1),
        link: {},
        modules: []
      }
      this.value.push(valueItem)
      this.updateModule(this.formData)
    },
    async deleteItem(index) {
      const tabsList = []
      if (this.value[index].modules && this.value[index].modules.length > 0) {
        this.value[index].modules.forEach(item => {
          if (item.id) {
            tabsList.push(item.id)
          }
        })
      }
      await this.$cms.$api.cmsEdit.updateByIdList({
        idList: tabsList,
        renderType: 0
      })
      this.value.splice(index, 1)
      this.defaultTab = 0
      this.updateModule(this.formData)
    },
    // 删除关联的栏目
    async deleteConcatColumn(list, k, index) {
      const arr = []
      arr.push(list.id.toString())
      const params = {
        idList: arr,
        renderType: 0
      }
      await this.$cms.$api.cmsEdit.updateByIdList(params)
      this.value[index].modules.splice(k, 1)
    },

    // 展示关联栏目弹窗
    handleShowDialog(index) {
      this.chooseTabsVisible = true
      this.chooseIndex = index
    },
    async handleTabsLinkColumnOk(val) {
      this.value[this.chooseIndex].modules = [
        ...val,
        ...this.value[this.chooseIndex].modules
      ]

      this.updateModule(this.formData)

      // const idList = val.map(item => item.id)
      // const params = {
      //   idList,
      //   renderType: 1
      // }
      // Promise.all([
      //   await this.$cms.$api.cmsEdit.updateByIdList(params),
      //   await this.updateModule(this.formData)
      // ])

      // eventBus.$emit('CmsGetPageInfo')
    },
    // 下移
    down(index, k) {
      var modules = this.value[index].modules;
      [modules[k + 1], modules[k]] = [modules[k], modules[k + 1]]
      this.$forceUpdate()
    },
    // 上移
    up(index, k) {
      var modules = this.value[index].modules;
      [modules[k], modules[k - 1]] = [modules[k - 1], modules[k]]
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="scss" scoped>
.cp-tab-content-show {
  position: relative;
  .slider-add-btn {
    width: 100%;
    border: 0.01rem dashed #eee;
    margin-top: 0.1rem;
    color: #666;
  }
  .itemValue {
    border-bottom: 0.01rem dashed #eee;
    margin-top: 0.15rem;
  }
  .title {
    width: 100%;
    display: flex;
    margin-bottom: 0.15rem;
  }
  .delete {
    color: #1890ff;
    font-size: 0.12rem;
    margin-left: 0.12rem;
  }
  .title:before {
    content: "*";
    color: #ef5251;
    margin-right: 0.04rem;
  }
  .el-input-medium {
    width: 3rem;
  }
  .defaultChoose {
    margin-top: 0.15rem;
  }
  .contact-column {
    border: 0.01rem solid #ced4da;
    height: 0.3rem;
    padding: 0 0.06rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.16rem;
    .opration-wrapper {
      display: flex;
      .up-disable {
        background: url("../../img/up-disable.png") no-repeat center center;
        background-size: 100%;
        height: 0.16rem;
        width: 0.14rem;
        flex: 1;
        cursor: pointer;
        padding: 0 0.06rem;
        margin: 0 0.04rem;
      }
      .up {
        background: url("../../img/up.png") no-repeat center center;
        background-size: 100%;
        height: 0.16rem;
        width: 0.14rem;
        flex: 1;
        cursor: pointer;
        padding: 0 0.06rem;
        margin: 0 0.04rem;
      }
      .down-disable {
        background: url("../../img/down-disable.png") no-repeat center center;
        background-size: 100%;
        height: 0.16rem;
        width: 0.14rem;
        flex: 1;
        cursor: pointer;
        padding: 0 0.06rem;
        margin: 0 0.04rem;
      }
      .down {
        background: url("../../img/down.png") no-repeat center center;
        background-size: 100%;
        height: 0.16rem;
        width: 0.14rem;
        flex: 1;
        cursor: pointer;
        padding: 0 0.06rem;
        margin: 0 0.04rem;
      }
      .deleteColumn {
        background: url("../../img/delete.png") no-repeat center center;
        background-size: 100%;
        height: 0.16rem;
        width: 0.14rem;
        flex: 1;
        cursor: pointer;
        padding: 0 0.06rem;
        margin: 0 0.04rem;
      }
    }
  }
}
</style>

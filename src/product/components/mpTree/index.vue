<template>
  <div>
    <div style="width: 800px;">
      <el-row>
        <el-col :span="3" style="margin-top: 7px;"><span style="color: red">*</span><span>{{ $t('商家类目') }}</span></el-col>
        <el-col :span="15">
          <el-select v-model="searchText" :placeholder="$t('请选择')" name="searchText" clearable filterable style="width: 100%" @clear="clear">
            <el-option
              v-for="item in searchList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="3" style="margin-left: 30px;"><el-button name="searchAll" size="small" type="primary" @click="searchAll">{{ $t('查找类目') }}</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="2" style="margin-top: 7px;margin-left: 5px"><span>{{ $t('最近使用') }}</span></el-col>
        <el-col :span="15">
          <div style="margin-top: 7px;margin-left: 10px">
            <a v-for="item in recentlist" :key="item" style="margin-left: 15px;color: blue">{{ item.label }}</a>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="float: left;border:1px solid #A9A9A9;margin-left: 5px;padding: 20px;backgroundColor: white;margin-top: 20px">
      <div>
        <div v-show="beforeList.length > 0" name="before" style="float: left;font-size: 30px;margin-top: 160px;" @click="before">
          <i class="el-icon-caret-left"/>
        </div>
        <div v-for="(element) in showData" v-show="element.show" :key="element.id" style="float: left;border:1px solid #A9A9A9;margin-left: 5px;padding: 5px;backgroundColor: white;height:400px">
          <el-input
            v-model="element.filterText"
            :placeholder="$t('输入关键字进行过滤')"
            name="element_filterText"
            style="width:200px"
            @input="search(element)"/>
          <el-tree
            ref="tree"
            :data="element.newData"
            :props="defaultProps"
            name="element_newData461"
            default-expand-all
            style="width:200px"
            @node-click="nodeClick">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span v-if="data.length > 0" class="el-tree-node__expand-icon el-icon-caret-right"/>
            </span>
          </el-tree>
        </div>
        <div v-show="afterList.length > 0" name="after" style="float: left;font-size: 30px;margin-top: 160px;" @click="after">
          <i class="el-icon-caret-right"/>
        </div>
      </div>
      <div>
        <el-button size="small" style="margin-left: 240px;margin-top: 20px">{{ $t('取消') }}</el-button>
        <el-button size="small" type="primary">{{ $t('下一步') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recentlist: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      list: [],
      data: [],
      searchText: '',
      searchList: [],
      showData: [],
      beforeList: [],
      afterList: [],
      mapData: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  async mounted() {
    console.log(this.recentList)
    this.mpApi = this.$product.$api.mpApi
    await this.listBackCategory()
    var map = new Map()
    this.buildData(this.list, map)
    this.mapData = map
    this.initData()
    for (var i = 1; i < this.mapData.size; i++) {
      for (var item of this.mapData.get(i)) {
        var obj = {}
        obj.label = getCaption(item.fullNamePath)
        obj.value = item.id
        this.searchList.push(obj)
      }
    }
  },
  methods: {
    clear() {
      this.data = []
      this.showData = []
      this.afterList = []
      this.beforeList = []
      this.initData()
    },
    buildData(list, map) {
      for (var item of list) {
        var obj = {}
        obj.id = item.id
        obj.label = item.label
        obj.parentId = item.parentId
        obj.node = item.level - 1
        obj.fullNamePath = item.fullNamePath
        obj.name = item.name
        if (map.get(item.level - 1)) {
          map.get(item.level - 1).push(obj)
        } else {
          map.set(item.level - 1, [])
          map.get(item.level - 1).push(obj)
        }
        if (item.children) {
          if (item.children.length > 0) {
            obj.length = item.children.length
            this.buildData(item.children, map)
          }
        }
      }
    },
    search(tree) {
      var NewItems = []
      for (var item of tree.data) {
        if (item.label.search(tree.filterText) !== -1) {
          NewItems.push(item)
        }
      }
      tree.newData = NewItems
    },
    searchAll() {
      this.clear()
      let id = this.searchText
      var showList = []
      for (let i = this.mapData.size - 1; i > 0; i--) {
        var obj = {}
        var arr = this.mapData.get(i)
        obj.newData = []
        obj.data = []
        obj.node = i
        obj.show = true
        obj.filterText = ''
        for (const item of arr) {
          if (item.id === id) {
            id = item.parentId
            obj.newData.push(item)
            obj.data.push(item)
            break
          }
        }
        if (obj.newData.length > 0) {
          showList.splice(0, 0, obj)
        }
      }
      if (showList.length > 0) {
        if (showList.length > 2) {
          showList.splice(3, showList.length)
        }
        this.showData = []
        for (const item of showList) {
          var o = {}
          o.filterText = ''
          o.node = item.node
          o.show = true
          o.data = item.data
          o.newData = item.newData
          this.showData.push(o)
        }
        this.data = this.showData
      }
    },
    async listBackCategory() {
      return this.mpApi.listBackCategory().then(
        res => {
          var arr = res.data
          this.list = toTree(arr)
        }
      )
    },
    nodeClick(tree, data) {
      if (tree.length > 0) {
        var obj = {}
        obj.filterText = ''
        obj.node = tree.node + 1
        obj.show = true
        obj.data = []
        for (var item of this.mapData.get(obj.node)) {
          if (item.parentId === tree.id) {
            obj.data.push(item)
          }
        }
        obj.newData = obj.data
        tree.childLength = obj.data.length
        this.data.splice(tree.node, this.data.length - tree.node)
        this.data.push(obj)
        this.afterList.splice(0, this.afterList.length)
      } else {
        this.data.splice(tree.node, this.data.length - tree.node)
        this.afterList.splice(0, this.afterList.length)
      }
      if (this.data.length === 1) {
        const obj = {}
        obj.show = true
        this.data.push(obj)
      }
      if (this.data.length === 2) {
        const obj = {}
        obj.show = true
        this.data.push(obj)
      }
      var index = this.showData[0].node
      this.showData = []
      for (var o of this.data) {
        if (o.node >= index) {
          this.showData.push(o)
        }
      }
      if (this.showData.length === 1) {
        const obj = {}
        obj.show = true
        this.showData.push(obj)
      }
      if (this.showData.length === 2) {
        const obj = {}
        obj.show = true
        this.showData.push(obj)
      }
      if (this.showData.length > 3) {
        for (var val = tree.node; val < this.data.length; val++) {
          let con = 0
          for (var after of this.afterList) {
            if (after.node === this.data[val] || !this.data.node) {
              con++
            }
          }
          if (con === 0) {
            this.afterList.push(this.data[val])
          }
        }
        this.showData.splice(3, this.data.length - 3)
      }
    },
    initData() {
      var obj = {}
      obj.filterText = ''
      obj.node = 1
      obj.show = true
      obj.data = this.mapData.get(1)
      obj.newData = obj.data
      this.data.push(obj)
      if (this.data.length === 1) {
        const obj = {}
        obj.show = true
        this.data.push(obj)
      }
      if (this.data.length === 2) {
        const obj = {}
        obj.show = true
        this.data.push(obj)
      }
      for (var item of this.data) {
        this.showData.push(item)
      }
    },
    before() {
      if (this.showData[this.showData.length - 1].node) {
        this.afterList.splice(0, 0, this.showData[this.showData.length - 1])
      }
      this.showData.splice(0, 0, this.beforeList[this.beforeList.length - 1])
      this.beforeList.splice(this.beforeList.length - 1, 1)
      this.showData.splice(this.showData.length - 1, 1)
    },
    after() {
      this.beforeList.push(this.showData[0])
      this.showData.splice(0, 1)
      this.showData.push(this.afterList[0])
      this.afterList.splice(0, 1)
    }
  }
}
function toTree(data) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item.parentId]
    item.label = item.name
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}
function getCaption(obj) {
  var index = obj.indexOf('\-')
  obj = obj.substring(index + 1, obj.length)
  return obj
}
</script>
<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree__empty-text {
    display: none
  }
</style>

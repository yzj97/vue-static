
### 了解 vue查用的指令

```html
<input v-model="username" />
```

```html
<div v-if="showArea">
    this is show
</div>
<div v-else>
    this is other
</div>
```

```html
<ul>
    <li v-for="(item, index) in list" :key="index">
    	{{item}}
	</li>
</ul>
```

```html
<el-button @click="handleClick"></el-button>
```



### 了解 vue常用的生命周期

| 生命周期      | 解释         | 可做                                |
| ------------- | ------------ | ----------------------------------- |
| mounted       | 页面加载完毕 | 请求接口，绑定自定义事件，注册timer |
| beforeDestroy | 页面消耗前   | 销毁自定义事件，销毁timer           |
|               |              |                                     |

### 了解 vue常用的路由跳转

```html
<router-link :to="{ name: 'OuserWebYyAdd'}">
    <el-button type="primary">添加</el-button>
</router-link>
```

```js
this.$router.push({
    name: 'OuserWebYyEdit',
    params: {
        id: row.id
    }
})
```

怎么获取传递参数

```js
const { id } = this.$route.params
```

### 了解 vue常用的插槽

1. 不带名称插槽

```html
<router-link :to="{ name: 'OuserWebYyAdd'}">
  <el-button type="primary">添加</el-button>
</router-link>
```

   

2. 带名称的插槽

```html
<ody-list-table-area>
  <div slot="btn">
    <el-button type="primary">+ test123</el-button>
  </div>
  <div slot="table">
    <ody-table
      :data="tableData"
      :columns="columns"
    />
  </div>
  <div slot="page">
    <ody-pagination
      :background="true"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      :total="400"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
    </div>
  </ody-list-table-area>
  ```

   

### 了解 element-ui组件

<http://element-cn.eleme.io/#/zh-CN/component/installation>



### 了解 欧电云组件

http://staticportal2d8dev.oudianyun.com

# 公共放到packages下

## 支持公用lang放到 packages下

### 1. 修改pool下main.js

![1568626635314](.\images\1568626635314.png)

### 2. 拷贝当前pool下的lang到 packages/lang 下

en_US 拷贝到 en_US 下

zh_CN 拷贝到 zh_CN 下

### 3. 修改页面使用

#### 3.1 $t的代码

原来的html

```html
<el-select v-model="searchName" @change="searchForm.searchValue = null">
  <el-option :label="$t('oms.delivery_list_no')" value="doCode">{{ $t('oms.delivery_list_no') }}</el-option>
  <el-option :label="$t('oms.orderNumber')" value="orderCode">{{ $t('oms.orderNumber') }}</el-option>
  <el-option :label="$t('oms.channelOrderCode')" value="outOrderCode">{{ $t('oms.channelOrderCode') }}</el-option>
  <el-option :label="$t('oms.consignee_name')" value="goodReceiverName">{{ $t('oms.consignee_name') }}</el-option>
</el-select>
```

需要修改成

```html
<el-select v-model="searchName" @change="searchForm.searchValue = null">
  <el-option :label="$t('delivery_list_no')" value="doCode">{{ $t('delivery_list_no') }}</el-option>
  <el-option :label="$t('orderNumber')" value="orderCode">{{ $t('orderNumber') }}</el-option>
  <el-option :label="$t('channelOrderCode')" value="outOrderCode">{{ $t('channelOrderCode') }}</el-option>
  <el-option :label="$t('consignee_name')" value="goodReceiverName">{{ $t('consignee_name') }}</el-option>
</el-select>
```

#### 3.2 $l的代码

原来的代码

```html
<div class="pg-level-two">
  this is 二级路由
  <h3>
    显示国际化
  </h3>
  {{ $l('sample', 'module_name_test') }}
</div>
```

需要修改成

```html
<div class="pg-level-two">
  this is 二级路由
  <h3>
    显示国际化
  </h3>
  {{ $t('module_name_test') }}
</div>
```





## 支持公用组件放到 packages下

### 1. 创建组件, 例如hello-world

> packages/components/hello-world/index.vue

### 2. 使用组件，所有的静态组件前缀 static 开头

```html
<static-hello-world />
```


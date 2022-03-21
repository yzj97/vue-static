# BatchImportModal 批量导出

## 1. 批量导出

:::demo 批量导出

```html
<template>
  <div>
    <ody-batch-export-button
      :download-api="importModel.downloadApi"
      :import-api="importModel.importApi"
    >
      批量导出
    </ody-batch-export-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      importModel: {
        downloadApi: ['cms', 'cmsEdit', 'customizeProduct', {}],
        importApi: ['cms', 'cmsEdit', 'customizeProduct', {}],
      },
    }
  }
}
</script>
```

:::

## 2. 批量导出 + 本地文件

:::demo 批量导出 + 本地文件

```html
<template>
  <div>
    <ody-batch-export-button
      download-local-file="[require('@/test/test.xls')]"
      :import-api="importModel.importApi"
    >
      批量导出
    </ody-batch-export-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      importModel: {
        importApi: ['cms', 'cmsEdit', 'customizeProduct', {}]
      },
    }
  }
}
</script>
```

:::

## 3. 批量导出 + 修复文案label

:::demo 批量导出 + 修复文案label

```html
<template>
  <div>
    <ody-batch-export-button
      title="打开弹窗的标题"
      download-label="下载模板的文字"
      import-label="导入的文字"
      :download-api="importModel.downloadApi"
      :import-api="importModel.importApi"
    >
      按钮的文字
    </ody-batch-export-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      importModel: {
        downloadApi: ['cms', 'cmsEdit', 'customizeProduct', {}],
        importApi: ['cms', 'cmsEdit', 'customizeProduct', {}],
      },
    }
  }
}
</script>
```

:::


## 4. 批量导出 + 导入事件

:::demo 批量导出 + 导入事件

```html
<template>
  <div>
    <ody-batch-export-button
      download-local-file="[require('@/test/test.xls')]"
      @ok="handleImportModelOk"
      @close="handleImportModelClose"
    >
      批量导出
    </ody-batch-export-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      importModel: {
        importApi: ['cms', 'cmsEdit', 'customizeProduct', {}],
      },
    }
  },
  methods: {
    handleImportModelOk() {
      console.log('ok')
    },
    handleImportModelClose() {
      console.log('close')
    }
  }
}
</script>
```

:::

### Attributes

| 参数     | 说明               | 类型   | 必填  | 可选值 | 默认值 |
| -------- | ------------------ | ------ | ----- | ------ | ------ |
| title  | 弹窗的标题 | String | false  | —      | 批量导出      |
| downloadLabel  | 下载模板 | String | false  | —      | 下载模板      |
| importLabel  | 导入的文字 | String | false  | —      | 导入      |
| importApi     | 导入[poolName, fileName, methodName, params] | Array | true  | —      | []      |
| downloadLocalFile | 是否本地下载模板[filePath, downloadName], 优先加载，没有再加载downloadApi     | Array  | false | —      | false      |
| downloadApi     | 下载[poolName, fileName, methodName, params] | Array | true  | —      | []      |

### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| close | 关闭弹窗 | —        |
| ok     | 导入成功 | —        |

### Slot

|    Name     |                                             Description                                              |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| -      | 默认属性                                                                                       |
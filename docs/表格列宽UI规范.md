## 表格列宽 minWidth 值

长字段: 200
中字段: 124 (组件里配置了默认中字段 minWidth:124 )
短字段: 88

例：

```js
export default {
  {
    label: this.$t('审批流ID'),
    prop: 'id',
    show: true,
    minWidth: 200,
    // minWidth: 124, (组件里配置了不写 minWidth ,默认 minWidth:124 )
    // minWidth: 88,
  }
}
```



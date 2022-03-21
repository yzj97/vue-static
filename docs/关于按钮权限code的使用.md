#### ody-btn按钮

```html
<ody-button type="primary" size="mini" @click="handleClick" code="123456">我是传递code的</ody-button>
```

#### ody-table标签中的操作按钮

```javascript
<ody-table
    :data="tableData"
    :columns="columns"
    :operates="operates"
  />
// vue 中的data中
operates: {
  width: 150,
  fixed: 'right',
  list: [
    {
      label: '编辑',
      method: (index, row) => {
        this.$router.push({ path: '/ouser-web/roleEdit/' + row.id })
      },
      code: '1111111'
    },
    {
      label: '删除',
      method: (index, row) => {
        this.deleteRole(row)
      },
      code: '222222222'
    }
  ]
}
```

#### 其他非控组件的操作按钮

```html
<my-button v-if="!$portal.hasPermission('30OU0115')"></my-button>
```


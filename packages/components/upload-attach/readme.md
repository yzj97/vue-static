## Upload-attach

上传附件

:::demo 加载常量

```html
<template>
  <div>
     <ody-upload-attach v-model="value" objectType="3" objectCode="SH1911040000151475"/>
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ''
    }
  }
}
</script>
```

:::
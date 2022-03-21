<!--
 * @Author: your name
 * @Date: 2021-08-10 19:14:59
 * @LastEditTime: 2021-09-03 15:12:06
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vue-static/src/crm/views/member/list/detail/index.vue
-->
<template>
  <member-list-detail :auth-enable="false"/>
</template>

<script>
import MemberListDetail from '@/components/member-list-detail'

export default {
  name: 'OuserCenterMemberDetails',
  components: {
    MemberListDetail
  }
}
</script>

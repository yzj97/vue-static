<template>
  <section>
    <ody-list-search-area style="height:110px">
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('分组名称')">:
            <span>{{ searchForm.groupName }}</span>
          </ody-search-item>
          <ody-search-item :label="$t('所属分类')">:
            <span>{{ searchForm.userClassifyName }}</span>
          </ody-search-item>
          <ody-search-item :label="$t('当前筛选')">:
            <span>{{ searchForm.memberNum }}</span>人
            <ody-button :disabled="+ searchForm.groupType === 1" name="userGroupRefresh_refresh" code="userGroupRefresh" size="small" @click="refresh">{{ $t('刷新') }}</ody-button>
          </ody-search-item>
        </el-form>
      </div>
    </ody-list-search-area>
    <crm-group-member-list :user-group-id="searchForm.id" :group-type="searchForm.groupType"/>
  </section>
</template>

<script>
import CrmGroupMemberList from '@/components/group-member-list'

export default {
  name: 'CrmUserList',
  components: {
    CrmGroupMemberList
  },
  data() {
    const { id, groupName, memberNum, userClassifyName, groupType } = this.$route.query

    return {
      getByIdUrl: '/crm-web/userGroup/get/',
      searchForm: {
        id,
        groupName,
        memberNum,
        userClassifyName,
        groupType
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async refresh() {
      const res = await this.$crm.$api.userGroup.refresh({ 'id': this.searchForm.id })
      if (res.code !== '0') {
        this.$message({
          message: res.message,
          type: 'error'
        })
      } else {
        this.$portal.get(`${this.getByIdUrl}${this.searchForm.id}`).then(res => {
          if (+res.code === 0) {
            this.searchForm.memberNum = res.data.memberNum
          }
        })
        this.$message({
          message: this.$t('刷新成功'),
          type: 'success'
        })
      }
    },
    init() {
    }
  }
}
</script>

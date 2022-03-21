<template>
  <div class="">
    <ody-choose
      v-if="visible"
      :visible="visible"
      :search-config="choose.searchConfig"
      :search-value="choose.searchValue"
      :search-format="searchFormat"
      :columns="choose.columns"
      :title="$t('查看会员')"
      :hide-confirm="true"
      request-url="/crm-web/staticUserGroup/listPage"
      request-page-type="page"
      @close="handleClose"
      @getTableList="hanleGetTableList"
    >
      <template slot="guide" slot-scope="scope">
        <span v-if="guideUserMap[scope.row.userId].guideIdentityCardName">
          <sapn>
            {{ guideUserMap[scope.row.userId].guideIdentityCardName }}
          </sapn>
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              <div>
                <span>{{ $t('导购员：') }}</span>
                <span>
                  {{ guideUserMap[scope.row.userId].guideIdentityCardName }}
                </span>
                <br >
                <span>{{ $t('导购员ID：') }}</span>
                <span>
                  {{ guideUserMap[scope.row.userId].uEmployeeId }}
                </span>
                <br >
              </div>
            </div>
            <i class="el-icon-user"/>
          </el-tooltip>
        </span>
        <span v-else>
          --
        </span>
      </template>
    </ody-choose>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    conditionValue: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      choose: {
        searchConfig: [
          {
            label: this.$t('会员手机号'),
            prop: 'mobile',
            type: 'input'
          },
          {
            label: this.$t('会员昵称'),
            prop: 'nickname',
            type: 'input'
          }
        ],
        searchValue: {
          mobile: null,
          nickname: null
        },
        requestUrl: ``,
        columns: [
          {
            show: true,
            prop: 'mobile',
            label: this.$t('membership_account'),
            align: 'center',
            minWidth: 120
          },
          {
            show: true,
            prop: 'nickname',
            label: this.$t('member_nickname'),
            align: 'center',
            minWidth: 140
          },
          {
            show: true,
            prop: 'mobile',
            label: this.$t('cell_phone_number'),
            align: 'center',
            minWidth: 120
          },
          {
            show: true,
            prop: 'typeName',
            label: this.$t('member_type'),
            align: 'center',
            minWidth: 100
          },
          {
            show: true,
            prop: 'levelName',
            label: this.$t('membership_grade'),
            align: 'center',
            minWidth: 100
          },
          {
            show: true,
            label: this.$t('sales_assistant'),
            align: 'center',
            minWidth: 140,
            tooltip: false,
            slot: 'guide'
          },
          {
            show: true,
            prop: 'registrationDateTime',
            label: this.$t('registration_time'),
            align: 'center',
            minWidth: 160
          }
        ]
      },
      guideUserMap: {}
    }
  },
  methods: {
    async hanleGetTableList(list) {
      if (list === null || list.length === 0) {
        return
      }
      const userIds = list.map(x => x.userId)

      const { data: guide } = await this.$crm.$api.staticUserGroup.queryUserGuideInfoList({
        userIds: userIds
      })

      this.guideUserMap = (guide || []).reduce((rtv, item) => {
        rtv[item.userId] = item
        return rtv
      }, {})
    },
    searchFormat(params) {
      return {
        filters: {
          conditionValue: JSON.stringify(this.conditionValue),
          ...params
        }
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

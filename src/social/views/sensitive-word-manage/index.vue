<template>
  <div class="">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" class="form" @submit.native.prevent>
          <ody-search-item :label="$t('敏感词')+':'" prop="word">
            <el-input v-model="search.word" :placeholder="$t('Enter后即可搜索')" name="search_word" @keyup.enter.native="handleSearchQuery"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
        <ody-button name="SocialSensitiveWordManageList_handleSearchQuery" code="SocialSensitiveWordManageList" size="small" type="primary" @click="handleSearchQuery">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          name="list442"
        >
          <template slot="labelStandardSensitiveWords">
            <div>
              {{ $t('标准敏感词') }}
              <el-tooltip class="item" effect="light" placement="bottom-end">
                <i class="el-icon-info"/>
                <div slot="content">
                  {{ $t('说明：敏感词用分号隔开') }}
                </div>
              </el-tooltip>
            </div>
          </template>
          <template slot="labelCustomSensitiveWords">
            <div>
              {{ $t('自定义敏感词') }}
              <el-tooltip class="item" effect="light" placement="bottom-end">
                <i class="el-icon-info"/>
                <div slot="content">
                  {{ $t('说明：敏感词用分号隔开') }}
                </div>
              </el-tooltip>
            </div>
          </template>
          <template slot="standardSensitiveWords" slot-scope="scope">
            <el-row v-for="item in scope.row.standardSensitiveWords" :key="item.i">
              <div style="margin-top: 15px" class="fix-button">
                <el-input
                  v-model="item.word"
                  :rows="5"
                  name="item_word"
                  type="textarea"
                  maxlength="6000"
                  show-word-limit
                  style="width: 400px"
                />
                <ody-button name="SocialSensitiveWordManageAdd_saveData" code="SocialSensitiveWordManageAdd" size="small" type="primary" class="fix-button-btn" @click="saveData(item.id, item.word)">{{ $t('保存') }}</ody-button>
              </div>
            </el-row>
          </template>
          <template slot="customSensitiveWords" slot-scope="scope">
            <el-row v-for="item in scope.row.customSensitiveWords" :key="item.i">
              <div style="margin-top: 15px" class="fix-button">
                <el-input
                  v-model="item.word"
                  :rows="5"
                  name="item_word1"
                  type="textarea"
                  style="width: 400px"
                  maxlength="6000"
                  show-word-limit
                />
                <ody-button name="SocialSensitiveWordManageAdd_saveData9" code="SocialSensitiveWordManageAdd" size="small" type="primary" class="fix-button-btn" @click="saveData(item.id, item.word)">{{ $t('保存') }}</ody-button>
              </div>
            </el-row>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>
export default {
  name: 'SocialSensitiveWordManage',
  data() {
    return {
      loading: false,
      search: {},
      list: [],
      columns: [
        {
          label: this.$t('敏感词分类'),
          prop: 'category',
          show: true,
          align: 'center'
        },
        {
          labelSlot: 'labelStandardSensitiveWords',
          slot: 'standardSensitiveWords',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          labelSlot: 'labelCustomSensitiveWords',
          slot: 'customSensitiveWords',
          show: true,
          align: 'center',
          minWidth: 200
        }
      ],
      sensitiveWordsMap: {}
    }
  },
  async mounted() {
    this.initCode()
    try {
      this.socialApi = this.$social.$api.socialApi
      this.loading = true
      await this.handleSearchQuery()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    initCode() {
      this.$social.$api.common.listMultiCode({
        categories: [
          'TYPES_OF_SENSITIVE_WORDS'
        ]
      }).then(res => {
        this.sensitiveWordsMap = res.data.TYPES_OF_SENSITIVE_WORDS.reduce((m, i) => { m[+i.code] = i.name; return m }, {})
      })
    },
    saveData(id, word) {
      const param = {
        id: id,
        word: word
      }
      this.socialApi.updateSensitiveWord(param).then(
        res => {
          if (res.code === '0') {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.query()
          }
        }
      )
    },
    handleSearchReset() {
      this.search = {}
    },
    async query() {
      this.socialApi.getSensitiveWord(this.search).then(
        res => {
          const resultList = res.data.sensitiveWordList
          resultList.forEach(item => {
            item.category = this.sensitiveWordsMap[item.category]
            const standardSensitiveWords = []
            const customSensitiveWords = []
            item.sensitiveWordList.forEach(word => {
              if (word.standard === 1) {
                standardSensitiveWords.push(word)
              } else if (word.standard === 0) {
                customSensitiveWords.push(word)
              }
            })
            item.standardSensitiveWords = standardSensitiveWords
            item.customSensitiveWords = customSensitiveWords
          })
          this.list = resultList
        }
      )
    },
    async handleSearchQuery() {
      const [err] = await this.formValidate('search')
      if (err) {
        console.error('error submit!!')
        return false
      }
      await this.query()
    }
  }
}
</script>

<style scoped lang="scss">
.fix-button{
  display: flex;
  align-items: flex-end;
  .fix-button-btn{
    flex: 0 0 64px;
    margin-left: 3px;
  }
}
</style>

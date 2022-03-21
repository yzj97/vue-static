<template>
  <div class="pg-cms-tempalte-list">
    <ody-box :title="$t('选择模板')">
      <el-tabs v-model="activeName" name="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('手机端')" name="2">
          <div class="list">
            <!-- this is cms tempalte list -->
            <div name="handleCreate" class="item" @click="handleCreate({}, activeName)">
              <div class="item__img blank">
                <div class="blank__icon"/>
                <div class="blank__title">
                  {{ $t('使用空白模板') }}
                </div>
              </div>
              <div class="item__title">
                {{ $t('使用空白模板') }}
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('pc端')" name="1">
          <div class="list">
            <!-- this is cms tempalte list -->
            <div name="handleCreate" class="item" @click="handleCreate({}, activeName)">
              <div class="item__img blank">
                <div class="blank__icon"/>
                <div class="blank__title">
                  {{ $t('使用空白模板') }}
                </div>
              </div>
              <div class="item__title">
                {{ $t('使用空白模板') }}
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeName: '2'
    }
  },
  methods: {
    async handleCreate(item, platform = 2) {
      let id = item.id
      if (!item.id) {
        const res = await this.$cms.$api.cmsEdit.addCmsTemplate({
          platform,
          pageType: 1
        })
        id = res.data.id
      }
      const nameMap = {
        2: 'CmsH5Edit',
        1: 'CmsPcEdit'
      }
      this.$router.push({
        name: nameMap[platform],
        params: {
          templateId: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-cms-tempalte-list {
  .list {
    &::after {
      content: '';
      clear: both;
      display: table;
    }
    .item {
      width: 180px;
      height: 374px;
      padding: 10px;
      box-sizing: content-box;
      float: left;
      &__img {
        width:180px;
        height:320px;
        outline: 4px solid #eee;
      }
      &__title {
        height:18px;
        font-size:14px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        line-height:18px;
        text-align: center;
        margin-top: 16px;
      }
    }
    .blank {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      &__icon {
        width:48px;
        height:48px;
        background:rgba(238,238,238,1);
        border-radius: 50%;
        margin-bottom: 12px;
        position: relative;
        &::before {
          content: '';
          transform: translateY(-50%) translateX(-50%);
          position: absolute;
          top: 50%;
          left: 50%;
          width:20px;
          height:2px;
          background:rgba(255,255,255,1);
          border-radius:2px;
        }
        &::after {
          content: '';
          transform: translateY(-50%) translateX(-50%);
          position: absolute;
          top: 50%;
          left: 50%;
          width:2px;
          height:20px;
          background:rgba(255,255,255,1);
          border-radius:2px;
        }
      }
      &__title {
        height:16px;
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:16px;
        text-align: center;
      }
    }
  }
  .preview-edit {
    position: absolute;
    top: 0;
    left: 320px;
    right: 0;
    bottom: 0;
    background-color: #F8F8F8;
    padding: 48px 30px;
    display: flex;
    .test {
      position: absolute;
      top: 0;
      left: 0;
    }

  }
}
</style>

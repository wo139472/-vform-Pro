<template>
  <el-form-item v-if="optionModel.keyNameEnabled">
    <span slot="label">{{i18nt('designer.setting.keyName')}}
      <el-tooltip effect="light" :content="i18nt('designer.setting.keyNameHelp')">
        <i class="el-icon-info"></i></el-tooltip>
    </span>
    <el-input type="text" v-model="optionModel.keyName"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "keyName-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    watch: {
      // selectedWidget: {
      //   handler(val, oldVal) {
      //     if (!val) {
      //       return
      //     }
      //
      //     if (val.options.keyNameEnabled && !val.options.keyName) {
      //       val.options.keyName = val.options.name
      //     }
      //   },
      //   immediate: true
      // },

    },

  }
</script>

<style lang="scss" scoped>

</style>

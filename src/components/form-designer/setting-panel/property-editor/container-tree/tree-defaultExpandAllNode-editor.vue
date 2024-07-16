<template>
  <el-form-item :label="i18nt('designer.setting.defaultExpandAllNode')">
    <el-switch v-model="optionModel.defaultExpandAllNode"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "tree-defaultExpandAllNode-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>

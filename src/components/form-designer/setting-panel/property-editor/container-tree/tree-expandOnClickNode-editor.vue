
<template>
  <el-form-item :label="i18nt('designer.setting.expandOnClickNode')">
    <el-switch v-model="optionModel.expandOnClickNode"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "tree-expandOnClickNode-editor",
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

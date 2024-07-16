<template>
  <el-form-item :label="i18nt('designer.setting.showTreeCheckBox')">
    <el-switch v-model="optionModel.showCheckBox"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "show-checkbox-editor",
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

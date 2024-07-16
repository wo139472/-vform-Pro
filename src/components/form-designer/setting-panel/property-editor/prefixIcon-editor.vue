<template>
  <el-form-item :label="i18nt('designer.setting.prefixIcon')">
    <icon-picker v-model="optionModel.prefixIcon"></icon-picker>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";
  import IconPicker from "@/components/icon-picker/index";

  export default {
    name: "prefixIcon-editor",
    components: {IconPicker},
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

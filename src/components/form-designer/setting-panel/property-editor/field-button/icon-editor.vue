<template>
  <el-form-item :label="i18nt('designer.setting.buttonIcon')">
    <icon-picker v-model="optionModel.icon"></icon-picker>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import IconPicker from "@/components/icon-picker/index";

  export default {
    name: "icon-editor",
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

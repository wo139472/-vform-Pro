<template>
  <el-form-item>
		<span slot="label">{{i18nt('designer.setting.selectClearAllNode')}}</span>
    <el-switch v-model="optionModel.selectClearAllNode"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "tree-selectClearAllNode-editor",
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

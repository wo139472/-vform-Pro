<template>
  <el-form-item :label="i18nt('designer.setting.keyNameEnabled')">
    <el-switch v-model="optionModel.keyNameEnabled" @change="handleChange"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "keyNameEnabled-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    methods: {
      handleChange(value) {
        if (value && !this.optionModel.keyName) {
          this.optionModel.keyName = this.optionModel.name
        }
      },

    }
  }
</script>

<style scoped>

</style>

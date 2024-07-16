<template>
  <el-form-item :label="i18nt('designer.setting.drawDirection')">
    <el-radio-group v-model="optionModel.direction" class="radio-group-custom">
      <el-radio-button label="rtl"><i class="el-icon-back" /></el-radio-button>
      <el-radio-button label="ltr"><i class="el-icon-right" /></el-radio-button>
      <el-radio-button label="ttb"><i class="el-icon-bottom" /></el-radio-button>
      <el-radio-button label="btt"><i class="el-icon-top" /></el-radio-button>
    </el-radio-group>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "vf-drawer-direction-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
      //
    }
  }
</script>

<style lang="scss" scoped>
  .radio-group-custom {
    ::v-deep .el-radio-button__inner {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
</style>

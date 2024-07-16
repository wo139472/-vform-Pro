<template>
  <el-form-item prop="objectName" :rules="objectNameRequiredRule">
    <span slot="label">{{i18nt('designer.setting.objectName')}}
      <el-tooltip effect="light" :content="i18nt('designer.setting.objectNameHelp')">
        <i class="el-icon-info"></i></el-tooltip>
    </span>
    <el-input type="text" v-model="optionModel.objectName" @focus="handleObjectNameFocus" @change="checkObjectName"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import {isEmptyStr, trimEx} from "@/utils/util";

  export default {
    name: "objectName-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        oldObjName: '',
        objectNameRequiredRule: [{required: true, objectName: 'name required'}],
      }
    },
    methods: {
      handleObjectNameFocus(event) {
        this.oldObjName = this.selectedWidget.options.objectName
      },

      checkObjectName(objectName) {
        if (isEmptyStr(objectName)) {
          this.selectedWidget.options.objectName = this.oldObjName
          this.$message.info(this.i18nt('designer.hint.objectNameRequired'))
          return
        }

        let newObjName = objectName.trim()
        newObjName = trimEx(newObjName, '.')  // 去掉首尾多余的'.'号
        this.selectedWidget.options.objectName = newObjName
      },

    }
  }
</script>

<style scoped>

</style>

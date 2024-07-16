<template>
  <el-form-item label-width="150px">
		<span slot="label">onNodeCheck
		  <el-tooltip effect="light" :content="i18nt('designer.setting.onNodeCheckRemark')">
		    <i class="el-icon-info"></i></el-tooltip>
		</span>
    <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onNodeCheck', eventParams)">
      {{i18nt('designer.setting.addEventHandler')}}</el-button>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import eventMixin from "@/components/form-designer/setting-panel/property-editor/event-handler/eventMixin"

  export default {
    name: "onNodeCheck-editor",
    mixins: [i18n, eventMixin],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        eventParams: ['data', 'treeState'],
      }
    }
  }
</script>

<style scoped>

</style>

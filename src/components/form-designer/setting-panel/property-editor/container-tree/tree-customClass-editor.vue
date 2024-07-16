<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.customClass')">
      <el-select v-model="optionModel.customClass" multiple filterable allow-create
                 default-first-option>
        <el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.dsEnabled')">
      <el-switch v-model="optionModel.dsEnabled"></el-switch>
    </el-form-item>
    <el-form-item v-if="!!optionModel.dsEnabled" :label="i18nt('designer.setting.dsName')">
      <el-select v-model="optionModel.dsName" filterable clearable @change="getDataSetList">
        <el-option v-for="(item, idx) in dataSourceList" :key="idx" :title="item.description"
                   :label="item.uniqueName" :value="item.uniqueName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="!!optionModel.dsEnabled" :label="i18nt('designer.setting.dataSetName')">
      <el-select v-model="optionModel.dataSetName" filterable clearable>
        <el-option v-for="(item, idx) in dataSetList" :key="idx" :title="item.remark"
                   :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n";
  import {deepClone, getDSByName} from "@/utils/util";

  export default {
    name: "tree-customClass-editor",
    componentName: 'PropertyEditor',
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        cssClassList: [],
        dataSetList: [],
      }
    },
    computed: {
      dataSourceList() {
        if (!this.designer.formConfig || !this.designer.formConfig.dataSources) {
          return []
        } else {
          return this.designer.formConfig.dataSources
        }
      },

    },
    watch: {
      selectedWidget: {
        handler(val, oldVal) {
          if (!val) {
            return
          }

          this.loadDataSet(val.options.dsName)
        },
        immediate: true
      },

    },
    created() {
      this.cssClassList = deepClone(this.designer.getCssClassList())
      //监听表单css代码改动事件并重新加载！
      this.designer.handleEvent('form-css-updated', (cssClassList) => {
        this.cssClassList = cssClassList
      })
    },
    methods: {
      loadDataSet(dsName) {
        this.dataSetList.length = 0
        if (!dsName) {
          return
        }

        let dsModel = getDSByName(this.designer.formConfig, dsName)
        if (!!dsModel && !!dsModel.dataSets) {
          dsModel.dataSets.forEach(dSet => {
            this.dataSetList.push({
              name: dSet.name,
              remark: dSet.remark
            })
          })
        }
      },

      getDataSetList() {
        this.optionModel.dataSetName = ''
        this.loadDataSet(this.optionModel.dsName)
      },
    }
  }
</script>

<style scoped>

</style>

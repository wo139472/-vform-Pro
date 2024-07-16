<template>
  <div id="app">
    <VFormDesigner ref="vfDesignerRef" :designer-config="designerConfig" :global-dsv="globalDsv">
      <!--
      <template #customToolButtons>
        <el-button type="text" @click="doTest2">测试btn</el-button>
      </template>
      -->
    </VFormDesigner>
  </div>
</template>

<script>
import VFormDesigner from './components/form-designer/index.vue'

export default {
  name: 'App',
  components: {
    VFormDesigner,
  },
  data() {
    return {
      designerConfig: {
        //logoHeader: false,
        //toolbarMaxWidth: 510
      },

      //全局数据源变量
      globalDsv: {
        testApiHost: 'http://www.test.com/api',
        testPort: 8080,
      },
    }
  },
  methods: {
    doTest() {
      let fieldList = this.$refs.vfDesignerRef.getFieldWidgets(null, true)
      console.log('test', fieldList)
    },

    doTest2() {
      let dataSchema = this.$refs.vfDesignerRef.buildFormDataSchema()
      console.info(dataSchema)
      console.info( JSON.stringify(dataSchema, null, "  ") )
      alert( JSON.stringify(dataSchema) )
    }
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>

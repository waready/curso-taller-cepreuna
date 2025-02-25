<template>
   <q-page class="q-pa-sm">
    <card-social icon_position="left"/>
    <card-charts/>
    <BarChart></BarChart>
   </q-page>
</template>

<script>
import BarChart from 'src/components/charts/BarChart.vue';
import {defineComponent, defineAsyncComponent} from 'vue';
export default defineComponent({
  name: 'IndexPage',
  components:{  
    CardSocial: defineAsyncComponent(() => import('components/CardResumen.vue')),
    CardCharts: defineAsyncComponent(() => import('components/ChartsResumen.vue')),
    BarChart
  },
  setup () {

  }
})
</script>
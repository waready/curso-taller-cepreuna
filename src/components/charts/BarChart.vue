<template>
  <div>
    <q-card class="no-shadow" bordered>
      <q-card-section class="text-h6">
        Cantidad Inscritos por Áreas 
        <h5 v-if="sede">Sede: {{ sede }}</h5>
        <q-btn icon="fa fa-download" class="float-right" @click="SaveImage" flat dense>
          <q-tooltip>Download PNG</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <ECharts ref="barchart" :option="options" 
        class="q-mt-md" :resizable="true" autoresize style="height: 285px" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import ECharts from "vue-echarts";
import "echarts";
import axios from "axios";

export default defineComponent({
  name: "BarChart",
  components: { ECharts },
  props: ["sede"],
  setup() {
    const options = ref({
      legend: { 
        bottom: 10, 
        data: [] // Se llenará dinámicamente con los nombres de las áreas
      },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      dataset: { source: [] },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "20%",
        top: "5%",
        containLabel: true,
      },
      xAxis: { type: "category" },
      yAxis: {},
      series: [],
    });

    const areaDescriptions = {
      "1": "Razonamiento Matemático",
      "2": "Razonamiento Verbal",
      "3": "Física, Química",
      "4": "Geografía, Historia"
    };

    const getInscritos = async () => {
      try {
        const respuesta = await axios.get(
          "https://sistemas.cepreuna.edu.pe/api/curso-taller/inscripciones",
          {
            headers: { Authorization: "cepreuna_v1_api" },
          }
        );

        let areas = respuesta.data.por_area;
        areas.sort((a, b) => a.area - b.area);

        let dataset = [];
        let series = [];
        let legendData = []; // Para la leyenda
        let colors = { "1": "#4285F4", "2": "#34A853", "3": "#EA4335", "4": "#FF9900" };

        areas.forEach((item) => {
          let areaName = areaDescriptions[item.area] || `Área ${item.area}`;
          dataset.push([areaName, item.total]);
          legendData.push(areaName); // Agregar a la leyenda
          series.push({
            name: areaName,
            type: "bar",
           // itemStyle: { color: colors[item.area] || "#000000" },
            data: [item.total], // Asigna los datos correctamente
          });
        });
       
        options.value.legend.data = legendData; // Asignar nombres de las áreas a la leyenda
        options.value.dataset.source = dataset;
        options.value.series = series;
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    onMounted(() => {
      getInscritos();
    });

    const SaveImage = () => {
      const linkSource = document.querySelector(".q-mt-md").__vue__.getDataURL();
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = "_self";
      downloadLink.download = "BarChart.png";
      downloadLink.click();
    };

    return {
      options,
      SaveImage,
    };
  },
});
</script>

<style scoped></style>

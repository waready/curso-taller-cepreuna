<template>
  <div class="row q-col-gutter-sm q-py-sm">
    <!-- Gráfico de Inscritos -->
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs no-shadow" bordered style="background-color: #1e88e5">
        <q-card-section class="text-h6 text-white">
          Cantidad de Inscritos por día
        </q-card-section>
        <q-card-section class="q-pa-none">
          <ECharts :option="LineChart" class="q-mt-md" :resizable="true" autoresize style="height: 250px;" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Gráfico de Pagos -->
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs no-shadow" bordered style="background-color: #38b1c5">
        <q-card-section class="text-h6 text-white">
          Cantidad de Pagos por día
        </q-card-section>
        <q-card-section class="q-pa-none">
          <ECharts :option="LineChart2" class="q-mt-md" :resizable="true" autoresize style="height: 250px;" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import ECharts from "vue-echarts";
import axios from "axios";

export default defineComponent({
  name: "CardCharts",
  components: { ECharts },
  setup() {
    // Opciones de gráficos respetando los diseños originales
    const LineChart = ref({
      tooltip: { show: true, trigger: "axis" },
      title: { show: true, textStyle: { color: "rgba(0, 0, 0 , .87)", fontFamily: "sans-serif" } },
      grid: { containLabel: true, left: "0", bottom: "0", right: "0" },
      xAxis: { show: false, type: "category", boundaryGap: false },
      yAxis: { show: false, type: "value", splitLine: { lineStyle: { type: "dashed" } } },
      series: [{ type: "line", areaStyle: {}, smooth: true }],
      dataset: { source: [] },
      color: ["#2196f3"],
    });

    const LineChart2 = ref({
      tooltip: { show: true, trigger: "axis" },
      title: { show: true, textStyle: { color: "rgba(0, 0, 0 , .87)", fontFamily: "sans-serif" } },
      grid: { containLabel: true, left: "0", bottom: "0", right: "0" },
      xAxis: { show: false, type: "category", boundaryGap: false },
      yAxis: { show: false, type: "value", splitLine: { lineStyle: { type: "dashed" } } },
      series: [{ type: "line", areaStyle: {}, smooth: false }],
      dataset: { source: [] },
      color: ["#45c2c5"],
    });

    // Función para obtener inscritos agrupados por día
    const getInscritos = async () => {
      try {
        const response = await axios.get(
          "https://sistemas.cepreuna.edu.pe/api/curso-taller/inscripciones",
          { headers: { Authorization: "cepreuna_v1_api" } }
        );

        const total_inscritos = response.data.listado;

        // Agrupar por fecha (extraer solo YYYY-MM-DD)
        const groupedByDate = total_inscritos.reduce((acc, item) => {
          const fecha = item.created_at.split(" ")[0];
          acc[fecha] = (acc[fecha] || 0) + 1;
          return acc;
        }, {});

        // Convertir a formato de dataset
        const dataset = [["Fecha", "Inscritos"]];
        Object.entries(groupedByDate).forEach(([fecha, count]) => {
          dataset.push([fecha, count]);
        });

        // Actualizar datos en el gráfico
        LineChart.value.dataset.source = dataset;
      } catch (error) {
        console.error("Error al obtener inscritos:", error);
      }
    };

    // Función para obtener pagos agrupados por día y ordenarlos
    const getPagos = async () => {
      try {
        const response = await axios.get(
          "https://sistemas.cepreuna.edu.pe/api/curso-taller/pagos",
          { headers: { Authorization: "cepreuna_v1_api" } }
        );

        const total_pagos = response.data.listado;

        // Agrupar pagos por fecha (fch_pag)
        const groupedByDate = total_pagos.reduce((acc, item) => {
          const fecha = item.fch_pag;
          acc[fecha] = (acc[fecha] || 0) + 1;
          return acc;
        }, {});

        // Ordenar las fechas de menor a mayor
        const sortedEntries = Object.entries(groupedByDate).sort(
          ([fechaA], [fechaB]) => new Date(fechaA) - new Date(fechaB)
        );

        // Convertir a formato de dataset
        const dataset = [["Fecha", "Pagos"], ...sortedEntries];

        // Actualizar datos en el gráfico
        LineChart2.value.dataset.source = dataset;
      } catch (error) {
        console.error("Error al obtener pagos:", error);
      }
    };

    // Llamar a las funciones cuando el componente se monte
    onMounted(() => {
      getInscritos();
      getPagos();
    });

    return {
      LineChart,
      LineChart2,
    };
  },
});
</script>

<style scoped></style>

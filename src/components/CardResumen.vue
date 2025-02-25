<template>
  <q-card class="bg-transparent no-shadow no-border" bordered>
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm">
        <div v-for="(item, index) in items" :key="index" class="col-md-4 col-sm-12 col-xs-12">
          <q-item :style="`background-color: ${item.color1}`" class="q-pa-none" :to="item.to">
            <q-item-section v-if="icon_position === 'left'" side :style="`background-color: ${item.color2}`"
              class="q-pa-lg q-mr-none text-white">
              <q-icon :name="item.icon" color="white" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.value }}</q-item-label>
              <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="icon_position === 'right'" side class="q-mr-md text-white">
              <q-icon :name="item.icon" color="white" size="44px"></q-icon>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  name: "CardSocial",
  props: {
    icon_position: {
      required: false,
      default: "left",
    },
  },
  data() {
    return {
      items: [
        {
          title: "Cantidad Inscritos",
          icon: "pie_chart",
          value: "Cargando...",
          color1: "#1976D2",
          color2: "#1565C0",
          to: "/inscritos"
        },
        {
          title: "Cantidad Pagos",
          icon: "bar_chart",
          value: "Cargando...",
          color1: "#26A69A",
          color2: "#00897B",
          to: "/pagos"
        },
        {
          title: "Aun no Inscritos",
          icon: "area_chart",
          value: "Cargando...",
          color1: "#FBC02D",  // Amarillo vibrante (basado en Material Design)
          color2: "#F9A825",  // Amarillo más oscuro para contraste
          to: "/"
        },

      ],
    };
  },
  mounted() {
    this.getInscritos(); // Asegurarse de llamar correctamente al método
  },
  methods: {
    async getInscritos() {
      try {
        const respuesta = await axios.get(
          "https://sistemas.cepreuna.edu.pe/api/curso-taller/inscripciones",
          {
            headers: {
              Authorization: "cepreuna_v1_api",
            },
          }
        );
        const total_inscritos = respuesta.data.total;

        const response = await axios.get(
          "https://sistemas.cepreuna.edu.pe/api/curso-taller/pagos",
          {
            headers: {
              Authorization: "cepreuna_v1_api",
            },
          }
        );
        const total_pagos = response.data.total;


        // Suponiendo que la API devuelve el número total de inscritos y pagos
        this.items[0].value = total_inscritos || "N/A";
        this.items[1].value = total_pagos || "N/A";
        this.items[2].value = total_pagos - total_inscritos || "N/A";
      } catch (error) {
        console.error("Error obteniendo los inscritos:", error);
        this.items[0].value = "Error";
        this.items[1].value = "Error";
      }
    },
  },
});
</script>

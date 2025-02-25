<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-btn color="secondary" icon="home" label="Inicio" to="/" />
        </q-toolbar-title>

        <div>
          <q-btn color="info" label="Actualizar Datos" icon="refresh"
          @click="recargar()" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-primary text-white" bordered>
      <q-list>
        <q-item-label header>
          Menu de Contenidos 📊
        </q-item-label>

        <EssentialLink v-for="link in linksList"  :key="link.title" v-bind="link"/>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Inscritos',
    //caption: 'Ver lista de inscritos',
    icon: 'group',         // Icono Material
    to: '/inscritos'              // Ajusta la ruta a tu gusto (por ejemplo: '/inscritos')
  },
  {
    title: 'Pagos Totales',
    //caption: 'Historial de pagos',
    icon: 'paid',          // Icono Material
    to: '/pagos'              // '/pagos-totales'
  },
  {
    title: 'Reporte por Área',
    //caption: 'Estadísticas por área',
    icon: 'analytics',     // Icono Material
    to: '/areas'              // '/reporte-area'
  },
  {
    title: 'Ver Pagos Diarios',
    //caption: 'Resumen de hoy',
    icon: 'today',         // Icono Material
    to: '/calendar'              // '/pagos-diarios'
  },
  {
    title: 'Obtener su Ficha',
    //caption: 'Descarga la ficha de inscripción',
    icon: 'receipt_long',  // Icono Material
    to: '/ficha'              // '/ficha'
  },
  {
    title: 'Validar su Asistencia',
    //caption: 'Control de asistencia',
    icon: 'how_to_reg',    // Icono Material
    to: '/asistencia'              // '/asistencia'
  },
  {
    title: 'Obtener su Certificado',
    //caption: 'Descargar certificado',
    icon: 'workspace_premium', // Icono Material
    to: '/certificado'                   // '/certificado'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data() {
    return {
      linksList,
      leftDrawerOpen: false
    }
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    recargar() {
      window.location.reload(true)
    }
  }
})
</script>

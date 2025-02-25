<template> 
  <q-item
    clickable
    tag="a"
    :to="to"
    active-class="active-menu-item"
  > 
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
})
</script>

<style scoped>
/* 🎨 Estilos para el Item Activo */
.active-menu-item {
  background: rgba(255, 255, 255, 0.15); /* Color semitransparente */
  color: #fff !important; /* Texto blanco */
  border-radius: 8px;
}
</style>
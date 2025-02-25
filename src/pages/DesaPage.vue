<template>
    <q-page padding>
        <q-banner class="bg-grey-3">
      <template v-slot:avatar>
        <q-icon name="signal_wifi_off" color="primary" />
      </template>
      You have lost connection to the internet. !! En desarrollo !!
      <template v-slot:action>
        <q-btn flat color="primary" label="Inicio" to="/" />
      </template>
    </q-banner>
    </q-page>
</template>
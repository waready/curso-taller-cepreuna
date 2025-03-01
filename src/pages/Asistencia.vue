<template>
  <q-layout class="background-gradient" v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="login-form">
          <q-card-section class="avatar-section">
            <q-avatar size="80px" class="shadow-10">
              <img src="https://next-quasar-admin.netlify.app/profile.svg" />
            </q-avatar>
          </q-card-section>

          <q-card-section class="q-mt-md text-center">
            <div class="text-h5 text-bold text-white">
              Control de Asistencia Día 2
            </div>
          </q-card-section>

          <q-card-section class="input-section">
            <q-input
              v-model="dni"
              type="number"
              ref="dniInput"
              dense
              class="custom-input"
              placeholder="Ingrese su DNI"
              :disable="loading"
              @keyup.enter="registrarAsistencia"
            />
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              push
              label="Registrar Asistencia"
              class="btn-unlock"
              color="primary"
              :loading="loading"
              :disable="dni.length !== 8"
              @click="registrarAsistencia"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick, watch } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "LockScreen",
  setup() {
    const dni = ref("");
    const dniInput = ref(null);
    const loading = ref(false);
    const $q = useQuasar();

    // Enfocar automáticamente el input al montar
    onMounted(() => {
      nextTick(() => {
        dniInput.value?.focus();
      });
    });

    // Mostrar notificaciones
    const showNotif = (message, type = "negative") => {
      $q.notify({
        position: "top-right",
        message,
        color: type,
        icon:
          type === "positive"
            ? "check_circle"
            : type === "warning"
            ? "warning"
            : "report_problem",
        timeout: 5000,
        actions: [{ label: "Cerrar", color: "white" }],
      });
    };

    // Watch para detectar cuando el DNI tiene 8 dígitos y registrar automáticamente
    watch(dni, (newVal) => {
      if (newVal.length === 8) {
        registrarAsistencia();
      }
    });

    // Registrar asistencia
    const registrarAsistencia = async () => {
      if (dni.value.length !== 8) {
        showNotif("El DNI debe tener 8 dígitos.", "negative");
        return;
      }

      loading.value = true;

      try {
        const response = await axios.post(
          "https://sistemas.cepreuna.edu.pe/api/curso-taller/asistencia",
          { dni: dni.value },
          { headers: { Authorization: "cepreuna_v1_api" } }
        );

        if (response.data.message.includes("ya registró su asistencia")) {
          showNotif(response.data.message, "warning");
        } else if (
          response.data.message.includes("Asistencia registrada correctamente")
        ) {
          showNotif(response.data.message, "positive");
        } else {
          showNotif(response.data.message, "negative");
        }
      } catch (error) {
        showNotif(
          error.response?.data?.message || "Error al registrar asistencia.",
          "negative"
        );
      } finally {
        loading.value = false;
        dni.value = ""; // Limpiar el campo después de la consulta
        nextTick(() => dniInput.value?.focus()); // Volver a enfocar el campo
      }
    };

    return {
      dni,
      dniInput,
      loading,
      registrarAsistencia,
    };
  },
});
</script>

<style scoped>
/* Fondo con degradado */
.background-gradient {
  background: linear-gradient(to bottom, #00A9C8, #00152C);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Estilo de la tarjeta */
.login-form {
  width: 90%;
  max-width: 400px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease-in-out;
}

.login-form:hover {
  transform: scale(1.03);
}

/* Avatar */
.avatar-section {
  display: flex;
  justify-content: center;
  margin-top: -30px;
}

/* Input estilizado */
.custom-input input {
  border: 2px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6) !important;
  border-radius: 8px;
  padding: 12px;
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.custom-input input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* Botón personalizado */
.btn-unlock {
  width: 100%;
  padding: 12px;
  font-size: 1.1em;
  font-weight: bold;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  background: linear-gradient(to right, #14a76c, #00a9c8);
  color: white;
}

.btn-unlock:hover {
  background: linear-gradient(to right, #ffd700, #ff8c00) !important;
  color: #001219 !important;
}
</style>

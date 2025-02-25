<template>
    <div class="row q-col-gutter-sm">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card class="text-grey-8 no-shadow" bordered>
                <q-card-section class="q-pa-none">
                    <q-table class="no-shadow" :rows="rows" title="Lista de Registros" :columns="columns" row-key="id"
                        :filter="filter" v-model:pagination="pagination">
                        <template v-slot:top-right="props">
                            <q-input  dense debounce="300" v-model="filter" placeholder="Buscar">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>

                            <!-- <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                                @click="props.toggleFullscreen" v-if="mode === 'list'" class="q-px-sm">
                                <q-tooltip v-close-popup>{{ props.inFullscreen ? 'Salir de Pantalla Completa' :
                                    'Pantalla Completa' }}</q-tooltip>
                            </q-btn> -->


                            <!-- <q-btn color="primary" icon-right="archive" label="Exportar a CSV" no-caps
                                @click="exportTable" /> -->
                        </template>
                        <!-- 🎨 Área con `q-badge` -->
                        <template v-slot:body-cell-area="props">
                            <q-td :props="props">
                                <q-badge :color="getAreaColor(props.row.area)" class="q-pa-xs">
                                    {{ areaMap[props.row.area] || "Desconocida" }}
                                </q-badge>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-condicion="props">
                            <q-td :props="props">
                                <q-badge :color="getAreaColor(props.row.condicion)" class="q-pa-xs">
                                    {{ CondicioMap[props.row.condicion] || "Desconocida" }}
                                </q-badge>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-path="props">
                            <q-td :props="props">
                                <q-btn v-if="props.row.path" flat round dense color="info" icon="file_open"
                                    class="q-ml-sm" @click="openFile(props.row.path)">
                                    <q-tooltip>Ver Archivo</q-tooltip>
                                </q-btn>
                                <q-badge v-else color="negative">Sin archivo</q-badge>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-asistencia="props">
                            <q-td :props="props">
                                <q-badge :color="props.row.asistencia === 1 ? 'green' : 'red'" class="q-pa-xs">
                                    {{ props.row.asistencia === 1 ? "Asistió" : "No Asistió" }}
                                </q-badge>
                            </q-td>
                        </template>

                    </q-table>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { exportFile, useQuasar } from 'quasar';
import axios from "axios";

function wrapCsvValue(val, formatFn) {
    let formatted = formatFn !== void 0 ? formatFn(val) : val;
    formatted = formatted === void 0 || formatted === null ? '' : String(formatted);
    formatted = formatted.split('"').join('""'); // Escapar comillas dobles
    return `"${formatted}"`;
}

export default defineComponent({
    name: 'TableVisits',
    setup() {
        const $q = useQuasar();
        const filter = ref('');
        const rows = ref([]);
        const areaMap = {
            "1": "Razonamiento Matemático",
            "2": "Razonamiento Verbal",
            "3": "Física, Química y Biología",
            "4": "Geografía e Historia"
        };

        const CondicioMap = {
            "1": "Unap",
            "2": "Particular",
        };
        const getAreaColor = (area) => {
            const colorMap = {
                "1": "blue",
                "2": "green",
                "3": "red",
                "4": "orange"
            };
            return colorMap[area] || "grey"; // Si no encuentra, pone gris
        };

        const columns = [
            { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
            {
                name: 'nombre_completo',
                align: 'left',
                label: 'Nombres',
                field: row => `${row.nombres} ${row.paterno} ${row.materno}`,
                sortable: true
            },
            { name: 'nro_documento', align: 'nro_documento', label: 'Nro Documento', field: 'nro_documento' },
            {
                name: 'area',
                align: 'left',
                label: 'Área',
                field: row => areaMap[row.area] || "Desconocida",
                sortable: true
            },
            { name: 'celular', align: 'left', label: 'Celular', field: 'celular' },
            { name: 'condicion', align: 'left', label: 'Condicion', field: 'condicion', sortable: true },
            { name: 'asistencia', align: 'left', label: 'Asistencia', field: 'asistencia' },
            { name: 'path', align: 'left', label: 'Ficha', field: 'path' },
        ];

        const pagination = ref({
            rowsPerPage: 10
        });

        const getData = async () => {
            try {
                const response = await axios.get("https://sistemas.cepreuna.edu.pe/api/curso-taller/inscripciones", {
                    headers: { Authorization: "cepreuna_v1_api" }
                });

                rows.value = response.data.listado; // Almacenar datos obtenidos en la tabla
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        const exportTable = () => {
            const content = [
                columns.map(col => wrapCsvValue(col.label))
            ].concat(
                rows.value.map(row =>
                    columns.map(col => wrapCsvValue(
                        typeof col.field === 'function' ? col.field(row) : row[col.field || col.name],
                        col.format
                    )).join(',')
                )
            ).join('\r\n');

            const status = exportFile('table-export.csv', content, 'text/csv');

            if (status !== true) {
                $q.notify({
                    message: 'El navegador bloqueó la descarga...',
                    color: 'negative',
                    icon: 'warning'
                });
            }
        };

        onMounted(() => {
            getData();
        });

        const openFile = (path) => {
            if (!path) {
                this.$q.notify({
                    message: "No hay archivo disponible",
                    color: "negative",
                    icon: "warning"
                });
                return;
            }

            // Si el path no es absoluto, añade la URL base
            const baseURL = "https://sistemas.cepreuna.edu.pe/"; // Ajusta si es necesario
            const fileURL = path.startsWith("http") ? path : `${baseURL}${path}`;

            // Abrir en nueva pestaña
            window.open(fileURL, "_blank");
        }
        return {
            filter,
            columns,
            rows,
            pagination,
            exportTable,
            areaMap,
            openFile,
            CondicioMap,
            getAreaColor
        };
    }
});
</script>
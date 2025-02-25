<template>
    <div class="row q-col-gutter-sm">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card class="text-grey-8 no-shadow" bordered>
                <q-card-section class="q-pa-none">
                    <q-table class="no-shadow" :rows="rows" title="Lista de Pagos" :columns="columns"
                        row-key="secuencia" :filter="filter" v-model:pagination="pagination">
                        <template v-slot:top-right="props">
                            <q-input dense debounce="300" v-model="filter" placeholder="Buscar">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>

                        <!-- 📅 Fecha de Pago -->
                        <template v-slot:body-cell-fch_pag="props">
                            <q-td :props="props">
                                {{ props.row.fch_pag }}
                            </q-td>
                        </template>

                        <!-- 💰 Importe -->
                        <template v-slot:body-cell-imp_pag="props">
                            <q-td :props="props">

                                S/ {{ props.row.imp_pag }}

                            </q-td>
                        </template>

                        <!-- 💰 Importe -->
                        <template v-slot:body-cell-cod_age="props">
                            <q-td :props="props">
                                <q-badge :color="props.row.cod_age === '0987' ? 'info' : 'green'" class="q-pa-xs">
                                    {{ props.row.cod_age === '0987' ? "Pagalo pe" : "Ventinalla" }}
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
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
    name: "TablePagos",
    setup() {
        const filter = ref("");
        const rows = ref([]);

        const columns = [
            { name: "secuencia", align: "left", label: "Secuencia", field: "secuencia", sortable: true },
            { name: "fch_pag", align: "left", label: "Fecha de Pago", field: "fch_pag", sortable: true },
            {
                name: "num_doc",
                align: "left",
                label: "Documento",
                field: row => row.num_doc ? row.num_doc.substring(7) : "",
                sortable: true
            },
            { name: "nom_cli", align: "left", label: "Cliente", field: "nom_cli", sortable: true },
            { name: "imp_pag", align: "right", label: "Importe", field: "imp_pag", sortable: true },
            {
                name: "cod_age",
                align: "left",
                label: "Agente",
                field: row => row.cod_age == '0987' ? "Pagalo pe" : "Ventinalla",
                sortable: true
            },
        ];

        const pagination = ref({ rowsPerPage: 10 });

        const getPagos = async () => {
            try {
                const response = await axios.get(
                    "https://sistemas.cepreuna.edu.pe/api/curso-taller/pagos",
                    { headers: { Authorization: "cepreuna_v1_api" } }
                );
                rows.value = response.data.listado;
            } catch (error) {
                console.error("Error al obtener los pagos:", error);
            }
        };

        onMounted(() => {
            getPagos();
        });

        return {
            filter,
            columns,
            rows,
            pagination,
        };
    },
});
</script>
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <div>
    <q-table
      ref="table"
      title="Mijozlar"
      :row-key="rowKey"
      :data="data"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :pagination="pagination"
      @request="refreshData"
      selection="single"
      :selected.sync="selectedRows"
      separator="horizontal"
      color="secondary"
      bordered
      :no-data-label="noDataText()"
      :selected-rows-label="selectedRowsText"
      @row-click="rowClick"
      :dense="$q.screen.lt.md"
      :grid="$q.screen.xs"
      class="sticky-first-column-table sticky-last-column-table q-mt-lg"


    >
      <template v-slot:no-data="props">
        {{$t('system.no_matching_found')}}
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="sm" dense color="secondary" icon="edit" @click.stop="rowEdit(props.row)" class="q-mr-xs">
            <q-tooltip content-class="bg-secondary">
              {{$t('system.edit')}}
            </q-tooltip>
          </q-btn>
          <q-btn size="sm" dense color="negative" icon="delete" @click.stop="rowDelete(props.row)" class="q-mr-sm">
            <q-tooltip content-class="bg-negative">
              {{$t('system.delete')}}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:top="props">
        Xodimlar turlari
      </template>

<!--      <template v-slot:item="props">-->
<!--        <div-->
<!--          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"-->
<!--        >-->
<!--          <q-card :class="props.selected ? 'row-selected' : ''">-->
<!--            <q-card-section>-->
<!--              <q-checkbox dense v-model="props.selected" :label="props.row[cardCheckField]"/>-->
<!--            </q-card-section>-->
<!--            <q-separator/>-->
<!--            <q-list dense>-->
<!--              <q-item v-for="col in props.cols.filter(col_ => col_.name !== actionsColumnName)" :key="col.name">-->
<!--                <q-item-section>-->
<!--                  <q-item-label>{{ col.label }}</q-item-label>-->
<!--                </q-item-section>-->
<!--                <q-item-section side>-->
<!--                  <q-item-label caption>{{ col.value }}</q-item-label>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--            </q-list>-->
<!--            <q-separator/>-->
<!--            <q-card-section class="row justify-end"-->
<!--                            v-if="props.cols.filter(col => col.name === actionsColumnName).length>0">-->
<!--              <q-btn size="sm" dense color="secondary" icon="edit" @click.stop="rowEdit(props.row)" class="q-mr-xs">-->
<!--              </q-btn>-->
<!--              <q-btn size="sm" dense color="negative" icon="delete" @click.stop="rowDelete(props.row)" class="q-mr-sm">-->
<!--              </q-btn>-->
<!--            </q-card-section>-->

<!--          </q-card>-->
<!--        </div>-->
<!--      </template>-->
    </q-table>

    <!--DIALOG-->
    <standart-input-dialog v-model="formDialog" :model-id="bean.id" :on-submit="onSubmit"
                           :on-validation-error="onValidationError">

      <div class="row">

        <q-select
          v-model="bean.regions_id"
          emit-value
          map-options
          :options="regions"
          option-value="id"
          option-label="name"
          :label="$t('captions.l_region')"
          transition-show="flip-up"
          transition-hide="flip-down"
          class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.regions_id = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.name}}</div>
          </template>
        </q-select>


        <q-input v-model="bean.name_ru" :placeholder="$t('captions.l_name_ru')"
                 :label="$t('captions.l_name_ru')"
                 class="q-pa-md col-xs-12 col-sm-4 col-md-4 col-lg-4" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.name_uz" :placeholder="$t('captions.l_name_uz')"
                 :label="$t('captions.l_name_uz')"
                 class="q-pa-md col-xs-12 col-sm-4 col-md-4 col-lg-4" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.name_uk" :placeholder="$t('captions.l_name_uk')"
                 :label="$t('captions.l_name_uk')"
                 class="q-pa-md col-xs-12 col-sm-4 col-md-4 col-lg-4" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>

        <q-input v-model="bean.description" :placeholder="$t('captions.l_description')"
                 :label="$t('captions.l_description')"
                 class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense>
          <template v-slot:prepend="props">
            <q-icon name="mdi-text" color="secondary"/>
          </template>
        </q-input>

        <q-input v-model="bean.ordering" :placeholder="$t('captions.l_ordering')"
                 :label="$t('captions.l_ordering')"
                 class="q-pa-md col-xs-12 col-sm-4 col-md-4 col-lg-4" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>

        <q-input v-model="bean.soato" :placeholder="$t('captions.l_soato')"
                 :label="$t('captions.l_soato')"
                 class="q-pa-md col-xs-12 col-sm-4 col-md-4 col-lg-4" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
      </div>

    </standart-input-dialog>

  </div>
</template>

<script>
import {urls} from 'src/utils/constants';
import {mapMutations} from 'vuex';
import {mapState} from 'vuex';
import StandartTable from "src/mixins/StandartTable";
import StandartInputDialog from "components/base/StandartInputDialog";

export default {
  name: "WorkerTypes",
  components: {StandartInputDialog},
  mixins: [StandartTable],
  data() {
    return {
      apiUrl: urls.WORKER_TYPES,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        nameUz: '',
        nameRu: '',
        nameBg: '',
      },
      formDialog: false,
      filter: {
        sort: 'id',
        page: 0,
        size: 10
      },
      columns: [
        {
          name: 'id',
          field: 'id',
          label: this.$t('captions.l_id'),
          sortable: true, align: 'left',
          classes: 'col-1'
        },
        // {
        //   name: 'name',
        //   field: row => row.name,
        //   label: this.$t('captions.l_name'),
        //   format: val => `${val}`,
        //   sortable: true,
        //   align: 'left',
        //   classes: 'col-1 text-bold',
        // },

        {
          name: 'nameUz',
          field: row => row.nameUz,
          label: 'Nomi(uz)',
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'nameUk',
          field: row => row.nameUk,
          label: "Nomi(uk)",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Harakatlar", style:'width: 1rem'},
      ],
      data: [],
      regions: [],
      pagination: {
        sortBy: 'id',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

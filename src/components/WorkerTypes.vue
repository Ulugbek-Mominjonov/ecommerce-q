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
        <q-input v-model="filter.name" :placeholder="$t('xshop_captions.l_worker_type')"
                 :label="$t('xshop_captions.l_worker_type')"
                 class="q-pa-md col-4" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.name" name="close" color="primary" @click.stop="filter.name = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>
        <q-space/>
        <q-btn icon="refresh" class="q-mr-sm bg-primary text-white" @click="refreshTable" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('xshop_captions.l_refresh') }}
          </q-tooltip>
        </q-btn>

        <q-btn icon="add" class="bg-primary text-white" @click="rowAdd" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('system.add') }}
          </q-tooltip>
        </q-btn>
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

      <template v-slot:bottom>
        <div class="row justify-center q-mt-md">
          <q-pagination
            v-model="filter.page"
            color="grey-8"
            :max="pagesNumber"
            size="sm"
          />
        </div>
      </template>
    </q-table>

    <!--DIALOG-->
    <standart-input-dialog v-model="formDialog" :model-id="bean.id" :on-submit="onSubmit"
                           :on-validation-error="onValidationError">

      <div class="row">

<!--        <q-select-->
<!--          v-model="bean.regions_id"-->
<!--          emit-value-->
<!--          map-options-->
<!--          :options="regions"-->
<!--          option-value="id"-->
<!--          option-label="name"-->
<!--          :label="$t('captions.l_region')"-->
<!--          transition-show="flip-up"-->
<!--          transition-hide="flip-down"-->
<!--          class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense-->
<!--          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"-->
<!--        >-->
<!--          <template v-slot:append>-->
<!--            <q-icon name="close" color="primary" @click.stop="bean.regions_id = null"-->
<!--                    class="cursor-pointer"/>-->
<!--          </template>-->
<!--          <template v-slot:selected-item="props">-->
<!--            <div>{{props.opt.name}}</div>-->
<!--          </template>-->
<!--        </q-select>-->


        <q-input v-model="bean.nameUz" :placeholder="$t('xshop_captions.l_name_uz')"
                 :label="$t('xshop_captions.l_name_uz')"
                 class="q-pa-md col-12" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.nameRu" :placeholder="$t('xshop_captions.l_name_ru')"
                 :label="$t('xshop_captions.l_name_ru')"
                 class="q-pa-md col-12" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.name_uk" :placeholder="$t('xshop_captions.l_name_bg')"
                 :label="$t('xshop_captions.l_name_bg')"
                 class="q-pa-md col-12" dense
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
        page: 1,
        rowsPerPage: 1,
        rowsNumber: 0,
        descending: false,
        name: ""
      },
      columns: [
        {
          name: 'id',
          field: 'id',
          label: this.$t('xshop_captions.l_id'),
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
          label: this.$t('xshop_captions.l_name_uz'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'nameRu',
          field: row => row.nameRu,
          label: this.$t('xshop_captions.l_name_ru'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'NameBg',
          field: row => row.nameBg,
          label: this.$t('xshop_captions.l_name_bg'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'modifyDate',
          field: row => row.modifiedDate,
          label: this.$t('xshop_captions.l_update_date'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'createdDate',
          field: row => row.createdDate,
          label: this.$t('xshop_captions.l_created_date'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Harakatlar", style:'width: 1rem'},
      ],
      data: [],
      regions: [],
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

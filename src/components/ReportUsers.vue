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
      :pagination="filter"
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
      style="height: calc(100vh - 150px)"
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
        <q-input v-model="filter.fullName" placeholder="Тарқатувчи"
                 label="Тарқатувчи"
                 class="q-pa-md col-4" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.fullName" name="close" color="primary" @click.stop="filter.fullName = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>
        <q-space/>
        <q-btn icon="refresh" class="q-mr-sm text-white" @click="refreshTable" dense style="background-color: #344767">
          <q-tooltip content-class="bg-primary">
            {{ $t('xshop_captions.l_refresh') }}
          </q-tooltip>
        </q-btn>

        <q-btn icon="add" class="text-white" @click="rowAdd" dense style="background-color: #344767">
          <q-tooltip content-class="bg-primary">
            {{ $t('system.add') }}
          </q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-modifyDate="props">
        <q-td :props="props">
          <div v-if="props.row.modifiedDate">
            {{$dateutil.formatDate(props.row.modifiedDate, 'DD.MM.YYYY')}}
          </div>
          <div v-else>
            --.--.----
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-createdDate="props">
        <q-td :props="props">
          {{$dateutil.formatDate(props.row.createdDate, 'DD.MM.YYYY')}}
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="full-width row justify-center q-mt-md">
          <q-pagination
            v-model="model"
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
        <q-input v-model="bean.nameBg" :placeholder="$t('xshop_captions.l_name_bg')"
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
  name: "ReportUsers",
  components: {StandartInputDialog},
  mixins: [StandartTable],
  data() {
    return {
      apiUrl: urls.USERS + '/report',
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
        page: 0,
        rowsPerPage: 5,
        rowsNumber: 0,
        descending: false,
        fullName: ""
      },
      columns: [
        {
          name: 'id',
          field: 'id',
          label: this.$t('xshop_captions.l_id'),
          sortable: true, align: 'left',
          classes: 'col-1'
        },
        {
          name: 'fullName',
          field: row => row.fullName,
          label: 'Фойдаланувчи',
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'username',
          field: row => row.username,
          label: "Username",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.phone),
          label: "Telefon nomer",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalToStores',
          field: row => this.number_format_old(row.totalToStores, 0, '.', ' '),
          label: "totalToStores",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalFromStores',
          field: row => this.number_format_old(row.totalFromStores, 0, '.', ' '),
          label: "totalFromStores",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'totalToKassa',
          field: row => this.number_format_old(row.totalToKassa, 0, '.', ' '),
          label: "totalToKassa",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalFromKassa',
          field: row => this.number_format_old(row.totalFromKassa, 0, '.', ' '),
          label: "totalFromKassa",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'balance',
          field: row => this.number_format_old(row.balance, 0, '.', ' '),
          label: "balance",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Harakatlar", style:'width: 1rem'},
      ],
      data: [],
      regions: [],
      model: 1
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval-1);
    }
  },
  mounted() {
  }
}
</script>
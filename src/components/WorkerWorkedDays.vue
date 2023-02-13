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
        {{ $t('system.no_matching_found') }}
      </template>

      <template v-slot:body-cell-passport="props">
        <q-td :props="props">
          <div v-if="props.row.workers.passportSeries && props.row.workers.passportNumber">
            {{ props.row.workers.passportSeries }} {{ props.row.workers.passportNumber }}
          </div>
          <div v-else>
            -- --- -- --
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-modifyDate="props">
        <q-td :props="props">
          <div v-if="props.row.modifiedDate">
            {{ $dateutil.formatDate(props.row.modifiedDate, 'DD.MM.YYYY') }}
          </div>
          <div v-else>
            --.--.----
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-createdDate="props">
        <q-td :props="props">
          {{ $dateutil.formatDate(props.row.createdDate, 'DD.MM.YYYY') }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="sm" dense color="secondary" icon="edit" @click.stop="rowEdit(props.row)" class="q-mr-xs">
            <q-tooltip content-class="bg-secondary">
              {{ $t('system.edit') }}
            </q-tooltip>
          </q-btn>
          <q-btn size="sm" dense color="negative" icon="delete" @click.stop="rowDelete(props.row)" class="q-mr-sm">
            <q-tooltip content-class="bg-negative">
              {{ $t('system.delete') }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>


      <template v-slot:top="props">
        <q-btn v-if="workers" @click="goBack" class="text-capitalize" color="teal-8" outline icon="mdi-arrow-left">
        </q-btn>

        <date-input
          v-model="filter.fromDate"
          :label="$t('xshop_captions.l_from_date')"
          class="q-pa-sm col-3 text-white"
        />

        <date-input
          v-model="filter.toDate"
          :label="$t('xshop_captions.l_to_date')"
          class="q-pa-sm col-3 text-white"
        />
        <q-input v-model="filter.salary"
                 :label="$t('xshop_captions.l_amount')"
                 type="number"
                 class="q-pa-sm col-2" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.salary" name="close" color="primary" @click.stop="filter.salary = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>
        <q-space/>
        <q-btn icon="refresh" class="q-mr-sm bg-primary text-white" @click="refreshTable" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('xshop_captions.l_refresh') }}
          </q-tooltip>
        </q-btn>
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
        <q-input v-model="bean.workersId=workers.id"
                 label="Ходим идси"
                 class="q-pa-md col-12 col-md-6 col-lg-6" dense
                 type="number"
                 readonly
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.fullName=workers.fullName"
                 label="Ходим исми"
                 class="q-pa-md col-12 col-md-6 col-lg-6" dense
                 readonly
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.amount"
                 label="Маош миқдори"
                 class="q-pa-md col-12 col-md-12" dense
                 type="number"
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
import DateInput from "components/base/DateInput.vue";

export default {
  name: "WorkerWorkedDays",
  components: {DateInput, StandartInputDialog},
  mixins: [StandartTable],
  props: {
    workers: {
      type: JSON,
      default: null
    }
  },
  data() {
    return {
      apiUrl: urls.WORKER_WORKED_DAYS,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        salary: null,
        workersId: null,
        workedDate: null
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        descending: false,
        workersId: this.workers.id,
        fullName: this.workers.fullName
      },
      columns: [
        {
          name: 'id',
          field: 'id',
          label: this.$t('xshop_captions.l_id'),
          align: 'left',
          classes: 'col-1'
        },
        {
          name: 'salary',
          required: true,
          label: 'Иш хақи миқдори (сўм)',
          align: 'left',
          field: row => this.formatPrice(row.salary),
          classes: 'col-1 text-bold',
        },
        {
          name: 'workedDate',
          field: row => row.workedDate,
          label: 'Иш куни',
          format: val => `${val}`,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'fullName',
          field: row => row.workers.fullName,
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'modifyDate',
          field: row => row.modifiedDate,
          label: this.$t('xshop_captions.l_update_date'),
          format: val => `${val}`,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'createdDate',
          field: row => row.createdDate,
          label: this.$t('xshop_captions.l_created_date'),
          format: val => `${val}`,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'modifyBy',
          field: row => row.modifiedBy,
          label: "Ўзгартирган фойдаланувчи",
          format: val => `${val}`,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'createdBy',
          field: row => row.createdBy,
          label: 'Яратган фойдаланувчи',
          format: val => `${val}`,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Амаллар", style: 'width: 1rem'},
      ],
      data: [],
      regions: [],
      workerTypes: [],
      workers: [],
      model: 1
    }
  },
  computed: {
    pagesNumber() {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack');
    },
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval - 1);
    }
  },
  mounted() {
    this.getWorkers()
  }
}
</script>

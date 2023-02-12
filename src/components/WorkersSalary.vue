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

      <template v-slot:body-cell-passport="props">
        <q-td :props="props">
          <div v-if="props.row.workers.passportSeries && props.row.workers.passportNumber">
            {{props.row.workers.passportSeries}} {{props.row.workers.passportNumber}}
          </div>
          <div v-else>
            -- --- -- --
          </div>
        </q-td>
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
        <q-input v-model="filter.fullName" :placeholder="$t('xshop_captions.l_worker_name')"
                 :label="$t('xshop_captions.l_worker_name')"
                 class="q-pa-md col-4" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.fullName" name="close" color="primary" @click.stop="filter.fullName = ''"
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
        <q-input v-model="bean.amount" placeholder="Маош миқдори"
                 label="Маош миқдори"
                 class="q-pa-md col-12 col-md-12" dense
                 type="number"
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>

        <q-select
          v-model="bean.workersId"
          emit-value
          map-options
          :options="workers"
          option-value="id"
          option-label="fullName"
          label="Ишчи"


          class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="bean.workersId" name="close" color="primary" @click.stop="bean.workersId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.fullName}}</div>
          </template>
        </q-select>
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
  name: "WorkersSalary",
  components: {StandartInputDialog},
  mixins: [StandartTable],
  data() {
    return {
      apiUrl: urls.WORKER_SALARY,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        amount: null,
        workersId: null
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
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
          name: 'amount',
          required: true,
          label: 'Маош миқдори (сўм)',
          align: 'left',
          field: row => this.number_format_old(row.amount, 0,'.', ''),
          sortable: true,
          classes: 'col-1 text-bold',
        },
        {
          name: 'fullName',
          field: row => row.workers.fullName,
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.workers.phone),
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'passport',
          field: row => `${row.workers.passportSeries} ${row.workers.passportNumber}`,
          label: this.$t('xshop_captions.l_pasport'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'workerType',
          field: row => row.workers.workerTypes.nameBg,
          label: this.$t('xshop_captions.l_worker_type'),
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
        {name: 'actions', align: 'center', label: "Амаллар", style:'width: 1rem'},
      ],
      data: [],
      regions: [],
      workerTypes: [],
      workers: [],
      model: 1
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
    getWorkers() {
      this.$axios.get(urls.WORKERS + '/all')
        .then(res => {
          console.log(res)
          this.workers.splice(0, this.workers.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {})
    },

    rowEdit(row) {
      this.$set(this.bean, 'workersId', row.workers.id);
      this.$set(this.bean, 'id', row.id);
      this.$set(this.bean, 'amount', row.amount);
      this.showForm();
    },
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval-1);
    }
  },
  mounted() {
    this.getWorkers()
  }
}
</script>
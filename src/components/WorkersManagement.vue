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
          <div v-if="props.row.passportSeries && props.row.passportNumber">
            {{props.row.passportSeries}} {{props.row.passportNumber}}
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
          <q-btn v-if="getUser().user.roles.id === 1" size="sm" dense color="warning" icon="mdi-eye"
                 @click.stop="goChild({ workers: {id: props.row.id, fullName: props.row.fullName}, tab: '2'})" class="q-mr-xs">
          </q-btn>
          <q-btn v-if="getUser().user.roles.id === 1" size="sm" dense color="positive" icon="mdi-table-eye" @click.stop="goChild({ workers: {id: props.row.id, fullName: props.row.fullName}, tab: '3'})" class="q-mr-sm">
          </q-btn>
          <q-btn
            v-if="!props.row.checked"
            size="sm" dense color="positive" icon="mdi-check" @click.stop="cameToWork(props.row.id, props.row.dailySalary)">
            <q-tooltip content-class="bg-dark">
              Ишга келди
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
        <q-input v-model="bean.fullName"
                 :label="$t('xshop_captions.l_fullname')"
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.phone"
                 :label="$t('xshop_captions.l_phone')"
                 mask="+### (##) ### ## ##"
                 unmasked-value
                 fill-mask
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.passportSeries"
                 :label="$t('xshop_captions.l_p_seria')"
                 class="q-pa-md q-pr-none col-5 col-md-3" dense
                 mask="AA"
                 hint="AA">
        </q-input>
        <q-input v-model="bean.passportNumber"
                 :label="$t('xshop_captions.l_p_number')"
                 class="q-pa-md q-pl-none col-7 col-md-9" dense
                 mask="#######"
                 hint="1234567">
        </q-input>

        <q-select
          v-model="bean.workerTypesId"
          emit-value
          map-options
          :options="workerTypes"
          option-value="id"
          option-label="nameBg"
          :label="$t('xshop_captions.l_worker_type')"


          class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.workerTypesId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.nameBg}}</div>
          </template>
        </q-select>

        <q-input v-model="bean.salary"
                 :label="'Иш хақи миқдори'"
                 class="q-pa-md q-pl-none col-12 col-md-12" dense
                 inputmode="number">
        </q-input>
      </div>

    </standart-input-dialog>

  </div>
</template>

<script>
import {urls} from 'src/utils/constants';
import {mapGetters, mapMutations} from 'vuex';
import {mapState} from 'vuex';
import StandartTable from "src/mixins/StandartTable";
import StandartInputDialog from "components/base/StandartInputDialog";

export default {
  name: "WorkersManagement",
  components: {StandartInputDialog},
  mixins: [StandartTable],
  data() {
    return {
      apiUrl: urls.WORKERS + "/report",
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      beanWorked: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        fullName: '',
        phone: '',
        passportSeries: '',
        passportNumber: null,
        workerTypesId: null
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
           align: 'left',
          classes: 'col-1'
        },

        {
          name: 'fullName',
          field: row => row.fullName,
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'balance',
          field: row => this.formatPrice(row.balance) + ' сўм',
          label: "Берилиши керак",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalSalary',
          field: row => this.formatPrice(row.totalSalary),
          label: 'Жами иш хақи',
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'givenSalary',
          field: row => this.formatPrice(row.givenSalary),
          label: "Берилган иш хақи",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'dailySalary',
          field: row => this.formatPrice(row.dailySalary),
          label: 'Иш хақи (кунлик)',
          format: val => `${val}`,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Амаллар", style:'width: 1rem'},
      ],
      data: [],
      regions: [],
      workerTypes: [],
      model: 1
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    goChild(val) {
      this.$emit('goTab', val)
    },

    cameToWork(id, salary) {
      this.loading = true;
      this.beanWorked.workersId = id;
      this.beanWorked.salary = salary;
      this.$axios.post(urls.WORKER_WORKED_DAYS, this.beanWorked)
        .then(response => {
          this.closeForm();
          this.refreshTable();
        }).catch(error => {
        this.showError(error)
        console.error(error);
      }).finally(() => {
        this.loading = false;
      });
    },
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

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
        <q-btn v-if="founderId" @click="goBack" class="text-capitalize" color="teal-8" outline icon="mdi-arrow-left">
          <span class="q-ml-sm">Orqaga</span>
        </q-btn>
        <date-input
          v-model="filter.fromDate"
          :label="$t('xshop_captions.l_from_date')"
          class="q-pa-sm col-2 text-white"
        />
        <date-input
          v-model="filter.toDate"
          :label="$t('xshop_captions.l_to_date')"
          class="q-pa-sm col-2 text-white"
        />

        <q-select
          v-model="filter.income"
          emit-value
          map-options
          :options="transactionsTypes"
          option-value="id"
          option-label="name"
          :label="$t('xshop_captions.l_transactions_type')"
          transition-show="flip-up"
          transition-hide="flip-down"
          outlined
          class="q-pa-sm col-2 col-md-2" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="filter.income !== null" name="close" color="primary" @click.stop="filter.income = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.name}}</div>
          </template>
        </q-select>
        <q-input v-model="filter.amount" :placeholder="$t('xshop_captions.l_amount')"
                 :label="$t('xshop_captions.l_amount')"
                 type="number"
                 class="q-pa-sm col-2" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.amount" name="close" color="primary" @click.stop="filter.amount = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>
        <q-space/>
        <q-btn icon="refresh" class="q-mr-sm bg-primary text-white" @click="refreshTable" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('xshop_captions.l_refresh') }}
          </q-tooltip>
        </q-btn>

        <q-btn v-if="founderId" icon="add" class="bg-primary text-white" @click="rowAdd" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('system.add') }}
          </q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-incomeAmount="props">
        <q-td :props="props">
          <div v-if="props.row.income">
            {{number_format_old(props.row.amount, 0, '.', ' ')}}
          </div>
          <div v-else>
            0
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-outcomeAmount="props">
        <q-td :props="props">
          <div v-if="!props.row.income">
            {{number_format_old(props.row.amount, 0, '.', ' ')}}
          </div>
          <div v-else>
            0
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
        <q-select
          :disable="founderId"
          v-model="bean.foundersId"
          emit-value
          map-options
          :options="founders"
          option-value="id"
          option-label="fullName"
          :label="$t('xshop_captions.l_founders')"
          transition-show="flip-up"
          transition-hide="flip-down"
          class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.foundersId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.fullName}}</div>
          </template>
        </q-select>
        <q-input v-model="bean.amount" :placeholder="$t('xshop_captions.l_amount')"
                 :label="$t('xshop_captions.l_amount')"
                 type="number"
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-select
          v-model="bean.income"
          emit-value
          map-options
          :options="transactionsTypes"
          option-value="id"
          option-label="name"
          :label="$t('xshop_captions.l_transactions_type')"
          transition-show="flip-up"
          transition-hide="flip-down"
          class="q-pa-md col-12 col-md-6" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.income = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.name}}</div>
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
import DateInput from "components/base/DateInput.vue";

export default {
  name: "FoundersTransactions",
  components: {DateInput, StandartInputDialog},
  mixins: [StandartTable],
  props: {
    founderId: {
      type: Number,
      default: null
    },
  },
  data() {
    return {
      apiUrl: urls.FOUNDERS_TRANSACTIONS,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        amount: null,
        income: null,
        foundersId: this.founderId,
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        descending: false,
        amount: null,
        income: null,
        fromDate: null,
        foundersId: this.founderId,
        toDate: this.$dateutil.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), 'YYYY-MM-DD'),
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
          name: 'incomeAmount',
          field: row => row.amount,
          label: this.$t('xshop_captions.l_income_amount'),
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'outcomeAmount',
          field: row => row.amount,
          label: this.$t('xshop_captions.l_outcome_amount'),
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
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
        {
          name: 'fullName',
          field: row => row.founders.fullName,
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.founders.phone),
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'passport',
          field: row => `${row.founders.passportSeries} ${row.founders.passportNumber}`,
          label: this.$t('xshop_captions.l_pasport'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Амаллар", style:'width: 1rem'},
      ],
      data: [],
      model: 1,
      founders: [],
      transactionsTypes: [
        {
          name: 'Kirim',
          id: 1
        },
        {
          name: 'Chiqim',
          id: 0
        }
      ]
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
    getFounders() {
      this.$axios.get(urls.FOUNDERS + '/all')
        .then(res => {
          console.log(res)
          this.founders.splice(0, this.founders.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {})
    },
    rowEdit(row) {
      for (let k in row) {
        this.$set(this.bean, k, row[k]);
      }
      this.$set(this.bean, 'foundersId', row.founders.id);
      this.showForm();
    },
    goBack() {
      this.$emit('goBack');
    },
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval-1);
    }
  },
  mounted() {
    this.getFounders()
  }
}
</script>

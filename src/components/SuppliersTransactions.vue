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
        <q-btn v-if="supplierId" @click="goBack" class="text-capitalize" color="teal-8" outline icon="mdi-arrow-left">
          <span class="q-ml-sm">Orqaga</span>
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
        <q-input v-model="filter.amount" :placeholder="$t('xshop_captions.l_amount')"
                 :label="$t('xshop_captions.l_amount')"
                 type="number"
                 class="q-pa-sm col-3" dense outlined>
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

        <q-btn  v-if="supplierId" icon="add" class="bg-primary text-white" @click="rowAdd" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('system.add') }}
          </q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-incomeAmount="props">
        <q-td :props="props">
          <div v-if="props.row.isPayment">
            {{formatPrice(props.row.amount)}}
          </div>
          <div v-else>
            0
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-outcomeAmount="props">
        <q-td :props="props">
          <div v-if="!props.row.isPayment">
            {{formatPrice(props.row.amount)}}
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
                           :on-validation-error="onValidationError" :loading="loading">

      <div class="row">
        <q-select
          :disable = "supplierId"
          v-model="bean.suppliersId"
          emit-value
          map-options
          :options="suppliers"
          option-value="id"
          option-label="fullName"
          label="Yetkazib beruvchi"


          class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.suppliersId = null"
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
          v-model="bean.isPayment"
          emit-value
          map-options
          :options="transactionsTypes"
          option-value="id"
          option-label="name"
          :label="$t('xshop_captions.l_transactions_type')"


          class="q-pa-md col-12 col-md-6" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.isPayment = null"
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
  name: "SuppliersTransactions",
  components: {DateInput, StandartInputDialog},
  mixins: [StandartTable],
  props: {
    supplierId: {
      type: Number,
      default: null
    },
  },
  data() {
    return {
      apiUrl: urls.SUPPLIERS_TRANSACTIONS,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        amount: null,
        isPayment: null,
        suppliersId: this.supplierId,
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        descending: false,
        amount: null,
        suppliersId: this.supplierId,
        isPayment: null,
        fromDate: null,
        toDate: null,
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
          name: 'incomeAmount',
          field: row => row.amount,
          label: this.$t('xshop_captions.l_income_amount'),

          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'outcomeAmount',
          field: row => row.amount,
          label: this.$t('xshop_captions.l_outcome_amount'),

          align: 'left',
          classes: 'col-1 text-bold',
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
          name: 'fullName',
          field: row => row.suppliers.fullName,
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.suppliers.phone),
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'passport',
          field: row => `${row.suppliers.passportSeries} ${row.suppliers.passportNumber}`,
          label: this.$t('xshop_captions.l_pasport'),
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
        {name: 'actions', align: 'center', label: "Амаллар", style:'width: 1rem'},
      ],
      data: [],
      model: 1,
      suppliers: [],
      transactionsTypes: [
        {
          name: 'Тўлов',
          id: 1
        },
        {
          name: 'Қайтариш',
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
    getSuppliers() {
      this.$axios.get(urls.SUPPLIERS + '/all')
        .then(res => {
          console.log(res)
          this.suppliers.splice(0, this.suppliers.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {})
    },
    rowEdit(row) {
      for (let k in row) {
        this.$set(this.bean, k, row[k]);
      }
      this.$set(this.bean, 'suppliersId', row.suppliers.id);
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
    this.getSuppliers()
  }
}
</script>

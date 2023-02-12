<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <div>
    <q-table
      ref="table"
      title="Xaridorlar"
      :row-key="rowKey"
      :data="data"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :pagination="filter"
      @request="refreshData"
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
        <q-btn v-if="customerId" @click="goBack" class="text-capitalize" color="teal-8" outline icon="mdi-arrow-left">
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

        <q-select
          v-model="filter.isPayment"
          emit-value
          map-options
          :options="transactionsTypes"
          option-value="id"
          option-label="name"
          :label="$t('xshop_captions.l_transactions_type')"
          outlined
          class="q-pa-sm col-2 col-md-2" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="filter.isPayment !== null" name="close" color="primary" @click.stop="filter.isPayment = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.name}}</div>
          </template>
        </q-select>
        <q-input v-model="filter.amount"
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

        <q-btn  v-if="customerId" icon="add" class="bg-primary text-white" @click="rowAdd" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('system.add') }}
          </q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <div v-if="props.row.isPayment">
            Тўлов <br> {{number_format_old(props.row.amount, 0, '.', ' ')}} сўм
          </div>
          <div v-else>
            Қайтариш <br> {{number_format_old(props.row.amount, 0, '.', ' ')}} сўм
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-paymentType="props">
        <q-td :props="props">
          <div v-if="props.row.paymentType === 1">
            Нақд
          </div>
          <div v-else>
            Пластик
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-passport="props">
        <q-td :props="props">
          <div v-if="props.row.passportSeries && props.row.passportNumber">
            {{$dateutil.formatDate(props.row.modifiedDate, 'DD.MM.YYYY')}}
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
          :disable="customerId"
          v-model="bean.customersId"
          emit-value
          map-options
          :options="customers"
          option-value="id"
          option-label="fullName"
          label="Xaridor"
          class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.customersId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.fullName}}</div>
          </template>
        </q-select>
        <q-input v-model="bean.amount"
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
          class="q-pa-md col-12 col-md-6 col-lg-6" dense
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
        <q-select
          v-model="bean.paymentType"
          emit-value
          map-options
          :options="paymentTypes"
          option-value="id"
          option-label="name"
          :label="'Нақд ёки пластик'"
          class="q-pa-md col-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.paymentType = null"
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
  name: "CustomersTransactions",
  components: {DateInput, StandartInputDialog},
  mixins: [StandartTable],
  props: {
    customerId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      apiUrl: urls.CUSTOMERS_TRANSACTIONS,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        amount: null,
        isPayment: null,
        customersId: this.customerId,
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        descending: false,
        amount: null,
        isPayment: null,
        customersId: this.customerId,
        fromDate: null,
        toDate: null,
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
          field: row => row.amount,
          label: this.$t('xshop_captions.l_income_amount') + ' сўм',
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'paymentType',
          field: row => row.paymentType,
          label: "Тўлов тури",
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
          field: row => row.customers.fullName,
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.customers.phone),
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'passport',
          field: row => `${row.customers.passportSeries} ${row.customers.passportNumber}`,
          label: this.$t('xshop_captions.l_pasport'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'modifyBy',
          field: row => row.modifiedBy,
          label: "Ўзгартирган фойдаланувчи",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'createdBy',
          field: row => row.createdBy,
          label: 'Яратган фойдаланувчи',
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Амаллар", style:'width: 1rem'},
      ],
      data: [],
      model: 1,
      customers: [],
      transactionsTypes: [
        {
          name: 'Тўлов',
          id: 1
        },
        {
          name: 'Қайтариш',
          id: 0
        }
      ],
      paymentTypes: [
        {
          name: 'Нақд',
          id: 1
        },
        {
          name: 'Пластик',
          id: 2
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
    getCustomers() {
      this.$axios.get(urls.CUSTOMERS + '/all')
        .then(res => {
          console.log(res)
          this.customers.splice(0, this.customers.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {})
    },
    rowEdit(row) {
      for (let k in row) {
        this.$set(this.bean, k, row[k]);
      }
      this.$set(this.bean, 'customersId', row.customers.id);
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
    this.getCustomers()
  }
}
</script>

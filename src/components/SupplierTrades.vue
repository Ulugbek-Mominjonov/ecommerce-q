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
        <q-select
          v-if="!supplierId"
          v-model="filter.suppliersId"
          emit-value
          map-options
          :options="suppliers"
          option-value="id"
          option-label="fullName"
          :label="$t('xshop_captions.l_suppliers')"


          outlined
          class="q-pa-sm col-2 col-md-2" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="filter.suppliersId !== null" name="close" color="primary" @click.stop="filter.suppliersId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.fullName}}</div>
          </template>
        </q-select>
        <q-btn v-if="supplierId" @click="goBack" class="text-capitalize" color="teal-8" outline icon="mdi-arrow-left">
          <span class="q-ml-sm">Orqaga</span>
        </q-btn>
        <q-select
          v-model="filter.productsId"
          emit-value
          map-options
          :options="products"
          option-value="id"
          option-label="nameBg"
          :label="$t('xshop_captions.l_products')"


          outlined
          class="q-pa-sm col-2 col-md-2" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="filter.productsId !== null" name="close" color="primary" @click.stop="filter.productsId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.nameBg}}</div>
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
        <q-input v-model="filter.price" :placeholder="$t('xshop_captions.l_cost')"
                 :label="$t('xshop_captions.l_cost')"
                 type="number"
                 class="q-pa-sm col-2" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.price" name="close" color="primary" @click.stop="filter.price = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>
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
        <q-space/>
        <div class="q-mt-sm q-ml-auto">
          <q-btn icon="refresh" class="q-mr-sm bg-primary text-white" @click="refreshTable" dense>
            <q-tooltip content-class="bg-primary">
              {{ $t('xshop_captions.l_refresh') }}
            </q-tooltip>
          </q-btn>

          <q-btn v-if="supplierId" icon="add" class="bg-primary text-white" @click="rowAdd" dense>
            <q-tooltip content-class="bg-primary">
              {{ $t('system.add') }}
            </q-tooltip>
          </q-btn>
        </div>
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
          v-model="bean.productsId"
          emit-value
          map-options
          :options="products"
          option-value="id"
          option-label="nameBg"
          :label="$t('xshop_captions.l_products')"


          class="q-pa-md col-xs-12 col-sm-6 col-md-6 col-lg-6" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="bean.productsId" name="close" color="primary" @click.stop="bean.productsId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-bean="props">
            <div>{{props.opt.nameBg}}</div>
          </template>
        </q-select>
        <q-input v-model="bean.returned" :placeholder="$t('xshop_captions.l_returned_amount')"
                 :label="$t('xshop_captions.l_returned_amount')"
                 class="q-pa-md col-12 col-md-6" dense
                 type="number"
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.amount" :placeholder="$t('xshop_captions.l_amount')"
                 :label="$t('xshop_captions.l_amount')"
                 class="q-pa-md col-12 col-md-6" dense
                 type="number"
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.price" :placeholder="$t('xshop_captions.l_cost')"
                 :label="$t('xshop_captions.l_cost')"
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
      </div>

    </standart-input-dialog>

    <standart-input-dialog :width="true" v-model="formDialog2" :model-id="null" :on-submit="onSubmitProduct"
                           :on-validation-error="onValidationError">

      <q-scroll-area style="height: 600px">
        <div class="row full-width full-height" v-for="item in productData">
          <hr class="col-12" v-if="productData.length > 1"/>
          <q-select
            v-model="item.productsId"
            emit-value
            map-options
            :options="products"
            option-value="id"
            option-label="nameBg"
            :label="$t('xshop_captions.l_products')"


            class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense
            lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
          >
            <template v-slot:append>
              <q-icon v-if="item.productsId" name="close" color="primary" @click.stop="item.productsId = null"
                      class="cursor-pointer"/>
            </template>
            <template v-slot:selected-item="props">
              <div>{{props.opt.nameBg}}</div>
            </template>
          </q-select>
          <q-input v-model="item.amount" :placeholder="$t('xshop_captions.l_amount')"
                   :label="$t('xshop_captions.l_amount')"
                   class="q-pa-md col-12 col-md-6" dense
                   type="number"
                   lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
          </q-input>
          <q-input v-model="item.price" :placeholder="$t('xshop_captions.l_cost')"
                   :label="$t('xshop_captions.l_cost')"
                   class="q-pa-md col-12 col-md-6" dense
                   lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
          </q-input>
        </div>
        <q-btn color="teal-8" icon="add" round class="q-mx-auto block q-mt-lg" @click="addProductBean"/>
      </q-scroll-area>

    </standart-input-dialog>

  </div>
</template>

<script>
import {urls} from 'src/utils/constants';
import {mapGetters, mapMutations} from 'vuex';
import {mapState} from 'vuex';
import StandartTable from "src/mixins/StandartTable";
import StandartInputDialog from "components/base/StandartInputDialog";
import DateInput from "components/base/DateInput.vue";

export default {
  name: "SupplierTrades",
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
      apiUrl: urls.SUPPLIER_TRADES,
      loading: false,
      rowKey: 'id',
      width: 700,
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        amount: null,
        price: null,
        returned: null,
        productsId: null,
        suppliersId: this.supplierId,
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        descending: false,
        suppliersId: this.supplierId,
        productsId: null,
        fromDate: null,
        toDate: null,
        amount: null,
        price: null
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
          name: 'NameBg',
          field: row => row.products.nameBg,
          label: this.$t('xshop_captions.l_name_bg'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'amount',
          field: row => this.number_format_old(row.amount, 0, '.', ' ') + " " + row.products.measureTypes.nameBg,
          label: this.$t('xshop_captions.l_buy_product'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'price',
          field: row => this.number_format_old(row.price, 0, '.', ' '),
          label: this.$t('xshop_captions.l_one_product_cost'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'allPrice',
          field: row => this.number_format_old(row.price * row.amount, 0, '.', ' '),
          label: this.$t('xshop_captions.l_all'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'returned',
          field: row => this.number_format_old(row.returned, 0, '.', ' ') + " " + row.products.measureTypes.nameBg,
          label: this.$t('xshop_captions.l_returned_amount'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'returnPrice',
          field: row => this.number_format_old(row.price * row.returned, 0, '.', ' '),
          label: this.$t('xshop_captions.l_returned_summ'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'fullName',
          field: row => row.suppliers.fullName,
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.suppliers.phone),
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'passport',
          field: row => `${row.suppliers.passportSeries} ${row.suppliers.passportNumber}`,
          label: this.$t('xshop_captions.l_pasport'),
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
      suppliers: [],
      products: [],
      productData: [],
      model: 1,
      formDialog2: false,
      options: {
        // name: '_self',
        specs: [
          'fullscreen=yes',
          'titlebar=yes',
          'scrollbars=yes'
        ],
        styles: [
          'https://cdn.jsdelivr.net/npm/quasar@1.22.5/dist/quasar.min.css'
        ]
      },
      columnsPrint: [
        {
          name: 'name',
          required: true,
          label: 'Mahsulot nomi',
          align: 'left',
          field: row => row.productsId,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'cost',
          required: true,
          label: 'Mahsulot narxi',
          align: 'left',
          field: row => this.number_format_old(row.price, 0,'.', ''),
          sortable: true
        },
        {
          name: 'amount',
          required: true,
          label: 'Mahsulot miqdori',
          align: 'left',
          field: row => this.number_format_old(row.amount, 0,'.', ''),
          sortable: true
        }
      ],
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    },
    user() {
      return this.getUser()
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    goBack() {
      this.$emit('goBack');
    },
    getSuppliers() {
      this.$axios.get(urls.SUPPLIERS + '/all')
        .then(res => {
          this.suppliers.splice(0, this.suppliers.length, ...res.data)
        }).catch(err => {
          this.showError(err)
      }).finally(() => {})
    },

    getProducts() {
      this.$axios.get(urls.PRODUCTS + '/all')
        .then(res => {
          this.products.splice(0, this.products.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {})
    },

    rowEdit(row) {
      this.$set(this.bean, 'amount', row.amount);
      this.$set(this.bean, 'id', row.id);
      this.$set(this.bean, 'price', row.price);
      this.$set(this.bean, 'productsId', row.products.id);
      this.$set(this.bean, 'returned', row.returned);
      this.$set(this.bean, 'suppliersId', row.suppliers.id);
      this.showForm();
    },
    rowAdd() {
      this.productData = []
      let productBeanDefault = {
          suppliersId: this.supplierId,
          productsId: null,
          price: null,
          amount: null,
      }
      this.productData.push(productBeanDefault)
      this.showForm2();
    },
    showForm2() {
      this.formDialog2 = true;
    },
    closeForm2() {
      this.formDialog2 = false;
    },
    addProductBean() {
      let productBeanDefault = {
        suppliersId: this.supplierId,
        productsId: null,
        price: null,
        amount: null,
      }
      this.productData.push(productBeanDefault)
    },
    onSubmitProduct() {
      this.$axios.post(this.apiUrl, this.productData)
        .then(response => {
          this.closeForm2();
          this.refreshTable();
        }).catch(error => {
        console.error(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    printMe() {
      this.$htmlToPaper('print', this.options)
      this.print = false
    }
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval-1);
    }
  },
  mounted() {
    this.getSuppliers();
    this.getProducts();
  }
}
</script>

<style lang="scss">
#print {
  display: none;
}

</style>

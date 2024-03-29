<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="row">
    <div class="col-8">
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
        @row-click="singleRowClick"
        :dense="$q.screen.lt.md"
        :grid="$q.screen.xs"
        class="sticky-first-column-table sticky-last-column-table q-mt-lg"
        style="height: calc(100vh - 150px)"
      >
        <template v-slot:no-data="props">
          {{$t('system.no_matching_found')}}
        </template>

        <template v-slot:body-cell-ownerName="props">
          <q-td :props="props">
            <div v-if="props.row.ownerName">
              <b>Фио:</b> {{props.row.ownerName}}<br>
              <b>Тел:</b> {{props.row.phone}}
            </div>
            <div v-else>
              --.--.----
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

        <template v-slot:body-cell-qrcode="props">
          <q-td :props="props">
            <div v-if="props.row.qrcode && getUser().user.roles.id === 1">
              <q-btn size="sm" dense color="positive" icon="mdi-eye" @click.stop="showQueryCode(props.row)" class="q-mr-sm">
                <q-tooltip content-class="bg-positive">
                  Query кодни кўриш
                </q-tooltip>
              </q-btn>
              <span>{{props.row.qrcode}}</span>
            </div>
            <div v-else>
              Берилмаган
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn v-if="getUser().user.roles.id === 1" size="sm" dense color="secondary" icon="edit" @click.stop="rowEdit(props.row)" class="q-mr-xs">
              <q-tooltip content-class="bg-secondary">
                {{$t('system.edit')}}
              </q-tooltip>
            </q-btn>
            <q-btn v-if="getUser().user.roles.id === 1" size="sm" dense color="negative" icon="delete" @click.stop="rowDelete(props.row)" class="q-mr-sm">
              <q-tooltip content-class="bg-negative">
                {{$t('system.delete')}}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:top="props">
          <q-input v-model="filter.storeName"
                   label="Дўкон номи"
                   class="q-pa-sm col-4" dense outlined>
            <template v-slot:append>
              <q-icon v-if="filter.storeName" name="close" color="primary" @click.stop="filter.storeName = ''"
                      class="cursor-pointer"/>
            </template>
          </q-input>

          <q-input v-model="filter.ownerName"
                   label="Дўкон егаси"
                   class="q-pa-sm col-3" dense outlined>
            <template v-slot:append>
              <q-icon v-if="filter.ownerName" name="close" color="primary" @click.stop="filter.ownerName = ''"
                      class="cursor-pointer"/>
            </template>
          </q-input>

          <q-input v-model="filter.phone"
                   label="Телефон"
                   mask="(##) ### ## ##"
                   unmasked-value
                   fill-mask
                   class="q-pa-sm col-4" dense outlined>
            <template v-slot:append>
              <q-icon v-if="filter.phone" name="close" color="primary" @click.stop="filter.phone = ''"
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
    </div>
    <div class="col-4 q-pt-lg q-pl-md">
      <q-toolbar class="bg-primary text-white shadow-2 col-12" style="min-height: 40px !important;">
        <q-toolbar-title class="text-subtitle1">Дўкон жойлашуви</q-toolbar-title>
      </q-toolbar>
      <div style="width: 100%; height: calc(100% - 40px); overflow: hidden">
        <yandex-map
          :coords="coords"
          :zoom="10"
          @click="onClick"
        >
          <ymap-marker
            :coords="coords"
            marker-id="123"
            :hint-content="storeName"
          />
        </yandex-map>
      </div>
    </div>

    <!--DIALOG-->
    <standart-input-dialog v-model="formDialog" :model-id="bean.id" :on-submit="onSubmit"
                           :on-validation-error="onValidationError" :loading="loading">

      <div class="row">
        <q-input v-model="bean.storeName" :placeholder="$t('xshop_captions.l_name')"
                 :label="'Дўкон номи'"
                 class="q-pa-md col-12" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
      </div>

      <div class="row">
        <q-input v-model="bean.ownerName"
                 :label="'Дўкон егаси'"
                 class="q-pa-md col-12" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
      </div>

      <div class="row">
        <q-input v-model="bean.phone"
                 :label="$t('xshop_captions.l_phone')"
                 class="q-pa-md col-12" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
      </div>

      <div class="row">
        <q-input v-model="bean.address" :placeholder="$t('xshop_captions.l_name')"
                 :label="$t('xshop_captions.l_name')"
                 class="q-pa-md col-12" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
      </div>
      <div class="row">
        <q-input v-model="bean.qrcode"
                 :label="'Код'"
                 class="q-pa-md col-12" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
      </div>

    </standart-input-dialog>

    <q-dialog v-model="qrDialog">
      <q-card>
        <q-bar>
          <span style="font-size: 15px">Query kod</span>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Ёпиш</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <img :src="qrUrl" alt="">
          <div class="flex justify-between" v-if="qrData">
            <span>Дўкон:</span>
            <span class="text-bold">{{qrData.storeName}}</span>
          </div>
          <div class="flex justify-between" v-if="qrData">
            <span>Дўкон егаси:</span>
            <span class="text-bold">{{qrData.ownerName}}</span>
          </div>
          <div class="flex justify-between" v-if="qrData">
            <span>Телефон:</span>
            <span class="text-bold">{{qrData.phone}}</span>
          </div>
          <div class="flex justify-between" v-if="qrData">
            <span>Манзил:</span>
            <span class="text-bold">{{qrData.address}}</span>
          </div>
          <div class="text-center">
            {{currentDate}}
          </div>
        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Ёпиш" />
          <q-btn v-close-popup @click="printMe" flat color="primary" round icon="mdi-printer">
            <q-tooltip class="bg-primary">
              Печатга бериш
            </q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div v-if="qrData" id="print" class="text-center" style="margin: 0 auto;" :style="[qrDialog ? {'display': 'block'} : {'display': 'none'}]">
      <img :src="qrUrl" style="margin: 0 auto;">
      <div style="width: 300px;" >
        <div class="flex justify-between">
          <span>Дўкон:</span>
          <span class="text-bold">{{qrData.storeName}}</span>
        </div>
        <div class="flex justify-between">
          <span>Дўкон егаси:</span>
          <span class="text-bold">{{qrData.ownerName}}</span>
        </div>
        <div class="flex justify-between">
          <span>Телефон:</span>
          <span class="text-bold">{{qrData.phone}}</span>
        </div>
        <div class="flex justify-between">
          <span>Манзил:</span>
          <span class="text-bold">{{qrData.address}}</span>
        </div>
        <div class="text-center">
          {{currentDate}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {urls} from 'src/utils/constants';
import {mapGetters} from 'vuex';
import StandartTable from "src/mixins/StandartTable";
import StandartInputDialog from "components/base/StandartInputDialog";
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

export default {
  name: "Stores",
  components: {StandartInputDialog, yandexMap, ymapMarker},
  mixins: [StandartTable],
  data() {
    return {
      coords: [
        54.82896654088406,
        39.831893822753904,
      ],
      apiUrl: urls.STORES,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        storeName: '',
        ownerName: '',
        phone: '',
        address: '',
        qrcode: ''
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        descending: false,
        storeName: "",
        ownerName: "",
        phone: "",
      },
      columns: [
        {
          name: 'id',
          field: 'id',
          label: this.$t('xshop_captions.l_id'),
           align: 'left',
          classes: '1rem'
        },

        {
          name: 'storeName',
          field: row => row.storeName,
          label: "Дўкон номи",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'ownerName',
          field: row => row.ownerName,
          label: "Дўкон егаси",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'address',
          field: row => row.address,
          label: "Дўкон манзили",
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
          name: 'qrcode',
          field: row => row.qrCode,
          label: "Код",
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
      regions: [],
      model: 1,
      storeName: "",
      qrUrl: "",
      qrDialog: false,
      qrData: null,
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
      currentDate: this.$dateutil.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes()), 'DD.MM.YYYY HH:mm'),
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
    showQueryCode(row) {
      this.qrData = row
      console.log(row)
      this.qrUrl = 'https://chart.googleapis.com/chart?cht=qr&chs=' + 300 + 'x' + 300 + "&chl=" +  encodeURIComponent(row.qrcode);
      this.qrDialog = true
    },
    printMe() {
      this.$htmlToPaper('print', this.options)
      this.qrDialog = false
    },
    onClick(e) {
      this.coords = e.get('coords');
    },
    singleRowClick(evt, row) {
      const table = this.$refs.table;
      if (table.selected.shift() === row) {
        table.selected.shift()
      } else {
        table.selected.push(row)
        this.storeName = row.storeName
        this.coords = []
        this.coords.push(row.latitude, row.longitude)
      }
    },
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval-1);
    },
    data: function (val) {
      setTimeout(() => {
        this.storeName = val[0].storeName
        this.coords = []
        this.coords.push(val[0].latitude, val[0].longitude);
      }, 1000)
      this.selectedRows.push(val[0])
    }
  },
  mounted() {
  }
}
</script>

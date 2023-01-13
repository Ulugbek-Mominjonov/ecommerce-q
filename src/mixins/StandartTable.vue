<script>
import {Cookies} from 'quasar'

export default {
  name: "StandartTable",
  date() {
    return {}
  },
  created() {
    let el = this.$store.state.currentRouteName
    if (Cookies.get(el) !== null) {
      this.filter = Cookies.get(el)
    }
  },
  mounted() {
    this.refreshData({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  methods: {
    refreshTable() {
      this.refreshData({
        filter: this.filter
      })
    },
    refreshData(props) {
      this.loading = true;
      this.pagedGet(this.apiUrl, props.filter)
        .then(response => {
          if (!response)
            return;

          this.pagination.rowsNumber = response.data.totalElements;
          this.data.splice(0, this.data.length, ...response.data.content);
        })
        .catch(e => {
          console.error(e);
        }).finally(() => {
        this.loading = false;
      });

    },
    showForm() {
      this.formDialog = true;
    },
    closeForm() {
      if (this.pinned) {
        this.bean = Object.assign({}, this.beanDefault);
        return;
      }

      this.formDialog = false;
    },
    rowAdd() {
      this.bean = Object.assign({}, this.beanDefault);
      this.showForm();
    },
    rowAddPreBean(preBean) {
      this.bean = preBean;
      this.showForm();
    },

    rowEdit(row) {
      for (let k in row) {
        this.$set(this.bean, k, row[k]);
      }
      this.showForm();
    },
    onSubmit() {
      if (!!this.bean.id) {
        this.loading = true;
        this.$axios.put(this.apiUrl, this.bean)
          .then(response => {
            this.closeForm();
            this.refreshTable();
          }).catch(error => {
          console.error(error);
        }).finally(() => {
          this.loading = false;
        });
      } else {
        this.loading = true;
        this.$axios.post(this.apiUrl, this.bean)
          .then(response => {
            this.closeForm();
            this.refreshTable();
          }).catch(error => {
          console.error(error);
        }).finally(() => {
          this.loading = false;
        });

      }
    },
    onValidationError() {
    },
    rowDelete(row) {
      this.ask(this.$t('app_name'), this.$t('system.confirm', [row.id]), () => {
        this.$axios.delete(this.apiUrl + '/' + row.id)
          .then(response => {
            this.refreshTable();
          }).catch(error => {
          console.error(error);
        });
      });

    },
    rowDeleteWithTitle(row, title) {
      this.ask(this.$t(title), this.$t('system.confirm', [row.id]), () => {
        this.$axios.delete(this.apiUrl + '/' + row.id)
          .then(response => {
            this.refreshTable();
          }).catch(error => {
          console.error(error);
        });
      });

    },
    rowClick(evt, row) {
      const table = this.$refs.table;
      const rowKey = 'id';
      if (table.selected.filter(item => item[rowKey] === row[rowKey]).length > 0) {
        table.$emit('update:selected', table.selected.filter(item => item[rowKey] !== row[rowKey]));
      } else {
        if (table.singleSelection) {
          table.$emit('update:selected', [row]);
        } else {
          table.$emit('update:selected', table.selected.concat(row));
        }
      }
    },
    singleRowClick(evt, row) {
      const table = this.$refs.table;
      if (table.selected.shift() == row) {
        table.selected.shift()
      } else {
        table.selected.push(row)
      }
    },

  },
  watch: {
    filter: {
      handler(new_val, old_val) {
        let el = this.$store.state.currentRouteName
        Cookies.set(el, JSON.stringify(new_val), {expires: '30min'})
      },
      deep: true,
    }
  }

}
</script>

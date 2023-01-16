<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <q-input :value="value" @change="e => updateValue(e)"
           :label="label" :placeholder="placeholder" :hint="hint" mask="####-##-##" dense stack-label outlined >
    <template v-slot:append>
      <q-icon v-if="value" name="close" @click.stop="clearValue(null)"
              class="cursor-pointer"/>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date :value="value" @input="e => updateDateValue(e)" mask="YYYY-MM-DD"/>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
export default {
  name: 'DateInput',
  props: {
    value: {type: String},
    label: {type: String},
    placeholder: {type: String},
    hint: {type: String},
  },
  data() {
    return {}
  },
  methods: {
    clearValue(v) {
      this.$emit('input', v);
    },
    updateValue: function (ev) {
      this.$emit('input', ev.target.value);
    },
    updateDateValue: function (ev) {
      this.$refs.qDateProxy.hide();
      this.$emit('input', ev);
    },

  }
}
</script>

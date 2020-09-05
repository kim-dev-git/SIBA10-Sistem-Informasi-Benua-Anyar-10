<template>
  <div id="data-list">
    <v-data-table
      :mobile-breakpoint="0"
      :headers="headers"
      :items="items"
      :sort-by="sortBy ? sortBy : 'createdAt'"
      :sort-desc="desc">

      <template #body="props">
        <tbody>
        <tr v-for="(item, idx) in props.items" :key="idx"
          @click="onClick(item)">
          <td v-for="header in headers" :key="header.value">
            <slot name="row"
              :item="item"
              :value="item[header.value]"
              :header="header">
              <p
                v-if="header.value !== 'action'"
                class="py-4"
                :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
                v-text="item[header.value] ? item[header.value] : '-'"
              />
            </slot>

            <v-layout id="action"
              v-if="header.value === 'action'" >
              <v-divider class="mr-4" vertical />
              <div
                v-for="(menu, i) in menuActions"
                :key="i">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      @click.stop="menuAction(menu.action, item)"
                      color="info"
                      icon>
                      <v-icon v-text="menu.icon" :color="menu.color" />
                    </v-btn>
                  </template>
                  <span v-text="menu.text" />
                </v-tooltip>
              </div>
            </v-layout>
          </td>
        </tr>
        </tbody>
      </template>

    </v-data-table>
  </div>
</template>

<script>

export default {
  props: [
    'headers',
    'items',
    'sortBy',
    'desc',
  ],
  data: () => ({
    menuActions: [
      { text: 'Edit', icon: 'mdi-file-document-edit-outline', color: 'primary', action: 'edit' },
      { text: 'Hapus', icon: 'mdi-delete-outline', color: 'error', action: 'remove' },
    ],
  }),
  methods: {
    menuAction(action, item) {
      this.$emit(action, item)
    },
    onClick(item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style>

</style>
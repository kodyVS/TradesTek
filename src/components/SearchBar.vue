<script>
//! Currently not in use - Will delete in the future
</script>

<template>
  <div class="Search">
    <h1>Overview</h1>
    <v-container>
      <v-autocomplete
        v-model="model"
        :filter="filterObject"
        :items="items"
        label="Search"
        chips
        hide-no-data
        hide-selected
        clearable
        return-object
        item-text="FullName"
        dense
      >
        <template v-slot:item="data">
          <v-list-item-content>
            <v-list-item-title>{{ data.item.FullName }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ data.item.Phone }}
              <span class="caption">{{ data.item.Company }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-autocomplete>
    </v-container>
    <p>{{ model }}</p>
  </div>
</template>

<script>
export default {
  props: ["items"],
  data: () => ({
    model: null,
  }),
  computed: () => {},
  created: () => {
    this.items = this.$store.state.customerList;
  },
  methods: {
    filterObject(item, queryText, itemText) {
      if (!item.Phone) {
        item.Phone = "";
      }
      if (!item.Company) {
        item.Company = "";
      }
      console.log(item, queryText, itemText);
      return (
        item.FullName.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.Phone.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.Company.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
      );
    },
  },
};
</script>

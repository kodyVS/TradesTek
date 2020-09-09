<template>
  <div>
    <v-container>
      <v-autocomplete
        :items="items"
        label="Search"
        hide-no-data
        clearable
        return-object
        item-text="description"
      ></v-autocomplete>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    model: null,
    items: [
      {
        text: "hello",
        description: "something",
        date: "2020"
      },
      {
        tex: "bye",
        description: "no",
        date: "2021"
      }
    ]
  }),
  methods: {
    filterObject(item, queryText, itemText) {
      console.log(item, queryText, itemText);
      return (
        item.text.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
        -1
      );
    }
  }
};
</script>

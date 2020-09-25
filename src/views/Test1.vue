<template>
  <div class="mt-12">
    <h2 class="mb-3">Customer List</h2>

    <!--<template>
      <v-autocomplete
        v-model="selectedEmployees"
        :items="employees"
        filled
        chips
        color="blue-grey lighten-2"
        label="Select"
        item-text="name"
        item-value="name"
        multiple
      >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            color="blue darken-2 white--text"
            @click="data.select"
            @click:close="remove(data.item)"
          >
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-slot:item="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle
                v-html="data.item.group"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </template> -->

    <!-- Search function -->

    <div class="Search">
      <v-container>
        <v-autocomplete
          v-model="model"
          :items="items"
          label="Search"
          chips
          hide-no-data
          hide-selected
          clearable
          return-object
          item-text="FullName"
          dense
          :disabled="!readOnly"
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
    </div>
    <!-- Card -->

    <v-card v-if="model" class="mx-12" color="grey lighten-3">
      <v-card-title
        :class="
          readOnly
            ? 'pt-3 pl-3 secondary white--text'
            : 'pt-3 pl-3 warning white--text'
        "
        >{{ model.FullName }}</v-card-title
      >
      <v-form class="mt-8">
        <v-container>
          <v-row>
            <!-- Full Name for Customer Name -->
            <v-col cols="12" md="4">
              <v-text-field
                class="grey--text"
                :value="model.FullName"
                label="Customer Name"
                outlined
                :readonly="true"
                dense
              ></v-text-field>
            </v-col>
            <!-- Name of Contact -->
            <v-col cols="12" md="2">
              <v-text-field
                :value="`${model.FirstName ? model.FirstName : ''} ${
                  model.LastName ? model.LastName : ''
                }`"
                :clearable="!readOnly"
                label="Contacts Name"
                outlined
                :readonly="readOnly"
                dense
              ></v-text-field>
            </v-col>

            <!-- Phone Number -->
            <v-col cols="12" md="2">
              <v-text-field
                :value="model.Phone"
                label="Phone Number"
                outlined
                :clearable="!readOnly"
                dense
                :readonly="readOnly"
              ></v-text-field>
            </v-col>

            <!-- Email -->
            <v-col cols="12" md="3">
              <v-text-field
                :value="model.Email"
                label="Email"
                outlined
                :clearable="!readOnly"
                dense
                :readonly="readOnly"
              ></v-text-field>
            </v-col>

            <!-- Billing Address -->
            <v-col cols="12" md="4">
              <v-text-field
                :value="
                  model.BillAddress
                    ? `${model.BillAddress.Addr1} ${
                        model.BillAddress.City ? model.BillAddress.City : ''
                      }`
                    : ''
                "
                label="Address"
                outlined
                :clearable="!readOnly"
                dense
                :readonly="readOnly"
              ></v-text-field>

              <!-- <v-text-field v-else value label="Address" outlined clearable></v-text-field> -->
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                :value="`${model.BillAddress ? model.BillAddress.City : ''}`"
                label="city"
                outlined
                :clearable="!readOnly"
                dense
                :readonly="readOnly"
              ></v-text-field>
            </v-col>
            <!-- Postal Code -->
            <v-col cols="6" md="2">
              <v-text-field
                :value="
                  model.BillAddress
                    ? `${
                        model.BillAddress.PostalCode
                          ? model.BillAddress.PostalCode
                          : ''
                      }`
                    : ''
                "
                label="Postal Code"
                outlined
                dense
                :readonly="readOnly"
                :clearable="!readOnly"
              ></v-text-field>
            </v-col>

            <!-- PO Number -->
            <v-col cols="12" md="2">
              <v-text-field
                value="17921"
                label="PO Number"
                outlined
                dense
                :readonly="true"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Buttons -->
          <v-layout align-end justify-end>
            <v-btn color="primary">Create WO</v-btn>
            <v-btn v-if="readOnly" color="warning" @click="readOnly = !readOnly"
              >Edit Customer</v-btn
            >
          </v-layout>
          <v-btn
            v-if="!readOnly"
            large
            color="success"
            @click="readOnly = !readOnly"
            >Save Changes</v-btn
          >
        </v-container>
      </v-form>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="20"
      :search="model"
      class
    ></v-data-table>
  </div>
</template>
<script>
export default {
  //   data() {
  //     const srcs = {
  //       1: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
  //       2: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
  //       3: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
  //       4: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
  //       5: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
  //     };

  //     return {
  //       autoUpdate: true,
  //       selectedEmployees: ["Sandra Adams", "Britta Holt"],
  //       isUpdating: false,
  //       name: "Midnight Crew",
  //       employees: [
  //         { name: "Sandra Adams", group: "HVAC", avatar: srcs[1] },
  //         { name: "Ali Connors", group: "HVAC", avatar: srcs[2] },
  //         { name: "Trevor Hansen", group: "HVAC", avatar: srcs[3] },
  //         { name: "Tucker Smith", group: "HVAC", avatar: srcs[2] },
  //         { name: "Britta Holt", group: "Plumber", avatar: srcs[4] },
  //         { name: "Jane Smith ", group: "Plumber", avatar: srcs[5] },
  //         { name: "John Smith", group: "Plumber", avatar: srcs[1] },
  //         { name: "Sandra Williams", group: "Plumber", avatar: srcs[3] },
  //       ],
  //       title: "The summer breeze",
  //     };
  //   },

  //   watch: {
  //     isUpdating(val) {
  //       if (val) {
  //         setTimeout(() => (this.isUpdating = false), 3000);
  //       }
  //     },
  //   },

  //   methods: {
  //     remove(item) {
  //       const index = this.selectedEmployees.indexOf(item.name);
  //       if (index >= 0) this.selectedEmployees.splice(index, 1);
  //     },
  //   },
  // };

  data: () => ({
    model: "",
    customerNames: [],
    items: [],
    hello: "",
    readOnly: true,
    headers: [
      {
        text: "Company Name",
        align: "start",
        value: "FullName",
      },
      { text: "Email", value: "Email" },
      { text: "Phone", value: "Phone" },
    ],
  }),
  watch: {
    model: function (val) {
      console.log(val);
    },
  },
  created() {
    this.items = this.$store.state.customerList;
  },

  methods: {
    filterObject(item, queryText) {
      if (!item.Phone) {
        item.Phone = "";
      }
      if (!item.Company) {
        item.Company = "";
      }
      return (
        item.FullName.toLocaleLowerCase().indexOf(
          queryText.toLocaleLowerCase()
        ) > -1 ||
        item.Phone.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1 ||
        item.Company.toLocaleLowerCase().indexOf(
          queryText.toLocaleLowerCase()
        ) > -1
      );
    },
  },
};
</script>

<style scoped></style>

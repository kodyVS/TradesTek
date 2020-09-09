/* eslint-disable */
<template>
  <div>
    <v-container mb-4>
      <v-row justify="center">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Customers"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="calories"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat color="secondary">
          <v-toolbar-title class="white--text">Customer List</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="90%" :persistent="!readOnly">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on">New Customer</v-btn>
            </template>
            <v-card class color="grey lighten-3">
              <v-card-title
                :class="readOnly ? 'pt-3 pl-3 secondary white--text' : 'pt-3 pl-3 warning white--text'"
              >{{ editedItem.FullName }}</v-card-title>
              <v-form class="mt-8">
                <v-container>
                  <v-row>
                    <!-- Full Name for Customer Name -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="grey--text"
                        v-model="editedItem.FullName"
                        label="Customer Name"
                        outlined
                        :readonly="true"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- Name of Contact -->
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="editedItem.FirstName"
                        :clearable="!readOnly"
                        label="First Name"
                        outlined
                        :readonly="readOnly"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="editedItem.LastName"
                        :clearable="!readOnly"
                        label="Last Name"
                        outlined
                        :readonly="readOnly"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- Phone Number -->
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="editedItem.Phone"
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
                        v-model="editedItem.Email"
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
                        :value="editedItem.BillAddress ? editedItem.BillAddress.Addr1 : ''"
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
                        :value="`${editedItem.BillAddress? editedItem.BillAddress.City : ''}`"
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
                        :value="editedItem.BillAddress ? `${editedItem.BillAddress.PostalCode? editedItem.BillAddress.PostalCode : ''}` : ''"
                        label="Postal Code"
                        outlined
                        dense
                        :readonly="readOnly"
                        :clearable="!readOnly"
                      ></v-text-field>
                    </v-col>

                    <!-- PO Number -->
                    <v-col cols="12" md="2">
                      <v-text-field value="17921" label="PO Number" outlined dense :readonly="true"></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Buttons -->
                  <v-layout align-end justify-end>
                    <v-btn v-if="readOnly" color="primary">Create WO</v-btn>
                    <v-btn
                      color="warning"
                      v-if="readOnly"
                      @click="readOnly = !readOnly"
                    >Edit Customer</v-btn>
                  </v-layout>
                  <v-btn
                    large
                    color="success"
                    v-if="!readOnly"
                    @click="dialog = !dialog; readOnly = !readOnly"
                  >Save Changes</v-btn>
                  <v-btn
                    large
                    color="primary"
                    v-if="!readOnly"
                    @click="dialog = !dialog; readOnly = !readOnly"
                  >cancel</v-btn>
                </v-container>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <template v-slot:item.actions="{ item }">
        <v-btn small class="success" @click="editItem(item)">Details</v-btn>
        <v-btn small class="primary ml-2">Create WO</v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Resest</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      readOnly: true,
      desserts: [],
      search: '',
      headers: [
          {
            text: 'Company Name',
            align: 'start',
            value: 'FullName',
          },
          { text: 'Email', value: 'Email', sortable: false},
          { text: 'Phone', value: 'Phone', sortable: false },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      items: [],
      editedIndex: -1,
      editedItem: {
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
          this.readOnly = true 
          val || this.close();
      }
    },

    created () {
      this.items = this.$store.state.customerList;
      this.initialize()
    },

    methods: {
      initialize () {
        this.desserts = [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
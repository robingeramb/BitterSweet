import { defineStore } from "pinia";

export const useProductsStore = defineStore({
  id: "productsStore",
  state: () => ({
    products: {
      penneRigateNoodle: {
        sugarAmount: 20,
        productName: "Penne Rigate Nudeln",
        amount: 500,
        scale: 0.33,
        model: "Nudeln.glb",
        amountPerPortion: 330,
        category: "noodles",
      },
      monster: {
        sugarAmount: 20,
        productName: "Monster energy",
        amount: 500,
        scale: 0.25,
        rotation: -Math.PI,
        model: "monster.glb",
        meshMode: false,
        amountPerPortion: 330,
        category: "noodles",
      },
      coke: {
        sugarAmount: 7,
        productName: "Coke",
        scale: 0.34,
        rotation: 0,
        model: "colaglassCenter.glb",
        meshMode: false,
        amount: 150,
        amountPerPortion: 150,
        category: "fruit",
      },
      tomatosauce: {
        sugarAmount: 7,
        productName: "Tomatensauce",
        scale: 0.2,
        rotation: 0,
        model: "tomatensauce.glb",
        meshMode: false,
        amount: 150,
        amountPerPortion: 150,
        category: "fruit",
      },
      chips: {
        sugarAmount: 2,
        productName: "Chips",
        scale: 0.35,
        meshMode: false,
        model: "chips.glb",
        amount: 500,
        amountPerPortion: 50,
        category: "bakery",
      },
    },
    shelves: [
      {
        name: "Noodles",
        boards: [
          {
            repeat: 4,
            products: [
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
            ],
          },
        ],
      },
      {
        name: "Drinks",
        boards: [
          {
            repeat: 2,
            products: [
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
            ],
          },
          {
            repeat: 2,
            products: [
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
            ],
          },
        ],
      },
      {
        name: "Noodles",
        boards: [
          {
            repeat: 4,
            products: [
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
            ],
          },
        ],
      },
      {
        name: "Drinks",
        boards: [
          {
            repeat: 2,
            products: [
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
            ],
          },
          {
            repeat: 2,
            products: [
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
            ],
          },
        ],
      },
      {
        name: "Noodles",
        boards: [
          {
            repeat: 4,
            products: [
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
              "penneRigateNoodle",
            ],
          },
        ],
      },
      {
        name: "Drinks",
        boards: [
          {
            repeat: 2,
            products: [
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
              "monster",
            ],
          },
          {
            repeat: 2,
            products: [
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
              "coke",
            ],
          },
        ],
      },
      {
        name: "Sauces",
        boards: [
          {
            repeat: 4,
            products: [
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
            ],
          },
        ],
      },

      {
        name: "Snack",
        boards: [
          {
            repeat: 4,
            products: [
              "chips",
              "chips",
              "chips",
              "chips",
              "chips",
              "chips",
              "chips",
            ],
          },
        ],
      },
      {
        name: "Sauces",
        boards: [
          {
            repeat: 4,
            products: [
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
              "tomatosauce",
            ],
          },
        ],
      },

      {
        name: "Snack",
        boards: [
          {
            repeat: 4,
            products: [
              "chips",
              "chips",
              "chips",
              "chips",
              "chips",
              "chips",
              "chips",
            ],
          },
        ],
      },
    ],
  }),
  getters: {
    getItemsByCategory: (state) => (category: string) => {
      return state.products.filter((item) => item.category === category);
    },
    getAllItems: (state) => () => {
      return state.products;
    },
  },
  actions: {},
});

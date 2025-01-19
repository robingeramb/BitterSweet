import { defineStore } from "pinia";

export const useProductsStore = defineStore({
  id: "productsStore",
  state: () => ({
    products: {
      penneRigateNoodle: {
        sugarAmount: 20,
        productName: "Penne Rigate Nudeln",
        amount: 500,
        model: "Nudeln_Penne.glb",
        meshMode: false,
        rotation: Math.PI/2,
        amountPerPortion: 330,
        category: "noodles",
      },
      fusilliNoodle: {
        sugarAmount: 20,
        productName: "Fusilli Nudeln",
        amount: 500,
        model: "Nudeln_Fusilli.glb",
        meshMode: false,
        rotation: Math.PI/2,
        amountPerPortion: 330,
        category: "noodles",
      },
      spaghettiNoodle: {
        sugarAmount: 17.5,
        productName: "Spaghetti Nudeln",
        amount: 500,
        model: "Nudeln_Spaghetti.glb",
        meshMode: false,
        rotation: Math.PI/2,
        amountPerPortion: 330,
        category: "noodles",
      },
      finishedDishNoodle: {
        sugarAmount: 8.8,
        productName: "Finished Dish",
        amount: 367.2,
        scale: 0.28,
        model: "Nudeln_finishedDish.glb",
        meshMode: false,
        rotation: Math.PI/2,
        amountPerPortion: 125.4,
        category: "fertig",
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
        category: "drinks",
      },
      canCola: {
        sugarAmount: 35,
        productName: "Cola Cola",
        amount: 330,
        scale: 0.2,
        rotation: Math.PI/4,
        model: "can_cola.glb",
        meshMode: false,
        amountPerPortion: 330,
        category: "drinks",
      },
      canFanta: {
        sugarAmount: 43.6,
        productName: "Orange Soda",
        amount: 330,
        scale: 0.2,
        rotation: Math.PI/4,
        model: "can_fanta.glb",
        meshMode: false,
        amountPerPortion: 330,
        category: "drinks",
      },
      canSprite: {
        sugarAmount: 29.7,
        productName: "Citrus Soda",
        amount: 330,
        scale: 0.2,
        rotation: Math.PI/4,
        model: "can_sprite.glb",
        meshMode: false,
        amountPerPortion: 330,
        category: "drinks",
      },
      water: {
        sugarAmount: 0,
        productName: "Water",
        amount: 1000,
        rotation: Math.PI/4,
        scale: 0.4,
        model: "water.glb",
        meshMode: false,
        amountPerPortion: 330,
        category: "drinks",
      },
      beer: {
        sugarAmount: 0,
        productName: "Beer",
        amount: 330,
        rotation: -Math.PI/6,
        model: "beer.glb",
        meshMode: false,
        amountPerPortion: 330,
        category: "drinks",
      },
      wine: {
        sugarAmount: 0,
        productName: "Wine",
        amount: 700,
        model: "wine.glb",
        rotation: -Math.PI/4,
        scale: 0.4,
        meshMode: false,
        amountPerPortion: 330,
        category: "drinks",
      },
      applejuice: {
        sugarAmount: 50,
        productName: "Apple Juice",
        amount: 500,
        model: "applejuice.glb",
        meshMode: false,
        amountPerPortion: 330,
        category: "drinks",
      },
      tomatoes: {
        sugarAmount: 20,
        productName: "Tomato 4-pack",
        amount: 500,
        scale: 0.1,
        model: "tomato_pack.glb",
        meshMode: false,
        amountPerPortion: 0,
        category: "sauces",
      },
      stainedtomato: {
        sugarAmount: 20,
        productName: "Stained Tomatoes",
        amount: 500,
        scale: 0.15,
        model: "stainedTomato.glb",
        meshMode: false,
        amountPerPortion: 166,
        category: "sauces",
      },
      coke: {
        sugarAmount: 37.1,
        productName: "Coke",
        scale: 0.35,
        rotation: 0,
        model: "colabottle.glb",
        meshMode: false,
        amount: 350,
        amountPerPortion: 150,
        category: "drinks",
      },
      tomatosauce: {
        sugarAmount: 6.1,
        productName: "Tomatensauce",
        scale: 0.2,
        rotation: 0,
        model: "tomatensauce.glb",
        meshMode: false,
        amount: 400,
        amountPerPortion: 150,
        category: "sauces",
      },
      tomatosauceBolognese: {
        sugarAmount: 5.6,
        productName: "Tomatensauce Bolognese",
        scale: 0.2,
        rotation: 0,
        model: "tomatensauce_bolognese.glb",
        meshMode: false,
        amount: 400,
        amountPerPortion: 150,
        category: "sauces",
      },
      pesto: {
        sugarAmount: 5.5,
        productName: "Pesto Alla Genovese",
        scale: 0.2,
        rotation: 0,
        model: "pesto.glb",
        meshMode: false,
        amount: 190,
        amountPerPortion: 150,
        category: "sauces",
      },
      chips: {
        sugarAmount: 2,
        productName: "Chips",
        scale: 0.35,
        meshMode: false,
        model: "chips.glb",
        amount: 500,
        amountPerPortion: 50,
        category: "snacks",
      },
      pringlesChips: {
        sugarAmount: 2,
        productName: "Pringles Chips",
        scale: 0.4,
        meshMode: false,
        model: "pringles.glb",
        amount: 200,
        amountPerPortion: 50,
        category: "snacks",
      },
      biscuitBox: {
        sugarAmount: 100,
        productName: "Wheat Biscuit Box",
        scale: 0.2,
        meshMode: false,
        model: "biscuits_wheat.glb",
        amount: 500,
        amountPerPortion: 50,
        category: "snacks",
      },
      biscuitsSugarWheat: {
        sugarAmount: 100,
        productName: "Biscuits Sugar Wheat",
        scale: 0.3,
        meshMode: false,
        model: "biscuits_sugarwheat.glb",
        amount: 400,
        amountPerPortion: 50,
        category: "snacks",
      },
      biscuitsChocolate: {
        sugarAmount: 120,
        productName: "Biscuits Chocolate",
        scale: 0.3,
        meshMode: false,
        model: "biscuits_chocolate.glb",
        amount: 400,
        amountPerPortion: 50,
        category: "snacks",
      },
    },
    shelves: [
      {
        name: "Noodles",
        boards: [
          {
            repeat: 2,
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
          {
            repeat: 2,
            products: [
              "fusilliNoodle",
              "fusilliNoodle",
              "fusilliNoodle",
              "fusilliNoodle",
              "fusilliNoodle",
              "fusilliNoodle",
              "fusilliNoodle",
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
              "water",
              "water",
              "water",
              "water",
              "water",
              "water",
              "water",
              "water",
              "water",
              "water",
            ],
          },
          {
            repeat: 2,
            products: [
              "applejuice",
              "applejuice",
              "applejuice",
              "applejuice",
              "applejuice",
              "applejuice",
              "applejuice",
              "applejuice",
              "applejuice",
              "applejuice",
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
              "spaghettiNoodle",
              "spaghettiNoodle",
              "spaghettiNoodle",
              "spaghettiNoodle",
              "spaghettiNoodle",
              "spaghettiNoodle",
              "spaghettiNoodle",
            ],
          },
        ],
      },
      {
        name: "Drinks",
        boards: [
          {
            repeat: 1,
            products: [
              "canCola",
              "canCola",
              "canCola",
              "canCola",
              "canCola",
              "canCola",
              "canCola",
              "canCola",
              "canCola",
              "canCola",
              "canCola",
            ],
          },
          {
            repeat: 1,
            products: [
              "canFanta",
              "canFanta",
              "canFanta",
              "canFanta",
              "canFanta",
              "canFanta",
              "canFanta",
              "canFanta",
              "canFanta",
              "canFanta",
              "canFanta",
            ],
          },
          {
            repeat: 1,
            products: [
              "canSprite",
              "canSprite",
              "canSprite",
              "canSprite",
              "canSprite",
              "canSprite",
              "canSprite",
              "canSprite",
              "canSprite",
              "canSprite",
              "canSprite",
            ],
          },
          {
            repeat: 1,
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
              "finishedDishNoodle",
              "finishedDishNoodle",
              "finishedDishNoodle",
              "finishedDishNoodle",
              "finishedDishNoodle",
              "finishedDishNoodle",
              "finishedDishNoodle",
              "finishedDishNoodle",
              "finishedDishNoodle",
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
              "wine",
              "wine",
              "wine",
              "wine",
              "wine",
              "wine",
              "wine",
              "wine",
            ],
          },
          {
            repeat: 2,
            products: [
              "beer",
              "beer",
              "beer",
              "beer",
              "beer",
              "beer",
              "beer",
              "beer",
            ],
          },
        ],
      },
      {
        name: "Sauces",
        boards: [
          {
            repeat: 1,
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
          {
            repeat: 1,
            products: [
              "pesto",
              "pesto",
              "pesto",
              "pesto",
              "pesto",
              "pesto",
              "pesto",
              "pesto",
              "pesto",
              "pesto",
              "pesto",
            ],
          },
          {
            repeat: 2,
            products: [
              "tomatosauceBolognese",
              "tomatosauceBolognese",
              "tomatosauceBolognese",
              "tomatosauceBolognese",
              "tomatosauceBolognese",
              "tomatosauceBolognese",
              "tomatosauceBolognese",
              "tomatosauceBolognese",
            ],
          },
        ],
      },

      {
        name: "Snack",
        boards: [
          {
            repeat: 2,
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
          {
            repeat: 2,
            products: [
              "pringlesChips",
              "pringlesChips",
              "pringlesChips",
              "pringlesChips",
              "pringlesChips",
              "pringlesChips",
              "pringlesChips",
              "pringlesChips",
              "pringlesChips",
              "pringlesChips",
            ],
          },
        ],
      },
      {
        name: "Tomatoes",
        boards: [
          {
            repeat: 2,
            products: [
              "tomatoes",
              "tomatoes",
              "tomatoes",
              "tomatoes",
              "tomatoes",
              "tomatoes",
              "tomatoes",
              "tomatoes",
            ],
          },
          {
            repeat: 2,
            products: [
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
              "stainedtomato",
            ],
          },
        ],
      },

      {
        name: "Snack",
        boards: [
          {
            repeat: 2,
            products: [
              "biscuitBox",
              "biscuitBox",
              "biscuitBox",
              "biscuitBox",
              "biscuitBox",
              "biscuitBox",
            ],
          },
          {
            repeat: 1,
            products: [
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
              "biscuitsSugarWheat",
            ],
          },
          {
            repeat: 1,
            products: [
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
              "biscuitsChocolate",
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

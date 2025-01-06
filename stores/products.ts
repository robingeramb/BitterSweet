import { defineStore } from "pinia";

export const useProductsStore = defineStore({
  id: "productsStore",
  state: () => ({
    products: [
      {
        sugarAmount: 5,
        name: "Chocolate Bar",
        amount: 100,
        amountPerPortion: 25,
        category: "snack",
      },
      {
        sugarAmount: 3,
        name: "Yogurt",
        amount: 150,
        amountPerPortion: 50,
        category: "breakfast",
      },
      {
        sugarAmount: 20,
        name: "Soda",
        amount: 330,
        amountPerPortion: 330,
        category: "beverage",
      },
      {
        sugarAmount: 0,
        name: "Broccoli",
        amount: 200,
        amountPerPortion: 100,
        category: "vegetable",
      },
      {
        sugarAmount: 10,
        name: "Ice Cream",
        amount: 250,
        amountPerPortion: 125,
        category: "dessert",
      },
      {
        sugarAmount: 7,
        name: "Apple",
        amount: 150,
        amountPerPortion: 150,
        category: "fruit",
      },
      {
        sugarAmount: 2,
        name: "Bread",
        amount: 500,
        amountPerPortion: 50,
        category: "bakery",
      } /*
      {
        sugarAmount: 15,
        name: "Granola Bar",
        amount: 40,
        amountPerPortion: 40,
        category: "snack",
      },
      {
        sugarAmount: 8,
        name: "Orange Juice",
        amount: 250,
        amountPerPortion: 250,
        category: "beverage",
      },
      {
        sugarAmount: 6,
        name: "Cereal",
        amount: 300,
        amountPerPortion: 30,
        category: "breakfast",
      },*/,
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

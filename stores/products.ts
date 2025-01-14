import { defineStore } from "pinia";

export const useProductsStore = defineStore({
  id: "productsStore",
  state: () => ({
    products: [
      {
        sugarAmount: 20,
        productName: "Penne Rigatte Nudeln",
        amount: 500,
        model: "Nudeln.glb",
        amountPerPortion: 330,
        category: "noodles",
      },
      {
        sugarAmount: 20,
        productName: "Penne Rigatte Nudeln",
        amount: 500,
        model: "Nudeln.glb",
        amountPerPortion: 330,
        category: "noodles",
      },
      {
        sugarAmount: 20,
        productName: "Penne Rigatte Nudeln",
        amount: 500,
        model: "Nudeln.glb",
        amountPerPortion: 330,
        category: "noodles",
      },
      {
        sugarAmount: 20,
        productName: "Penne Rigatte Nudeln",
        amount: 500,
        model: "Nudeln.glb",
        amountPerPortion: 330,
        category: "noodles",
      },
      {
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
      {
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
      {
        sugarAmount: 2,
        productName: "Tomatensauce",
        scale: 0.2,
        meshMode: false,
        model: "tomatensauce.glb",
        amount: 500,
        amountPerPortion: 50,
        category: "bakery",
      } /*
      {
        sugarAmount: 15,
        productName: "Granola Bar",
        amount: 40,
        amountPerPortion: 40,
        category: "snack",
      },
      {
        sugarAmount: 8,
        productName: "Orange Juice",
        amount: 250,
        amountPerPortion: 250,
        category: "beverage",
      },
      {
        sugarAmount: 6,
        productName: "Cereal",
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

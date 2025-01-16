import { defineStore } from "pinia";

export const useSugarEffects = defineStore({
  id: "sugarEffects",
  state: () => ({
    effects: [
      {
        sugarMinAmount: 0,
        sugarMaxAmount: 10,
        description: "You have no side effects."
      },
      {
        sugarMinAmount: 11,
        sugarMaxAmount: 20,
        description: "Your liver is already damaged."
      },
      {
        sugarMinAmount: 21,
        sugarMaxAmount: 30,
        description: "Your heartrate is going up."
      },
      {
        sugarMinAmount: 31,
        sugarMaxAmount: 40,
        description: "Your teeth is falling out."
      },
      {
        sugarMinAmount: 41,
        sugarMaxAmount: 50,
        description: "Your brain is rotting."
      },
      {
        sugarMinAmount: 51,
        sugarMaxAmount: 60,
        description: "You may die in a few years."
      },
      {
        sugarMinAmount: 61,
        sugarMaxAmount: 70,
        description: "You probably die in some days."
      },
    ],
  }),
  getters: {},
  actions: {},
});

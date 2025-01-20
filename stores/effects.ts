import { defineStore } from "pinia";

export const useSugarEffects = defineStore({
  id: "sugarEffects",
  state: () => ({
    effects: [
      {
        sugarMinAmount: 0,
        sugarMaxAmount: 10,
        emoji: "🦷",
        description:
          "Positive impact: Minimal risk of tooth decay and stable blood sugar levels",
        subdescription:
          "WHO recommends keeping free sugar intake below 5% of total energy (less than 25 g) for additional health benefits",
      },
      {
        sugarMinAmount: 11,
        sugarMaxAmount: 20,
        description:
          "Generally safe if overall lifestyle is healthy. Very low risk of weight gain and metabolic diseases",
      },
      {
        sugarMinAmount: 21,
        sugarMaxAmount: 30,
        description:
          "Early signs of increased risk for tooth decay if oral hygiene is insufficient",
        subdesription:
          "Still within recommended limits for optimal health benefits",
      },

      {
        sugarMinAmount: 31,
        sugarMaxAmount: 40,
        description: "Measurable blood sugar fluctuations begi ",
        subdesription: "Chronic intake may contribute to insulin resistance",
        source: "Basu et al., 2013, JAMA Internal Medicine",
      },
      {
        sugarMinAmount: 41,
        sugarMaxAmount: 50,
        description: "Increased risk of weight gain",
        subdesription:
          "This amount aligns with the WHO’s maximum recommended limit (10% of total energy intake for adults)",
      },
      {
        sugarMinAmount: 51,
        sugarMaxAmount: 130,
        description: "Elevated risk of obesity and liver fat accumulation",
        subdesription: "Linked to childhood obesity in research",
        source: "Lustig et al., 2015",
      },
      {
        sugarMinAmount: 61,
        sugarMaxAmount: 1000,
        description: "Significant increase in risk for Type 2 diabetes",
        source: "Malik et al., 2010, Diabetes Care",
      },
      {
        sugarMinAmount: 71,
        sugarMaxAmount: 1000,
        description: "Higher risk of cardiovascular diseases",
        subdesription:
          "Regular intake can affect blood pressure and lipid profiles",
        source: "(Yang et al., 2014, JAMA Internal Medicine)",
      },
      {
        sugarMinAmount: 81,
        sugarMaxAmount: 1000,
        description: "Increased likelihood of tooth decay",
        subdescription:
          "Sugar promotes acid production in the mouth, leading to dental problems",
      },
      {
        sugarMinAmount: 91,
        sugarMaxAmount: 1000,
        description:
          "Documented negative effects on cognitive performance, especially in children.",
        source: "Benton, 2008, American Journal of Clinical Nutrition",
      },
      {
        sugarMinAmount: 101,
        sugarMaxAmount: 1100,
        description: "Greater abdominal fat accumulation",
        subdescription:
          "Studies highlight visceral fat gain with prolonged high sugar intake",
      },
      {
        sugarMinAmount: 111,
        sugarMaxAmount: 1200,
        description:
          "Chronic inflammation increases, raising the risk for multiple diseases",
        source: "Calder et al., 2011, Clinical Nutrition",
      },
      {
        sugarMinAmount: 121,
        sugarMaxAmount: 1000,
        description:
          "Strong correlation with significantly higher risk of heart disease and metabolic syndrome.",
      },
      {
        sugarMinAmount: 131,
        sugarMaxAmount: 1000,
        description: "Elevated risk for liver disease",
        subdescription: "Including non-alcoholic fatty liver disease (NAFLD)",
      },
    ],
  }),
  getters: {},
  actions: {},
});

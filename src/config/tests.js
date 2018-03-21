export default [
  { name: "Agility Test", groupTest: false, duration: 30 },
  { 
    name: "Shooting Test", 
    variations: [
      { name: "Free Throw", duration: false },
      { name: "Three Point (Top of Key)" },
      { name: "Three Point (Wing)" },
      { name: "Three Point (Baseline)" },
      { name: "Elbow" },
      { name: "Base Line" },
      { name: "45 Degree" }
    ],
    duration: 30,
    groupTest: false
  }
]

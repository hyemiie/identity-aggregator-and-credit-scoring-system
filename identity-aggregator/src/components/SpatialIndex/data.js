// data.js

export const person = {
  id: "person",
  kind: "person",
  x: 0,
  y: 0,
};


export const coreCards = [
  {
    id: "identity",
    kind: "core",
    number: "01",
    title: "Identity",
    description: "Who is this person?",
    x: -230,
    y: -150,
  },

  {
    id: "verification",
    kind: "core",
    number: "02",
    title: "Verification",
    description: "Verify identity.",
    x: 0,
    y: -210,
  },

  {
    id: "consent",
    kind: "core",
    number: "03",
    title: "Consent",
    description: "Permission first.",
    x: 230,
    y: -150,
  },

  {
    id: "transactions",
    kind: "core",
    number: "04",
    title: "Transactions",
    description: "Financial activity.",
    x: -220,
    y: 160,
  },

  {
    id: "credit-signal",
    kind: "core",
    number: "05",
    title: "Credit Signal",
    description: "Transparent risk.",
    x: 220,
    y: 160,
  },
];


export const countries = {
  nigeria: {
    id: "nigeria",
    name: "Nigeria",

    description:
      "BVN · NIN · CAC",

    providers: [
      {
        id: "dojah",
        name: "Dojah",
        description:
          "BVN / NIN verification",
      },

      {
        id: "igree",
        name: "iGree",
        description:
          "Consent orchestration",
      },
    ],
  },


  ghana: {
    id: "ghana",
    name: "Ghana",

    description:
      "Ghana Card",

    providers: [
      {
        id: "smile-id",
        name: "Smile ID",
        description:
          "Identity verification",
      },
    ],
  },


  canada: {
    id: "canada",
    name: "Canada",

    description:
      "Bank-linked identity",

    providers: [
      {
        id: "plaid",
        name: "Plaid",
        description:
          "Financial data",
      },
    ],
  },
};
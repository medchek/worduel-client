export const gameOptions = [
  {
    id: 1,
    value: "Shuffle",
    selectable: true,
  },
  {
    id: 2,
    value: "Guess",
    selectable: false,
  },
  {
    id: 3,
    value: "Riddles",
    selectable: true,
  },
];
export const difficulty = {
  sid: 1,
  options: [
    { id: 1, value: "easy" },
    { id: 2, value: "normal" },
    { id: 3, value: "hard" },
    { id: 4, value: "mixed" },
  ],
};
export const roundCount = {
  sid: 2,
  options: [
    { id: 1, value: 2 },
    { id: 2, value: 4 },
    { id: 3, value: 6 },
    { id: 4, value: 8 },
    { id: 5, value: 10 },
  ],
};

export const timePerRound = {
  sid: 3,
  options: [
    { id: 1, value: 30 },
    { id: 2, value: 60 },
    { id: 3, value: 90 },
    { id: 4, value: 120 },
    { id: 5, value: 150 },
  ],
};

const isProd = process.env.NODE_ENV && process.env.NODE_ENV === "production";

export const server = {
  protocol: isProd ? "https" : "http",
  wsProtocol: isProd ? "wss" : "ws",
  host: isProd ? "worduel.herokuapp.com" : "localhost",
  port: isProd ? undefined : 9001,
};

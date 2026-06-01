// ── Firebase Configuration & Quiz Game Database Layer ────────────────────────
// Handles all real-time communication for the multiplayer quiz game.
// Uses Firebase Realtime Database for instant state sync between host & players.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onValue,
  remove,
  type Database,
  type Unsubscribe,
} from "firebase/database";
import type { GameData, PlayerData, AnswerData } from "./questions";

// ── Firebase Init (Lazy — only on client side) ──────────────────────────────

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let _db: Database | null = null;

function getDb(): Database {
  if (_db) return _db;
  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  _db = getDatabase(app);
  return _db;
}

// ── Player ID Management ────────────────────────────────────────────────────
// Persistent player ID stored in localStorage for reconnection support

export function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("sinfonia_quiz_player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sinfonia_quiz_player_id", id);
  }
  return id;
}

// ── Game PIN Generation ─────────────────────────────────────────────────────

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// ── Host Operations ─────────────────────────────────────────────────────────

export async function createGame(): Promise<string> {
  // Generate a unique 4-digit PIN
  let pin = generatePin();
  let attempts = 0;

  // Check for collision (unlikely but safe)
  while (attempts < 10) {
    const snapshot = await get(ref(getDb(), `quizGames/${pin}`));
    if (!snapshot.exists()) break;
    pin = generatePin();
    attempts++;
  }

  const gameData: GameData = {
    state: "lobby",
    currentQuestion: 0,
    questionStartedAt: 0,
    createdAt: Date.now(),
    pin,
  };

  await set(ref(getDb(), `quizGames/${pin}`), gameData);
  return pin;
}

export async function startQuestion(
  pin: string,
  questionIndex: number
): Promise<void> {
  await update(ref(getDb(), `quizGames/${pin}`), {
    state: "question",
    currentQuestion: questionIndex,
    questionStartedAt: Date.now(),
  });
}

export async function revealAnswer(pin: string): Promise<void> {
  await update(ref(getDb(), `quizGames/${pin}`), {
    state: "reveal",
  });
}

export async function showLeaderboard(pin: string): Promise<void> {
  await update(ref(getDb(), `quizGames/${pin}`), {
    state: "leaderboard",
  });
}

export async function finishGame(pin: string): Promise<void> {
  await update(ref(getDb(), `quizGames/${pin}`), {
    state: "finished",
  });
}

export async function deleteGame(pin: string): Promise<void> {
  await remove(ref(getDb(), `quizGames/${pin}`));
  await remove(ref(getDb(), `quizPlayers/${pin}`));
  await remove(ref(getDb(), `quizAnswers/${pin}`));
}

// ── Player Operations ───────────────────────────────────────────────────────

export async function checkGameExists(pin: string): Promise<boolean> {
  const snapshot = await get(ref(getDb(), `quizGames/${pin}`));
  return snapshot.exists();
}

export async function joinGame(
  pin: string,
  playerId: string,
  nickname: string
): Promise<void> {
  const playerData: PlayerData = {
    nickname,
    score: 0,
  };
  await set(ref(getDb(), `quizPlayers/${pin}/${playerId}`), playerData);
}

export async function submitAnswer(
  pin: string,
  questionIndex: number,
  playerId: string,
  option: number,
  timeMs: number
): Promise<void> {
  const answerData: AnswerData = {
    option,
    timeMs,
  };
  await set(
    ref(getDb(), `quizAnswers/${pin}/${questionIndex}/${playerId}`),
    answerData
  );
}

export async function updatePlayerScore(
  pin: string,
  playerId: string,
  newScore: number
): Promise<void> {
  await update(ref(getDb(), `quizPlayers/${pin}/${playerId}`), {
    score: newScore,
  });
}

// ── Real-time Listeners ─────────────────────────────────────────────────────
// Returns unsubscribe functions for cleanup

export function onGameStateChange(
  pin: string,
  callback: (data: GameData | null) => void
): Unsubscribe {
  const gameRef = ref(getDb(), `quizGames/${pin}`);
  return onValue(gameRef, (snapshot) => {
    callback(snapshot.val() as GameData | null);
  });
}

export function onPlayersChange(
  pin: string,
  callback: (players: Record<string, PlayerData>) => void
): Unsubscribe {
  const playersRef = ref(getDb(), `quizPlayers/${pin}`);
  return onValue(playersRef, (snapshot) => {
    callback((snapshot.val() as Record<string, PlayerData>) || {});
  });
}

export function onAnswersChange(
  pin: string,
  questionIndex: number,
  callback: (answers: Record<string, AnswerData>) => void
): Unsubscribe {
  const answersRef = ref(getDb(), `quizAnswers/${pin}/${questionIndex}`);
  return onValue(answersRef, (snapshot) => {
    callback((snapshot.val() as Record<string, AnswerData>) || {});
  });
}

export function onAllAnswersChange(
  pin: string,
  callback: (answers: Record<string, Record<string, AnswerData>>) => void
): Unsubscribe {
  const answersRef = ref(getDb(), `quizAnswers/${pin}`);
  return onValue(answersRef, (snapshot) => {
    callback(
      (snapshot.val() as Record<string, Record<string, AnswerData>>) || {}
    );
  });
}

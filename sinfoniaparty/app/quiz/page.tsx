"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { purgatory } from "@/lib/fonts";

import {
  QUESTIONS,
  OPTION_COLORS,
  getTimerSeconds,
  calculateScore,
  type GameData,
  type PlayerData,
} from "@/lib/questions";
import {
  getOrCreatePlayerId,
  joinGame,
  checkGameExists,
  submitAnswer,
  updatePlayerScore,
  onGameStateChange,
  onPlayersChange,
} from "@/lib/firebase";

// ── Types ───────────────────────────────────────────────────────────────────

type PlayerView =
  | "join"
  | "lobby"
  | "question"
  | "answered"
  | "reveal"
  | "leaderboard"
  | "finished";

interface MyResult {
  correct: boolean;
  points: number;
  correctIndex: number;
}

// ── Sorted Leaderboard Helper ───────────────────────────────────────────────

function getSortedLeaderboard(
  players: Record<string, PlayerData>
): { id: string; nickname: string; score: number; rank: number }[] {
  return Object.entries(players)
    .map(([id, p]) => ({ id, nickname: p.nickname, score: p.score }))
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

// ═══════════════════════════════════════════════════════════════════════════
// ── Main Player Page ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export default function QuizPlayerPage() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [playerId] = useState(() => getOrCreatePlayerId());
  const [pinInput, setPinInput] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [joined, setJoined] = useState(false);
  const [gamePin, setGamePin] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const [gameState, setGameState] = useState<GameData | null>(null);
  const [players, setPlayers] = useState<Record<string, PlayerData>>({});
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const [myResult, setMyResult] = useState<MyResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [prevQuestion, setPrevQuestion] = useState(-1);



  // ── Derived View ──────────────────────────────────────────────────────────
  const view: PlayerView = useMemo(() => {
    if (!joined || !gameState) return joined ? "lobby" : "join";
    switch (gameState.state) {
      case "lobby":
        return "lobby";
      case "question":
        return myAnswer !== null ? "answered" : "question";
      case "reveal":
        return "reveal";
      case "leaderboard":
        return "leaderboard";
      case "finished":
        return "finished";
      default:
        return "lobby";
    }
  }, [joined, gameState, myAnswer]);

  // ── My Rank ───────────────────────────────────────────────────────────────
  const leaderboard = useMemo(() => getSortedLeaderboard(players), [players]);
  const myRank = useMemo(
    () => leaderboard.find((p) => p.id === playerId)?.rank ?? 0,
    [leaderboard, playerId]
  );
  const myScore = players[playerId]?.score ?? 0;

  // ── Reset local answer state when question changes ────────────────────────
  useEffect(() => {
    if (
      gameState?.currentQuestion !== undefined &&
      gameState.currentQuestion !== prevQuestion
    ) {
      setMyAnswer(null);
      setMyResult(null);
      setPrevQuestion(gameState.currentQuestion);
    }
  }, [gameState?.currentQuestion, prevQuestion]);

  // ── Subscribe to game state & players ─────────────────────────────────────
  useEffect(() => {
    if (!gamePin) return;

    const unsubGame = onGameStateChange(gamePin, (data) => {
      setGameState(data);
    });
    const unsubPlayers = onPlayersChange(gamePin, (data) => {
      setPlayers(data);
    });

    return () => {
      unsubGame();
      unsubPlayers();
    };
  }, [gamePin]);

  // ── Timer Countdown ───────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState?.state !== "question" || !gameState.questionStartedAt) return;

    const totalMs = getTimerSeconds(gameState.currentQuestion) * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - gameState.questionStartedAt;
      const remaining = Math.max(0, totalMs - elapsed);
      setTimeLeft(remaining);
    }, 50);

    return () => clearInterval(interval);
  }, [gameState?.state, gameState?.questionStartedAt, gameState?.currentQuestion]);



  // ── Join Game Handler ─────────────────────────────────────────────────────
  const handleJoin = useCallback(async () => {
    const pin = pinInput.trim();
    const nickname = nicknameInput.trim();

    if (!pin || pin.length !== 4) {
      setJoinError("Nhập mã PIN 4 chữ số");
      return;
    }
    if (!nickname || nickname.length < 2) {
      setJoinError("Nhập nickname (tối thiểu 2 ký tự)");
      return;
    }
    if (nickname.length > 16) {
      setJoinError("Nickname tối đa 16 ký tự");
      return;
    }

    setIsJoining(true);
    setJoinError("");

    try {
      const exists = await checkGameExists(pin);
      if (!exists) {
        setJoinError("Không tìm thấy game với mã PIN này");
        setIsJoining(false);
        return;
      }

      await joinGame(pin, playerId, nickname);
      setGamePin(pin);
      setJoined(true);
    } catch (err) {
      console.error("Join error:", err);
      setJoinError("Lỗi kết nối. Thử lại nhé!");
    } finally {
      setIsJoining(false);
    }
  }, [pinInput, nicknameInput, playerId]);

  // ── Answer Handler ────────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    async (optionIndex: number) => {
      if (myAnswer !== null || !gameState) return;

      const timeMs = Date.now() - gameState.questionStartedAt;
      const totalTimeMs = getTimerSeconds(gameState.currentQuestion) * 1000;
      const question = QUESTIONS[gameState.currentQuestion];
      const isCorrect = optionIndex === question.correctIndex;
      const points = calculateScore(
        gameState.currentQuestion,
        timeMs,
        totalTimeMs,
        isCorrect
      );

      setMyAnswer(optionIndex);
      setMyResult({
        correct: isCorrect,
        points,
        correctIndex: question.correctIndex,
      });

      try {
        await submitAnswer(
          gamePin,
          gameState.currentQuestion,
          playerId,
          optionIndex,
          timeMs
        );
        const currentScore = players[playerId]?.score ?? 0;
        await updatePlayerScore(gamePin, playerId, currentScore + points);
      } catch (err) {
        console.error("Submit answer error:", err);
      }
    },
    [myAnswer, gameState, gamePin, playerId, players]
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Render ────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col relative overflow-hidden">
      {/* Subtle vintage grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.06]">
        <div className="w-full h-full" style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/%3E%3CfeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E')`,
        }} />
      </div>

      {/* ── JOIN SCREEN ──────────────────────────────────────────────── */}
      {view === "join" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 quiz-fade-in">
          {/* Brand */}
          <div className="mb-12 text-center">
            <h1
              className={`${purgatory.className} text-4xl md:text-5xl text-primary lowercase mb-2`}
            >
              The Sunset Sinfonia
            </h1>
            <div className="w-16 h-[1px] bg-primary/20 mx-auto mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-primary/50 font-medium">
              Quiz Game
            </p>
          </div>

          {/* Join Form */}
          <div className="w-full max-w-sm space-y-5">
            {/* PIN Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.25em] text-primary/60 font-semibold">
                Game PIN
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) =>
                  setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="0000"
                className="w-full text-center text-3xl tracking-[0.5em] font-display py-4 px-6 bg-transparent border border-primary/15 text-primary placeholder:text-primary/15 focus:outline-none focus:border-primary/40 transition-colors"
                autoFocus
              />
            </div>

            {/* Nickname Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.25em] text-primary/60 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                maxLength={16}
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Nhập tên hiển thị..."
                className="w-full text-center text-lg py-3.5 px-6 bg-transparent border border-primary/15 text-primary placeholder:text-primary/25 focus:outline-none focus:border-primary/40 transition-colors font-light"
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>

            {/* Error Message */}
            {joinError && (
              <p className="text-center text-sm text-red-600/80 font-light quiz-fade-in">
                {joinError}
              </p>
            )}

            {/* Join Button */}
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full py-4 bg-primary text-background uppercase tracking-[0.2em] text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? "Đang kết nối..." : "Tham gia"}
            </button>
          </div>

          {/* Footer */}
          <p className="mt-12 text-[10px] text-primary/30 uppercase tracking-[0.2em]">
            Nhìn lên màn hình lớn để lấy mã PIN
          </p>
        </div>
      )}

      {/* ── LOBBY (Waiting for host) ─────────────────────────────────── */}
      {view === "lobby" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 quiz-fade-in">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full border border-primary/10 flex items-center justify-center">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 quiz-dot-pulse" style={{ animationDelay: "0s" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 quiz-dot-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 quiz-dot-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>

            <div>
              <p className={`${purgatory.className} text-3xl text-primary lowercase mb-1`}>
                {players[playerId]?.nickname || "You"}
              </p>
              <p className="text-xs text-primary/40 uppercase tracking-[0.2em]">
                Đã vào game
              </p>
            </div>

            <div className="w-12 h-[1px] bg-primary/10 mx-auto" />

            <p className="text-sm text-primary/50 font-light">
              Chờ host bắt đầu game...
            </p>

            <p className="text-xs text-primary/30">
              {Object.keys(players).length} người chơi đã sẵn sàng
            </p>
          </div>
        </div>
      )}

      {/* ── QUESTION SCREEN ──────────────────────────────────────────── */}
      {(view === "question" || view === "answered") && gameState && (
        <div className="flex-1 flex flex-col quiz-fade-in">
          {/* Header: Question Number + Timer */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-primary/5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/50 font-semibold">
              Câu {gameState.currentQuestion + 1} / {QUESTIONS.length}
            </span>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    className="text-primary/5"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    className={`transition-colors duration-300 ${
                      timeLeft < 3000
                        ? "text-red-500/70"
                        : timeLeft < 5000
                        ? "text-amber-500/70"
                        : "text-primary/50"
                    }`}
                    strokeWidth="2.5"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 16 * (1 - timeLeft / (getTimerSeconds(gameState.currentQuestion) * 1000))
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${
                  timeLeft < 3000 ? "text-red-500/80" : "text-primary/70"
                }`}>
                  {Math.ceil(timeLeft / 1000)}
                </span>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="px-5 py-6 flex-shrink-0">
            <h2 className="text-lg md:text-xl font-medium text-primary leading-relaxed">
              {QUESTIONS[gameState.currentQuestion]?.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="flex-1 px-5 pb-6 flex flex-col gap-3 justify-center">
            {QUESTIONS[gameState.currentQuestion]?.options.map((option, idx) => {
              const color = OPTION_COLORS[idx];
              const isSelected = myAnswer === idx;
              const isDisabled = myAnswer !== null;
              const isTimedOut = timeLeft <= 0 && myAnswer === null;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isDisabled || isTimedOut}
                  className={`relative w-full py-4 px-5 rounded-sm text-left flex items-center gap-4 transition-all duration-300 active:scale-[0.97] ${
                    isSelected
                      ? "ring-2 ring-white/50 scale-[1.02] shadow-lg"
                      : isDisabled || isTimedOut
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:scale-[1.01] hover:shadow-md"
                  }`}
                  style={{
                    backgroundColor: isSelected ? color.bg : color.bg + "cc",
                    color: color.text,
                  }}
                >
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {color.label}
                  </span>
                  <span className="text-sm md:text-base font-medium leading-snug">
                    {option}
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-white/80">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Answered overlay */}
          {view === "answered" && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-primary/10 py-4 px-5 text-center quiz-slide-up">
              <p className="text-xs text-primary/50 uppercase tracking-[0.2em]">
                Đã trả lời • Chờ kết quả...
              </p>
            </div>
          )}

          {/* Time's up overlay */}
          {timeLeft <= 0 && myAnswer === null && gameState.state === "question" && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center quiz-fade-in z-40">
              <div className="text-center">
                <p className="text-2xl font-display italic text-primary/80 mb-2">
                  Hết giờ!
                </p>
                <p className="text-xs text-primary/40 uppercase tracking-[0.2em]">
                  Chờ kết quả...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REVEAL SCREEN ────────────────────────────────────────────── */}
      {view === "reveal" && gameState && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 quiz-fade-in">
          {myResult ? (
            <div className="text-center space-y-6 w-full max-w-sm">
              {/* Correct/Wrong Icon */}
              <div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center quiz-scale-in ${
                  myResult.correct
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {myResult.correct ? (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <div>
                <p className="text-2xl font-display italic text-primary mb-1">
                  {myResult.correct ? "Chính xác!" : "Sai rồi!"}
                </p>
                {!myResult.correct && (
                  <p className="text-sm text-primary/50 font-light">
                    Đáp án đúng:{" "}
                    <span className="font-medium text-primary/70">
                      {OPTION_COLORS[myResult.correctIndex].label}.{" "}
                      {QUESTIONS[gameState.currentQuestion]?.options[myResult.correctIndex]}
                    </span>
                  </p>
                )}
              </div>

              {/* Points */}
              <div className="py-4 border-y border-primary/5">
                <p className="text-4xl font-bold text-primary quiz-count-up">
                  +{myResult.points}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary/40 mt-1">
                  Điểm câu này
                </p>
              </div>

              {/* Total Score & Rank */}
              <div className="flex items-center justify-center gap-8">
                <div>
                  <p className="text-2xl font-semibold text-primary">{myScore}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary/40">
                    Tổng điểm
                  </p>
                </div>
                <div className="w-[1px] h-8 bg-primary/10" />
                <div>
                  <p className="text-2xl font-semibold text-primary">#{myRank}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary/40">
                    Hạng
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Player didn't answer (timed out) */
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-display italic text-primary/60">
                Hết giờ rồi!
              </p>
              <p className="text-sm text-primary/40 font-light">
                Đáp án đúng:{" "}
                <span className="font-medium text-primary/70">
                  {OPTION_COLORS[QUESTIONS[gameState.currentQuestion]?.correctIndex].label}.{" "}
                  {QUESTIONS[gameState.currentQuestion]?.options[
                    QUESTIONS[gameState.currentQuestion]?.correctIndex
                  ]}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── LEADERBOARD ──────────────────────────────────────────────── */}
      {view === "leaderboard" && (() => {
        // Build neighborhood: 2 above + me + 2 below
        const myIdx = leaderboard.findIndex((p) => p.id === playerId);
        const startIdx = Math.max(0, myIdx - 2);
        const endIdx = Math.min(leaderboard.length, myIdx + 3);
        const neighborhood = leaderboard.slice(startIdx, endIdx);
        const showTopDots = startIdx > 0;
        const showBottomDots = endIdx < leaderboard.length;

        return (
          <div className="flex-1 flex flex-col px-6 py-8 quiz-fade-in">
            {/* My Rank Hero */}
            <div className="text-center mb-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary/40 font-semibold mb-1">
                Your rank
              </p>
              <p className="text-5xl font-bold text-primary mb-1">
                #{myRank}
              </p>
              <p className="text-sm text-primary/50">
                {myScore.toLocaleString()} pts
              </p>
              <p className="text-[10px] text-primary/25 mt-2">
                After Q{(gameState?.currentQuestion ?? 0) + 1} / {QUESTIONS.length}
              </p>
            </div>

            <div className="w-12 h-[1px] bg-primary/10 mx-auto mb-4" />

            {/* Neighborhood Ranking */}
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-2">
              {showTopDots && (
                <div className="flex items-center justify-center py-1">
                  <span className="text-primary/15 text-xs">• • •</span>
                </div>
              )}

              {neighborhood.map((player) => {
                const isMe = player.id === playerId;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 py-3 px-4 rounded-sm transition-all ${
                      isMe
                        ? "bg-primary/10 border border-primary/20 scale-[1.02]"
                        : "bg-primary/[0.02] border border-transparent"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        player.rank === 1
                          ? "bg-amber-400/20 text-amber-600"
                          : player.rank === 2
                          ? "bg-gray-300/30 text-gray-500"
                          : player.rank === 3
                          ? "bg-orange-400/20 text-orange-600"
                          : "bg-primary/5 text-primary/40"
                      }`}
                    >
                      {player.rank}
                    </span>
                    <span
                      className={`flex-1 text-sm truncate ${
                        isMe ? "font-semibold text-primary" : "text-primary/60"
                      }`}
                    >
                      {player.nickname}
                      {isMe && (
                        <span className="ml-1 text-[9px] text-primary/40">(you)</span>
                      )}
                    </span>
                    <span className={`text-sm tabular-nums ${isMe ? "font-bold text-primary/80" : "font-semibold text-primary/40"}`}>
                      {player.score.toLocaleString()}
                    </span>
                  </div>
                );
              })}

              {showBottomDots && (
                <div className="flex items-center justify-center py-1">
                  <span className="text-primary/15 text-xs">• • •</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── FINAL RANKING ────────────────────────────────────────────── */}
      {view === "finished" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 quiz-fade-in">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full border border-amber-400/20 bg-amber-400/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-display italic text-primary/80 mb-2">
                Kết quả đang được công bố!
              </p>
              <p className="text-sm text-primary/40">
                Nhìn lên màn hình chính để biết kết quả
              </p>
            </div>
            <div className="flex gap-1 items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 quiz-dot-pulse" style={{ animationDelay: "0s" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 quiz-dot-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 quiz-dot-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

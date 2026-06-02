"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { purgatory } from "@/lib/fonts";
import confetti from "canvas-confetti";
import {
  QUESTIONS,
  OPTION_COLORS,
  getTimerSeconds,
  calculateScore,
  type GameData,
  type PlayerData,
  type AnswerData,
} from "@/lib/questions";
import {
  createGame,
  startQuestion,
  revealAnswer,
  showLeaderboard,
  finishGame,
  deleteGame,
  onGameStateChange,
  onPlayersChange,
  onAnswersChange,
} from "@/lib/firebase";

// ── Types ───────────────────────────────────────────────────────────────────

type HostView =
  | "setup"
  | "lobby"
  | "question"
  | "reveal"
  | "leaderboard"
  | "finished";

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
// ── Main Host Page ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export default function QuizHostPage() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [gamePin, setGamePin] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [gameState, setGameState] = useState<GameData | null>(null);
  const [players, setPlayers] = useState<Record<string, PlayerData>>({});
  const [currentAnswers, setCurrentAnswers] = useState<
    Record<string, AnswerData>
  >({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [prevQuestion, setPrevQuestion] = useState(-1);
  const [revealStep, setRevealStep] = useState(0);

  const confettiFired = useRef(false);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);

  // ── Derived View ──────────────────────────────────────────────────────────
  const view: HostView = useMemo(() => {
    if (!gamePin || !gameState) return "setup";
    return gameState.state === "question"
      ? "question"
      : gameState.state === "reveal"
      ? "reveal"
      : gameState.state === "leaderboard"
      ? "leaderboard"
      : gameState.state === "finished"
      ? "finished"
      : "lobby";
  }, [gamePin, gameState]);

  const leaderboard = useMemo(() => getSortedLeaderboard(players), [players]);
  const playerCount = Object.keys(players).length;

  // ── Subscribe to game state, players, and answers ─────────────────────────
  useEffect(() => {
    if (!gamePin) return;

    const unsubGame = onGameStateChange(gamePin, setGameState);
    const unsubPlayers = onPlayersChange(gamePin, setPlayers);

    return () => {
      unsubGame();
      unsubPlayers();
    };
  }, [gamePin]);

  // Listen to answers for current question
  useEffect(() => {
    if (!gamePin || gameState?.currentQuestion === undefined) return;
    if (gameState.state !== "question" && gameState.state !== "reveal") return;

    const unsubAnswers = onAnswersChange(
      gamePin,
      gameState.currentQuestion,
      setCurrentAnswers
    );

    return () => {
      unsubAnswers();
    };
  }, [gamePin, gameState?.currentQuestion, gameState?.state]);

  // ── Confetti on Champion Reveal ────────────────────────────────────────
  useEffect(() => {
    if (revealStep === 3 && !confettiFired.current) {
      confettiFired.current = true;
      const duration = 5000;
      const end = Date.now() + duration;
      const colors = ["#dfba73", "#f3ede1", "#4b5006", "#ffffff", "#c9a96e"];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.6 },
          colors,
          zIndex: 1000,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 },
          colors,
          zIndex: 1000,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, [revealStep]);

  // ── Reset reveal state on finish ──────────────────────────────────────
  useEffect(() => {
    if (view === "finished") {
      setRevealStep(0);
      confettiFired.current = false;
    }
  }, [view]);

  // ── Countdown Music ───────────────────────────────────────────────────
  useEffect(() => {
    const audio = countdownAudioRef.current;
    if (!audio) return;

    if (view === "question") {
      audio.currentTime = 0;
      audio.volume = 0.45;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [view]);

  // Reset answers when question changes
  useEffect(() => {
    if (
      gameState?.currentQuestion !== undefined &&
      gameState.currentQuestion !== prevQuestion
    ) {
      setCurrentAnswers({});
      setPrevQuestion(gameState.currentQuestion);
      setRevealStep(0);
    }
  }, [gameState?.currentQuestion, prevQuestion]);

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


  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreateGame = useCallback(async () => {
    setIsCreating(true);
    try {
      const pin = await createGame();
      setGamePin(pin);
    } catch (err) {
      console.error("Create game error:", err);
    } finally {
      setIsCreating(false);
    }
  }, []);

  const handleStartGame = useCallback(async () => {
    if (!gamePin) return;
    await startQuestion(gamePin, 0);
  }, [gamePin]);

  const handleRevealAnswer = useCallback(async () => {
    if (!gamePin) return;
    await revealAnswer(gamePin);
  }, [gamePin]);

  const handleShowLeaderboard = useCallback(async () => {
    if (!gamePin) return;
    await showLeaderboard(gamePin);
  }, [gamePin]);

  const handleNextQuestion = useCallback(async () => {
    if (!gamePin || !gameState) return;
    const nextQ = gameState.currentQuestion + 1;
    if (nextQ >= QUESTIONS.length) {
      await finishGame(gamePin);
    } else {
      await startQuestion(gamePin, nextQ);
    }
  }, [gamePin, gameState]);

  const handleFinishGame = useCallback(async () => {
    if (!gamePin) return;
    await finishGame(gamePin);
  }, [gamePin]);

  // ── Answer Distribution ───────────────────────────────────────────────────
  const answerDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0];
    Object.values(currentAnswers).forEach((a) => {
      if (a.option >= 0 && a.option < 4) dist[a.option]++;
    });
    return dist;
  }, [currentAnswers]);

  const answeredCount = Object.keys(currentAnswers).length;
  const currentQuestion = gameState
    ? QUESTIONS[gameState.currentQuestion]
    : null;

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Render ────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col text-primary relative overflow-hidden">
      {/* Subtle vignette */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.06]">
        <div className="w-full h-full" style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/%3E%3CfeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E')`,
        }} />
      </div>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* ── SETUP SCREEN ─────────────────────────────────────────────── */}
      {view === "setup" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 quiz-fade-in relative z-10">
          <div className="text-center space-y-8">
            <div>
              <h1
                className={`${purgatory.className} text-6xl md:text-8xl text-primary lowercase mb-3`}
              >
                The Sunset Sinfonia
              </h1>
              <div className="w-24 h-[1px] bg-primary/20 mx-auto mb-4" />
              <p className="text-sm uppercase tracking-[0.4em] text-primary/40 font-medium">
                Quiz Game • Host Control
              </p>
            </div>

            <button
              onClick={handleCreateGame}
              disabled={isCreating}
              className="px-12 py-5 border border-primary/30 text-primary uppercase tracking-[0.25em] text-sm font-medium hover:bg-primary hover:text-background active:scale-[0.97] transition-all duration-500 disabled:opacity-50"
            >
              {isCreating ? "Đang tạo..." : "Tạo Game Mới"}
            </button>

            <p className="text-xs text-primary/20 max-w-sm mx-auto">
              {QUESTIONS.length} câu hỏi • Timer giảm dần • Điểm tăng theo câu
              & tốc độ
            </p>
          </div>
        </div>
      )}

      {/* ── LOBBY ────────────────────────────────────────────────────── */}
      {view === "lobby" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 quiz-fade-in relative z-10">
          <div className="text-center space-y-10 w-full max-w-3xl">
            {/* PIN Display */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary/40 mb-3">
                Game PIN
              </p>
              <div className="text-8xl md:text-[10rem] font-bold tracking-[0.3em] text-primary leading-none font-sans">
                {gamePin}
              </div>
              <p className="mt-4 text-xs text-primary/30 uppercase tracking-[0.2em]">
                Vào{" "}
                <span className="text-primary/60 font-medium">
                  {typeof window !== "undefined"
                    ? window.location.origin
                    : ""}/quiz
                </span>{" "}
                và nhập mã PIN
              </p>
            </div>

            <div className="w-20 h-[1px] bg-primary/10 mx-auto" />

            {/* Player Count */}
            <div>
              <p className="text-5xl font-bold text-primary/90 mb-2">
                {playerCount}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-primary/40">
                Người chơi đã vào
              </p>
            </div>

            {/* Player Names - Scrolling display */}
            {playerCount > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto px-4">
                {Object.values(players).map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-primary/5 border border-primary/10 text-xs text-primary/60 rounded-full quiz-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {p.nickname}
                  </span>
                ))}
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStartGame}
              disabled={playerCount < 1}
              className="px-16 py-5 bg-primary text-background uppercase tracking-[0.25em] text-lg font-bold hover:bg-[#dfba73] active:scale-[0.97] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed quiz-pulse-glow"
            >
              Bắt đầu
            </button>
          </div>
        </div>
      )}

      {/* ── QUESTION (Big Screen Display) ────────────────────────────── */}
      {view === "question" && gameState && currentQuestion && (
        <div className="flex-1 flex flex-col relative z-10">
          {/* Top Bar: Question Counter + Timer */}
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-4">
              <span className="text-sm uppercase tracking-[0.2em] text-primary/40">
                Câu {gameState.currentQuestion + 1}/{QUESTIONS.length}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-primary/20 px-2 py-1 border border-primary/10 rounded-full">
                {getTimerSeconds(gameState.currentQuestion)}s
              </span>
            </div>

            {/* Timer Circle */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(75, 80, 6,0.08)"
                  strokeWidth="3"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  className={`transition-colors duration-300 ${
                    timeLeft < 3000
                      ? "stroke-red-400"
                      : timeLeft < 5000
                      ? "stroke-amber-400"
                      : "stroke-primary/60"
                  }`}
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    28 *
                    (1 -
                      timeLeft /
                        (getTimerSeconds(gameState.currentQuestion) * 1000))
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${
                  timeLeft < 3000
                    ? "text-red-400"
                    : "text-primary/80"
                }`}
              >
                {Math.ceil(timeLeft / 1000)}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="px-8 md:px-16 py-6 flex-shrink-0">
            <h2 className="text-3xl md:text-5xl font-display italic text-primary leading-snug text-center">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options - 2x2 Grid for big screen */}
          <div className="flex-1 grid grid-cols-2 gap-3 px-8 md:px-16 pb-8">
            {currentQuestion.options.map((option, idx) => {
              const color = OPTION_COLORS[idx];
              return (
                <div
                  key={idx}
                  className="rounded-sm flex items-center gap-5 px-6 py-5 md:py-8"
                  style={{ backgroundColor: color.bg }}
                >
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                    {color.label}
                  </span>
                  <span className="text-lg md:text-2xl font-medium text-white leading-snug">
                    {option}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar: Answer Count + Reveal Button */}
          <div className="px-8 py-4 border-t border-primary/5 flex items-center justify-between">
            <span className="text-sm text-primary/40">
              <span className="text-2xl font-bold text-primary/80 mr-1">
                {answeredCount}
              </span>
              / {playerCount} đã trả lời
            </span>

            <button
              onClick={handleRevealAnswer}
              className="px-8 py-3 border border-primary/30 text-primary text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-background transition-all duration-300"
            >
              Đáp án
            </button>
          </div>
        </div>
      )}

      {/* ── REVEAL (Big Screen) ──────────────────────────────────────── */}
      {view === "reveal" && gameState && currentQuestion && (
        <div className="flex-1 flex flex-col relative z-10 quiz-fade-in">
          {/* Header */}
          <div className="px-8 py-6">
            <span className="text-sm uppercase tracking-[0.2em] text-primary/40">
              Câu {gameState.currentQuestion + 1}/{QUESTIONS.length} • Đáp
              án
            </span>
          </div>

          {/* Question + Correct Answer */}
          <div className="px-8 md:px-16 py-4 text-center">
            <h2 className="text-2xl md:text-4xl font-display italic text-primary/80 leading-snug mb-6">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Distribution */}
          <div className="flex-1 grid grid-cols-2 gap-3 px-8 md:px-16 pb-4">
            {currentQuestion.options.map((option, idx) => {
              const color = OPTION_COLORS[idx];
              const isCorrect = idx === currentQuestion.correctIndex;
              const count = answerDistribution[idx];
              const pct =
                answeredCount > 0
                  ? Math.round((count / answeredCount) * 100)
                  : 0;

              return (
                <div
                  key={idx}
                  className={`relative rounded-sm flex items-center gap-5 px-6 py-5 md:py-8 transition-all duration-500 ${
                    isCorrect
                      ? "ring-3 ring-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                      : "opacity-40"
                  }`}
                  style={{ backgroundColor: color.bg }}
                >
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                    {isCorrect ? (
                      <svg className="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      color.label
                    )}
                  </span>
                  <div className="flex-1">
                    <span className="text-lg md:text-2xl font-medium text-white leading-snug block">
                      {option}
                    </span>
                    <span className="text-sm text-white/60 mt-1 block">
                      {count} người ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Controls */}
          <div className="px-8 py-4 border-t border-primary/5 flex items-center justify-end gap-4">
            {gameState.currentQuestion >= QUESTIONS.length - 2 ? (
              gameState.currentQuestion < QUESTIONS.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-8 py-3 bg-primary text-background text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#dfba73] transition-all duration-300"
                >
                  Câu tiếp theo →
                </button>
              ) : (
                <button
                  onClick={handleFinishGame}
                  className="px-8 py-3 bg-[#dfba73] text-background text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-400 transition-all duration-300"
                >
                  Kết quả cuối cùng ★
                </button>
              )
            ) : (
              <button
                onClick={handleShowLeaderboard}
                className="px-8 py-3 bg-primary text-background text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#dfba73] transition-all duration-300"
              >
                Bảng xếp hạng
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── LEADERBOARD (Big Screen) ─────────────────────────────────── */}
      {view === "leaderboard" && gameState && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 quiz-fade-in relative z-10">
          <div className="w-full max-w-3xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h2
                className={`${purgatory.className} text-5xl md:text-6xl text-primary lowercase mb-2`}
              >
                Ranking
              </h2>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/30">
                Sau câu {gameState.currentQuestion + 1} / {QUESTIONS.length}
              </p>
            </div>

            {/* Top 10 Leaderboard */}
            <div className="space-y-2 mb-8">
              {leaderboard.slice(0, 10).map((player, idx) => {
                const maxScore = leaderboard[0]?.score || 1;
                const barWidth = Math.max(8, (player.score / maxScore) * 100);

                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-4 quiz-slide-right"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    {/* Rank */}
                    <span
                      className={`w-10 text-center text-lg font-bold ${
                        player.rank === 1
                          ? "text-amber-400"
                          : player.rank === 2
                          ? "text-gray-300"
                          : player.rank === 3
                          ? "text-orange-400"
                          : "text-primary/30"
                      }`}
                    >
                      {player.rank <= 3 ? (
                        <span>{["🥇", "🥈", "🥉"][player.rank - 1]}</span>
                      ) : (
                        player.rank
                      )}
                    </span>

                    {/* Name + Score Bar */}
                    <div className="flex-1 relative h-12">
                      {/* Animated Background Bar */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-sm transition-all duration-700"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor:
                            player.rank === 1
                              ? "rgba(251,191,36,0.25)"
                              : player.rank === 2
                              ? "rgba(200,200,200,0.15)"
                              : player.rank === 3
                              ? "rgba(251,146,60,0.2)"
                              : "rgba(75, 80, 6,0.06)",
                        }}
                      />
                      
                      {/* Text Content (always full width to prevent cropping) */}
                      <div className="absolute inset-0 flex items-center px-4 justify-between pointer-events-none">
                        <span className="text-sm md:text-base font-medium text-primary truncate z-10">
                          {player.nickname}
                        </span>
                        <span className="text-sm font-bold text-primary/70 tabular-nums ml-3 z-10">
                          {player.score.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {gameState.currentQuestion < QUESTIONS.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-12 py-4 bg-primary text-background uppercase tracking-[0.25em] text-sm font-bold hover:bg-[#dfba73] active:scale-[0.97] transition-all duration-300"
                >
                  Câu tiếp theo →
                </button>
              ) : (
                <button
                  onClick={handleFinishGame}
                  className="px-12 py-4 bg-[#dfba73] text-background uppercase tracking-[0.25em] text-sm font-bold hover:bg-amber-400 active:scale-[0.97] transition-all duration-300"
                >
                  Kết quả cuối cùng ★
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FINAL RANKING (Big Screen) ───────────────────────────────── */}
      {view === "finished" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 relative z-10">
          <div className="w-full max-w-4xl text-center">
            {/* Title */}
            <div className="mb-10 quiz-fade-in">
              <h2
                className={`${purgatory.className} text-6xl md:text-8xl text-primary lowercase mb-3`}
              >
                {revealStep < 3 ? "The Result" : "Champion"}
              </h2>
              <div className="w-20 h-[1px] bg-primary/20 mx-auto" />
            </div>

            {/* Step 0: Pre-reveal */}
            {revealStep === 0 && (
              <div className="quiz-fade-in space-y-8">
                <p className="text-xl md:text-2xl font-display italic text-primary/60">
                  Ai sẽ là nhà vô địch?
                </p>
                <button
                  onClick={() => setRevealStep(1)}
                  className="px-16 py-6 border-2 border-[#dfba73] text-[#dfba73] uppercase tracking-[0.25em] text-lg font-bold hover:bg-[#dfba73] hover:text-background active:scale-[0.97] transition-all duration-500 quiz-pulse-glow"
                >
                  🏆 Công bố kết quả
                </button>
              </div>
            )}

            {/* Step 1: 3rd Place */}
            {revealStep === 1 && (
              <div className="quiz-scale-in space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-orange-400/80 font-semibold">
                  🥉 Hạng Ba
                </p>
                {leaderboard[2] ? (
                  <div className="w-44 md:w-56 mx-auto bg-orange-400/10 border border-orange-400/25 rounded-sm py-10 shadow-[0_0_40px_rgba(251,146,60,0.1)]">
                    <span className="text-6xl font-bold text-orange-400 block mb-3">3</span>
                    <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {leaderboard[2].nickname}
                    </p>
                    <span className="text-base text-orange-300 tabular-nums">
                      {leaderboard[2].score.toLocaleString()} điểm
                    </span>
                  </div>
                ) : (
                  <p className="text-primary/40 italic">—</p>
                )}
                <button
                  onClick={() => setRevealStep(2)}
                  className="mt-2 px-12 py-4 bg-primary text-background uppercase tracking-[0.25em] text-sm font-bold hover:bg-[#dfba73] active:scale-[0.97] transition-all duration-300"
                >
                  Tiếp theo →
                </button>
              </div>
            )}

            {/* Step 2: 2nd Place */}
            {revealStep === 2 && (
              <div className="quiz-scale-in space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400/80 font-semibold">
                  🥈 Hạng Nhì
                </p>
                {leaderboard[1] ? (
                  <div className="w-44 md:w-56 mx-auto bg-gray-300/10 border border-gray-300/25 rounded-sm py-10 shadow-[0_0_40px_rgba(200,200,200,0.1)]">
                    <span className="text-6xl font-bold text-gray-300 block mb-3">2</span>
                    <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {leaderboard[1].nickname}
                    </p>
                    <span className="text-base text-gray-400 tabular-nums">
                      {leaderboard[1].score.toLocaleString()} điểm
                    </span>
                  </div>
                ) : (
                  <p className="text-primary/40 italic">—</p>
                )}
                <button
                  onClick={() => setRevealStep(3)}
                  className="mt-2 px-14 py-5 bg-[#dfba73] text-background uppercase tracking-[0.25em] text-base font-bold hover:bg-amber-400 active:scale-[0.97] transition-all duration-300 quiz-pulse-glow"
                >
                  🏆 Công bố Quán quân
                </button>
              </div>
            )}

            {/* Step 3: Champion! */}
            {revealStep === 3 && (
              <div className="quiz-scale-in">
                {leaderboard[0] ? (
                  <div className="space-y-6">
                    <div className="text-amber-400 mb-2">
                      <svg className="w-16 h-16 mx-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                      </svg>
                    </div>
                    <div className="w-52 md:w-64 mx-auto bg-amber-400/10 border-2 border-amber-400/30 rounded-sm py-12 shadow-[0_0_60px_rgba(251,191,36,0.15)]">
                      <span className="text-7xl font-bold text-amber-400 block mb-4">1</span>
                      <p className="text-3xl md:text-4xl font-bold text-primary mb-3">
                        {leaderboard[0].nickname}
                      </p>
                      <span className="text-lg text-amber-300 tabular-nums font-medium">
                        {leaderboard[0].score.toLocaleString()} điểm
                      </span>
                    </div>

                    {/* Full Ranking */}
                    <div className="max-h-48 overflow-y-auto space-y-1 max-w-lg mx-auto mt-6 pt-6 border-t border-primary/10">
                      {leaderboard.slice(1).map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-3 py-2 px-4 text-sm"
                        >
                          <span className="w-6 text-center text-primary/30 tabular-nums">
                            {player.rank === 2 ? "🥈" : player.rank === 3 ? "🥉" : player.rank}
                          </span>
                          <span className="flex-1 text-primary/50 truncate text-left">
                            {player.nickname}
                          </span>
                          <span className="text-primary/30 tabular-nums">
                            {player.score.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-primary/40 italic">Không có người chơi</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Countdown Music */}
      <audio
        ref={countdownAudioRef}
        src="/assets/Nhạc Xổ số Kiến thiết miền Bắc Bản kinh điển - KHÔNG QUẢNG CÁO.mp4"
        loop
        preload="auto"
      />
    </div>
  );
}

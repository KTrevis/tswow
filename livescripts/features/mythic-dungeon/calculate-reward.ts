import { MAX_LEVEL } from "../../player/level-change/level-cap";

export function calculateReward(
  difficulty: uint8,
  averageLevel: uint8
): uint32 {
  const BASE_REWARD = 100;
  const difficultyMultiplier = 1 + difficulty * 0.1;

  // Level scaling: rewards being at max level (endgame content)
  // At MAX_LEVEL, this gives 1.0x (full reward)
  // Below max level, rewards are significantly reduced (e.g., level 14/20 = ~0.58x)
  const levelScaling = Math.pow(<float>averageLevel / <float>MAX_LEVEL, 2);

  const reward = BASE_REWARD * Math.pow(difficultyMultiplier, 2) * levelScaling;
  return Math.floor(reward) / 10;
}

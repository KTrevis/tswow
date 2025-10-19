export function calculateReward(difficulty: uint8): uint32 {
  const BASE_REWARD = 100;
  const difficultyMultiplier = 1 + difficulty * 0.1;
  const reward = BASE_REWARD * Math.pow(difficultyMultiplier, 2);
  return reward;
}

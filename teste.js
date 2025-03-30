function calc(difficultyLevel) {
  const requiredConsecutive = Math.min(6, 3 + Math.floor(difficultyLevel / 5));

  return requiredConsecutive;
}

for (let index = 1; index < 30; index++) {
  console.log(`N${index} - N${index + 1}: ${calc(index)} acertos`);
}

export interface Problem {
  expression: string;
  answer: number;
}

enum MathOperator {
  ADD = "+",
  SUB = "-",
  MUL = "*",
  DIV = "/",
}

export class ArithmeticMathGame {
  private currentOperands = 2;
  private readonly maxOperands = 8;
  private currentProblem: Problem;
  private difficultyLevel = 1;
  private consecutiveCorrect = 0;
  private score = 0;
  private correctAnswers = 0;

  constructor() {
    this.currentProblem = this.generateMathExpression();
  }

  private generateMathExpression(): Problem {
    //Tipo para representar nós da árvore de expressão
    type ExpressionNode = {
      value: number;
      op: string | null;
      left?: ExpressionNode;
      right?: ExpressionNode;
    };

    // 2. Geração dos números e operadores
    const numbers: number[] = [];
    const operators: string[] = [];

    // Primeiro número sempre linear
    numbers.push(this.getRandomNumber(false));

    // Gera operadores e números subsequentes
    for (let i = 0; i < this.currentOperands - 1; i++) {
      operators.push(this.getWeightedOperator());

      // Gera números conforme o operador
      if (
        operators[i] === MathOperator.MUL ||
        operators[i] === MathOperator.DIV
      ) {
        numbers.push(this.getRandomNumber(true)); // Não-linear
      } else {
        numbers.push(this.getRandomNumber(false)); // Linear
      }
    }

    // Ajusta divisões para terem resultados inteiros
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === MathOperator.DIV) {
        let n = this.getDivisor(numbers[i]);
        //verificar se o número passado foi primo. Únicos primos consecultivos 2,3. while só sera iterado 2 vezes para o caso de primo 2
        while (n == null) {
          numbers[i] += 1;
          n = this.getDivisor(numbers[i]);
        }

        numbers[i + 1] = n;
      }
    }

    // Construção da árvore de expressão com precedência
    const buildExpressionTree = (): ExpressionNode => {
      // Lista de nós iniciais (um para cada número)
      const nodes: ExpressionNode[] = numbers.map((num) => ({
        value: num,
        op: null,
      }));

      // Primeiro processa multiplicações e divisões
      for (let i = 0; i < operators.length; i++) {
        if (
          operators[i] === MathOperator.MUL ||
          operators[i] === MathOperator.DIV
        ) {
          const left = nodes[i];
          const right = nodes[i + 1];

          const newNode: ExpressionNode = {
            value:
              operators[i] === MathOperator.MUL
                ? left.value * right.value
                : Math.floor(left.value / right.value),
            op: operators[i],
            left,
            right,
          };

          // Substitui os nós processados pelo novo nó
          nodes.splice(i, 2, newNode);
          operators.splice(i, 1);
          i--; // Ajusta o índice após remoção
        }
      }

      // Depois processa adições e subtrações
      let root = nodes[0];
      for (let i = 0; i < operators.length; i++) {
        const right = nodes[i + 1];

        if (operators[i] === MathOperator.ADD) {
          root = {
            value: root.value + right.value,
            op: MathOperator.ADD,
            left: root,
            right,
          };
        } else {
          // Para subtração, garante valor não negativo
          if (root.value >= right.value) {
            root = {
              value: root.value - right.value,
              op: MathOperator.SUB,
              left: root,
              right,
            };
          } else {
            // Inverte os operandos mantendo a subtração
            root = {
              value: right.value - root.value,
              op: MathOperator.SUB,
              left: right,
              right: root,
            };
          }
        }
      }

      return root;
    };

    // 5. Geração da string da expressão
    const nodeToString = (node: ExpressionNode): string => {
      if (!node.op) return node.value.toString();

      const leftStr = node.left ? nodeToString(node.left) : "";
      const rightStr = node.right ? nodeToString(node.right) : "";

      // Caso especial para subtração invertida
      if (
        node.op === MathOperator.SUB &&
        node.left &&
        node.right &&
        node.value === node.left.value - node.right.value &&
        node.left.value < node.right.value
      ) {
        return `${nodeToString(node.right)} - ${nodeToString(node.left)}`;
      }

      return `(${leftStr} ${node.op} ${rightStr})`;
    };

    // 6. Construção e ajuste final
    let rootNode = buildExpressionTree();

    // Garante resultado não negativo (fallback sem recursão)
    if (rootNode.value < 0) {
      // Encontra qualquer subtração para inverter
      let current: ExpressionNode | undefined = rootNode;
      const stack: ExpressionNode[] = [];

      while (current || stack.length > 0) {
        while (current) {
          stack.push(current);
          current = current.left;
        }

        current = stack.pop()!;

        if (
          current.op === MathOperator.SUB &&
          current.left &&
          current.right &&
          current.value === current.left.value - current.right.value &&
          current.left.value < current.right.value
        ) {
          // Inverte os operandos
          [current.left, current.right] = [current.right, current.left];
          current.value = current.left.value - current.right.value;
          break;
        }

        current = current.right;
      }

      // Recalcula o valor do nó raiz
      rootNode.value = Math.abs(rootNode.value);
    }

    // 7.Remove parênteses desnecessários e substitui operadores
    const finalExpression = nodeToString(rootNode)
      .replace(/^\((.*)\)$/, "$1") // Remove parênteses externos
      .replace(/\s+/g, " ") // Normaliza espaços
      .replace(/\*/g, "×") // Substitui * por ×
      .replace(/\//g, "÷"); // Substitui / por ÷

    return {
      expression: finalExpression,
      answer: rootNode.value,
    };
  }

  //public methods
  getCurrentProblem(): Problem {
    return this.currentProblem;
  }

  checkAnswer(userAnswer: number): boolean {
    if (this.currentProblem.answer == userAnswer) {
      this.consecutiveCorrect++;
      this.score += Math.floor(10 * (this.difficultyLevel / 2));
      this.correctAnswers++;
      this.currentProblem = this.generateMathExpression();
      this.updateDifficulty();

      return true;
    } else {
      return false;
    }
  }

  getCurrentStats() {
    return {
      level: this.difficultyLevel,
      score: this.score,
      correctAnswers: this.correctAnswers,
    };
  }

  // Atualiza dificuldade com crescimento controlado
  private updateDifficulty(): void {
    const minConsecutive = 3;
    const maxConsecutive = 6;

    const requiredConsecutive = Math.min(
      maxConsecutive,
      minConsecutive + Math.floor(this.difficultyLevel / 5)
    );

    if (this.consecutiveCorrect >= requiredConsecutive) {
      // Lógica para aumento suave de operandos primeiro
      if (
        this.difficultyLevel >= 1 &&
        this.currentOperands < this.maxOperands
      ) {
        const increasePoints = [6, 11, 16, 20, 24, 28, 31];

        if (increasePoints.includes(this.difficultyLevel + 1)) {
          this.currentOperands++;
        }
      }

      // Atualiza o nível e zera o contador no FINAL
      this.difficultyLevel++;
      this.consecutiveCorrect = 0;
    }
  }

  //Balanceia probabilidade dos operadores conforme progressão do jogo
  private getWeightedOperator(): string {
    const effectiveDifficulty = Math.max(0, this.difficultyLevel - 1);

    // Definimos os pesos base e suas taxas de mudança
    const weightSettings = {
      [MathOperator.ADD]: { base: 0.45, decayRate: -0.02 }, // Diminui com dificuldade
      [MathOperator.SUB]: { base: 0.35, decayRate: -0.02 }, // Diminui com dificuldade
      [MathOperator.DIV]: { base: 0.08, growthRate: 0.03 }, // Aumenta com dificuldade
      [MathOperator.MUL]: { base: 0.12, growthRate: 0.02 }, // Aumenta com dificuldade
    };

    // Calcula os pesos brutos (não normalizados)
    const rawWeights: Record<string, number> = {};
    let totalWeight = 0;

    for (const [op, settings] of Object.entries(weightSettings)) {
      if ("decayRate" in settings) {
        rawWeights[op] = Math.max(
          0.25,
          settings.base + effectiveDifficulty * settings.decayRate
        );
      } else {
        rawWeights[op] = Math.min(
          0.25,
          settings.base + effectiveDifficulty * settings.growthRate
        );
      }
      totalWeight += rawWeights[op];
    }

    // Normaliza os pesos para que a soma seja 1
    const normalizedWeights: Record<string, number> = {};
    for (const [op, weight] of Object.entries(rawWeights)) {
      normalizedWeights[op] = weight / totalWeight;
    }

    // Seleciona o operador com base nos pesos normalizados
    const rand = Math.random();
    let sum = 0;
    for (const [op, weight] of Object.entries(normalizedWeights)) {
      sum += weight;
      if (rand <= sum) return op;
    }

    return MathOperator.ADD; // Fallback padrão
  }

  //Gera números "aleátorios" em função do nível em um intervalo linear ou não linear
  private getRandomNumber(nonLinear: boolean): number {
    const min = 2;
    let max: number;

    if (nonLinear) {
      // Crescimento não-linear (mais lento) para * e /
      max = Math.floor((Math.sqrt(this.difficultyLevel) / 2) * 6);
    } else {
      // Crescimento linear (mais rápido) para + e -
      max = this.difficultyLevel * 15;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //retorna um divisor aleatório de n
  private getDivisor(n: number): number | null {
    if (n === 0) return 1; // Evita divisão por zero
    const divisors = [];
    const absNumber = Math.abs(n);

    // Encontra todos os divisores maiores que 1 e menor que n
    for (let i = 2; i < absNumber; i++) {
      if (absNumber % i === 0) {
        divisors.push(i);
      }
    }

    // Escolhe um divisor aleatório
    const randomDivisor =
      divisors.length > 0
        ? divisors[Math.floor(Math.random() * divisors.length)]
        : null; // Fallback caso para caso de números primos

    return randomDivisor;
  }

  //funções auxiliáres
  /**
   * Retorna as probabilidades atuais de cada operador em porcentagem
   * @returns Um objeto com as probabilidades em porcentagem para cada operador
   */
  getOperatorProbabilities(): Record<MathOperator, number> {
    const effectiveDifficulty = Math.max(0, this.difficultyLevel - 1);

    // Definimos os pesos base e suas taxas de mudança
    const weightSettings = {
      [MathOperator.ADD]: { base: 0.45, decayRate: -0.02 }, // Diminui com dificuldade
      [MathOperator.SUB]: { base: 0.35, decayRate: -0.02 }, // Diminui com dificuldade
      [MathOperator.DIV]: { base: 0.08, growthRate: 0.03 }, // Aumenta com dificuldade
      [MathOperator.MUL]: { base: 0.12, growthRate: 0.02 }, // Aumenta com dificuldade
    };

    // Calcula os pesos brutos (não normalizados)
    const rawWeights: Record<string, number> = {};
    let totalWeight = 0;

    for (const [op, settings] of Object.entries(weightSettings)) {
      if ("decayRate" in settings) {
        rawWeights[op] = Math.max(
          0.25,
          settings.base + effectiveDifficulty * settings.decayRate
        );
      } else {
        rawWeights[op] = Math.min(
          0.25,
          settings.base + effectiveDifficulty * settings.growthRate
        );
      }
      totalWeight += rawWeights[op];
    }

    // Normaliza os pesos para que a soma seja 1
    const normalizedWeights: Record<string, number> = {};
    for (const [op, weight] of Object.entries(rawWeights)) {
      normalizedWeights[op] = weight / totalWeight;
    }

    // Converte para porcentagem e arredonda para 2 casas decimais
    const percentages = Object.fromEntries(
      Object.entries(normalizedWeights).map(([op, weight]) => [
        op,
        Math.round(weight * 100 * 100) / 100,
      ])
    ) as Record<MathOperator, number>;

    return percentages;
  }

  /**
   * Versão formatada das probabilidades para exibição
   * @returns String formatada com as probabilidades em porcentagem
   */
  getFormattedOperatorProbabilities(): string {
    const probabilities = this.getOperatorProbabilities();
    return Object.entries(probabilities)
      .map(([op, percent]) => `${op}: ${percent}%`)
      .join(", ");
  }
}

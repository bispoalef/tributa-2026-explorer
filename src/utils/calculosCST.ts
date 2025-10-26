// src/utils/calculosCST.ts

export interface ResultadoCST {
  aliquota: number; // total (%)
  valorTributo: number; // soma CBS + IBS
  valorTotal: number; // valor final
  aliquotaCBS: number;
  aliquotaIBS: number;
  valorCBS: number;
  valorIBS: number;
}

/**
 * Define as regras de cálculo conforme o CST informado.
 * Cada CST pode ter alíquotas diferentes para CBS e IBS.
 */
export const getCalculoPorCST = (cst: string, valorBase: number): ResultadoCST => {
  const regras: Record<string, (valor: number) => ResultadoCST> = {

    "000": (valor) => {
      const aliquotaCBS = 0.009;
      const aliquotaIBS = 0.001;
      const valorCBS = valor * aliquotaCBS;
      const valorIBS = valor * aliquotaIBS;
      const valorTributo = valorCBS + valorIBS;
      const valorTotal = valor + valorTributo;

      return {
        aliquota: valorTributo / valor,
        valorTributo,
        valorTotal,
        aliquotaCBS,
        aliquotaIBS,
        valorCBS,
        valorIBS,
      };
    },

   "011": (valor) => {
  // Alíquotas base
  const aliquotaCBSBase = 0.009;
  const aliquotaIBSBase = 0.001;

  // Aplica redução de 60% (mantém 40%)
  const reducao = 0.6;
  const fatorAplicado = 1 - reducao;

  const aliquotaCBS = aliquotaCBSBase * fatorAplicado;
  const aliquotaIBS = aliquotaIBSBase * fatorAplicado;

  const valorCBS = valor * aliquotaCBS;
  const valorIBS = valor * aliquotaIBS;
  const valorTributo = valorCBS + valorIBS;
  const valorTotal = valor + valorTributo;

  return {
    aliquota: valorTributo / valor,
    valorTributo,
    valorTotal,
    aliquotaCBS,
    aliquotaIBS,
    valorCBS,
    valorIBS,
  };
},

   "210": (valor) => {
  // Alíquotas base
  const aliquotaCBSBase = 0.009;
  const aliquotaIBSBase = 0.001;

  // Aplica redução de 60% (mantém 40%)
  const reducao = 0.5;
  const fatorAplicado = 1 - reducao;

  const aliquotaCBS = aliquotaCBSBase * fatorAplicado;
  const aliquotaIBS = aliquotaIBSBase * fatorAplicado;

  const valorCBS = valor * aliquotaCBS;
  const valorIBS = valor * aliquotaIBS;
  const valorTributo = valorCBS + valorIBS;
  const valorTotal = valor + valorTributo;

  return {
    aliquota: valorTributo / valor,
    valorTributo,
    valorTotal,
    aliquotaCBS,
    aliquotaIBS,
    valorCBS,
    valorIBS,
  };
},
  

    default: (valor) => {
      const aliquotaCBS = 0;
      const aliquotaIBS = 0;
      const valorCBS = valor * aliquotaCBS;
      const valorIBS = valor * aliquotaIBS;
      const valorTributo = valorCBS + valorIBS;
      const valorTotal = valor + valorTributo;

      return {
        aliquota: valorTributo / valor,
        valorTributo,
        valorTotal,
        aliquotaCBS,
        aliquotaIBS,
        valorCBS,
        valorIBS,
      };
    },
  };

  const calcular = regras[cst] || regras.default;
  return calcular(valorBase);
};

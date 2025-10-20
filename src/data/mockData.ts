// Mock data for NCM codes
export const ncmData = [
  {
    codigo: "2203.00.00",
    descricao: "Cervejas de malte",
    unidade: "L",
    aliquotaCBS: 18.5,
    aliquotaIBS: 28.3,
    observacoes: "Sujeito ao Imposto Seletivo"
  },
  {
    codigo: "8471.30.12",
    descricao: "Computadores portáteis de peso inferior a 3,5 kg",
    unidade: "UN",
    aliquotaCBS: 16.5,
    aliquotaIBS: 12.0,
    observacoes: "Redução de carga tributária"
  },
  {
    codigo: "0201.10.00",
    descricao: "Carnes de bovino, frescas ou refrigeradas, em carcaças",
    unidade: "KG",
    aliquotaCBS: 9.25,
    aliquotaIBS: 6.0,
    observacoes: "Cesta básica - alíquota reduzida"
  },
  {
    codigo: "3004.90.99",
    descricao: "Outros medicamentos",
    unidade: "UN",
    aliquotaCBS: 12.0,
    aliquotaIBS: 4.0,
    observacoes: "Redução significativa para medicamentos"
  },
  {
    codigo: "8703.23.10",
    descricao: "Automóveis de passageiros, motor explosão, 1000cm³ a 1500cm³",
    unidade: "UN",
    aliquotaCBS: 35.0,
    aliquotaIBS: 26.5,
    observacoes: "Redução moderada"
  },
];

// Mock data for CST codes
export const cstData = [
  {
    codigo: "00",
    descricao: "Tributada integralmente",
    tipo: "Entrada/Saída",
    observacoes: "Operação tributada normalmente"
  },
  {
    codigo: "10",
    descricao: "Tributada e com cobrança do ICMS por substituição tributária",
    tipo: "Entrada/Saída",
    observacoes: "Substituição tributária aplicável"
  },
  {
    codigo: "20",
    descricao: "Com redução de base de cálculo",
    tipo: "Entrada/Saída",
    observacoes: "Base de cálculo reduzida conforme legislação"
  },
  {
    codigo: "30",
    descricao: "Isenta ou não tributada e com cobrança do ICMS por ST",
    tipo: "Entrada/Saída",
    observacoes: "Operação isenta com ST"
  },
  {
    codigo: "40",
    descricao: "Isenta",
    tipo: "Entrada/Saída",
    observacoes: "Operação isenta de tributação"
  },
  {
    codigo: "41",
    descricao: "Não tributada",
    tipo: "Entrada/Saída",
    observacoes: "Operação não sujeita a tributação"
  },
  {
    codigo: "50",
    descricao: "Suspensão",
    tipo: "Entrada/Saída",
    observacoes: "Tributação suspensa"
  },
  {
    codigo: "51",
    descricao: "Diferimento",
    tipo: "Entrada/Saída",
    observacoes: "Tributação diferida para momento posterior"
  },
];

// Mock data for tax rates
export const aliquotasData = [
  {
    tributo: "PIS/COFINS",
    baseLegal: "Lei 10.637/2002 e 10.833/2003",
    aliquotaCBS: 9.25,
    aliquotaIBS: 0,
    setor: "Todos (substituído por CBS)"
  },
  {
    tributo: "CBS",
    baseLegal: "EC 132/2023",
    aliquotaCBS: 0,
    aliquotaIBS: 8.8,
    setor: "Federal - substituirá PIS/COFINS/IPI"
  },
  {
    tributo: "ICMS",
    baseLegal: "Constituição Federal",
    aliquotaCBS: 17.0,
    aliquotaIBS: 0,
    setor: "Estadual (substituído por IBS)"
  },
  {
    tributo: "ISS",
    baseLegal: "LC 116/2003",
    aliquotaCBS: 5.0,
    aliquotaIBS: 0,
    setor: "Municipal (substituído por IBS)"
  },
  {
    tributo: "IBS",
    baseLegal: "EC 132/2023",
    aliquotaCBS: 0,
    aliquotaIBS: 17.7,
    setor: "Estadual/Municipal - substituirá ICMS e ISS"
  },
  {
    tributo: "Imposto Seletivo",
    baseLegal: "EC 132/2023",
    aliquotaCBS: 0,
    aliquotaIBS: 1.5,
    setor: "Produtos prejudiciais à saúde/meio ambiente"
  },
];

// Mock data for tax regimes
export const regimesData = [
  {
    nome: "Simples Nacional",
    descricao: `O Simples Nacional passará por ajustes significativos com a Reforma Tributária. 
    A sistemática de tributação unificada será mantida, mas as faixas de receita bruta e as 
    alíquotas serão recalculadas para refletir o novo modelo IBS/CBS. Empresas optantes pelo 
    Simples continuarão recolhendo os tributos em guia única (DAS), mas os percentuais serão 
    ajustados gradualmente entre 2026 e 2033.`,
    comparativo: `**Antes (2025):**
    - Anexo I (comércio): 4% a 19%
    - Anexo II (indústria): 4,5% a 30%
    - Anexo III (serviços): 6% a 33%
    
    **Depois (2033):**
    - Novas faixas com IBS/CBS integrados
    - Redução estimada de 2 a 5 pontos percentuais
    - Fim do benefício de isenção de ICMS/ISS em alguns Estados`
  },
  {
    nome: "Lucro Presumido",
    descricao: `Empresas tributadas pelo Lucro Presumido terão mudanças significativas. 
    Atualmente, recolhem PIS, COFINS, ICMS, ISS e IRPJ/CSLL separadamente. Com a reforma, 
    PIS e COFINS serão substituídos pela CBS, e ICMS/ISS pelo IBS. A base de cálculo presumida 
    permanecerá (8% a 32% sobre o faturamento para IRPJ), mas haverá novas regras de creditamento 
    para IBS e CBS.`,
    comparativo: `**Antes:**
    - PIS/COFINS: 3,65% (cumulativo)
    - ICMS: 12% a 18%
    - ISS: 2% a 5%
    - IRPJ/CSLL: sobre lucro presumido
    
    **Depois:**
    - CBS: ~8,8% (não cumulativo)
    - IBS: ~17,7% (não cumulativo)
    - IRPJ/CSLL: mantidos
    - Direito a crédito integral de IBS/CBS`
  },
  {
    nome: "Lucro Real",
    descricao: `O Lucro Real será o regime menos impactado estruturalmente, mas terá mudanças 
    importantes no sistema de créditos. Empresas continuarão apurando o lucro contábil e ajustando 
    pelas adições e exclusões do IRPJ/CSLL. No entanto, o sistema não-cumulativo de PIS/COFINS será 
    substituído pelo modelo de CBS, e o complexo sistema de créditos de ICMS dará lugar ao IBS, 
    mais simplificado.`,
    comparativo: `**Antes:**
    - PIS/COFINS: 9,25% (não cumulativo)
    - ICMS: até 20,5% (crédito parcial)
    - ISS: até 5%
    - IRPJ: 15% + 10%
    - CSLL: 9%
    
    **Depois:**
    - CBS: ~8,8% (crédito amplo)
    - IBS: ~17,7% (crédito integral)
    - IRPJ: 15% + 10%
    - CSLL: 9%
    - Sistema de créditos mais transparente`
  },
];

// Mock data for sources
export const fontesData = [
  {
    nome: "Emenda Constitucional nº 132/2023",
    descricao: "Texto oficial da Reforma Tributária",
    url: "http://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm"
  },
  {
    nome: "Receita Federal do Brasil",
    descricao: "Portal oficial com orientações e tabelas atualizadas",
    url: "https://www.gov.br/receitafederal/pt-br"
  },
  {
    nome: "Ministério da Fazenda",
    descricao: "Informações sobre a implementação da reforma",
    url: "https://www.gov.br/fazenda/pt-br"
  },
  {
    nome: "Portal do SPED",
    descricao: "Sistema Público de Escrituração Digital",
    url: "http://sped.rfb.gov.br/"
  },
  {
    nome: "Tabela NCM Completa",
    descricao: "Nomenclatura Comum do Mercosul atualizada",
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/nomenclatura-comum-do-mercosul"
  },
  {
    nome: "Conselho Nacional de Política Fazendária",
    descricao: "CONFAZ - Regulamentação do ICMS e transição para IBS",
    url: "https://www.confaz.fazenda.gov.br/"
  },
];

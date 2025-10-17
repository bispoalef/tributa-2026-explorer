import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SimulationResult {
  regime: string;
  cargaAtual: number;
  cargaFutura: number;
  economia: number;
  percentualEconomia: number;
}

const Simulador = () => {
  const [ncm, setNcm] = useState("");
  const [regime, setRegime] = useState("");
  const [faturamento, setFaturamento] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const calculateTaxes = () => {
    if (!regime || !faturamento) return;

    const valor = parseFloat(faturamento);
    let cargaAtual = 0;
    let cargaFutura = 0;

    // Cálculos simplificados para demonstração
    switch (regime) {
      case "simples":
        cargaAtual = valor * 0.11; // ~11% média Simples
        cargaFutura = valor * 0.085; // ~8.5% estimado pós-reforma
        break;
      case "presumido":
        cargaAtual = valor * 0.138; // ~13.8% média
        cargaFutura = valor * 0.115; // ~11.5% estimado
        break;
      case "real":
        cargaAtual = valor * 0.219; // ~21.9% média
        cargaFutura = valor * 0.185; // ~18.5% estimado
        break;
    }

    const economia = cargaAtual - cargaFutura;
    const percentualEconomia = ((economia / cargaAtual) * 100);

    setResult({
      regime: regime === "simples" ? "Simples Nacional" : regime === "presumido" ? "Lucro Presumido" : "Lucro Real",
      cargaAtual,
      cargaFutura,
      economia,
      percentualEconomia
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Simulador de Alíquotas
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Estime o impacto da Reforma Tributária no seu negócio
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              Dados para Simulação
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="ncm">NCM (Opcional)</Label>
                <Input
                  id="ncm"
                  placeholder="Ex: 2203.00.00"
                  value={ncm}
                  onChange={(e) => setNcm(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="regime">Regime Tributário *</Label>
                <Select value={regime} onValueChange={setRegime}>
                  <SelectTrigger id="regime">
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples Nacional</SelectItem>
                    <SelectItem value="presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="real">Lucro Real</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="faturamento">Faturamento Mensal (R$) *</Label>
                <Input
                  id="faturamento"
                  type="number"
                  placeholder="Ex: 100000"
                  value={faturamento}
                  onChange={(e) => setFaturamento(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={calculateTaxes}
                disabled={!regime || !faturamento}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Simular Impacto
              </Button>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-lg bg-muted/30 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Os cálculos são estimativas baseadas em dados públicos e médias setoriais. 
                Os valores reais podem variar conforme atividade econômica, legislação 
                complementar e características específicas da empresa.
              </p>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card className="overflow-hidden">
                  <div className="h-2 bg-gradient-primary"></div>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        Resultado da Simulação
                      </h3>
                      <Badge variant="secondary">{result.regime}</Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted/30 p-4">
                        <div className="mb-1 text-sm text-muted-foreground">
                          Carga Tributária Atual
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          R$ {result.cargaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className="rounded-lg bg-primary/10 p-4">
                        <div className="mb-1 text-sm text-primary">
                          Carga Tributária Futura (IBS/CBS)
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          R$ {result.cargaFutura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className={`rounded-lg p-4 ${result.economia > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium text-foreground">
                            {result.economia > 0 ? 'Economia Estimada' : 'Aumento Estimado'}
                          </div>
                          {result.economia > 0 ? (
                            <TrendingDown className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingUp className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className={`text-3xl font-bold ${result.economia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {Math.abs(result.economia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`mt-1 text-sm ${result.economia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(result.percentualEconomia).toFixed(1)}% {result.economia > 0 ? 'de redução' : 'de aumento'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-l-4 border-l-primary p-6">
                  <h4 className="mb-3 font-semibold text-foreground">
                    💡 Interpretação do Resultado
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {result.economia > 0 ? (
                      <>
                        A simulação indica uma <strong>redução na carga tributária</strong> com 
                        a implementação da Reforma. Isso se deve principalmente à simplificação 
                        do sistema e à possibilidade de crédito integral de IBS e CBS ao longo 
                        da cadeia produtiva.
                      </>
                    ) : (
                      <>
                        A simulação indica um <strong>possível aumento</strong> na carga tributária. 
                        No entanto, considere que haverá benefícios indiretos como simplificação 
                        administrativa, redução de custos de conformidade e maior transparência 
                        na cadeia produtiva.
                      </>
                    )}
                  </p>
                </Card>
              </>
            ) : (
              <Card className="flex h-full items-center justify-center p-12 text-center">
                <div>
                  <Calculator className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Preencha os dados ao lado e clique em "Simular Impacto" 
                    para ver os resultados
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <Card className="mt-8 border-l-4 border-l-secondary p-6">
          <h3 className="mb-3 font-semibold text-foreground">
            Sobre esta Simulação
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Este simulador utiliza médias setoriais e estimativas baseadas na legislação atual 
            (EC 132/2023). Os valores reais dependerão das leis complementares que ainda serão 
            aprovadas, da atividade específica da empresa, e de eventuais regimes especiais ou 
            benefícios fiscais. Recomenda-se consultar um contador ou advogado tributarista 
            para análises mais precisas.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Simulador;

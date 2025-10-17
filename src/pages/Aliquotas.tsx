import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight } from "lucide-react";
import { aliquotasData } from "@/data/mockData";

const Aliquotas = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Tabela de Alíquotas
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Comparativo entre o sistema tributário atual e o novo modelo IBS/CBS
          </p>
        </div>

        {/* Timeline Info */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Período Atual</div>
            <div className="text-xl font-bold text-foreground">Até 2025</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Sistema vigente com múltiplos tributos
            </p>
          </Card>
          <Card className="bg-gradient-primary p-6 text-white">
            <div className="mb-2 text-sm font-medium text-white/80">Transição</div>
            <div className="text-xl font-bold">2026-2032</div>
            <p className="mt-2 text-sm text-white/80">
              Implementação gradual do IBS/CBS
            </p>
          </Card>
          <Card className="p-6">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Novo Sistema</div>
            <div className="text-xl font-bold text-foreground">A partir de 2033</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Sistema completamente implementado
            </p>
          </Card>
        </div>

        {/* Tax Comparison Table */}
        <div className="space-y-4">
          {aliquotasData.map((item, index) => (
            <Card
              key={item.tributo}
              className="overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Tax Info */}
                <div className="flex-1 border-b p-6 lg:border-b-0 lg:border-r">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {item.tributo}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.baseLegal}
                      </p>
                    </div>
                    <Badge variant="outline">{item.setor}</Badge>
                  </div>
                </div>

                {/* Rates Comparison */}
                <div className="flex w-full flex-col bg-muted/30 lg:w-96">
                  <div className="flex flex-1 items-center justify-between border-b p-6">
                    <div>
                      <div className="mb-1 text-xs font-medium text-muted-foreground">
                        ALÍQUOTA ATUAL
                      </div>
                      <div className="text-3xl font-bold text-foreground">
                        {item.aliquotaAtual === 0 ? "—" : `${item.aliquotaAtual.toFixed(2)}%`}
                      </div>
                    </div>
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="mb-1 text-xs font-medium text-muted-foreground">
                        ALÍQUOTA FUTURA
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {item.aliquotaFutura === 0 ? "—" : `${item.aliquotaFutura.toFixed(2)}%`}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center justify-center p-4">
                    {item.aliquotaAtual === 0 && item.aliquotaFutura > 0 ? (
                      <Badge className="bg-green-600">Novo Tributo</Badge>
                    ) : item.aliquotaAtual > 0 && item.aliquotaFutura === 0 ? (
                      <Badge variant="secondary">Será Substituído</Badge>
                    ) : (
                      <Badge>Em Vigor</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-primary p-6">
            <h3 className="mb-3 font-semibold text-foreground">
              Sobre as Alíquotas
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              As alíquotas apresentadas são estimativas baseadas na legislação atual e podem 
              sofrer alterações conforme aprovação das leis complementares. A alíquota padrão 
              do IBS/CBS será definida anualmente, podendo haver alíquotas reduzidas para 
              setores específicos como saúde, educação e transporte público.
            </p>
          </Card>
          
          <Card className="border-l-4 border-l-secondary p-6">
            <h3 className="mb-3 font-semibold text-foreground">
              Setores com Benefícios
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Cesta básica: alíquota zero ou reduzida</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Saúde e medicamentos: redução de até 60%</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Educação: isenção mantida</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Transporte público: alíquota reduzida</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Aliquotas;

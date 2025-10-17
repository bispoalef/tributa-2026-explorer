import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Calculator, FileText, List, TrendingUp, Database } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const quickActions = [
  {
    title: "Consultar NCM",
    description: "Busque códigos NCM e verifique alíquotas atualizadas",
    icon: List,
    href: "/ncm",
    gradient: "from-primary to-secondary"
  },
  {
    title: "Consultar CST",
    description: "Códigos de Situação Tributária detalhados",
    icon: FileText,
    href: "/cst",
    gradient: "from-secondary to-primary"
  },
  {
    title: "Mudanças por Regime",
    description: "Impactos no Simples, Presumido e Lucro Real",
    icon: TrendingUp,
    href: "/regimes",
    gradient: "from-primary to-accent"
  },
  {
    title: "Simulador de Alíquotas",
    description: "Estime a carga tributária antes e depois",
    icon: Calculator,
    href: "/simulador",
    gradient: "from-accent to-secondary"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-primary py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in">
                Reforma Tributária 2026
              </h1>
              <p className="mb-8 text-xl text-white/90 animate-fade-in">
                Tudo o que você precisa saber sobre o novo sistema tributário brasileiro
              </p>
              <p className="mb-10 text-lg leading-relaxed text-white/80 animate-fade-in">
                Consulta rápida de NCM, CST, alíquotas e mudanças por regime tributário. 
                Informações atualizadas sobre IBS, CBS e Imposto Seletivo.
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
                <Link to="/ncm">
                  <Button size="lg" variant="secondary" className="shadow-lg">
                    <Database className="mr-2 h-5 w-5" />
                    Explorar NCM
                  </Button>
                </Link>
                <Link to="/simulador">
                  <Button size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20">
                    <Calculator className="mr-2 h-5 w-5" />
                    Simular Impacto
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        {/* Quick Actions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">Acesso Rápido</h2>
              <p className="text-muted-foreground">
                Navegue pelas principais ferramentas e informações
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <Link key={action.title} to={action.href}>
                  <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className={`h-2 bg-gradient-to-r ${action.gradient}`}></div>
                    <div className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About the Reform */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h2 className="mb-4 text-3xl font-bold text-foreground">
                  Entenda a Reforma Tributária
                </h2>
              </div>

              <div className="space-y-6 text-muted-foreground">
                <Card className="p-6">
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    O Novo Sistema Tributário
                  </h3>
                  <p className="leading-relaxed">
                    A Emenda Constitucional nº 132/2023 estabelece a maior reforma tributária 
                    da história do Brasil, unificando tributos sobre consumo em um modelo mais 
                    simples e transparente. O sistema atual de múltiplos impostos (PIS, COFINS, 
                    IPI, ICMS, ISS) será substituído por apenas três tributos:
                  </p>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-6">
                    <h4 className="mb-2 font-semibold text-primary">CBS</h4>
                    <p className="text-sm">
                      Contribuição sobre Bens e Serviços (Federal) - substitui PIS, COFINS e IPI
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h4 className="mb-2 font-semibold text-secondary">IBS</h4>
                    <p className="text-sm">
                      Imposto sobre Bens e Serviços (Estadual/Municipal) - substitui ICMS e ISS
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h4 className="mb-2 font-semibold text-accent">IS</h4>
                    <p className="text-sm">
                      Imposto Seletivo - incide sobre produtos prejudiciais à saúde ou ao meio ambiente
                    </p>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    Prazos de Implementação
                  </h3>
                  <p className="leading-relaxed">
                    A transição será gradual, iniciando em 2026 com a implementação da CBS e IBS 
                    em alíquotas reduzidas. O sistema estará completamente implementado até 2033, 
                    quando os tributos antigos serão totalmente extintos. Este portal será atualizado 
                    conforme novas leis complementares forem publicadas.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2, TrendingUp } from "lucide-react";
import { regimesData } from "@/data/mockData";

const Regimes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Mudanças por Regime Tributário
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Entenda como a Reforma Tributária impacta cada regime de tributação
          </p>
        </div>

        {/* Intro Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="mt-1 h-6 w-6 text-primary" />
            <div>
              <h3 className="mb-2 font-semibold text-foreground">
                Transição Gradual
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A implementação da Reforma Tributária ocorrerá de forma gradual entre 2026 e 2033. 
                Durante este período, empresas terão tempo para se adaptar às novas regras e sistemas. 
                Cada regime tributário terá suas particularidades e ajustes específicos.
              </p>
            </div>
          </div>
        </Card>

        {/* Regimes Accordion */}
        <div className="space-y-6">
          {regimesData.map((regime, index) => (
            <Card
              key={regime.nome}
              className="overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-2 bg-gradient-primary"></div>
              <div className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">
                  {regime.nome}
                </h2>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="descricao">
                    <AccordionTrigger className="text-left">
                      Como funcionará no novo sistema?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <p className="leading-relaxed text-foreground">
                          {regime.descricao}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="comparativo">
                    <AccordionTrigger className="text-left">
                      Comparativo: Antes vs Depois
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                          {regime.comparativo}
                        </pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-primary p-6">
            <h3 className="mb-3 font-semibold text-foreground">
              ⚠️ Pontos de Atenção
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Revisão de contratos e precificação será necessária</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Sistemas de gestão precisarão ser atualizados</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Planejamento tributário deve considerar o período de transição</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Capacitação das equipes fiscais e contábeis é fundamental</span>
              </li>
            </ul>
          </Card>
          
          <Card className="border-l-4 border-l-secondary p-6">
            <h3 className="mb-3 font-semibold text-foreground">
              ✅ Benefícios Gerais
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Simplificação significativa do sistema tributário</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Transparência na cadeia produtiva com créditos integrais</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Redução de custos de conformidade fiscal</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Fim da guerra fiscal entre estados</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Regimes;

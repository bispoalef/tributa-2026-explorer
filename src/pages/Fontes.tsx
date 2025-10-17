import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react";
import { fontesData } from "@/data/mockData";

const Fontes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Fontes Oficiais
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Referências e documentos oficiais sobre a Reforma Tributária
          </p>
        </div>

        {/* Sources List */}
        <div className="space-y-4">
          {fontesData.map((fonte, index) => (
            <Card
              key={fonte.nome}
              className="overflow-hidden transition-all hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-1 bg-gradient-primary"></div>
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {fonte.nome}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {fonte.descricao}
                  </p>
                </div>
                <Button
                  asChild
                  className="shrink-0"
                >
                  <a href={fonte.url} target="_blank" rel="noopener noreferrer">
                    Acessar
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-primary p-6">
            <h3 className="mb-3 font-semibold text-foreground">
              📚 Legislação Complementar
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              A Emenda Constitucional 132/2023 estabelece as diretrizes gerais, mas diversas 
              leis complementares ainda precisam ser aprovadas para regulamentar aspectos 
              específicos da reforma, como:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Alíquotas definitivas do IBS e CBS</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Regras de creditamento</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Definição de setores com tratamento diferenciado</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Operacionalização do Imposto Seletivo</span>
              </li>
            </ul>
          </Card>

          <Card className="border-l-4 border-l-secondary p-6">
            <h3 className="mb-3 font-semibold text-foreground">
              🔄 Atualizações
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Este portal será constantemente atualizado conforme novas informações sejam 
              divulgadas pelos órgãos oficiais. Recomendamos:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Acompanhar o site da Receita Federal regularmente</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Consultar seu contador ou advogado tributarista</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Participar de webinars e treinamentos sobre a reforma</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Manter sistemas de gestão atualizados</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* API Documentation Preview */}
        <Card className="mt-8 overflow-hidden">
          <div className="h-2 bg-gradient-primary"></div>
          <div className="p-6">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              📡 Exemplo de Consulta via API
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Este portal disponibilizará uma API pública para consulta de dados. Exemplo de resposta JSON:
            </p>
            <div className="rounded-lg bg-muted/50 p-4">
              <pre className="overflow-x-auto text-xs text-foreground">
{`{
  "ncm": "2203.00.00",
  "descricao": "Cervejas de malte",
  "unidade": "L",
  "aliquota_atual": 18.5,
  "aliquota_cbs": 8.8,
  "aliquota_ibs": 17.7,
  "aliquota_is": 1.8,
  "total_futura": 28.3,
  "observacoes": "Sujeito ao Imposto Seletivo",
  "base_legal": "EC 132/2023"
}`}
              </pre>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              * A API estará disponível em breve com documentação completa e endpoints para consulta de NCM, CST, alíquotas e regimes.
            </p>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-8 border-l-4 border-l-accent bg-accent/5 p-6">
          <h3 className="mb-2 font-semibold text-foreground">
            ⚠️ Aviso Importante
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            As informações apresentadas neste portal são baseadas em fontes oficiais e têm 
            caráter informativo. Para decisões tributárias específicas, recomenda-se sempre 
            consultar profissionais especializados (contadores, advogados tributaristas) e 
            verificar a legislação vigente mais recente. Este portal não se responsabiliza 
            por decisões tomadas com base exclusivamente nas informações aqui contidas.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Fontes;

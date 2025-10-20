import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { ncmData } from "@/data/mockData";

const NCM = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = ncmData.filter(
    (item) =>
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAliquotaChange = (atual: number, futura: number) => {
    const diff = futura - atual;
    if (diff > 0) return { icon: TrendingUp, color: "text-destructive", type: "aumento" };
    if (diff < 0) return { icon: TrendingDown, color: "text-green-600", type: "redução" };
    return { icon: Minus, color: "text-muted-foreground", type: "mantém" };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Consulta de NCM
          </h1>
          <p className="text-lg text-muted-foreground">
            Nomenclatura Comum do Mercosul - Códigos e alíquotas atualizadas para 2026
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por código ou descrição..."
              className="pl-10 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Info Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total de NCMs</div>
            <div className="text-2xl font-bold text-foreground">{ncmData.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Resultados</div>
            <div className="text-2xl font-bold text-foreground">{filteredData.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <Badge variant="secondary">Atualizado 2026</Badge>
          </Card>
        </div>

        {/* NCM List */}
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Nenhum código NCM encontrado. Tente outra busca.
              </p>
            </Card>
          ) : (
            filteredData.map((item, index) => {
              const change = getAliquotaChange(item.aliquotaCBS, item.aliquotaIBS);
              const ChangeIcon = change.icon;
              
              return (
                <Card
                  key={item.codigo}
                  className="overflow-hidden transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left Section - Code and Description */}
                    <div className="flex-1 border-b p-6 md:border-b-0 md:border-r">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">
                            NCM
                          </span>
                          <h3 className="text-2xl font-bold text-primary">
                            {item.codigo}
                          </h3>
                        </div>
                        <Badge variant="outline">{item.unidade}</Badge>
                      </div>
                      <p className="text-foreground">{item.descricao}</p>
                      {item.observacoes && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {item.observacoes}
                        </p>
                      )}
                    </div>

                    {/* Right Section - Tax Rates */}
                    <div className="w-full bg-muted/30 p-6 md:w-80">
                      <div className="mb-4">
                        <div className="mb-1 text-xs font-medium text-muted-foreground">
                          ALÍQUOTA CBS
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {item.aliquotaCBS.toFixed(2)}%
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="mb-1 text-xs font-medium text-muted-foreground">
                          ALÍQUOTA IBS
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-foreground">
                            {item.aliquotaIBS.toFixed(2)}%
                          </div>
                          <ChangeIcon className={`h-5 w-5 ${change.color}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-background p-2">
                        <span className="text-xs font-medium">Variação:</span>
                        <span className={`text-sm font-bold ${change.color}`}>
                          {(item.aliquotaIBS - item.aliquotaCBS).toFixed(2)} p.p.
                        </span>
                        <Badge
                          variant={change.type === "redução" ? "default" : "secondary"}
                          className="ml-auto"
                        >
                          {change.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Additional Info */}
        <Card className="mt-8 border-l-4 border-l-primary p-6">
          <h3 className="mb-2 font-semibold text-foreground">
            Sobre os códigos NCM
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A Nomenclatura Comum do Mercosul (NCM) é um código de oito dígitos estabelecido 
            pelo Governo Brasileiro para identificar a natureza das mercadorias. Com a Reforma 
            Tributária, as alíquotas serão unificadas no sistema IBS/CBS, simplificando a 
            tributação sobre produtos.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default NCM;

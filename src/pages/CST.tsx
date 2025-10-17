import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText } from "lucide-react";
import { cstData } from "@/data/mockData";

const CST = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = cstData.filter(
    (item) =>
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Códigos CST
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Código de Situação Tributária - Classificação das operações fiscais
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por código, descrição ou tipo..."
              className="pl-10 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* CST List */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredData.length === 0 ? (
            <Card className="col-span-2 p-8 text-center">
              <p className="text-muted-foreground">
                Nenhum código CST encontrado. Tente outra busca.
              </p>
            </Card>
          ) : (
            filteredData.map((item, index) => (
              <Card
                key={item.codigo}
                className="overflow-hidden transition-all hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="h-1 bg-gradient-primary"></div>
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        CST
                      </span>
                      <h3 className="text-3xl font-bold text-primary">
                        {item.codigo}
                      </h3>
                    </div>
                    <Badge variant="secondary">{item.tipo}</Badge>
                  </div>
                  
                  <h4 className="mb-2 font-semibold text-foreground">
                    {item.descricao}
                  </h4>
                  
                  {item.observacoes && (
                    <p className="text-sm text-muted-foreground">
                      {item.observacoes}
                    </p>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Additional Info */}
        <Card className="mt-8 border-l-4 border-l-secondary p-6">
          <h3 className="mb-2 font-semibold text-foreground">
            Sobre os códigos CST
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            O Código de Situação Tributária (CST) é utilizado para identificar a origem da 
            mercadoria e a forma de tributação que deve incidir sobre ela. Com a Reforma 
            Tributária, a estrutura dos CSTs será adaptada para o novo sistema IBS/CBS, 
            mantendo a lógica de classificação mas simplificando as exceções e regimes especiais.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default CST;

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CSTPage() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(
    null
  );

  // 📦 Carrega o JSON da pasta "public/data"
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data/ncm.json");
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Erro ao carregar ncm.json:", err);
        setError("Falha ao carregar os dados de CST.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 🔍 Busca dinâmica em todos os campos
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, data]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Cabeçalho */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Consulta de CST
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Códigos de Situação Tributária - IBS/CBS conforme LC 214/25
          </p>
        </div>

        {/* Estado de carregamento / erro */}
        {loading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </Card>
        )}
        {error && (
          <Card className="p-8 text-center border-l-4 border-l-destructive">
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        {!loading && !error && (
          <>
            {/* Barra de busca */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por qualquer campo..."
                  className="pl-10 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Cards de resumo */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Total de Registros
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {data.length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Resultados da Busca
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {filteredData.length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Status
                </div>
                <Badge variant="secondary">LC 214/25</Badge>
              </Card>
            </div>

            {/* Lista de CSTs */}
            <div className="space-y-4">
              {filteredData.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Nenhum código CST encontrado. Tente outra busca.
                  </p>
                </Card>
              ) : (
                filteredData.map((item, index) => (
                  <Card
                    key={`${item["CST-IBS/CBS"]}-${item.cClassTrib || index}`}
                    onClick={() => setSelectedItem(item)}
                    className="overflow-hidden transition-all hover:shadow-lg animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Esquerda */}
                      <div className="flex-1 border-b p-6 md:border-b-0 md:border-r">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">
                              CST
                            </span>
                            <h3 className="text-2xl font-bold text-primary">
                              {item["CST-IBS/CBS"]}
                            </h3>
                          </div>
                          {item["Nome cClassTrib"] && (
                            <Badge variant="outline">
                              {item["Nome cClassTrib"]}
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-foreground">
                          {item["Descrição CST-IBS/CBS"]}
                        </p>
                        {item["Descrição cClassTrib"] && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {item["Descrição cClassTrib"]}
                          </p>
                        )}
                      </div>

                      {/* Direita */}
                      <div className="w-full bg-muted/30 p-6 md:w-96">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {item["LC 214/25 Redação"] ? (
                            <p className="whitespace-pre-line">
                              {item["LC 214/25 Redação"]}
                            </p>
                          ) : (
                            <p className="italic">Sem redação específica</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Modal de detalhes */}
            {selectedItem && (
              <Dialog
                open={!!selectedItem}
                onOpenChange={() => setSelectedItem(null)}
              >
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedItem["CST-IBS/CBS"]} -{" "}
                      {selectedItem["Descrição CST-IBS/CBS"]}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="mt-4 space-y-2">
                    {Object.entries(selectedItem).map(([key, value]) => (
                      <p key={key} className="text-sm text-muted-foreground">
                        <strong>{key}:</strong>{" "}
                        <span className="text-foreground">{String(value)}</span>
                      </p>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Rodapé de informações */}
            <Card className="mt-8 border-l-4 border-l-primary p-6">
              <h3 className="mb-2 font-semibold text-foreground">
                Sobre os códigos CST
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                O Código de Situação Tributária (CST) identifica a origem e forma
                de tributação das operações. No novo sistema IBS/CBS, a
                classificação foi atualizada conforme a LC 214/25, mantendo a
                estrutura e simplificando regras especiais.
              </p>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

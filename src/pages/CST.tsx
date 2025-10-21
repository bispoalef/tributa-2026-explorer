import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, X, ChevronDown, ChevronUp } from "lucide-react";

// ✅ Tipo para cada item do JSON
interface CSTItem {
  "CST-IBS/CBS": string;
  "Descrição CST-IBS/CBS": string;
  cClassTrib?: string;
  "Nome cClassTrib"?: string;
  "Descrição cClassTrib"?: string;
  "LC 214/25 Redação"?: string;
}

// ✅ Tipo para o modal
interface SelectedCST {
  codigo: string;
  related: CSTItem[];
}

// ✅ Componente de texto colapsável
function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4" /> Ver menos
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" /> Ver mais
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-2 bg-muted p-3 rounded-lg text-xs text-muted-foreground whitespace-pre-wrap transition-all duration-300 ease-in-out">
          {text}
        </div>
      )}
    </div>
  );
}

export default function CSTPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedData, setGroupedData] = useState<CSTItem[]>([]);
  const [ncmData, setNcmData] = useState<CSTItem[]>([]);
  const [selectedCST, setSelectedCST] = useState<SelectedCST | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1️⃣ Carregar JSON via fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data/ncm.json");
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        const json: CSTItem[] = await res.json();
        setNcmData(json);

        // Agrupar por CST (primeiro item de cada grupo)
        const grouped = Object.values(
          json.reduce<Record<string, CSTItem>>((acc, item) => {
            const key = item["CST-IBS/CBS"];
            if (!acc[key]) acc[key] = item;
            return acc;
          }, {})
        );

        setGroupedData(grouped);
      } catch (err) {
        console.error("Erro ao carregar ncm.json:", err);
        setError("Falha ao carregar dados dos CSTs.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 2️⃣ Filtro de busca otimizado
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return groupedData;
    const lower = searchTerm.toLowerCase();
    return groupedData.filter(
      (item) =>
        item["CST-IBS/CBS"]?.toLowerCase().includes(lower) ||
        item["Descrição CST-IBS/CBS"]?.toLowerCase().includes(lower)
    );
  }, [searchTerm, groupedData]);

  // 3️⃣ Modal
  const openModal = (codigo: string) => {
    const related = ncmData.filter(
      (item) => item["CST-IBS/CBS"] === codigo
    );
    setSelectedCST({ codigo, related });
  };

  const closeModal = () => setSelectedCST(null);

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
              Códigos CST-IBS/CBS
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Código de Situação Tributária — Classificação das operações fiscais
          </p>
        </div>

        {/* Barra de busca */}
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

        {/* Estado de carregamento / erro */}
        {loading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Carregando códigos CST...</p>
          </Card>
        )}
        {error && (
          <Card className="p-8 text-center border-l-4 border-l-destructive">
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        {/* Lista */}
        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredData.length === 0 ? (
              <Card className="col-span-2 p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum código CST encontrado.
                </p>
              </Card>
            ) : (
              filteredData.map((item, index) => (
                <Card
                  key={item["CST-IBS/CBS"]}
                  className="overflow-hidden cursor-pointer transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => openModal(item["CST-IBS/CBS"])}
                >
                  <div className="h-1 bg-gradient-primary"></div>
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          CST-IBS/CBS
                        </span>
                        <h3 className="text-3xl font-bold text-primary">
                          {item["CST-IBS/CBS"]}
                        </h3>
                      </div>
                      <Badge variant="secondary">IBS/CBS</Badge>
                    </div>
                    <h4 className="mb-2 font-semibold text-foreground">
                      {item["Descrição CST-IBS/CBS"]}
                    </h4>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Rodapé de informações */}
        <Card className="mt-8 border-l-4 border-l-secondary p-6">
          <h3 className="mb-2 font-semibold text-foreground">
            Sobre os códigos CST-IBS/CBS
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            O Código de Situação Tributária (CST) é utilizado para identificar a
            origem da mercadoria e a forma de tributação aplicável. Com a
            Reforma Tributária, os CSTs foram adaptados para o novo sistema
            IBS/CBS, mantendo a lógica de classificação, mas com maior
            simplificação.
          </p>
        </Card>
      </main>

      <Footer />

      {/* Modal */}
      {selectedCST && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">
                Detalhes CST {selectedCST.codigo}
              </h2>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
              {selectedCST.related.map((item) => (
                <Card key={item.cClassTrib} className="p-4">
                  <h4 className="font-semibold text-primary">
                    cClassTrib: {item.cClassTrib} — {item["Nome cClassTrib"]}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item["Descrição cClassTrib"]}
                  </p>
                  {item["LC 214/25 Redação"] && (
                    <ExpandableText text={item["LC 214/25 Redação"]} />
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

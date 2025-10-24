import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingDown, TrendingUp, Minus, X, Scale } from "lucide-react";

function ExpandableLegislation({
  descricao,
  legislacao,
}: {
  descricao?: string;
  legislacao?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <Scale className="h-5 w-5" />
        <span className="text-sm font-medium">
          {expanded ? "Ocultar detalhes" : "Ver legislação"}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 bg-muted p-4 rounded-xl text-xs text-muted-foreground whitespace-pre-wrap transition-all duration-300 ease-in-out space-y-3">
          {descricao && (
            <div>
              <h5 className="font-semibold text-foreground mb-1">
                Descrição:
              </h5>
              <p>{descricao}</p>
            </div>
          )}

          {legislacao && (
            <div>
              <h5 className="font-semibold text-foreground mb-1">
                LC 214/25 — Redação:
              </h5>
              <p>{legislacao}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const NCM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ncmData, setNcmData] = useState<any[]>([]);
  const [cstData, setCstData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCClass, setSelectedCClass] = useState<any | null>(null);

  // Carrega os dados de NCM e CST simultaneamente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ncmRes, cstRes] = await Promise.all([
          fetch("/data/ncm.json"),
          fetch("/data/cst.json"),
        ]);

        if (!ncmRes.ok || !cstRes.ok) throw new Error("Erro ao carregar dados");

        const [ncmRaw, cstRaw] = await Promise.all([
          ncmRes.json(),
          cstRes.json(),
        ]);

        const normalizedNCM = ncmRaw.map((item: any) => ({
          codigo: item["NCM"] ?? "",
          descricao: item["Descrição"] ?? "",
          cst: item["CST-IBS/CBS"] ?? "",
          cClassTrib: item["cClassTrib"] ?? "",
          aliquotaCBS: Number(item["Alíquota CBS"] ?? 0),
          aliquotaIBS: Number(item["Alíquota IBS"] ?? 0),
        }));

        const normalizedCST = cstRaw.map((item: any) => ({
          cClassTrib: item["cClassTrib"] ?? "",
          cst: item["CST-IBS/CBS"] ?? "",
          descricaoCST: item["Descrição CST-IBS/CBS"] ?? "",
          nomeCClass: item["Nome cClassTrib"] ?? "",
          descricaoCClass: item["Descrição cClassTrib"] ?? "",
          legislacao: item["LC 214/25 Redação"] ?? "",
        }));

        setNcmData(normalizedNCM);
        setCstData(normalizedCST);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtro de busca
  const filteredData = ncmData.filter(
    (item) =>
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcula diferença de alíquota
  const getAliquotaChange = (atual: number, futura: number) => {
    const diff = futura - atual;
    if (diff > 0)
      return { icon: TrendingUp, color: "text-destructive", type: "aumento" };
    if (diff < 0)
      return { icon: TrendingDown, color: "text-green-600", type: "redução" };
    return { icon: Minus, color: "text-muted-foreground", type: "mantém" };
  };

  // Busca descrição CST correspondente ao cClassTrib
  const getDescricaoCST = (cClassTrib: string) => {
    const match = cstData.find((cst) => cst.cClassTrib === cClassTrib);
    return match ? match.descricaoCST : "descrição CST não encontrada";
  };

  // 🔧 NOVA FUNÇÃO — Busca o valor correto da CST pelo cClassTrib
  const getCSTValue = (cClassTrib: string) => {
    const match = cstData.find((cst) => cst.cClassTrib === cClassTrib);
    return match ? match.cst : "—";
  };

  // Abre modal do cClassTrib
  const openCClassModal = (cClassTrib: string) => {
    const related = cstData.filter((item) => item.cClassTrib === cClassTrib);
    if (related.length > 0) {
      setSelectedCClass(related[0]);
    }
  };

  const closeModal = () => setSelectedCClass(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Cabeçalho */}
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Consulta de NCM
          </h1>
          <p className="text-lg text-muted-foreground">
            Nomenclatura Comum do Mercosul — Códigos e alíquotas atualizadas
            para 2026
          </p>
        </div>

        {/* Barra de busca */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por código ou descrição..."
            className="pl-10 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Cards resumo */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total de NCMs</div>
            <div className="text-2xl font-bold">{ncmData.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Resultados</div>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge variant="secondary">Atualizado 2026</Badge>
          </Card>
        </div>

        {/* Lista de resultados */}
        {isLoading ? (
          <Card className="p-8 text-center text-muted-foreground">
            Carregando dados...
          </Card>
        ) : filteredData.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Nenhum código NCM encontrado.
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredData.map((item, index) => {
              const change = getAliquotaChange(
                item.aliquotaCBS,
                item.aliquotaIBS
              );
              const ChangeIcon = change.icon;
              const descricaoCST = getDescricaoCST(item.cClassTrib);

              return (
                <Card
                  key={item.codigo}
                  className="overflow-hidden transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 border-b p-6 md:border-b-0 md:border-r">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            NCM
                          </span>
                          <h3 className="text-2xl font-bold text-primary">
                            {item.codigo}
                          </h3>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2">
                          {/* ✅ Ajustado — CST vem do cstData */}
                          <Badge
                            variant="outline"
                            className="flex items-center gap-2 border-primary/30 bg-primary/5 px-3 py-1 text-sm text-primary cursor-default"
                          >
                            <span className="text-muted-foreground">CST:</span>
                            <span>{getCSTValue(item.cClassTrib)}</span>
                          </Badge>

                          <Badge
                            variant="outline"
                            onClick={() => openCClassModal(item.cClassTrib)}
                            className="flex items-center gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary cursor-pointer hover:bg-primary/20 transition"
                          >
                            <span className="text-muted-foreground">
                              cClassTrib:
                            </span>
                            <span>{item.cClassTrib || "—"}</span>
                          </Badge>
                        </div>
                      </div>

                      <p className="text-foreground">{item.descricao}</p>

                      <p className="mt-2 text-sm italic text-muted-foreground">
                        {descricaoCST}
                      </p>
                    </div>

                    <div className="w-full bg-muted/30 p-6 md:w-80">
                      <div className="mb-4">
                        <div className="text-xs text-muted-foreground">
                          ALÍQUOTA CBS
                        </div>
                        <div className="text-2xl font-bold">
                          {(item.aliquotaCBS * 100).toFixed(2)}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">
                          ALÍQUOTA IBS
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">
                            {(item.aliquotaIBS * 100).toFixed(2)}%
                          </div>
                          <ChangeIcon className={`h-5 w-5 ${change.color}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Modal de cClassTrib */}
      {selectedCClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-foreground">
                Detalhes cClassTrib {selectedCClass.cClassTrib}
              </h2>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold text-primary">
                  cClassTrib: {selectedCClass.cClassTrib} —{" "}
                  {selectedCClass.nomeCClass}
                </h4>

                <ExpandableLegislation
                  descricao={selectedCClass.descricaoCClass}
                  legislacao={selectedCClass.legislacao}
                />
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NCM;

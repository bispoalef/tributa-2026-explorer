import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  TrendingDown,
  TrendingUp,
  Minus,
  X,
  Scale,
} from "lucide-react";

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
        <div className="mt-3 bg-muted p-4 rounded-xl text-xs text-muted-foreground whitespace-pre-wrap space-y-3">
          {descricao && (
            <div>
              <h5 className="font-semibold text-foreground mb-1">Descrição:</h5>
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
  const [anexoData, setAnexoData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNcm, setSelectedNcm] = useState<any | null>(null);
  const [selectedCClass, setSelectedCClass] = useState<any | null>(null);
  const [selectedAnexo, setSelectedAnexo] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ncmRes, cstRes, anexoRes] = await Promise.all([
          fetch("/data/ncm.json"),
          fetch("/data/cst.json"),
          fetch("/data/anexos.json"),
        ]);

        if (!ncmRes.ok || !cstRes.ok || !anexoRes.ok)
          throw new Error("Erro ao carregar dados");

        const [ncmRaw, cstRaw, anexosRaw] = await Promise.all([
          ncmRes.json(),
          cstRes.json(),
          anexoRes.json(),
        ]);

        // 🔹 Normaliza os dados NCM
        const normalizedNCM = ncmRaw.map((item: any) => ({
          codigo: item["NCM"] ?? "",
          descricao: item["Descrição"] ?? "",
          cst: item["CST-IBS/CBS"] ?? "",
          cClassTrib: item["cClassTrib"] ?? "",
          aliquotaCBS: Number(item["Alíquota CBS"] ?? 0),
          aliquotaIBS: Number(item["Alíquota IBS"] ?? 0),
          anexo: item["Anexo"] ?? null,
        }));

        // 🔹 Normaliza os dados CST
        const normalizedCST = cstRaw.map((item: any) => ({
          cClassTrib: item["cClassTrib"] ?? "",
          cst: item["CST-IBS/CBS"] ?? "",
          descricaoCST: item["Descrição CST-IBS/CBS"] ?? "",
          nomeCClass: item["Nome cClassTrib"] ?? "",
          descricaoCClass: item["Descrição cClassTrib"] ?? "",
          legislacao: item["LC 214/25 Redação"] ?? "",
        }));

        // 🔹 Agrupa NCMs duplicados
        const groupedNCM = Object.values(
          normalizedNCM.reduce((acc: any, item: any) => {
            const codigo = item.codigo;

            if (!acc[codigo]) {
              acc[codigo] = {
                codigo,
                descricao: item.descricao,
                aliquotaCBS: item.aliquotaCBS,
                aliquotaIBS: item.aliquotaIBS,
                cClassTribList: [],
                anexosList: [],
              };
            }

            if (
              item.cClassTrib &&
              !acc[codigo].cClassTribList.includes(item.cClassTrib)
            ) {
              acc[codigo].cClassTribList.push(item.cClassTrib);
            }

            if (item.anexo && !acc[codigo].anexosList.includes(item.anexo)) {
              acc[codigo].anexosList.push(item.anexo);
            }

            return acc;
          }, {})
        );

        setNcmData(groupedNCM);
        setCstData(normalizedCST);
        setAnexoData(anexosRaw);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = ncmData.filter(
    (item) =>
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAliquotaChange = (atual: number, futura: number) => {
    const diff = futura - atual;
    if (diff > 0)
      return { icon: TrendingUp, color: "text-destructive", type: "aumento" };
    if (diff < 0)
      return { icon: TrendingDown, color: "text-green-600", type: "redução" };
    return { icon: Minus, color: "text-muted-foreground", type: "mantém" };
  };

  const getDescricaoCST = (cClassTrib: string) => {
    const match = cstData.find((cst) => cst.cClassTrib === cClassTrib);
    return match ? match.descricaoCST : "descrição CST não encontrada";
  };

  const getCSTValue = (cClassTrib: string) => {
    const match = cstData.find((cst) => cst.cClassTrib === cClassTrib);
    return match ? match.cst : "—";
  };

  const openNcmModal = (item: any) => setSelectedNcm(item);

  const openCClassModal = (cClassTrib: string) => {
    const related = cstData.find((cst) => cst.cClassTrib === cClassTrib);
    if (related) setSelectedCClass(related);
  };

  const openAnexoModal = (anexo: string, ncmCodigo: string) => {
    const key = anexo.startsWith("ANEXO") ? anexo : `ANEXO ${anexo}`;
    const items = anexoData[key] ?? anexoData[`ANEXO ${anexo}`];
    if (!items) return;

    const descricaoAnexo =
      items[0] && typeof items[0][key] === "string" ? items[0][key] : null;
    const conteudoItens = items.slice(1);

    const itensDoNcm = conteudoItens.filter(
      (obj: any) =>
        Array.isArray(obj.NCM_NBS) &&
        obj.NCM_NBS.some(
          (n: string) => n.replace(/\D/g, "") === ncmCodigo.replace(/\D/g, "")
        )
    );

    const exibidos = itensDoNcm.length > 0 ? itensDoNcm : conteudoItens;

    setSelectedAnexo({
      nome: key,
      descricao: descricaoAnexo,
      itens: exibidos,
      filtroAtivo: itensDoNcm.length > 0,
    });
  };

  const closeModal = () => {
    setSelectedNcm(null);
    setSelectedCClass(null);
    setSelectedAnexo(null);
  };

  const getCardClasses = (anexosList: string[] | null) =>
    anexosList && anexosList.length > 0
      ? "border border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer"
      : "bg-white cursor-pointer hover:bg-muted/50 transition-all";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Consulta de NCM
          </h1>
          <p className="text-lg text-muted-foreground">
            Nomenclatura Comum do Mercosul — Códigos e alíquotas atualizadas
            para 2026
          </p>
        </div>

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

              // 🔹 Descrições CST sem duplicatas e lógica condicional
              const descricoesCST: string[] = item.cClassTribList
                .map((c: string) => getDescricaoCST(c))
                .filter((d: string): d is string => Boolean(d && d !== "descrição CST não encontrada"));

              const descricoesUnicas: string[] = Array.from(new Set(descricoesCST));

              const descricaoCST: string =
                descricoesUnicas.length === 1
                  ? descricoesUnicas[0]
                  : descricoesUnicas.join(" • ");

              return (
                <Card
                  key={item.codigo}
                  className={`overflow-hidden group ${getCardClasses(
                    item.anexosList
                  )} rounded-xl shadow-sm hover:shadow-md transition-all`}
                  onClick={() => openNcmModal(item)}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 border-b md:border-b-0 md:border-r p-6 bg-gradient-to-br from-background to-muted/20">
                      <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight group-hover:text-primary/80 transition-colors">
                        {item.codigo}
                      </h3>
                      <p className="text-base text-foreground leading-snug">
                        {item.descricao}
                      </p>
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        {descricaoCST}
                      </p>
                    </div>

                    <div className="w-full md:w-96 bg-gradient-to-b from-blue-50 to-blue-100/40 dark:from-slate-800 dark:to-slate-900 p-6 flex flex-col justify-center">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">
                            CBS
                          </div>
                          <div className="text-3xl font-bold text-blue-800 dark:text-blue-400">
                            {(item.aliquotaCBS * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-center border-l border-border pl-6">
                          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">
                            IBS
                          </div>
                          <div className="text-3xl font-bold text-blue-800 dark:text-blue-400">
                            {(item.aliquotaIBS * 100).toFixed(2)}%
                          </div>
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

      {/* Modal principal */}
      {selectedNcm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-foreground">
                NCM {selectedNcm.codigo}
              </h2>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {selectedNcm.cClassTribList.map((cClass: string) => (
                  <Badge
                    key={cClass}
                    variant="outline"
                    onClick={() => openCClassModal(cClass)}
                    className="border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary cursor-pointer hover:bg-primary/20 transition"
                  >
                    <span className="text-muted-foreground">cClassTrib:</span>{" "}
                    {cClass}
                  </Badge>
                ))}

                {selectedNcm.anexosList.map((anexo: string) => (
                  <Badge
                    key={anexo}
                    variant="secondary"
                    onClick={() =>
                      openAnexoModal(anexo, selectedNcm.codigo)
                    }
                    className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 text-sm font-semibold cursor-pointer hover:bg-blue-200 transition flex items-center gap-1"
                  >
                    <Scale className="h-4 w-4 text-blue-600/80" />
                    {anexo}
                  </Badge>
                ))}
              </div>

              <p className="text-foreground">{selectedNcm.descricao}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal cClassTrib */}
      {selectedCClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
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

      {/* Modal Anexo */}
      {selectedAnexo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden">
            <div className="flex items-start justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedAnexo.nome}
                </h2>
                {selectedAnexo.descricao && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedAnexo.descricao}
                  </p>
                )}
              </div>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
              {selectedAnexo.filtroAtivo && (
                <p className="text-sm text-muted-foreground italic">
                  Exibindo apenas os itens que contêm o NCM selecionado.
                </p>
              )}

              {selectedAnexo.itens.map((obj: any, i: number) => (
                <Card key={i} className="p-4">
                  <p className="font-semibold text-primary mb-1">
                    {obj["Descrição"]}
                  </p>
                  {obj.NCM_NBS && (
                    <p className="text-xs text-muted-foreground">
                      NCM/NBS: {obj.NCM_NBS.join(", ")}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NCM;

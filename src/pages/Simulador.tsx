import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calculator, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ncmData } from "@/data/mockData"; // ✅ importa seus NCMs

interface SimulationResult {
  aliquota: number;
  valorBase: number;
  valorTributo: number;
}

interface CSTItem {
  "CST-IBS/CBS": string;
  "Descrição CST-IBS/CBS": string;
  cClassTrib: string;
  "Nome cClassTrib": string;
  "Descrição cClassTrib": string;
  "LC 214/25 Redação": string;
}

const Simulador = () => {
  const [form, setForm] = useState({
    ncm: "",
    grupoPrincipal: "",
    situacaoTributaria: "",
    classificacaoTrib: "",
    valor: ""
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [cstList, setCstList] = useState<CSTItem[]>([]);
  const [uniqueCSTs, setUniqueCSTs] = useState<string[]>([]);
  const [filteredClassificacoes, setFilteredClassificacoes] = useState<CSTItem[]>([]);

  // 🔹 Carrega o arquivo JSON de CST
  useEffect(() => {
    fetch("/data/cst.json")
      .then((res) => res.json())
      .then((data: CSTItem[]) => {
        setCstList(data);

        // Extrai CSTs únicos
        const distinct = Array.from(new Set(data.map((i) => i["CST-IBS/CBS"])));
        setUniqueCSTs(distinct);
      })
      .catch((err) => console.error("Erro ao carregar CSTs:", err));
  }, []);

  // 🔹 Atualiza classificações conforme CST selecionado
  useEffect(() => {
    if (form.situacaoTributaria) {
      const filtradas = cstList.filter(
        (i) => i["CST-IBS/CBS"] === form.situacaoTributaria
      );
      setFilteredClassificacoes(filtradas);
      setForm((prev) => ({ ...prev, classificacaoTrib: "" }));
    }
  }, [form.situacaoTributaria, cstList]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const calcular = () => {
    const base = parseFloat(form.valor);
    if (isNaN(base)) {
      alert("Informe um valor válido!");
      return;
    }

    let aliquota = 0.12; // padrão para comércio (CBS)

    if (form.situacaoTributaria === "06") aliquota = 0.0;
    if (["Imune", "Isento"].includes(form.classificacaoTrib)) aliquota = 0.0;
    if (form.grupoPrincipal === "servicos") aliquota = 0.09; // exemplo para serviços

    const valorTributo = base * aliquota;

    setResult({
      aliquota,
      valorBase: base,
      valorTributo
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Simulador de Alíquotas
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Calcule de forma rápida a alíquota aplicável e o valor estimado do
            tributo conforme o cenário informado.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulário */}
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              Dados para Simulação
            </h2>

            <div className="space-y-4">
              {/* Grupo Principal */}
              <div>
                <Label htmlFor="grupoPrincipal">Grupo Principal *</Label>
                <Select
                  value={form.grupoPrincipal}
                  onValueChange={(v) => handleChange("grupoPrincipal", v)}
                >
                  <SelectTrigger id="grupoPrincipal">
                    <SelectValue placeholder="Selecione o grupo principal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comercio">Comércio</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* NCM ou CNAE */}
              <div>
                {form.grupoPrincipal === "comercio" ? (
                  <>
                    <Label htmlFor="ncm">NCM (Comércio)</Label>
                    <Select
                      value={form.ncm}
                      onValueChange={(v) => handleChange("ncm", v)}
                    >
                      <SelectTrigger id="ncm">
                        <SelectValue placeholder="Selecione o NCM" />
                      </SelectTrigger>
                      <SelectContent>
                        {ncmData.map((item) => (
                          <SelectItem key={item.codigo} value={item.codigo}>
                            {item.codigo} - {item.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <Label htmlFor="ncm">NBS (Serviços)</Label>
                    <Input
                      id="ncm"
                      placeholder="Ex: 6201-5/01 (Desenvolvimento de software)"
                      value={form.ncm}
                      onChange={(e) => handleChange("ncm", e.target.value)}
                    />
                  </>
                )}
              </div>

              {/* Situação Tributária (CST) */}
              <div>
                <Label htmlFor="situacaoTributaria">Situação Tributária (CST) *</Label>
                <Select
                  value={form.situacaoTributaria}
                  onValueChange={(v) => handleChange("situacaoTributaria", v)}
                >
                  <SelectTrigger id="situacaoTributaria">
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCSTs.map((cst) => {
                      const descricao = cstList.find(
                        (i) => i["CST-IBS/CBS"] === cst
                      )?.["Descrição CST-IBS/CBS"];
                      return (
                        <SelectItem key={cst} value={cst}>
                          {cst} - {descricao}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Classificação Tributária */}
              <div>
                <Label htmlFor="classificacaoTrib">Classificação Tributária *</Label>
                <Select
                  value={form.classificacaoTrib}
                  onValueChange={(v) => handleChange("classificacaoTrib", v)}
                  disabled={!form.situacaoTributaria}
                >
                  <SelectTrigger id="classificacaoTrib">
                    <SelectValue
                      placeholder={
                        form.situacaoTributaria
                          ? "Selecione a classificação"
                          : "Selecione o CST primeiro"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClassificacoes.map((item) => (
                      <SelectItem key={item.cClassTrib} value={item.cClassTrib}>
                        {item.cClassTrib} - {item["Nome cClassTrib"]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Valor */}
              <div>
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  placeholder="Ex: 1000"
                  value={form.valor}
                  onChange={(e) => handleChange("valor", e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={calcular}
                disabled={!form.valor || !form.situacaoTributaria}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calcular
              </Button>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-lg bg-muted/30 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Os cálculos são estimativos e podem variar conforme legislação
                complementar e características específicas da operação.
              </p>
            </div>
          </Card>

          {/* Resultado */}
          <div className="space-y-6">
            {result ? (
              <Card className="overflow-hidden">
                <div className="h-2 bg-gradient-primary" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Resultado da Simulação
                    </h3>
                    <Badge variant="secondary">
                      {form.classificacaoTrib || "Normal"}
                    </Badge>
                  </div>

                  <div className="rounded-lg bg-muted/30 p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Valor Base
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      R$ {result.valorBase.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-4">
                    <div className="text-sm text-primary mb-1">
                      Alíquota Aplicada
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {(result.aliquota * 100).toFixed(2)}%
                    </div>
                  </div>

                  <div
                    className={`rounded-lg p-4 ${
                      result.valorTributo > 0 ? "bg-blue-50" : "bg-green-50"
                    }`}
                  >
                    <div className="mb-1 text-sm font-medium text-foreground">
                      Valor Estimado do Tributo
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      R$ {result.valorTributo.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex h-full items-center justify-center p-12 text-center">
                <div>
                  <Calculator className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Preencha os dados ao lado e clique em "Calcular" para ver o
                    resultado
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <Card className="mt-8 border-l-4 border-l-secondary p-6">
          <h3 className="mb-3 font-semibold text-foreground">
            Sobre esta Simulação
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Este simulador utiliza alíquotas médias e regras gerais baseadas na
            EC 132/2023. Os valores reais dependem de legislação complementar,
            enquadramento fiscal e natureza da operação. Consulte seu contador
            para análises detalhadas.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Simulador;

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCalculoPorCST } from "@/utils/calculosCST";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calculator, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ncmData } from "@/data/mockData";

interface SimulationResult {
  aliquota: number;
  valorBase: number;
  valorTributo: number;
  aliquotaCBS: number;
  aliquotaIBS: number;
  valorCBS: number;
  valorIBS: number;
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

  useEffect(() => {
    fetch("/data/cst.json")
      .then((res) => res.json())
      .then((data: CSTItem[]) => {
        setCstList(data);
        const distinct = Array.from(new Set(data.map((i) => i["CST-IBS/CBS"])));
        setUniqueCSTs(distinct);
      })
      .catch((err) => console.error("Erro ao carregar CSTs:", err));
  }, []);

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

    const resultado = getCalculoPorCST(form.situacaoTributaria, base);

    setResult({
      aliquota: resultado.aliquota,
      valorBase: resultado.valorTotal,
      valorTributo: resultado.valorTributo,
      aliquotaCBS: resultado.aliquotaCBS,
      aliquotaIBS: resultado.aliquotaIBS,
      valorCBS: resultado.valorCBS,
      valorIBS: resultado.valorIBS
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Cabeçalho */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-md">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Simulador de Alíquotas
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl">
            Calcule de forma rápida e precisa a alíquota aplicável e o valor estimado
            do tributo conforme o cenário informado.
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulário */}
          <Card className="p-6 space-y-4 shadow-sm border-muted/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Dados para Simulação
            </h2>

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

            {/* NCM ou NBS */}
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

            {/* Situação Tributária */}
            <div>
              <Label htmlFor="situacaoTributaria">
                Situação Tributária (CST) *
              </Label>
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
              <Label htmlFor="classificacaoTrib">
                Classificação Tributária *
              </Label>
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
              className="w-full mt-2"
              size="lg"
              onClick={calcular}
              disabled={!form.valor || !form.situacaoTributaria}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calcular
            </Button>

            <div className="mt-6 flex items-start gap-3 rounded-lg bg-muted/30 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Os cálculos são estimativos e podem variar conforme legislação
                complementar e características específicas da operação.
              </p>
            </div>
          </Card>

          {/* Resultado */}
          <div className="space-y-6">
            {result ? (
              <Card className="overflow-hidden shadow-sm border-muted/50">
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
                      Valor Total (com tributos)
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      R$ {result.valorBase.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-4">
                    <div className="text-sm text-primary mb-1">
                      Alíquota Total
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {(result.aliquota * 100).toFixed(2)}%
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/20 p-4 space-y-2">
                    <div className="text-sm font-medium text-foreground mb-2">
                      Detalhamento do Tributo
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>CBS ({(result.aliquotaCBS * 100).toFixed(2)}%)</span>
                      <span>
                        R$ {result.valorCBS.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>IBS ({(result.aliquotaIBS * 100).toFixed(2)}%)</span>
                      <span>
                        R$ {result.valorIBS.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`rounded-lg p-4 transition-all ${
                      result.valorTributo > 0
                        ? "bg-blue-50"
                        : "bg-green-50"
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
              <Card className="flex h-full items-center justify-center p-12 text-center border-muted/50">
                <div>
                  <Calculator className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Preencha os dados ao lado e clique em “Calcular” para ver o resultado.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Rodapé da página */}
        <Card className="mt-12 border-l-4 border-l-secondary p-6 bg-muted/20 shadow-sm">
          <h3 className="mb-2 font-semibold text-foreground">
            Sobre esta Simulação
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Este simulador utiliza alíquotas médias e regras gerais baseadas na
            EC 132/2023. Os valores reais dependem de legislação complementar,
            enquadramento fiscal e natureza da operação. Consulte seu contador
            para uma análise detalhada.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Simulador;

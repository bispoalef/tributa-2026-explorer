import { FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <FileText className="h-5 w-5" />
            <p className="text-sm">
              Atualizado conforme Reforma Tributária 2026
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Dados públicos e fontes oficiais · Informações sujeitas a alterações conforme legislação complementar
          </p>
        </div>
      </div>
    </footer>
  );
};

import { MousePointer2, Square, GitBranch, Image, Trash2, Download, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";

interface ToolbarProps {
  activeTool: "select" | "node" | "connector" | "image";
  onToolClick: (tool: "select" | "node" | "connector" | "image") => void;
  onAddNode: () => void;
  onAddConnector: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export const Toolbar = ({
  activeTool,
  onToolClick,
  onAddNode,
  onAddConnector,
  onImageUpload,
  onClear,
  onExport,
  onDelete,
}: ToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "select" as const, icon: MousePointer2, label: "Selecionar" },
    { id: "node" as const, icon: Square, label: "Adicionar Nó" },
    { id: "connector" as const, icon: GitBranch, label: "Conector" },
    { id: "image" as const, icon: Image, label: "Imagem" },
  ];

  const handleToolClick = (toolId: typeof activeTool) => {
    onToolClick(toolId);
    
    if (toolId === "node") {
      onAddNode();
    } else if (toolId === "connector") {
      onAddConnector();
    } else if (toolId === "image") {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-2" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "ghost"}
            size="icon"
            onClick={() => handleToolClick(tool.id)}
            className="w-12 h-12 transition-all hover:scale-105"
            title={tool.label}
          >
            <tool.icon className="h-5 w-5" />
          </Button>
        ))}
      </div>

      <Separator className="my-4 w-8" />

      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="w-12 h-12 hover:bg-destructive/10 hover:text-destructive transition-all hover:scale-105"
          title="Deletar Selecionado"
        >
          <Trash2 className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="w-12 h-12 hover:bg-destructive/10 hover:text-destructive transition-all hover:scale-105"
          title="Limpar Canvas"
        >
          <Eraser className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onExport}
          className="w-12 h-12 transition-all hover:scale-105"
          title="Exportar PNG"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, Text, FabricImage, Line, Shadow } from "fabric";
import { Toolbar } from "./Toolbar";
import { toast } from "sonner";

export const OrgChartCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "node" | "connector" | "image">("select");
  const [selectedNode, setSelectedNode] = useState<Rect | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - 80,
      height: window.innerHeight - 100,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);
    toast.success("Canvas pronto! Comece a criar seu organograma");

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 80,
        height: window.innerHeight - 100,
      });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = activeTool === "select";
  }, [activeTool, fabricCanvas]);

  const addNode = (x: number = 200, y: number = 150) => {
    if (!fabricCanvas) return;

    const node = new Rect({
      left: x,
      top: y,
      fill: "#3b82f6",
      width: 200,
      height: 120,
      rx: 12,
      ry: 12,
      stroke: "#2563eb",
      strokeWidth: 2,
      shadow: new Shadow({
        color: "rgba(37, 99, 235, 0.3)",
        blur: 12,
        offsetX: 0,
        offsetY: 4,
      }),
    });

    const nameText = new Text("Nome", {
      left: x + 100,
      top: y + 35,
      fontSize: 16,
      fontWeight: "600",
      fill: "#ffffff",
      originX: "center",
      originY: "center",
      fontFamily: "Inter, system-ui, sans-serif",
    });

    const roleText = new Text("Cargo", {
      left: x + 100,
      top: y + 60,
      fontSize: 14,
      fill: "#e0e7ff",
      originX: "center",
      originY: "center",
      fontFamily: "Inter, system-ui, sans-serif",
    });

    fabricCanvas.add(node);
    fabricCanvas.add(nameText);
    fabricCanvas.add(roleText);
    fabricCanvas.renderAll();

    toast.success("Nó adicionado! Clique duas vezes para editar");
  };

  const addConnector = () => {
    if (!fabricCanvas) return;

    const line = new Line([100, 100, 300, 100], {
      stroke: "#94a3b8",
      strokeWidth: 2,
      selectable: true,
    });

    fabricCanvas.add(line);
    fabricCanvas.renderAll();
    toast.success("Conector adicionado!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      
      FabricImage.fromURL(imgUrl).then((img) => {
        img.scale(0.3);
        img.set({
          left: 150,
          top: 150,
          selectable: true,
        });
        fabricCanvas.add(img);
        fabricCanvas.renderAll();
        toast.success("Imagem adicionada!");
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas limpo!");
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement("a");
    link.download = "organograma.png";
    link.href = dataURL;
    link.click();
    toast.success("Organograma exportado!");
  };

  const handleDelete = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => fabricCanvas.remove(obj));
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      toast.success("Elementos deletados!");
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "node") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        addNode(e.clientX - rect.left - 100, e.clientY - rect.top - 60);
        setActiveTool("select");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Toolbar
        activeTool={activeTool}
        onToolClick={setActiveTool}
        onAddNode={() => addNode()}
        onAddConnector={addConnector}
        onImageUpload={handleImageUpload}
        onClear={handleClear}
        onExport={handleExport}
        onDelete={handleDelete}
      />
      <div className="flex-1 p-4">
        <div className="rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-large)" }}>
          <canvas 
            ref={canvasRef} 
            className="border-2 border-border" 
            onClick={handleCanvasClick}
            style={{ cursor: activeTool === "node" ? "crosshair" : "default" }}
          />
        </div>
      </div>
    </div>
  );
};

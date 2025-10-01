import { OrgChartCanvas } from "@/components/OrgChartCanvas";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm" style={{ boxShadow: "var(--shadow-soft)" }}>
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            OrgChart Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Crie organogramas profissionais de forma interativa
          </p>
        </div>
      </header>
      <OrgChartCanvas />
    </div>
  );
};

export default Index;


import { MainLayout } from "@/components/layout/MainLayout";
import { PosInterface } from "@/components/pos/PosInterface";

const PosTerminal = () => {
  return (
    <MainLayout>
      <div className="h-[calc(100vh-180px)]">
        <PosInterface />
      </div>
    </MainLayout>
  );
};

export default PosTerminal;

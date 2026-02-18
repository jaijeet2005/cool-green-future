import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports & Insights</h1>
        <p className="text-sm text-muted-foreground">
          Plantation scenario projections and export
        </p>
      </div>
      <Card className="min-h-[500px] flex items-center justify-center">
        <CardContent className="text-center space-y-3">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Reports and printable summaries coming in next iteration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

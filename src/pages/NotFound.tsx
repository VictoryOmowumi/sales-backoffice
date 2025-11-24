import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useRouteError } from "react-router-dom";
import { Home, RefreshCcw } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const error = useRouteError() as Response | undefined;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      <Card className="max-w-lg w-full border-dashed">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Oops</p>
            <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
            <p className="text-muted-foreground">
              {error?.status === 404
                ? "That route doesn't exist yet. Double-check the URL or use the navigation menu."
                : "We couldn't load this screen. Try again or go back home."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => navigate("/", { replace: true })}>
              <Home className="h-4 w-4 mr-2" />
              Go to dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate(0)}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



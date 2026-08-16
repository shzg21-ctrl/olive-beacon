import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Legal from "./pages/Legal";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/privacy">{() => <Legal page="privacy" />}</Route>
    <Route path="/cookies">{() => <Legal page="cookies" />}</Route>
    <Route path="/terms">{() => <Legal page="terms" />}</Route>
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster theme="dark" position="bottom-right" richColors /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

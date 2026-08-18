import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteLayout } from "./components/SiteLayout";

const Legal = lazy(() => import("./pages/Legal"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const HomePage = lazy(async () => ({ default: (await import("./pages/SitePages")).HomePage }));
const ProductsPage = lazy(async () => ({ default: (await import("./pages/SitePages")).ProductsPage }));
const ProductDetailPage = lazy(async () => ({ default: (await import("./pages/SitePages")).ProductDetailPage }));
const WebsitesPage = lazy(async () => ({ default: (await import("./pages/SitePages")).WebsitesPage }));
const SolutionsPage = lazy(async () => ({ default: (await import("./pages/SitePages")).SolutionsPage }));
const HowItWorksPage = lazy(async () => ({ default: (await import("./pages/SitePages")).HowItWorksPage }));
const IndustriesPage = lazy(async () => ({ default: (await import("./pages/SitePages")).IndustriesPage }));
const IndustryPage = lazy(async () => ({ default: (await import("./pages/SitePages")).IndustryPage }));
const WorkPage = lazy(async () => ({ default: (await import("./pages/SitePages")).WorkPage }));
const AboutPage = lazy(async () => ({ default: (await import("./pages/SitePages")).AboutPage }));
const FaqPage = lazy(async () => ({ default: (await import("./pages/SitePages")).FaqPage }));
const QuotePage = lazy(async () => ({ default: (await import("./pages/SitePages")).QuotePage }));
const ThankYouPage = lazy(async () => ({ default: (await import("./pages/SitePages")).ThankYouPage }));
const ClientAreaPage = lazy(async () => ({ default: (await import("./pages/SitePages")).ClientAreaPage }));
const PortfolioLanding = lazy(async () => ({ default: (await import("./components/PortfolioExplorer")).PortfolioLanding }));
const PortfolioCategoryPage = lazy(async () => ({ default: (await import("./components/PortfolioExplorer")).PortfolioCategoryPage }));
const PortfolioConceptPage = lazy(async () => ({ default: (await import("./components/PortfolioExplorer")).PortfolioConceptPage }));

function Router() {
  const publicPage = (page: React.ReactNode) => () => <SiteLayout><Suspense fallback={<div className="route-loading">Connecting the signal…</div>}>{page}</Suspense></SiteLayout>;
  return <Switch>
    <Route path="/" component={publicPage(<HomePage />)} />
    <Route path="/products" component={publicPage(<ProductsPage />)} />
    <Route path="/products/review-stand" component={publicPage(<ProductDetailPage kind="stand" />)} />
    <Route path="/products/review-sticker" component={publicPage(<ProductDetailPage kind="sticker" />)} />
    <Route path="/websites" component={publicPage(<WebsitesPage />)} />
    <Route path="/website-examples" component={publicPage(<PortfolioLanding />)} />
    <Route path="/website-examples/:category/:concept" component={publicPage(<PortfolioConceptPage />)} />
    <Route path="/website-examples/:category" component={publicPage(<PortfolioCategoryPage />)} />
    <Route path="/solutions" component={publicPage(<SolutionsPage />)} />
    <Route path="/how-it-works" component={publicPage(<HowItWorksPage />)} />
    <Route path="/industries" component={publicPage(<IndustriesPage />)} />
    <Route path="/industries/:slug" component={publicPage(<IndustryPage />)} />
    <Route path="/work" component={publicPage(<WorkPage />)} />
    <Route path="/about" component={publicPage(<AboutPage />)} />
    <Route path="/faq" component={publicPage(<FaqPage />)} />
    <Route path="/quote" component={publicPage(<QuotePage />)} />
    <Route path="/contact" component={publicPage(<QuotePage contact />)} />
    <Route path="/thank-you" component={publicPage(<ThankYouPage />)} />
    <Route path="/client" component={publicPage(<ClientAreaPage />)} />
    <Route path="/onboarding/:token">{() => <Suspense fallback={<div className="route-loading">Opening secure onboarding…</div>}><Onboarding /></Suspense>}</Route>
    <Route path="/privacy">{() => <Suspense fallback={<div className="route-loading">Loading privacy details…</div>}><Legal page="privacy" /></Suspense>}</Route>
    <Route path="/cookies">{() => <Suspense fallback={<div className="route-loading">Loading cookie details…</div>}><Legal page="cookies" /></Suspense>}</Route>
    <Route path="/terms">{() => <Suspense fallback={<div className="route-loading">Loading terms…</div>}><Legal page="terms" /></Suspense>}</Route>
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster theme="dark" position="bottom-right" richColors /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

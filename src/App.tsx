import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { EmailSidebarProvider } from "./context/EmailSidebarContext";
import { LoadingProvider } from "./context/LoadingContext";
import { IsSubmittingContextProvider } from "./context/isSubmittingContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { router } from "./routes/AppRoutes";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <LoadingProvider>
          <IsSubmittingContextProvider>
            <EmailSidebarProvider>
              <RouterProvider router={router} />
            </EmailSidebarProvider>
          </IsSubmittingContextProvider>
        </LoadingProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;

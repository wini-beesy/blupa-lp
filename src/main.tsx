import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfUsePage } from "./pages/TermsOfUsePage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/termos-de-uso" element={<TermsOfUsePage />} />
          <Route
            path="/politica-de-privacidade"
            element={<PrivacyPolicyPage />}
          />
        </Routes>
        <CookieConsentBanner />
      </>
    </BrowserRouter>
  </StrictMode>,
);

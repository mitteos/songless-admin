import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { Navbar } from "./components/layout/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import GenrePage from "./pages/GenrePage";
import PlaylistPage from "./pages/PlaylistPage";
import YearsPage from "./pages/YearsPage";
import MusicPage from "./pages/MusicPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServicePage from "./pages/ServicePage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark">
        <BrowserRouter>
          <div className="flex w-full h-screen max-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/genre" element={<GenrePage />} />
              <Route path="/stack" element={<PlaylistPage />} />
              <Route path="/years" element={<YearsPage />} />
              <Route path="/service" element={<ServicePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;

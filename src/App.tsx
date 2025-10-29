import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { Navbar } from "./components/layout/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/HomePage";
import Genre from "./pages/GenrePage";
import Stack from "./pages/PlaylistPage";
import Years from "./pages/YearsPage";
import MusicPage from "./pages/MusicPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark">
        <BrowserRouter>
          <div className="flex w-full h-screen max-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/genre" element={<Genre />} />
              <Route path="/stack" element={<Stack />} />
              <Route path="/years" element={<Years />} />
            </Routes>
          </div>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;

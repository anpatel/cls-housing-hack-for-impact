import { useState, useEffect } from "react";
import Home from "./Home";
import Chat from "./Chat";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  fonts: {
    body: "Roboto, sans-serif",
  },
});

export default function App() {
  const [data, setData] = useState(null);
  console.log(
    "process.env.REACT_APP_BACKEND_DOMAIN",
    process.env.REACT_APP_BACKEND_DOMAIN
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_DOMAIN}/api/data`
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

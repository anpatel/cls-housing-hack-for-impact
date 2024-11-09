import { useState, useEffect } from "react";

// ... existing imports ...

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
    <div className="App">
      <header className="App-header">
        {/* ... existing header content ... */}

        {/* Add this section to display the data */}
        <div>
          {data ? (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </header>
    </div>
  );
}

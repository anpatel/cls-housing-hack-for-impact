import { useState, useEffect } from "react";
import {
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { SearchIcon } from "@chakra-ui/icons";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
    if (searchQuery.trim()) {
      navigate("/chat", { state: { query: searchQuery } });
    }
  };

  return (
    <div className="App" textAlign="center">
      <Flex direction="column" align="center" justify="center" minH="100vh">
        <Text
          color="#009951"
          fontSize="28px"
          fontStyle="normal"
          fontWeight={700}
          lineHeight="36px"
        >
          Case Study Assistant
        </Text>
        <Text
          color="#1E1E1E"
          textAlign="center"
          fontSize="16px"
          fontStyle="normal"
          fontWeight={400}
          lineHeight="24px"
          letterSpacing="0.5px"
          maxW="600px"
          mt={4}
        >
          Enter a specific keyword to receive a concise summary of relevant case
          studies from your library, powered by our AI assistant.
        </Text>

        <InputGroup maxW="600px" mt={6}>
          <Input
            placeholder="habitability issues related to pest infestation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            size="lg"
            borderRadius="md"
          />
          <InputRightElement cursor="pointer" mt="5px" onClick={handleSearch}>
            <SearchIcon color="gray.400" />
          </InputRightElement>
        </InputGroup>
      </Flex>
    </div>
  );
}

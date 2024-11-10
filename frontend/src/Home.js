import { useState, useEffect } from "react";
import {
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Box,
  Button,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";

import { SearchIcon } from "@chakra-ui/icons";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add this

  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
    setIsLoading(true);
    console.log("Search query:", searchQuery);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/chat", { state: { query: searchQuery } });
    }, 3000);
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

        <InputGroup maxW="420px" mt={6}>
          <Input
            placeholder="habitability issues related to pest infestation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            size="lg"
            borderRadius="md"
          />
          <InputRightElement cursor="pointer" mt="5px" onClick={handleSearch}>
            {isLoading ? (
              <Spinner size="sm" color="gray.400" />
            ) : (
              <SearchIcon color="gray.400" />
            )}
          </InputRightElement>
        </InputGroup>
        <Box
          mt={4}
          width="436px"
          display="flex"
          padding="8px"
          justifyContent="center"
          alignItems="center"
          gap="8px"
        >
          <Input
            type="file"
            display="none"
            id="file-upload"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                console.log("File selected:", file.name);
                // Handle file upload logic here
              }
            }}
            accept=".pdf,.doc,.docx"
          />
          <Button
            width="100%"
            borderRadius="8px"
            border="1px solid #2C2C2C"
            background="#2C2C2C"
            as="label"
            htmlFor="file-upload"
            colorScheme="gray"
            variant="outline"
            rightIcon={<Icon as={FaUpload} color="white" />}
            cursor="pointer"
            _hover={{
              background: "#1E1E1E",
              borderColor: "#1E1E1E",
            }}
          >
            <Text
              color="#F5F5F5"
              fontSize="11px"
              fontWeight={500}
              lineHeight="16px"
              letterSpacing="0.5px"
            >
              Upload file
            </Text>
          </Button>
        </Box>
      </Flex>
    </div>
  );
}

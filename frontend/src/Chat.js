import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Input,
  InputGroup,
  Button,
  Flex,
  Container,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");

    // Add mock AI response immediately
    const aiMessage = {
      text: "amazing",
      sender: "ai",
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Container maxW="800px" h="100vh" py={8}>
      <VStack h="full" spacing={4}>
        <Box
          flex={1}
          w="full"
          overflowY="auto"
          borderWidth={1}
          borderRadius="md"
          p={4}
        >
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.sender === "user" ? "flex-end" : "flex-start"}
              mb={4}
            >
              <Box
                maxW="70%"
                display="inline-flex"
                px={4}
                py={2}
                justifyContent="center"
                alignItems="center"
                gap="10px"
                borderRadius="full"
                bg={message.sender !== "user" ? "blue.500" : "#F5F5F5"}
                color={message.sender !== "user" ? "white" : "#1E1E1E"}
              >
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  lineHeight="100%"
                >
                  {message.text}
                </Text>
              </Box>
            </Flex>
          ))}
        </Box>

        <InputGroup size="md">
          <Input
            pr="4.5rem"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
          />
          <InputRightElement cursor="pointer" onClick={handleSendMessage}>
            <SearchIcon color="gray.400" isDisabled={!inputMessage.trim()} />
          </InputRightElement>
        </InputGroup>
      </VStack>
    </Container>
  );
}

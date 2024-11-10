import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaRobot } from "react-icons/fa";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Add this to get the location state
  const location = useLocation();

  // Add useEffect to initialize chat with search query
  useEffect(() => {
    const initialQuery = location.state?.query;
    if (initialQuery) {
      const initialMessage = {
        text: initialQuery,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
      // Trigger AI response for initial query
      handleSendMessage(initialQuery);
    }
  }, []);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    // Add user message to chat if it's not from initial query
    if (messageText === inputMessage) {
      const userMessage = {
        text: messageText,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputMessage("");
    }

    // Add mock AI response immediately
    const aiMessage = {
      text: "amazing",
      sender: "ai",
      timestamp: new Date().toISOString(),
      caseInfo: [
        {
          caseNumber:
            "Case #2023-054: Rosalene Nee vs. Woodland Park Communities",
          summary:
            "Rent reduction of 7.5% granted due to repeated roach infestations. Noise complaints were denied.",
          outcome: "✅ Rent reduction granted | ❌ Noise complaint dismissed",
          legalBasis:
            "California Civil Code Section 1941.1 (Warranty of Habitability)",
        },
        {
          caseNumber: "Case #2022-032: John Lee vs. Westfield Properties",
          summary:
            "Successful rebate for vermin infestation affecting tenant's health and property use.",
          outcome: "✅ Rebate granted",
          legalBasis: "Local Habitability Standards, Pest Control Requirement",
        },
        {
          caseNumber: "Case #2021-078: Emily Wang vs. Summit Heights LLC",
          summary:
            "Case dismissed; tenant failed to provide sufficient evidence of ongoing pest issues.",
          outcome: "❌ Complaint dismissed",
          legalBasis: "Lack of corroborating evidence for pest complaints",
        },
      ],
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
              direction="column"
              align={message.sender === "user" ? "flex-end" : "flex-start"}
              mb={4}
            >
              {message.sender === "ai" && (
                <Flex align="center" mb={2} ml={4}>
                  <Icon as={FaRobot} boxSize={5} color="blue.500" mr={2} />
                  <Text fontSize="sm" color="gray.600">
                    AI Assistant
                  </Text>
                </Flex>
              )}
              <Box
                maxW="70%"
                px={4}
                py={2}
                borderRadius="full"
                bg={message.sender !== "user" ? "blue.500" : "#F5F5F5"}
                color={message.sender !== "user" ? "white" : "#1E1E1E"}
              >
                <Text fontSize="16px" fontWeight="400" lineHeight="100%">
                  {message.text}
                </Text>
              </Box>
              {message.sender === "ai" && message.caseInfo && (
                <Flex direction="column" mt={3} ml={4}>
                  <Box mb="10px">
                    <Text display="inline">78 Relevant Cases Found for </Text>
                    <Text
                      display="inline-flex"
                      padding="8px"
                      justifyContent="center"
                      alignItems="center"
                      gap="8px"
                      borderRadius="8px"
                      background="#F5F5F5"
                    >
                      habitability issues related to pest infestation
                    </Text>
                  </Box>
                  <Text
                    color="#1E1E1E"
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight={500}
                    lineHeight="16px"
                    letterSpacing="0.5px"
                    mb={3}
                  >
                    Top 3 Relevant Cases Found:
                  </Text>
                  {message.caseInfo.map((caseItem, idx) => (
                    <Box
                      key={idx}
                      p={4}
                      borderRadius="md"
                      bg="#F5F5F5"
                      maxW="90%"
                      mb={idx < message.caseInfo.length - 1 ? 3 : 0}
                    >
                      <Box>{caseItem.caseNumber}</Box>
                      <Box>
                        <Text
                          mt={2}
                          color="#1E1E1E"
                          fontSize="14px"
                          fontStyle="normal"
                          lineHeight="20px"
                          letterSpacing="0.25px"
                        >
                          <Text as="span" fontWeight={700}>
                            Summary:
                          </Text>{" "}
                          <Text as="span" fontWeight={400}>
                            {caseItem.summary}
                          </Text>
                        </Text>
                        <Text
                          mt={2}
                          color="#1E1E1E"
                          fontSize="14px"
                          fontStyle="normal"
                          lineHeight="20px"
                          letterSpacing="0.25px"
                        >
                          <Text as="span" fontWeight={700}>
                            Outcome:
                          </Text>{" "}
                          <Text as="span" fontWeight={400}>
                            {caseItem.outcome}
                          </Text>
                        </Text>
                        <Text
                          mt={2}
                          color="#1E1E1E"
                          fontSize="14px"
                          fontStyle="normal"
                          lineHeight="20px"
                          letterSpacing="0.25px"
                        >
                          <Text as="span" fontWeight={700}>
                            Legal Basis:
                          </Text>{" "}
                          <Text as="span" fontWeight={400}>
                            {caseItem.legalBasis}
                          </Text>
                        </Text>
                        <Box
                          display="flex"
                          padding="8px"
                          justifyContent="center"
                          alignItems="center"
                          gap="8px"
                          borderRadius="8px"
                          border="1px solid #767676"
                          background="#E3E3E3"
                          width="123px"
                          mt="12px"
                        >
                          <Text
                            color="#1E1E1E"
                            fontSize="11px"
                            fontStyle="normal"
                            fontWeight={500}
                            lineHeight="16px"
                            letterSpacing="0.5px"
                          >
                            View Full Summary
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Flex>
              )}
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

import "./App.css";
import { useState, useEffect, useRef, React } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  VStack,
  Text,
  Input,
  InputGroup,
  Flex,
  Container,
  InputRightElement,
  Icon,
  Grid,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { FaRobot } from "react-icons/fa";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [expandedCases, setExpandedCases] = useState({}); // Add this state

  // Add this to get the location state
  const location = useLocation();
  const isInitialMount = useRef(true);
  const toggleCase = (caseId) => {
    setExpandedCases((prev) => ({
      ...prev,
      [caseId]: !prev[caseId],
    }));
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      const initialQuery = location.state?.query;

      if (initialQuery) {
        console.log("Initial query:", initialQuery);
        const initialMessage = {
          text: initialQuery,
          sender: "user",
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMessage]);

        // Trigger AI response for initial query
        handleSendMessage(initialQuery);
      }
    }
  }, []);

  const handleSendMessage = async (messageText = inputMessage) => {
    console.log("we call handleSendMessage");
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

    fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: messageText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Query response:", data);
        const aiResponse = data?.response;
        const aiLegalArguement = aiResponse.legal_argument;
        const caseType = aiResponse.case_type;

        // const aiPdfLinks = aiResponse.files.map((file) => file.pdf_file_path);
        const aiPdfLinks = [
          "Escuela_222 2024.01.25 AppealDecision_Redacted.pdf",
          "Montecito_1260 2023.10.24 AppealDecision_Redacted.pdf",
          "Wentworth_1084 2024.05.06 HODecision_Redacted.pdf",
        ];
        console.log("aiPdfLinks", aiPdfLinks);

        // Add mock AI response immediately
        const aiMessage = {
          caseType: caseType,
          legalArguement: aiLegalArguement,
          sender: "ai",
          timestamp: new Date().toISOString(),
          caseInfo: [
            {
              caseNumber:
                "Case #C22330052: Judith Hernandez and Israel Gonzales vs. Highland Garden Apartments (222 Escuela Avenue)",
              summary:
                "Rent reduction of 40% granted for January to July 2023 due to a mold issue caused by prolonged moisture in the living room wall, which the landlord failed to repair adequately. Minor repairs were made, but mold reoccurred, impacting the tenants’ living conditions.",
              outcome:
                "✅ Rent reduction granted | ❌ Initial timeline claim dismissed",
              legalBasis:
                "Community Stabilization and Fair Rent Act (CSFRA), California Civil Code Section 1941.1 (Warranty of Habitability)",
              pdfLink: aiPdfLinks[0] || "",
            },
            {
              caseNumber:
                "Case #C22230030: Siamack Yaghoubzadeh vs. TFT Investments (1260 Montecito Avenue)",
              summary:
                "Rent reduction of 25% granted for December 2022 to February 2023 due to the landlord’s failure to address mold and water leaks promptly, impacting health and habitability. The landlord placed a tarp on the roof but delayed adequate repairs, resulting in prolonged unaddressed issues.",
              outcome:
                "✅ Rent reduction granted | ❌ Landlord appeal on mold and uninhabitability denied",
              legalBasis:
                "CSFRA, California Civil Code Section 1941.1 (Warranty of Habitability)​",
              pdfLink: aiPdfLinks[1] || "",
            },
            {
              caseNumber: "Case #2021-078: Emily Wang vs. Summit Heights LLC",
              summary:
                "Case dismissed; tenant failed to provide sufficient evidence of ongoing pest issues.",
              outcome: "❌ Complaint dismissed",
              legalBasis: "Lack of corroborating evidence for pest complaints",
              pdfLink: aiPdfLinks[2] || "",
            },
          ],
        };

        console.log("aiMessage", aiMessage);
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      })

      .catch((error) => {
        console.error("Error querying:", error);
      });
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
              {message.sender === "user" && (
                <Box
                  maxW="70%"
                  px={4}
                  py={2}
                  borderRadius="md"
                  bg="#F5F5F5"
                  color="#1E1E1E"
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                >
                  <Text fontSize="16px" fontWeight="400" lineHeight="100%">
                    {message?.text}
                  </Text>
                </Box>
              )}
              {message.sender === "ai" && (
                <Box
                  maxW="90%"
                  mt="10px"
                  px={4}
                  py={2}
                  borderRadius="full"
                  color="#1E1E1E"
                >
                  <Text
                    color="#2C2C2C"
                    fontSize="16px"
                    fontWeight={500}
                    lineHeight="24px"
                    letterSpacing="0.15px"
                    mt="12px"
                    mb="8px"
                  >
                    Issue(s):
                  </Text>
                  <Text
                    color="#1E1E1E"
                    fontSize="14px"
                    fontStyle="normal"
                    fontWeight={400}
                    lineHeight="20px"
                    letterSpacing="0.25px"
                  >
                    {message.caseType}
                  </Text>
                  <Text
                    color="#2C2C2C"
                    fontSize="16px"
                    fontWeight={500}
                    lineHeight="24px"
                    letterSpacing="0.15px"
                    mt="12px"
                    mb="8px"
                  >
                    Legal Argument:
                  </Text>
                  <Text
                    color="#1E1E1E"
                    fontSize="14px"
                    fontStyle="normal"
                    fontWeight={400}
                    lineHeight="20px"
                    letterSpacing="0.25px"
                  >
                    {message.legalArguement}
                  </Text>
                </Box>
              )}

              {message.sender === "ai" &&
                message.caseInfo &&
                messages
                  .filter((msg) => msg.sender === "ai")
                  .indexOf(message) === 0 && (
                  <>
                    <Box
                      width="90%"
                      height="1px"
                      background="rgba(128, 128, 128, 0.55)"
                    />

                    <Flex direction="column" padding="8px 16px">
                      <Text
                        mt="10px"
                        color="#2C2C2C"
                        fontSize="24px"
                        fontStyle="normal"
                        fontWeight={400}
                        lineHeight="32px"
                      >
                        Tenant Profile
                      </Text>
                      <Box padding="16px" width="100%">
                        <Grid templateColumns="200px 1fr" gap={4}>
                          {[
                            { label: "Name:", value: "John Doe" },
                            {
                              label: "Address:",
                              value: "1234 Elm St, East Palo Alto, CA 94303",
                            },
                            {
                              label: "Contact:",
                              value: "johndoe@email.com, (555) 123-4567",
                            },
                            { label: "Employment Status:", value: "Employed" },
                            { label: "Monthly Rent:", value: "$1200" },
                            { label: "Security Deposit:", value: "$1200" },
                          ].map((item, index) => (
                            <>
                              <Text
                                color="#2C2C2C"
                                fontSize="14px"
                                fontWeight={500}
                                lineHeight="20px"
                                letterSpacing="0.1px"
                                fontStyle="normal"
                              >
                                {item.label}
                              </Text>
                              <Text
                                color="#1E1E1E"
                                fontSize="14px"
                                fontStyle="normal"
                                fontWeight={400}
                                lineHeight="20px"
                                letterSpacing="0.25px"
                              >
                                {item.value}
                              </Text>
                            </>
                          ))}
                        </Grid>
                      </Box>
                    </Flex>
                    <Box
                      width="90%"
                      height="1px"
                      background="rgba(128, 128, 128, 0.55)"
                    />
                    <Flex>
                      <Flex padding="8px 16px">
                        <Text
                          mt="10px"
                          color="#2C2C2C"
                          fontSize="24px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="32px"
                        >
                          Past Cases Example
                        </Text>
                      </Flex>
                    </Flex>
                  </>
                )}

              {message.sender === "ai" &&
                message.caseInfo &&
                messages
                  .filter((msg) => msg.sender === "ai")
                  .indexOf(message) === 0 && (
                  <Flex direction="column" mt={3} ml={4}>
                    <Text
                      color="#2C2C2C"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={700}
                      lineHeight="24px"
                      letterSpacing="0.15px"
                      mb={3}
                    >
                      Relevant Case Precedents:
                    </Text>
                    {message.caseInfo.map((caseItem, idx) => (
                      <Flex direction="column" maxWidth="90%">
                        {/* <Box mb="5px">
                          <Text
                            color="#1E1E1E"
                            onClick={() => toggleCase(idx)}
                            fontSize="14px"
                            fontStyle="normal"
                            fontWeight={400}
                            lineHeight="20px"
                            letterSpacing="0.25px"
                            textDecoration="underline"
                            textDecorationStyle="solid"
                            textDecorationSkipInk="none"
                          >
                            {caseItem.caseNumber}
                          </Text>
                          {expandedCases[idx] ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )}
                        </Box> */}
                        <Flex align="center">
                          {expandedCases[idx] ? (
                            <ChevronUpIcon mr={2} />
                          ) : (
                            <ChevronDownIcon mr={2} />
                          )}
                          <Text
                            color="#1E1E1E"
                            onClick={() => toggleCase(idx)}
                            fontSize="14px"
                            fontStyle="normal"
                            fontWeight={400}
                            lineHeight="20px"
                            letterSpacing="0.25px"
                            textDecoration="underline"
                            textDecorationStyle="solid"
                            textDecorationSkipInk="none"
                          >
                            {caseItem.caseNumber}
                          </Text>
                        </Flex>
                        {expandedCases[idx] && (
                          <Box
                            key={idx}
                            p="16px"
                            borderRadius="md"
                            bg="#F5F5F5"
                            maxW="90%"
                            mb={idx < message.caseInfo.length - 1 ? 3 : 0}
                            mt="10px"
                            ml="20px"
                          >
                            <Box>
                              <Text
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
                                as="a" // Change Box to be an anchor
                                href={caseItem.pdfLink}
                                onClick={() =>
                                  console.log("PDF Link:", caseItem)
                                } // Add this to debug
                                // href="2023-01-23 Rent Boards Finding and Decisions Appeal Case 2021056 - 2070 Glen Way Apartment F.pdf"
                                target="_blank"
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
                                cursor="pointer" // Add cursor pointer
                                textDecoration="none" // Remove default link styling
                                _hover={{ background: "#D1D1D1" }} // Optional: add hover effect
                              >
                                <Text
                                  color="#1E1E1E"
                                  fontSize="11px"
                                  fontStyle="normal"
                                  fontWeight={500}
                                  lineHeight="16px"
                                  letterSpacing="0.5px"
                                >
                                  View Full Case
                                </Text>
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Flex>
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

import { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <div className="App">
      <Text
        color="#009951"
        fontSize="28px"
        fontStyle="normal"
        fontWeight={700}
        lineHeight="36px"
        textAlign="center"
        marginTop="50vh"
        transform="translateY(-50%)"
      >
        Case Study Assistant
      </Text>
    </div>
  );
}

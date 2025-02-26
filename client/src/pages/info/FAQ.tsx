import {
  Box,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

// Định nghĩa cấu trúc dữ liệu cho câu hỏi thường gặp
interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

const FAQ = () => {
  // Danh sách các câu hỏi thường gặp theo danh mục
  const faqData: FAQItem[] = [
    // Tài khoản & Đăng ký
    {
      question: "How do I create an account?",
      answer: (
        <Text>
          Click on the "Sign Up" button in the top right corner of the website.
          Enter your email address, create a password, and fill in your profile
          information. Verify your email address by clicking the link sent to
          your inbox.
        </Text>
      ),
      category: "Account",
    },
    {
      question: "How do I reset my password?",
      answer: (
        <Text>
          To reset your password, click on the "Forgot Password" link on the
          login page. Enter your email address, and we'll send you a password
          reset link.
        </Text>
      ),
      category: "Account",
    },
    // Events & Registration
    {
      question: "How do I register for an event?",
      answer: (
        <Text>
          To register for an event, navigate to the event page and click the
          "Register" or "Get Tickets" button. Follow the prompts to complete
          your registration.
        </Text>
      ),
      category: "Events",
    },
    {
      question: "Can I cancel my registration?",
      answer: (
        <Text>
          Yes, you can cancel your registration by going to "My Events" in your
          account dashboard and selecting "Cancel Registration" for the specific
          event. Please check the event's refund policy before canceling.
        </Text>
      ),
      category: "Events",
    },
    {
      question: "How do I create an event?",
      answer: (
        <Text>
          To create an event, go to your dashboard and click on "Create Event"
          button. Fill in the event details including title, description, date,
          location, and upload an event image. You can also set ticket types and
          prices if applicable.
        </Text>
      ),
      category: "Events",
    },
    // Payment & Ticketing
    {
      question: "What payment methods are accepted?",
      answer: (
        <Text>
          Currently, we support credit/debit cards and PayPal for event
          payments. More payment options will be added in future updates.
        </Text>
      ),
      category: "Payment",
    },
    {
      question: "How do I access my tickets?",
      answer: (
        <Text>
          Your tickets will be emailed to you after purchase. You can also
          access them in the "My Tickets" section of your account dashboard.
          Simply show the QR code at the event entrance.
        </Text>
      ),
      category: "Payment",
    },
    // Technical Support
    {
      question: "The website is not working properly. What should I do?",
      answer: (
        <Text>
          Try refreshing the page or clearing your browser cache. If the issue
          persists, please contact us at support@eventhub.example.com with
          details of the problem.
        </Text>
      ),
      category: "Support",
    },
  ];

  // Group FAQs by category
  const faqsByCategory: { [key: string]: FAQItem[] } = {};
  faqData.forEach((faq) => {
    if (!faqsByCategory[faq.category]) {
      faqsByCategory[faq.category] = [];
    }
    faqsByCategory[faq.category].push(faq);
  });

  return (
    <Container maxW="container.lg" py={8}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb mb={6} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>FAQ</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Page Title */}
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        Frequently Asked Questions
      </Heading>

      {/* FAQ Categories */}
      <SimpleGrid columns={{ base: 1, md: 1 }} spacing={10}>
        {Object.keys(faqsByCategory).map((category) => (
          <Box key={category} mb={8}>
            <Heading as="h2" size="lg" mb={4}>
              {category}
            </Heading>
            <Accordion allowMultiple>
              {faqsByCategory[category].map((faq, index) => (
                <AccordionItem key={index}>
                  <h3>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {faq.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4}>{faq.answer}</AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        ))}
      </SimpleGrid>

      {/* Contact Information */}
      <Box textAlign="center" mt={12} p={6} bg="gray.50" borderRadius="md">
        <Heading as="h3" size="md" mb={2}>
          Still have questions?
        </Heading>
        <Text mb={4}>
          Contact us at <strong>support@eventhub.example.com</strong> or call{" "}
          <strong>0123-456-789</strong>
        </Text>
      </Box>
    </Container>
  );
};

export default FAQ;

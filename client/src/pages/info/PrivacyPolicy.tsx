import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Divider,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link as ChakraLink,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

// Định nghĩa component cho các section trong privacy policy
const PolicySection = ({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) => {
  return (
    <Box mb={8} id={id}>
      <Heading as="h2" size="lg" mb={4} color="teal.500">
        {title}
      </Heading>
      <Box>{children}</Box>
    </Box>
  );
};

const PrivacyPolicy = () => {
  const lastUpdated = "February 15, 2023";

  return (
    <Container maxW="4xl" py={12}>
      {/* Breadcrumb */}
      <Breadcrumb mb={8} color={useColorModeValue("gray.600", "gray.400")}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Privacy Policy</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Title */}
      <Box textAlign="center" mb={12}>
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          color={useColorModeValue("teal.600", "teal.300")}
          mb={4}
        >
          Privacy Policy
        </Heading>
        <Text fontSize="md" color={useColorModeValue("gray.600", "gray.400")}>
          Last Updated: {lastUpdated}
        </Text>
      </Box>

      {/* Table of Contents */}
      <Box
        mb={12}
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Heading as="h2" size="md" mb={4}>
          Table of Contents
        </Heading>
        <VStack align="start" spacing={2}>
          <ChakraLink href="#introduction">1. Introduction</ChakraLink>
          <ChakraLink href="#information-we-collect">
            2. Information We Collect
          </ChakraLink>
          <ChakraLink href="#how-we-use-information">
            3. How We Use Your Information
          </ChakraLink>
          <ChakraLink href="#information-sharing">
            4. Information Sharing and Disclosure
          </ChakraLink>
          <ChakraLink href="#your-choices">5. Your Choices</ChakraLink>
          <ChakraLink href="#data-security">6. Data Security</ChakraLink>
          <ChakraLink href="#children-privacy">
            7. Children's Privacy
          </ChakraLink>
          <ChakraLink href="#international-transfers">
            8. International Data Transfers
          </ChakraLink>
          <ChakraLink href="#policy-changes">
            9. Changes to This Privacy Policy
          </ChakraLink>
          <ChakraLink href="#contact-us">10. Contact Us</ChakraLink>
        </VStack>
      </Box>

      {/* Policy Content */}
      <VStack spacing={6} align="stretch">
        <PolicySection title="1. Introduction" id="introduction">
          <Text mb={4}>
            Welcome to EventHub. At EventHub, we respect your privacy and are
            committed to protecting your personal data. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website or use our services.
          </Text>
          <Text>
            Please read this Privacy Policy carefully. If you do not agree with
            the terms of this Privacy Policy, please do not access the site or
            use our services.
          </Text>
        </PolicySection>

        <Divider />

        <PolicySection
          title="2. Information We Collect"
          id="information-we-collect"
        >
          <Text mb={4}>
            We collect several types of information from and about users of our
            platform, including:
          </Text>
          <UnorderedList spacing={2} pl={6} mb={4}>
            <ListItem>
              <Text fontWeight="bold">Personal Identifiers:</Text> Name, email
              address, phone number, postal address, username, and password
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Profile Information:</Text> Profile
              picture, bio, interests, and preferences
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Event Information:</Text> Events you
              create, attend, or express interest in
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Payment Information:</Text> Credit card
              details, billing address, and other financial information (note:
              payment details are processed by our secure payment processors and
              not stored on our servers)
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Communications:</Text> Messages, comments,
              and feedback you send to us or other users
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Device Information:</Text> IP address,
              browser type, operating system, device information, and browsing
              patterns
            </ListItem>
          </UnorderedList>
          <Text fontWeight="bold" mb={2}>
            We collect this information:
          </Text>
          <UnorderedList spacing={2} pl={6}>
            <ListItem>
              Directly from you when you register or use our services
            </ListItem>
            <ListItem>
              Automatically as you navigate through our website or use our app
            </ListItem>
            <ListItem>
              From third parties, such as when you sign up or login through a
              social media platform
            </ListItem>
          </UnorderedList>
        </PolicySection>

        <Divider />

        <PolicySection
          title="3. How We Use Your Information"
          id="how-we-use-information"
        >
          <Text mb={4}>
            We use the information we collect about you for various purposes,
            including:
          </Text>
          <UnorderedList spacing={2} pl={6}>
            <ListItem>
              Providing, maintaining, and improving our services
            </ListItem>
            <ListItem>
              Processing event registrations and managing attendee information
            </ListItem>
            <ListItem>
              Facilitating communication between event organizers and attendees
            </ListItem>
            <ListItem>
              Personalizing your experience and delivering content and event
              recommendations
            </ListItem>
            <ListItem>
              Sending administrative notifications, updates, and promotional
              messages
            </ListItem>
            <ListItem>
              Analyzing usage patterns and optimizing our platform
            </ListItem>
            <ListItem>
              Detecting, preventing, and addressing technical issues, fraud, or
              other illegal activities
            </ListItem>
            <ListItem>
              Complying with legal obligations and enforcing our terms of
              service
            </ListItem>
          </UnorderedList>
        </PolicySection>

        <Divider />

        <PolicySection
          title="4. Information Sharing and Disclosure"
          id="information-sharing"
        >
          <Text mb={4}>
            We may share your personal information in the following situations:
          </Text>
          <UnorderedList spacing={2} pl={6}>
            <ListItem>
              <Text fontWeight="bold">With Event Organizers:</Text> If you
              register for an event, your registration information will be
              shared with the event organizer.
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">With Service Providers:</Text> We may
              share your information with third-party vendors and service
              providers that help us operate our business (e.g., payment
              processors, cloud hosting providers).
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">For Legal Reasons:</Text> We may disclose
              your information to comply with applicable laws and regulations,
              respond to a subpoena, legal order, or government request.
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Business Transfers:</Text> In the event of
              a merger, acquisition, or asset sale, your personal information
              may be transferred as a business asset.
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">With Your Consent:</Text> We may share
              your information with third parties when you have given us your
              consent to do so.
            </ListItem>
          </UnorderedList>
          <Text mt={4}>
            We do not sell your personal information to third parties for their
            marketing purposes.
          </Text>
        </PolicySection>

        <Divider />

        <PolicySection title="5. Your Choices" id="your-choices">
          <Text mb={4}>
            You have several choices regarding the use of your information on
            our platform:
          </Text>
          <UnorderedList spacing={2} pl={6} mb={4}>
            <ListItem>
              <Text fontWeight="bold">Account Information:</Text> You can review
              and update your account information through your profile settings.
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Marketing Communications:</Text> You can
              opt out of receiving promotional emails by following the
              unsubscribe instructions in each email or by adjusting your
              notification settings.
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Cookie Preferences:</Text> You can manage
              your cookie preferences through your browser settings.
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Data Access and Portability:</Text> You
              can request a copy of your personal data that we hold.
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Data Deletion:</Text> You can request that
              we delete your personal information, subject to certain
              exceptions.
            </ListItem>
          </UnorderedList>
          <Text>
            To exercise these rights, please contact us at
            <ChakraLink
              href="mailto:privacy@eventhub.com.vn"
              color="teal.500"
              ml={1}
            >
              privacy@eventhub.com.vn
            </ChakraLink>
            .
          </Text>
        </PolicySection>

        <Divider />

        <PolicySection title="6. Data Security" id="data-security">
          <Text mb={4}>
            We implement appropriate technical and organizational measures to
            protect your personal information from unauthorized access,
            disclosure, alteration, and destruction. These measures include:
          </Text>
          <UnorderedList spacing={2} pl={6}>
            <ListItem>Encryption of sensitive data</ListItem>
            <ListItem>Regular security assessments</ListItem>
            <ListItem>Access controls and authentication procedures</ListItem>
            <ListItem>Secure network architecture</ListItem>
            <ListItem>Employee training on data security</ListItem>
          </UnorderedList>
          <Text mt={4}>
            While we strive to protect your personal information, no method of
            transmission over the Internet or electronic storage is 100% secure.
            Therefore, we cannot guarantee absolute security.
          </Text>
        </PolicySection>

        <Divider />

        <PolicySection title="7. Children's Privacy" id="children-privacy">
          <Text>
            Our services are not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If you are a parent or guardian and believe that your child has
            provided us with personal information, please contact us
            immediately. If we become aware that we have collected personal
            information from children without verification of parental consent,
            we will take steps to remove that information from our servers.
          </Text>
        </PolicySection>

        <Divider />

        <PolicySection
          title="8. International Data Transfers"
          id="international-transfers"
        >
          <Text>
            We may transfer, process, and store your information on servers
            located outside of your country of residence, including in Vietnam,
            Singapore and other countries where our servers are located. These
            countries may have data protection laws that are different from
            those in your country. By using our services, you consent to the
            transfer of your information to these countries. We take steps to
            ensure that your information receives an adequate level of
            protection in the jurisdictions in which we process it.
          </Text>
        </PolicySection>

        <Divider />

        <PolicySection
          title="9. Changes to This Privacy Policy"
          id="policy-changes"
        >
          <Text>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for other operational, legal, or
            regulatory reasons. The updated policy will be posted on this page
            with a revised "Last Updated" date. We encourage you to review this
            Privacy Policy periodically to stay informed about how we are
            protecting your information.
          </Text>
        </PolicySection>

        <Divider />

        <PolicySection title="10. Contact Us" id="contact-us">
          <Text mb={4}>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our privacy practices, please contact us at:
          </Text>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            bg={useColorModeValue("gray.50", "gray.800")}
            mb={4}
          >
            <Text mb={1}>
              <strong>Email:</strong>{" "}
              <ChakraLink
                href="mailto:privacy@eventhub.com.vn"
                color="teal.500"
              >
                privacy@eventhub.com.vn
              </ChakraLink>
            </Text>
            <Text mb={1}>
              <strong>Address:</strong> 268 Lý Thường Kiệt, Phường 14, Quận 10,
              TP. Hồ Chí Minh, Việt Nam
            </Text>
            <Text>
              <strong>Phone:</strong> +84 28 3864 7256
            </Text>
          </Box>
          <Text>
            We will respond to your inquiry as soon as possible, typically
            within 30 days.
          </Text>
        </PolicySection>
      </VStack>

      {/* FAQ Section */}
      <Box mt={16}>
        <Heading as="h2" size="lg" mb={6} color="teal.500">
          Frequently Asked Questions
        </Heading>
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  How can I access or delete my personal data?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              You can access most of your personal data through your account
              settings. To request a full copy of your data or to request
              deletion, please email us at privacy@eventhub.com.vn with the
              subject "Data Request" or "Data Deletion".
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Do you use cookies on your website?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Yes, we use cookies and similar technologies to enhance your
              experience, analyze usage, and assist in our marketing efforts.
              You can control cookies through your browser settings.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  How long do you keep my personal information?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              We retain your personal information for as long as necessary to
              fulfill the purposes for which we collected it, including for the
              purposes of satisfying any legal, accounting, or reporting
              requirements.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  What are my privacy rights under Vietnamese Personal Data
                  Protection Decree?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Under the Vietnamese Personal Data Protection Decree, you have
              rights including access to your data, correction of inaccuracies,
              deletion of personal information, data portability, and the right
              to object to certain processing. Please contact us to exercise
              these rights.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* CTA */}
      <Box
        mt={12}
        p={8}
        borderRadius="lg"
        bg={useColorModeValue("teal.50", "teal.900")}
        textAlign="center"
      >
        <Heading as="h3" size="md" mb={4}>
          Still have questions about your privacy?
        </Heading>
        <Text mb={4} maxW="2xl" mx="auto">
          Our team is here to help address any concerns you may have about your
          data and privacy on EventHub.
        </Text>
        <HStack spacing={4} justify="center">
          <Button as={Link} to="/contact" colorScheme="teal" size="lg">
            Contact Us
          </Button>
          <Button
            as={Link}
            to="/faq"
            variant="outline"
            colorScheme="teal"
            size="lg"
          >
            Visit FAQ
          </Button>
        </HStack>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;

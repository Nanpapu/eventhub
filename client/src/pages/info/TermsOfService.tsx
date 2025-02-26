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
  Button,
  HStack,
  Link as ChakraLink,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

// Định nghĩa component cho các section trong terms of service
const TermsSection = ({
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

const TermsOfService = () => {
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
          <BreadcrumbLink>Terms of Service</BreadcrumbLink>
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
          Terms of Service
        </Heading>
        <Text fontSize="md" color={useColorModeValue("gray.600", "gray.400")}>
          Last Updated: {lastUpdated}
        </Text>
      </Box>

      {/* Important Notice */}
      <Alert status="info" variant="left-accent" mb={8} borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Important Notice:</Text>
          <Text>
            By using EventHub, you agree to these Terms. Please read them
            carefully. If you don't agree to all of the terms and conditions,
            you may not use our services.
          </Text>
        </Box>
      </Alert>

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
          <ChakraLink href="#agreement">1. Agreement to Terms</ChakraLink>
          <ChakraLink href="#changes">2. Changes to Terms</ChakraLink>
          <ChakraLink href="#account">
            3. Account Registration and Requirements
          </ChakraLink>
          <ChakraLink href="#content">4. User-Generated Content</ChakraLink>
          <ChakraLink href="#conduct">5. Prohibited Conduct</ChakraLink>
          <ChakraLink href="#fees">6. Fees and Payments</ChakraLink>
          <ChakraLink href="#events">
            7. Event Listings and Attendance
          </ChakraLink>
          <ChakraLink href="#intellectual">
            8. Intellectual Property Rights
          </ChakraLink>
          <ChakraLink href="#disclaimer">
            9. Disclaimer of Warranties
          </ChakraLink>
          <ChakraLink href="#liability">10. Limitation of Liability</ChakraLink>
          <ChakraLink href="#indemnification">11. Indemnification</ChakraLink>
          <ChakraLink href="#termination">12. Termination</ChakraLink>
          <ChakraLink href="#governing">13. Governing Law</ChakraLink>
          <ChakraLink href="#dispute">14. Dispute Resolution</ChakraLink>
          <ChakraLink href="#contact">15. Contact Information</ChakraLink>
        </VStack>
      </Box>

      {/* Terms Content */}
      <VStack spacing={6} align="stretch">
        <TermsSection title="1. Agreement to Terms" id="agreement">
          <Text mb={4}>
            These Terms of Service ("Terms") constitute a legally binding
            agreement between you and EventHub, Inc. ("EventHub," "we," "us," or
            "our") governing your access to and use of the EventHub website,
            mobile application, and related services (collectively, the
            "Services").
          </Text>
          <Text>
            By accessing or using our Services, you acknowledge that you have
            read, understood, and agree to be bound by these Terms. If you do
            not agree to these Terms, you must not access or use our Services.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="2. Changes to Terms" id="changes">
          <Text mb={4}>
            We reserve the right to modify these Terms at any time. If we make
            changes, we will provide notice by updating the date at the top of
            these Terms and, in some cases, provide additional notice (such as
            adding a statement to our homepage or sending you an email
            notification).
          </Text>
          <Text>
            Your continued use of the Services after any such changes
            constitutes your acceptance of the new Terms. If you do not agree to
            the new Terms, you must stop using the Services.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection
          title="3. Account Registration and Requirements"
          id="account"
        >
          <Text mb={4}>
            To use certain features of our Services, you must register for an
            account. When you register, you agree to provide accurate, current,
            and complete information about yourself.
          </Text>
          <Text mb={4}>
            You are responsible for safeguarding your account credentials and
            for any activity that occurs through your account. You agree to
            notify us immediately of any unauthorized access to or use of your
            account.
          </Text>
          <Text mb={4}>
            To create an account, you must meet the following requirements:
          </Text>
          <UnorderedList spacing={2} pl={6} mb={4}>
            <ListItem>
              Be at least 18 years old or have the legal capacity to enter into
              these Terms in your jurisdiction
            </ListItem>
            <ListItem>Create only one account for personal use</ListItem>
            <ListItem>
              Not create an account if you were previously removed from our
              Services
            </ListItem>
            <ListItem>
              Not use false or misleading information when registering
            </ListItem>
          </UnorderedList>
          <Text>
            We reserve the right to suspend or terminate your account if any
            information provided during registration or thereafter proves to be
            inaccurate, false, or misleading, or if you violate any provision of
            these Terms.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="4. User-Generated Content" id="content">
          <Text mb={4}>
            Our Services allow you to create, post, share, and store content,
            including event listings, comments, profile information, and other
            materials (collectively, "User Content"). You retain ownership
            rights in your User Content.
          </Text>
          <Text mb={4}>
            By posting User Content on or through our Services, you grant us a
            worldwide, non-exclusive, royalty-free, fully paid, irrevocable,
            perpetual, and sublicensable license to use, reproduce, modify,
            adapt, publish, translate, create derivative works from, distribute,
            and display your User Content in all media formats and channels now
            known or later developed without compensation to you.
          </Text>
          <Text mb={4}>You represent and warrant that:</Text>
          <UnorderedList spacing={2} pl={6} mb={4}>
            <ListItem>
              You own or have the necessary rights to post your User Content
            </ListItem>
            <ListItem>
              Your User Content does not violate the privacy rights, publicity
              rights, intellectual property rights, or any other rights of any
              person
            </ListItem>
            <ListItem>
              Your User Content does not contain material that is defamatory,
              obscene, offensive, or otherwise objectionable
            </ListItem>
          </UnorderedList>
          <Text>
            We reserve the right to remove any User Content from our Services at
            any time, for any reason, without notice.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="5. Prohibited Conduct" id="conduct">
          <Text mb={4}>
            You agree not to engage in any of the following prohibited
            activities:
          </Text>
          <UnorderedList spacing={2} pl={6}>
            <ListItem>
              Violating any applicable law, rule, or regulation
            </ListItem>
            <ListItem>
              Impersonating any person or entity or falsely stating or
              misrepresenting your affiliation with a person or entity
            </ListItem>
            <ListItem>
              Interfering with or disrupting the Services or servers or networks
              connected to the Services
            </ListItem>
            <ListItem>
              Posting false, misleading, or deceptive event listings
            </ListItem>
            <ListItem>
              Collecting or harvesting any information from our Services,
              including user account information
            </ListItem>
            <ListItem>
              Using our Services for any commercial purpose without our consent
            </ListItem>
            <ListItem>
              Creating multiple accounts for deceptive or fraudulent purposes
            </ListItem>
            <ListItem>
              Using automated means, including bots or scrapers, to access our
              Services
            </ListItem>
            <ListItem>
              Attempting to circumvent any security measures or content
              filtering technologies
            </ListItem>
            <ListItem>
              Uploading or transmitting viruses, malware, or other types of
              malicious code
            </ListItem>
          </UnorderedList>
        </TermsSection>

        <Divider />

        <TermsSection title="6. Fees and Payments" id="fees">
          <Text mb={4}>
            While some features of our Services are free to use, we may charge
            fees for certain features, such as event creation or ticket
            purchases.
          </Text>
          <Text mb={4}>
            When you purchase tickets to an event or create a paid event, the
            following terms apply:
          </Text>
          <UnorderedList spacing={2} pl={6} mb={4}>
            <ListItem>
              All fees are in the currency specified and include applicable
              taxes
            </ListItem>
            <ListItem>
              EventHub collects a service fee for facilitating the transaction
            </ListItem>
            <ListItem>
              You agree to pay all applicable fees and charges based on your
              selected payment method
            </ListItem>
            <ListItem>
              Refunds and exchanges are subject to the event organizer's
              policies
            </ListItem>
            <ListItem>
              EventHub may use third-party payment processors, and your use of
              such services is subject to their terms of service
            </ListItem>
          </UnorderedList>
          <Text>
            For event organizers, we will remit payments according to our
            payment schedule, less our service fees and any applicable taxes.
            You are responsible for providing accurate payment information and
            reporting any income as required by law.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="7. Event Listings and Attendance" id="events">
          <Text mb={4}>
            If you create an event on our platform, you represent and warrant
            that:
          </Text>
          <UnorderedList spacing={2} pl={6} mb={4}>
            <ListItem>
              You have the legal right and authority to create and host the
              event
            </ListItem>
            <ListItem>
              The event complies with all applicable laws, rules, and
              regulations
            </ListItem>
            <ListItem>
              The information in your event listing is accurate and not
              misleading
            </ListItem>
            <ListItem>
              You will honor any tickets sold through our Services
            </ListItem>
            <ListItem>
              You will maintain reasonable security and safety measures at your
              event
            </ListItem>
          </UnorderedList>
          <Text mb={4}>
            If you purchase a ticket or register for an event, you understand
            that:
          </Text>
          <UnorderedList spacing={2} pl={6}>
            <ListItem>
              EventHub is not responsible for the event itself, including its
              quality, safety, or legality
            </ListItem>
            <ListItem>
              Event details may change, and organizers may cancel events
            </ListItem>
            <ListItem>
              Refunds are subject to the organizer's refund policy
            </ListItem>
            <ListItem>
              You must comply with all venue rules and regulations
            </ListItem>
            <ListItem>
              EventHub is not liable for any injuries, losses, or damages you
              may sustain while attending an event
            </ListItem>
          </UnorderedList>
        </TermsSection>

        <Divider />

        <TermsSection title="8. Intellectual Property Rights" id="intellectual">
          <Text mb={4}>
            The Services, including all content, features, and functionality,
            are owned by EventHub, its licensors, or other providers and are
            protected by copyright, trademark, patent, and other intellectual
            property or proprietary rights laws.
          </Text>
          <Text mb={4}>
            These Terms do not grant you any right, title, or interest in the
            Services or our intellectual property. You may not reproduce,
            distribute, modify, create derivative works of, publicly display,
            publicly perform, republish, download, store, or transmit any
            material from our Services, except as follows:
          </Text>
          <UnorderedList spacing={2} pl={6}>
            <ListItem>
              Your computer may temporarily store copies in RAM incidental to
              your accessing and viewing those materials
            </ListItem>
            <ListItem>
              You may store files that are automatically cached by your web
              browser
            </ListItem>
            <ListItem>
              You may print or download one copy of a reasonable number of pages
              for your personal, non-commercial use
            </ListItem>
            <ListItem>
              If we provide social media features, you may take such actions as
              are enabled by such features
            </ListItem>
          </UnorderedList>
        </TermsSection>

        <Divider />

        <TermsSection title="9. Disclaimer of Warranties" id="disclaimer">
          <Text mb={4}>
            THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS,
            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. EVENTHUB
            EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING, WITHOUT LIMITATION,
            IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, AND NON-INFRINGEMENT.
          </Text>
          <Text>
            WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR
            ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR
            THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER
            HARMFUL COMPONENTS. WE MAKE NO WARRANTIES ABOUT THE ACCURACY,
            RELIABILITY, COMPLETENESS, OR TIMELINESS OF THE SERVICES.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="10. Limitation of Liability" id="liability">
          <Text mb={4}>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
            EVENTHUB, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS,
            EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF
            ANY KIND, INCLUDING, WITHOUT LIMITATION, DIRECT, INDIRECT, SPECIAL,
            INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, ARISING OUT OF OR IN
            CONNECTION WITH YOUR USE OF THE SERVICES.
          </Text>
          <Text>
            THIS INCLUDES, WITHOUT LIMITATION, ANY DAMAGES ARISING FROM YOUR
            ATTENDANCE AT EVENTS LISTED ON OUR SERVICES, ANY ACTIONS OR CONTENT
            OF THIRD PARTIES, OR ANY ERRORS OR OMISSIONS IN THE SERVICES'
            OPERATION.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="11. Indemnification" id="indemnification">
          <Text>
            You agree to defend, indemnify, and hold harmless EventHub, its
            affiliates, licensors, and service providers, and its and their
            respective officers, directors, employees, contractors, agents,
            licensors, suppliers, successors, and assigns from and against any
            claims, liabilities, damages, judgments, awards, losses, costs,
            expenses, or fees (including reasonable attorneys' fees) arising out
            of or relating to your violation of these Terms or your use of the
            Services, including, but not limited to, your User Content, any use
            of the Services' content, services, and products other than as
            expressly authorized in these Terms.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="12. Termination" id="termination">
          <Text mb={4}>
            We reserve the right to terminate or suspend your account and access
            to the Services at any time, for any reason, including, without
            limitation, your breach of these Terms.
          </Text>
          <Text>
            Upon termination, your right to use the Services will immediately
            cease. All provisions of these Terms that by their nature should
            survive termination shall survive, including, without limitation,
            ownership provisions, warranty disclaimers, indemnity, and
            limitations of liability.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="13. Governing Law" id="governing">
          <Text>
            These Terms shall be governed by and construed in accordance with
            the laws of the State of California, without giving effect to any
            principles of conflicts of law. Any legal action or proceeding
            relating to your access to, or use of, the Services or these Terms
            shall be instituted in a state or federal court in San Francisco
            County, California, and you agree to submit to the personal
            jurisdiction of such courts.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="14. Dispute Resolution" id="dispute">
          <Text mb={4}>
            You and EventHub agree that any dispute, claim, or controversy
            arising out of or relating to these Terms or the Services shall be
            resolved through binding arbitration in accordance with the rules of
            the American Arbitration Association. The arbitration will be
            conducted in San Francisco, California, unless you and EventHub
            agree otherwise.
          </Text>
          <Text mb={4}>
            Either party may, however, seek injunctive or other equitable relief
            in any state or federal court in San Francisco County, California to
            protect the party's intellectual property rights pending the
            completion of arbitration.
          </Text>
          <Text>
            TO THE EXTENT PERMITTED BY LAW, YOU AND EVENTHUB AGREE THAT EACH MAY
            BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL
            CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED
            CLASS OR REPRESENTATIVE PROCEEDING.
          </Text>
        </TermsSection>

        <Divider />

        <TermsSection title="15. Contact Information" id="contact">
          <Text>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            bg={useColorModeValue("gray.50", "gray.800")}
            my={4}
          >
            <Text mb={1}>
              <strong>Email:</strong>{" "}
              <ChakraLink href="mailto:legal@eventhub.com" color="teal.500">
                legal@eventhub.com
              </ChakraLink>
            </Text>
            <Text mb={1}>
              <strong>Address:</strong> 123 Event Street, Tech District, San
              Francisco, CA 94103
            </Text>
            <Text>
              <strong>Phone:</strong> +1 (555) 123-4567
            </Text>
          </Box>
        </TermsSection>
      </VStack>

      {/* Acceptance Section */}
      <Box
        mt={12}
        p={8}
        borderRadius="lg"
        bg={useColorModeValue("teal.50", "teal.900")}
        textAlign="center"
      >
        <Heading as="h3" size="md" mb={4}>
          Need Help Understanding Our Terms?
        </Heading>
        <Text mb={4} maxW="2xl" mx="auto">
          If you have any questions about our Terms of Service or need further
          clarification, please don't hesitate to reach out to our team.
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

export default TermsOfService;

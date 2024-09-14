import {
    Html,
    Head,
    Column,
    Link,
    Preview,
    Img,
    Row,
    Section,
    Text,
    Button,
    Tailwind,
    Container,
    Body,
    Hr,
  } from "@react-email/components";
  
  interface VerificationEmailPage {
    username: string;
    otp: string;
  }
  
  export default function ForgetPasswordEmail({
    username,
    otp,
  }: VerificationEmailPage) {
    return (
      <Tailwind>
        <Html lang="en" dir="ltr">
          <Head>
            <title>Verification Code</title>
          </Head>
          <Preview>Here&apos;s your Verification code: {otp}</Preview>
          <Body>
            <Container className="text-center">
              <Section>
                <Row>
                  <Text className="text-xl">
                    Hey <strong className="text-blue-500">{username}</strong>,
                    Verify your code to change Password
                  </Text>
                </Row>
                <Row>
                  <Text>
                    This verification code is only valid for <strong>10 min</strong>.
                    Please use the following verification code to change your
                    password:
                  </Text>
                </Row>
                <Row>
                  <Text>
                    <strong>Here&apos;s your verification code</strong>
                  </Text>
                </Row>
                <Row>
                  <Text className="text-[25px]">
                    <strong>{otp}</strong>
                  </Text>
                </Row>
                <Row>
                  <Button
                    href={`https://lukka-chhuppi.web3ngineer.in/forgot-password/${username}/${otp}`}
                    className="box-border rounded-[8px] bg-indigo-600 px-[20px] py-[12px] text-center font-semibold text-white"
                  >
                    Change Password
                  </Button>
                </Row>
                <Row>
                  <Text>
                    If you did not request this code, please ignore this email.
                  </Text>
                </Row>
                <Row>
                  <Text className="text-xs">
                    This message was produced and distributed by{" "}
                    <Link href="https://lukka-chhuppi.web3ngineer.in">
                      Lukka Chhuppi
                    </Link>{" "}
                    . All rights reserved.{" "}
                    <Link href="https://lukka-chhuppi.web3ngineer.in/">Lukka Chhuppi</Link> is a
                    registered trademark of{" "}
                    <Link href="https://web3ngineer.in/">
                      <strong>Web3ngineer .</strong>
                    </Link>
                  </Text>
                </Row>
                <Hr />
                <Row>
                  <Text className="text-xs">
                    © 2024 Lukka Chhuppi. All rights reserved.
                  </Text>
                </Row>
              </Section>
            </Container>
          </Body>
        </Html>
      </Tailwind>
    );
  }
  
  {
    /* <Row>
                   <Text>Connect with me.</Text>
                </Row>
                <Row>
                  <Column>
                    <Link href="https://github.com/web3ngineer">
                    <Img
                        alt="Github"
                        height="32"
                        src="/public/logo/icons8-github-32.png"
                        width="32"
                      />
                    </Link>
                    <Link href="https://twitter.com/web3ngineer">
                      <Img
                        alt="X"
                        height="32"
                        src="/public/logo/icons8-twitter-32.png"
                        width="32"
                      />
                    </Link>
                    <Link href="https://www.instagram.com/web3ngineer">
                      <Img
                        alt="Instagram"
                        height="32"
                        src="/public/logo/icons8-instagram-32.png"
                        width="32"
                      />
                    </Link>
                    <Link href="https://www.linkedin.com/in/web3ngineer">
                      <Img
                        alt="LinkedIn"
                        height="32"
                        src="/public/logo/icons8-linked-in-32.png"
                        width="32"
                      />
                    </Link>
                  </Column>
                </Row> */
  }
  
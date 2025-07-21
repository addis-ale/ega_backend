import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp
        signInUrl="/"
        routing="hash"
        appearance={{
          baseTheme: dark,
        }}
      />
    </div>
  );
};

export default SignUpPage;

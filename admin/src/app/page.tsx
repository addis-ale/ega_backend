import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      {" "}
      <SignedOut>
        <SignIn
          signUpUrl="/signup"
          routing="hash"
          appearance={{
            baseTheme: dark,
          }}
        />
      </SignedOut>
      <SignedIn>
        <div>the dashboard</div>
      </SignedIn>
    </div>
  );
}

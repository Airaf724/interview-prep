"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"; // ✅ correct
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const isSignIn = type === "sign-in";
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email: email,
          password: password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("account created plz sign in");
        router.push("/sign-in");
        console.log("sign-up values", values);
      } else {
        const { email, password } = values;

        const userCredentails = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredentails?.user?.getIdToken();

        if (!idToken) {
          toast.error("sign in falied");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("sign in successfull");
        router.push("/");
        console.log("sign in ", values);
      }
    } catch (error) {
      console.log(error);
      toast.error(`there was an error ${error}`);
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center ">
          <Image src="./logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Pratice Job interivew in Real Time</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Your Email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
            />
            <Button type="submit">
              {isSignIn ? "sign-in" : "create an account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet ?" : "Have an Account Already ?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "SignUp" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

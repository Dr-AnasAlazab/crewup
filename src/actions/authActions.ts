/** @format */
"use server";

import { serverSupabase } from "@/src/lib/supabase/server"; // Path to your serverSupabase file
import { redirect } from "next/navigation";

export async function signupAction({
  email,
  password,
  fullName,
  companyName,
  role,
}: any) {
  const supabase = await serverSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        company_name: companyName,
        role: role,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/dashboard");
  // If signup is successful, redirect them smoothly from the server side!
  //  redirect("/login?message=Check your email to verify your account");
}

export async function loginAction({ email, password }: any) {
  const supabase = await serverSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/dashboard");
}

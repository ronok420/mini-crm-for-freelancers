
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useAuth } from "../../contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import ThemeToggle from "@/components/ui/ThemeToggle";
// import { toast } from "sonner";

// const loginSchema = z.object({
//   email: z.string().email({ message: "Please enter a valid email address" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// const LoginPage: React.FC = () => {
//   const { login, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const form = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values: LoginFormValues) => {
//     try {
//       await login(values.email, values.password);
//     } catch (error) {
//       console.error("Login error:", error);
//       // Error is already handled in auth context with toast
//     }
//   };

//   // Redirect if already authenticated
//   React.useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthenticated, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
//       <div className="absolute top-4 right-4">
//         <ThemeToggle />
//       </div>
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold">Log in to FreeCRM</h1>
//           <p className="mt-2 text-muted-foreground">
//             Manage your clients and projects effectively
//           </p>
//         </div>

//         <div className="bg-card p-6 rounded-lg shadow-sm border">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input type="email" placeholder="your@email.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="••••••" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
//                 {form.formState.isSubmitting ? "Logging in..." : "Log in"}
//               </Button>
//             </form>
//           </Form>

//           <div className="mt-4 text-center text-sm">
//             <span className="text-muted-foreground">Don't have an account?</span>{" "}
//             <Link to="/signup" className="text-primary hover:underline">
//               Sign up
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password, () => navigate("/"));
    } catch (error) {
      console.error("Login error:", error);
      // Error is already handled in auth context with toast
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Log in to FreeCRM</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your clients and projects effectively
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account?</span>{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
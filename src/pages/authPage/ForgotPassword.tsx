import {
  ForgotPasswordSchema,
  TForgotPasswordSchema,
} from "@/validations/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/utils/supabase";
import toast from "react-hot-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const form = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const [linkSending, setLinkSending] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: TForgotPasswordSchema) => {
    try {
      setLinkSending(true);
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);

      if (error) {
        throw new Error(error.message || "Failed to send reset password link");
      }

      toast.success("Reset password link sent successfully!");
      form.reset();
      navigate(-1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLinkSending(false);
    }
  };

  return (
    <div className="h-screen w-full bg-MainBackgroundColor flex justify-center items-center p-4">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-center block">
                      Enter your email address
                    </FormLabel>
                    <p className="text-sm text-center text-gray-600 mb-2">
                      You'll get a reset password link in your email
                    </p>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="secondary"
                className="w-full py-3"
                disabled={linkSending}
              >
                {linkSending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Sending...
                  </>
                ) : (
                  "Send Reset Password Link"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;

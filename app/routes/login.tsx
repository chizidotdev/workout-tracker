import { Link, useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Heading } from "~/components/ui/text";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api";

const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();

  return await api.collection("users").authWithPassword(email, password);
};

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: signIn, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => navigate("/"),
    onError: (error) =>
      toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  return (
    <div className="container mt-40 px-8">
      <Link to="/" className="fixed left-4 top-4">
        <Button variant="ghost">
          <ChevronLeft /> Back to home
        </Button>
      </Link>

      <Heading className="text-center">Login</Heading>

      <form onSubmit={signIn} className="mt-6 flex flex-col gap-3">
        <div className="space-y-1">
          <Label>Email</Label>
          <Input required name="email" type="email" placeholder="user@example.com" />
        </div>

        <div className="space-y-1">
          <Label>Password</Label>
          <Input required name="password" type="password" placeholder="********" />
        </div>

        <Button isLoading={isPending} className="my-2" type="submit">
          Login
        </Button>
      </form>

      <Link to="/register" className="fixed bottom-6 left-4">
        <Button variant="outline">Request account.</Button>
      </Link>
    </div>
  );
}

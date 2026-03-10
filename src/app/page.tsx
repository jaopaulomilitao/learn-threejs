import { redirect } from "next/navigation";

export default function Home() {
  // executes a lightning-fast server-side redirect before any html is sent to the client
  redirect('/login');
}
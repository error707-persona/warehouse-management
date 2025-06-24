import { redirect } from "next/navigation";
// Postgres, Node, Tailwind, EC2, RDS, S3
export default function Home() {
  return (
   redirect("/login") 
  );
}

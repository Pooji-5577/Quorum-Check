import ProductShell from "@/components/product/ProductShell";

const mockUser = { id: 1, name: "Demo User", email: "demo@quorumcheck.app", role: "voter" };

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <ProductShell user={mockUser}>{children}</ProductShell>;
}

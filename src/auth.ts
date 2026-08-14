import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "admin" | "customer";
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "customer";
    };
  }
}

const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        const adminEmail = (process.env.ADMIN_EMAIL || "admin@gbautozone.ge")
          .trim()
          .toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (email === adminEmail && password === adminPassword) {
          return {
            id: "admin-1",
            email: adminEmail,
            name: "Admin",
            role: "admin" as const,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/ka/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user && "role" in user && user.role) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const role = token.role;
        if (role === "admin" || role === "customer") {
          session.user.role = role;
        }
        if (typeof token.sub === "string") {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

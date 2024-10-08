import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/db/config';
import { NextResponse } from 'next/server';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile', // Pastikan scope mencakup profil pengguna
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Menyimpan informasi ke dalam token setelah user berhasil login
      if (account && profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.accessToken = account.access_token;
        token.picture = profile.picture || '';
      }
      return token;
    },
    async session({ session, token }) {
      // Menyimpan token di session
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Cek apakah pengguna sudah ada di database berdasarkan email
        const existingUser = await db.collection('users').findOne({ email: profile.email });

        if (!existingUser) {
          // Buat username dari email sebelum tanda '@'
          const username = profile.email.split('@')[0];

          // Jika pengguna belum ada, buat entri baru di database
          const newUser = {
            name: profile.name,
            username: username,
            email: profile.email,
            image: profile.picture || '',
          };

          await db.collection('users').insertOne(newUser);
        }

        // Membuat respons untuk menyimpan token dan data user ke dalam cookies
        const response = NextResponse.next();
        response.cookies.set('Authorization', `Bearer ${account.access_token}`, {
          httpOnly: false,
          path: '/',
          maxAge: 60 * 60 * 24,
        });

        const userData = {
          name: profile.name,
          email: profile.email,
          username: profile.email.split('@')[0],
          image: profile.picture || '',
        };

        response.cookies.set('User', JSON.stringify(userData), {
          httpOnly: false,
          path: '/',
          maxAge: 60 * 60 * 24,
        });

        return response;
      } catch (error) {
        console.error('Error saving user to database:', error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };

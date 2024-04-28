import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Apple from "next-auth/providers/apple"
import Discord from "next-auth/providers/discord"
import Facebook from "next-auth/providers/facebook"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"
import Twitter from "next-auth/providers/twitter"

import axios from "axios"

export default async function auth(req, res) {
    const providers = [
        Credentials({
            name: "Email and Password",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Your Email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/sanctum/csrf-cookie", {
                    method: "GET",
                })

                const setCookieHeader = res.headers.get("set-cookie")
                // console.log("setCookieHeader", setCookieHeader)
                // you'll find your_site_session key in this console log

                const cookies = setCookieHeader?.split(", ")
                // console.log(cookies)
                let sessionKey = null
                let xsrfToken = null

                for (const cookie of cookies!) {
                    if (cookie.startsWith("laravel_session=")) {
                        sessionKey = cookie.split("=")[1]
                    } else if (cookie.startsWith("XSRF-TOKEN=")) {
                        xsrfToken = cookie.split("=")[1]
                    }

                    if (sessionKey && xsrfToken) {
                        break
                    }
                }
                
                const data = {
                    email: credentials?.email,
                    password: credentials?.password,
                }
                
                const headers = new Headers({
                    Cookie: `laravel_session=${sessionKey}`,
                    "Content-Type": "application/json",
                })

                if (xsrfToken) {
                    headers.append("X-XSRF-TOKEN", xsrfToken)
                }

                const options = {
                    method: "POST",
                    headers,
                    body: JSON.stringify(data),
                }

                try {
                    // const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/api/login', options)
                    // console.log('response', response)
                    
                    // if (response.ok) {
                    //     const user = await response.json()
                    //     return user
                    // }

                    // throw new Error("response: " + response.status + " | " + response.statusText)

                    const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + '/api/login', data, { withCredentials: true })
                    console.log('response', response)

                    if (response.status === 200) {
                        const user = response.data
                        return user
                    }

                    throw new Error(response.data.message)
                    
                } catch (error) {
                    // let message = error;
                    let message = error.response.data.message
                    
                    console.error("error", error)
                    return Promise.reject(new Error(message))
                }
            },
        }),
        Apple({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
        }),
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
        Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        LinkedIn({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        }),
        Twitter({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
        }),
    ]

    return await NextAuth(req, res, {
        providers,
        callbacks: {
            async jwt({ token, account, user }) {
                if (user) {
                    token.user = user
                    token.accessToken = user.access_token
                }
                return token
            },
            async session({ session, token }) {
                session.accessToken = token.accessToken
                session.user = token.user
                return session
            },
            async redirect({ url, baseUrl }) {
                return url.startsWith(baseUrl) ? url : baseUrl
            },
        },
        pages: {
            signIn: "/auth/signin",
            signOut: "/auth/signout",
            error: "/auth/error",
            verifyRequest: "/auth/verify-request",
            newUser: null,
        },
  })
}
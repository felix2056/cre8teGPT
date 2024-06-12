import { withAuth } from "next-auth/middleware"

// middleware is applied to all routes, use conditionals to select

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
        // console.log('token', token)

        if (token === null) {
            if (req.nextUrl.pathname.startsWith("/dashboard")) {
                return false
            }

            if (req.nextUrl.pathname.startsWith("/checkout")) {
              return false
            }

            if (req.nextUrl.pathname.startsWith("/profile-details")) {
                return false
            }
        }


      return true
    },
  },
})
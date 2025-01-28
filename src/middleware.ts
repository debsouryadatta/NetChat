import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes should be public
const isPublicRoute = createRouteMatcher([
  '/', 
  '/onboarding',
  '/api/webhook/clerk',
  '/sign-in',
  '/sign-up',
  '/sso-callback',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()
  
  // If the user isn't signed in and the route isn't public, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }

  // Allow the request to continue
  return null
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

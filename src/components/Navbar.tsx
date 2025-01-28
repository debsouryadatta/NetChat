"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <nav className="fixed w-full top-0 z-50 backdrop-blur-sm bg-background/80 border-b">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto">
                {/* Logo/Home */}
                <Link
                    href="/"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                    <span className="text-xl font-bold">NetChat</span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    {/* User Button */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button 
                                variant="outline" 
                                className="rounded-full px-6 font-medium hover:text-primary transition-colors"
                            >
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                            // appearance={{
                            //     elements: {
                            //         avatarBox: "h-10 w-10"
                            //     }
                            // }}
                        />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
};
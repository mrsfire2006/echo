'use client'
import { Separator } from "@/components/ui/separator";
import { CircleUserRound, LogOut, MessageCircleMore, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

const navLinks = [
    { id: 'conversations', icon: MessageCircleMore, href: "/chat", text: "Conversations" },
    { id: 'users', icon: CircleUserRound, href: '/users', text: "Users" },
    { id: 'settings', icon: Settings, href: '/settings', text: "Settings" }
]

export default function ChatAppNavbar() {
    const pathname = usePathname();

    return (
        <nav className="
                
        shrink-0
        border-sidebar-border
        bg-sidebar
        /* Mobile */
        grid
        grid-cols-3
        h-16
        w-[90%]
        border-t
        px-4
        rounded-2xl
        shadow-2xl
          my-4
          left-1/2 -translate-x-1/2
        absolute
        z-10
         /* Desktop */
 
        md:flex
        md:h-auto
        md:w-auto
        md:flex-col
        md:items-center
        md:justify-between
        md:border-t-0
        md:border-r
        md:rounded-r-xl
        md:p-4
        md:py-8
        md:relative
            md:translate-x-0
    md:left-auto
        md:my-0
        ">
            <div className=" col-span-3
          grid
          grid-cols-[1fr_auto_1fr_auto_1fr]
          items-center
          justify-items-center
          gap-3

          md:flex
          md:flex-col">

                {navLinks.map((link, index) => {
                    const isSelected =
                        pathname === link.href || pathname.startsWith(`${link.href}/`);
                    const Icon = link.icon;

                    return (
                        <Fragment key={link.id}>
                            <Link
                                data-active={isSelected}

                                href={link.href}
                                className={`flex shrink-0 grow-0  md:h-11 md:w-11 items-center md:justify-center flex-col  col-span-1  rounded-xl transition-colors md:data-[active=true]:bg-sidebar-accent text-sidebar-accent-foreground data-[active=false]:text-sidebar-foreground/50 md:hover:bg-sidebar-accent/50 md:hover:text-sidebar-accent-foreground"
                                }`}
                            >
                                <div className="flex flex-col justify-center items-center">

                                    <Icon strokeWidth={2} />
                                    <span className=" sm:inline md:hidden">
                                        {link.text}
                                    </span>
                                </div>
                            </Link>
                            {index < navLinks.length - 1 && (<Separator

                                orientation="vertical"
                                className="h-6 md:hidden my-auto"
                            />)}
                        </Fragment>
                    );
                })}
            </div>

            <Link
                href="/"
                className="hidden  md:flex h-11 w-11 items-center justify-center rounded-xl text-sidebar-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
                <LogOut className="h-5 w-5" strokeWidth={2} />
            </Link>
        </nav>
    );
}
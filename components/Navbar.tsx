import React from "react";
import ActiveUsers from "@/components/users/ActiveUsers";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="flex select-none items-center justify-between gap-4
    bg-primary-black px-5">
      <Image src="/assets/logo.svg" alt="logo" height={20} width={58} />
      <ActiveUsers />
    </nav>
  );
};

export default Navbar;

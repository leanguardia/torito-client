"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Logo } from "~~/components/Logo";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <section className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 flex flex-col gap-2 items-center">
        <h1 className="text-center">
          <span className="block text-base mb-2">Welcome to</span>
          <span className="flex items-end gap-4 text-5xl font-bold">
            <Logo size={48} /> Torito{" "}
          </span>
        </h1>
        <div className="flex btn btn-md bg-base-100 w-fit justify-center mb-4 items-center space-x-2">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>
      </div>
    </section>
  );
};

export default Home;

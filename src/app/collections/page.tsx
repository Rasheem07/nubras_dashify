"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, Pencil, PlusCircle, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Collections() {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [collections, setCollections] = useState<any[]>([]);
  interface CollectionData {
    title: string;
    description: string;
  }

  const handleCreateCollection = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const data: CollectionData = { title, description };
    await fetch("/api/collections/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/collections", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const collections = await response.json();

      setCollections(collections);
    })();
  }, []);

  return (
    <div className="p-6 space-y-12 w-full">
      <div className="flex items-center w-full justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Browse your collections
          </h1>
          <p className="text-base font-sans text-zinc-600">
            Create, edit and remove reports in the collections
          </p>
        </div>
        <Dialog>
          <DialogTrigger className="bg-teal-500 hover:bg-teal-600 flex items-center gap-x-1 py-1.5 px-4 rounded-md shadow-lg text-white ">
            Create new collection <PlusCircle className="h-4 w-4" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new collection</DialogTitle>
              <DialogDescription>
                Create, edit and remove reports in the collections
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleCreateCollection}
              className="flex flex-col gap-4 my-4"
            >
              <div className="flex flex-col gap-2">
                <Label>Name your collection</Label>
                <Input
                  name="title"
                  onInput={(e) =>
                    settitle((e.target as HTMLInputElement).value)
                  }
                  placeholder="eg (Daily reports)"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>write a brief overview of this collection</Label>
                <Input
                  name="description"
                  onInput={(e) =>
                    setdescription((e.target as HTMLInputElement).value)
                  }
                  placeholder="what is this collection is about?"
                />
              </div>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                Create a collection
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {collections && collections.length > 0 ? (
        <div className="grid grid-cols-3 gap-x-4 w-full grid-flow-row">
          {collections.map((collection, key) => (
            <Link
              href={"/collections/reports"}
              key={key}
              className="w-full mx-auto border bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-800 capitalize">
                  {collection.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {collection.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <button className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-200 ease-in-out">
                    Browse collection
                  </button>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 rounded-md">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button className=" bg-black bg-opacity-50 border text-white p-2 rounded-full cursor-pointer hover:bg-opacity-70 hover:bg-red-500 transition">
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col mt-24 items-center">
          <Book size={40} />
          <h1 className="text-lg font-medium text-gray-700">
            You don&apos;t have any collections yet
          </h1>
          <p className="text-base font-sans text-zinc-500">
            <span className="text-teal-500 underline underline-offset-2 cursor-pointer">
              click here
            </span>{" "}
            to create one!
          </p>
        </div>
      )}
    </div>
  );
}

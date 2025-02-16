import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { nextAuthOptions } from "./lib/next-auth/options";
import { Purchase, User } from "./types/types";

export default async function Home() {
  const { contents: allBooks } = await getAllBooks();

  const session = await getServerSession(nextAuthOptions);
  const user: User = session?.user as User;

  let purchaseBookIds: string[] = [];

  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
    );
    const purchasesData = await response.json();

    purchaseBookIds = purchasesData.map(
      (purchaseBook: Purchase) => purchaseBook.bookId,
    );
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {allBooks.map((book) => (
          <Book
            key={book.id}
            book={book}
            isPurchased={purchaseBookIds.includes(book.id)}
          />
        ))}
      </main>
    </>
  );
}

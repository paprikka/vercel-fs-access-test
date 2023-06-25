"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { ChangeEventHandler, useReducer, useRef, useState } from "react";
import useSWR from "swr";
import { CommunityEntry } from "./data/types";

const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T => {
  let timer: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as any;
};

const fetcher = (query: string) => {
  const params = new URLSearchParams({ query });
  return fetch("/api/search?" + params).then(
    (_) => _.json() as Promise<CommunityEntry[]>
  );
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const { data, error, isLoading } = useSWR(search, fetcher);

  const debouncedSetSearch = useRef(debounce(setSearch, 0));

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchInputValue(e.target.value);
    debouncedSetSearch.current(e.target.value);
  };

  return (
    <main className={styles.main}>
      <header>
        <input
          type="search"
          value={searchInputValue}
          onChange={handleInputChange}
        />
      </header>
      {isLoading && <div>Loading...</div>}
      {data ? (
        <ul>
          {data.map((entry) => {
            return (
              <li key={entry.id}>
                <strong>
                  {" "}
                  <a href={`https://${entry.instanceDomain}/c/${entry.name}`}>
                    {entry.name}
                  </a>
                </strong>
                <details>
                  <summary>Description</summary>
                  <p>{entry.description}</p>
                </details>
                <br />
              </li>
            );
          })}
        </ul>
      ) : null}
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [mainList, setMainList] = useState<{ type: string; name: string }[]>(
    []
  );
  const [fruitList, setFruitList] = useState<string[]>([]);
  const [vegetableList, setVegetableList] = useState<string[]>([]);
  const [itemTimeouts, setItemTimeouts] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => setMainList(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const moveItem = (item: { type: string; name: string }) => {
    if (itemTimeouts[item.name]) {
      clearTimeout(itemTimeouts[item.name]);
    }

    if (fruitList.includes(item.name) || vegetableList.includes(item.name)) {
      setMainList((prevMainList) => [...prevMainList, item]);
      setFruitList((prevFruitList) =>
        prevFruitList.filter((i) => i !== item.name)
      );
      setVegetableList((prevVegetableList) =>
        prevVegetableList.filter((i) => i !== item.name)
      );
      return;
    }

    if (item.type === "Fruit") {
      updateList(fruitList, setFruitList, item);
    } else if (item.type === "Vegetable") {
      updateList(vegetableList, setVegetableList, item);
    }
  };

  const updateList = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: { type: string; name: string }
  ) => {
    setList((prevList) => [...prevList, item.name]);
    setMainList((prevMainList) => prevMainList.filter((i) => i !== item));
    const timeoutId = setTimeout(() => {
      setList((prevList) => prevList.filter((i) => i !== item.name));
      setMainList((prevMainList) => [...prevMainList, item]);
    }, 5000) as unknown as number;
    setItemTimeouts((prevItemTimeouts) => ({
      ...prevItemTimeouts,
      [item.name]: timeoutId,
    }));
  };

  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <div className="flex border-4 gap-40 p-24">
        <ul className="text-center border-2 p-5 w-60">
          <h2>Main List</h2>
          {mainList.map((item, index) => (
            <li className="p-1" key={index}>
              <button className="border-2 p-4" onClick={() => moveItem(item)}>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
        <ul className="text-center border-2 p-5 w-60">
          <h2>Fruit</h2>
          {fruitList.map((item, index) => (
            <li className="p-1" key={index}>
              <button
                className="border-2 p-4"
                onClick={() => moveItem({ type: "Fruit", name: item })}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
        <ul className="text-center border-2 p-5 w-60">
          <h2>Vegetable</h2>
          {vegetableList.map((item, index) => (
            <li className="p-1" key={index}>
              <button
                className="border-2 p-4"
                onClick={() => moveItem({ type: "Vegetable", name: item })}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

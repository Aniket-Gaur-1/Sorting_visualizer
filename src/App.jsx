import React, { useState, useEffect } from "react";
import "./App.css";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [numOfBars, setNumOfBars] = useState(50);
  const [speedFactor, setSpeedFactor] = useState(100);
  const [algorithm, setAlgorithm] = useState("bubble");
  const heightFactor = 4;

  const randomNum = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const createRandomArray = () => {
    const newArray = [];
    for (let i = 0; i < numOfBars; i++) {
      newArray.push(randomNum(1, numOfBars));
    }
    return newArray;
  };

  useEffect(() => {
    setArray(createRandomArray());
  }, [numOfBars]);

  const handleSliderChange = (e) => {
    setNumOfBars(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeedFactor(parseInt(e.target.value));
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleRandomizeArray = () => {
    setArray(createRandomArray());
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
          bars[j].style.height = array[j] * heightFactor + "px";
          bars[j].style.backgroundColor = "lightgreen";
          bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
          bars[j + 1].style.backgroundColor = "lightgreen";
          await sleep(speedFactor);
        }
      }
      await sleep(speedFactor);
    }
    return array;
  };

  async function swap(items, leftIndex, rightIndex, bars) {
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
    bars[leftIndex].style.height = items[leftIndex] * heightFactor + "px";
    bars[leftIndex].style.backgroundColor = "lightgreen";
    bars[rightIndex].style.height = items[rightIndex] * heightFactor + "px";
    bars[rightIndex].style.backgroundColor = "lightgreen";
    await sleep(speedFactor);
  }

  async function partition(items, left, right) {
    let bars = document.getElementsByClassName("bar");
    let pivotIndex = Math.floor((right + left) / 2);
    var pivot = items[pivotIndex]; //middle element
    bars[pivotIndex].style.backgroundColor = "red";

    for (let i = 0; i < bars.length; i++) {
      if (i !== pivotIndex) {
        bars[i].style.backgroundColor = "aqua";
      }
    }

    let i = left, //left pointer
      j = right; //right pointer
    while (i <= j) {
      while (items[i] < pivot) {
        i++;
      }
      while (items[j] > pivot) {
        j--;
      }
      if (i <= j) {
        await swap(items, i, j, bars); //swapping two elements
        i++;
        j--;
      }
    }
    return i;
  }

  const quickSort = async (items, left, right) => {
    let bars = document.getElementsByClassName("bar");
    if (items.length > 1) {
      let index = await partition(items, left, right);
      if (left < index - 1) {
        await quickSort(items, left, index - 1);
      }
      if (index < right) {
        await quickSort(items, index, right);
      }
    }

    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = "aqua";
    }
    return items;
  };

  const insertionSort = async () => {
    let bars = document.getElementsByClassName("bar");
    for (let i = 1; i < array.length; i++) {
      let key = array[i];
      let j = i - 1;
      while (j >= 0 && array[j] > key) {
        array[j + 1] = array[j];
        bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
        bars[j + 1].style.backgroundColor = "red";
        await sleep(speedFactor);
        for (let k = 0; k < bars.length; k++) {
          if (k !== j + 1) {
            bars[k].style.backgroundColor = "aqua";
          }
        }
        j = j - 1;
      }
      array[j + 1] = key;
      bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
      bars[j + 1].style.backgroundColor = "lightgreen";
      await sleep(speedFactor);
    }

    for (let k = 0; k < bars.length; k++) {
      bars[k].style.backgroundColor = "aqua";
    }
    return array;
  };

  const heapSort = async () => {
    let bars = document.getElementsByClassName("bar");
    for (let i = Math.floor(array.length / 2); i >= 0; i--) {
      await heapify(array, array.length, i);
    }
    for (let i = array.length - 1; i >= 0; i--) {
      await swap(array, 0, i, bars);
      await heapify(array, i, 0);
    }
    for (let k = 0; k < bars.length; k++) {
      bars[k].style.backgroundColor = "aqua";
      await sleep(speedFactor);
    }
    return array;
  };

  async function heapify(array, n, i) {
    let bars = document.getElementsByClassName("bar");
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    if (left < n && array[left] > array[largest]) {
      largest = left;
    }
    if (right < n && array[right] > array[largest]) {
      largest = right;
    }
    if (largest !== i) {
      await swap(array, i, largest, bars);
      await heapify(array, n, largest);
    }
  }

  const mergeSort = async (arr) => {
    let bars = document.getElementsByClassName("bar");
    if (arr.length < 2) {
      return arr;
    }
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
    await mergeSort(left);
    await mergeSort(right);

    let i = 0;
    let j = 0;
    let k = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      bars[k].style.height = arr[k] * heightFactor + "px";
      bars[k].style.backgroundColor = "lightgreen";
      await sleep(speedFactor);
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      bars[k].style.height = arr[k] * heightFactor + "px";
      bars[k].style.backgroundColor = "lightgreen";
      await sleep(speedFactor);
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      bars[k].style.height = arr[k] * heightFactor + "px";
      bars[k].style.backgroundColor = "lightgreen";
      await sleep(speedFactor);
      j++;
      k++;
    }

    for (let k = 0; k < bars.length; k++) {
      bars[k].style.backgroundColor = "aqua";
    }

    return arr;
  };

  const handleSort = () => {
    switch (algorithm) {
      case "bubble":
        bubbleSort();
        break;
      case "quick":
        quickSort([...array], 0, array.length - 1);
        break;
      case "insertion":
        insertionSort();
        break;
      case "heap":
        heapSort();
        break;
      case "merge":
        mergeSort([...array]);
        break;
      default:
        bubbleSort();
        break;
    }
  };

  return (
    <div className="container">
      <div className="bars_container">
        {array.map((value, index) => (
          <div
            key={index}
            className="bar"
            style={{ height: `${value * heightFactor}px` }}
          />
        ))}
      </div>

      <div className="buttons_container">
        <input
          type="range"
          min="50"
          max="150"
          step="5"
          value={numOfBars}
          onChange={handleSliderChange}
        />

        <select value={speedFactor} onChange={handleSpeedChange}>
          <option value="100">Slow</option>
          <option value="50">Medium</option>
          <option value="10">Fast</option>
        </select>

        <select value={algorithm} onChange={handleAlgorithmChange}>
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="heap">Heap Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
        </select>

        <button onClick={handleRandomizeArray}>Randomize Array</button>
        <button onClick={handleSort}>Sort</button>
      </div>
    </div>
  );
};

export default SortingVisualizer;

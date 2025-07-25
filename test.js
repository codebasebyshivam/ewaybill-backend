console.time('benchmark');

const iterations = 1e7; // 10 million
const sampleNumber = 123;
const sampleBool = true;
const sampleNull = null;
const sampleArray = [1, 2, 3];
const sampleObj = { name: 'Shivam', id: 101 };

// Track memory usage
const before = process.memoryUsage().heapUsed;

const stringMethods = {
  stringFn: () => String(sampleNumber),
  toStringFn: () => sampleNumber.toString(),
  concatFn: () => sampleNumber + '',
  templateFn: () => `${sampleNumber}`,
  jsonFn: () => JSON.stringify(sampleNumber),
};

for (const method in stringMethods) {
  console.time(method);
  for (let i = 0; i < iterations; i++) {
    stringMethods[method]();
  }
  console.timeEnd(method);
}

const after = process.memoryUsage().heapUsed;
console.log(`Memory Used: ${(after - before) / 1024 / 1024} MB`);

console.timeEnd('benchmark');

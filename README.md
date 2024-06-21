1. Clone this repository into the folder
2. Open Terminal and navigate to the folder where the src folder is located e.g - C:\PATH\TO\Backend-main\Backend-main
```
cd C:\PATH\TO\Backend-main\Backend-main
```
3. Run the below three lines of code only when using for the first time.
```
npm init -y
npm install express
npm install typescript ts-node @types/node @types/express
```
4. Next we need to run the below lines of code everytime including the first time.
```
npx tsc --init
npx tsc
node src/app.js
```

The server will start running at http://localhost:3000.

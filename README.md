# Northwind

This is a simple CRUD application for managing the Employees in a standard Northwind database.

The application interfaces with a [REST service hosted via Express in Node.js](https://github.com/bhaeussermann/northwind-api).

It connects to where the API is hosted [here](https://northwind-express-api.herokuapp.com/swagger/) by default, but this can be changed 
in `package.json` by setting the `proxy` property value.

## Project setup
```
yarn install
```

### Compile and hot-reload for development
```
yarn start
```
This will serve the application from `http://localhost:3000/`. The app will automatically reload when you change any of the source files.

### Build
```
yarn build
```
The build artifacts will be stored in the `build/` directory. 

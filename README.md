# Northwind

This is a simple CRUD application for managing the Employees in a standard Northwind database.

The application interfaces with a REST service that is hosted by an application deployed in [Linx](https://linx.software/) (see REST service/Deployment section below).

## React app

### Development server

Change to the `web` folder and run `yarn start` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

### Build

Change to the `web` folder and run `yarn build` to build the project. The build artifacts will be stored in the `build/` directory. 

## REST service

### Deployment

You need a server that has SQL Server installed with a Northwind database.  
To deploy the REST service, install [Linx](https://linx.software/), and deploy the Linx solution file `service/Northwind.lsoz` onto your Linx Server.  
Set the address to your server in the `web/package.json` file.

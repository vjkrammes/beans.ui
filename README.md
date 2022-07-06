# ![VJK Solutions](https://vjk.solutions/images/logo-64.png) Beans Demonstration App ![Beans Logo](https://vjk.solutions/images/beanslogo-64.png)

The **Beans** demonstration application is a game which emulates
a commodities market. Players can buy, sell and trade various
colored beans amongst themselves or to / from the Exchange. It consists
of the following parts:

1. A back end API written in C# using ASP.Net Core.
2. The web front end, written using React and TypeScript.
3. An Azure function (serverless application) that runs once a day to adjust the bean prices.

Both web sites are hosted on Microsoft Azure. The code repositories are hosted on [GitHub](https://github.com) (see below for links to the individual repositories, or click [here](https://github.com/vjkrammes) to see them all), and CI/CD is handled by Microsoft Azure DevOps.

## The API

Repository [here](https://github.com/vjkrammes/Beans)

The API is the back end for the front end web site. It is written in C# version 10 using ASP.Net Core / .Net Core version 6. It is architected in a multi-layer approach as shown below:

|Layer Name|Function|Type|
|----------|--------|----|
|Data Access|The repository layer that handles access to the database|Class Library|
|Services|The business logic layer that sits between the API and Data Access Layers|Class Library|
|API|The web-facing API using minimal endpoints|Web API|
|Models|The DTO models shared between the API and Services Layers|Class Library|
|Common|Common classes, Attributes, Enumerations, extension methods, etc|Class Library|

In addition to the above, the API uses [Dapper](https://github.com/DapperLib/Dapper) to access a Microsoft SQL / Azure SQL database.

## The Web Site (This Project)

Repository [here](https://github.com/vjkrammes/beans.ui)

The front end web site is written in **TypeScript** using **React** functional components and hooks, *React version 18* and *React Router version 6.3*. It is responsive down to 375 pixels. Auth0 is used to
authenticate users.

## The Background Function

Repository [here](https://github.com/vjkrammes/Beans.Background)

The Background function is used to automate the adjustment of bean
prices on a daily basis (currently set to run at 3AM). It is written
in C# version 10 using .NET 6.

## External Dependencies

For the API:

1. [AspNetCoreRateLimit](https://github.com/stefanprodan/AspNetCoreRateLimit) Used to rate limit requests
2. [Hashids.net](https://hashids.org/net/) Used to obfuscate Ids sent to end users
3. [Dapper](https://github.com/DapperLib/Dapper) Used to access the database
4. [Json.NET](https://www.json.org/json-en.html) a JSON library for .Net

For the Web Sites, the following NPM packages:

1. *react, react-dom, react-router-dom, react-icons*
2. *@mui/material*, used for alerts
3.  [Syncfusion](https://syncfusion.com) used for Charts, Grids and Notifications badges
4. *@auth0/auth0-react*, used to interact with Auth0
5. *uuid*, used to generate uuids

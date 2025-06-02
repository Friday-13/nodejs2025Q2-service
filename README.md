# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Switch to the current branch

```
cd {repository dir}
git checkout rest-service
```

## Installing NPM modules

```
npm install
```

## Creating .env

Copy `.env.example` and save as `.env`

```
cp .env.example .env
```

## Running application

```
npm start
```

or

```
npm run start:dev
```

After starting the app on port (4000 as default)

- you can open in your browser OpenAPI documentation by typing [http://localhost:4000/api](http://localhost:4000/api).
  For more information about OpenAPI/Swagger please visit [https://swagger.io/](https://swagger.io/).
- you can see default `Hello World!` page on [http://localhost:4000](http://localhost:4000)

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

<!-- To run all test with authorization -->
<!---->
<!-- ``` -->
<!-- npm run test:auth -->
<!-- ``` -->
<!---->
<!-- To run only specific test suite with authorization -->
<!---->
<!-- ``` -->
<!-- npm run test:auth -- <path to suite> -->
<!-- ``` -->

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

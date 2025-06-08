# Home Library Service

## Prerequisite

1. Git - [Download & Install Git](https://git-scm.com/downloads).
2. Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
3. [Docker](https://docs.docker.com/engine/install/)
4. Docker-compose
5. [Docker Scout](https://docs.docker.com/scout/install/)

## Installation

### 1. Clone this repository:

```shell
git clone <src> <dir-name>
```

### 2. Move to the project directory:

```shell
cd <dir-name>
```

### 3. Check out the branch with the containerization task:

```shell
git checkout containerization-database-orm
```

### 4. Istall dependencies:

```shell
npm i
```

### 5. Create the `.env` file (copy the `.env.example` or create manually)

```shell
cp .env.example .env
```

### 6. Run multi-container application

```
docker-compose up --watch
```

### 7. Run the migration:

```shell
docker exec -it <dir-name>-api-1 npx prisma migrate dev --name init
```

If you encounter issues with container naming, you can find the exact container name with:

```shell
docker container ls
```

Look for the container associated with the `api` image.

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

### Scan the image for security vulnerabilities

```shell
npm run docker:scan
```


### Auto-fix and format

```
npm run lint
```

```
npm run format
```

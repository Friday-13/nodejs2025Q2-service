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
git checkout logging-error-handling-auth
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

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

To run refresh tests with authorization

```
npm run test:refresh
```

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

## Configs

### Environment Variables for Logging

| Variable                 | Type   | Values / Format               | Description                                                                                                                                                                 |
| ------------------------ | ------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LOG_MODE`               | string | `console` \| `file` \| `both` | Logging mode: to console only, to file only, or both.                                                                                                                       |
| `LOG_LEVEL`              | number | `0`–`5`                       | Logging level (by priority):<br>0 = Fatal, 1 = Error, 2 = Warn, 3 = Log,  4 = Debug, 5 = Verbose.<br>All levels **equal to or higher in priority** will be logged. |
| `LOG_DIR`                | path   | directory path                | Directory for storing all logs.                                                                                                                                             |
| `ERROR_DIR`              | path   | directory path                | Directory for storing error logs                                                                                                                                            |
| `LOG_FILE_SIZE_KB`       | number | ≥ 5                           | Maximum size of a single log file in kilobytes. Recommended: ≥ 5 KB.                                                                                                        |
| `LOG_FILE_ROTATE_NUMBER` | number | ≥ 1                           | Number of rotated log files to keep. Older files will be deleted.                                                                                                           |

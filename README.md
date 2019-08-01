# EDirectInsure Task

This service is responsible to manage task crud operations

### Patterns

```
role: task, cmd: create
role: task, cmd: select
role: task, cmd: update
role: task, cmd: delete
```

### Installing

```bash
$ npm i
```

### Package Dependency

- [seneca](https://github.com/senecajs/seneca)
- [lodash](https://github.com/lodash/lodash)
- [mongo-client](https://github.com/amorimdev/edirectinsure-mongo-client)

### Environment Variables

```
TASK_HOST # task service host
TASK_PORT # task service port

MONGO_URL # url from mongo server
```

### Tests


```sh
$ npm test
```

Run tests with Node debugger:

```bash
$ npm run test-debugger
```

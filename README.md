# task-manager

## Project setup
This project makes use of Vue.js to create the task manager component. To store the tasks, it uses MySQL to create and maintain a database. Both are connected with an API made with Node.js and the following packages: Express, MySQL, CORS, and Body-parser.

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Open website
```
Open localhost:8080 in browser
```

## Database setup
```
cd database-api
```
### Run server
```
node index.js
```

## Demo
![me](https://github.com/yesman-24/task-manager/blob/main/src/assets/task-manager-demo.gif "Task Manager")

## Description
This is a simple task manager which allows the user to create tasks with given statuses. It can also handle status updates (such as task completion) and task deletion. These functionalities are demonstrated above.

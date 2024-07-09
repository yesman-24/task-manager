<template>
    <div>
        <div class="header">
            <img src="../assets/logo.png" alt="Task Manager Logo" id="app-logo">
            <h1>Task Manager</h1>
        </div>

        <form @submit.prevent="createTask" class="main-form">
            <div>
                <input v-model="newTask" type="text" required class="task-title-entry" name="task" placeholder="Enter a task" autocomplete="off">
            </div>
            <div>
                <input v-model="tempStatus" type="text" required class="task-status-entry" name="status" placeholder="Task status" autocomplete="off">
            </div>
            <button class="btn-create">Create Task</button>
        </form>

        <div class="task-list-container">
            <h2>Your Active Tasks</h2>
            <ul>
                <li v-for="(task,index) in tasks" :key="index" class="task-tile">
                    <p class="task-name">{{ task.title }}</p>
                    <div class="status-container">
                        <div class="status">Status:</div>
                        <div v-if="!task.is_completed" class="status not-completed">{{ task.status }}</div>
                        <div v-if="task.is_completed" class="status is-completed">{{ task.status }}</div>
                    </div>
                    <div class="update-complete-delete-container">
                        <img src="../assets/update.png" title="Update Task Status" alt="Delete Task" id="update-button" @click="openModal(task)">
                        <img src="../assets/delete.png" title="Delete Task" alt="Delete Task" id="delete-button" @click="deleteTask(task)">
                        <button v-if="!task.is_completed" class="btn-complete" @click="completeTask(task)">Task completed</button>
                        <form @submit.prevent="updateTask(task,newStatus)" :id="`update-popup-${task.id}`" class="modal">
                            <div class="modal-content">
                                <div class="close-container">
                                    <p class="close-modal" @click="closeModal(task)">&times;</p>
                                </div>
                                <input v-model="newStatus" type="text" class="status-update" :placeholder="`${task.status}`" required autocomplete="off">
                                <button class="btn-update">Update</button>
                            </div>
                        </form>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    data() {
        return {
            newTask : '',
            tempStatus : '',
            tasks : [],
            newStatus: ''
        }
    },

    mounted() {
        this.fetchTasks();
        this.startPolling();
        console.log(this.tasks)
    },

    beforeUnmount() {
        this.stopPolling();
    },

    methods: {
        fetchTasks() {
        axios.get('http://localhost:3000/tasks')
            .then(response => {
                this.tasks = response.data;
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
        },

        startPolling() {
            this.polling = setInterval(() => {
                this.fetchTasks();
            }, 200); // Fetch tasks every 0.1 seconds (100 milliseconds)
        },

        stopPolling() {
            clearInterval(this.polling);
        },

        createTask() {
            const newTask = {
                title: this.newTask,
                status: this.tempStatus // Assuming you capture status from input
            };

            axios.post('http://localhost:3000/tasks', newTask)
                .then(response => {
                    console.log('Task created successfully:', response.data);
                    // Assuming you update tasks list locally or refresh tasks
                    this.fetchTasks(); // Example: Refresh tasks after creation
                    this.newTask = ''; // Clear input after task creation
                    this.tempStatus = ''; // Clear status input after task creation
                })
                .catch(error => {
                    console.error('Error creating task:', error);
                });
            this.fetchTasks()
        },

        completeTask(task) {
            this.updateTask(task,'Completed')
        },

        updateTask(task,newStatus) {
            axios.put(`http://localhost:3000/tasks/${task.id}`,{status: newStatus})
            .then(response => {
                console.log('Task status updated successfully:', response.data);
            })
            .catch(error => {
                console.error('Error updating status:', error)
            });
            this.fetchTasks()
            this.closeModal(task)
            this.newStatus = ''
        },

        deleteTask(task) {
            axios.delete(`http://localhost:3000/tasks/${task.id}`)
                .then(response => {
                    console.log('Task deleted successfully:', response.data);
                    // Assuming you update tasks list locally or refresh tasks
                })
                .catch(error => {
                    console.error('Error deleting task:', error);
                });
            this.fetchTasks()
        },

        openModal(task) {
            var modal = document.getElementById(`update-popup-${task.id}`)
            modal.style.display = "block";
        },

        closeModal(task) {
            var modal = document.getElementById(`update-popup-${task.id}`)
            modal.style.display = "none";
        }
    }
}
</script>

<style>
    * {
        font-family: 'Segou UI', sans-serif;
        background-color: #f0f8ff;
        cursor: default;
    }

    /* Header Styles */
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: fit-content;
        margin: auto;
        gap: 15px;
    }

    /* Logo Styles */
    #app-logo {
        height: 80px;
        width: 80px;
        margin: 0;
        padding: 0 0;
    }

    /* Form Styles */
    form.main-form {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        box-sizing: border-box;
        gap: 10px;
        padding: 10px 20px;
        height: fit-content;
        width: 100%;
        max-width: 60%;
        margin: auto;
        border-radius: 10px;
        box-shadow: 0 6px 6px -6px black;
        margin-bottom: 20px;
    }

    /* Task Name Entry */
    .task-title-entry, .status-update {
        font-size: large;
        background-color: rgb(231, 231, 231);
        border: 1px solid rgb(231, 231, 231);
        border-radius: 5px;
        box-shadow: 0 6px 5px -6px black;
        max-width: 300px;
        width: 100%;
        padding: 5px 10px;
        cursor: text;
    }

    /* Task Status Entry */
    .task-status-entry {
        font-size: large;
        background-color: rgb(231, 231, 231);
        border: 1px solid rgb(231, 231, 231);
        border-radius: 5px;
        box-shadow: 0 6px 5px -6px black;
        max-width: 150px;
        width: 100%;
        padding: 5px 10px;
        cursor: text;
    }

    /* Create Button */
    .btn-create, .btn-update {
        margin-left: 0;
        color: #fff;
        background-color: rgb(40, 167, 69);
        box-shadow: 0 6px 5px -6px black;
        border: 0;
        border-radius: 5px;
        height: fit-content;
        width: 100%;
        max-width: 140px;
        padding: 5px;
        font-size: large;
        cursor: pointer;
    }

    /* Button Hover and Active States */
    .btn-create:hover, .btn-complete:hover, .btn-update:hover {
        background-color: rgb(30, 118, 50);
        transition: all 200ms ease-in-out;
    }

    .btn-create:active, .btn-complete:active, .btn-update:active {
        background-color: rgb(21, 79, 34);
        transition: all 200ms ease-in-out;
    }

    /* Task List Container */
    .task-list-container {
        flex-shrink: 1;
        justify-content: center;
        flex-direction: column;
        border-radius: 10px;
        background: white;
        box-shadow: 0 6px 6px -6px black;
        padding: 10px 20px;
        height: fit-content;
        width: 90%;
        max-width: 1000px;
        margin: auto;
        font-size: large;
        max-height: 60vh;
        overflow: auto;
    }

    /* Heading Styles */
    h1 {
        font-size: 3rem;
    }

    h2 {
        margin: 10px 0;
        font-size: 2rem;
        text-align: center;
        background-color: white;
    }

    /* List Styles */
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        background-color: rgb(255, 255, 255);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* Task Tile Styles */
    .task-tile {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        background-color: rgb(216, 216, 216);
        height: fit-content;
        width: 100%;
        max-width: 99%;
        margin: 5px 0;
        padding: 5px 15px;
        border-radius: 10px;
        box-shadow: 0 0 3px -1px rgb(0, 0, 0) inset;
    }

    /* Task Name Styles */
    .task-name {
        margin: 0;
        padding: 0;
        background-color: rgb(216, 216, 216);
        width: 100%;
        max-width: 300px;
        overflow-wrap: break-word;
    }

    /* Status Container Styles */
    .status-container {
        background-color: rgb(216, 216, 216);
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        width: 100%;
        max-width: 200px;
        margin: 0;
    }

    /* Status Styles */
    .status {
        margin: 0;
        padding: 0;
        background-color: rgb(216, 216, 216);
    }

    .status.is-completed {
        box-sizing: border-box;
        border-radius: 10px;
        background-color: rgb(52, 216, 52);
        color: white;
    }

    .status.not-completed {
        box-sizing: border-box;
        border-radius: 10px;
        background-color: rgb(237, 157, 104);
        color: white;
    }

    div.status {
        box-sizing: border-box;
        max-width: 60%;
        padding: 5px;
        word-wrap: break-word;
        white-space: normal;
    }

    /* Complete and Delete Form Styles */
    .update-complete-delete-container {
        display: flex;
        justify-content: end;
        align-items: center;
        background-color: rgb(216, 216, 216);
        height: fit-content;
        gap: 10px;
        width: 100%;
        max-width: 250px;
        border-radius: 10px;
        padding: 0 10px;
    }

    /* Complete Button Styles */
    .btn-complete {
        color: #fff;
        background-color: rgb(40, 167, 69);
        border: 0;
        border-radius: 5px;
        height: fit-content;
        width: 100%;
        max-width: 150px;
        padding: 5px 10px;
        font-size: large;
        cursor: pointer;
    }

    /* Delete Button Styles */
    #delete-button, #update-button, .close-modal {
        height: 25px;
        width: 25px;
        margin: 0;
        padding: 5px;
        background-color: rgb(216, 216, 216);
        border-radius: 5px;
        cursor: pointer;
    }

    /* Delete Button Hover State */
    #delete-button:hover, #update-button:hover, .close-modal:hover {
        background-color: rgb(201, 201, 201);
        transition: all 200ms ease-in-out;
    }

    /* Delete Button Active State */
    #delete-button:active, #update-button:active, .close-modal:active {
        background-color: rgb(145, 145, 145);
        transition: all 200ms ease-in-out;
        box-shadow: 0 0 3px -1px rgb(0, 0, 0) inset;
    }

    .modal {
        display: none;
        justify-content: center;
        height: 100%;
        width: 100%;
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.482);
        box-sizing: border-box;
        margin: auto;
        padding-top: 15%;
    }

    .modal-content {
        background-color: #fff;
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        align-items: center;
        box-sizing: border-box;
        gap: 10px;
        padding: 10px 20px;
        height: fit-content;
        width: fit-content;
        max-width: 700px;
        margin: auto;
        border-radius: 10px;
        box-shadow: 0 6px 6px -6px black;
    }

    .close-container {
        display: flex;
        justify-content: end;
        width: 100%;
        height: fit-content;
        margin: 0;
        padding: 0;
        background-color: white;
    }

    .close-modal {
        font-size: x-large;
        margin: 0;
        padding: 0;
        background-color: white;
        text-align: center;
    }
    
</style>
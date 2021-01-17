const db = firebase.firestore();

const taskForm = document.getElementById('taskForm');

const taskContainer = document.getElementById('taskContainer');

let editStatus = false;

let id = '';

const saveTask = (title, description) => 
  db.collection('taks').doc().set({
    title,
    description
  });

const getTasks = () => db.collection('taks').get();

const onGetTasks = (callback) => db.collection('taks').onSnapshot(callback);

const deleteTask = id => db.collection('taks').doc(id).delete();

const getTask = (id) => db.collection('taks').doc(id).get();

const updateTask = (id, updatedTask) => db.collection('taks').doc(id).update(updatedTask);

window.addEventListener('DOMContentLoaded', async (e) => {

  onGetTasks((querySnapshot) => {
      taskContainer.innerHTML = '';
    querySnapshot.forEach(doc => {

    const task = doc.data();
    task.id = doc.id;

    taskContainer.innerHTML += `
    <div class="card card-body mt-3 border-primary">
      <h5>${task.title}</h5>
      <p>${task.description}</p>
      <div>
        <button class="btn btn-primary btnDelete" data-id="${task.id}">Delete</button>
        <button class="btn btn-secundary btnEdit" data-id="${task.id}">Edit</button>
      </div>
    </div>`;

    const btnDelete = document.querySelectorAll('.btnDelete');

    btnDelete.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        console.log(e.target.dataset.id);
        await deleteTask(e.target.dataset.id);
      });
    });
    
    const btnEdit = document.querySelectorAll('.btnEdit');
    btnEdit.forEach(btn => {
      btn.addEventListener('click', async e => {
        const doc = await getTask(e.target.dataset.id);
        const task = doc.data();

        editStatus = true;
        id = doc.id;

        taskForm['btnTaskForm'].innerText = 'Update';
        taskForm['taskTitle'].value = task.title;
        taskForm['taskDescription'].value = task.description;

      });
    });

    });
  });
});

  

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = taskForm['taskTitle'];
  const description = taskForm['taskDescription'];

  if(!editStatus){
    await saveTask(title.value, description.value);
  }
  else{
    await updateTask(id,{
      title: title.value,
      description: description.value
    });

    editStatus = false;
    taskForm['btnTaskForm'].innerText = 'Save';
  }

  


  taskForm.reset();

  title.focus();

});
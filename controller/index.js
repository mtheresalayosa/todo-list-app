import * as listController from '../api/index.js';

const router = (app, controller = listController) =>{
    app.get('/tasks', controller.viewList);
    app.post('/tasks', controller.createList);
    app.put('/tasks', controller.updateList);
    app.delete('/tasks', controller.deleteList);
}

export default router;
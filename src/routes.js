import { Router } from 'express';
import UserController from './app/controllers/UserController';
const jwt = require("jsonwebtoken");
const JWTSecret = "crudParaTreinamento";

const routes = new Router();

routes.get('/users', auth, UserController.index);
routes.get('/users/:id', auth, UserController.getUser);
routes.post('/users', auth, UserController.store);
routes.patch('/users/:id', auth, UserController.update);
routes.delete('/users/:id', auth, UserController.delete);
routes.post('/users/auth', UserController.auth);


function auth(req, res, next){
    const authToken = req.headers['authorization'];

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        var token = bearer[1];

        jwt.verify(token,JWTSecret,(err, data) => {
            if(err){
                res.status(401);
                res.json({err:"Token inválido!"});
            }else{

                req.token = token;
                req.loggedUser = {id: data.id,email: data.email};            
                next();
            }
        });
    }else{
        res.status(401);
        res.json({err:"Token inválido!"});
    } 
}

export default routes;


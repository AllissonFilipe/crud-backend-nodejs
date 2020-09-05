import * as Yup from 'yup';
import User from '../models/User';
const jwt = require("jsonwebtoken");
const JWTSecret = "crudParaTreinamento";

class UserController {

    async index(req, res) {
        const users = await User.findAll();
        return res.json(users);
    }

    async getUser(req, res) {
        const user = await User.findByPk(req.params.id);
        return res.json(user);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            cpf: Yup.string().required(),
            phone: Yup.string().required(),
            birth_date: Yup.date().required(),
        });

        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const userExists = await User.findOne({ where: { email: req.body.email } });

        if(userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const { id, name, email, cpf, phone, birth_date} = await User.create(req.body);
        return res.json({ id, name, email, cpf, phone, birth_date});
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            cpf: Yup.string().required(),
            phone: Yup.string().required(),
            birth_date: Yup.date().required(),
        });

        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email } = req.body;

        const user = await User.findByPk(req.params.id);

        if(email != user.email) {
            const userExists = await User.findOne({ where: { email } });

            if(userExists) {
                return res.status(400).json({ error: 'User already exists.' });
            }
        }

        const { id, name } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
        });
    }

    async delete(req, res) {
        User.destroy({ where: { 'id': req.params.id}}).then(() => {
            return res.json({ message: 'Registro excluído com sucesso'});
        }).catch((erro) => {
            return res.json(erro);
        });
    }

    async auth(req, res) {
        var {email, password} = req.body;

        if(email != undefined){

            // var user = DB.users.find(u => u.email == email);
            const user = await User.findOne({ where: { email: email } });
            if(user != undefined){
                if(user.password_hash == password){
                    jwt.sign({id: user.id, email: user.email},JWTSecret,{expiresIn:'48h'},(err, token) => {
                        if(err){
                            res.status(400);
                            res.json({err:"Falha interna"});
                        }else{
                            res.status(200);
                            res.json({access_token: token});
                        }
                    })
                }else{
                    res.status(401);
                    res.json({err: "Credenciais inválidas!"});
                }
            }else{
                res.status(404);
                res.json({err: "O E-mail enviado não existe na base de dados!"});
            }

        }else{
            res.status(400);
            res.send({err: "O E-mail enviado é inválido"});
        }
    }
}

export default new UserController();
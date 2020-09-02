import * as Yup from 'yup';
import User from '../models/User';

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
}

export default new UserController();
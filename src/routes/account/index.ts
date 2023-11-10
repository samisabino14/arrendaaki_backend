import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";
import { hash } from 'bcryptjs';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { isAuth } from "../../middlewares/isAuth";


const accountRoutes = Router();

accountRoutes.get('/me', isAuth, async (req, res) => {
    const pkAccount = req.account_id;

    const account = await prismaClient.account.findFirst({

        where: {
            pkAccount,
        }
    })

    return res.status(200).json(account);
});

accountRoutes.get('/accounts', async (req, res) => {

    const response = await prismaClient.account.findMany({
        include: {
            Person: true,
            AccountTypeOfAccount: true
        }
    });

    return res.status(200).json(response);
});

accountRoutes.get('/accounts/:email', async (req, res) => {

    const emailProvinceSchema = z.object({
        email: string()
    })

    const { email } = emailProvinceSchema.parse(req.params)

    const response = await prismaClient.account.findFirst({
        where: { email },
        include: {
            Person: true,
            AccountTypeOfAccount: true
        }
    });

    return res.status(200).json(response);
})

accountRoutes.post('/session', async (req, res) => {

    const createprovinceSchema = z.object({
        email: string(),
        password: string(),
    })

    const {
        email,
        password,
    } = createprovinceSchema.parse(req.body)

    const account = await prismaClient.account.findFirst({
        where: { email },
        include: {
            AccountTypeOfAccount: {
                include: {
                    TypeOfAccount: true
                }
            }
        }
    });

    if (!account) {
        throw new Error("Email ou não encontrado!");
    }

    const passwordMatch = await compare(password, account.password);

    if (!passwordMatch) {
        throw new Error("Palavra-passe incorreta!");
    }

    const accountTypeOfAccount = account.AccountTypeOfAccount

    const token = sign({

        pkAccount: account.pkAccount,
        email: account.email,
        accountTypeOfAccount
    },
        process.env.JWT_SECRET,
        {
            subject: account.pkAccount,
            expiresIn: '1d'
        }
    );


    return res.status(201).json({
        pkAccount: account.pkAccount,
        email: account.email,
        token,
        accountTypeOfAccount
    });


})

accountRoutes.post('/accounts', async (req, res) => {

    const createprovinceSchema = z.object({
        email: string(),
        password: string(),
        fkPerson: string(),
    })

    const {
        email,
        password,
        fkPerson
    } = createprovinceSchema.parse(req.body)

    const personExists = await prismaClient.person.findFirst({
        where: { pkPerson: fkPerson }
    });

    if (!personExists) {
        throw new Error('Person not exists.')
    }

    const accountAlreadyExists = await prismaClient.account.findFirst({
        where: { email }
    });

    if (accountAlreadyExists) {
        throw new Error('account already exists.')
    }

    const passwordHash = await hash(password, 8);

    const account = await prismaClient.account.create({
        data: {
            email,
            password: passwordHash,
            fkPerson
        }
    });

    return res.status(201).json(account);
})

export { accountRoutes }
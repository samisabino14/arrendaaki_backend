import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const accountTypeOfAccountRoutes = Router();

accountTypeOfAccountRoutes.get('/accountTypeOfAccount', async (req, res) => {

    const response = await prismaClient.accountTypeOfAccount.findMany();

    return res.status(200).json(response);
});

accountTypeOfAccountRoutes.get('/accountTypeOfAccount/id', async (req, res) => {

    const idProvinceSchema = z.object({
        fkAccount: string(),
        fkTypeOfAccount: string()
    })

    const { fkAccount, fkTypeOfAccount } = idProvinceSchema.parse(req.query)

    const response = await prismaClient.accountTypeOfAccount.findFirst({
        where: { fkAccount, fkTypeOfAccount },
    });

    return res.status(200).json(response);
})

accountTypeOfAccountRoutes.post('/accountTypeOfAccount', async (req, res) => {

    const createprovinceSchema = z.object({
        fkAccount: string(),
        fkTypeOfAccount: string()
    })

    const { fkAccount, fkTypeOfAccount } = createprovinceSchema.parse(req.body)

    const accountAlreadyExists = await prismaClient.account.findFirst({
        where: { pkAccount: fkAccount }
    });

    if (!accountAlreadyExists) {
        throw new Error('AccountAlreadyExists not exists.')
    }
    const typeOfAccountAlreadyExists = await prismaClient.typeOfAccount.findFirst({
        where: { pkTypeOfAccount: fkTypeOfAccount }
    });

    if (!typeOfAccountAlreadyExists) {
        throw new Error('TypeAccountAlreadyExists not exists.')
    }

    const accountTypeOfAccountAlreadyExists = await prismaClient.accountTypeOfAccount.findFirst({
        where: { fkAccount, fkTypeOfAccount }
    });

    if (accountTypeOfAccountAlreadyExists) {
        throw new Error('TypeOfAccountAlreadyExists already exists.')
    }

    const accountTypeOfAccount = await prismaClient.accountTypeOfAccount.create({
        data: { fkAccount, fkTypeOfAccount }
    });
    
    return res.status(201).json(accountTypeOfAccount);
})

export { accountTypeOfAccountRoutes }
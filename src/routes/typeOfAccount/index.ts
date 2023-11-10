import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const typeOfAccountRoutes = Router();

typeOfAccountRoutes.get('/typeOfAccount', async (req, res) => {

    const response = await prismaClient.typeOfAccount.findMany();

    return res.status(200).json(response);
});

typeOfAccountRoutes.get('/typeOfAccount/:id', async (req, res) => {

    const idProvinceSchema = z.object({
        id: string()
    })

    const { id } = idProvinceSchema.parse(req.params)

    const response = await prismaClient.typeOfAccount.findFirst({
        where: { pkTypeOfAccount: id },
    });

    return res.status(200).json(response);
})

typeOfAccountRoutes.post('/typeOfAccount', async (req, res) => {

    const createprovinceSchema = z.object({
        designation: string()
    })

    const { designation } = createprovinceSchema.parse(req.body)

    const typeOfAccountAlreadyExists = await prismaClient.typeOfAccount.findFirst({
        where: { designation }
    });

    if (typeOfAccountAlreadyExists) {
        throw new Error('TypeOfAccount already exists.')
    }

    const response = await prismaClient.typeOfAccount.create({
        data: { designation }
    });

    return res.status(201).json(response);
})

export { typeOfAccountRoutes }
import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const typeOfContractRoutes = Router();

typeOfContractRoutes.get('/typeOfContracts', async (req, res) => {

    const response = await prismaClient.typeOfContract.findMany({
        include: {
            Contracts: true,
        }
    });

    return res.status(200).json(response);
});

typeOfContractRoutes.get('/typeOfContracts/:id', async (req, res) => {

    const idtypeOfContractSchema = z.object({
        id: string()
    })

    const { id } = idtypeOfContractSchema.parse(req.params)

    const response = await prismaClient.typeOfContract.findFirst({
        where: { pkTypeOfContract: id },
        include: {
            Contracts: true,
        }
    });

    return res.status(200).json(response);
})

typeOfContractRoutes.post('/typeOfContracts', async (req, res) => {

    const createtypeOfContractSchema = z.object({
        designation: string()
    })

    const { designation } = createtypeOfContractSchema.parse(req.body)

    const typeOfContractAlreadyExists = await prismaClient.typeOfContract.findFirst({
        where: { designation }
    });

    if (typeOfContractAlreadyExists) {
        throw new Error('TypeOfContract already exists.')
    }

    const response = await prismaClient.typeOfContract.create({
        data: { designation }
    });

    return res.status(201).json(response);
})

export { typeOfContractRoutes }
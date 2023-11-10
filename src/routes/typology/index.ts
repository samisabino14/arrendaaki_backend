import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const typologyRoutes = Router();

typologyRoutes.get('/typologies', async (req, res) => {

    const response = await prismaClient.typology.findMany({
        orderBy: {
            designation: 'asc'
        },
        include: {
            Residences: true
        }
    });

    return res.status(200).json(response);
});

typologyRoutes.get('/typologies/:id', async (req, res) => {

    const idTypologySchema = z.object({
        id: string()
    })

    const { id } = idTypologySchema.parse(req.params)

    const response = await prismaClient.typology.findFirst({
        where: { pkTypology: id },
        include: {
            Residences: true
        }
    });

    return res.status(200).json(response);
})

typologyRoutes.post('/typologies', async (req, res) => {

    const createTypologySchema = z.object({
        designation: string()
    })

    const { designation } = createTypologySchema.parse(req.body)

    const typologyAlreadyExists = await prismaClient.typology.findFirst({
        where: { designation }
    });

    if (typologyAlreadyExists) {
        throw new Error('Typology already exists.')
    }

    const response = await prismaClient.typology.create({
        data: { designation }
    });

    return res.status(201).json(response);
})

export { typologyRoutes }
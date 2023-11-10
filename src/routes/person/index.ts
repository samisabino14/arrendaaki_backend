import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const personRoutes = Router();

personRoutes.get('/persons', async (req, res) => {

    const response = await prismaClient.person.findMany();

    return res.status(200).json(response);
});

personRoutes.get('/persons/:id', async (req, res) => {

    const idpersonSchema = z.object({
        id: string()
    })

    const { id } = idpersonSchema.parse(req.params)

    const response = await prismaClient.person.findFirst({
        where: { pkPerson: id },
    });

    return res.status(200).json(response);
})

personRoutes.post('/persons', async (req, res) => {

    const createpersonSchema = z.object({
        fullName: string(),
        identifyCardNumber: string(),
        phoneNumber: string(),
        birthDate: string(),
        fkLocality: string(),
    })

    const {
        fullName,
        identifyCardNumber,
        phoneNumber,
        birthDate,
        fkLocality
    } = createpersonSchema.parse(req.body)

    const localityExists = await prismaClient.locality.findFirst({
        where: { pkLocality: fkLocality }
    });

    if (!localityExists) {
        throw new Error('Locality not exists.')
    }

    const personAlreadyExists = await prismaClient.person.findFirst({
        where: { identifyCardNumber }
    });

    if (personAlreadyExists) {
        throw new Error('Person already exists.')
    }

    const response = await prismaClient.person.create({
        data: {
            fullName,
            identifyCardNumber,
            phoneNumber,
            birthDate,
            fkLocality
        }
    });

    return res.status(201).json(response);
})

export { personRoutes }
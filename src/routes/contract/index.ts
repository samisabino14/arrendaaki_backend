import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const contractRoutes = Router();

contractRoutes.get('/contracts', async (req, res) => {

    const response = await prismaClient.contract.findMany({
        include: {
            Account: true,
            Residence: true,
            TypeOfContract: true
        }
    });

    return res.status(200).json(response);
});

contractRoutes.get('/account/contracts', async (req, res) => {

    const fkClientSchema = z.object({
        fkClient: string()
    })

    const { fkClient } = fkClientSchema.parse(req.query)

    const accountExists = await prismaClient.account.findFirst({
        where: { pkAccount: fkClient }
    });

    if (!accountExists) {
        throw new Error('Account not exists.')
    }

    const response = await prismaClient.contract.findMany({
        where: { fkClient },
        include: {
            Account: true,
            Residence: true,
            TypeOfContract: true
        }
    });

    return res.status(200).json(response);
})

contractRoutes.get('/residence/contracts', async (req, res) => {

    const fkResidenceSchema = z.object({
        fkResidence: string()
    })

    const { fkResidence } = fkResidenceSchema.parse(req.query)

    const residenceExists = await prismaClient.residence.findFirst({
        where: { pkResidence: fkResidence }
    });

    if (!residenceExists) {
        throw new Error('Residence not exists.')
    }

    const response = await prismaClient.contract.findMany({
        where: { fkResidence },
        include: {
            Account: true,
            Residence: true,
            TypeOfContract: true
        }
    });

    return res.status(200).json(response);
})

contractRoutes.get('/contracts/:id', async (req, res) => {

    const cdContractSchema = z.object({
        id: string()
    })

    const { id } = cdContractSchema.parse(req.params)

    const response = await prismaClient.contract.findFirst({
        where: { pkContract: id },
        include: {
            Account: true,
            Residence: {
                include: {
                    Photos: true,
                    Typology: true,
                    Locality: true
                }
            },
            TypeOfContract: true
        }
    });

    return res.status(200).json(response);
})

contractRoutes.post('/contracts', async (req, res) => {

    const createContractSchema = z.object({
        fkTypeOfContract: string(),
        fkResidence: string(),
        fkClient: string(),
        startsAt: string(),
    })

    const {
        fkTypeOfContract,
        fkResidence,
        fkClient,
        startsAt,
    } = createContractSchema.parse(req.body)

    const residenceExists = await prismaClient.residence.findFirst({
        where: { pkResidence: fkResidence }
    });

    if (!residenceExists) {
        throw new Error('Residence not exists.')
    }

    const accountExists = await prismaClient.account.findFirst({
        where: { pkAccount: fkClient }
    });

    if (!accountExists) {
        throw new Error('Client not exists.')
    }
    const typeOfContractExists = await prismaClient.typeOfContract.findFirst({
        where: { pkTypeOfContract: fkTypeOfContract }
    });

    if (!typeOfContractExists) {
        throw new Error('TypeOfContract not exists.')
    }

    const start = new Date(startsAt)
    start.setDate(start.getDate() + 1)
    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)

    const contractExists = await prismaClient.contract.findFirst({
        where: {
            fkTypeOfContract,
            fkResidence,
            fkClient,
            startsAt: start,
        }
    });

    if (contractExists) {
        throw new Error('Contract already exists.')
    }

    const endsAt = new Date(startsAt)
    endsAt.setMonth(endsAt.getMonth() + Number(typeOfContractExists.designation))

    const contract = await prismaClient.contract.create({
        data: {
            fkTypeOfContract,
            fkResidence,
            fkClient,
            startsAt: start,
            endsAt
        }
    });

    return res.status(201).json(contract);
})

export { contractRoutes }
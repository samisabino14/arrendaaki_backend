import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const residenceRoutes = Router();

residenceRoutes.get('/residences', async (req, res) => {

    const response = await prismaClient.residence.findMany({
        include: {
            Photos: true,
            Contracts: true,
            Locality: {
                include: {
                    District: {
                        include: {
                            County: {
                                include: {
                                    Province: true
                                }
                            }
                        }
                    }
                }
            },
            Owner: true,
            Typology: true
        }
    });

    return res.status(200).json(response);
});

residenceRoutes.get('/owner/residences', async (req, res) => {

    const fkOwnerSchema = z.object({
        fkOwner: string()
    })

    const { fkOwner } = fkOwnerSchema.parse(req.query)

    const ownerExists = await prismaClient.person.findFirst({
        where: { pkPerson: fkOwner }
    });

    if (!ownerExists) {
        throw new Error('Owner not exists.')
    }

    const response = await prismaClient.residence.findMany({
        where: { fkOwner },
        include: {
            Photos: true,
            Contracts: true,
            Locality: true,
            Owner: true,
            Typology: true,
        }
    });

    return res.status(200).json(response);
})

residenceRoutes.get('/residences/:id', async (req, res) => {

    const idResidenceSchema = z.object({
        id: string()
    })

    const { id } = idResidenceSchema.parse(req.params)

    const response = await prismaClient.residence.findFirst({
        where: { pkResidence: id },
        include: {
            Photos: true,
            Contracts: true,
            Locality: {
                include: {
                    District: {
                        include: {
                            County: {
                                include: {
                                    Province: true
                                }
                            }
                        }
                    }
                }
            },
            Owner: true,
            Typology: true
        }
    });

    return res.status(200).json(response);
})

residenceRoutes.post('/residences', async (req, res) => {

    const createResidenceSchema = z.object({
        address: string(),
        iban: string(),
        pricePerMonth: string(),
        fkOwner: string(),
        fkLocality: string(),
        fkTypology: string(),
    })

    const {
        address,
        iban,
        pricePerMonth,
        fkOwner,
        fkLocality,
        fkTypology
    } = createResidenceSchema.parse(req.body)

    const personExists = await prismaClient.person.findFirst({
        where: { pkPerson: fkOwner },
        include: {
            Account: {
                include: {
                    AccountTypeOfAccount: {
                        include: {
                            TypeOfAccount: true
                        }
                    }
                }
            }
        }
    });

    if (!personExists) {
        throw new Error('Person not exists.')
    }

    const typeOfAccount = personExists.Account.AccountTypeOfAccount
        .filter(typeOfAccounts => typeOfAccounts.TypeOfAccount.designation.toLowerCase() === 'proprietario')

    const isOwner = typeOfAccount[0].TypeOfAccount.designation.toLowerCase() === 'proprietario';

    if (!isOwner) {
        throw new Error('You need be owner.');
    }

    const localityExists = await prismaClient.locality.findFirst({
        where: { pkLocality: fkLocality }
    });

    if (!localityExists) {
        throw new Error('Locality not exists.')
    }

    const typologyExists = await prismaClient.typology.findFirst({
        where: { pkTypology: fkTypology }
    });

    if (!typologyExists) {
        throw new Error('Typology not exists.')
    }

    const residenceExists = await prismaClient.residence.findFirst({
        where: {
            address,
            iban,
            pricePerMonth,
            fkOwner,
            fkLocality,
            fkTypology,
        }
    });

    if (residenceExists) {
        throw new Error('Residence not exists.')
    }

    const response = await prismaClient.residence.create({
        data: {
            address,
            iban,
            pricePerMonth,
            fkOwner,
            fkLocality,
            fkTypology
        }
    });

    return res.status(201).json(response);
})

export { residenceRoutes }
import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const localityRoutes = Router();

localityRoutes.get('/localitys', async (req, res) => {

    const response = await prismaClient.locality.findMany({
        include: {
            Persons: true,
            Residences: true,
        }
    });

    return res.status(200).json(response);
});

localityRoutes.get('/district/localitys', async (req, res) => {

    const fkDistrictSchema = z.object({
        fkDistrict: string()
    })

    const { fkDistrict } = fkDistrictSchema.parse(req.query)

    const districtExists = await prismaClient.district.findFirst({
        where: { pkDistrict: fkDistrict }
    });

    if (!districtExists) {
        throw new Error('District not exists.')
    }

    const response = await prismaClient.locality.findMany({
        where: { fkDistrict },
        include: {
            Persons: true,
            Residences: true,
        }
    });

    return res.status(200).json(response);
})

localityRoutes.get('/localitys/:id', async (req, res) => {

    const idlocalitySchema = z.object({
        id: string()
    })

    const { id } = idlocalitySchema.parse(req.params)

    const response = await prismaClient.locality.findFirst({
        where: { pkLocality: id },
        include: {
            Persons: true,
            Residences: true,
        }
    });

    return res.status(200).json(response);
})

localityRoutes.post('/localitys', async (req, res) => {

    const createlocalitySchema = z.object({
        neighborhood: string(),
        road: string(),
        houseNumber: string(),
        fkDistrict: string(),
    })

    const { neighborhood, road, houseNumber, fkDistrict } = createlocalitySchema.parse(req.body)

    const districtExists = await prismaClient.district.findFirst({
        where: { pkDistrict: fkDistrict }
    });

    if (!districtExists) {
        throw new Error('District not exists.')
    }

    const locality = await prismaClient.locality.create({
        data: {
            neighborhood,
            road,
            houseNumber,
            fkDistrict
        }
    });

    return res.status(201).json(locality);
})

export { localityRoutes }
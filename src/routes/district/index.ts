import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const districtRoutes = Router();

districtRoutes.get('/districts', async (req, res) => {

    const response = await prismaClient.district.findMany({
        include: {
            Localities: true,
        }
    });

    return res.status(200).json(response);
});

districtRoutes.get('/county/districts', async (req, res) => {

    const fkCountyDistrictSchema = z.object({
        fkCounty: string()
    })

    const { fkCounty } = fkCountyDistrictSchema.parse(req.query)

    const countyExists = await prismaClient.county.findFirst({
        where: { pkCounty: fkCounty }
    });

    if (!countyExists) {
        throw new Error('County not exists.')
    }
    
    const response = await prismaClient.district.findMany({
        where: { fkCounty },
        include: {
            Localities: true,
        }
    });

    return res.status(200).json(response);
})

districtRoutes.get('/districts/:id', async (req, res) => {

    const idDistrictSchema = z.object({
        id: string()
    })

    const { id } = idDistrictSchema.parse(req.params)

    const response = await prismaClient.district.findFirst({
        where: { pkDistrict: id },
        include: {
            Localities: true,
        }
    });

    return res.status(200).json(response);
})

districtRoutes.post('/districts', async (req, res) => {

    const createDistrictSchema = z.object({
        designation: string(),
        fkCounty: string(),
    })

    const { designation, fkCounty } = createDistrictSchema.parse(req.body)

    const countyExists = await prismaClient.county.findFirst({
        where: { pkCounty: fkCounty }
    });

    if (!countyExists) {
        throw new Error('County not exists.')
    }

    const districtAlreadyExists = await prismaClient.district.findFirst({
        where: { designation }
    });

    if (districtAlreadyExists) {
        throw new Error('district already exists.')
    }

    await prismaClient.district.create({
        data: {
            designation,
            fkCounty
        }
    });

    return res.status(201).json();
})

export { districtRoutes }
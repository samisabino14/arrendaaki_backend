import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const countyRoutes = Router();

countyRoutes.get('/countys', async (req, res) => {

    const response = await prismaClient.county.findMany({
        include: {
            Districts: true,
        }
    });

    return res.status(200).json(response);
});

countyRoutes.get('/province/countys', async (req, res) => {

    const fkProvinceCountySchema = z.object({
        fkProvince: string()
    })
    
    const { fkProvince } = fkProvinceCountySchema.parse(req.query)

    const provinceExists = await prismaClient.province.findFirst({
        where: { pkProvince: fkProvince }
    });

    if (!provinceExists) {
        throw new Error('Province not exists.')
    }

    const response = await prismaClient.county.findMany({
        where: { fkProvince },
        include: {
            Districts: true,
        }
    });

    return res.status(200).json(response);
})

countyRoutes.get('/countys/:id', async (req, res) => {

    const idcountySchema = z.object({
        id: string()
    })

    const { id } = idcountySchema.parse(req.params)

    const response = await prismaClient.county.findFirst({
        where: { pkCounty: id },
        include: {
            Districts: true
        }
    });

    return res.status(200).json(response);
})

countyRoutes.post('/countys', async (req, res) => {

    const createcountySchema = z.object({
        designation: string(),
        fkProvince: string(),
    })

    const { designation, fkProvince } = createcountySchema.parse(req.body)

    const provinceExists = await prismaClient.province.findFirst({
        where: { pkProvince: fkProvince }
    });

    if (!provinceExists) {
        throw new Error('Province not exists.')
    }

    const countyAlreadyExists = await prismaClient.county.findFirst({
        where: { designation }
    });

    if (countyAlreadyExists) {
        throw new Error('County already exists.')
    }

    const response = await prismaClient.county.create({
        data: {
            designation,
            fkProvince
        }
    });

    return res.status(201).json(response);
})

export { countyRoutes }
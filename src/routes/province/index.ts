import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

const provinceRoutes = Router();

provinceRoutes.get('/provinces', async (req, res) => {

    const response = await prismaClient.province.findMany({
        include: {
            Countys: true,
        }
    });

    return res.status(200).json(response);
});

provinceRoutes.get('/provinces/:id', async (req, res) => {

    const idProvinceSchema = z.object({
        id: string()
    })

    const { id } = idProvinceSchema.parse(req.params)

    const response = await prismaClient.province.findFirst({
        where: { pkProvince: id },
        include: {
            Countys: true
        }
    });

    return res.status(200).json(response);
})

provinceRoutes.post('/provinces', async (req, res) => {

    const createprovinceSchema = z.object({
        designation: string()
    })

    const { designation } = createprovinceSchema.parse(req.body)
    
    const provinceAlreadyExists = await prismaClient.province.findFirst({
        where: { designation }
    });

    if (provinceAlreadyExists) {
        throw new Error('Province already exists.')
    }

    await prismaClient.province.create({
        data: { designation }
    });

    return res.status(201).json();
})

export { provinceRoutes }
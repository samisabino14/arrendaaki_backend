import { Router } from "express";
import prismaClient from "../../prisma";
import { z, string } from "zod";

import multer from "multer";
import uploadConfig from "../../config/multer";

const photoRoutes = Router();

const upload = multer(uploadConfig.upload("./tmp"));


photoRoutes.get('/photos', async (req, res) => {

    const response = await prismaClient.photo.findMany();

    return res.status(200).json(response);
});

photoRoutes.get('/photos/:id', async (req, res) => {

    const idPhotoSchema = z.object({
        id: string()
    })

    const { id } = idPhotoSchema.parse(req.params)

    const response = await prismaClient.photo.findFirst({
        where: { pkPhoto: id },
        include: {
            Residence: true
        }
    });

    return res.status(200).json(response);
})

photoRoutes.post('/photos', upload.single('file'), async (req, res) => {

    const createPhotoSchema = z.object({
        fkResidence: string()
    })

    if (!req?.file) {

        throw new Error("Erro ao carregar o ficheiro.");

    } else {

        const { filename: image } = req.file;
        
        const { fkResidence } = createPhotoSchema.parse(req.body)

        const response = await prismaClient.photo.create({
            data: {
                designation: image,
                fkResidence
            }
        });

        return res.status(201).json(response);
    }
})

export { photoRoutes }